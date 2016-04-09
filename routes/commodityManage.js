var express = require('express');
var router = express.Router();

var model = require('../database/model');

var url = require('url');
var async = require('async');

var multer = require('multer');
var upload = require('./multerUtil');
var operateLog = require('../database/operateLog');
var preset = require('../configuration/preset');

//拦截二级域名
router.all('/', preset.isLoggedIn);
router.all('/purchase', preset.isLoggedIn);
router.all('/detailQuery', preset.isLoggedIn);
router.all('/commodityAdd', preset.isLoggedIn);

/*这里需要查询数据库，显示商品列表列表 */
router.get('/commodity', function(req, res, next) {
    res.redirect('/commodityManage/');
});

//显示商品列表
router.get('/', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var commodityList = model.Commodity.query();
    commodityList.select().then(function(model_fetch) {
        res.render('commodityManage/commodity', { title: '商品管理', adminEmail: adminEmail, commodityList: model_fetch});
    });
});

//显示订单列表
router.get('/purchase', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var purchaseList = model.Purchase.query();
    purchaseList.select().then(function(model_fetch) {
        console.log(model_fetch);
        res.render('commodityManage/purchase', { title: '订单管理', adminEmail: adminEmail, purchaseList: model_fetch});
    });
});

//显示订单细节列表
router.get('/detail', function(req, res, next) {
    var purchaseId = url.parse(req.url, true).query.purchaseId;
    var adminEmail = req.session.passport.user;
    var detailQueryPromise = new model.Detail().where('purchaseId', '=', purchaseId).query().select();
    detailQueryPromise.then(function(model_detail) {
        res.render('commodityManage/detail', {title: '订单详情', adminEmail: adminEmail, detailList: model_detail});
    });
});

//处理ajax请求，查看订单细节
router.post('/detailQuery', function(req, res, next) {
    var purchaseId = req.body.purchaseId;
    res.json({ success: true, purchaseId: purchaseId});
});

//商品上传
router.get('/commodityAdd', function(req, res, next) {
    res.render('commodityManage/commodityAdd', {title: '添加商品'});
});


router.post('/commodityAdd', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    upload.commodityUpload(req, res, function(err) {
        if(err) {
            console.log(err);
            res.redirect(303, 'error');
        } else {
            var commodity = req.body;
            var commodityNamePromise = new model.Commodity({ commodityName: commodity.commodityName}).fetch();

            return commodityNamePromise.then(function(model_fetch) {
                if(model_fetch) {
                    res.render('commodityManage/commodityAdd', {title: '添加商品', errorMessage: '该商品已存在！'});
                } else {
                    var addCommodity = new model.Commodity({
                        commodityName: commodity.commodityName,
                        commodityPrice: commodity.commodityPrice,
                        commodityStock: commodity.commodityStock,
                        commodityImg: req.file.path,
                        commodityCategories: commodity.commodityCategories
                    });
                    addCommodity.save().then(function(model_fetch) {
                        //写入日志
                        operateLog.logWrite(adminEmail, '添加商品:' + commodity.commodityName);
                        res.redirect(303, '/commodityManage/commodity');
                    })
                }
            });
        }
    });
});

