var db = require('./db').db;

//管理员的表
var Admin = db.Model.extend({
    tableName: 'admin',
    idAttribute: 'id'
});

//商品相关的表
var Commodity = db.Model.extend({
    tableName: 'commodity',
    idAttribute: 'id'
});

//订单表
var Purchase = db.Model.extend({
    tableName: 'purchase',
    idAttribute: 'id'
});

//订单细节表
var Detail = db.Model.extend({
    tableName: 'purchase_detail',
    idAttribute: 'id'
});

//app管理相关的表
var App = db.Model.extend({
    tableName: 'app'
});

//启动页表
var Start = db.Model.extend({
    tableName: 'start',
    idAttribute: 'id'
});

//引导页表
var Guide = db.Model.extend({
    tableName: 'guide',
    idAttribute: 'id'
});

//轮播图表
var Carousel = db.Model.extend({
    tableName: 'carousel',
    idAttribute: 'id'
});

//手机信息表
var Mobile = db.Model.extend({
    tableName: 'mobile_info',
    idAttribute: 'id'
});

//操作日志表
var Operate = db.Model.extend({
    tableName: 'log_operate',
    idAttribute: 'id'
});

//用户反馈表
var FeedBack = db.Model.extend({
    tableName: 'feedback',
    idAttribute: 'id'
});

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
    Detail: Detail,
    App: App,
    Start: Start,
    Guide: Guide,
    Carousel: Carousel,
    Mobile: Mobile,
    Operate: Operate,
    FeedBack: FeedBack
};