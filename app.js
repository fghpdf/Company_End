var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var favicon = require('serve-favicon');

var logger = require('morgan');
//登陆模块涉及包
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var routes = require('./routes/index');
var users = require('./routes/users');
var adminManage = require('./routes/adminManage');

var model = require('./database/model');

var app = express();


/*本地登录验证，passport提供的方法
* passport默认username和userpassword
* 所以需要Field更改成自己使用的字段
* 不过passport依然在function中使用username和userpassword
* 就当是username = companyEmail
*      userpassword = companyPassword
* */
passport.use(new LocalStrategy({
  usernameField: 'companyEmail',
  passwordField: 'companyPassword'
},
    function (username, password, done) {
      console.log(username, password);
      new model.Admin({
        companyEmail: username
      }).fetch().then(function(data){
        var admin = data;
        if (admin === null) {
          return done(null, false, {message: '此账号不存在'});
        } else {
          admin = data.toJSON();
          if (!bcrypt.compareSync(password, admin.companyPassword)) {
            return done(null, false, {message: '密码错误'});
          } else {
            return done(null ,admin);
          }
        }
      })
    }));

passport.serializeUser(function(user, done){
  done(null, user.companyEmail);
});

passport.deserializeUser(function(username, done) {
  new model.Admin({companyEmail: username}).fetch().then(function(user) {
    done(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'keyboard'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/adminManage', adminManage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
