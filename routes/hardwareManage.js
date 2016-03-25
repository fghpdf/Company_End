var express = require('express');
var router = express.Router();

var model = require('../database/model');
var url = require('url');
var request = require('request');

router.all('/', isLoggedIn);
router.all('/hardware', isLoggedIn);

router.get('/hardware', function(req, res, next) {
    res.redirect(303, '/hardwareManage/');
});

router.get('/', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var options = {
        url: 'http://123.59.81.102:8082/webapi/device',
        headers: {
            'Authorization': "Bearer eyJhbGciOiJSUzI1NiJ9.eyJleHAiO" +
            "jE0NTg5MDEyMzIsInVzZXJfbmFtZSI6IjY0NjMz" +
            "NTc5NzM0IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9" +
            "VU0VSIl0sImp0aSI6ImE5ZDlhNDM5LWE4NzktNG" +
            "E1NS05ODg2LTZlMTVmZmIxODAyOSIsImNsaWVud" +
            "F9pZCI6IjIxMDAwMDAwMDAwMDAwMDAwMDAwMDAi" +
            "LCJzY29wZSI6WyJyZWFkIiwidHJ1c3QiLCJ3cml" +
            "0ZSJdfQ.iVMah9sFmArBNPWuPrwkT_alDLS4rS4" +
            "NQg4aNfIicv-lknkrGRG_EMKXKpQOnnUQ9o25u9" +
            "4lLDR1ZEGz99HVyA",
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };
    request(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var hardwareList = JSON.parse(body);
            console.log("info:", hardwareList);
            res.render('hardwareManage/hardware', {title: '硬件管理', adminEmail: adminEmail, hardwareList: hardwareList});
        } else {
            res.redirect(303, '/error');
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