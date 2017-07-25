<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>实时监控</title>

    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="/static/css/main.css" rel="stylesheet">
    <link href="{{cdncss "/static/vxgplayer/vxgplayer-1.8.33.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/new/global.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/linearicons/style.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/toastr/toastr.css"}}" rel="stylesheet">

</head>
<body ng-app = "faceApp" ng-controller = "faceCtrl">
<div class="manual-reader">
    {{template "widgets/header.tpl" .}}
    <div class="container-fluid manual-body">
        <div class="row">
            <div class="page-left">
                <ul class="menu" id="sidebar">
                    <li class="active"><a href="{{urlfor "ManagerController.Index"}}" class="item"><i class="icon-left lnr lnr-camera-video" aria-hidden="true"></i> 实时监控</a> </li>
                    <li><a href="{{urlfor "LibController.Librarys" }}" class="item"><i class="icon-left lnr lnr-users" aria-hidden="true"></i> 目标库管理</a> </li>
                    <li><a href="{{urlfor "ManagerController.Users" }}" class="item"><i class="icon-left lnr lnr-camera" aria-hidden="true"></i> 视频源管理</a> </li>
                    <li><a href="{{urlfor "ManagerController.Books" }}" class="item"><i class="icon-left lnr lnr-clock" aria-hidden="true"></i> 布控任务</a> </li>
                    <li><a href="{{urlfor "ManagerController.AttachList" }}" class="item"><i class="icon-left lnr lnr-magnifier" aria-hidden="true"></i> 人脸检索</a> </li>

                    <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-book" aria-hidden="true"></i> 历史记录</a> </li>
                    <li><a href="javascript:;" class="item"><i class="icon-left lnr lnr-chart-bars" aria-hidden="true"></i> 数据统计</a> </li>
                </ul>
            </div>
            <div class="page-right" id="onAir">
                <div class="m-box">
                    <div class="box-head">
                        <span class="lnr lnr-camera-video" ></span>
                        <strong class="box-title">实时监控</strong>
                    </div>
                </div>
                <div class="box-body manager">
                    <div class="col-md-12"  id="monitor">
                      <!-- TODO LIST -->
                      <div class="panel vxg-players">
                        <div class="panel-heading">
                            <div class="title">
                              <div class="onAir-select">
                                <select name="role" class="form-control col-sm-2">
                                  <option value="1">摄像头1</option>
                                  <option value="2">摄像头2</option>
                                </select>
                              </div>
                              <div class="onAir-select">
                                <select name="role" class="form-control col-sm-2">
                                  <option value="1">布控任务1</option>
                                  <option value="2">布控任务2</option>
                                </select>
                              </div>

                            </div>
                            <div class="action">
                              <a class="action-btn">
                                <button type="button" class="btn btn-primary btn-primary-pro" @click="startVXG()">开始监控</button>
                              </a>
                            </div>
                        </div>
                        <div class="panel-body" style="height: 400px;">   
                          <!--<div class="vxgplayer" id="vxg_media_player1" url="rtsp://192.168.2.127:554/user=admin_password=tlJwpbo6_channel=1_stream=0.sdp?real_stream" autostart controls avsync nmf-src="/static/vxgplayer/pnacl/Release/media_player.nmf" nmf-path="media_player.nmf" ></div>-->
                          <div id="dynamicallyPlayers" style="display:none;"></div>
                          <div class="no-resources" id="no-video-source-video" >
                              <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" alt="" style="" />
                              <p>请选择布控任务</p>
                          </div>
                        </div>
                      </div>

                      <div class="panel catch">
                        <div class="panel-heading">
                          <div class="title">
                              <span class="lnr lnr-picture"></span>实时抓拍</div>
                            <div class="action">
                              <!--<a class="action-btn">
                                <button type="button" class="btn btn-primary btn-primary-pro">更多</button>
                              </a>-->
                            </div>
                        </div>
                        <div class="panel-body">
                          <div id="scroller-1" class="scroller">
                            <div class="text-center" id="camera-error">
                              <img src="https://qiniu.staticfile.org/static/images/no-resources.4a57f9be.png" style="width:180px" alt="" />
                              <p>无抓拍</p>
                            </div>
                            <ul id="divall-catch" style="display:none">
                                <div class="alldom">  
                                  <li id="catch-0" style="display:none">
                                      <a href="javascript:;">
                                          <img src="" id="catch-img-0">
                                          <p class="folder-p" id="catch-span-0"></p>
                                      </a>
                                  </li>
                                  <li id="catch-1" style="display:none">
                                      <a href="javascript:;">
                                          <img src="" id="catch-img-1">
                                          <p class="folder-p" id="catch-span-1"></p>
                                      </a>
                                  </li>
                                  <li id="catch-2" style="display:none">
                                      <a href="javascript:;">
                                          <img src="" id="catch-img-2">
                                          <p class="folder-p" id="catch-span-2"></p>
                                      </a>
                                  </li>
                                  <li id="catch-3" style="display:none">
                                      <a href="javascript:;">
                                          <img src="" id="catch-img-3">
                                          <p class="folder-p" id="catch-span-3"></p>
                                      </a>
                                  </li>
                                  <li id="catch-4" style="display:none">
                                      <a href="javascript:;">
                                          <img src="" id="catch-img-4">
                                          <p class="folder-p" id="catch-span-4"></p>
                                      </a>
                                  </li>
                                </div>
                            </ul>
                        </div>
                      </div>
                      </div>

                      <!-- END TODO LIST -->
                    </div>
                    <div class="col-md-5" style="display:none">
                      <div class="panel FindTarget" style="">
                      <div class="panel-heading">
                        <div class="title">
                          <span class="lnr lnr-eye"></span>发现目标</div>
                        <div class="action">
                            <!--<a class="action-btn">
                                <button type="button" class="btn btn-primary btn-primary-pro">更多</button>
                              </a>-->
                        </div>
                      </div>
                      <div class="panel-body">
                        <div id="scroller" class="scroller">
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="alert-box alert-default" style="">
                          <div class="alert-heading">
                            <div class="title">
                              <span class="glyphicon glyphicon-camera"></span>一号摄像机</div>
                            <div class="action">
                              <span class="glyphicon glyphicon-calendar"></span>2017年07月01号14:20:19</div>
                          </div>
                          <div class="alert-body">
                            <div class="alert-box-inside">
                              <div class="compare col-lg-7">
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                                <img class="pic-size" src="http://192.168.2.82:4569/images/827083/2017-07-08%2013/1281_827083_441602199211080418_person.jpg" />
                              </div>
                              <div class="info col-lg-5">
                                <div><span>马蓝鹏</span></div>
                                <div><span>25岁</span></div>
                                <div><span>441602199233020987</span></div>
                                <div><span>目标库1</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div><!--/.row-->
                    </div>
                    </div>  <!--/.main-->
                    </div>
                  </div>
                </div>
            </div>
        </div>
    </div>

