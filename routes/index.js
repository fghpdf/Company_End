var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');

/* GET home page. */
//对访问进行拦截，若没有登陆，则不能进入项目管理页面
router.all('/', isLoggedIn);
router.all('/adminManage', isLoggedIn);

router.get('/', function(req, res, next) {
  res.redirect('/adminManage');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: '登陆'});
});

router.get('/loginTop', function(req, res, next) {
  res.render('loginTop', { title: '顶级管理员登录'});
});

router.get('/loginSec', function(req, res, next) {
  res.render('loginSec', { title: '次级管理员登录'});
});

/*登录需要做权限管理，顶级管理员从/loginTop页面进入
* 二级管理员从/loginSec页面进入
* 获取isTopLevel字段，0为二级管理员，1为顶级管理员
* 登录时做验证
* */
router.post('/loginTop', function(req, res, next){
  console.log(req.body);
  var adminAccountPromise = null;
  adminAccountPromise = new model.Admin({adminAccount: req.body.adminAccount}).fetch();

  adminAccountPromise.then(function(model_fetch) {
    var isTopLevel = model_fetch.get('isTopLevel');
    console.log(isTopLevel);
    if(!isTopLevel) {
      return res.render('loginTop', {title: '顶级管理员登陆', errorMessage: '您不是顶级管理员'});
    }
    passport.authenticate('local', {
      successRedirect: '/adminManage',
      failureRedirect: '/loginTop'
    }, function(err, user, info){
      console.log(err, user, info);
      if(err) {
        return res.render('loginTop', {title: '顶级管理员登陆', errorMessage: err.message});
      }
      if(!user) {
        return res.render('loginTop', {title: '顶级管理员登陆', errorMessage: info.message});
      }
      return req.logIn(user, function(err){
        if(err) {
          return res.render('loginTop', {title: '顶级管理员登陆', errorMessage: err.message});
        } else {
          return res.redirect('/adminManage');
        }
      });
    })(req, res, next);
  });
});

router.post('/loginSec', function(req, res, next){
  console.log(req.body);
  var adminAccountPromise = null;
  adminAccountPromise = new model.Admin({adminAccount: req.body.adminAccount}).fetch();

  adminAccountPromise.then(function(model_fetch) {
    var isTopLevel = model_fetch.get('isTopLevel');
    console.log(isTopLevel);
    if(isTopLevel) {
      return res.render('loginSec', {title: '次级管理员登陆', errorMessage: '您不是次级管理员'});
    }
    passport.authenticate('local', {
      successRedirect: '/adminManage',
      failureRedirect: '/loginSec'
    }, function(err, user, info){
      console.log(err, user, info);
      if(err) {
        return res.render('loginSec', {title: '次级管理员登陆', errorMessage: err.message});
      }
      if(!user) {
        return res.render('loginSec', {title: '次级管理员登陆', errorMessage: info.message});
      }
      return req.logIn(user, function(err){
        if(err) {
          return res.render('loginSec', {title: '登次级管理员登陆陆', errorMessage: err.message});
        } else {
          return res.redirect('/adminManage');
        }
      });
    })(req, res, next);
  });
});


router.get('/register', function(req, res, next) {
  res.render('register', {title: '注册'});
});

router.post('/register', function(req, res, next) {
  var admin = req.body;
  var adminAccountPromise = null;
  adminAccountPromise = new model.Admin({adminAccount: admin.adminAccount}).fetch();

  return adminAccountPromise.then(function(model_fetch) {
    if(model_fetch) {
      res.render('register', {title: '注册', errorMessage: '该邮箱已被注册！'});
    } else {
      var password = admin.adminPassword;
      var hash = bcrypt.hashSync(password);

      var registerUser = new model.Admin({
        adminAccount: admin.adminAccount,
        adminPassword: hash
      });

      registerUser.save().then(function(model_fetch){
        res.render('login', {title: '登录'});
      });
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
