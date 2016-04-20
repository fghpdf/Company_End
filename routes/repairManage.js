var express = require('express');
var router = express.Router();

var model = require('../database/model');
var preset = require('../configuration/preset');
var operateLog = require('../database/operateLog');
var upload = require('./multerUtil');

var shortid = require('shortid');
var url = require('url');

router.all('/', preset.isLoggedIn);
router.all('/repair', preset.isLoggedIn);
router.all('/repairman', preset.isLoggedIn);
router.all('/repairmanAdd', preset.isLoggedIn);

//获取页面
router.get('/', function(req, res, next) {
    res.redirect(303, '/repairManage/repairman');
});

//获取维修人员页面
router.get('/repairman', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var repairmanList = model.Repairman.query();
    repairmanList.select().then(function(model_list) {
        res.render('repairManage/repairman', {
            title: '维修人员管理',
            adminEmail: adminEmail,
            adminName: adminName,
            repairmanList: model_list
        });
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        })
    });
});

//获取增加维修人员页面
router.get('/repairmanAdd', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    res.render('repairManage/repairmanAdd', {
        title: '添加维修人员',
        adminEmail: adminEmail,
        adminName: adminName
    });
});

//处理增加人员
router.post('/repairmanAdd', function(req, res, next) {
    var now = new Date();
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    upload.repairmanAddUpload(req, res, function(error) {
        var repairmanPromise = new model.Repairman({
            repairmanName: req.body.repairmanName,
            repairmanTel: req.body.repairmanTel
        }).fetch();
        var repairman = req.body;
        if(error) {
            res.render('error', {
                title: '出错啦',
                message: error.message,
                error: error
            });
        } else {
            repairmanPromise.then(function(model_fetch) {
                if(model_fetch) {
                    res.render('repairManage/repairmanAdd', {
                        title: '添加维修人员',
                        adminEmail: adminEmail,
                        adminName: adminName,
                        errorMessage: '此维修人员已经存在'
                    });
                } else {
                    console.log(repairman);
                    console.log(req.file.path);
                    var repairmanAdd = new model.Repairman({
                        repairmanId: now.getTime(),
                        repairmanName: repairman.repairmanName,
                        repairmanTel: repairman.repairmanTel,
                        repairmanTrade: repairman.repairmanTrade,
                        repairmanDepartment: repairman.repairmanDepartment,
                        repairmanImages: req.file.path
                    });
                    repairmanAdd.save().then(function() {
                        //写入日志
                        operateLog.logWrite(adminEmail, '添加维修人员:' + repairman.repairmanName);
                        res.redirect(303, '/repairManage/repairman');
                    }).catch(function(error) {
                        console.log(error);
                        res.render('error', {
                            title: '出错啦',
                            message: error.message,
                            error: error
                        });
                    });
                }
            });
        }
    });
});

//获取维修订单页面
router.get('/repair', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var repairList = model.Repair.query();
    repairList.select().then(function(model_list) {
        res.render('repairManage/repair', {
            title: '维修订单管理',
            adminEmail: adminEmail,
            adminName: adminName,
            repairList: model_list
        });
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//获取维修人员分配页面
router.get('/designateRepairman', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var repairmanList = model.Repairman.query();
    repairmanList.select().then(function(model_list) {
        res.render('repairManage/designateRepairman', {
            title: '维修人员分配',
            adminEmail: adminEmail,
            adminName: adminName,
            repairmanList: model_list
        });
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//维修人员分配确认
router.get('/designateSure', function(req, res, next){
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var repairId = url.parse(req.url, true).query.repairId;
    var repairmanId = url.parse(req.url, true).query.repairmanId;
    var repairPromise = new model.Repair({ repairId: repairId}).fetch();
    console.log(repairId);
    repairPromise.then(function(model_fetch) {
        if(model_fetch) {
            var id = model_fetch.get('id');
            new model.Repair({ id: id}).save({
                repairmanId: repairmanId,
                repairStatus: '已指派'
            }, {
                patch: true
            }).then(function() {
                //写入日志
                operateLog.logWrite(adminEmail,'为报修单:' + repairId + '分配维修人员:' + repairmanId);
                res.redirect(303, '/repairManage/repair');
            }).catch(function(error) {
                res.render('error', {
                    title: '出错啦',
                    message: error.message,
                    error: error
                });
            });
        } else {
            res.render('repairManage/repair', {
                title: '维修订单管理',
                adminEmail: adminEmail,
                adminName: adminName,
                errorMessage: '订单不存在'
            });
        }
    });
});

//API接口，故障报修
router.post('/repairUpload', function(req, res, next) {
    var now = new Date();
    var repairUploadPromise = new model.Repair({
        repairId: now.getTime() + shortid.generate(),
        hardwareId: req.body.hardwareId,
        userId: req.body.userId,
        userTel: req.body.userTel,
        userAddress: req.body.userAddress,
        uploadDate: now,
        repairStatus: '未指派人员'
    });
    repairUploadPromise.save().then(function() {
        res.json({
            success: true
        });
    }).catch(function(error) {
        res.json({
            success: false,
            error: error
        });
    });
});

//用户确认维修完毕
router.get('/designateSure', function(req, res, next){
    var repairId = req.body.repairId;
    var userFeedBack = req.body.userFeedBack;
    var repairPromise = new model.Repair({ repairId: repairId}).fetch();
    repairPromise.then(function(model_fetch) {
        if(model_fetch) {
            var id = model_fetch.get('id');
            new model.Repair({ id: id}).save({
                userFeedBack: userFeedBack,
                repairStatus: '维修完毕'
            }, {
                patch: true
            }).then(function() {
                res.json({success: true});
            }).catch(function(error) {
                res.json({success: false, error: error});
            });
        } else {
            res.json({success: false, error: '订单不存在'})
        }
    });
});

module.exports = router;
