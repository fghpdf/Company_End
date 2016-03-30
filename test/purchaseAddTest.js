var request = require('request');

var options = {
    url: 'http://localhost:3000/commodityManage/purchaseAdd',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    form: {
        'commodityList': [
            {
                'commodityName': '坦克杯',
                'commodityId': '4',
                'commodityPrice': 79999,
                'commodityNumber': 1
            },
            {
                'commodityName': '飞机杯',
                'commodityId': '5',
                'commodityPrice': 128,
                'commodityNumber': 1
            }
        ],
        'purchasePrice': 79999,
        'userId': '2'
    }
};

console.log(options.form.commodityList);

console.log(options.form.commodityList.length);

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}

request.post(options, callback);