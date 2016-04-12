var model = require('../database/model');

var TopAdmin = {
    adminEmail: 'xiangxuan.qu@hekr.me',
    adminName: '瞿祥轩'
};

var CompanyInfo = {
    companyName: '杭州第九区科技有限公司',
    companyEmail: 'hekr@hekr.me',
    companyAddress: '中华人民共和国浙江省杭州市西湖区教工路求是大厦14层2号',
    companyTel: '0571-28993537(前台)'
};

//判断一级管理员登录
function isTopLoggedIn(req, res, next) {
    if(!req.session.passport) {
        res.render('login', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
    } else {
        var adminEmail = req.session.passport.user;
        new model.Admin({adminEmail: adminEmail}).fetch().then(function(model_getLevel) {
            var adminLevel = model_getLevel.get('Level');
            if(req.isAuthenticated() && adminLevel === '1') {
                return next();
            } else if(req.isAuthenticated()) {
                res.render('login', {title: '一级管理员登登录', errorMessage: '您无权查看此页面，请使用一级管理员账号登录'});
            } else {
                res.render('login', {title: '一级管理员登登录', errorMessage: '您尚未登陆，请使用一级管理员账号登录'});
            }
        });
    }
}

//判断管理员登录
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/loginTop');
    }
}

//获得一年中的第几个星期
function getWeek(date, callback) {
    var time,week,checkDate = new Date(date);
    checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
    time = checkDate.getTime();
    checkDate.setMonth(0);
    checkDate.setDate(1);
    week=Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
    callback(week);
}


module.exports = {
    TopAdmin: TopAdmin,
    CompanyInfo: CompanyInfo,
    isTopLoggedIn: isTopLoggedIn,
    isLoggedIn: isLoggedIn,
    getWeek: getWeek
};