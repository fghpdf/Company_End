var multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'public/images');
    },
    filename: function(req, file, callback) {
        var fileFormat = (file.originalname).split(".");
        callback(null, file.fieldname + '-' + Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

var commodityUpload = multer({ storage: storage}).single('commodityImages');
var startUpload = multer({ storage: storage}).single('startImages');
var guideUpload = multer({ storage: storage}).array('guideImages');
var carouselUpload = multer({ storage: storage}).array('carouselImages');
var commodityUpdateUpload = multer({ storage: storage}).single('commodityImages');

module.exports = {
    commodityUpload: commodityUpload,
    startUpload: startUpload,
    guideUpload: guideUpload,
    carouselUpload: carouselUpload,
    commodityUpdateUpload: commodityUpdateUpload
};