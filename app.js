var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('express-flash');
var bcrypt = require('bcrypt-nodejs');
var path = require('path');
var favicon = require('serve-favicon');

//日志模块涉及包
var logger = require('morgan');
var log4js = require('log4js');
//登陆模块涉及包
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//要将路由的文件引入，添加模块时，需要在这引入路由文件，在下面
//有路由方向的控制。添加模块时，必须修改的文件有：
//app.js
//views/
//routes/
//database/model.js
var routes = require('./routes/index');
var users = require('./routes/users');
var adminManage = require('./routes/adminManage');
var commodityManage = require('./routes/commodityManage');
var appManage = require('./routes/appManage');
var hardwareManage = require('./routes/hardwareManage');
var operateManage = require('./routes/operateManage');
var rankManage = require('./routes/rankManage');
var feedBackManage = require('./routes/feedBackManage');

var model = require('./database/model');

var app = express();


/*本地登录验证，passport提供的方法
* passport默认username和userpassword
* 所以需要Field更改成自己使用的字段
* 不过passport依然在function中使用username和userpassword
* 就当是username = adminEmail
*      userpassword = adminPassword
* */
passport.use(new LocalStrategy({
  usernameField: 'adminEmail',
  passwordField: 'adminPassword'
},
    function (username, password, done) {
      console.log(username, password);
      new model.Admin({
        adminEmail: username
      }).fetch().then(function(data){
        var admin = data;
        if (admin === null) {
          return done(null, false, {message: '此账号不存在'});
        } else {
          admin = data.toJSON();
          if (!bcrypt.compareSync(password, admin.adminPassword)) {
            return done(null, false, {message: '密码错误'});
          } else {
            //由于model中设置的admin的表的idAttribute是id，所以先用email找出id，再用id去更新登录时间
            var loginAdminPromise = new model.Admin({ adminEmail: username}).fetch();
            loginAdminPromise.then(function(model_getId) {
              var loginId = model_getId.get('id');
              var date = new Date();
              console.log(date);
              new model.Admin({ id: loginId}).save({adminLoginDate: date}, {patch:true}).then(function() {
                return done(null ,admin);
              })
            })
          }
        }
      })
    }));

passport.serializeUser(function(user, done){
  done(null, { adminName: user.adminName, adminEmail: user.adminEmail});
});

passport.deserializeUser(function(username, done) {
  new model.Admin({adminEmail: username}).fetch().then(function(user) {
    done(null, user);
  });
});

//调整日志输出，采用文件和级别
log4js.configure({
  appenders: [
    { type: 'console'},
    {
      type: 'file',
      filename: 'logs/access.log',
      maxLogSize: 1024,
      backup: 3,
      category: 'normal'
    }
  ]
});
//var logger = log4js.getLogger('normal');
//logger.setLevel('INFO');
//app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

//把ejs模板改为html
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/img', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: 'lmb'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: 'keyboard'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//决定链接的路由方向，添加模块时需要在这添加路由方向
app.use('/', routes);
app.use('/users', users);
app.use('/adminManage', adminManage);
app.use('/commodityManage', commodityManage);
app.use('/appManage', appManage);
app.use('/hardwareManage', hardwareManage);
app.use('/operateManage', operateManage);
app.use('/uploadTest', operateManage);
app.use('/rankManage', rankManage);
app.use('/feedBackManage', feedBackManage);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  res.render('404', { title: '出错啦', errorStatus: err.status});
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: '500错误',
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
    title: '500错误',
    message: err.message,
    error: {}
  });
});


module.exports = app;
