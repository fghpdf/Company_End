var express = require('express');
var router = express.Router();

var model = require('../database/model');

router.all('/', isLoggedIn);
router.all('/indexTop', isLoggedIn);
router.all('/deleteAdmin', isLoggedIn);

/*这里需要查询数据库，显示管理员列表 */
router.get('/indexTop', function(req, res, next) {
    res.redirect('/');
});

router.get('/', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var adminList = model.Admin.query();
    adminList.select().then(function(model_fetch) {
        console.log(model_fetch);
        res.render('adminManage/indexTop', { title: '首页', companyEmail: companyEmail, adminList: model_fetch});
    });
});

/*这里处理ajax的请求，所以成功只是返回success，不渲染也不重定向*/
router.post('/deleteAdmin', function(req, res, next) {
    console.log(req.body);
    var deleteAdminEmail = req.body.deleteAdminEmail;
    //真是日了狗了,bookshelf只能用id来删除(文档实在难以阅读，TM栗子那么少),只能先获得id，再来删除
    var deletePromise = new model.Admin({companyEmail: deleteAdminEmail}).fetch();
    deletePromise.then(function(model_id) {
        var deleteId = model_id.get('id');
        console.log(deleteId);
        new model.Admin({id: deleteId}).destroy().then(function(model_delete) {
            console.log(model_delete);
            res.send({ success: true});
        });
    })
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;