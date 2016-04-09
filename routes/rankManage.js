var express = require('express');
var router = express.Router();

var model = require('../database/model');
var multer = require('multer');
var preset = require('../configuration/preset');

router.all('/', preset.isLoggedIn);
router.all('/rankManage', preset.isLoggedIn);


router.get('/', function(req, res, next) {
    res.redirect(303, '/rankManage/rankManage');
});

router.get('/rankManage', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var rankListPromise = new model.Mobile().query();
    rankListPromise.then(function(model_query) {
        res.render('rankManage/rank', { title: '排行榜管理', adminEmail: adminEmail, rankList: model_query});
    });
});

module.exports = router;