<script src="{{cdnjs "/static/jquery/2.1.1/jquery.js"}}"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/jquery-slimscroll/jquery.slimscroll.min.js"}}"></script>
<script src="{{cdnjs "/static/vxgplayer/vxgplayer-1.8.33.min.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/controllers/resize.js"}}"></script>
<script src="{{cdnjs "/static/controllers/global.js"}}"></script>
<script src="{{cdnjs "/static/vuejs/vue.min.js"}}"></script>
<script src="{{cdnjs "/static/toastr/toastr.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>

<script type="text/javascript">
    $(function () {
        var app = new Vue({
            el : "#onAir",
            data : {  
                lists : ""
            },
            delimiters : ['${','}'],
            methods : {
                startVXG : function (index) {
                    var $this = this;
                    if (!$this.checkVxg()) {
                      return false
                    }
                    var indexPlayer = 0;
                    indexPlayer++;
                    var init_width = $("#monitor").width();
                    var init_height = $("#monitor").height();
                    console.log(init_height);
                    var playerId = 'vxg_media_player' + indexPlayer;
                    var div = document.createElement('div');
                    div.setAttribute("id", playerId);
                    div.setAttribute("class", "vxgplayer");
                    var runtimePlayers = document.getElementById('dynamicallyPlayers');
                    runtimePlayers.appendChild(div);
                    vxgplayer(playerId, {
                            url: '',
                            nmf_path: 'media_player.nmf',
                            nmf_src: '/static/vxgplayer/pnacl/Release/media_player.nmf',
                            latency: 0,
                            width:init_width,
                            height:398,
                            aspect_ratio_mode: 1,
                            autohide: 3,
                            controls: true,
                            connection_timeout: 5000,
                            connection_udp: 0,
                            custom_digital_zoom: false
                    }).ready(function(){
                        //console.log(' =>ready player '+playerId);
                        vxgplayer(playerId).src('rtsp://192.168.2.127:554/user=admin_password=tlJwpbo6_channel=1_stream=0.sdp?real_stream');
                        //vxgplayer(playerId).src('rtsp://222.189.31.178:18588/realplay?devid=112A0000028&channelno=0&streamtype=1&hashtoken=2e960a81dd62a067d75c958cf2a15886');
                        vxgplayer(playerId).play();
                        $this.resizeWindows();
                        $this.startWebSocket();
                        //console.log(' <=ready player '+playerId);
                    });
                    $("#dynamicallyPlayers").show();
                    $("#no-video-source-video").hide();
                },
                resizeWindows: function () {
                    var ratio = 480/640;
                    var pre_width = $("#monitor").width();
                    vxgplayer('vxg_media_player1').size(pre_width - 2, 398);
                    $("#monitor").resize(function(){
                        var width = $("#monitor").width();
                        var height = $("#monitor").height();
                        vxgplayer('vxg_media_player1').size(width - 2, 398);
                        $('#scroller').slimScroll({
                            height: (height - 106) + "px"
                        });
                    });
                },
                startWebSocket : function () {
                    var socket = null;
                    if ('WebSocket' in window) {
                        socket = new WebSocket("ws://192.168.2.90:8181/ws/info");
                    }
                    else {
                        //return layer.msg("最多选择8张图片");
                        toastr['error']('当前浏览器不支持websocket');
                    }
                    socket.onopen = function(event) {
                      toastr['success']('WebSocket连接成功');
                      socket.send('Hello!');
                    }
                    socket.onmessage = function(e) { 
                      var data = JSON.parse(e.data);
                      console.log(data);
                      $("#divall-catch").show();
                      $("#camera-error").hide();
                      for (var i=0;i<data.length;i++) {
                        $("#catch-" + i).show();
                        $("#catch-img-" + i).attr('src',data[i].url);
                        var gender_cn;
                        if (data[i].gender == "Male") {
                          gender_cn = "男"
                        }else {
                          gender_cn = "女"
                        }
                        $("#catch-span-" + i).text(data[i].age + "岁," +gender_cn);
                      }
                    }
                    socket.onerror = function () {
                      toastr['error']('WebSocket连接发生错误');
                    };
                    socket.onclose = function(event) { 
                      toastr['success']('WebSocket连接关闭');
                    };

                    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
                    window.onbeforeunload = function () {
                        closeWebSocket();
                    }
                    //关闭WebSocket连接
                    function closeWebSocket() {
                        console.log("close");
                        socket.close();
                    }
                },
                checkVxg: function() {
                    var vxg = $("#dynamicallyPlayers").find(".vxgplayer");
                    if(vxg.lenght <=0){
                      return false;
                    }else{
                      return true;
                    }
                }
            }
        });

        $('.panel').attr('style',"border: 1px solid #e6e9f0 !important;");
        
        //滚动体
        $('#scroller-1').slimScroll({
            height: '150px'
        });

        $('#scroller').slimScroll({
            height: '550px'
        });

        //样式
        //$('#header-container').removeClass('container');
        //$('#header-container').addClass('container-fluid');
      
        /*var sayCheese = new SayCheese('#webcam', { audio: false });
        sayCheese.on('start', function() {
          console.log("start cam");
        });
        sayCheese.start();*/
    });
</script>
</body>
</html>