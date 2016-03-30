var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');
var preset = require('../configuration/preset');

//拦截二级域名
router.all('/', isLoggedIn);
router.all('/admin', isLoggedIn);
router.all('/deleteAdmin', isTopLoggedIn);
router.all('/adminAdd', isTopLoggedIn);

/*这里需要查询数据库，显示管理员列表 */
router.get('/admin', function(req, res, next) {
    res.redirect('/');
});

router.get('/', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var adminList = model.Admin.query();
    adminList.select().then(function(model_fetch) {
        res.render('adminManage/admin', { title: '首页', adminEmail: adminEmail, adminList: model_fetch});
    });
});

/*这里处理ajax的请求，所以成功只是返回success，不渲染也不重定向*/
router.post('/deleteAdmin', function(req, res, next) {
    console.log(req.body);
    var adminEmail = req.session.passport.user;
    var deleteAdminEmail = req.body.deleteAdminEmail;
    //真是日了狗了,bookshelf只能用id来删除(文档实在难以阅读，TM栗子那么少),只能先获得id，再来删除
    var deletePromise = new model.Admin({adminEmail: deleteAdminEmail}).fetch();
    if(adminEmail === preset.TopAdmin.adminEmail) {
        deletePromise.then(function(model_id) {
            var deleteId = model_id.get('id');
            console.log(deleteId);
            new model.Admin({id: deleteId}).destroy().then(function(model_delete) {
                res.json({ success: true});
            });
        })
    } else {
        res.json({ success: false, errorMessage: '您不是顶级用户！'});
    }
});

router.get('/adminAdd', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    if(adminEmail === preset.TopAdmin.adminEmail) {
        res.render('adminManage/adminAdd', {title: '添加管理员'});
    } else {
        res.render('login', {title: '一级管理员登登录', errorMessage: '您无权查看此页面，请使用一级管理员账号登录'});
    }
});

/*次级管理员注册时，将企业信息写死，企业信息自动上传至数据库
 * 提高用户体验
 * */
router.post('/adminAdd', function(req, res, next) {
    var admin = req.body;
    var adminEmailPromise = null;
    adminEmailPromise = new model.Admin({adminEmail: admin.adminEmail}).fetch();

    return adminEmailPromise.then(function(model_fetch) {
        if(model_fetch) {
            res.render('adminManage/adminAdd', {title: '添加管理员', errorMessage: '该邮箱已被注册！'});
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

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;