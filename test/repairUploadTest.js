var request = require('request');

var options = {
    url: 'http://localhost:3000/repairManage/repairUpload',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    form: {
        'hardwareId': '102',
        'userId': '1',
        'userTel': '13572064152',
        'userAddress': '杭州西湖区教工路8号求是大厦14层2号'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}

request.post(options, callback);