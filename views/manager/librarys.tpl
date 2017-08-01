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
    <link href="{{cdncss "/static/css/main.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/webuploader/webuploader.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/MultiUpload/control/css/Upload.css"}}" type="text/css" rel="stylesheet" >
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
                        <li class="active"><a href="{{urlfor "LibController.Librarys" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                        <li><a href="{{urlfor "VideosController.Videos" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                        <li><a href="{{urlfor "MissionController.Missions" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li><a href="{{urlfor "CompareController.One2ManySearch" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>

                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
                <div class="page-right" id="LibraryList">
                    <div class="m-box">
                        <div class="row">
                            <ol class="breadcrumb">
                                <li><a href="{{urlfor "LibController.Librarys" }}">
                                    <span class="lnr lnr-users"></span>
                                    <strong>目标库管理</strong>
                                </a></li>
                                <li style="display:none" id="libName">${libName}</li>
                                <!--<li class="active" v-if="moveTo === 'Create'">新建目标</li>
                                <li class="active" v-if="moveTo === 'Edit'">编辑目标</li>-->
                            </ol>
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
                                  <!--<a href="{{urlfor "BookController.Index"}}" class="btn btn-primary btn-sm pull-right" style="margin-left:5px;" v-if="showCreateBtn">新建目标</a>-->
                                  <button type="button" data-toggle="modal" data-target="#addTargetDialogModal" class="btn btn-primary btn-sm pull-right" style="margin-left:5px;" v-if="showCreateBtn" >新建目标</button>
                                  <button type="button" data-toggle="modal" data-target="#addLibraryDialogModal" class="btn btn-primary btn-sm pull-right" v-if="showCreateBtn==false">创建目标库</button>
                                </div>
                              </div>
                              <div class="panel-body tabs">
                                <ul class="nav nav-pills" id="libTabs">
                                  <li class="active" @click="tableclick()"><a href="#table" data-toggle="tab"><span class="fa fa-table"></span></a></li>
                                  <li class="" @click="galleryclick()"><a href="#gallery" data-toggle="tab"><span class="fa fa-folder-o"></span></a></li>
                                  <li class=""><a href="javascript:;" class="backtofolder" style="display:none;" id="backtofolder" @click="backtofolder()">返回上一级</a></li>
                                </ul>
                                
                                <div class="tab-content">
                                      <div class="tab-pane fade active in" id="table" style="padding-top:50px;">
                                        <template v-if="lists.length <= 0">
                                            <div class="text-center no-resources">
                                                <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                                <p>暂无数据</p>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <table class="table table-hover" id="libraryTable">
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
                                                {{range $index,$item := .Libs}}
                                                <tr>
                                                    <td>{{$index}}</td>
                                                    <td>{{$item.Name}}</td>
                                                    <td>{{$item.Role}}</td>
                                                    <td>{{$item.TargetCount}}</td>
                                                    <td>{{$item.PicCount}}</td>
                                                    <td>{{$item.User}}</td>
                                                    <td>{{$item.Created}}</td>
                                                    <td>
                                                        <a :href="'{{urlfor "LibController.UpdateLibrary" ":id" $item.Id}}'" class="btn btn-sm btn-primary" >编辑</a>
                                                        <button type="button" data-id="{{$item.Id}}" class="btn btn-danger btn-sm" data-target="#deleteLibraryModal" data-toggle="modal"  data-loading-text="删除中...">删除</button>
                                                    </td>
                                                </tr>
                                                {{end}}
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
                                            <div class="alldom">
                                                <template v-if="show_targets">
                                                    <!--<p class="targetNum">共有${targetNum}个目标</p>-->
                                                    <template v-if="targets.length <=0">
                                                        <div class="text-center no-resources">
                                                            <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                                            <p>暂无目标</p>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <ul id="divall-pic">
                                                            <li v-for="item in targets">
                                                                <div v-on:mouseenter="hover(item.id)" v-on:mouseleave="hoverout(item.id)">
                                                                    <div class="delete_bar" :id="'target' + item.id">
                                                                        <div style="padding:5px;">
                                                                            <span :data-id="item.id" class="file_del fa fa-times" title="删除" data-target="#deleteTargetModal" data-toggle="modal"></span>
                                                                        </div>
                                                                    </div>
                                                                    <a @click="editTarget(item.id)" href="javascript:;">
                                                                        <img :src="item.url" alt="">
                                                                        <p class="folder-p">${item.name}</p>
                                                                    </a>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <template v-if="lists.length <=0">
                                                        <div class="text-center no-resources">
                                                            <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                                            <p>暂无数据</p>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <ul id="divall">
                                                            {{range $index,$item := .Libs}}
                                                            <a href="javascript:;">
                                                                <li v-on:click="getTarget({{$item.Id}},'{{$item.Name}}')">
                                                                    <p class="folder-p">{{$item.Name}}</p>
                                                                </li>
                                                            </a>
                                                            {{end}}
                                                        </ul> 
                                                    </template>
                                                </template>
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
    </div>

    <!-- add Target Modal-->
    <div class="modal fade" id="addTargetDialogModal" tabindex="-1" role="dialog" aria-labelledby="addTargetDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 1000px">
            <form method="post" autocomplete="off" action="{{urlfor "TargetController.AddTarget"}}" id="addTargetDialogForm" class="form-horizontal">
                <input type="hidden" name="id" id="createId" value="">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">新建目标</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="name"><strong class="text-danger">*</strong>名字</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="不超过20字" name="name" id="name">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="identity"><strong class="text-danger">*</strong>身份证</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="不超过100字" name="identity" id="identity">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="picture"><strong class="text-danger">*</strong>照片</label>
                            <div class="col-sm-8">
                                <input type="hidden" name="photo" id="photo">
                                <div id="demo" class="demo"></div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="sex">性别</label>
                            <div class="col-sm-10">
                                <div class="radio">
                                    <label class="radio-inline">
                                        <input type="radio" checked name="gender" value="male">男<span class="text"></span>
                                    </label>
                                    <label class="radio-inline">
                                        <input type="radio" name="gender" value="female">女<span class="text"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="level">级别</label>
                            <div class="col-sm-10">
                                <div class="radio">
                                    <label class="radio-inline">
                                        <input type="radio" checked name="level" value="2">一般<span class="text"></span>
                                    </label>
                                    <label class="radio-inline">
                                        <input type="radio" name="level" value="1">重点<span class="text"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="age">年龄</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="年龄" name="age" id="age">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="nation">民族</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="民族" name="nation" id="nation">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="col-sm-2 control-label" for="host">籍贯</label>
                            <div class="col-sm-10">
                                <input type="text" class="form-control" placeholder="籍贯" name="host" id="host">
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" id="btnMemberInfo" data-loading-text="保存中...">创建</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
    <!--END Modal-->

    <!-- add Library Modal -->
    <div class="modal fade" id="addLibraryDialogModal" tabindex="-1" role="dialog" aria-labelledby="addLibraryDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 655px">
            <form method="post" autocomplete="off" action="{{urlfor "LibController.AddLibrary"}}" id="addLibraryDialogForm" class="form-horizontal">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title" id="myModalLabel">创建目标库</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="name"><strong class="text-danger">*</strong>名称</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" placeholder="不超过100字" name="name" id="name">
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-2 control-label" for="role"><strong class="text-danger">*</strong>属性</label>
                        <div class="col-sm-10">
                            <select name="role" class="form-control" id="role">
                                <option value="1">普通</option>
                                <option value="2">黑名单</option>
                                <option value="3">罪犯</option>
                            </select>
                        </div>
                    </div>
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
                    <button type="submit" class="btn btn-primary" id="btnAddLibrary" data-loading-text="保存中...">创建</button>
                </div>
            </div>
            </form>
        </div>
    </div>
<!--END Modal-->
<!-- Delete Library Modal -->
<div class="modal fade" id="deleteLibraryModal" tabindex="-1" role="dialog" aria-labelledby="deleteLibraryModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" id="deleteLibraryForm" action="{{urlfor "LibController.DelLibrary"}}">
            <input type="hidden" name="id" id="delId" value="delId()">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">删除目标库</h4>
                </div>
                <div class="modal-body">
                    <span style="font-size: 14px;font-weight: 400;">确定删除此目标库吗？</span>
                    <p></p>
                    <p class="text error-message-modal">删除后目标库将无法找回。</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" id="btnDeleteBook" class="btn btn-primary" data-loading-text="删除中...">确定删除</button>
                </div>
            </div>
        </form>
    </div>
</div>

<!-- Delete Target Modal -->
<div class="modal fade" id="deleteTargetModal" tabindex="-1" role="dialog" aria-labelledby="deleteTargetModalLabel">
    <div class="modal-dialog" role="document">
        <form method="post" id="deleteTargetForm" action="{{urlfor "TargetController.DelTarget"}}">
            <input type="hidden" name="id" id="delId2" value="delId2()">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 class="modal-title">删除目标</h4>
                </div>
                <div class="modal-body">
                    <span style="font-size: 14px;font-weight: 400;">确定删除此目标吗？</span>
                    <p></p>
                    <p class="text error-message-modal">删除后目标将无法找回。</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                    <button type="submit" id="btnDeleteBook" class="btn btn-primary" data-loading-text="删除中...">确定删除</button>
                </div>
            </div>
        </form>
    </div>
</div>

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/datatables/jquery.dataTables.min.js"}}"></script>
<script src="{{cdnjs "/static/datatables/dataTables.bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/vuejs/vue.min.js"}}"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="{{cdnjs "/static/toastr/toastr.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/main.js"}}" type="text/javascript"></script>
<!--多图片上传-->
<script src="{{cdnjs "/static/MultiUpload/core/File.js"}}"></script>
<script src="{{cdnjs "/static/MultiUpload/control/js/Upload.js"}}"></script>

<script type="text/javascript">
    $(function () {
        /*for (var i=0;i<5;i++) {
            setTimeout(function(){
                console.log(new Date,i);
            },1000);
        }
        console.log(new Date,i);*/

        /*(function func(){
            var a = b = 3;
        });
        console.log(typeof(a));
        console.log(typeof(b));*/

        /*var a= 1;
        function func(){
            console.log(a);
            var a = "in function";
        }
        func();
        console.log(a);*/

        /*function func1(){
            var n = 99;
            nAdd = function() {
                this.n +=1;
                console.log(this.n);
            };
            function func2(){
                console.log(n);
            }
            return func2;
        }

        var result = func1(); 
        result(); //99;
        nAdd(); // 由于nAdd是全局变量。故不是undefined。
        result(); //99*/

        /*var myObject = {
            foo:"bar",
            func:function(){
                var self = this;
                console.log(this.foo);//bar
                console.log(self.foo);//bar
                (function(){
                    console.log(this.foo);//undefined
                    console.log(self.foo);//bar 顺序很重要！！！！！！
                })();
            }
        }
        myObject.func();*/

        var k=c=0;
        function a(n){
            return n?(n-1)*a(n-1):n;
            console.log(123);
            k++;c++;
            if(c>10) return c;
        }

        console.log(a(5)); //0???????????????????????????
        console.log(k); //0
        console.log(c); //0

        var app = new Vue({
            el : "#LibraryList",
            data : {  
                lists : {{.Results}},            
                show_targets:false,
                showCreateBtn:false,
                libName:"",
                libId:"",
                targets: [],
                targetNum:0
            },
            delimiters : ['${','}'],
            methods : {
                hover: function (id) {
                    var $this = this;
                    $("#target" + id).addClass("file_hover");
                },
                hoverout: function (id) {
                    var $this = this;
                    $("#target" + id).removeClass("file_hover");
                },  
                getTarget : function (id,name) {
                    var $this = this;
                    $this.show_targets = true;
                    $this.showCreateBtn = true;
                    $("#backtofolder").show();
                    $this.libName = name;
                    $this.libId = id;
                    
                    $("#libName").show();
                    $("#createId").val(id);
                    $.ajax({
                        //var ids = "222";
                        //console.log("'{{urlfor "TargetController.TargetJson" ":lib" "ids"}}'");
                        url : "/manager/librarys/" + id + "/targetJsons",
                        type : "get",
                        success : function (res) {
                            console.log(res);
                            if (res.status === "success") {
                                $this.targetNum = res.detail.length;
                                $this.targets = res.detail;
                            } else {
                                toastr['error']('操作失败' + res.description);
                                return false;
                            }
                        }
                    });
                },
                editTarget: function (id) {
                    var $this = this;
                    window.location = "/manager/librarys/" + $this.libId + "/targets/" + id;
                    //console.log("{{urlfor "TargetController.UpdateTarget"}}");
                },
                backtofolder : function () {
                    var $this = this;
                    $this.show_targets = false;
                    $this.showCreateBtn = false;
                    $this.targets = [];
                    $this.libName = "";
                    $this.libId = "";
                    $("#backtofolder").hide();
                    $("#libName").hide();
                    $("#createId").val("");
                },
                tableclick : function () {
                    var $this = this;
                    $("#backtofolder").hide();
                },
                galleryclick : function () {
                    var $this = this;
                    if ($this.show_targets) {
                        $("#backtofolder").show();
                    }else {
                        $("#backtofolder").hide();
                    }
                        
                }
            }
        });

        /*设置localstorage跳转回目录*/
        var LibraryId = localStorage.getItem("LibraryId");
        var LibraryName = localStorage.getItem("LibraryName");
        var LibStatus = localStorage.getItem("LibStatus");
        if(LibraryId != null && LibraryName !=null && LibStatus){
            app.getTarget(LibraryId,LibraryName);
            localStorage.removeItem("LibraryId");
            localStorage.removeItem("LibraryName");
            localStorage.removeItem("LibStatus");
            $('#libTabs li:eq(1) a').tab('show');
        }

        $("#demo").zyUpload({
            width            :   "100%",                 // 宽度
            height           :   "400px",                 // 宽度
            itemWidth        :   "100px",                 // 文件项的宽度
            itemHeight       :   "122px",                 // 文件项的高度
            url              :   "{{urlfor "TargetController.UploadTarget"}}",  // 上传文件的路径
            multiple         :   true,                    // 是否可以多个文件上传
            dragDrop         :   true,                    // 是否可以拖动上传文件
            del              :   true,                    // 是否可以删除文件
            finishDel        :   false,                   // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles){                    // 选择文件的回调方法
            },
            onDelete: function(file, surplusFiles){                 // 删除一个文件的回调方法
                $("#photo").val(JSON.stringify(surplusFiles));
            },
            onSuccess: function(file,rep,files){                    // 文件上传成功的回调方法
                $("#photo").val(JSON.stringify(files));
            },
            onFailure: function(file,rep,files){                    // 文件上传失败的回调方法
                toastr['error'](rep);
            },
            onComplete: function(responseInfo){                     // 上传完成的回调方法
            }
        });
        $(".upload_btn").hide();
        $("#submitBtn").hide();
        $('#deleteLibraryModal').on('show.bs.modal', function(e) {
            var id = $(e.relatedTarget).data('id');
            $('#delId').val(id)
        });

        $('#deleteTargetModal').on('show.bs.modal', function(e) {
            var id = $(e.relatedTarget).data('id');
            $('#delId2').val(id);
        });

        /*$("#addTargetDialogModal").on("hidden.bs.modal", function() {
            $(this).removeData("bs.modal");
        });*/
        
        $("#addLibraryDialogForm").ajaxForm({
            beforeSubmit : function () {
                var $then = $("#addLibraryDialogForm");
                var name = $.trim($then.find("input[name='name']").val());
                if (name === ""){
                    toastr['warning']('名称不能为空');
                    return false;
                }
            },success : function (res) {
                console.log(res);
                if(res.errcode === 0){
                    window.location = "{{urlfor "LibController.Librarys"}}";
                }else{
                    toastr['warning'](res.message);
                }
            }
        });

        $("#deleteLibraryForm").ajaxForm({
            success : function (res) {
                if(res.errcode === 0){
                    window.location = "{{urlfor "LibController.Librarys"}}";
                }else{
                    //showError(res.message,"#form-error-message2");
                    toastr['warning'](res.message);
                }
            }
        });       

        $("#deleteTargetForm").ajaxForm({
            success : function (res) {
                if(res.errcode === 0){
                    //window.location = "{{urlfor "LibController.Librarys"}}";
                    $('#deleteTargetModal').modal("hide");
                    app.getTarget(app.libId,app.libName);
                }else{
                    //showError(res.message,"#form-error-message2");
                    toastr['warning'](res.message);
                }
            }
        });    

        $("#addTargetDialogForm").ajaxForm({
            beforeSubmit : function () {
                var name = $.trim($("#name").val());
                var identity = $.trim($("#identity").val());  
                if (name === ""){
                    toastr['warning']('名称不能为空');
                    return false;
                }
                if (identity === ""){
                    toastr['warning']('身份证不能为空');
                    return false;
                }
                if ($(".upload_append_list").length = 0) {
                    toastr['warning']('请选择照片');
                    return false;   
                }
            },success : function (res) {
                console.log(res);
                if(res.errcode === 0) {
                    $('#addTargetDialogModal').modal("hide");
                    app.getTarget(app.libId,app.libName);
                }else{
                    toastr['warning'](res.message);
                }
            }
        });     

        $(document).ready(function() {
            $('#libraryTable').dataTable({
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
        
        /*$(".thumbnail").hover(function(){
            $(".hover-edit").show();
        },function(){
            $(".hover-edit").hide();
        });

        Vue.nextTick(function () {
            $("[data-toggle='tooltip']").tooltip();
        });*/
    });
</script>
</body>
</html>
