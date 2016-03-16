var express = require('express');
var router = express.Router();

var model = require('../database/model');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var adminAccount = req.session.passport.user;
    var adminList = model.Admin.query();
    adminList.select().then(function(model_fetch) {
        console.log(model_fetch);
        res.render('adminManage/indexTop', { title: '首页', adminAccount: adminAccount, adminList: model_fetch});
    });
});

router.post('/deleteAdmin', function(req, res, next) {
    console.log(req.body);
    var adminAccountDelete = req.body.adminAccountDelete;
    var deletePromise = new model.Admin({adminAccount: adminAccountDelete}).fetch();
    deletePromise.then(function(model_id) {
        var deleteId = model_id.get('id');
        console.log(deleteId);
        new model.Admin({id: deleteId}).destroy().then(function(model_delete) {
            console.log(model_delete);
            res.send({ success: true});
        });
    })
});

module.exports = router;