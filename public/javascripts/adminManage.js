$(document).ready(function () {
    $("button#sureDelete").click(function (e) {
        var deleteAdminEmail = $(this).parent().parent().parent().parent().children().eq(1).text();
        alert(deleteAdminEmail);
    });
    $(document).ready(function() {
        $("a.btn.btn-danger").click(function() {
            var deleteAdminName = $(this).parent().parent().children().eq(0).text();
            var deleteAdminEmail = $(this).parent().parent().children().eq(1).text();
            var choice = confirm("将要删除：" + deleteAdminName);
            if(choice == true) {
                $.ajax({
                    data: {
                        deleteAdminEmail: deleteAdminEmail
                    },
                    url:'/adminManage/deleteAdmin',
                    type: 'POST',
                    success: function(data) {
                        if(data.success) {
                            alert("删除成功");
                            window.location.reload();
                            $(".modal-backdrop").removeClass("in");
                        } else {
                            $('#adminTable').html('失败');
                        }
                    },
                    error: function() {
                        alert("删除失败");
                    }
                });
            }
        });
    });
});