<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>目标库编辑</title>
    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="/static/css/main.css" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
   
</head>
<body ng-app = "libraryApp" ng-controller = "libraryCtrl">
    <div class="manual-reader">
        {{template "widgets/header.tpl" .}}
        <div class="container manual-body">
            <div class="row">
                <div class="page-left">
                    <ul class="menu" id="sidebar">
                        <li><a href="{{urlfor "ManagerController.Index"}}" class="item"><i class="icon-left lnr lnr-camera-video" aria-hidden="true"></i> 实时监控</a> </li>
                        <li class="active"><a href="{{urlfor "ManagerController.Setting" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                        <li><a href="{{urlfor "ManagerController.Users" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                        <li><a href="{{urlfor "ManagerController.Books" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>

                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
            <div class="page-right">
                <div class="m-box">
                    <div class="box-head">
                        <div class="row">
                            <ol class="breadcrumb">
                                <li><a href="#">
                                    <span class="lnr lnr-users"></span>
                                    <strong>目标库管理</strong>
                                </a></li>
                                <li class="active">目标库编辑</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div class="box-body col-lg-6 col-sm-12 manual-body-edit">
                    <form method="post" id="saveMemberInfoForm" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="name">目标库名称</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" name="name" placeholder="名称" value="{{.Model.Account}}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="description">描述</label>
                            <div class="col-sm-10">
                                <textarea placeholder="描述不能超过500字" class="form-control" rows="3" title="描述" name="description" id="description" maxlength="500" >{{.Model.Description}}</textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" id="btnMemberInfo" class="btn btn-success" data-loading-text="保存中...">保存</button>
                            <span id="form-error-message" class="error-message"></span>
                        </div>
                    </form>

                    <div class="clearfix"></div>

                </div>
            </div>
        </div>
    </div>
    <!--{{template "widgets/footer.tpl" .}}-->
</div>


<script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="/static/js/main.js" type="text/javascript"></script>
<script type="text/javascript">
    $(function () {
        $("#saveMemberInfoForm").ajaxForm({
            beforeSubmit : function () {
                var $then = $("#saveMemberInfoForm");

                var email = $.trim($then.find("input[name='email']").val());
                var password1 = $.trim($then.find("input[name='password1']").val());
                var password2 = $.trim($then.find("input[name='password2']").val());
                if (email === ""){
                    return showError("用户邮箱不能为空!");
                }
                if (password1 !== "" && password1 !== password2){
                    return showError("确认密码不正确!");
                }
                $("#btnMemberInfo").button("loading");
            },success : function (res) {
                if(res.errcode === 0) {
                    showSuccess("保存成功")
                }else{
                    showError(res.message);
                }
                $("#btnMemberInfo").button("reset");
            }
        });
    });
</script>
</body>
</html>