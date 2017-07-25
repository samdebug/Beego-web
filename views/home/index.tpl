<!DOCTYPE html>
<html>
<head>
  <!-- Standard Meta -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

  <!-- Site Properties -->
  <title>首页</title>
  <link rel="stylesheet" type="text/css" href="/static/dist/components/reset.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/site.css">

  <link rel="stylesheet" type="text/css" href="/static/dist/components/container.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/grid.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/header.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/image.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/menu.css">

  <link rel="stylesheet" type="text/css" href="/static/dist/components/divider.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/dropdown.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/segment.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/button.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/list.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/icon.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/sidebar.css">
  <link rel="stylesheet" type="text/css" href="/static/dist/components/transition.css">

  <style type="text/css">

    .hidden.menu {
      display: none;
    }

    .masthead.segment {
      min-height: 700px;
      padding: 1em 0em;
    }
    .masthead .logo.item img {
      margin-right: 1em;
    }
    .masthead .ui.menu .ui.button {
      margin-left: 0.5em;
    }
    .masthead h1.ui.header {
      margin-top: 3em;
      margin-bottom: 0em;
      font-size: 4em;
      font-weight: normal;
    }
    .masthead h2 {
      font-size: 1.7em;
      font-weight: normal;
    }

    .ui.vertical.stripe {
      padding: 8em 0em;
    }
    .ui.vertical.stripe h3 {
      font-size: 2em;
    }
    .ui.vertical.stripe .button + h3,
    .ui.vertical.stripe p + h3 {
      margin-top: 3em;
    }
    .ui.vertical.stripe .floated.image {
      clear: both;
    }
    .ui.vertical.stripe p {
      font-size: 1.33em;
    }
    .ui.vertical.stripe .horizontal.divider {
      margin: 3em 0em;
    }

    .quote.stripe.segment {
      padding: 0em;
    }
    .quote.stripe.segment .grid .column {
      padding-top: 5em;
      padding-bottom: 5em;
    }

    .footer.segment {
      padding: 5em 0em;
    }

    .secondary.pointing.menu .toc.item {
      display: none;
    }

    @media only screen and (max-width: 700px) {
      .ui.fixed.menu {
        display: none !important;
      }
      .secondary.pointing.menu .item,
      .secondary.pointing.menu .menu {
        display: none;
      }
      .secondary.pointing.menu .toc.item {
        display: block;
      }
      .masthead.segment {
        min-height: 350px;
      }
      .masthead h1.ui.header {
        font-size: 2em;
        margin-top: 1.5em;
      }
      .masthead h2 {
        margin-top: 0.5em;
        font-size: 1.5em;
      }
    }


  </style>

  <script src="/static/dist/jquery.min.js"></script>
  <script src="/static/dist/components/visibility.js"></script>
  <script src="/static/dist/components/sidebar.js"></script>
  <script src="/static/dist/components/transition.js"></script>
  <script>
  $(document)
    .ready(function() {

      // fix menu when passed
      $('.masthead')
        .visibility({
          once: false,
          onBottomPassed: function() {
            $('.fixed.menu').transition('fade in');
          },
          onBottomPassedReverse: function() {
            $('.fixed.menu').transition('fade out');
          }
        })
      ;

      // create sidebar and attach to menu open
      $('.ui.sidebar')
        .sidebar('attach events', '.toc.item')
      ;

    })
  ;
  </script>
</head>
<body>

<!-- Following Menu -->
<div class="ui large top fixed hidden menu">
  <div class="ui container">
    <a class="active item">主页</a>
    <a href="{{urlfor "ManagerController.Index"}}" class="item">实时监控</a>
    <a href="{{urlfor "LibController.Librarys" }}" class="item">目标库管理</a>
    <a href="{{urlfor "VideosController.Videos" }}" class="item">视频源管理</a>
    <a href="{{urlfor "ManagerController.Books" }}" class="item">布控任务</a>
    <a href="{{urlfor "CompareController.One2ManySearch" }}" class="item">人脸检索</a>
    <!--<a class="item">产品中心</a>
    <a class="item">解决方案</a>
    <a class="item">关于泽云</a>-->
    <div class="right menu">
      <!--<div class="item">
        <a href="{{urlfor "AccountController.Login"}}" class="ui button">登录</a>
      </div>-->
      <div class="item">
        <a href="{{urlfor "AccountController.Register"}}" class="ui primary button">注册 | 加入我们</a>
      </div>
    </div>
  </div>
</div>

<!-- Sidebar Menu -->
<div class="ui vertical inverted sidebar menu">
  <a class="active item">主页</a>
  <a href="{{urlfor "ManagerController.Index"}}" class="item">实时监控</a>
  <a href="{{urlfor "LibController.Librarys" }}" class="item">目标库管理</a>
  <a href="{{urlfor "VideosController.Videos" }}" class="item">视频源管理</a>
  <a href="{{urlfor "ManagerController.Books" }}" class="item">布控任务</a>
  <a href="{{urlfor "CompareController.One2ManySearch" }}" class="item">人脸检索</a>
  <!--<a class="item">产品中心</a>
  <a class="item">解决方案</a>
  <a class="item">关于泽云</a>-->
  <!--<a href="{{urlfor "AccountController.Login"}}" class="item">登录</a>-->
  <a href="{{urlfor "AccountController.Register"}}" class="item">注册 | 加入我们</a>
