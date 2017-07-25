//获取登录信息
var UserInfo = {
	username: sessionStorage.getItem('username'),
	realname: sessionStorage.getItem('realname'),
	gender: sessionStorage.getItem('gender'),
	jobinfor: sessionStorage.getItem('jobinfor'),
	avatar: sessionStorage.getItem('avatar'),
	isLocked: sessionStorage.getItem('islocked'),
	passwdstrength: sessionStorage.getItem('passwdstrength')
};
//加载头像
$("#banner-user-p").attr("src", UserInfo.avatar);
$("#banner-user").children("p").text(UserInfo.username);

//公共参数
var CommonPar = {
	//后台接口地址
	libAddr: {
		account: host,
		targets: host,
	},
	//页面头部标签选项
	headerList: {
		match: {
			href: prefix + '/match' + suffix,
			class: 'match-icon',
			title: '人脸检索'
		},
		ver: {
			href: prefix + '/ver' + suffix,
			class: 'ver-icon',
			title: '人脸验证'
		},
		targets: {
			href: prefix + '/targets' + suffix,
			class: 'targets-icon',
			title: '目标库管理'
		},
		about: {
			href: prefix + '/about' + suffix,
			class: 'about-icon',
			title: '关于'
		}
	},
	headerAsideHref:{
		account: prefix + '/account' + suffix,
		userMgr: prefix + '/userManagement' + suffix,
		login: prefix + '/login' + suffix
	},
	//储存clickoutside事件执行队列
	clickOutsideId: {
		id: [],
		fun: []
	},
};

var privilege = {
	init: function () {
		var uid = sessionStorage.id;
		privilege.authentication(uid);
	},
	authentication: function (uid) {
		$(".targets-person-multinew").hide();
		if (uid != 1) {
			// 管理员写死uid为1，uid不为1的就是普通用户
			// 普通用户隐藏大部分编辑、删除操作
			$("[data-nav='account-manage']").hide();
			$("#targets-lib-list").find(".targets-lib-edit").parent().html('--');
			$("#targets-lib-file").find(".pulldown-icon").parent().hide();
			$("#targets-person-delete-tocheck").hide();
			$(".targets-person-detail-delete").hide();
			$(".targets-person-detail-toedit").hide();
			$(".targets-person-lib-edit").hide();
			$("#targets-lib-add").hide();
		}
	}
};

