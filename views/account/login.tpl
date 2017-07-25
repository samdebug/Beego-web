<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="utf-8">
    <link rel="shortcut icon" href="/favicon.ico">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="renderer" content="webkit" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="SmartWiki" />
    <title>用户登录</title>

    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="/static/css/main.css" rel="stylesheet">
    <link href="/static/new/global.css" rel="stylesheet">
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="/static/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="/static/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}"></script>
</head>
<body class="manual-container">
<header class="navbar navbar-static-top smart-nav navbar-fixed-top manual-header" role="banner">
    <a href="/" class="navbar-brand">
        <img src="/static/img/logo.png" />
    </a>
</header>
<div class="container manual-body">
    <div class="row login">
        <div class="login-body">
            <form role="form" method="post">
                <!--<h3 class="text-center">用户登录</h3>-->
                <div class="form-group">
                    <!--<div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-user"></i>
                        </div>
                    </div>-->
                    <input type="text" class="form-control" placeholder="用户名" name="account" id="account" autocomplete="off">
                </div>
                <div class="form-group">
                    <!--<div class="input-group">
                        <div class="input-group-addon">
                            <i class="fa fa-lock"></i>
                        </div>
                    </div>-->
                    <input type="password" class="form-control" placeholder="密码" name="password" id="password" autocomplete="off">
                </div>
                {{if .ENABLED_CAPTCHA }}
                {{if ne .ENABLED_CAPTCHA "false"}}
                <div class="form-group">
                    <div class="input-group" style="float: left;width: 195px;">
                        <input type="text" name="code" id="code" class="form-control" style="width: 150px" maxlength="5" placeholder="验证码" autocomplete="off">&nbsp;
                    </div>
                    <img id="captcha-img" style="width: 140px;height: 40px;display: inline-block;float: right" src="{{urlfor "AccountController.Captcha"}}" onclick="this.src='{{urlfor "AccountController.Captcha"}}?key=login&t='+(new Date()).getTime();" title="点击换一张">
                    <div class="clearfix"></div>
                </div>
                {{end}}
                {{end}}
                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="is_remember" value="yes"> 保持登录
                    </label>
                    <a href="{{urlfor "AccountController.FindPassword" }}" style="display: inline-block;float: right">忘记密码？</a>
                </div>
                <div class="form-group">
                    <button type="button" id="btn-login" class="btn btn-primary login-btn" data-loading-text="正在登录..." autocomplete="off">立即登录</button>
                </div>
                {{if .ENABLED_REGISTER}}
                {{if ne .ENABLED_REGISTER "false"}}
                <div class="form-group">
                    还没有账号？<a href="{{urlfor "AccountController.Register" }}" title="立即注册">立即注册</a>
                </div>
                {{end}}
                {{end}}
            </form>
        </div>
    </div>
    <div class="clearfix"></div>
</div>
<!-- Include all compiled plugins (below), or include individual files as needed -->
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/layer/layer.js"}}" type="text/javascript"></script>
<script type="text/javascript">
    $(function () {
        $("#account,#passwd,#code").on('focus',function () {
            $(this).tooltip('destroy').parents('.form-group').removeClass('has-error');;
        });

        $(document).keydown(function (e) {
            var event = document.all ? window.event : e;
            if(event.keyCode === 13){
                $("#btn-login").click();
            }
        });
        $("#btn-login").on('click',function () {
            var $btn = $(this).button('loading');

            var account = $.trim($("#account").val());
            var password = $.trim($("#password").val());
            var code = $("#code").val();
            if(account === ""){
                $("#account").tooltip({placement:"auto",title : "账号不能为空",trigger : 'manual'})
                    .tooltip('show')
                    .parents('.form-group').addClass('has-error');
                $btn.button('reset');
                return false;

            }else if(password === ""){
                $("#password").tooltip({title : '密码不能为空',trigger : 'manual'})
                    .tooltip('show')
                    .parents('.form-group').addClass('has-error');
                $btn.button('reset');
                return false;
            }else if(code !== undefined && code === ""){
                $("#code").tooltip({title : '验证码不能为空',trigger : 'manual'})
                    .tooltip('show')
                    .parents('.form-group').addClass('has-error');
                $btn.button('reset');
                return false;
            }else{
                $.ajax({
                    url : "{{urlfor "AccountController.Login"}}",
                    data : $("form").serializeArray(),
                    dataType : "json",
                    type : "POST",
                    success : function (res) {

                        if(res.errcode !== 0){
                            $("#captcha-img").click();
                            $("#code").val('');
                            layer.msg(res.message);
                            $btn.button('reset');
                        }else{
                            window.location = "/";
                        }

                    },
                    error :function () {
                        $("#captcha-img").click();
                        $("#code").val('');
                        layer.msg('系统错误');
                        $btn.button('reset');
                    }
                });
            }


            return false;
        });
    });
</script>
</body>
</html>