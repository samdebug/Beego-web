<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>人脸检索</title>
  <!--Style of this page-->
  <link href="/static/searchface/css/match.css" rel="stylesheet">
  <!--<script src="../js/auth.js" type="text/javascript"></script>-->

  <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
  <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
  <link href="/static/css/main.css" rel="stylesheet">
  <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
  <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
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
                        <li><a href="{{urlfor "MissionController.Missions" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                        <li class="active"><a href="{{urlfor "CompareController.One2ManySearch" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>

                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                        <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                    </ul>
                </div>
                <div class="page-right">
                    <div class="m-box">
                        <div class="box-head">
                            <span class="lnr lnr-magnifier"></span>
                            <strong class="box-title">人脸检索</strong>
                        </div>
                    </div>
                    <div class="box-body manager">
                        <div class="main">
                        <div class="row">
                          <div class="col-lg-12">
                            <div class="panel panel-default">
                              <!--<div class="panel-heading">

                              </div>-->
                              <div class="panel-body tabs" id="userList">
                                  <div id="uponCanvas">
                                    <!-- <nav id="banner"></nav> -->
                                    <div id="wrapper">
                                      <div id="main">
                                        <div id="backgroundPanel">
                                          <form id="matchForm">
                                            <div id="parameterSet"></div>
                                            <div id="matchSettings">
                                              <div id="ms-center">
                                                <div class="matchSettings-div" id="matchSourcePic">
                                                  <!--以下是提交所需的一些字段，依次是图片，参与比对的目标库，每页展示数量，任务ID-->
                                                  <input class="hide" id="file" type="file" name="file">
                                                  <input class="hide" id="group" type="text" name="imgbaseid" value="">
                                                  <input class="hide" type="text" name="number" value="50">
                                                  <input class="hide" id="taskid" type="text" name="taskid" value="">
                                                  <!--提交所需的一些字段-->
                                                  <div id="upload" class="">
                                                    <img id="preview" src="">
                                                    <div id="present-data">
                                                      <canvas id="present-data-canvas"></canvas>
                                                    </div>
                                                    <div id="upload-div">
                                                      <img src="/static/searchface/img/plus.svg">
                                                      <br><br>
                                                      <span id="upload-text">上传本地图片</span>
                                                    </div>

                                                    <div id="replacePic">
                                                      <span>替换</span>
                                                    </div>

                                                  </div>
                                                  <div id="matchSourcePic-text"><span id="matchSourcePic-span" style="color: #bcc1cc !important;">文件名</span></div>
                                                </div>

                                                <div class="matchSettings-div" id="matchThreshold">
                                                  <ul class="matchThreshold-ul">

                                                    <li class="matchThreshold-li threshold-li">
                                                      <div id="thresholdText-div"><span id="threshold-span">识别阈值：</span></div><!--
                                                      --><div id="threshold-div">
                                                        <input id="threshold-input" type="text" name="scoreDisplay" value="50">
                                                        <input id="threshold-input-true" class="hide" type="text" name="score" value="0.5">
                                                        <span id="precentageMark" style="color: #bcc1cc;"> %</span>
                                                        <img id="threshold-triangle" src="/static/searchface/img/arrow-down-b.svg">
                                                      </div>
                                                      <div id="threshold-menu">
                                                        <ul id="threshold-menu-ul"></ul>
                                                      </div>
                                                    </li>

                                                    <li class="matchThreshold-li threshold-li">
                                                      <span id="thresholdText">相似度达到阈值的对象将呈现到检索结果中</span>
                                                    </li>

                                                    <li class="matchThreshold-li" id="thresholdDivider"></li>

                                                    <li class="matchThreshold-li matchButton">
                                                      <div id="startMatchButton" class="inactived">
                                                        <span id="startMatchButton-span" style="">开始检索</span>
                                                      </div>
                                                    </li>

                                                    <!--<li class="matchThreshold-li forceButton">
                                                      <div id="forceMatchButton">
                                                        <span id="forceMatchButton-span">强制检索</span>
                                                      </div>
                                                    </li>-->

                                                  </ul>
                                                </div>

                                                <div class="matchSettings-div" id="matchSourceGroup">
                                                  <div id="group-div">
                                                    <img src="/static/searchface/img/box.svg">
                                                    <br><br>
                                                    <span id="group-text">选择目标库</span>
                                                  </div>
                                                  <div id="matchSourceGroup-text"><span id="matchSourceGroup-span">文件名</span></div>
                                                </div>

                                                <div id="group-list">
                                                  <div id="reference">
                                                    <div id="gl-searchbox">
                                                      <img id="search-logo" src="/static/searchface/img/search.svg">
                                                      <input id="search-input" type="text">
                                                      <div id="search-button">
                                                        <div id="search-button-div">
                                                          <span id="search-button-span" style="color:#fff !important;">搜索</span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                    <div id="gl-scrollbox">
                                                      <ul id="group-list-ul" style="padding-left: 0px;"><!--gl is short for group list-->
                                                        <!-- <li class="gl-li"><span class="gl-span">name</span></li> -->
                                                      </ul>
                                                    </div>
                                                    <div id="gl-buttonPair">
                                                      <div id="gl-center">
                                                        <ul id="gl-buttonPair-ul">
                                                          <li class="gl-buttonPair-li">
                                                            <div class="gl-buttonPair-div gl-buttonPair-cancel">
                                                              <span class="gl-buttonPair-span">取消</span>
                                                            </div>
                                                          </li>
                                                          <li class="gl-buttonPair-li">
                                                            <div class="gl-buttonPair-div gl-buttonPair-confirm">
                                                              <span class="gl-buttonPair-span">确定</span>
                                                            </div>
                                                          </li>
                                                        </ul>
                                                      </div><!--centering-->
                                                    </div>
                                                  </div><!--reference-->
                                                </div><!--group-list-->
                                              </div>
                                            </div>
                                          </form>

                                          <div id="guide">
                                            <img src="/static/searchface/img/hints-edit.png">
                                          </div>

                                          <div id="matchResults">
                                            <header id="matchResults-header">
                                              <span id="matchResultsHeader-span"><span id="last-comparison"></span>匹配结果 <span id="stat">--</span> 个</span>
                                            </header>

                                            <aside id="matchResults-aside">
                                              <span id="aside-span">照片原图</span>
                                              <div id="aside-div"><img id="aside-uploaded" src=""></div>
                                              <div id="aside-textAlign"><span id="aside-name"></span></div>
                                            </aside>

                                            <section id="resultGallery">
                                              <header id="resultGallery-header">

                                                <div class="filter-operation">
                                                  <!--<div class="filter-div filter-title">
                                                    <span class="filter-title-span">筛选</span>
                                                  </div>
                                                  <div class="filter-div gender-filter">
                                                    <span class="gender-filter-title">性别：</span>
                                                  </div>
                                                  <div class="filter-div gender-filter-select-box">
                                                    <div class="select-box">
                                                      <span class="selected-condition">不限</span>
                                                    </div>
                                                    <div class="select-panel">
                                                      <ul class="select-panel-ul">
                                                        <li class="select-panel-li">
                                                          <span class="select-panel-span">不限</span>
                                                        </li>
                                                        <li class="select-panel-li">
                                                          <span class="select-panel-span">男</span>
                                                        </li>
                                                        <li class="select-panel-li">
                                                          <span class="select-panel-span">女</span>
                                                        </li>
                                                      </ul>
                                                    </div>
                                                  </div>
                                                  <div class="filter-div age-filter">
                                                    <span class="age-filter-title">年龄段：</span>
                                                    <input type="text" name="start-age" class="input" id="age-filter-start" />
                                                    <span class="age-filter-separator">—</span>
                                                    <input type="text" name="stop-age" class="input" id="age-filter-stop" />
                                                  </div>
                                                  <div class="filter-div age-filter-button unselectable">
                                                    <span class="age-filter-button-span">筛选</span>
                                                  </div>-->
                                                </div>

                                                <div class="export-operation">
                                                  <img id="checkbox" class="hide" src="/static/searchface/img/checkbox-off.png">
                                                  <span class="rg-header-span hide"> 选择所有人</span>
                                                  <span class="divider-wide hide">----</span>
                                                  <span class="rg-header-span">共匹配到
                                                    <span id="total">--</span> 个对象/已选择
                                                    <span id="selected">--</span> 个对象
                                                  </span>
                                                  <span class="divider-wide">----</span>
                                                  <div id="export" style="display:none">
                                                    <div id="export-div">
                                                      <span id="export-span">导出</span>
                                                    </div>
                                                  </div>
                                                </div>

                                              </header>
                                              <div id="rg-body"><!--rg for match result gallery-->
                                                <ul id="matchResults-ul"></ul>
                                              </div>
                                            </section>

                                          </div>

                                        </div>

                                      </div><!--end of main-->

                                      <div class="backgroundBottom">
                                        <div class="pagination"><ul></ul></div>
                                      </div>
                                    </div><!--end of wrapper-->
                                  </div><!--end of uponCanvas-->

                                <div id="mask-for-large"></div>
                                <div id="large"><!--l for large-->
                                  <div id="large-wrap">
                                    <img id="large-img" src="/static/searchface/img/close.png" style="display:none">
                                    <div id="l-Main">
                                      <div class="l-Content" id="l-source">
                                        <!--<img id="l-source-img" src="/static/searchface/data/example.jpg">-->
                                      </div>
                                      <div class="l-Content" id="l-percentage">
                                        <div><span>--%</span></div>
                                      </div>
                                      <div class="l-Content" id="l-destination">
                                        <div class="l-Content-div" id="l-Content-pic">
                                          <img id="l-Content-img" src="">
                                          <img id="l-checkbox" src="">
                                        </div>
                                        <div class="l-Content-div" id="l-info">
                                          <!--侧面详细信息-->
                                          <span id="number"></span>
                                          <div id="l-divider"></div>
                                          <span id="highlight-info"></span>
                                          <br>
                                          <span id="other-info"></span>
                                        </div>
                                      </div>

                                      <div id="l-buttonPair"><!--按钮对-->
                                        <ul id="l-buttonPair-ul">
                                          <li class="l-buttonPair-li">
                                            <div class="l-buttonPair-div l-buttonPair-last">
                                              <span>上一张</span>
                                            </div>
                                          </li>
                                          <li class="l-buttonPair-li">
                                            <div class="l-buttonPair-div l-buttonPair-next">
                                              <span>下一张</span>
                                            </div>
                                          </li>
                                        </ul>
                                      </div>

                                    </div>
                                    <span id="l-text">已选择 <span id="l-selected">--</span> 个对象</span>
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
  <script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
  <script src="{{cdnjs "/static/controllers/global.js"}}"></script>
  <script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
  <script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
  <!--<script src="/static/vuejs/vue.min.js"></script>-->

  <script src="/static/searchface/js/global.js" type="text/javascript"></script>
  <script src="/static/searchface/js/match.data.js" type="text/javascript"></script>
  <script type="text/javascript" src="/static/searchface/js/components/pagination.js"></script>
  <script type="text/javascript" src="/static/searchface/js/match.js"></script>

  <script type="text/javascript">
    $("#startMatchButton").click(function(){
        if ($("#startMatchButton").hasClass("inactived")) {
            return layer.msg("请先选择目标照片和目标库");
            //return false;
        }
    });

    $(function () {
        $("#matchResults-aside").hide();
        /*$("#startMatchButton").click(function(){
            $("#upload").each(function(){
                var src = $(this).find("img").attr("src");
                if(src == ""){
                    layer.msg("请先选择目标照片");
                    return false;
                }
            })
        });*/
    });
</script>
</body>
</html>