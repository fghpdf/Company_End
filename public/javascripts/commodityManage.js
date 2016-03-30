$(document).ready(function () {
    //查看订单细节
    $("button#defrayDetail").click(function() {
        //获取ID
        var purchaseId = $(this).parent().parent().children().eq(0).text();
        $.ajax({
            data: {
                purchaseId: purchaseId
            },
            url:'/commodityManage/detailQuery',
            type: 'POST',
            success: function(data) {
                if(data.success) {
                    location.href = '/commodityManage/detail?purchaseId=' + data.purchaseId;
                } else {
                    alert("订单错误");
                }
            },
            error: function() {
                alert("出现错误");
            }
        });
    });
    //删除商品
    $("a.btn.btn-danger").click(function() {
        var deleteCommodityId = $(this).parent().parent().children().eq(0).text();
        var deleteCommodityName = $(this).parent().parent().children().eq(1).text();
        var choice = confirm("将要删除:" + deleteCommodityName + "\n订单商品不会变化，请注意");
        if(choice == true) {
            $.ajax({
                data: {
                    deleteCommodityId: deleteCommodityId
                },
                url:'/commodityManage/deleteCommodity',
                type: 'POST',
                success: function(data) {
                    if(data.success) {
                        alert("删除成功");
                        window.location.reload();
                    } else {
                        $('#adminTable').html('失败');
                    }
                },
                error: function() {
                    alert("删除失败");
                }
            });
        } else {
            alert("取消删除");
        }
    });
    //更改商品信息
    $("a.btn.btn-default").click(function() {
        var commodityId = $(this).parent().parent().children().eq(0).text();
        var commodityName = $(this).parent().parent().children().eq(1).text();
        var choice = confirm("将要更改:" + commodityName + "\n订单商品不会变化，请注意");
        if(choice == true) {
            location.href = "/commodityManage/commodityUpdate?commodityId=" + commodityId;
        } else {
            alert("取消更改");
        }
    });
    //更改url，保含commodityId
    $(document).ready(function() {
        var commodityId = $("span#commodityId").text();
        $("form#commodityUpdateForm").attr('action', 'commodityUpdate/' + commodityId);
    });
});