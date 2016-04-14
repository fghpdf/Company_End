var express = require('express');
var router = express.Router();

var model = require('../database/model');
var url = require('url');
var request = require('request');
var preset = require('../configuration/preset');

router.all('/', preset.isLoggedIn);
router.all('/hardware', preset.isLoggedIn);

router.get('/', function(req, res, next) {
    res.redirect(303, '/hardwareManage/hardware');
});

router.get('/hardware', function(req, res, next) {
    var adminEmail = req.session.passport.user.adminEmail;
    var adminName = req.session.passport.user.adminName;
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
            res.render('hardwareManage/hardware', {
                title: '硬件管理',
                adminEmail: adminEmail,
                adminName: adminName,
                hardwareList: hardwareList
            });
        } else {
            res.render('hardwareManage/hardware', {
                title: '硬件管理',
                adminEmail: adminEmail,
                adminName: adminName,
                errorMessage: 'token过期'
            });
        }
    });
});

module.exports = router;