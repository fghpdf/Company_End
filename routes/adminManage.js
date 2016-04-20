var express = require('express');
var router = express.Router();
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var model = require('../database/model');
var preset = require('../configuration/preset');
var operateLog = require('../database/operateLog');

//拦截二级域名
router.all('/', preset.isLoggedIn);
router.all('/admin', preset.isLoggedIn);
router.all('/deleteAdmin', preset.isTopLoggedIn);
router.all('/adminAdd', preset.isTopLoggedIn);

/*这里需要查询数据库，显示管理员列表 */
router.get('/admin', function(req, res, next) {
    res.redirect('/');
});

router.get('/', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var adminList = model.Admin.query();
    adminList.select().then(function(model_fetch) {
        res.render('adminManage/admin', { title: '管理员管理', adminEmail: adminEmail, adminName: adminName, adminList: model_fetch});
    });
});

/*这里处理ajax的请求，所以成功只是返回success，不渲染也不重定向*/
router.post('/deleteAdmin', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var deleteAdminEmail = req.body.deleteAdminEmail;
    //真是日了狗了,bookshelf只能用id来删除(文档实在难以阅读，TM栗子那么少),只能先获得id，再来删除
    var deletePromise = new model.Admin({adminEmail: deleteAdminEmail}).fetch();
    if(adminEmail === preset.TopAdmin.adminEmail) {
        deletePromise.then(function(model_id) {
            var deleteId = model_id.get('id');
            var deleteName = model_id.get('adminName');
            console.log(deleteId);
            new model.Admin({id: deleteId}).destroy().then(function(model_delete) {
                //写入日志
                operateLog.logWrite(preset.TopAdmin.adminEmail, '删除管理员：' + deleteName);
                res.json({ success: true});
            });
        })
    } else {
        res.json({ success: false, errorMessage: '您不是顶级用户！'});
    }
});

router.get('/adminAdd', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    if(adminEmail === preset.TopAdmin.adminEmail) {
        res.render('adminManage/adminAdd', {title: '添加管理员', adminName: adminName});
    } else {
        res.render('loginTop', {title: '一级管理员登录', errorMessage: '您无权查看此页面，请使用一级管理员账号登录'});
    }
});

/*次级管理员注册时，将企业信息写死，企业信息自动上传至数据库
 * 提高用户体验
 * */
router.post('/adminAdd', function(req, res, next) {
    var admin = req.body;
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var adminEmailPromise =  new model.Admin({adminEmail: admin.adminEmail}).fetch();

    adminEmailPromise.then(function(model_fetch) {
        if(model_fetch) {
            res.render('adminManage/adminAdd', {
                title: '添加管理员',
                errorMessage: '该邮箱已被注册！',
                adminName: adminName,
                adminEmail: adminEmail
            });
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
                    //写入日志
                    operateLog.logWrite(preset.TopAdmin.adminEmail, '添加管理员:' + admin.adminName);
                    res.redirect(303, '/adminManage/');
                } else {
                    //写入日志
                    operateLog.logWrite(preset.TopAdmin.adminEmail, '添加管理员:' + admin.adminName);
                    res.render('loginTop', {title: '一级管理员登录'});
                }
            });
        }
    });
});

module.exports = router;