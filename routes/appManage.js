var express = require('express');
var router = express.Router();

var model = require('../database/model');
var shortid = require('shortid');
var url = require('url');
var fs = require('fs');

var upload = require('./multerUtil');
var operateLog = require('../database/operateLog');

var qiniu = require('qiniu');
var preset = require('../configuration/preset');

//拦截二级域名
router.all('/', preset.isTopLoggedIn);
router.all('/appAdd', preset.isTopLoggedIn);
router.all('/startAdd', preset.isTopLoggedIn);
router.all('/guideAdd', preset.isTopLoggedIn);
router.all('/carouselAdd', preset.isTopLoggedIn);

//显示app列表
router.get('/', function(req, res, next) {
    res.redirect(303, '/appManage/app');
});

router.get('/app', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var appList = model.App.query();
    appList.select().then(function(model_fetch) {
        res.render('appManage/app', {title: 'App管理', adminEmail: adminEmail, adminName: adminName, appList: model_fetch});
    });
});

//显示添加app页面
router.get('/appAdd', function(req, res, next) {
    var adminName = req.session.passport.user.adminName;
    res.render('appManage/appAdd', {title: 'App添加', adminName: adminName});
});

////显示app详情页面
//router.get('/queryDetail', function(req, res, next) {
//    var adminEmail = req.session.passport.user.adminEmail;
//    var adminName = req.session.passport.user.adminName;
//    var appId = url.parse(req.url, true).query.appId;
//    var mobilePromise = new model.Mobile().where('appId', '=', appId).query().select();
//
//    mobilePromise.then(function(model_fetch) {
//        console.log(model_fetch);
//        if(model_fetch) {
//            res.render('appManage/queryDetail', { title: 'app详情', adminEmail: adminEmail, adminName: adminName, mobileInfoList: model_fetch});
//        } else {
//            res.render('appManage/queryDetail', { title: 'app详情', adminEmail: adminEmail, adminName: adminName, errorMessage: '此App尚未有用户使用'});
//        }
//    });
//});

//添加app, id用shortid生成
router.post('/appAdd', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    var appId = shortid.generate();
    var app = req.body;
    var appNamePromise = new model.App({ appName: app.appName}).fetch();

    return appNamePromise.then(function(model_fetch) {
        if(model_fetch) {
            res.render('appManage/appAdd', {title: '添加App', adminName: adminName,errorMessage: '此App名已存在！'});
        } else {
            var addApp = new model.App({
                appId: appId,
                appName: app.appName,
                appInfo: app.appInfo
            });
            console.log('addApp:', addApp);
            addApp.save().then(function(model_fetch) {
                //写入日志
                operateLog.logWrite(adminEmail, '添加App，AppId：' + appId);
                res.redirect('/appManage/app');
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


//显示图片上传页面
router.get('/imagesAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var adminName = req.session.passport.user.adminName;
    res.render('appManage/imagesAdd', {title: '上传图片', appId: appId, adminName: adminName});
});

//显示启动页上传页面
router.get('/startAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var adminName = req.session.passport.user.adminName;
    new model.Start({ appId: appId}).fetch().then(function(model_fetch) {
        if(model_fetch) {
            var startContent = model_fetch.get('startContent');
            var startDate = model_fetch.get('startDate');
            res.render('appManage/imagesAdd', {
                title: '启动页管理',
                appId: appId,
                adminName: adminName,
                startContent: startContent,
                startDate: startDate
            });
        } else {
            res.render('appManage/imagesAdd', {
                title: '启动页管理',
                appId: appId,
                adminName: adminName,
                startContent: 'public\\img\\image.png'
            });
        }
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//显示引导页上传页面
router.get('/guideAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var adminName = req.session.passport.user.adminName;
    new model.Guide({ appId: appId}).fetch().then(function(model_fetch) {
        if(model_fetch) {
            var guideContent = model_fetch.get('guideContent');
            var guideDate = model_fetch.get('guideDate');
            res.render('appManage/imagesAdd', {
                title: '引导页管理',
                appId: appId,
                adminName: adminName,
                guideContent: guideContent,
                guideDate: guideDate
            });
        } else {
            res.render('appManage/imagesAdd', {
                title: '引导页管理',
                appId: appId,
                adminName: adminName,
                guideContent: 'public\\img\\image.png;public\\img\\image.png'
            });
        }
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//显示轮播页上传页面
router.get('/carouselAdd', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var adminName = req.session.passport.user.adminName;
    new model.Carousel({ appId: appId}).fetch().then(function(model_fetch) {
        if(model_fetch) {
            var carouselContent = model_fetch.get('carouselContent');
            var carouselDate = model_fetch.get('carouselDate');
            res.render('appManage/imagesAdd', {
                title: '轮播页管理',
                appId: appId,
                adminName: adminName,
                carouselContent: carouselContent,
                carouselDate: carouselDate
            });
        } else {
            res.render('appManage/imagesAdd', {
                title: '轮播页管理',
                appId: appId,
                adminName: adminName,
                carouselContent: 'public\\img\\image.png;public\\img\\image.png'
            });
        }
    }).catch(function(error) {
        res.render('error', {
            title: '出错啦',
            message: error.message,
            error: error
        });
    });
});

//添加启动页图片，把上传的单个图片的url保存在startContent中
//然后保存在数据库中
router.post('/startAdd/:appId', function (req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var appId = req.params.appId;
    upload.startUpload(req, res, function (error) {
        if (error) {
            res.render('error', {
                title: '出错啦',
                message: error.message,
                error: error
            });
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
                        //写入日志
                        operateLog.logWrite(adminEmail, '更新启动页图片,AppId:' + appId);
                        res.redirect(303, '/appManage/');
                    });
                } else {
                    new model.Start({
                        startContent: req.file.path,
                        appId: appId
                    }).save().then(function(model_save) {
                        //写入日志
                        operateLog.logWrite(adminEmail, '添加启动页图片,AppId:' + appId);
                        res.redirect(303, '/appManage/');
                    });
                }
            });
        }
    });
});

//添加引导页图片，把上传的多个图片的url保存在startContent中
//然后保存在数据库中
router.post('/guideAdd/:appId', function (req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var appId = req.params.appId;
    upload.guideUpload(req, res, function (error) {
        if (error) {
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
                            //写入日志
                            operateLog.logWrite(adminEmail, '更新引导页图片,AppId:' + appId);
                            res.redirect(303, '/appManage/');
                        })
                    });
                } else {
                    getContent(req.files, function(content) {
                        new model.Guide({
                            guideContent: content,
                            appId: appId
                        }).save().then(function (model_save) {
                            //写入日志
                            operateLog.logWrite(adminEmail, '添加引导页图片,AppId:' + appId);
                            res.redirect(303, '/appManage/');
                        })
                    });
                }
            });
        }
    });
});

