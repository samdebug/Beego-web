<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>{{.Model.BookName}}</title>

    <!-- Bootstrap -->
    <link href="{{cdncss "/static/bootstrap/css/bootstrap.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/font-awesome/css/font-awesome.min.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/jstree/3.3.4/themes/default/style.min.css"}}" rel="stylesheet">

    <link href="{{cdncss "/static/nprogress/nprogress.css"}}" rel="stylesheet">
    <link href="/static/css/kancloud.css" rel="stylesheet">
    <link href="/static/css/jstree.css" rel="stylesheet">
    {{if eq .Model.Editor "markdown"}}
    <link href="{{cdncss "/static/editor.md/css/editormd.preview.css"}}" rel="stylesheet">
    <link href="{{cdncss "/static/prettify/themes/atelier-estuary-dark.min.css"}}" rel="stylesheet">
    <link href="/static/css/markdown.preview.css" rel="stylesheet">
    {{else}}
    <link href="{{cdncss "/static/highlight/styles/zenburn.css"}}" rel="stylesheet">
    {{end}}
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="/static/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="/static/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
</head>
<body>
<div class="m-manual manual-mode-view manual-reader">
    <header class="navbar navbar-static-top manual-head" role="banner">
        <div class="container-fluid">
            <div class="navbar-header pull-left manual-title">
                <span class="slidebar" id="slidebar"><i class="fa fa-align-justify"></i></span>
                <a href="{{urlfor "DocumentController.Index" ":key" .Model.Identify}}" title="{{.Model.BookName}}" class="book-title">{{.Model.BookName}}</a>
                <span style="font-size: 12px;font-weight: 100;"></span>
            </div>
            <div class="navbar-header pull-right manual-menu">
                <div class="dropdown">
                    <button id="dLabel" class="btn btn-default" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        项目
                        <span class="caret"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-right" role="menu" aria-labelledby="dLabel">
                        {{if gt .Member.MemberId 0}}
                        {{if eq .Model.RoleId 0 1 2}}
                        <li><a href="{{urlfor "DocumentController.Edit" ":key" .Model.Identify ":id" ""}}">返回编辑</a> </li>
                        {{end}}
                        <li><a href="{{urlfor "BookController.Index"}}">我的项目</a> </li>
                        <li role="presentation" class="divider"></li>
                        {{end}}
                        {{if eq .Model.PrivatelyOwned 0}}
                        <li><a href="javascript:" data-toggle="modal" data-target="#shareProject">项目分享</a> </li>
                        <li role="presentation" class="divider"></li>
                        <li><a href="{{urlfor "DocumentController.Export" ":key" .Model.Identify "output" "pdf"}}" target="_blank">项目导出PDF</a> </li>
                        {{end}}

                        <li><a href="{{urlfor "HomeController.Index"}}" title="返回首页">返回首页</a> </li>
                    </ul>
                </div>
            </div>
        </div>
    </header>
    <article class="container-fluid manual-body">
        <div class="manual-left">
            <div class="manual-tab">
                <div class="tab-navg">
                    <span data-mode="view" class="navg-item active"><i class="fa fa-align-justify"></i><b class="text">目录</b></span>
                    <span data-mode="search" class="navg-item"><i class="fa fa-search"></i><b class="text">搜索</b></span>
                </div>
                <div class="tab-util">
                    <span class="manual-fullscreen-switch">
                        <b class="open fa fa-angle-right" title="展开"></b>
                        <b class="close fa fa-angle-left" title="关闭"></b>
                    </span>
                </div>
                <div class="tab-wrap">
                    <div class="tab-item manual-catalog">
                        <div class="catalog-list read-book-preview" id="sidebar">
                        {{.Result}}
                        </div>

                    </div>
                    <div class="tab-item manual-search">
                        <div class="search-container">
                            <div class="search-form">
                                <form id="searchForm" action="{{urlfor "DocumentController.Search" ":key" .Model.Identify}}" method="post">
                                    <div class="form-group">
                                        <input type="search" placeholder="请输入搜索关键字" class="form-control" name="keyword">
                                        <button type="submit" class="btn btn-default btn-search" id="btnSearch">
                                            <i class="fa fa-search"></i>
                                        </button>
                                    </div>
                                </form>
                            </div>
                            <div class="search-result">
                                <div class="search-empty">
                                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                                    <b class="text">暂无相关搜索结果！</b>
                                </div>
                                <ul class="search-list" id="searchList">
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="m-copyright">
                <p>
                    本文档使用 <a href="https://www.iminho.me" target="_blank">MinDoc</a> 发布
                </p>
            </div>
        </div>
        <div class="manual-right">
            <div class="manual-article">
                <div class="article-head">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-md-2">

                            </div>
                            <div class="col-md-8 text-center">
                                <h1 id="article-title">{{.Title}}</h1>
                            </div>
                            <div class="col-md-2">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="article-content">
                    <div class="article-body  {{if eq .Model.Editor "markdown"}}markdown-body editormd-preview-container{{else}}editor-content{{end}}"  id="page-content">
                        {{.Content}}
                    </div>
                    <!--
                    {{/*
                    {{if .Model.IsDisplayComment}}
                    <div id="articleComment" class="m-comment">
                        <div class="comment-result">
                            <strong class="title">相关评论(<b class="comment-total">{{.Model.CommentCount}}</b>)</strong>
                            <div class="comment-post">
                                <form class="form" action="/comment/create" method="post">
                                    <label class="enter w-textarea textarea-full">
                                        <textarea class="textarea-input form-control" name="content" placeholder="文明上网，理性发言" style="height: 72px;"></textarea>
                                        <input type="hidden" name="doc_id" value="118003">
                                    </label>
                                    <div class="util cf">
                                        <div class="pull-left"><span style="font-size: 12px;color: #999"> 支持Markdown语法 </span></div>
                                        <div class="pull-right">
                                            <span class="form-tip w-fragment fragment-tip">Ctrl + Enter快速发布</span>
                                            <label class="form-submit w-btn btn-success btn-m">
                                                <button class="btn btn-success btn-sm" type="submit">发布</button>
                                            </label>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div class="clearfix"></div>
                            <div class="comment-list">
                                <div class="comment-empty"><b class="text">暂无相关评论</b></div>
                                <div class="comment-item" data-id="5841">
                                    <p class="info"><a href="/@phptest" class="name">静夜思</a><span class="date">9月1日评论</span></p>
                                    <div class="content">一直不明白，控制器分层和模型分层调用起来到底有什么区别</div>
                                    <p class="util">
                                        <span class="vote">
                                            <a class="agree e-agree" href="javascript:;" data-id="5841" title="赞成">
                                                <i class="fa fa-thumbs-o-up"></i></a><b class="count">4</b>
                                            <a class="oppose e-oppose" href="javascript:;" data-id="5841" title="反对"><i class="fa fa-thumbs-o-down"></i></a>
                                        </span>
                                        <a class="reply e-reply" data-account="phptest">回复</a>
                                        <span class="operate toggle">
                                            <a class="delete e-delete" data-id="5841" data-href="/comment/delete"><i class="icon icon-cross"></i></a>
                                            <span class="number">23#</span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {{end}}
*/}}-->
                    <div class="jump-top">
                        <a href="javascript:;" class="view-backtop"><i class="fa fa-arrow-up" aria-hidden="true"></i></a>
                    </div>
                </div>

            </div>
        </div>
        <div class="manual-progress"><b class="progress-bar"></b></div>
    </article>
    <div class="manual-mask"></div>
