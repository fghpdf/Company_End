var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');
var operateLog = require('../database/operateLog');
var preset = require('../configuration/preset');

/* GET home page. */
//对访问进行拦截，若没有登陆，则不能进入管理员管理页面
router.all('/', preset.isLoggedIn);
router.all('/adminManage', preset.isLoggedIn);
router.all('/commodityManage', preset.isLoggedIn);
router.all('/appManage', preset.isTopLoggedIn);
router.all('/hardwareManage', preset.isTopLoggedIn);
router.all('/operateManage', preset.isLoggedIn);
router.all('/repairManage', preset.isLoggedIn);

router.get('/', function(req, res, next) {
  var adminEmail = req.session.passport.user.adminEmail;
  var adminName = req.session.passport.user.adminName;
  var rankListPromise = new model.Rank().query();
  var feedBackPromise = new model.FeedBack().query();
  rankListPromise.then(function(model_rankList) {
    feedBackPromise.then(function(model_feedBack) {
      res.render('indexManage/index', {
        title: '首页',
        adminEmail: adminEmail,
        adminName: adminName,
        rankList: model_rankList,
        feedBackList: model_feedBack
      });
    });
  });
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
    if(model_fetch) {
      var level = model_fetch.get('Level');
      if(level === '1') {
        passport.authenticate('local', {
          successRedirect: '/adminManage',
          failureRedirect: '/loginTop'
        }, function(err, user, info){
          if(err) {
            return res.render('loginTop', {title: '顶级管理员登录', errorMessage: err.message});
          }
          if(!user) {
            return res.render('loginTop', {title: '顶级管理员登录', errorMessage: info.message});
          }
          return req.logIn(user, function(err){
            if(err) {
              return res.render('loginTop', {title: '顶级管理员登录', errorMessage: err.message});
            } else {
              //写入日志
              operateLog.logWrite(user.adminEmail, '顶级管理员' + user.adminName + '登录');
              return res.redirect('/');
            }
          });
        })(req, res, next);
      } else {
        return res.render('loginTop', {title: '顶级管理员登录', errorMessage: '您不是顶级管理员'});
      }
    } else {
      return res.render('loginTop', {title: '顶级管理员登录', errorMessage: '不存在的邮箱账号'});
    }
  });
});

router.post('/loginSec', function(req, res, next){
  var adminEmailPromise = null;
  adminEmailPromise = new model.Admin({adminEmail: req.body.adminEmail}).fetch();

  adminEmailPromise.then(function(model_fetch) {
    if(model_fetch) {
      var level = model_fetch.get('Level');
      if(level === '2') {
        passport.authenticate('local', {
          successRedirect: '/adminManage',
          failureRedirect: '/loginSec'
        }, function(err, user, info){
          if(err) {
            return res.render('loginSec', {title: '次级管理员登录', errorMessage: err.message});
          }
          if(!user) {
            return res.render('loginSec', {title: '次级管理员登录', errorMessage: info.message});
          }
          return req.logIn(user, function(err){
            if(err) {
              return res.render('loginSec', {title: '次级管理员登录', errorMessage: err.message});
            } else {
              //写入日志
              operateLog.logWrite(user.adminEmail, '次级管理员'+ user.adminName +'登录');
              return res.redirect('/');
            }
          });
        })(req, res, next);
      } else {
        return res.render('loginSec', {title: '次级管理员登录', errorMessage: '您不是次级管理员'});
      }
    } else {
      return res.render('loginSec', {title: '次级管理员登录', errorMessage: '不存在的邮箱账号'});
    }
  });
});

//登出
router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/loginTop');
});

module.exports = router;
