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
    getJWT_Token(function(result) {
        if(result.error) {
            res.render('hardwareManage/hardware', {
                title: '硬件管理',
                adminEmail: adminEmail,
                adminName: adminName,
                errorMessage: result.error
            });
        } else {
            var options = {
                url: 'http://user.openapi.hekr.me/device',
                headers: {
                    'Authorization': "Bearer " + result.accessToken ,
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
                        errorMessage: error
                    });
                }
            });
        }
    });
});

function getJWT_Token(callback) {
    var options = {
        url: 'http://uaa.openapi.hekr.me/login',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        form: {
            "pid" : "00000000000",
            "username" : "13572064152",
            "password" : "940919",
            "clientType" : "WEB"
        }
    };
    request.post(options, function(error, response, body) {
        if (!error && response.statusCode == 200) {
            var result = JSON.parse(body);
            var accessToken = result.access_token;
            callback({ accessToken: accessToken});
        } else {
            callback({ error: error});
        }
    });
}

module.exports = router;