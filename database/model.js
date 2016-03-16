var db = require('./db').db;

var Admin = db.Model.extend({
    tableName: 'admin',
    idAttribute: 'id'
});

/*new Admin({'adminAccount': 'qxx'}).fetch().then(function(model) {
    console.log(model.get('isTopLevel'));
});*/



module.exports = {
    Admin: Admin
};