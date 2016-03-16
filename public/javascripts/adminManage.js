$(document).ready(function () {
  $("button#sureDelete").click(function() {
      var adminAccountDelete = $(this).parent().parent().parent().parent().children().eq(1).text();
      $.ajax({
          data: {
              adminAccountDelete: adminAccountDelete
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
  });
});