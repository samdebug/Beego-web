<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>用户中心</title>

    <!-- Bootstrap -->
    <link href="/static/bootstrap/css/bootstrap.min.css" rel="stylesheet">
    <link href="/static/font-awesome/css/font-awesome.min.css" rel="stylesheet">

    <link href="/static/css/main.css" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">

</head>
<body>
<div class="manual-reader">
    {{template "widgets/header.tpl" .}}
    <div class="container-fluid manual-body">
        <div class="row">
            <div class="page-left">
                <ul class="menu">
                    <li><a href="{{urlfor "SettingController.Index"}}" class="item"><i class="lnr lnr-user" aria-hidden="true"></i> 基本信息</a></li>
                    <li class="active"><a href="{{urlfor "SettingController.Password"}}" class="item"><i class="lnr lnr-lock" aria-hidden="true"></i> 修改密码</a></li>
                </ul>
            </div>
            <div class="page-right">
                <div class="m-box">
                    <div class="box-head">
                        <div class="row">
                            <ol class="breadcrumb">
                                <li><a href="#">
                                    <span class="lnr lnr-user"></span>
                                    <strong>个人中心</strong>
                                </a></li>
                                <li class="active">修改密码</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div class="box-body manual-body-edit">
                    <form role="form" method="post" id="securityForm" class="form-horizontal">
                        <div id="top-alert-message" class="alert alert-success alert-dismissible" role="alert" style="display:none">
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>
                            <i class="lnr lnr-checkmark-circle"></i>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"  for="password1">原始密码</label>
                            <div class="col-sm-10">
                                <input type="password" name="password1" id="password1" class="form-control disabled" placeholder="原始密码">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"  for="password2">新密码</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" name="password2" id="password2" max="50" placeholder="新密码">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label"  for="password3">确认密码</label>
                            <div class="col-sm-10">
                                <input type="password" class="form-control" id="password3" name="password3" placeholder="确认密码">
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary" data-loading-text="保存中...">保存</button>
                            <!--<span id="form-error-message" class="error-message"></span>-->
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
<script type="text/javascript" src="http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js"></script>
<script src="/static/bootstrap/js/bootstrap.min.js" type="text/javascript"></script>
<script src="/static/js/jquery.form.js" type="text/javascript"></script>
<script src="/static/js/main.js" type="text/javascript"></script>
<script src="/static/toastr/toastr.js" type="text/javascript"></script>

<script type="text/javascript">
    $(function () {
        $("#securityForm").ajaxForm({
            beforeSubmit : function () {
                var oldPasswd = $("#password1").val();
                var newPasswd = $("#password2").val();
                var confirmPassword = $("#password3").val();
                if(!oldPasswd ){
                    //showError("原始密码不能为空");
                    //TopAlert("alert-danger","原始密码不能为空");
                    toastr['warning']('原始密码不能为空');
                    return false;
                }
                if(!newPasswd){
                    //showError("新密码不能为空");
                    //TopAlert("alert-danger","新密码不能为空");
                    toastr['warning']('新密码不能为空');
                    return false;
                }
                if(!confirmPassword){
                    //showError("确认密码不能为空");
                    //TopAlert("alert-danger","确认密码不能为空");
                    toastr['warning']('确认密码不能为空');
                    return false;
                }
                if(confirmPassword !== newPasswd){
                    //showError("确认密码不正确");
                    //TopAlert("alert-danger","确认密码不正确");\
                    toastr['warning']('确认密码不正确');
                    return false;
                }
            },
            success : function (res) {
                if(res.errcode === 0){
                    //showSuccess('保存成功');
                    //TopAlert("alert-success","保存成功");
                    toastr['success']('保存成功');
                    $("#password1").val('');
                    $("#password2").val('');
                    $("#password3").val('');
                }else{
                    //showError(res.message);
                    //TopAlert("alert-danger",res.message);
                    toastr['error'](res.message);

                }
            }
        }) ;
    });
</script>
</body>
</html>