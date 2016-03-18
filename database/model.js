var db = require('./db').db;

//管理员的表
var Admin = db.Model.extend({
    tableName: 'company',
    idAttribute: 'id'
});


//商品相关的表
var Commodity = db.Model.extend({
    tableName: 'commodity',
    idAttribute: 'id'
});

var Purchase = db.Model.extend({
    tableName: 'purchase',
    idAttribute: 'id'
});

var Defray = db.Model.extend({
    tableName: 'defray'
});

/*new Admin({'adminAccount': 'qxx'}).fetch().then(function(model) {
    console.log(model.get('isTopLevel'));
});*/


new Defray().where('purchaseId','=', '2').query().select().then(function(model) {
    console.log(model);
});

//因为是企业的管理员来登录，并且有顶级管理员管理之类的，所以使用admin
module.exports = {
    Admin: Admin,
    Commodity: Commodity,
    Purchase: Purchase,
    Defray: Defray
};