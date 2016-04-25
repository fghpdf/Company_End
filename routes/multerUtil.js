var multer = require('multer');

var appStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var appId = req.params.appId;
        console.log('appId', appId);
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + appId + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var appStorageArray = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var appId = req.params.appId;
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + appId + '-' +  Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var commodityStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var commodityUpdateStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var commodityId = req.params.commodityId;
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + commodityId + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var repairmanAddStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var commodityUpload = multer({ storage: commodityStorage}).single('commodityImages');
var commodityUpdateUpload = multer({ storage: commodityUpdateStorage}).single('commodityImages');
var startUpload = multer({ storage: appStorage}).single('startImages');
var guideUpload = multer({ storage: appStorage}).array('guideImages');
var carouselUpload = multer({ storage: appStorageArray}).array('carouselImages');
var repairmanAddUpload = multer({ storage: repairmanAddStorage}).single('repairmanImages');


module.exports = {
    commodityUpload: commodityUpload,
    startUpload: startUpload,
    guideUpload: guideUpload,
    carouselUpload: carouselUpload,
    commodityUpdateUpload: commodityUpdateUpload,
    repairmanAddUpload: repairmanAddUpload
};