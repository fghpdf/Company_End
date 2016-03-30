var async = require('async');

var list = [ { id: 1,
    purchaseId: '1',
    commodityId: '2',
    commodityNumber: 2,
    commodityPrice: '128',
    commodityName: '飞机杯' },
    { id: 2,
        purchaseId: '1',
        commodityId: '1',
        commodityNumber: 10,
        commodityPrice: '59',
        commodityName: '拖鞋' } ];

async.eachSeries(list, function(item, callback) {
    console.log('enter:',item.id);
    callback(null, item);
}, function(err) {
    console.log('err:', err);
});