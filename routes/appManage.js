var express = require('express');
var router = express.Router();

var model = require('../database/model');
var shortid = require('shortid');
var url = require('url');


var upload = require('./multerUtil');

//拦截二级域名
router.all('/', isLoggedIn);
router.all('/appAdd', isLoggedIn);
router.all('/startAdd', isLoggedIn);

//显示app列表
router.get('/', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var appList = model.App.query();
    appList.select().then(function(model_fetch) {
        res.render('appManage/app', {title: 'App管理', companyEmail: companyEmail, appList: model_fetch});
    });
});

router.get('/app', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var appList = model.App.query();
    appList.select().then(function(model_fetch) {
        res.render('appManage/app', {title: 'App管理', companyEmail: companyEmail, appList: model_fetch});
    });
});

//显示添加app页面
router.get('/appAdd', function(req, res, next) {
    res.render('appManage/appAdd', {title: 'App添加'});
});

//添加app, id用shortid生成
router.post('/appAdd', function(req, res, next) {
    var appId = shortid.generate();
    var app = req.body;
    var appNamePromise = new model.App({ appName: app.appName}).fetch();

    return appNamePromise.then(function(model_fetch) {
        if(model_fetch) {
            res.render('appManage/appAdd', {title: '添加App', errorMessage: '此App名已存在！'});
        } else {
            var addApp = new model.App({
                appId: appId,
                appName: app.appName,
                appInfo: app.appInfo
            });
            console.log('addApp:', addApp);
            addApp.save().then(function(model_fetch) {
                res.redirect('app');
            })
        }
    });
});

//获取ajax传来的appId
router.post('/getAppId', function(req, res, next) {
    var appId = req.body.appId;
    res.json({
        success: true,
        appId: appId
    });
});


//显示启动页添加页面
router.get('/startAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    res.render('appManage/startAdd', {title: '添加启动页', appId: appId});
});

//添加启动页图片，把上传的单个图片的url保存在startContent中
//然后保存在数据库中
router.post('/startAdd/:appId', function (req, res, next) {
    var appId = req.params.appId;
    console.log('appId:', appId);
    upload.startUpload(req, res, function (err) {
        if (err) {
            res.redirect(303, 'error');
        } else {
            //因为appId不能重复，所以先通过appId查出重复的项，重复的项就获取id，来更新
            //路径，如果没有重复，就直接插入，这里因为设置了idAttribute = id，所以只能
            //把id当跳板
            var appIdPromise = new model.Start({ appId: appId}).fetch();
            appIdPromise.then(function(model_fetch) {
                if(model_fetch) {
                    var id = model_fetch.get('id');
                    new model.Start({ id: id}).save({
                        startContent: req.file.path
                    }, {
                        patch: true
                    }).then(function(model_save) {
                        res.redirect(303, '/appManage/');
                    })
                } else {
                    new model.Start({
                        startContent: req.file.path,
                        appId: appId
                    }).save().then(function (model_save) {
                        res.redirect(303, '/appManage/');
                    })
                }
            });
        }
    });
});

//显示引导页添加页面
router.get('/guideAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    res.render('appManage/guideAdd', {title: '添加引导页', appId: appId});
});

//添加引导页图片，把上传的多个图片的url保存在startContent中
//然后保存在数据库中
router.post('/guideAdd/:appId', function (req, res, next) {
    var appId = req.params.appId;
    console.log('appId:', appId);
    upload.guideUpload(req, res, function (err) {
        if (err) {
            res.redirect(303, 'error');
        } else {
            //因为appId不能重复，所以先通过appId查出重复的项，重复的项就获取id，来更新
            //路径，如果没有重复，就直接插入，这里因为设置了idAttribute = id，所以只能
            //把id当跳板
            var appIdPromise = new model.Guide({ appId: appId}).fetch();
            appIdPromise.then(function(model_fetch) {
                if(model_fetch) {
                    var id = model_fetch.get('id');
                    getContent(req.files, function(content) {
                        new model.Guide({ id: id}).save({
                            guideContent: content
                        }, {
                            patch: true
                        }).then(function(model_save) {
                            res.redirect(303, '/appManage/');
                        })
                    });
                } else {
                    getContent(req.files, function(content) {
                        new model.Guide({
                            guideContent: content,
                            appId: appId
                        }).save().then(function (model_save) {
                            res.redirect(303, '/appManage/');
                        })
                    });
                }
            });
        }
    });
});

//显示轮播页添加页面
router.get('/carouselAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    res.render('appManage/carouselAdd', {title: '添加轮播页', appId: appId});
});

//添加轮播页图片，把上传的多个图片的url保存在startContent中
//然后保存在数据库中
router.post('/carouselAdd/:appId', function (req, res, next) {
    var appId = req.params.appId;
    console.log('appId:', appId);
    upload.carouselUpload(req, res, function (err) {
        if (err) {
            res.redirect(303, 'error');
        } else {
            //因为appId不能重复，所以先通过appId查出重复的项，重复的项就获取id，来更新
            //路径，如果没有重复，就直接插入，这里因为设置了idAttribute = id，所以只能
            //把id当跳板
            var appIdPromise = new model.Carousel({ appId: appId}).fetch();
            appIdPromise.then(function(model_fetch) {
                if(model_fetch) {
                    var id = model_fetch.get('id');
                    getContent(req.files, function(content) {
                        new model.Carousel({ id: id}).save({
                            carouselContent: content
                        }, {
                            patch: true
                        }).then(function(model_save) {
                            res.redirect(303, '/appManage/');
                        })
                    });
                } else {
                    getContent(req.files, function(content) {
                        new model.Carousel({
                            carouselContent: content,
                            appId: appId
                        }).save().then(function (model_save) {
                            res.redirect(303, '/appManage/');
                        })
                    });
                }
            });
        }
    });
});

//回调避免同步,把多个文件路径合成一个以;相隔的字符串
function getContent(files, callback) {
    var content = [];
    console.log(files);
    for(var num = 0; num < files.length; num++) {
        content[num] = files[num].path;
    }
    content = content.join(";");
    callback(content);
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;