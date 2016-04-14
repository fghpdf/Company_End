var express = require('express');
var router = express.Router();

var model = require('../database/model');
var sevenCattle = require('../database/sevenCattle');
var preset = require('../configuration/preset');
var url = require('url');

router.all('/', preset.isLoggedIn);
router.all('/feedBack', preset.isLoggedIn);

router.get('/', function(req, res, next) {
    res.redirect(303, '/feedBackManage/feedBack');
});

router.get('/feedBack', function (req, res, next) {
    var month;
    var date;
    var week;
    var token = 0;
    var dateStart;
    var dateEnd;
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
    if (url.parse(req.url, true).query.month !== undefined) {
        month = url.parse(req.url, true).query.month;
        token = 1;
    }
    if (url.parse(req.url, true).query.week !== undefined) {
        week = url.parse(req.url, true).query.week;
        token = 2;
    }
    if (url.parse(req.url, true).query.date !== undefined) {
        date = url.parse(req.url, true).query.date;
        token = 3;
    }
    if (url.parse(req.url, true).query.dateStart !== undefined && url.parse(req.url, true).query.dateEnd !== undefined) {
        dateStart = new Date(url.parse(req.url, true).query.dateStart);
        dateEnd = new Date(url.parse(req.url, true).query.dateEnd);
        token = 4;
    }
    if (token === 1 || token === '1') {
        var queryPromise = model.FeedBack.query({where: {month: month}}).query();
        queryPromise.then(function (model_query) {
            //res.json({ title: '用户反馈', info: 'noInfo', productionList: model_query, token: token});
            res.render('feedBackManage/feedBack', {
                title: '用户反馈',
                feedBackList: model_query,
                token: token,
                adminEmail: adminEmail,
                adminName: adminName
            });
        });
    } else if (token === 2 || token === '2') {
        var queryPromise = model.FeedBack.query({where: {week: week}}).query();
        queryPromise.then(function (model_query) {
            console.log(model_query);
            res.render('feedBackManage/feedBack', {
                title: '用户反馈',
                feedBackList: model_query,
                token: token,
                adminEmail: adminEmail,
                adminName: adminName
            });
        });
    } else if (token === 3 || token === '3') {
        var queryPromise = model.FeedBack.query({where: {date: date, month: month}}).query();
        queryPromise.then(function (model_query) {
            res.render('feedBackManage/feedBack', {
                title: '用户反馈',
                feedBackList: model_query,
                token: token,
                adminEmail: adminEmail,
                adminName: adminName
            });
        });
    } else if (token === 4 || token === '4') {
        dateStart.setHours(dateStart.getHours() + dateStart.getTimezoneOffset() / 60);//消除时区不同带来的8小时时差
        dateEnd.setHours(dateEnd.getHours() + dateEnd.getTimezoneOffset() / 60);
        model.FeedBack.query(function (qb) {
            qb.where('uploadDate', '<', dateEnd).andWhere('uploadDate', '>', dateStart);
        }).query().then(function (model_query) {
            res.render('feedBackManage/feedBack', {
                title: '用户反馈',
                feedBackList: model_query,
                token: token,
                adminEmail: adminEmail,
                adminName: adminName
            });
        });
    } else {
        console.log(token);
        var queryPromise = model.FeedBack.query();
        queryPromise.then(function (model_query) {
            res.render('feedBackManage/feedBack', {
                title: '用户反馈',
                feedBackList: model_query,
                token: token,
                adminEmail: adminEmail,
                adminName: adminName
            });
        });
    }
});

//和IOS对接，接收app发来的用户反馈信息
router.post('/sendFeedback', function (req, res, next) {
    var feedBackContent = req.body.content;
    var appId = req.body.appId;
    var userId = req.body.userId;
    var file = req.body.file;
    sevenCattle.getIOSQiniuToken('feedBack', file, function (picToken, micToken, micKey, picKey) {
        var token = picToken + micToken;
        var key = micKey + picKey;
        var now = new Date();
        var week;
        preset.getWeek(now, function (Week) {
            week = Week;
            new model.FeedBack({
                appId: appId,
                userId: userId,
                feedBackContent: feedBackContent,
                uploadDate: now,
                picNum: parseInt(file.pic),
                micNUm: parseInt(file.mic),
                picKey: picKey,
                micKey: micKey,
                year: now.getFullYear(),
                month: (now.getMonth() + 1),
                week: week,
                date: now.getDate()
            }).save().then(function (model_save) {
                if (model_save) {
                    res.json({success: true, token: token, key: key});
                } else {
                    res.json({success: false, errorMessage: '录入数据库失败，请重新上传'});
                }
            }).catch(function (err) {
                console.log(err);
                res.json({success: false, errorMessage: err});
            });
        });
    });
});

module.exports = router;