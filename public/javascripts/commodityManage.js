$(document).ready(function () {
    $("button#defrayDetail").click(function() {
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
});