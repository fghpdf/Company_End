var express = require('express');
var router = express.Router();

var model = require('../database/model');

var url = require('url');
var async = require('async');

var multer = require('multer');
var upload = require('./multerUtil');
//var upload = multer({ dest: 'public/images'});


router.all('/', isLoggedIn);
router.all('/purchase', isLoggedIn);
router.all('/detailQuery', isLoggedIn);
router.all('/commodityAdd', isLoggedIn);

/*这里需要查询数据库，显示商品列表列表 */
router.get('/commodity', function(req, res, next) {
    res.redirect('/commodityManage/');
});

//显示商品列表
router.get('/', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var commodityList = model.Commodity.query();
    commodityList.select().then(function(model_fetch) {
        console.log(model_fetch);
        console.log(companyEmail);
        res.render('commodityManage/commodity', { title: '商品管理', companyEmail: companyEmail, commodityList: model_fetch});
    });
});

//显示订单列表
router.get('/purchase', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var purchaseList = model.Purchase.query();
    purchaseList.select().then(function(model_fetch) {
        console.log(model_fetch);
        res.render('commodityManage/purchase', { title: '订单管理', companyEmail: companyEmail, purchaseList: model_fetch});
    });
});

//显示订单细节列表
router.get('/detail', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    var purchaseId = url.parse(req.url, true).query.purchaseId;
    detailListCreate(purchaseId, function(detailList) {
        console.log(detailList);
        res.render('commodityManage/detail', {title: '订单详情', companyEmail: companyEmail, detailList: detailList});
    });
});

//处理ajax请求，查看订单细节
router.post('/detailQuery', function(req, res, next) {
    var purchaseId = req.body.purchaseId;
    res.json({success: true,purchaseId: purchaseId});
});

router.get('/commodityAdd', function(req, res, next) {
    res.render('commodityManage/commodityAdd', {title: '添加商品'});
});

//商品上传
router.post('/commodityAdd', function(req, res, next) {
    var companyEmail = req.session.passport.user;
    upload(req, res, function(err) {
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
                        commodityImg: req.file.path
                    });
                    addCommodity.save().then(function(model_fetch) {
                        console.log('model_fetch_save:', model_fetch);
                        res.redirect(303, 'commodity');
                    })
                }
            });
        }
    });
});

//用defray中的commodityId来查找commodity的数据
function  commodityQuery(commodityId) {
    console.log("commodityId:",commodityId);
    return new model.Commodity().where('id', '=', commodityId).query().select();
}

//detailList将重新填充数据，有和commodityId匹配的id，用来辨认是否是同一个商品
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
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = router;