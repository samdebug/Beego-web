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
    <link href="/static/css/main.css" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
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
                        <li class="active"><a href="{{urlfor "ManagerController.Books" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li><a href="{{urlfor "ManagerController.AttachList" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>
                        
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
                    <div class="box-body manager">
                        <div class="main">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="panel panel-default">
                              <div class="panel-heading">
                                <!--<div class="title">
                                  <span class="glyphicon glyphicon-user"></span>布控任务</div>-->
                                <div class="action">
                                  <button type="button" data-toggle="modal" data-target="#addtaskModal" class="btn btn-primary btn-sm pull-right">新建任务</button>
                                </div>
                              </div>
                              <div class="panel-body">
                                <div class="tab-content" id="userList">
                                    <template v-if="lists.length <= 0">
                                        <div class="text-center no-resources">
                                            <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                            <p>暂无数据</p>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <table class="table table-hover" id="taskTable">
                                            <thead>
                                            <tr>
                                                <th>编号</th>
                                                <th>任务名称</th>
                                                <th>有效时间</th>
                                                <th>阈值</th>
                                                <th>发现目标数</th>
                                                <th>操作</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr v-for="item in lists">
                                                <td>${item.id}</td>
                                                <td>${item.name}</td>
                                                <td>${item.role}</td>
                                                <td>${item.aim_count}</td>
                                                <td>${item.pic_count}</td>
                                                <td>
                                                    <a :href="'{{urlfor "ManagerController.EditMember" ":id" ""}}' + item.id" class="btn btn-sm btn-primary" @click="editMember(item.id)">开始任务</a>
                                                    <button type="button" data-method="delete" class="btn btn-danger btn-sm" data-id="{$item.id}" data-loading-text="删除中...">中止任务</button>
                                                </td>
                                            </tr>
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
    <div class="modal fade" id="addtaskModal" tabindex="-1" role="dialog" aria-labelledby="addBookDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 655px">
            <form method="post" autocomplete="off" action="{{urlfor "ManagerController.CreateMember"}}" id="addBookDialogForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">新建布控任务</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">名称<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="(不超过100字)" name="book_name" id="bookName">
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">目标库<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <select name="role" class="form-control">
                                <option value="1">请选择目标库</option>
                                <option value="2">普通</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">有效时间<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <div class="radio">
                                <label class="radio-inline fancy-checkbox">
                                    <input type="radio" checked="" name="ENABLE_ANONYMOUS" value="true">长期有效<span class="text"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">视频源<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <select name="role" class="form-control">
                                <option value="1">请选择目标库</option>
                                <option value="2">普通</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">属性告警<span class="error-message">*</span></label>
                        <div class="col-sm-10" class="inputCheckbox">
                            <div class="col-sm-2">
                                <label class="fancy-checkbox">
                                    <input type="checkbox">
                                    <span>眼镜</span>
                                </label>
                            </div>
                            <div class="col-sm-2">
                                <label class="fancy-checkbox">
                                    <input type="checkbox">
                                    <span>口罩</span>
                                </label>
                            </div>
                            <div class="col-sm-2">
                                <label class="fancy-checkbox">
                                    <input type="checkbox">
                                    <span>女性</span>
                                </label>
                            </div>
                            <div class="col-sm-2">
                                <label class="fancy-checkbox">
                                    <input type="checkbox">
                                    <span>男性</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">阈值<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <select name="role" class="form-control" id="threshold">
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">备注</label>
                        <div class="col-sm-10">
                            <textarea name="description" id="description" class="form-control" placeholder="备注(描述信息不超过500个字符)" style="height: 90px;"></textarea>
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
    </div><!--END Modal-->

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/datatables/jquery.dataTables.min.js"}}"></script>
<script src="{{cdnjs "/static/datatables/dataTables.bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="/static/vuejs/vue.min.js"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script type="text/javascript">
    $(function () {
        addOption();
        function addOption () {
            for (var i=1;i<=100;i++){
                $("#threshold").append("<option value=" + i  + ">" + i + "%" + "</option>");
            }           
        }
        var app = new Vue({
            el : "#userList",
            data : {
                lists : [{"name":"目标库1", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"},{"name":"目标库2", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"}]
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
                                alert("操作失败：" + res.message);
                            }
                        }
                    })
                }
            }
        });
        Vue.nextTick(function () {
            $("[data-toggle='tooltip']").tooltip();
        });
        $(document).ready(function() {
            $('#taskTable').dataTable({
                "sPaginationType" : "full_numbers",
                "oLanguage" : {
                    "sLengthMenu": "每页显示 _MENU_ 条记录",
                    "sZeroRecords": "抱歉， 没有找到",
                    "sInfo": "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
                    "sInfoEmpty": "没有数据",
                    "sInfoFiltered": "(从 _MAX_ 条数据中检索)",
                    "sZeroRecords": "没有检索到数据",
                     "sSearch": "搜索:",
                    "oPaginate": {
                    "sFirst": "首页",
                    "sPrevious": "前一页",
                    "sNext": "后一页",
                    "sLast": "尾页"
                    }     
                }
            });
        });
    });
</script>
</body>
</html>