//添加轮播页图片，把上传的多个图片的url保存在startContent中
//然后保存在数据库中
router.post('/carouselAdd/:appId', function (req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var appId = req.params.appId;
    upload.carouselUpload(req, res, function (error) {
        if (error) {
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
                            //写入日志
                            operateLog.logWrite(adminEmail, '更新轮播页图片,AppId:' + appId);
                            res.redirect(303, '/appManage/');
                        })
                    });
                } else {
                    getContent(req.files, function(content) {
                        new model.Carousel({
                            carouselContent: content,
                            appId: appId
                        }).save().then(function (model_save) {
                            //写入日志
                            operateLog.logWrite(adminEmail, '添加轮播页图片,AppId:' + appId);
                            res.redirect(303, '/appManage/');
                        })
                    });
                }
            });
        }
    });
});

//和IOS对接，给予图片链接
router.get('/getImagesUrl', function(req, res, next) {
    var appId = url.parse(req.url, true).query.appId;
    var appType = url.parse(req.url, true).query.appType;
    if(appType === 'guide') {
        var guideAppIdPromise = new model.Guide({ appId: appId}).fetch();
        guideAppIdPromise.then(function(model_guide) {
            if(model_guide) {
                var guideImagesUrl = model_guide.get('guideContent');
                res.json({success: true, guideImagesUrl: guideImagesUrl});
            } else {
                res.json({success: false, errorMessage: 'can`t find this appId'});
            }
        });
    } else if(appType === 'start') {
        var startAppIdPromise = new model.Start({ appId: appId}).fetch();
        startAppIdPromise.then(function(model_start) {
            if(model_start) {
                var startImagesUrl = model_start.get('startContent');
                res.json({success: true, startImagesUrl: startImagesUrl});
            } else {
                res.json({success: false, errorMessage: 'can`t find this appId'});
            }
        });
    } else if(appType === 'carousel') {
        var carouselAppIdPromise = new model.Carousel({ appId: appId}).fetch();
        carouselAppIdPromise.then(function(model_carousel) {
            if(model_carousel) {
                var carouselImagesUrl = model_carousel.get('carouselContent');
                res.json({success: true, carouselImagesUrl: carouselImagesUrl});
            } else {
                res.json({success: false, errorMessage: 'can`t find this appId'});
            }
        });
    } else {
        res.json({success: false, errorMessage: 'can`t find this type'});
    }
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


module.exports = router;