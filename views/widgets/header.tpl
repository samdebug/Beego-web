<header class="navbar navbar-static-top navbar-fixed-top manual-header" role="banner">
    <div class="container-fluid" id="header-container">
        <div class="navbar-header col-sm-12 col-md-7 col-lg-6">
            <a href="/" class="navbar-brand">
                <img src="/static/img/logo.png" />
            </a>
            <div class="searchbar pull-left visible-lg-inline-block visible-md-inline-block">
                <form class="form-inline" action="{{urlfor "SearchController.Index"}}" method="get">
                    <input class="form-control" name="keyword" type="search" style="height: 34px;width: 230px;border: 1px solid#e6e9f0;" placeholder="请输入关键词..." value="{{.Keyword}}">
                    <button class="search-btn">
                        <i class="lnr lnr-magnifier"></i>
                    </button>
                </form>
            </div>

            <div class="btn-group dropdown-menu-right pull-right slidebar visible-xs-inline-block visible-sm-inline-block">
                <button class="btn btn-default dropdown-toggle hidden-lg" type="button" data-toggle="dropdown"><i class="fa fa-align-justify"></i></button>
                <ul class="dropdown-menu" role="menu">
                    {{if gt .Member.MemberId 0}}
                            <li>
                                <a href="{{urlfor "SettingController.Index"}}" title="个人中心"><i class="lnr lnr-user" aria-hidden="true"></i> 个人中心</a>
                            </li>
                            <!--<li>
                                <a href="{{urlfor "BookController.Index"}}" title="我的项目"><i class="lnr lnr-book" aria-hidden="true"></i> 我的项目</a>
                            </li>-->
                            {{if eq .Member.Role 0 }}
                            <li>
                                <a href="{{urlfor "ManagerController.Index"}}" title="人脸系统"><i class="lnr lnr-frame-expand" aria-hidden="true"></i> 人脸系统</a>
                            </li>
                            {{end}}
                            <li>
                                <a href="{{urlfor "AccountController.Logout"}}" title="退出登录"><i class="lnr lnr-exit"></i> 退出登录</a>
                            </li>

                    {{else}}
                    <li><a href="{{urlfor "AccountController.Login"}}" title="用户登录">登录</a></li>
                    {{end}}
                </ul>
            </div>

        </div>
        <nav class="navbar-collapse hidden-xs hidden-sm" role="navigation">
            <ul class="nav navbar-nav navbar-right">
                {{if gt .Member.MemberId 0}}
                <li>
                    <div class="img user-info" data-toggle="dropdown">
                        <div class="userbar-content">
                            <span>{{.Member.Account}}</span>
                            <div>{{.Member.RoleName}}</div>
                        </div>
                        <img src="{{cdnimg .Member.Avatar}}" class="img-circle userbar-avatar" alt="{{.Member.Account}}">
                        <!--<i class="fa fa-chevron-down" aria-hidden="true"></i>-->
                    </div>
                    <ul class="dropdown-menu user-info-dropdown" role="menu">
                        <li>
                            <a href="{{urlfor "SettingController.Index"}}" title="个人中心"><i class="lnr lnr-user" aria-hidden="true"></i> 个人中心</a>
                        </li>
                        <!--<li>
                            <a href="{{urlfor "BookController.Index"}}" title="我的项目"><i class="lnr lnr-book" aria-hidden="true"></i> 我的项目</a>
                        </li>-->
                        {{if eq .Member.Role 0  1}}
                        <li>
                            <a href="{{urlfor "ManagerController.Index"}}" title="人脸系统"><i class="lnr lnr-frame-expand" aria-hidden="true"></i> 人脸系统</a>
                        </li>
                        {{end}}
                        <li>
                            <a href="{{urlfor "AccountController.Logout"}}" title="退出登录"><i class="lnr lnr-exit"></i> 退出登录</a>
                        </li>
                    </ul>
                </li>
                {{else}}
                <li><a href="{{urlfor "AccountController.Login"}}" title="用户登录">登录</a></li>
                {{end}}
            </ul>
        </nav>
    </div>
</header>