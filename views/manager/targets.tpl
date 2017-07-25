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
    <link href="{{cdncss "/static/MultiUpload/control/css/Upload.css"}}" type="text/css" rel="stylesheet" >
   
</head>
<body>
    <div class="manual-reader">
        {{template "widgets/header.tpl" .}}
        <div class="container-fluid manual-body">
            <div class="row">
                <div class="page-left">
                    <ul class="menu" id="sidebar">
                        <li><a href="{{urlfor "ManagerController.Index"}}" class="item"><i class="icon-left lnr lnr-camera-video" aria-hidden="true"></i> 实时监控</a> </li>
                        <li class="active"><a href="{{urlfor "LibController.Librarys" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                        <li><a href="{{urlfor "ManagerController.Users" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                        <li><a href="{{urlfor "ManagerController.Books" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li><a href="{{urlfor "ManagerController.AttachList" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>

                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
                <div class="page-right" >
                    <div class="m-box" id="targetList">
                        <div class="box-head">
                            <div class="row">
                                <ol class="breadcrumb">
                                    <li><a href="{{urlfor "LibController.Librarys" }}">
                                        <span class="lnr lnr-users"></span>
                                        <strong>目标库管理</strong>
                                    </a></li>

                                    <li>
                                        <strong>{{.Lib.Name}}</strong>
                                    </li>
                                    <li class="active" v-if="moveTo === 'Create'">新建目标</li>
                                    <li class="active" v-if="moveTo === 'Edit'">编辑目标</li>
                                </ol>
                            </div>
                        </div> 
                    <div class="box-body">
                        <div class="main" >
                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="panel panel-default">
                                        <div class="panel-heading">
                                            <div class="action">
                                                <button type="button" data-toggle="modal" v-if="moveTo === 'Index'" v-on:click="CreateTarget" data-target="#addTargetModal" class="btn btn-primary btn-sm pull-right" style="margin-left: 5px;">新建目标</button>
                                            </div>
                                        </div>
                                    <div class="panel-body" >
                                        <form v-if="moveTo === 'Create' || moveTo === 'Edit'" method="post" autocomplete="off" action="{{urlfor "TargetController.AddTarget" ":lib" 7 }}" id="addTargetDialogForm" class="form-horizontal">
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="name"><span class="error-message">*</span>名字</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" placeholder="不超过20字" name="name" id="name">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="identity"><span class="error-message">*</span>身份证</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" placeholder="不超过100字" name="identity" id="identity">
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="picture"><span class="error-message">*</span>照片</label>
                                                <div class="col-sm-10">
                                                    <div id="demo" class="demo"></div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="sex">性别</label>
                                                <div class="col-sm-10">
                                                    <div class="radio">
                                                        <label class="radio-inline">
                                                            <input type="radio" checked="" name="sex" value="true">男<span class="text"></span>
                                                        </label>
                                                        <label class="radio-inline">
                                                            <input type="radio" checked="" name="sex" value="true">女<span class="text"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="level">级别</label>
                                                <div class="col-sm-10">
                                                    <div class="radio">
                                                        <label class="radio-inline">
                                                            <input type="radio" checked="" name="level" value="true">重点<span class="text"></span>
                                                        </label>
                                                        <label class="radio-inline">
                                                            <input type="radio" checked="" name="level" value="true">一般<span class="text"></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <label class="col-sm-2 control-label" for="age">年龄</label>
                                                <div class="col-sm-10">
                                                    <input type="text" class="form-control" placeholder="请输入年龄" name="age" id="age">
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
                                            <div class="form-group">
                                                <button type="submit" id="btnMemberInfo" class="btn btn-primary" data-loading-text="保存中...">保存</button>
                                                <span id="form-error-message" class="error-message"></span>
                                            </div>
                                        </form>
                                        <div v-if="moveTo === 'Index'">
                                           <div class="text-center no-resources" v-if="lists.length <= 0">
                                               <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" />
                                               <p>暂无数据</p>
                                           </div>
                                           <div class="gallery" v-if="lists.length > 0">
                                               {{range $index,$item := .Targets}}
                                               <div class="thumbnail" @click="EditTarget()">
                                                   <img class="TargetImage" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                                   <div class="title">{{$item.Name}}</div>
                                               </div>
                                               {{end}}
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>

<script type="text/javascript" src="http://cdn.staticfile.org/jquery/2.1.1-rc2/jquery.min.js"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="/static/js/main.js" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="/static/vuejs/vue.min.js"></script>

<!--多图片上传-->
<script src="{{cdnjs "/static/MultiUpload/core/File.js"}}"></script>
<script src="{{cdnjs "/static/MultiUpload/control/js/Upload.js"}}"></script>

<script type="text/javascript">
    $(function () {
        $("#demo").zyUpload({
            width            :   "100%",                 // 宽度
            height           :   "400px",                 // 宽度
            itemWidth        :   "100px",                 // 文件项的宽度
            itemHeight       :   "122px",                 // 文件项的高度
            url              :   "/asda/asd",  // 上传文件的路径
            multiple         :   true,                    // 是否可以多个文件上传
            dragDrop         :   true,                    // 是否可以拖动上传文件
            del              :   true,                    // 是否可以删除文件
            finishDel        :   false,                   // 是否在上传文件完成后删除预览
            /* 外部获得的回调接口 */
            onSelect: function(files, allFiles){                    // 选择文件的回调方法
                console.info("当前选择了以下文件：");
                console.info(files);
                console.info("之前没上传的文件：");
                console.info(allFiles);
                /*for (var i=0;i<allFiles.length;i++) {
                    allFiles[i].name = "123.jpg";
                }*/
            },
            onDelete: function(file, surplusFiles){                     // 删除一个文件的回调方法
                console.info("当前删除了此文件：");
                console.info(file);
                console.info("当前剩余的文件：");
                console.info(surplusFiles);
            },
            onSuccess: function(file){                    // 文件上传成功的回调方法
                console.info("此文件上传成功：");
                console.info(file);
            },
            onFailure: function(file){                    // 文件上传失败的回调方法
                console.info("此文件上传失败：");
                console.info(file);
            },
            onComplete: function(responseInfo){           // 上传完成的回调方法
                console.info("文件上传完成");
                console.info(responseInfo);
            }
        });
        $(".upload_btn").hide();

        var app = new Vue({
            el : "#targetList",
            data : {
                lists : {{.Targets}},
                moveTo: "Index"
            },
            delimiters : ['${','}'],
            methods : {
                CreateTarget: function (){
                    var $this = this;
                    $this.moveTo = "Create";
                },
                EditTarget: function (){
                    var $this = this;
                    $this.moveTo = "Edit";
                },
                backToGallery: function () {
                    var $this = this;
                    return;
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

                if ($(".upload_append_list").length >0) {
                    $(".upload_btn").click();
                }else {
                    toastr['warning']('请选择照片');
                    return false;
                }

            },success : function (res) {
                /*if(res.errcode === 0) {
                    showSuccess("保存成功")
                }else{
                    showError(res.message);
                }
                $("#btnLibraryInfo").button("reset");*/
                console.log(123);
            }
        });
    });
</script>
</body>
</html>
