var request = require('request');

var options = {
    url: 'http://123.59.81.102:8082/webapi/device',
    headers: {
        'Authorization': "Bearer eyJhbGciOiJSUzI1NiJ9.eyJleHAiO" +
        "jE0NTg5MDEyMzIsInVzZXJfbmFtZSI6IjY0NjMz" +
        "NTc5NzM0IiwiYXV0aG9yaXRpZXMiOlsiUk9MRV9" +
        "VU0VSIl0sImp0aSI6ImE5ZDlhNDM5LWE4NzktNG" +
        "E1NS05ODg2LTZlMTVmZmIxODAyOSIsImNsaWVud" +
        "F9pZCI6IjIxMDAwMDAwMDAwMDAwMDAwMDAwMDAi" +
        "LCJzY29wZSI6WyJyZWFkIiwidHJ1c3QiLCJ3cml" +
        "0ZSJdfQ.iVMah9sFmArBNPWuPrwkT_alDLS4rS4" +
        "NQg4aNfIicv-lknkrGRG_EMKXKpQOnnUQ9o25u9" +
        "4lLDR1ZEGz99HVyA",
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
};

function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
        var info = JSON.parse(body);
        console.log("info:", info);
    }
}

request(options, callback);