</div>

<!-- Share Modal -->
<div class="modal fade" id="shareProject" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title" id="myModalLabel">项目分享</h4>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-sm-12 text-center" style="padding-bottom: 15px;">
                        <img src="{{urlfor "DocumentController.QrCode" ":key" .Model.Identify}}" alt="扫一扫手机阅读" />
                    </div>
                </div>
                <div class="form-group">
                    <label for="password" class="col-sm-2 control-label">项目地址</label>
                    <div class="col-sm-10">
                        <input type="text" value="{{.BaseUrl}}{{urlfor "DocumentController.Index" ":key" .Model.Identify}}" class="form-control" onmouseover="this.select()" id="projectUrl" title="项目地址">
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
            </div>
        </div>
    </div>
</div>
<script src="{{cdnjs "/static/jquery/1.12.4/jquery.min.js"}}"></script>
<script src="{{cdnjs "/static/bootstrap/js/bootstrap.min.js"}}"></script>
<script src="{{cdnjs "/static/js/jquery.form.js"}}" type="text/javascript"></script>
<script src="{{cdnjs "/static/jstree/3.3.4/jstree.min.js"}}" type="text/javascript"></script>
<script type="text/javascript" src="{{cdnjs "/static/nprogress/nprogress.js"}}"></script>
<script type="text/javascript" src="{{cdnjs "/static/highlight/highlight.js"}}"></script>
<script type="text/javascript" src="{{cdnjs "/static/highlight/highlightjs-line-numbers.min.js"}}"></script>
<script type="text/javascript" src="/static/js/jquery.highlight.js"></script>
<script type="text/javascript" src="/static/js/kancloud.js"></script>
<script type="text/javascript">
$(function () {
    $("#searchList").on("click","a",function () {
        var id = $(this).attr("data-id");
        var url = "{{urlfor "DocumentController.Read" ":key" .Model.Identify ":id" ""}}/" + id;
        $(this).parent("li").siblings().find("a").removeClass("active");
        $(this).addClass("active");
        loadDocument(url,id,function (body) {
            return $(body).highlight(window.keyword);
        });
    });
});
</script>
</body>
</html>