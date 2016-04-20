$(document).ready(function () {

    $("button#addImages").click(function() {
        var appId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                appId: appId
            },
            url:'/appManage/getAppId',
            type: 'POST',
            success: function(data) {
                if(data.success) {
                    location.href = '/appManage/imagesAdd?appId=' + data.appId;
                } else {
                    alert("appId错误");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });

    //通过js改变form的action的值，预设的值在span里预存
    //启动页
    var startAdd = $("button#startAddUpload").uploadFile({
        url: "/appManage/startAdd/" + appId,
        fileName: "startImages",
        autoSubmit:false,
        multiple:true,
        showPreview:true,
        previewHeight: "100px",
        previewWidth: "100px",
        sequential:true,
        sequentialCount:1,
        uploadStr: "上传图片",
        dragDropStr: "<span><b>拖动文件到此处</b></span>",
        abortStr: "取消",
        cancelStr: "取消",
        uploadButtonClass: "ui blue button",
        cancelButtonClass: "ui yellow button"
    });
    $("button#startAddButton").click(function () {
        startAdd.startUpload();
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
    var guideAdd = $("button#guideAddUpload").uploadFile({
        url: "/appManage/guideAdd/" + appId,
        fileName: "guideImages",
        autoSubmit: false,
        multiple: true,
        showPreview: true,
        previewHeight: "100px",
        previewWidth: "100px",
        sequential: true,
        sequentialCount: 1,
        uploadStr: "上传图片",
        dragDropStr: "<span><b>拖动文件到此处</b></span>",
        abortStr: "取消",
        cancelStr: "取消",
        uploadButtonClass: "ui blue button",
        cancelButtonClass: "ui yellow button"
    });
    $("button#guideAddButton").click(function () {
        guideAdd.startUpload();
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
    var carouselAdd = $("button#carouselAddUpload").uploadFile({
        url: "/appManage/carouselAdd/" + appId,
        fileName: "carouselImages",
        autoSubmit: false,
        multiple: true,
        showPreview: true,
        previewHeight: "100px",
        previewWidth: "100px",
        sequential: true,
        sequentialCount: 1,
        uploadStr: "上传图片",
        dragDropStr: "<span><b>拖动文件到此处</b></span>",
        abortStr: "取消",
        cancelStr: "取消",
        uploadButtonClass: "ui blue button",
        cancelButtonClass: "ui yellow button"
    });
    $("button#carouselAddButton").click(function () {
        carouselAdd.startUpload();
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

    $('.ui.dropdown').dropdown();
    $('.message .close').on('click', function () {
        $(this)
            .closest('.message')
            .transition('fade')
        ;
    });
});