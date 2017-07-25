<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>视频源管理</title>
    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="/static/css/main.css" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">
   
</head>
<body ng-app = "libraryApp" ng-controller = "libraryCtrl">
    <div class="manual-reader">
        {{template "widgets/header.tpl" .}}
        <div class="container-fluid manual-body">
            <div class="row">
                <div class="page-left">
                    <ul class="menu"  id="sidebar">
                        <li><a href="{{urlfor "ManagerController.Index"}}" class="item"><i class="icon-left lnr lnr-camera-video" aria-hidden="true"></i> 实时监控</a> </li>
                        <li><a href="{{urlfor "LibController.Librarys" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                        <li class="active"><a href="{{urlfor "VideosController.Videos" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                        <li><a href="{{urlfor "ManagerController.Books" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li><a href="{{urlfor "ManagerController.AttachList" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>

                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
            <div class="page-right">
                <div class="m-box">
                    <div class="box-head">
                        <span class="lnr lnr-camera" ></span>
                        <strong class="box-title">视频源管理</strong>
                    </div>
                </div>
                <div class="box-body manager">
                    <div class="main">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="panel panel-default">
                                    <div class="panel-heading">
                                        <div class="action">
                                        <button type="button" data-toggle="modal" data-target="#addVideoDialogModal" class="btn btn-primary btn-sm pull-right">上传视频源</button>
                                        </div>
                                    </div>
                                    <div class="panel-body">
                                        <div class="tab-content" id="videoList">
                                            <template v-if="lists.length <= 0">
                                                <div class="text-center no-resources">
                                                    <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                                    <p>暂无数据</p>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <table class="table table-hover">
                                                    <thead>
                                                    <tr>
                                                        <th>名称</th>
                                                        <th>状态</th>
                                                        <th>路径</th>
                                                        <th>备注</th>
                                                        <th>操作</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {{range $index,$item := .Videos}}
                                                    <tr>
                                                        <td>{{$item.Name}}</td>
                                                        <td>{{$item.Role}}</td>
                                                        <td>{{$item.Url}}</td>
                                                        <td>{{$item.Message}}</td>
                                                        <td>
                                                            <a :href="'{{urlfor "VideosController.UpdateVideo" ":id" $item.Id}}'" class="btn btn-sm btn-primary">编辑</a>
                                                            <button type="button" data-id="{{$item.Id}}" class="btn btn-danger btn-sm" data-target="#deleteVideoModal" data-toggle="modal" data-loading-text="删除中...">删除</button>
                                                        </td>
                                                    </tr>
                                                    {{end}}
                                                    </tbody>
                                                </table>
                                            </template>
                                        </div>
                                    </div>
                                </div><!--/.row--> 
                            </div><!--/.main-->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

    <!-- add Modal -->
    <div class="modal fade" id="addVideoDialogModal" tabindex="-1" role="dialog" aria-labelledby="addVideoDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 655px">
            <form method="post" autocomplete="off" action="{{urlfor "VideosController.AddVideo"}}" id="addVideoDialogForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">添加摄像头</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="url"><span class="error-message">*</span>地址</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="rtsp地址" name="url" id="url">
                        </div>
                    </div> 
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="name"><span class="error-message">*</span>名称</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="不超过100字" name="name" id="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="role"><span class="error-message">*</span>连接方式</label>
                        <div class="col-sm-10">
                            <div class="radio">
                                <label class="radio-inline">
                                    <input type="radio" checked="" name="role" value="1">直连<span class="text"></span>
                                </label>
                                <label class="radio-inline">
                                    <input type="radio" checked="" name="role" value="2">转码<span class="text"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="description">备注</label>
                        <div class="col-sm-10">
                            <textarea name="description" id="description" class="form-control" placeholder="描述信息不超过500个字符" style="height: 90px;"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <span id="form-error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" class="btn btn-primary" id="btnSaveDocument" data-loading-text="保存中...">创建</button>
                </div>
            </div>
            </form>
        </div>
    </div>
<!--END Modal-->

<!-- Delete Video Modal -->
<div class="modal fade" id="deleteVideoModal" tabindex="-1" role="dialog" aria-labelledby="deleteVideoModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" id="deleteVideoForm" action="{{urlfor "VideosController.DelVideo"}}">
            <input type="hidden" name="id" id="delId" value="delId()">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">删除视频源</h4>
                </div>
                <div class="modal-body">
                    <span style="font-size: 14px;font-weight: 400;">确定删除该视频源吗？</span>
                    <p></p>
                    <p class="text error-message">删除视频源后将无法找回。</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" id="btnDeleteVideo" class="btn btn-primary" data-loading-text="删除中...">确定删除</button>
                </div>
            </div>
        </form>
    </div>
</div>
<!--END Modal-->


<script type="text/javascript" src="http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="/static/vuejs/vue.min.js"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="/static/toastr/toastr.js" type="text/javascript"></script>

<script type="text/javascript">
    $(function () {
        $("#addVideoDialogForm").ajaxForm({
            beforeSubmit : function () {
                var name = $.trim($("#name").val());
                var url = $.trim($("#url").val());
                if (name === ""){
                    toastr['warning']('名称不能为空');
                    return false;
                }
                if (url === ""){
                    toastr['warning']('地址不能为空');
                    return false;
                }
            },success : function (res) {
                if(res.errcode === 0){
                    window.location = "{{urlfor "VideosController.Videos"}}";
                }else{
                    console.log(res.message)
                    //showError(res.message,"#form-error-message2");
                    toastr['warning'](res.message);
                }
            }
        });

        $('#deleteVideoModal').on('show.bs.modal', function(e) {
            var id = $(e.relatedTarget).data('id');
            $('#delId').val(id)
        });

        $("#deleteVideoForm").ajaxForm({
            success : function (res) {
                if(res.errcode === 0){
                    window.location = "{{urlfor "VideosController.Videos"}}";
                }else{
                    console.log(res.message)
                    //showError(res.message,"#form-error-message2");
                    toastr['warning'](res.message);
                }
            }
        });

        var app = new Vue({
            el : "#videoList",
            data : {
                lists : {{.Results}}
            },
            delimiters : ['${','}'],
            methods : {
                editPicture : function (id) {
                    var $this = this;
                    $.ajax({
                        url : "{{urlfor "ManagerController.1"}}",
                        type : "post",
                        data : { "member_id":id,"status" : status},
                        dataType : "json",
                        success : function (res) {
                            if (res.errcode === 0) {

                                for (var index in $this.lists) {
                                    var item = $this.lists[index];

                                    if (item.member_id === id) {
                                        console.log(item);
                                        $this.lists[index].status = status;
                                        break;
                                        //$this.lists.splice(index,1,item);
                                    }
                                }
                            } else {
                                //alert("操作失败：" + res.message);
                                toastr['warning']("操作失败：" + res.message);
                            }
                        }
                    })
                }
            }
        });
        Vue.nextTick(function () {
            $("[data-toggle='tooltip']").tooltip();
        });
    });
</script>
</body>
</html>
