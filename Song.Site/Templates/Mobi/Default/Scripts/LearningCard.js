﻿$(function () {
    //学习卡的二维码
    var code = $().getPara("code");
    var pw = $().getPara("pw");
    if ($.trim(code) != "" && $.trim(pw) != "") {
        $("#tbCard").val(code + "-" + pw);
    }
    $('#btn_camera').on('tap', function () {
        $("#upload_qrcode").click();
    });
    qrcode_Decode();
    //学习卡使用的按钮事件
    use_card();
});
window.onload = function () {
   
};
//学习卡充值
function use_card() {
    $("form#formCard").submit(function () {
        //判断是否登录
        var nologin = $("#nologin");
        if (nologin.size() > 0) {
            window.Verify.ShowBox(nologin.find("a"), "请登录");
            return false;
        }
        //开始充值
        var form = $(this);
        var card = form.find("#tbCard").val();
        if ($.trim(card) == "") return false;
        mui('#btnPayCard').button('loading');
        $.post(window.location.href, { action: "paycard", card: card }, function (data) {
            //充值成功
            if (data == "1") {
                mui.toast('使用成功！', { duration: 500, type: 'div' });
                //弹出确认框
                mui.alert("成功", function (e) {
                    document.location.href = "LearningCard.ashx";
                });
            } else {
                mui.toast(data, { duration: 2000, type: 'div' });
                $("#card-error").text(data);
            }
            mui('#btnPayCard').button('reset');
        });
        return false;
    });
}
//二维码解析
function qrcode_Decode() {
    $("#upload_qrcode").change(function (e) {
		setLoading($("#btn_camera img"),"loading");
        var files = e.target.files;
        if (files && files.length > 0) {
            var form = new FormData();
            form.append('file', files[0]);
            form.append('action', 'decode_qrcode');
            $.ajax({
                url: window.location.href,
                type: 'POST',
                data: form,                    // 上传formdata封装的数据
                dataType: 'Text',
                cache: false,                      // 不缓存
                processData: false,                // jQuery不要去处理发送的数据
                contentType: false,                // jQuery不要去设置Content-Type请求头
                success: function (data) {
                    var code = $().getPara(data, "code");
                    var pw = $().getPara(data, "pw");
                    if ($.trim(code) != "" && $.trim(pw) != "") {
                        $("#tbCard").val(code + "-" + pw);
						mui.toast("二维码解析成功", { duration: 2000, type: 'div' });
                    }else{
						mui.toast("无法解析二维码", { duration: 2000, type: 'div' });
					}
					setLoading($("#btn_camera img"),"normal");
                }
            });
        }
    });
}
//设置图片预载状态
//state: loading,或normal
function setLoading(el,state){
	var file=el.attr(state);
	var path=el.attr("src");
	if(path.indexOf("/")>-1){
		path=path.substring(0,path.lastIndexOf("/")+1);
	}
	el.attr("src",path+file);
}
