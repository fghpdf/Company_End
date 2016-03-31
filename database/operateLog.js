var model = require('./model');

//自用API，用来向数据库写入操作日志
function logWrite(adminEmail, operateContent) {
    var adminPromise = new model.Admin({ adminEmail: adminEmail}).fetch();
    adminPromise.then(function(model_fetch) {
        if(model_fetch) {
            var adminId = model_fetch.get('id');
            var adminName = model_fetch.get('adminName');
            var adminEmail = model_fetch.get('adminEmail');
            var operatePromise = new model.Operate({
                operatorId: adminId,
                operatorName: adminName,
                operatorEmail: adminEmail,
                operateDate: new Date(),
                operateContent: operateContent
            });
            operatePromise.save();
        } else {
            new model.Operate({
                operator: '未知身份',
                operatorName: '未知身份',
                operatorEmail: '未知身份',
                operateDate: new Date(),
                operateContent: '未知身份者闯入！！请注意！！！'
            }).save();
        }
    });
}

module.exports = {
    logWrite: logWrite
};