</div>


<!-- Page Contents -->
<div class="pusher">
  <div class="ui inverted vertical masthead center aligned segment">

    <div class="ui container">
      <div class="ui large secondary inverted pointing menu">
        <a class="toc item">
          <i class="sidebar icon"></i>
        </a>
        <a class="active item">主页</a>
        <a href="{{urlfor "ManagerController.Index"}}" class="item">实时监控</a>
        <a href="{{urlfor "LibController.Librarys" }}" class="item">目标库管理</a>
        <a href="{{urlfor "VideosController.Videos" }}" class="item">视频源管理</a>
        <a href="{{urlfor "ManagerController.Books" }}" class="item">布控任务</a>
        <a href="{{urlfor "CompareController.One2ManySearch" }}" class="item">人脸检索</a>
        <!--<a class="item">产品中心</a>
        <a class="item">解决方案</a>
        <a class="item">关于泽云</a>-->
        <div class="right item">
          <!--<a href="{{urlfor "AccountController.Login"}}" class="ui inverted button">登录</a>-->
          <a href="{{urlfor "AccountController.Register"}}" class="ui inverted button">注册 | 加入我们</a>
        </div>
      </div>
    </div>

    <div class="ui text container">
      <h1 class="ui inverted header">
        场景视频大数据服务
      </h1>
      <h2>人脸识别 | 认证比对 | 人脸布控 | 统计分析</h2>
      <a href="{{urlfor "ManagerController.Index"}}"><div class="ui huge primary button">进入功能页 <i class="right arrow icon"></i></div></a>
    </div>

  </div>

  <div class="ui vertical stripe segment">
    <div class="ui middle aligned stackable grid container">
      <div class="row">
        <div class="eight wide column">
          <h3 class="ui header">合作过的伙伴</h3>
          <p>我们可以成为你工作上的超级伙伴，帮助你完成一些不可能的事情。</p>
          <h3 class="ui header">我们让视频大数据重新活了起来</h3>
          <p>没错，是的，你认为这些都是梦想，但我们让它成为现实。</p>
        </div>
        <div class="six wide right floated column">
          <img src="/static/img/poster.png" class="ui large bordered rounded image">
        </div>
      </div>
      <div class="row">
        <div class="center aligned column">
          <a class="ui huge button">我们的团队</a>
        </div>
      </div>
    </div>
  </div>

  <div class="ui vertical stripe quote segment">
    <div class="ui equal width stackable internally celled grid">
      <div class="center aligned row">
        <div class="column">
          <h3>"多么棒的公司"</h3>
          <p>这就是大家对我们的评价</p>
        </div>
        <div class="column">
          <h3>"专注于识别算法"</h3>
          <p>
            <img src="/static/img/poster.png" class="ui avatar image"> <b>完美的</b> 年轻有活力团队
          </p>
        </div>
      </div>
    </div>
  </div>

  <!--<div class="ui vertical stripe segment">
    <div class="ui text container">
      <h3 class="ui header">Breaking The Grid, Grabs Your Attention</h3>
      <p>Instead of focusing on content creation and hard work, we have learned how to master the art of doing nothing by providing massive amounts of whitespace and generic content that can seem massive, monolithic and worth your attention.</p>
      <a class="ui large button">Read More</a>
      <h4 class="ui horizontal header divider">
        <a href="#">Case Studies</a>
      </h4>
      <h3 class="ui header">Did We Tell You About Our Bananas?</h3>
      <p>Yes I know you probably disregarded the earlier boasts as non-sequitur filler content, but its really true. It took years of gene splicing and combinatory DNA research, but our bananas can really dance.</p>
      <a class="ui large button">I'm Still Quite Interested</a>
    </div>
  </div>-->


  <div class="ui inverted vertical footer segment">
    <div class="ui container">
      <div class="ui stackable inverted divided equal height stackable grid">
        <div class="three wide column">
          <h4 class="ui inverted header">关于泽云</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">网站地图</a>
            <a href="#" class="item">联系我们</a>
            <a href="#" class="item">隐私保护</a>
            <a href="#" class="item">法律声明</a>
          </div>
        </div>
        <div class="three wide column">
          <h4 class="ui inverted header">服务</h4>
          <div class="ui inverted link list">
            <a href="#" class="item">一对一图像静态人脸识别</a>
            <a href="#" class="item">一对一视频动态人脸识别</a>
            <a href="#" class="item">一对多图像静态人脸识别</a>
            <a href="#" class="item">一对多视频动态人脸识别</a>
          </div>
        </div>
        <div class="seven wide column">
          <h4 class="ui inverted header">版权所有</h4>
          <p>© 深圳市泽云科技有限公司版权所有</p>
        </div>
      </div>
    </div>
  </div>
</div>

</body>

</html>