//删除商品
router.post('/deleteCommodity', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var deleteCommodityId = req.body.deleteCommodityId;
    var deleteCommodityPromise = new model.Commodity({ id: deleteCommodityId});
    deleteCommodityPromise.fetch().then(function(model_fetch) {
        if(model_fetch) {
            var commodityName = model_fetch.get('commodityName');
            deleteCommodityPromise.destroy().then(function(model_delete) {
                //写入日志
                operateLog.logWrite(adminEmail, '删除商品:' + commodityName);
                res.json({ success: true});
                /*//删除在订单详情中的商品
                 var deleteDetailPromise = new model.Detail().where('commodityId', '=', deleteCommodityId).query().select();
                 deleteDetailPromise.then(function(model_query) {
                 async.eachSeries(model_query, function(item, callback) {
                 var deleteId = item.id;
                 var purchaseId = item.purchaseId;
                 //查看订单是否已完成，如果已完成，则不能删除；未完成则可以删除
                 var statusPromise = new model.Purchase({ id: purchaseId}).fetch();
                 statusPromise.then(function(model_status) {
                 var purchaseStatus = model_status.get('purchaseStatus');
                 if(purchaseStatus !== 1) {
                 new model.Detail({ id: deleteId}).destroy().then(function(model_detail) {
                 callback(null, item);
                 });
                 } else {
                 callback(null, item);
                 }
                 })
                 }, function(err) {
                 if(err) {
                 res.json({ success: false, errorMessage: err});
                 } else {
                 //写入日志
                 operateLog.logWrite(adminEmail, '删除商品');
                 res.json({ success: true});
                 }
                 });
                 });*/
            });
        } else {
            res.json({ success: false, errorMessage: '商品不存在'});
        }
    });
});

//更改商品信息
router.get('/commodityUpdate', function(req, res, next) {
    var commodityId = url.parse(req.url, true).query.commodityId;
    res.render('commodityManage/commodityUpdate', { title: '商品信息修改', commodityId: commodityId});
});

router.post('/commodityUpdate/:commodityId', function(req, res, next) {
    var adminEmail = req.session.passport.user;
    var commodityId = req.params.commodityId;
    upload.commodityUpdateUpload(req, res, function(err) {
        if(err) {
            console.log(err);
            res.redirect(303, 'error');
        } else {
            var commodity = req.body;
            var updatePromise = new model.Commodity({ id: commodityId});
            updatePromise.save({
                commodityName: commodity.commodityName,
                commodityPrice: commodity.commodityPrice,
                commodityCategories: commodity.commodityCategories,
                commodityStock: commodity.commodityStock,
                commodityImages: commodity.commodityImages
            }).then(function(model_fetch) {
                //写入日志
                operateLog.logWrite(adminEmail, '更改商品:' + commodity.commodityName);
                res.redirect(303, '/commodityManage/');
            });
        }
    });
});

//订单上传api
router.post('/purchaseAdd', function(req, res, next) {
    var uploadData = req.body;
    var commodityList = uploadData.commodityList;
    var addPurchase = new model.Purchase({
        purchaseCreateDate: new Date(),
        purchasePrice: uploadData.purchasePrice,
        userId: uploadData.userId
    });
    detectStock(commodityList, function(detect_result) {
        console.log(detect_result);
        if(!detect_result.success) {
            res.json({ success: false, errorMessage: '有商品库存不足，请刷新订单重试'});
        } else {
            addPurchase.save().then(function(model_fetch) {
                var purchaseId = model_fetch.get('id');
                detailSave(purchaseId, commodityList, function() {
                    res.json({ success: true, purchaseId: purchaseId});
                });
            });
        }
    });
});

//订单确认api
router.post('/purchasePay', function(req, res, next) {
    var uploadData = req.body;
    console.log(uploadData);
    var payPurchase = new model.Purchase({ id: uploadData.purchaseId});
    payPurchase.fetch().then(function(model_fetch) {
        if(model_fetch) {
            var purchaseStatus = model_fetch.get('purchaseStatus');
            //不允许重复支付订单
            if(purchaseStatus === 1) {
                res.json({ success: false, errorMessage: '此订单已经支付'});
                //不允许支付已经取消的订单
            } else if(purchaseStatus === 2 || purchaseStatus === 3) {
                res.json({ success: false, errorMessage: '此订单已经取消'});
            } else {
                payPurchase.save({
                    purchaseFinishDate: new Date(),
                    purchaseChannel: uploadData.purchaseChannel,
                    purchaseStatus: 1
                }).then(function(result) {
                    saleNumber(uploadData.purchaseId, function() {
                        res.json({ success: true, purchase: result});
                    });
                });
            }
        } else {
            res.json({ success: false, errorMessage: '此订单不存在！'});
        }
    });
});

