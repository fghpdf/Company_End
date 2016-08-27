var request = require('request');
var options = {
    url: 'http://uaa.openapi.hekr.me/login',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    form: {
        "pid" : "00000000000",
        "username" : "15869025220",
        "password" : "5978587",
        "clientType" : "WEB"
    }
};
request.post(options, function(error, response, body) {
    console.log(response.statusCode);
    if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var accessToken = result.access_token;
    } else {
    }
});