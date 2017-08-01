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
    <link href="{{cdncss "/static/MultiUpload/control/css/Upload.css"}}" type="text/css" rel="stylesheet" >
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">
</head>
<body>
    <div class="manual-reader" id="editTargets">
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
            <div class="page-right" >
                <div class="m-box">
                    <div class="box-head">
                        <div class="row">
                            <ol class="breadcrumb">
                                <li><a href="javascript:;" @click="backToBeforeLibarary">
                                    <span class="lnr lnr-users"></span>
                                    <strong>目标库管理</strong>
                                </a></li>
                                <li><a href="javascript:;" @click="backToAfterLibarary">
                                    <strong>{{.Target.LibraryName}}</strong>
                                </a></li>
                                <li>目标编辑</li>
                                <li>{{.Target.Name}}</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div class="box-body">
                    <div class="main" >
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="panel panel-default">
                                    <!--<div class="panel-heading">
                                        <div class="action">
                                            <button type="button" data-toggle="modal" @click="CreateTarget()" data-target="#addTargetModal" class="btn btn-primary btn-sm pull-right" style="margin-left: 5px;" style="display:none">新建目标</button>
                                        </div>
                                    </div>-->
                                <div class="panel-body" >
                                    <form method="post" autocomplete="off" id="saveTargetInfoForm" class="form-horizontal">
                                        <input type="hidden" name="pictures" id="pictures" value="">
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="name"><span class="error-message">*</span>名字</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="不超过20字" name="name" id="name" value="{{.Target.Name}}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="identity"><span class="error-message">*</span>身份证</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="不超过100字" name="identity" id="identity"value="{{.Target.Identity}}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="picture"><span class="error-message">*</span>照片</label>
                                            <div class="col-sm-8">
                                                <button type="button" data-toggle="modal" data-target="#addPictureDialogModal" class="btn btn btn-default" style="float:none;"><i class="fa fa-plus"></i>添加照片</button>
                                                <div class="alldom" style="margin-left: -9px;">
                                                    <ul id="divall-pic-pictures">
                                                        <li :id="'pic' + index" v-for="(item,index) in pictures" v-bind:class="{ editPictureList_success: item.feature!='', 'editPictureList_fail': item.feature=='' }">
                                                            <div v-on:mouseenter="hover(item.id)" v-on:mouseleave="hoverout(item.id)">
                                                                <div class="delete_bar" :id="item.id">
                                                                    <div style="padding:5px;">
                                                                        <span class="file_del fa fa-times" title="删除" @click="delPicture(item.id)"></span>
                                                                    </div>
                                                                </div>
                                                                <a href="javascript:;">
                                                                    <img :src="item.url" alt="">
                                                                </a>
                                                                <p class="file_failure" style="display: block;" v-if="item.feature==''"></p>
                                                                <p class="file_success" style="display: block;" v-if="item.feature!=''"></p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="sex">性别</label>
                                            <div class="col-sm-10">
                                                <div class="radio">
                                                    <label class="radio-inline">
                                                        <input type="radio" {{if eq .Target.Gender "male"}}checked{{end}} name="gender" value="male">男<span class="text"></span>
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" {{if eq .Target.Gender "female"}}checked{{end}} name="gender" value="female">女<span class="text"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="level">级别</label>
                                            <div class="col-sm-10">
                                                <div class="radio">
                                                    <label class="radio-inline">
                                                        <input type="radio" {{if eq .Target.Level 1}}checked{{end}} name="level" value="1">重点<span class="text"></span>
                                                    </label>
                                                    <label class="radio-inline">
                                                        <input type="radio" {{if eq .Target.Level 2}}checked{{end}} name="level" value="2">一般<span class="text"></span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="age">年龄</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="请输入年龄" name="age" id="age"value="{{.Target.Age}}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="nation">民族</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="民族" name="nation" id="nation"value="{{.Target.Nation}}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="host">籍贯</label>
                                            <div class="col-sm-10">
                                                <input type="text" class="form-control" placeholder="籍贯" name="host" id="host"value="{{.Target.Host}}">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-2 control-label" for="description">备注</label>
                                            <div class="col-sm-10">
                                                <textarea name="description" id="description" class="form-control" placeholder="描述信息不超过500个字符" style="height: 90px;">{{.Target.Message}}</textarea>
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <button type="submit" id="btnMemberInfo" class="btn btn-primary" data-loading-text="保存中...">保存</button>
                                        </div>
                                    </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- add Picture Modal-->
    <div class="modal fade" id="addPictureDialogModal" tabindex="-1" role="dialog" aria-labelledby="addPictureDialogModalLabel">
        <div class="modal-dialog" role="document" style="width: 800px;">
            <form method="post" autocomplete="off" action="javascript:void(0);" id="addPictureDialogForm" class="form-horizontal">
                <input type="hidden" name="newPicture" id="newPicture" value="">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title" id="myModalLabel">添加照片</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <div class="col-sm-12">
                                <input type="hidden" name="photo" id="photo">
                                <div id="demo" class="demo"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
                        <button type="submit" class="btn btn-primary" @click="addPicture()" id="addPictureModal" data-loading-text="保存中...">添加</button>
                    </div>
                </div>     
            </form>
        </div>
    </div>
    <!--END Modal-->
