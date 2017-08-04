<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>布控任务</title>
    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/css/main.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">
    <link href="https://cdn.bootcss.com/datatables/1.10.15/css/dataTables.bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="manual-reader">
        {{template "widgets/header.tpl" .}}
        <div class="container-fluid manual-body">
            <div class="row">
                <div class="page-left">
                    <ul class="menu"  id="sidebar">
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
                            <span class="lnr lnr-clock" ></span>
                            <strong class="box-title">布控任务</strong>
                        </div>
                    </div>
                    <div class="box-body manager" id="missionList">
                        <div class="main">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="panel panel-default">
                              <div class="panel-heading">
                                <!--<div class="title">
                                  <span class="glyphicon glyphicon-user"></span>布控任务</div>-->
                                <div class="action">
                                  <button type="button" data-toggle="modal" data-target="#addMissionModal" class="btn btn-primary btn-sm pull-right">新建任务</button>
                                </div>
                              </div>
                              <div class="panel-body">
                                <div class="tab-content">
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
                                                <th>编号</th>
                                                <th>任务名称</th>
                                                <th>有效时间</th>
                                                <th>阈值</th>
                                                <th>发现目标数</th>
                                                <th>描述</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {{range $index,$item := .Missions}}
                                            <tr>
                                                <td>{{$index}}</td>
                                                <td>{{$item.Name}}</td>
                                                <td>长期有效</td>
                                                <td>{{$item.Threshold}}%</td>
                                                <td>{{$item.LibId}}</td>
                                                <td>{{$item.Message}}</td>
                                                <td>
                                                    <a :href="'{{urlfor "MissionController.UpdateMission" ":id" $item.Id}}'" class="btn btn-sm btn-primary" >编辑</a>
                                                    <button type="button" data-method="delete" class="btn btn-danger btn-sm" data-id="{{$item.Id}}" data-target="#deleteMissionModal" data-toggle="modal" data-loading-text="删除中...">删除</button>
                                                    <!--<button type="button" class="btn btn-danger btn-sm">开始任务</button>
                                                    <button type="button" class="btn btn-danger btn-sm">中止任务</button>-->
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
    <div class="modal fade" id="addMissionModal" tabindex="-1" role="dialog" aria-labelledby="addMissionModalLabel">
        <div class="modal-dialog" role="document" style="width: 655px">
            <form method="post" autocomplete="off" action="{{urlfor "MissionController.AddMission"}}" id="addMissionDialogForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">新建任务</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="name"><span class="error-message">*</span>名称</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="不超过100字" name="name" id="Name">
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

                    <!--<div class="form-group">
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
                    </div>-->

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="description">备注</label>
                        <div class="col-sm-10">
                            <textarea name="description" id="description" class="form-control" placeholder="描述信息不超过500个字符" style="height: 90px;"></textarea>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="modal-footer">
                    <span id="form-error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" class="btn btn-primary" id="btnSaveDocument" data-loading-text="保存中...">保存</button>
                </div>
            </div>
            </form>
        </div>
    </div>
    <!--END Modal-->

    <!-- Delete Mission Modal -->
    <div class="modal fade" id="deleteMissionModal" tabindex="-1" role="dialog" aria-labelledby="deleteMissionModalLabel">
        <div class="modal-dialog" role="document">
            <form method="post" id="deleteMissionForm" action="{{urlfor "MissionController.DelMission"}}">
                <input type="hidden" name="id" id="delId" value="delId()">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">删除任务</h4>
                    </div>
                    <div class="modal-body">
                        <span style="font-size: 14px;font-weight: 400;">确定删除此任务吗？</span>
                        <p></p>
                        <p class="text error-message-modal">删除后任务将无法找回。</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                        <button type="submit" id="btnDeleteBook" class="btn btn-primary" data-loading-text="删除中...">确定删除</button>
                    </div>
                </div>
            </form>
        </div>
    </div>

    <!-- Delete Mission Modal -->

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/datatables/jquery.dataTables.min.js"}}"></script>
<script src="{{cdnjs "/static/datatables/dataTables.bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/vuejs/vue.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="{{cdnjs "/static/toastr/toastr.js"}}"></script>

<script type="text/javascript">
    $(function () {
        var app = new Vue({
            el : "#missionList",
            data : {
                lists : {{.Missions}}
            },
            delimiters : ['${','}'],
            methods : {
                startMission : function (id) {
                    var $this = this;
                },
                stopMission : function　(){
                    var $this = this;
                }
            }
        });
        Vue.nextTick(function () {
            $("[data-toggle='tooltip']").tooltip();
        });

        addOption();
        function addOption () {
            for (var i=1;i<10;i++){
                $("#threshold").append("<option value=" + (i*10)  + ">" + (i*10) + "%" + "</option>");
            }           
        }

        $("#addMissionDialogForm").ajaxForm({
            beforeSubmit : function () {
                var $then = $("#addMissionDialogForm");
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
            },success : function (res) {
                console.log(res);
                if(res.errcode === 0){
                    window.location = "{{urlfor "MissionController.Missions"}}";
                }else{
                    toastr['warning'](res.message);
                }
            }
        });

        $('#deleteMissionModal').on('show.bs.modal', function(e) {
            var id = $(e.relatedTarget).data('id');
            $('#delId').val(id)
        });

        $("#deleteMissionForm").ajaxForm({
            success : function (res) {
                if(res.errcode === 0){
                    window.location = "{{urlfor "MissionController.Missions"}}";
                }else{
                    console.log(res.message)
                    toastr['warning'](res.message);
                }
            }
        });


    });
</script>
</body>
</html>
