var express = require('express');
var router = express.Router();

var model = require('../database/model');

//拦截二级域名
router.all('/', isTopLoggedIn);
router.all('/indexTop', isTopLoggedIn);
router.all('/deleteAdmin', isTopLoggedIn);

/*这里需要查询数据库，显示管理员列表 */
router.get('/indexTop', function(req, res, next) {
    res.redirect('/');
});

router.get('/', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var adminList = model.Admin.query();
    adminList.select().then(function(model_fetch) {
        res.render('adminManage/indexTop', { title: '首页', adminEmail: adminEmail, adminList: model_fetch});
    });
});

/*这里处理ajax的请求，所以成功只是返回success，不渲染也不重定向*/
router.post('/deleteAdmin', function(req, res, next) {
    console.log(req.body);
    var deleteAdminEmail = req.body.deleteAdminEmail;
    //真是日了狗了,bookshelf只能用id来删除(文档实在难以阅读，TM栗子那么少),只能先获得id，再来删除
    var deletePromise = new model.Admin({adminEmail: deleteAdminEmail}).fetch();
    deletePromise.then(function(model_id) {
        var deleteId = model_id.get('id');
        console.log(deleteId);
        new model.Admin({id: deleteId}).destroy().then(function(model_delete) {
            res.send({ success: true});
        });
    })
});

//判断一级管理员登录
function isTopLoggedIn(req, res, next) {
    if(!req.session.passport) {
        res.render('loginTop', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
    } else {
        var adminEmail = req.session.passport.user;
        new model.Admin({adminEmail: adminEmail}).fetch().then(function(model_getLevel) {
            var adminLevel = model_getLevel.get('Level');
            if(req.isAuthenticated() && adminLevel === '1') {
                return next();
            } else if(req.isAuthenticated()) {
                res.render('loginTop', {title: '一级管理员登登录', errorMessage: '您无权查看此页面，请使用一级管理员账号登录'});
            } else {
                res.render('loginTop', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
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