//公共函数
var CommonFun = {
	//气泡提示
	bubbleMsg: function(msg) {
		var $msg = $('<aside id="bubble-msg">' + msg + '</aside>');
		$("body").append($msg);
		setTimeout(function() {
			$msg.remove();
		}, 2000);
	},
	//气泡加载中
	bubbleLoading: {
		setMsg: function(msg){
			var $msg = $("#bubble-loading");
			if($msg.length) $msg.find("p").text(msg);
			else{
				$msg = $('<aside id="bubble-loading"><div><img src="../img/loading.gif" /><p>' + msg + '</p></div></aside>');
				$("body").append($msg);
			}
		},
		removeMsg: function(){
			var $msg = $("#bubble-loading");
			if($msg.length) $msg.remove();
		},
	},
	privilegeManage: function(){
		privilege.init();
	},
	//确认弹出框提示
	confirmMsg: function(msg, fun) {
		var $confirm = $('<aside id="comfirm-bs"></aside>'),
			_confirm = '<div></div>' +
			'<section>' +
			'<header>提示<img id="confirm-bs-close" src="../img/close.png"></header>' +
			'<article>' +
			'<p><span class="wrong"></span>' + msg + '</p>' +
			'<aside>该动作不可恢复</aside>' +
			'</article>' +
			'<footer><a id="confirm-bs-cancel">取消</a><a id="confirm-bs-submit">确定</a></footer>' +
			'</section>';
		$confirm.append(_confirm);
		$("body").append($confirm);
		$("#confirm-bs-cancel,#confirm-bs-close").on("click", function() {
			$confirm.remove();
		});
		$("#confirm-bs-submit").on("click", function() {
			fun();
			$confirm.remove();
		});
	},
	//确认输入密码提示
	confirmPassword: function(msg, fun) {
		var $confirm = $('<aside id="comfirm-bs"></aside>'),
			_confirm = '<div></div>' +
			'<section>' +
			'<header>提示<img id="confirm-bs-close" src="../img/close.png"></header>' +
			'<article>' +
			'<p><span class="wrong"></span>' + msg + '</p>' +
			'<input id="confirm-bs-input" type="password" placeholder="请输入密码进行确认" />' +
			'</article>' +
			'<footer><a id="confirm-bs-cancel">取消</a><a id="confirm-bs-submit">确定</a></footer>' +
			'</section>';
		$confirm.append(_confirm);
		$("body").append($confirm);
		$("#confirm-bs-cancel,#confirm-bs-close").on("click", function() {
			$confirm.remove();
		});
		//输入旧密码验证是否一致
		$("#confirm-bs-input").keyup(function() {
			var $this = $(this),
				$a = $this.siblings('a'),
				state = 'wrong';
			// if($this.val() == "admin"){
			// 	state = 'currect';
			// }
			if ($a.length) {
				$a.removeClass().addClass(state);
			} else {
				$this.after('<a class="' + state + '"></a>');
			}
			$.get(CommonPar.libAddr.account + "/login/check?username=" + UserInfo.username + "&password=" + $this.val(), function(data) {
				var _data = data;
				if (_data.result == "success") state = 'currect';
				if ($a.length) $a.removeClass().addClass(state);
				else $this.after('<a class="' + state + '"></a>');
			}, "json");
		});
		$("#confirm-bs-submit").on("click", function() {
			if ($confirm.find('a.currect').length) {
				fun();
				$confirm.remove();
			} else {
				CommonFun.bubbleMsg("请输入正确的密码");
			}

		});
	},
	//字符截取加省略号
	stringCut: function(str,len) {
		var _str = '';
		if(str && (str.length > len)){
			_str = str.substr(0,len) + '...';
		}else{
			_str = str;
		}
		return _str;
	},
	//密码强度验证
	checkPasswordStrength: function(_password) {
		var that = this,
			_options = that.options;
		var strength = 1;
		if (_password.length >= 15) strength++;
		if (/[A-Z]/.test(_password) && /[a-z]/.test(_password)) strength++;
		if ((/[A-Za-z]/.test(_password) && /[0-9]/.test(_password)) || (/\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\.\>\/\?]/.test(_password) && /[0-9]/.test(_password)) || (/[A-Za-z]/.test(_password) && /[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\.\>\/\?]/.test(_password))) strength++;
		if (/[A-Za-z]/.test(_password) && /[0-9]/.test(_password) && /[\`\~\!\@\#\$\%\^\&\*\(\)\-\_\=\+\[\]\{\}\\\|\;\:\'\"\,\<\.\>\/\?]/.test(_password)) strength++;

		return strength;
	},
	//性别转换
	genderChinesize: function(gender) {
		var _gender = gender == "male" ? "男" : (gender == "female" ? "女" : "未知");
		return _gender;
	},
	//级别转换
	levelChinesize: function(level) {
		var _level = level == "A" ? "重点" : (level == "B" ? "一般" : "未知");
		return _level;
	},
	//眼镜转换
	eyeglassChinesize: function(eyeglass) {
		var _eyeglass = eyeglass == "1" ? "戴眼镜" : (eyeglass == "2" ? "不戴眼镜" : "");
		return _eyeglass;
	},
	//数字转星期
	numberToWeek: function(weeklist) {
		var _weeklist = weeklist;
		_weeklist = _weeklist.split(",");
		for (j in _weeklist) {
			switch (_weeklist[j]) {
				case '1':
					_weeklist[j] = '星期一';
					break;
				case '2':
					_weeklist[j] = '星期二';
					break;
				case '3':
					_weeklist[j] = '星期三';
					break;
				case '4':
					_weeklist[j] = '星期四';
					break;
				case '5':
					_weeklist[j] = '星期五';
					break;
				case '6':
					_weeklist[j] = '星期六';
					break;
				case '7':
					_weeklist[j] = '星期日';
					break;
			};
		}
		if (_weeklist.length == 7) _weeklist = "每天";
		else if(_weeklist.length == 5 && _weeklist.indexOf('星期六') == -1 && _weeklist.indexOf('星期日') == -1) _weeklist = "工作日";
		else _weeklist = _weeklist.join(",");
		return _weeklist;
	},
	//分页逻辑,传入总条数以及重新渲染页面函数reload(第几页,其余选项)
	pagination: function($pagination, reload, totalnum, that, option) {
		var onepage = (option && option.onepagenum) ? option.onepagenum : 25,
			pagenum = Math.ceil(totalnum / onepage),
			$pagilist = '<ul><li data-num="last"><span></span>上一页</li>',/*<img src="../img/arrow_right.png" />*/
			pagenow = $pagination.attr("data-page") ? $pagination.attr("data-page") : 1;
		if (totalnum == 0) {
			$pagination.hide();
			return;
		}
		pagenow = Number(pagenow);
		$pagination.show();
		if (pagenum <= 8) {
			for (i = 1; i <= pagenum; i++) {
				$pagilist += (pagenow == i) ? ('<li class="active" data-num="' + i + '">' + i + '</li>') : ('<li data-num="' + i + '">' + i + '</li>');
			}
		} else {
			if (pagenum - pagenow > 4) {
				var _first = (pagenow > 4) ? (pagenow - 4) : 1,
					_last = (pagenow > 4) ? (pagenow + 4) : 9;
				for (i = _first; i < _last; i++) {
					$pagilist += (pagenow == i) ? ('<li class="active" data-num="' + i + '">' + i + '</li>') : ('<li data-num="' + i + '">' + i + '</li>');
				}
			} else {
				for (i = pagenum - 7; i <= pagenum; i++) {
					$pagilist += (pagenow == i) ? ('<li class="active" data-num="' + i + '">' + i + '</li>') : ('<li data-num="' + i + '">' + i + '</li>');
				}
			}
		}
		$pagilist += '<li data-num="next">下一页<span></span></li>' +
			'</ul>' +
			'<p>共' + pagenum + '页</p>' +
			'<p>到第</p>' +
			'<input type="number" />' +
			'<p>页</p>' +
			'<a>确定</a>';

		$pagination.html($pagilist);
		$pagination.find("li").off("click").on("click", function() {
			var $this = $(this),
				_page = $this.attr("data-num");
			if (_page == "last") {
				if (pagenow == 1) {
					CommonFun.bubbleMsg("已经是第一页了");
					return;
				}
				$pagination.attr("data-page", pagenow - 1);
				reload(pagenow - 1, that, option);
			} else if (_page == "next") {
				if (pagenow == pagenum) {
					CommonFun.bubbleMsg("已经是最后一页了");
					return;
				}
				$pagination.attr("data-page", pagenow + 1);
				reload(pagenow + 1, that, option);
			} else {
				$pagination.attr("data-page", _page);
				reload(_page, that, option);
			}
		});
		$pagination.find("a").off("click").on("click", function() {
			var _page = $(this).siblings("input").val();
			if (_page && _page > 0 && _page <= pagenum) {
				$pagination.attr("data-page", _page);
				reload(_page, that, option);
			}
		});
	},
	//判断是否当前元素之外元素
	clickOutside: function(_id, fun) {
		CommonPar.clickOutsideId.id.push(_id);
		CommonPar.clickOutsideId.fun[_id] = fun;
		$(document).off("click").on("click", function(e) {
			var e = e || window.event,
				eventX = e.pageX - scrollX || e.clientX,
				eventY = e.pageY - scrollY || e.clientY,
				target = document.elementFromPoint(eventX, eventY),
				id = $(target).attr("id");
			while (CommonPar.clickOutsideId.id.indexOf(id) == -1 && target.tagName != "BODY") {
				target = target.parentElement;
				id = $(target).attr("id");
			}
			for (i in CommonPar.clickOutsideId.id) {
				if (CommonPar.clickOutsideId.id[i] != id) {
					CommonPar.clickOutsideId.fun[CommonPar.clickOutsideId.id[i]]();
					CommonPar.clickOutsideId.fun.splice(CommonPar.clickOutsideId.id[i], 1);
					CommonPar.clickOutsideId.id.splice(i, 1);
				}
			}
			if (!CommonPar.clickOutsideId.id.length) $(document).off("click");
		});
	},
};

//后台接口地址
// $.ajax({
// 	type: 'get',
// 	url: "http://172.20.3.229:8180/monitor/netconfig?",
// 	dataType: "json",
// 	async: false,
// 	beforeSend: function(){
// 		//CommonFun.bubbleMsg("正在连接服务");
// 	},
// 	success: function(data) {
// 		if (data.result == "success") {
// 			var _data = data.data;
// 			console.log(_data);
// 			CommonPar.libAddr = {
// 				account: 'http://' + _data.webserver.ip + ':' + _data.webserver.port,
// 				camera: 'http://' + _data.webtask.ip + ':' + _data.webtask.port,
// 				tasks: 'http://' + _data.webtask.ip + ':' + _data.webtask.port,
// 				targets: 'http://' + _data.webclique.ip + ':' + _data.webclique.port,
// 				history: 'http://' + _data.webhistory.ip + ':' + _data.webhistory.port,
// 				surveillance: 'http://' + _data.webcapdetect.ip + ':' + _data.webcapdetect.port,
// 			}
// 		} else {
// 			CommonFun.bubbleMsg("连接服务错误");
// 		}
// 	},
// 	error: function() {
// 		CommonFun.bubbleMsg("无法连接服务");
// 	}
// });

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function(fmt) { //author: meizz
	var o = {
		"M+": this.getMonth() + 1, //月份
		"d+": this.getDate(), //日
		"h+": this.getHours(), //小时
		"m+": this.getMinutes(), //分
		"s+": this.getSeconds(), //秒
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度
		"S": this.getMilliseconds() //毫秒
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
