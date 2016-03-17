var db = require('./db').db;

var Admin = db.Model.extend({
    tableName: 'company',
    idAttribute: 'id'
});

/*new Admin({'adminAccount': 'qxx'}).fetch().then(function(model) {
    console.log(model.get('isTopLevel'));
});*/


//因为是企业的管理员来登录，并且有顶级管理员管理之类的，所以使用admin
module.exports = {
    Admin: Admin
};