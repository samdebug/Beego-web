;
(function($, window, document, undefined) {
	$.fn.headerFrame = function(options) {
		//创建commonFrame
		var headerFrame = new HeaderFrame(this, options);
		//调用其方法
		headerFrame.init();
	};

	var HeaderFrame = function(ele, opt) {
		this.$ele = ele,
			this.defaults = {
				$header: $('#common-header'),
			},
			this.options = $.extend({}, this.defaults, opt);
	};
	HeaderFrame.prototype = {
		init: function() {
			var that = this,
				_options = that.options;
			that.render();
		},
		//渲染头部和尾部
		render: function() {
			var that = this,
				_options = that.options,
				$header = _options.$header,
				_current = _options.current,
				_header = '',
				_class;

			_header += '<header id="header">' +
				'<nav id="banner">' +
				'<section id="banner-menu">';

			var i;
			for (i in CommonPar.headerList) {
				_class = (CommonPar.headerList[i].title == _current) ? "current" : "";
				_header += '<a href="' + CommonPar.headerList[i].href + '" class="' + _class + '">' +
					'<span class="' + CommonPar.headerList[i].class + '" ></span>' +
					CommonPar.headerList[i].title +
					'</a>';
			}

			_header += '</section>' +
				'<aside id="banner-user">' +
					// '<img id="banner-user-bg" src="../img/user.png" />' +
					// '<img id="banner-user-p" src="' + /*UserInfo.avatar +*/ '" />' +
					'<p>' + UserInfo.username + '</p>' +
					'<aside id="banner-user-nav">' +
					'<a data-nav="account-setting">账户设置</a>' +
					'<a data-nav="account-manage">用户管理</a>' +
					'<a data-nav="logout">退出</a>' +
					'</aside>' +
					'</aside>' +
					'</nav>' +
					'<aside id="clock">' +
					'<img src="../img/clock.png" />' +
					'<p id="clock-time"></p>' +
				'</aside>' +
				'</header>';
			$header.after(_header);
			$header.remove();
			//nav跳转
			$("#banner-user-nav").children("a").off("click").on("click", function() {
				var $this = $(this),
					_load = $this.attr("data-nav");
				switch (_load) {
					case "account-setting":
						location.href = CommonPar.headerAsideHref.account;
						break;
					case "account-manage":
						location.href = CommonPar.headerAsideHref.userMgr;
						break;
					case "logout":
						$.ajax({
							type: 'get',
							url: urls.logout(),
							dataType: 'text',
							jsonp: "jsoncallback",
							async: false,
							success: function (data) {},
							error: function () {}
						});
						sessionStorage.clear();
						location.href = CommonPar.headerAsideHref.login;
						break;
				}
			});

			window.setInterval(that.renderClock, 100);
			privilege.init();
			return this;
		},
		renderClock: function() {
			var that = this,
				_options = that.options,
				$clock = $("#clock-time"),
				_date = new Date(),
				_clock = ' ';

			_clock += _date.getFullYear() + '-' + numberStandard((_date.getMonth() + 1)) + '-' +
				numberStandard(_date.getDate());
			switch (_date.getDay()) {
				case 1:
					_clock += ' ' + '星期一';
					break;
				case 2:
					_clock += ' ' + '星期二';
					break;
				case 3:
					_clock += ' ' + '星期三';
					break;
				case 4:
					_clock += ' ' + '星期四';
					break;
				case 5:
					_clock += ' ' + '星期五';
					break;
				case 6:
					_clock += ' ' + '星期六';
					break;
				case 0:
					_clock += ' ' + '星期日';
					break;
			}
			_clock += ' ' + numberStandard(_date.getHours()) + ':' + numberStandard(_date.getMinutes()) +
				':' + numberStandard(_date.getSeconds());
			$clock.text(_clock);

			function numberStandard(num) {
				var _val = Number(num),
					_num;
				_num = (_val < 10) ? ('0' + _val) : ('' + _val);
				return _num;
			}
		},

	};
})(jQuery, window, document);
