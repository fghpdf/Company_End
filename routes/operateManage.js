var express = require('express');
var router = express.Router();

var model = require('../database/model');
var multer = require('multer');
var preset = require('../configuration/preset');

router.all('/', preset.isLoggedIn);
router.all('/operateLog', preset.isLoggedIn);

//获取日志目录
router.get('/', function(req, res, next) {
    console.log(req.url);
    res.redirect(303, '/operateManage/operateLog');
});

//获取日志目录
router.get('/operateLog', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var operateListPromise = new model.Operate().query();
    operateListPromise.then(function(model_query) {
        console.log(model_query);
        res.render('operateManage/operateLog', { title: '操作日志', adminEmail: adminEmail, operateList: model_query});
    });
});

module.exports = router;


