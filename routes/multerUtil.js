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

var upload = multer({ storage: storage}).single('commodityImages');

module.exports = upload;