//订单取消api
router.post('/purchaseCancel', function(req, res, next) {
    var purchaseId = req.body.purchaseId;
    var cancelType = req.body.cancelType;
    //2为用户取消
    if(cancelType === 2 || cancelType === '2') {
        var cancelPurchaseUser = new model.Purchase({ id: purchaseId});
        cancelPurchaseUser.fetch().then(function(model_fetch) {
            if(model_fetch) {
                var purchaseStatus = model_fetch.get('purchaseStatus');
                //不允许取消已经支付的订单
                if(purchaseStatus === 1) {
                    res.json({ success: false, errorMessage: '此订单已经支付'});
                    //不允许重复取消订单
                } else if(purchaseStatus === 2 || purchaseStatus === 3) {
                    res.json({ success: false, errorMessage: '此订单已经取消'});
                } else {
                    cancelPurchaseUser.save({
                        purchaseFinishDate: new Date(),
                        purchaseStatus: 2
                    }).then(function(result) {
                        res.json({ success: true, purchase: result});
                    });
                }
            } else {
                res.json({ success: false, errorMessage: '此订单不存在！'});
            }
        });
        //3为系统取消
    } else if(cancelType === 3 || cancelType === '3') {
        var cancelPurchaseSys = new model.Purchase({ id: purchaseId});
        cancelPurchaseSys.fetch().then(function(model_fetch) {
            if(model_fetch) {
                var purchaseStatus = model_fetch.get('purchaseStatus');
                //不允许取消已经支付的订单
                if(purchaseStatus === 1) {
                    res.json({ success: false, errorMessage: '此订单已经支付'});
                    //不允许重复取消订单
                } else if(purchaseStatus === 2 || purchaseStatus === 3) {
                    res.json({ success: false, errorMessage: '此订单已经取消'});
                } else {
                    cancelPurchaseSys.save({
                        purchaseFinishDate: new Date(),
                        purchaseStatus: 3
                    }).then(function(result) {
                        res.json({ success: true, purchase: result});
                    });
                }
            } else {
                res.json({ success: false, errorMessage: '此订单不存在！'});
            }
        })
    } else {
        res.json({ success: false, errorMessage: 'type类型不对'});
    }
});



//提交订单需对商品数量检测
function  detectStock(commodityList, callback) {
    async.eachSeries(commodityList, function(item, callback_async) {
        new model.Commodity({ id: item.commodityId}).fetch().then(function(model_fetch) {
            var commodityStuck = model_fetch.get('commodityStock');
            if(parseInt(commodityStuck) >= parseInt(item.commodityNumber)) {
                callback_async(null, item);
            } else {
                callback({ success: false, it: item.commodityId});
            }
        });
    }, function(err) {
        console.log(err);
        if(err) {
            callback({ success: false, errorMessage: err});
        } else {
            callback({ success: true});
        }
    });
}

//将订单的详细数据保存在数据库中
//输入是订单号，订单中的商品列表
//回调会给予保存的状态和详情数据库的id
function detailSave(purchaseId, commodityList,callback) {
    var saveStatus = [];
    for(var num = 0; commodityList[num] !== undefined; num++) {
        var detailAddPromise = new model.Detail({
            purchaseId: purchaseId,
            commodityId: commodityList[num].commodityId,
            commodityName: commodityList[num].commodityName,
            commodityPrice: commodityList[num].commodityPrice,
            commodityNumber: commodityList[num].commodityNumber
        }).save().then(function(model_save) {
            if(model_save) {
                saveStatus[num] = { success: true, detailId: model_save.get('id')};
            } else {
                saveStatus[num] = { success: false};
            }
        });
    }
    callback(saveStatus);
}

