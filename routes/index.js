var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');

/* GET home page. */
//对访问进行拦截，若没有登陆，则不能进入管理员管理页面
router.all('/', isLoggedIn);
router.all('/adminManage', isLoggedIn);
router.all('/commodityManage', isLoggedIn);
router.all('/appManage', isTopLoggedIn);
router.all('/register', isTopLoggedIn);
router.all('/hardwareManage', isTopLoggedIn);

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
  var adminEmailPromise = null;
  //bookshelfjs提供的方法，可以通过表单提交的字段查找数据库，这里做一个重复用户名查询
  adminEmailPromise = new model.Admin({adminEmail: req.body.adminEmail}).fetch();

  adminEmailPromise.then(function(model_fetch) {
    var level = model_fetch.get('Level');
    if(level === '1') {
      passport.authenticate('local', {
        successRedirect: '/adminManage',
        failureRedirect: '/loginTop'
      }, function(err, user, info){
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
    } else {
      return res.render('loginTop', {title: '顶级管理员登陆', errorMessage: '您不是顶级管理员'});
    }
  });
});

router.post('/loginSec', function(req, res, next){
  var adminEmailPromise = null;
  adminEmailPromise = new model.Admin({adminEmail: req.body.adminEmail}).fetch();

  adminEmailPromise.then(function(model_fetch) {
    var level = model_fetch.get('Level');
    if(level === '2') {
      passport.authenticate('local', {
        successRedirect: '/adminManage',
        failureRedirect: '/loginSec'
      }, function(err, user, info){
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
    } else {
      return res.render('loginSec', {title: '次级管理员登陆', errorMessage: '您不是次级管理员'});
    }
  });
});


router.get('/register', function(req, res, next) {
  res.render('register', {title: '注册'});
});

/*次级管理员注册时，将企业信息写死，企业信息自动上传至数据库
* 提高用户体验
* */
router.post('/register', function(req, res, next) {
  var admin = req.body;
  var adminEmailPromise = null;
  adminEmailPromise = new model.Admin({adminEmail: admin.adminEmail}).fetch();

  return adminEmailPromise.then(function(model_fetch) {
    if(model_fetch) {
      res.render('register', {title: '注册', errorMessage: '该邮箱已被注册！'});
    } else {
      var password = admin.adminPassword;
      var hash = bcrypt.hashSync(password);
      var registerUser = new model.Admin({
        adminName: admin.adminName,
        adminEmail: admin.adminEmail,
        adminPassword: hash
      });
      registerUser.save().then(function(model_fetch){
        if(req.isAuthenticated()) {
          res.redirect(303, '/adminManage/');
        } else {
          res.render('login', {title: '登录'});
        }
      });
    }
  });
});

//登出
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/login');
});


//判断一级管理员登录
function isTopLoggedIn(req, res, next) {
  if(!req.session.passport) {
    res.render('login', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
  } else {
    var adminEmail = req.session.passport.user;
    new model.Admin({adminEmail: adminEmail}).fetch().then(function(model_getLevel) {
      var adminLevel = model_getLevel.get('Level');
      if(req.isAuthenticated() && adminLevel === '1') {
        return next();
      } else if(req.isAuthenticated()) {
        res.render('login', {title: '一级管理员登登录', errorMessage: '您无权查看此页面，请使用一级管理员账号登录'});
      } else {
        res.render('login', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
      }
    });
  }
}


//判断管理员是否登录
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  } else {
    res.redirect('/login');
  }
}

module.exports = router;
