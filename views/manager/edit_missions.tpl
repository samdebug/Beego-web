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
    <link href="{{cdncss "/static/css/main.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">
   
</head>
<body ng-app = "videoApp" ng-controller = "videoCtrl">
    <div class="manual-reader">
        {{template "widgets/header.tpl" .}}
        <div class="container-fluid manual-body">
            <div class="row">
                <div class="page-left">
                    <ul class="menu" id="sidebar">
                        <li><a href="{{urlfor "ManagerController.Index"}}" class="item"><i class="icon-left lnr lnr-camera-video" aria-hidden="true"></i> 实时监控</a> </li>
                        <li><a href="{{urlfor "LibController.Librarys" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                        <li><a href="{{urlfor "VideosController.Videos" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                        <li class="active"><a href="{{urlfor "MissionController.Missions" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li><a href="{{urlfor "CompareController.One2ManySearch" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>
                        
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
            <div class="page-right">
                <div class="m-box">
                    <div class="box-head">
                        <div class="row">
                            <ol class="breadcrumb">
                                <li><a href="{{urlfor "VideosController.Videos" }}">
                                    <span class="lnr lnr-users"></span>
                                    <strong>布控任务</strong>
                                </a></li>
                                <li class="active">任务编辑</li>
                                <li>{{.Mission.Name}}</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div class="box-body col-lg-6 col-sm-12 manual-body-edit">
                    <form method="post" id="saveMissionInfoForm" class="form-horizontal">
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="name"><span class="error-message">*</span>名称</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="不超过100字" name="name" id="Name" value="{{.Mission.Name}}">
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="lib"><span class="error-message">*</span>目标库</label>
                            <div class="col-sm-10">
                                <select name="lib" class="form-control" id="lib">
                                    <option value="none">请选择目标库</option>
                                    {{range $index,$item := .Libs}}
                                        <option value={{$item.Id}}>{{$item.Name}}</option>
                                    {{end}}
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="time"><span class="error-message">*</span>有效时间</label>
                            <div class="col-sm-10">
                                <div class="radio">
                                    <label class="radio-inline fancy-checkbox">
                                        <input type="radio" checked="" name="time" value="true">长期有效<span class="text"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="video"><span class="error-message">*</span>视频源</label>
                            <div class="col-sm-10">
                                <select name="video" class="form-control" id="video">
                                    <option value="none">请选择视频源</option>
                                    {{range $index,$item := .Videos}}
                                        <option value={{$item.Id}}>{{$item.Name}}</option>
                                    {{end}}
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="book_name"><span class="error-message">*</span>阈值</label>
                            <div class="col-sm-10">
                                <select name="threshold" class="form-control" id="threshold">
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="book_name">属性告警</label>
                            <div class="col-sm-10">
                                <div class="col-sm-2">
                                    <label class="fancy-checkbox">
                                        <input type="checkbox" name="attentionType" value="1">
                                        <span>眼镜</span>
                                    </label>
                                </div>
                                <div class="col-sm-2">
                                    <label class="fancy-checkbox">
                                        <input type="checkbox" name="attentionType" value="2">
                                        <span>口罩</span>
                                    </label>
                                </div>
                                <div class="col-sm-2">
                                    <label class="fancy-checkbox">
                                        <input type="checkbox" name="attentionType" value="3">
                                        <span>女性</span>
                                    </label>
                                </div>
                                <div class="col-sm-2">
                                    <label class="fancy-checkbox">
                                        <input type="checkbox" name="attentionType" value="4">
                                        <span>男性</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="description">备注</label>
                            <div class="col-sm-10">
                                <textarea name="description" id="description" class="form-control" placeholder="描述信息不超过500个字符" style="height: 90px;">{{.Mission.Message}}</textarea>
                            </div>
                        </div>
                        <div class="form-group">
                            <button type="submit" id="btnVideoInfo" class="btn btn-primary" data-loading-text="保存中...">保存</button>
                            <span id="form-error-message" class="error-message"></span>
                        </div>
                    </form>
                    <div class="clearfix"></div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="{{cdnjs "/static/js/main.js"}}"></script>
<script src="{{cdnjs "/static/toastr/toastr.js"}}"></script>

<script type="text/javascript">
    $(function () {
        $("#saveMissionInfoForm").ajaxForm({
            beforeSubmit : function () {
                var $then = $("#saveMissionInfoForm");
                var name = $.trim($then.find("input[name='name']").val());
                var time = $.trim($then.find("input[name='time']").val());
                var lib = $("#lib").val();
                var video = $("#video").val();

                if (name === ""){
                    toastr['warning']('名称不能为空');
                    return false;
                }
                if (lib === "none"){
                    toastr['warning']('至少选择一个目标库');
                    return false;
                }
                if (time === ""){
                    toastr['warning']('请选择有效时间');
                    return false;
                }
                if (video === "none"){
                    toastr['warning']('至少选择一个视频源');
                    return false;
                }
                $("#btnVideoInfo").button("loading");
            },success : function (res) {
                if(res.errcode === 0) {
                    toastr['success']('保存成功');
                }else{
                    toastr['error'](res.message);
                }
                $("#btnVideoInfo").button("reset");
            }
        });
        addOption();
        setOption();
        function setOption () {
            return;        
        }
        function addOption () {
            for (var i=1;i<10;i++){
                $("#threshold").append("<option value=" + (i*10)  + ">" + (i*10) + "%" + "</option>");
            }           
        }
    });
</script>
</body>
</html>