//通过订单列表的ID查找此订单下的所有商品ID以及购买数量
//拿到商品ID后，在商品列表改商品售出数量
function saleNumber(purchaseId, callback) {
    var saleNumPromise = new model.Detail().where('purchaseId', '=', purchaseId).query().select();
    saleNumPromise.then(function(model_list) {
        async.eachSeries(model_list, function(item, callback_async) {
            var commodityId = item.commodityId;
            //需要加上的销售数量，也是需要减去的库存
            var numberAdd = item.commodityNumber;
            var updatePromise = new model.Commodity({ id: commodityId});
            updatePromise.fetch().then(function(model_fetch) {
                console.log('model:',model_fetch);
                if(model_fetch) {
                    console.log('sur');
                    //之前的销售数量
                    var promiseSold = model_fetch.get('commoditySold');
                    //之前的库存
                    var promiseStock = model_fetch.get('commodityStock');
                    //查看商品是否已经更改
                    var commodityName = model_fetch.get('commodityName');
                    var commodityPrice = model_fetch.get('commodityPrice');
                    if(commodityName === item.commodityName && commodityPrice === item.commodityPrice) {
                        var commoditySold = promiseSold + numberAdd;
                        var commodityStock = promiseStock - numberAdd;
                        updatePromise.save({
                            commoditySold: commoditySold,
                            commodityStock: commodityStock
                        }).then(function() {
                            callback_async(null, item);
                        });
                    } else {
                        console.log('商品更改，不作处理');
                        //商品更改，不作处理
                        callback_async(null, item);
                    }
                } else {
                    console.log('商品被删，不作处理');
                    //商品被删，不作处理
                    callback_async(null, item);
                }
            });
        }, function(result) {
            callback(result);
        });
    });
}


/*//用defray中的commodityId来查找commodity的数据
function  commodityQuery(commodityId) {
    console.log("commodityId:",commodityId);
    return new model.Commodity().where('id', '=', commodityId).query().select();
}*/

/*//detailList将重新填充数据，有和commodityId匹配的id，用来辨认是否是同一个商品
//和commodityName匹配的name，commodityPrice匹配的price
//number用来记录数量，相同则加一
//detailList将用来显示在页面上
function detailListCreate(purchaseId, callback) {
    //通过AJAX传回来的purchaseId来查找defray的数据
    var detailQueryPromise = new model.Defray().where('purchaseId', '=', purchaseId).query().select();
    detailQueryPromise.then(function (model_fetch) {
        var detailList = [];
        //defrayList将记录查询结果
        var defrayList = model_fetch;
        var commodityPromise = commodityQuery(model_fetch[0].commodityId);
        commodityPromise.then(function (model_query) {
            //先把第一个数据赋值进去，后面就可以进行id比对了
            console.log("model_query:", model_query);
            detailList[0] = {
                'id': model_query[0].id,
                'name': model_query[0].commodityName,
                'price': model_query[0].commodityPrice,
                'number': 1
            };
            //用for循环进行id比对，一样就+1，不一样就赋值，defrayNum用来控制defray的查询结果
            //detailNum用来控制detailList，id不一样时，建立新的项
            //所以数据库保存defray务必按照顺序来
            for (var defrayNum = 1; defrayList[defrayNum] !== undefined; defrayNum = defrayNum + 1) {
                var detailNum = 0;
                if (defrayList[defrayNum].commodityId === detailList[detailNum].id) {
                    detailList[detailNum].number++;
                } else {
                    detailNum++;
                    var detailQuery = commodityQuery(defrayList[defrayNum]);
                    detailQuery.then(function (model_query) {
                        detailList[detailNum] = {
                            'id': model_query.id,
                            'name': model_query.commodityName,
                            'price': model_query.commodityPrice,
                            'number': 1
                        }
                    });
                }
            }
            console.log('hehe:', detailList);
            //end step
            callback(detailList);
        });
    });
}*/

module.exports = router;