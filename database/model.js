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

//app管理相关的表
var App = db.Model.extend({
    tableName: 'app'
});

var Start = db.Model.extend({
    tableName: 'start',
    idAttribute: 'id'
});

var Guide = db.Model.extend({
    tableName: 'guide',
    idAttribute: 'id'
});

var Carousel = db.Model.extend({
    tableName: 'carousel',
    idAttribute: 'id'
});

/*new Admin({'adminAccount': 'qxx'}).fetch().then(function(model) {
    console.log(model.get('isTopLevel'));
});*/


/*new Defray().where('purchaseId','=', '2').query().select().then(function(model) {
    console.log(model);
});*/

//因为是企业的管理员来登录，并且有顶级管理员管理之类的，所以使用admin
//这里通过json格式来保存表的接口
//添加模块时，需要在上面添加表，在这里添加接口
module.exports = {
    Admin: Admin,
    Commodity: Commodity,
    Purchase: Purchase,
    Defray: Defray,
    App: App,
    Start: Start,
    Guide: Guide,
    Carousel: Carousel
};