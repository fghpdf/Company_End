$(document).ready(function () {
    //通过js改变form的action的值，预设的值在span里预存
    //启动页
    $(document).ready(function() {
        var appId = $("span#startAppId").text();
        $("form#startAddForm").attr('action', 'startAdd/' + appId);
    });

    $("button#addStart").click(function() {
        var appId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                appId: appId
            },
            url:'/appManage/getAppId',
            type: 'POST',
            success: function(data) {
                if(data.success) {
                    location.href = '/appManage/startAdd?appId=' + data.appId;
                } else {
                    alert("appId错误");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });

    //引导页
    $(document).ready(function() {
        var appId = $("span#guideAppId").text();
        $("form#guideAddForm").attr('action', 'guideAdd/' + appId);
    });

    $("button#addGuide").click(function() {
        var appId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                appId: appId
            },
            url:'/appManage/getAppId',
            type: 'POST',
            success: function(data) {
                if(data.success) {
                    location.href = '/appManage/guideAdd?appId=' + data.appId;
                } else {
                    alert("appId错误");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });

    //轮播页
    $(document).ready(function() {
        var appId = $("span#carouselAppId").text();
        $("form#carouselAddForm").attr('action', 'carouselAdd/' + appId);
    });

    $("button#addCarousel").click(function() {
        var appId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                appId: appId
            },
            url:'/appManage/getAppId',
            type: 'POST',
            success: function(data) {
                if(data.success) {
                    location.href = '/appManage/carouselAdd?appId=' + data.appId;
                } else {
                    alert("appId错误");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });

    //查看详情
    $("button#queryDetail").click(function() {
        var appId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                appId: appId
            },
            url:'/appManage/getAppId',
            type:'POST',
            success: function(data) {
                if (data.success) {
                    location.href = '/appManage/queryDetail?appId=' + data.appId;
                } else {
                    alert("appId获取失败");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });


});