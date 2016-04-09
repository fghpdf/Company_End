$(document).ready(function () {
    //通过js改变form的action的值，预设的值在span里预存
    //启动页
    $(document).ready(function() {
        var appId = $("span#startAppId").text();
        var startAdd = $("#startAddUpload").uploadFile({
            url:"/appManage/startAdd/" + appId,
            fileName:"startImages",
            autoSubmit:false,
            showPreview:true,
            previewHeight: "100px",
            previewWidth: "100px"
        });
        $("#startAddButton").click(function()
        {
            startAdd.startUpload();
        });
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
        var carouselAdd = $("#carouselAddUpload").uploadFile({
            url:"/appManage/carouselAdd/" + appId,
            fileName:"carouselImages",
            autoSubmit:false,
            multiple:true,
            showPreview:true,
            previewHeight: "100px",
            previewWidth: "100px",
            sequential:true,
            sequentialCount:1
        });
        $("#carouselAddButton").click(function()
        {
            carouselAdd.startUpload();
        });
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