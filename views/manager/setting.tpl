<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>目标库管理</title>
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
                    <ul class="menu"  id="sidebar">
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
                            <strong class="box-title">目标库管理</strong>
                        </div>
                    </div>
                    <div class="box-body manager">
                        <div class="main">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="panel panel-default">
                              <div class="panel-heading">
                                <!--<div class="title">
                                  <span class="glyphicon glyphicon-user"></span>目标库管理</div>-->
                                <div class="action">
                                  <button type="button" data-toggle="modal" data-target="#addLibraryModal" class="btn btn-primary btn-sm pull-right">创建目标库</button>
                                </div>
                              </div>
                              <div class="panel-body tabs">
                                <ul class="nav nav-pills">
                                  <li class="active" id="List"><a href="#table" data-toggle="tab"><span class="lnr lnr-line-spacing"></span></a></li>
                                  <li class=""><a href="#gallery" data-toggle="tab"><span class="lnr lnr-tablet"></span></a></li>
                                  <li class=""><a href="#" class="backtofolder" style="display:none;" id="backtofolder">返回上一级</a></li>
                                </ul>
                                
                                <div class="tab-content" id="userList">
                                      <div class="tab-pane fade active in" id="table">
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
                                                    <th>目标库名称</th>
                                                    <th>属性</th>
                                                    <th>目标数</th>
                                                    <th>照片数</th>
                                                    <th>创建人</th>
                                                    <th>创建时间</th>
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
                                                    <td>${item.user}</td>
                                                    <td>${item.created}</td>
                                                    <td>
                                                        <a :href="'{{urlfor "ManagerController.EditMember" ":id" ""}}' + item.id" class="btn btn-sm btn-primary" @click="editMember(item.id)">编辑</a>
                                                        <button type="button" data-method="delete" class="btn btn-danger btn-sm" data-id="{$item.id}" data-loading-text="删除中...">删除</button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </template>
                                    </div>
                                    <div class="tab-pane fade" id="gallery">
                                        <template v-if="lists.length <= 0">
                                            <div class="text-center no-resources">
                                                <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                                <p>暂无数据</p>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="gallery">
                                              <div class="thumbnail" v-for="item in lists" >
                                                <span class="folder" @click="editPicture(item.id)"><span class="file"></span></span>
                                                <div class="title">${item.name}</div>
                                              </div>
                                            </div>
                                        </template>
                                    </div>
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
        {{template "widgets/footer.tpl" .}}
    </div>

    <!-- add Modal -->
    <div class="modal fade" id="addLibraryModal" tabindex="-1" role="dialog" aria-labelledby="addBookDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 655px">
            <form method="post" autocomplete="off" action="{{urlfor "ManagerController.CreateMember"}}" id="addBookDialogForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">创建目标库</h4>
                </div>
                <div class="modal-body">
                                        <div class="form-group">
                        <label class="col-sm-2 control-label" for="book_name">名称<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="(不超过100字)" name="book_name" id="bookName">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="description">备注</label>
                        <div class="col-sm-10">
                            <textarea name="description" id="description" class="form-control" placeholder="(描述信息不超过500个字符)" style="height: 90px;"></textarea>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="role">属性<span class="error-message">*</span></label>
                        <div class="col-sm-10">
                            <select name="role" class="form-control">
                                <option value="1">黑名单</option>
                                <option value="2">普通</option>
                            </select>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
                <div class="modal-footer">
                    <span id="form-error-message"></span>
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" class="btn btn-primary" id="btnSaveDocument" data-loading-text="保存中...">创建</button>
                </div>
            </div>
            </form>
        </div>
    </div><!--END Modal-->

<script type="text/javascript" src="http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="/static/vuejs/vue.min.js"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script type="text/javascript">
    function a() {
        console.log(a);
    }
    a();
    $(function () {
        console.log("{{urlfor "LibController.Librarys"}}")
        console.log("{{urlfor "ManagerController.UpdateMemberStatus"}}")
        console.log({{.Results}})
        var app = new Vue({
            el : "#userList",
            data : {
                //lists: {{.Results}}
                lists : [{"name":"目标库1222", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"},{"name":"目标库2", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"}]
            },
            delimiters : ['${','}'],
            methods : {
                editPicture : function (id) {
                    var $this = this;
                    $.ajax({
                        url : "{{urlfor "LibController.Librarys"}}",
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
        $("#backtofolder,#List").click(function(){
          $("#backtofolder").hide();
        });

        $(".thumbnail").click(function(){
          $("#backtofolder").show();
        });
    });
</script>
</body>
</html>