</div>

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="{{cdnjs "/static/js/main.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/toastr/toastr.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/vuejs/vue.min.js"}}"></script>

<!--多图片上传-->
<script src="{{cdnjs "/static/MultiUpload/core/File.js"}}"></script>
<script src="{{cdnjs "/static/MultiUpload/control/js/Upload.js"}}"></script>
<script type="text/javascript">
    $(function () {
        var app = new Vue({
            el : "#editTargets",
            data : {  
                pictures: {{.Target.Pictures}}
            },
            delimiters : ['${','}'],
            methods : {
                hover: function (id) {
                    var $this = this;
                    $("#" + id).addClass("file_hover");
                },
                hoverout: function (id) {
                    var $this = this;
                    $("#" + id).removeClass("file_hover");
                },  
                delPicture : function (id) {
                    var $this = this;
                    //$("#pic" + id).hide();
                    $this.pictures = $this.pictures.removeByValue(id);
                    $("#pictures").val(JSON.stringify($this.pictures));
                },
                backToLibrary: function() {
                    console.log(123);
                },
                backToBeforeLibarary: function () {
                    window.location = "{{urlfor "LibController.Librarys"}}";
                },
                backToAfterLibarary: function () {
                    localStorage.setItem("LibStatus",true);
                    window.location = "{{urlfor "LibController.Librarys"}}";
                },
                addPicture: function () {
                    var $this = this;
                    var newPicture = $("#newPicture").val();
                    if (newPicture == "") {
                        return false;
                    }
                    
                    //$this.pictures.concat(JSON.parse(newPicture));
                    //Array.prototype.push.apply($this.pictures, JSON.parse(newPicture));
                    /*for (var i=0;i< JSON.parse(newPicture).length;i++) {
                        var node = document.getElementById("pic29");
                        var cNode = node.cloneNode(true);
                        console.log(cNode);
                        document.getElementById("divall-pic").appendChild(cNode);
                    }
                    var nodes = document.getElementById("divall-pic").childNodes;
                    console.log(nodes);*/
                    var oldPictureNum = $this.pictures.length;
                    var newPictureJson = JSON.parse(newPicture);
                    for (var i=0;i< (newPictureJson.length + oldPictureNum);i++) {
                        if (i < oldPictureNum) {
                            var detail = {"id":i,"feature":$this.pictures[i].feature,"url":$this.pictures[i].url};
                        } else {
                            var detail = {"id":i,"feature":newPictureJson[i - oldPictureNum].feature,"url":newPictureJson[i - oldPictureNum].url};
                        }
                        $this.$set($this.pictures,i,detail);
                    }
                    /*var cNode = node.cloneNode(true);
                    element.appendChild(cNode);

                    Array.prototype.push.apply($this.pictures, JSON.parse(newPicture));
                    var nodes = document.getElementById("divall-pic").childNodes;
                    console.log(nodes);
                    console.log($this.pictures);*/

                    $("#pictures").val(JSON.stringify($this.pictures));
                    $('#addPictureDialogModal').modal("hide");
                    $("#submitBtn").click();
                    $("#newPicture").val("");
                    /*for (var i=0;i<$this.pictures.length;i++) {
                        var that = "pic" + $this.pictures[i].id;
                        console.log($this.pictures[i].feature);
                        //$(that).unbind(); //移除所有
                        console.log($this.pictures[i]);
                        if ($this.pictures[i].feature == "") {
                            console.log(document.getElementById(that));
                            $(that).css("border","1px solid rgb(212, 0, 0)");
                            $(that).find(".file_failure").show();
                        }else {
                            console.log(document.getElementById(that));
                            $(that).css("border","1px solid rgb(16, 148, 250)");
                            $(that).find(".file_success").show();
                        }   
                    }*/
                },
                setBorder:function (pictures) {
                    console.log(pictures);
                    var $this = this;
                    for (var i=0;i<pictures.length;i++) {
                        var that = "pic" + pictures[i].id;
                        console.log(pictures[i].feature);
                        //$(that).unbind(); //移除所有
                        if (pictures[i].feature == "") {
                            console.log(document.getElementById(that));
                            $(that).css("border","1px solid rgb(212, 0, 0)");
                            $(that).find(".file_failure").show();
                        }else {
                            console.log(document.getElementById(that));
                            $(that).css("border","1px solid rgb(16, 148, 250)");
                            $(that).find(".file_success").show();
                        }   
                    }
                }
            }
        });

        /*初始化input的value*/
        $("#pictures").val(JSON.stringify(app.pictures));

        $("#addPictureDialogModal").on("hidden.bs.modal", function() {
            /*$("#photo").val("");
            var preview = document.getElementById("preview"); 
            var childs = preview.childNodes; 
            for(var i = 0; i < childs.length; i++) { 
              preview.removeChild(childs[i]); 
            }*/
            //$("#demo").remove("form");
        });

        /*$("#addPictureDialogModal").on("show.bs.modal", function() {
            return
        });*/

        /*设置边框*/
        /*setBorder();
        console.log(app.pictures);
        function setBorder() {
            for (var i=0;i<app.pictures.length;i++) {
                var that = "#pic" + i;
                if (app.pictures[i].feature == "") {
                    $(that).css("border","1px solid rgb(212, 0, 0)");
                    //$(that).find(".file_failure").show();
                }else {
                    $(that).css("border","1px solid rgb(16, 148, 250)");
                    //$(that).find(".file_success").show();
                }
            }
        }*/
        
        /*设置localstorage记录进入的目标库*/
        localStorage.setItem("LibraryId",{{.Target.LibraryId}});
        localStorage.setItem("LibraryName",{{.Target.LibraryName}});

        $("#saveTargetInfoForm").ajaxForm({
            beforeSubmit : function () {
                var $then = $("#saveTargetInfoForm");
                var name = $.trim($then.find("input[name='name']").val());
                var identity = $.trim($then.find("input[name='identity']").val());
                var pictures = $then.find("input[name='pictures']").val()
                if (name === ""){
                    toastr['warning']("目标名称不能为空");
                    return false;
                }
                if (identity === ""){
                    toastr['warning']("身份证不能为空");
                    return false;
                }
                if (pictures === ""){
                    toastr['warning']("至少保存一张照片");
                    return false;
                }
                $("#btnLibraryInfo").button("loading");
            },success : function (res) {
                if(res.errcode === 0) {
                    toastr['success']("保存成功");
                }else{
                    toastr['error']("保存失败" + res.message);
                }
                $("#btnLibraryInfo").button("reset");
            }
        });
        $("#demo").zyUpload({
            width            :   "100%",                  // 宽度
            height           :   "400px",                 // 宽度
            itemWidth        :   "100px",                 // 文件项的宽度
            itemHeight       :   "122px",                 // 文件项的高度
            url              :   "{{urlfor "TargetController.UploadTarget"}}",  // 上传文件的路径
            multiple         :   true,                    // 是否可以多个文件上传
            dragDrop         :   true,                    // 是否可以拖动上传文件
            del              :   true,                    // 是否可以删除文件
            finishDel        :   false,                   // 是否在上传文件完成后删除预览
            submitDel        :   true,                    // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles){                        // 选择文件的回调方法
            },
            onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
                $("#newPicture").val(JSON.stringify(surplusFiles));
            },
            onSuccess: function(file,rep,files){                        // 文件上传成功的回调方法
                $("#newPicture").val(JSON.stringify(files));
            },
            onFailure: function(file,rep,files){                        // 文件上传失败的回调方法
                toastr['error'](rep);
            },
            onComplete: function(responseInfo){                         // 上传完成的回调方法
            },
            onSubmitFiles: function(responseInfo){                         // 上传完成的回调方法
            }
        });
        $(".upload_btn").hide();
        $("#submitBtn").hide();
    });
</script>
</body>
</html>
