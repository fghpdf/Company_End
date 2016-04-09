var model = require('./model');
var qiniu = require('qiniu');

var qiniuConf = {
    ACCESS_KEY: 'kh1a0eotWq6YMyTrgAsEHbpl-OlT-s3e2suAFjL9',
    SECRET_KEY: 'j5JLmgcLi6ppdFWu0nWKrwaWCNvoY5OHrzVnmGjn'
};

//自用Api，用来获取在七牛上传的token
function getIOSQiniuToken(type ,file, callback) {
    var picToken = '';
    var micToken = '';
    var picSumKey = '';
    var micSumKey = '';
    console.log(file);


    //需要填写你的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = qiniuConf.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = qiniuConf.SECRET_KEY;

    //要上传的空间
    var bucket = 'hekrcompanyplatform';

    if(file.pic !== '0') {
        console.log(file.pic);
        for(var picNum = 0; picNum < parseInt(file.pic); picNum++) {
            //上传到七牛后保存的文件名
            var picKey = type + new Date().getTime() + picNum + '.png';
            //生成上传 Token
            picSumKey += picKey + ';';
            picToken += upToken(bucket, picKey) + ';';
        }
    }

    if(file.mic !== '0') {
        for(var micNum = 0; micNum < parseInt(file.mic); micNum++) {
            //上传到七牛后保存的文件名
            var micKey = type + new Date().getTime() + micNum + '.mp3';
            //生成上传 Token
            micSumKey += micKey + ';';
            micToken += upToken(bucket, micKey) + ';';
        }
    }

    //构建上传策略函数
    function upToken(bucket, key) {
        var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
        return putPolicy.token();
    }

    //回掉传回token和key
    callback(picToken, micToken, micSumKey, picSumKey);
}

//自用Api，用来获取七牛上文件的下载链接
function getQiniuDownloadUrl(key, callback) {
    //需要填写你的 Access Key 和 Secret Key
    qiniu.conf.ACCESS_KEY = qiniuConf.ACCESS_KEY;
    qiniu.conf.SECRET_KEY = qiniuConf.SECRET_KEY;

    //构建私有空间的链接
    var url = 'http://7xsprr.com2.z0.glb.qiniucdn.com/' + key;
    var policy = new qiniu.rs.GetPolicy();

    //生成下载链接url
    var downloadUrl = policy.makeRequest(url);

    callback(downloadUrl);
}

module.exports = {
    getIOSQiniuToken: getIOSQiniuToken,
    getQiniuDownloadUrl: getQiniuDownloadUrl
};

