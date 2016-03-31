var express = require('express');
var router = express.Router();

var model = require('../database/model');

router.all('/', isLoggedIn);
router.all('/operateLog', isLoggedIn);

router.get('/', function(req, res, next) {
    console.log(req.url);
    res.redirect(303, '/operateManage/operateLog');
});

router.get('/operateLog', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var operateList = new model.Operate().query();
    operateList.then(function(model_query) {
        console.log(model_query);
        res.render('operateManage/operateLog', { title: '操作日志', adminEmail: adminEmail, operateList: model_query});
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


