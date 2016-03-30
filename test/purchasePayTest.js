var request = require('request');

var options = {
    url: 'http://localhost:3000/commodityManage/purchasePay',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    form: {
        purchaseId: '5',
        purchaseChannel: '支付宝'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}

request.post(options, callback);