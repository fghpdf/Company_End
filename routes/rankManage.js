var express = require('express');
var router = express.Router();

var model = require('../database/model');
var multer = require('multer');
var preset = require('../configuration/preset');

var url = require('url');

router.all('/', preset.isLoggedIn);
router.all('/rank', preset.isLoggedIn);
router.all('/rank/', preset.isLoggedIn);


router.get('/', function(req, res, next) {
    res.redirect(303, '/rankManage/rank');
});

//获取总览页面
router.get('/rank', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var rankListPromise = new model.Rank().query();
    rankListPromise.then(function(model_query) {
        new model.RankType().query().then(function(model_type) {
            res.render('rankManage/rank', {
                title: '排行榜管理',
                adminEmail: adminEmail,
                adminName: adminName,
                rankList: model_query,
                rankType: model_type
            });
        }).catch(function(error) {
            res.render('error', {
                title: '出错啦',
                message: error.message,
                error: error
            });
        });
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//获取特定排行榜的页面
router.get('/rank/:rankType', function(req, res, next) {
    var rankType = req.params.rankType;
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var rankListPromise = model.Rank.query({where: {rankType: rankType}}).query();
    rankListPromise.then(function(model_query) {
        new model.RankType().query().then(function(model_type) {
            console.log(model_type);
            res.render('rankManage/rank', {
                title: '排行榜管理',
                adminEmail: adminEmail,
                adminName: adminName,
                rankList: model_query,
                rankType: model_type
            });
        }).catch(function(error) {
            res.render('error', {
                title: '出错啦',
                message: error.message,
                error: error
            });
        });
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//添加排行榜类型
router.get('/rankTypeAdd', function(req, res, next) {
    var rankType = url.parse(req.url, true).query.rankType;
    new model.RankType({ rankType: rankType}).save().then(function(){
        res.redirect(303, '/rankManage/');
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//和IOS对接，接收app发来的系统版本，地理位置和手机型号信息，以及排行榜中的信息
router.get('/sendMobileInfo', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var mobileVersion = url.parse(req.url, true).query.version;
    var mobileLocation = url.parse(req.url, true).query.location;
    var mobileModels = url.parse(req.url, true).query.models;
    var userId = url.parse(req.url, true).query.userId;
    var hardwareId = url.parse(req.url, true).query.hardwareId;
    var rankContent = url.parse(req.url, true).query.rankContent;
    new model.Rank({
        mobileVersion: mobileVersion,
        mobileLocation: mobileLocation,
        mobileModels: mobileModels,
        appId: appId,
        userId: userId,
        hardwareId: hardwareId,
        rankContent: rankContent,
        rankDate: new Date()
    }).save().then(function (model_save) {
        if(model_save) {
            res.json({ success: true, info: model_save});
        } else {
            res.json({ success: false, info: '没有任何信息录入数据库'});
        }
    }).catch(function(error){
        res.json({ success: false, info: error});
    });
});

module.exports = router;