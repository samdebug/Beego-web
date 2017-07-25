;
(function($, window, document, undefined) {
	$.fn.targets = function(options) {
		//创建targets
		var targets = new Targets(options);
		//调用其方法
		targets.init();
	}

	var Targets = function(opt) {
		this.defaults = {
				$targets_lib_con: $("#targets-lib-con"),
				$targets_lib: $("#targets-lib"),
				$targets_lib_edit_con: $("#targets-lib-edit-con"),
				$targets_person_con: $("#targets-person-con"),
				$targets_person: $("#targets-person"),
				$targets_no_person: $("#targets-no-person"),
				$targets_person_multiimport_con: $("#targets-person-multiimport-con"),
				$targets_person_detail_con: $("#targets-person-detail-con"),
				$targets_person_detail: $("#targets-person-detail"),
				$targets_person_edit_con: $("#targets-person-edit-con"),
				$targets_person_edit: $("#targets-person-edit"),
				$targets_person_search_input: $("#targets-person-search-input"),
				$targets_person_search_enter: $("#targets-person-search-enter"),
				$targets_person_delete_tocheck: $("#targets-person-delete-tocheck"),
				$targets_person_delete_info: $("#targets-person-delete-info"),
				$targets_person_file: $("#targets-person-file"),
				$targets_person_edit_con_submit: $("#targets-lib-edit-con-submit"),
				$targets_person_edit_con_cancel: $("#targets-lib-edit-con-cancel"),
				$targets_person_edit_con_close: $("#targets-lib-edit-con-close"),
				$targets_lib_list: $("#targets-lib-list"),
				$targets_lib_file: $("#targets-lib-file"),
				$targets_lib_add: $("#targets-lib-add"),
				$targets_lib_info: $("#targets-person-lib-info"),
				$targets_lib_brief_style: $("#targets-lib-brief-style"),
				$targets_lib_detail_style: $("#targets-lib-detail-style"),
				$targets_lib_begin_time: $("#targets-lib-begin-time"),
				$targets_lib_end_time: $("#targets-lib-end-time"),
				$targets_lib_date_submit: $("#targets-lib-date-submit"),
				$targets_lib_date_reset: $("#targets-lib-date-reset"),
				$targets_lib_search_input: $("#targets-lib-search-input"),
				$targets_lib_search_enter: $("#targets-lib-search-enter"),
				$targets_lib_list_pagination: $("#targets-lib-list-pagination"),
				$targets_person_list_pagination: $("#targets-person-list-pagination"),
				file_id: 1,
				targets_lib_style: "list",
				loading_lib_id: "",
				loading_lib_name: "",
				loading_person_id: "",
				loading_person_name: "",
				edit_delete_list: [],
				edit_add_list: [],
				lib_info: {},
				person_info: {},
			},
			this.options = $.extend({}, this.defaults, opt);
	}
	Targets.prototype = {
		//Targets初始化
		init: function() {
			var that = this,
				_options = that.options;

			//显示列表
			that.targetsLibInit();
			//nav面包屑导航统一初始化

			return this;
		},



		//targetsNav初始化
		targetsNavRender: function($nav_con) {
			var that = this,
				_options = that.options;

			//nav渲染
			$nav_con.children("a[data-nav='lib']").text(CommonFun.stringCut(_options.loading_lib_name,10));
			$nav_con.children("a[data-nav='person']").text(CommonFun.stringCut(_options.loading_person_name,10));
			//点击事件
			$nav_con.children("a").off("click").on("click", function() {
				var $this = $(this),
					_nav = $this.attr("data-nav"),
					_id = $this.attr("data-id");
				switch (_nav) {
					case "lib":
						that.targetsPersonInit(_options.loading_lib_id);
						break;
					case "person":
						that.targetsPersonDetailInit(_options.loading_person_id);
						break;
					case "person-edit":
						that.targetsPersonEditRender("edit", _options.loading_person_id);
						break;
					case "person-new":
						break;
					default:
						that.init();
				}
				if (_nav) {

				} else {
					that.init();
				}
			});

			return this;
		},



		//targetsList初始化
		targetsLibInit: function() {
			var that = this,
				_options = that.options;
			//显示list模块，关闭其他模块
			_options.$targets_lib_con.show();
			_options.$targets_lib_edit_con.hide();
			_options.$targets_person_con.hide();
			_options.$targets_person_multiimport_con.hide();
			_options.$targets_person_detail_con.hide();
			_options.$targets_person_edit_con.hide();
			_options.$targets_lib_date_reset.hide();

			//nav渲染
			that.targetsNavRender(_options.$targets_lib_con.find("nav.breadcrumb"));

			//建库时间重置
			_options.$targets_lib_begin_time.children("p").html('<p><span class="calendar-icon"></span>开始日期</p>');
			_options.$targets_lib_end_time.children("p").html('<p><span class="calendar-icon"></span>结束日期</p>');
			_options.$targets_lib_date_reset.hide();

			//list模块中显示列表，关闭文件夹
			_options.$targets_lib_list.show();
			_options.$targets_lib_file.hide();
			_options.$targets_lib_detail_style.addClass("highlight");
			_options.$targets_lib_brief_style.removeClass("highlight");

			//标注当下模式
			_options.targets_lib_style = "list";
			_options.$targets_lib_list_pagination.attr("data-page", "1");

			//渲染页面
			that.targetsListRender();

			//建库时间选择部分加载
			that.targetsBuildTimeLoad();

			//新建目标库
			_options.$targets_lib_add.off("click").on("click", function() {
				that.targetsLibEdit("new");
			});

			//页面搜索渲染
			that.searchLibInit();

			return this;
		},



		//建库时间选择部分加载
		targetsBuildTimeLoad: function() {
			var that = this,
				_options = that.options;

			//选择建库开始时间
			_options.$targets_lib_begin_time.children("p").off("click").on("click", function() {
				var $this = $(this),
					$calendar = $this.siblings("aside"),
					_date = $this.text(),
					_todate = new Date(),
					_date_end = _options.$targets_lib_end_time.children("p").text();
				if ($this.attr("class") == "active") {
					$this.removeAttr("class");
					$calendar.hide();
				} else {
					$this.attr("class", "active");
					$calendar.show();

					if (_date == "开始日期") {
						if (_date_end != "结束日期") {
							var d_e = _date_end.split('年'),
								_y_e = Number(d_e[0]),
								_m_e = Number(d_e[1].split("月")[0]),
								_d_e = Number(d_e[1].split("月")[1].split("日")[0]);
							$calendar.calendar({
								year_last: _y_e,
								month_last: _m_e,
								date_last: _d_e,
							});
						} else {
							$calendar.calendar({
								year_last: _todate.getFullYear(),
								month_last: (_todate.getMonth() + 1),
								date_last: _todate.getDate(),
							});
						}
					} else {
						var d = _date.split('年'),
							_y = Number(d[0]),
							_m = Number(d[1].split("月")[0]),
							_d = Number(d[1].split("月")[1].split("日")[0]);
						if (_date_end != "结束日期") {
							var d_e = _date_end.split('年'),
								_y_e = Number(d_e[0]),
								_m_e = Number(d_e[1].split("月")[0]),
								_d_e = Number(d_e[1].split("月")[1].split("日")[0]);
							$calendar.calendar({
								year_chosen: _y,
								month_chosen: _m,
								date_chosen: _d,
								year_last: _y_e,
								month_last: _m_e,
								date_last: _d_e,
							});
						} else {
							$calendar.calendar({
								year_chosen: _y,
								month_chosen: _m,
								date_chosen: _d,
								year_last: _todate.getFullYear(),
								month_last: (_todate.getMonth() + 1),
								date_last: _todate.getDate(),
							});
						}

					}

				}
				CommonFun.clickOutside("targets-lib-begin-time", function() {
					$calendar.hide();
					$this.removeAttr("class");
				});
			});
			//选择建库结束时间
			_options.$targets_lib_end_time.children("p").off("click").on("click", function() {
				var $this = $(this),
					$calendar = $this.siblings("aside"),
					_date = $this.text(),
					_todate = new Date(),
					_date_begin = _options.$targets_lib_begin_time.children("p").text();
				if ($this.attr("class") == "active") {
					$this.removeAttr("class");
					$calendar.hide();
				} else {
					$this.attr("class", "active");
					$calendar.show();

					if (_date == "结束日期") {
						if (_date_begin != "开始日期") {
							var d_b = _date_begin.split('年'),
								_y_b = Number(d_b[0]),
								_m_b = Number(d_b[1].split("月")[0]),
								_d_b = Number(d_b[1].split("月")[1].split("日")[0]);
							$calendar.calendar({
								year_origin: _y_b,
								month_origin: _m_b,
								date_origin: _d_b,
								year_last: _todate.getFullYear(),
								month_last: _todate.getMonth() + 1,
								date_last: _todate.getDate(),
							});
						} else $calendar.calendar({
							year_last: _todate.getFullYear(),
							month_last: _todate.getMonth() + 1,
							date_last: _todate.getDate(),
						});
					} else {
						var d = _date.split('年'),
							_y = Number(d[0]),
							_m = Number(d[1].split("月")[0]),
							_d = Number(d[1].split("月")[1].split("日")[0]);
						if (_date_begin != "开始日期") {
							var d_b = _date_begin.split('年'),
								_y_b = Number(d_b[0]),
								_m_b = Number(d_b[1].split("月")[0]),
								_d_b = Number(d_b[1].split("月")[1].split("日")[0]);
							$calendar.calendar({
								year_chosen: _y,
								month_chosen: _m,
								date_chosen: _d,
								year_origin: _y_b,
								month_origin: _m_b,
								date_origin: _d_b,
								year_last: _todate.getFullYear(),
								month_last: _todate.getMonth() + 1,
								date_last: _todate.getDate(),
							});
						} else {
							$calendar.calendar({
								year_chosen: _y,
								month_chosen: _m,
								date_chosen: _d,
								year_last: _todate.getFullYear(),
								month_last: _todate.getMonth() + 1,
								date_last: _todate.getDate(),
							});
						}

					}

				}
				CommonFun.clickOutside("targets-lib-end-time", function() {
					$calendar.hide();
					$this.removeAttr("class");
				});
			});

			//提交建库时间
			_options.$targets_lib_date_submit.off("click").on("click", function() {
				var $this = $(this),
					_date_begin = _options.$targets_lib_begin_time.children("p").text(),
					_date_end = _options.$targets_lib_end_time.children("p").text(),
					//获取当前显示方式
					type = _options.targets_lib_style;
				//判断是否有选择时间
				if (_date_begin == "开始日期" && _date_end == "结束日期") {
					CommonFun.bubbleMsg("请选择日期");
				} else {
					if (_date_begin == "开始日期") {
						_date_begin = "2000-1-1 00:00:00";
						_date_end = _date_end.replace("年", "-").replace("月", "-").replace("日", "") + " 23:59:59";
					} else if (_date_end == "结束日期") {
						_date_begin = _date_begin.replace("年", "-").replace("月", "-").replace("日", "") + " 00:00:00";
						_date_end = new Date().Format("yyyy-MM-dd hh:mm:ss");
					} else {
						_date_end = _date_end.replace("年", "-").replace("月", "-").replace("日", "") + " 23:59:59";
						_date_begin = _date_begin.replace("年", "-").replace("月", "-").replace("日", "") + " 00:00:00";
					}
					if (type == "list") {
						_options.$targets_lib_list_pagination.removeAttr("data-page");
						that.targetsListRender(1, that, {
							url: CommonPar.libAddr.targets + "/vipbase/search/imgclique/time?start=" + _date_begin + "&stop=" + _date_end
						});
					} else if (type == "file") {
						_options.$targets_lib_list_pagination.removeAttr("data-page");
						that.targetsFileRender(1, that, {
							url: CommonPar.libAddr.targets + "/vipbase/search/imgclique/time?start=" + _date_begin + "&stop=" + _date_end
						});
					}
					CommonFun.bubbleMsg("提交成功");
					_options.$targets_lib_date_reset.show();
				}
			});
			//重置建库时间
			_options.$targets_lib_date_reset.off("click").on("click", function() {
				var $this = $(this),
					//获取当前显示方式
					type = _options.targets_lib_style;
				//重置时间，并渲染
				_options.$targets_lib_begin_time.children("p").html('<p><span class="calendar-icon"></span>开始日期</p>');
				_options.$targets_lib_end_time.children("p").html('<p><span class="calendar-icon"></span>结束日期</p>');
				_options.$targets_lib_date_reset.hide();
				if (type == "list") {
					_options.$targets_lib_list_pagination.removeAttr("data-page");
					that.targetsListRender();
				} else if (type == "file") {
					_options.$targets_lib_list_pagination.removeAttr("data-page");
					that.targetsFileRender();
				}
			});

			return this;
		},



		//targetsList渲染
		targetsListRender: function(page, that, option) {
			var that = that || this,
				_options = that.options,
				page = page || 1,
				search = (option && option.search) ? option.search : "",
				url = (option && option.url) ? (option.url + "&page=" + (page - 1) + "&number=25") : (search ? CommonPar.libAddr.targets + "/vipbase/search/imgclique/condition?page=" + (page - 1) + "&number=25" : CommonPar.libAddr.targets + "/vipbase/search/imgclique/page?page=" + (page - 1) + "&number=25");

			//list模块中显示列表，关闭文件夹
			_options.$targets_lib_list.show();
			_options.$targets_lib_file.hide();
			_options.targets_lib_style = "list";

			//获取页面信息
			$.ajax({
				type: "get",
				url: url,
				data: {
					page: page - 1,
					number: 100,
					condition: search,
				},
				dataType: "json",
				success: function(data) {
					if (data.result == "success") {
						var _data = data.data,
							$targets_list = "";
						for (i in _data.data) {

							$targets_list += '<div data-id="' + _data.data[i].id + '">' +
								'<p>' + _data.data[i].id + '</p>' +
								'<p class="targets-lib-name" title="' + _data.data[i].name + '">' + CommonFun.stringCut(_data.data[i].name, 12) + '</p>' +
								'<p>' + _data.data[i].number + '</p>' +
								'<p>' + _data.data[i].createtime + '</p>' +
								'<p>' +
								'<span class="targets-lib-edit edit-icon" title="编辑"></span>' +
								'<span class="targets-lib-delete delete-icon" title="删除"></span>' +
								'</p>' +
								'</div>';
						}
						_options.$targets_lib.children("nav").children("p").text("共" + _data.total + "个库");
						_options.$targets_lib_list.children("section").html($targets_list);
						CommonFun.pagination(_options.$targets_lib_list_pagination, that.targetsListRender, _data.total, that, option);
						//页面按钮渲染
						that.targetsListBtnRender(page, option);
					} else if (data.result == "error") {
						CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
					}
				},
				error: function() {
					CommonFun.bubbleMsg("获取目标库列表失败");
				}
			});

			//权限管理调用
			CommonFun.privilegeManage();

			return this;
		},



		//targetsList按钮渲染
		targetsListBtnRender: function(page, option) {
			var that = this,
				_options = that.options,
				$targets_lib = _options.$targets_lib,
				type = _options.targets_lib_style;
			//编辑按钮
			$targets_lib.find(".targets-lib-edit").off("click").on("click", function() {
				event.stopPropagation();
				var _id = type == "file" ? $(this).parent("aside").parent("div").attr("data-id") : $(this).parent("p").parent("div").attr("data-id");
				//弹出Edit对话框
				that.targetsLibEdit("edit", _id);
			});

			//点击删除按钮
			$targets_lib.find(".targets-lib-delete").off("click").on("click", function() {
				event.stopPropagation();
				var _id = type == "file" ? $(this).parent("aside").parent("div").attr("data-id") : $(this).parent("p").parent("div").attr("data-id");
				CommonFun.confirmPassword("确认删除该目标库？", function() {
					CommonFun.bubbleLoading.setMsg("删除中");
					$.ajax({
						type: "post",
						url: CommonPar.libAddr.targets + "/vipbase/delete/imgclique",
						data: {
							id: _id
						},
						dataType: "json",
						success: function(data) {
							CommonFun.bubbleLoading.removeMsg();
							var _data = data;
							if (_data.result == "success") {
								CommonFun.bubbleMsg("删除成功！");
								_options.$targets_lib_list_pagination.removeAttr("data-page");
								that.targetsListRender();
							} else if (_data.result == "error") {
								CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
							}
						},
						error: function() {
							CommonFun.bubbleLoading.removeMsg();
							CommonFun.bubbleMsg("连接服务失败");
						}
					});
				});
			});

			//点击切换查看方式按钮
			if (type == "list") {
				_options.$targets_lib_detail_style.off("click");
				_options.$targets_lib_brief_style.off("click").on("click", function() {
					that.targetsFileRender(page, that, option);
					$(this).addClass("highlight");
					_options.$targets_lib_detail_style.removeClass("highlight");
				});
			} else if (type == "file") {
				_options.$targets_lib_brief_style.off("click");
				_options.$targets_lib_detail_style.off("click").on("click", function() {
					that.targetsListRender(page, that, option);
					$(this).addClass("highlight");
					_options.$targets_lib_brief_style.removeClass("highlight");
				});
			}

			//目标库点击
			$targets_lib.find(".targets-lib-name").off("click").on("click", function() {
				var _id = type == "file" ? $(this).attr("data-id") : $(this).parent("div").attr("data-id");
				that.targetsPersonInit(_id);
			});

			return this;
		},



		//targetsFile渲染
		targetsFileRender: function(page, that, option) {
			var that = that || this,
				_options = that.options,
				page = page || 1,
				search = (option && option.search) ? option.search : "",
				url = (option && option.url) ? (option.url + "&page=" + (page - 1) + "&number=25") : (search ? CommonPar.libAddr.targets + "/vipbase/search/imgclique/condition?page=" + (page - 1) + "&number=25" : CommonPar.libAddr.targets + "/vipbase/search/imgclique/page?page=" + (page - 1) + "&number=25");

			//list模块中显示列表，关闭文件夹
			_options.$targets_lib_list.hide();
			_options.$targets_lib_file.show();
			_options.targets_lib_style = "file";

			//获取页面信息
			$.ajax({
				type: "get",
				url: url,
				data: {
					page: page - 1,
					number: 100,
					condition: search,
				},
				dataType: "json",
				success: function(data) {
					if (data.result == "success") {
						var _data = data.data,
							$targets_list = "";
						for (i in _data.data) {

							$targets_list += '<div class="targets-lib-name" data-id="' + _data.data[i].id + '">' +
								'<span class="file-large-icon"></span>' +
								'<p title="' + _data.data[i].name + '">' + CommonFun.stringCut(_data.data[i].name, 6) + '</p>' +
								'<aside>' +
								'<span class="pulldown-icon"></span>' +
								'<a class="targets-lib-edit"><span class="edit-icon"></span>编辑</a>' +
								'<a class="targets-lib-delete"><span class="delete-icon"></span>删除</a>' +
								'</aside>' +
								'</div>';
						}
						_options.$targets_lib.children("nav").children("p").text("共" + _data.total + "个库");
						_options.$targets_lib_file.html($targets_list);
						CommonFun.pagination(_options.$targets_lib_list_pagination, that.targetsFileRender, _data.total, that, option);
						//页面按钮渲染
						that.targetsListBtnRender(page, option);
					} else if (data.result == "error") {
						CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
					}
				},
				error: function() {
					CommonFun.bubbleMsg("获取目标库列表失败");
				}
			});

			//权限管理调用
			CommonFun.privilegeManage();

			return this;
		},



		//targetsLoad加载单个数据
		targetLoad: function(lib_id) {
			var that = this,
				_options = that.options;
			$.ajax({
				type: "get",
				url: CommonPar.libAddr.targets + "/vipbase/search/imgclique/id?id=" + lib_id,
				async: false,
				dataType: "json",
				success: function(data) {
					if (data.result == "success") {
						_options.lib_info = data.data;
					} else if (data.result == "error") {
						CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
					}
				}
			});

			return this;
		},



		//targetsList弹出Edit对话框
		targetsLibEdit: function(mode, lib_id) {
			var that = this,
				_options = that.options,
				$targets_lib_edit_con = _options.$targets_lib_edit_con,
				_msg = (mode == "edit") ? "修改" : "新建",
				_url = (mode == "edit") ? (CommonPar.libAddr.targets + "/vipbase/modify/imgclique") : (CommonPar.libAddr.targets + "/vipbase/add/imgclique");

			$targets_lib_edit_con.show();
			$targets_lib_edit_con.find("span.currect, span.wrong").remove();

			//编辑或是创建
			if (mode == "edit") {
				//编辑
				that.targetLoad(lib_id);
				$targets_lib_edit_con.find("input").val(_options.lib_info.name);
				$targets_lib_edit_con.find("textarea").val(_options.lib_info.remark);
			} else {
				//新建
				$targets_lib_edit_con.find("input").val("");
				$targets_lib_edit_con.find("textarea").val("");
			}

			//取消按钮
			_options.$targets_person_edit_con_cancel.off("click").on("click", function() {
				$targets_lib_edit_con.hide();
			});

			$targets_lib_edit_con.find("input").off("keyup").on("keyup", function() {
				var $this = $(this);
				if (!$this.val()) {
					$targets_lib_edit_con.find("span.currect").remove();
					$targets_lib_edit_con.find("span.wrong").remove();
					return;
				}
				//输入用户名验证：不重名
				$.ajax({
					type: "post",
					url: CommonPar.libAddr.targets + "/vipbase/search/imgclique/check?",
					data: {
						cliquename: $this.val()
					},
					dataType: "json",
					success: function(data) {
						if (data.result == "success") {
							if (!$this.siblings("span").length) $this.after("<span class='currect'></span>");
							else $this.siblings("span").attr("class", "currect");
						} else {
							if (!$this.siblings("span").length) $this.after("<span class='wrong'></span>");
							else $this.siblings("span").attr("class", "wrong");
						}
					},
					error: function() {
						CommonFun.bubbleMsg("密码验证失败：连接失败");
					}
				});

			});

			//关闭按钮
			_options.$targets_person_edit_con_close.off("click").on("click", function() {
				$targets_lib_edit_con.hide();
			});

			//确认按钮
			_options.$targets_person_edit_con_submit.off("click").on("click", function() {
				var _name = $targets_lib_edit_con.find("input").val(),
					_remark = $targets_lib_edit_con.find("textarea").val();
				if(_name.length > 50){
					CommonFun.bubbleMsg("目标库名字需在50字以内");
					return;
				}
				if(_remark.length > 255){
					CommonFun.bubbleMsg("目标库备注需在255字以内");
					return;
	 			}
				if (mode == "edit") {
					if (!$targets_lib_edit_con.find("span.currect").length) {
						if ((_name == _options.lib_info.name) && (_remark == _options.lib_info.remark)) {
							$targets_lib_edit_con.hide();
							return;
						}else if(_name == _options.lib_info.name){

						}else {
							if (!$targets_lib_edit_con.find("span.wrong").length) {
								CommonFun.bubbleMsg("目标库名字重复");
								return;
							} else {
								CommonFun.bubbleMsg("目标库名字不能为空");
								return;
							}
						}
					}
				} else {
					if (!$targets_lib_edit_con.find("span.currect").length) {
						if (!$targets_lib_edit_con.find("span.wrong").length) {
							CommonFun.bubbleMsg("目标库名字重复");
							return;
						} else {
							CommonFun.bubbleMsg("目标库名字不能为空");
							return;
						}
					}
				}

				CommonFun.bubbleLoading.setMsg(_msg + "中");
				$.ajax({
					type: "post",
					url: _url,
					data: {
						id: lib_id,
						cliquename: $targets_lib_edit_con.find("input").val(),
						remark: $targets_lib_edit_con.find("textarea").val(),
						username: UserInfo.username,
					},
					dataType: "json",
					success: function(data) {
						CommonFun.bubbleLoading.removeMsg();
						var _data = data;
						if (_data.result == "success") {
							CommonFun.bubbleMsg(_msg + "成功！");
							$targets_lib_edit_con.hide();
							if (_options.targets_lib_style == "list") {
								_options.$targets_lib_list_pagination.removeAttr("data-page");
								that.targetsListRender();
							} else if (type == "file") {
								_options.$targets_lib_list_pagination.removeAttr("data-page");
								that.targetsFileRender();
							}
						} else if (data.result == "error") {
							CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
						}
					},
					error: function() {
						CommonFun.bubbleLoading.removeMsg();
						CommonFun.bubbleMsg("连接服务失败");
					}
				});
			});

			return this;
		},



		//搜索目标库列表初始化
		searchLibInit: function() {
			var that = this,
				_options = that.options;
			_options.$targets_lib_search_input.focus(function() {
				var $this = $(this);
				$this.parent("aside").addClass("focus");
				if ($this.val() == "搜索目标库") $this.val("");
			}).blur(function() {
				var $this = $(this);
				$this.parent("aside").removeClass("focus");
				if ($this.val() === "") $this.val("搜索目标库");
			});
			//点击搜索时触发事件
			_options.$targets_lib_search_enter.off("click").on("click", function() {
				var $this = $(this),
					type = _options.targets_lib_style,
					_val = $(this).siblings("#targets-lib-search-input").val();
				$this.parent("aside").removeClass("focus");
				//判断展示形式，并渲染列表
				if (type == "list") {
					_options.$targets_lib_list_pagination.removeAttr("data-page");
					if (_val == "搜索目标库") that.targetsListRender();
					else that.targetsListRender(1, that, {
						search: _val
					});
				} else if (type == "file") {
					_options.$targets_lib_list_pagination.removeAttr("data-page");
					if (_val == "搜索目标库") that.targetsFileRender();
					else that.targetsFileRender(1, that, {
						search: _val
					});
				}
			});

			return this;
		},



		//targetsPerson初始化
		targetsPersonInit: function(lib_id) {
			var that = this,
				_options = that.options,
				$targets_person_multiimport_con = _options.$targets_person_multiimport_con,
				lib_info = {},
				_log = '<p>暂无相关信息</p>';
			//显示Person模块，关闭其他模块
			_options.$targets_person_con.show();
			_options.$targets_lib_con.hide();
			_options.$targets_lib_edit_con.hide();
			_options.$targets_person_multiimport_con.hide();
			_options.$targets_person_detail_con.hide();
			_options.$targets_person_edit_con.hide();
			_options.$targets_person_delete_info.hide();
			_options.$targets_person_delete_tocheck.show();

			that.targetLoad(lib_id);
			lib_info = _options.lib_info;
			if (lib_info.imgBaseLog.length) {
				_log = '';
				for (i in lib_info.imgBaseLog) {
					_log += "<p>" + lib_info.imgBaseLog[i] + "</p>";
				}
			}
			$lib = '<p title="' + lib_info.name + '">名称：' + CommonFun.stringCut(lib_info.name, 10) + '</p>' +
				'<p title="' + lib_info.remark + '">描述：' + CommonFun.stringCut(lib_info.remark, 10) + '</p>' +
				'<p>创建人：' + lib_info.managername + '</p>' +
				'<p>创建时间：' + lib_info.createtime + '</p>' +
				'<aside id="targets-person-lib-log-con">' +
				'<p>操作日志</p>	' +
				'<article>' +
				'<section scroll="scroll">' +
				_log +
				'</section>' +
				'<footer><a class="close">关闭</a></footer>' +
				'</article>' +
				'</aside>' +
				'<a class="targets-person-lib-edit"><span class="edit-icon"></span>编辑</a>' +
				'<a class="targets-person-lib-unpass">查看审核不通过</a>' +
				'<a class="targets-person-lib-pass">查看审核通过</a>';

			//nav设置
			_options.loading_lib_id = lib_id;
			_options.loading_lib_name = lib_info.name;
			//nav渲染
			that.targetsNavRender(_options.$targets_person_con.find("nav.breadcrumb"));

			_options.$targets_lib_info.html($lib);
			that.targetsPersonBtnInit(lib_id);
			_options.$targets_person_list_pagination.attr("data-page", "1");
			_options.$targets_person_con.find("a.targets-person-lib-pass").hide();
			_options.$targets_person_con.find("a.targets-person-lib-unpass").show();

			//渲染页面
			that.targetsPersonRender(1, that, {
				lib_id: lib_id
			});

			//权限管理调用
			CommonFun.privilegeManage();

			return this;
		},



		//targetsPerson按钮渲染
		targetsPersonBtnInit: function(lib_id) {
			var that = this,
				_options = that.options;

			//页面搜索渲染
			that.searchPersonInit(lib_id);

			//审核通过按钮
			_options.$targets_person_con.find("a.targets-person-lib-unpass").off("click").on("click", function() {
				_options.$targets_person_list_pagination.attr("data-page", "1");
				_options.$targets_person_con.find("a.targets-person-lib-pass").show();
				_options.$targets_person_con.find("a.targets-person-lib-unpass").hide();

				//渲染页面
				that.targetsPersonRender(1, that, {
					lib_id: lib_id,
					unpass: 2,
				});
			});
			//审核不通过按钮
			_options.$targets_person_con.find("a.targets-person-lib-pass").off("click").on("click", function() {
				_options.$targets_person_list_pagination.attr("data-page", "1");
				_options.$targets_person_con.find("a.targets-person-lib-pass").hide();
				_options.$targets_person_con.find("a.targets-person-lib-unpass").show();

				//渲染页面
				that.targetsPersonRender(1, that, {
					lib_id: lib_id
				});
			});

			//操作日记
			_options.$targets_person_con.find("#targets-person-lib-log-con").children("p").off("click").on("click", function() {
				var $this = $(this),
					$log = $this.siblings("article");
				if ($this.attr("class") == "active") {
					$this.removeAttr("class");
					$log.hide();
				} else {
					$this.attr("class", "active");
					$log.show();
				}
				//取消
				$log.find(".close").off("click").on("click", function() {
					$log.hide();
					$this.removeAttr("class");
				});
				CommonFun.clickOutside("targets-person-lib-log-con", function() {
					$log.hide();
					$this.removeAttr("class");
				});
			});
			//编辑目标库
			_options.$targets_person_con.find("a.targets-person-lib-edit").off("click").on("click", function() {
				that.targetsLibEdit("edit", lib_id);
			});
			//新建目标
			_options.$targets_person_con.find("a.targets-person-new").off("click").on("click", function() {
				that.targetsPersonEditInit("new");
			});
			//批量导入目标
			that.targetsMultiUpload(lib_id);

			return this;
		},



		//批量导入目标
		targetsMultiUpload: function(lib_id) {
			var that = this,
				_options = that.options;
			//批量导入目标
			_options.$targets_person_con.find("a.targets-person-multinew").off("click").on("click", function() {
				if ($("#targets-person-multiimport").length) {
					CommonFun.bubbleMsg("请等待当前任务完毕后再进行导入");
					return;
				}
				var $targets_person_multiimport_con = $('<aside id="targets-person-multiimport-con"></aside>'),
					_targets_person_multiimport_con = '<div></div>' +
					'<section id="targets-person-multiimport">' +
					'<header>批量导入目标<span class="close-icon targets-person-multinew-close" id="targets-person-multiimport-con-close"></span></header>' +
					'<article>' +
					'<aside>' +
					'<span class="close-icon targets-person-multinew-close" id="targets-person-multiimport-con-close"></span>' +
					'<span class="detail-style-icon targets-person-multinew-enlarge"></span>' +
					'</aside>' +
					'<section>' +
					'<!--<p>请填写文件的地址</p>-->' +
					/*'<a><span style="width:50%;"></span></a>'*/
					'<input type="text" placeholder="请填写文件的地址,例：/home/vip/image/" />' +
					'</section>' +
					'</article>' +
					'<footer><a id="targets-person-multiimport-con-cancel" class="targets-person-multinew-close">取消</a>' +
					'<a id="targets-person-multiimport-con-submit" class="targets-person-multinew-submit">确定</a></footer>' +
					'</section>';
				$targets_person_multiimport_con.html(_targets_person_multiimport_con);
				$("body").append($targets_person_multiimport_con);
				$targets_person_multiimport_con.find(".targets-person-multinew-close").off("click").on("click", function() {
					$targets_person_multiimport_con.remove();
				});
				$targets_person_multiimport_con.find(".targets-person-multinew-submit").off("click").on("click", function() {
					var _file = $targets_person_multiimport_con.find("input").val(),
						_first_load = true;
					if (_file) {
						if ('WebSocket' in window) {
							websocket = new WebSocket("ws:" + window.location.host + "/websocket");
						} else if ('MozWebSocket' in window) {
							websocket = new MozWebSocket("ws:" + window.location.host + "/websocket");
						} else {
							alert("您的浏览器不支持websocket协议");
								// websocket = new SockJS("http://localhost:8080/websocket");
						}
						websocket.onopen = function(evnt) {
							//订阅消息事件
							var subscribeMsg = '{"type":"subscribe","data":""}';
							websocket.send(subscribeMsg.toString());
						};
						websocket.onmessage = function(evt) {
							var response = JSON.parse(evt.data),
								$targets_person_multiimport = $("#targets-person-multiimport");
							if (response.websocketid) {
								CommonFun.bubbleLoading.setMsg("提交中");
								$.ajax({
									type: "post",
									url: CommonPar.libAddr.targets + "/vipbase/add/vip/batch",
									data: {
										cliqueid: lib_id,
										dirname: _file,
										websocketid: response.websocketid
									},
									dataType: "json",
									success: function(data) {
										CommonFun.bubbleLoading.removeMsg();
									},
									error: function() {
										CommonFun.bubbleLoading.removeMsg();
										CommonFun.bubbleMsg("连接服务失败");
									}
								});
								$targets_person_multiimport.attr("data-cliqueid", lib_id).attr("data-socketid", response.websocketid);
							}
							if (response.type == "import") {
								var _article = '<p>已导入照片<span class="stress-text">' + response.curnum +
									'</span>张，共<span class="stress-text">' + response.totalnum + '</span>张</p>' +
									'<a><span style="width:' + (response.curnum / response.totalnum * 100) + '%;"></span></a>';
								$targets_person_multiimport.children("article").children("section").html(_article);
								if (_first_load) {
									_first_load = false;
									var _footer = '<a id="targets-person-multiimport-con-minimize">最小化</a>';
									$targets_person_multiimport.children("footer").html(_footer);
									$targets_person_multiimport.find(".targets-person-multinew-close").off("click").on("click", function() {
										CommonFun.confirmMsg("您确定要终止该次导入？", function() {
											$.ajax({
												type: "post",
												url: CommonPar.libAddr.targets + "/vipbase/cancel/vip/batch",
												data: {
													clique: $targets_person_multiimport.attr("data-cliqueid"),
													websocketid: $targets_person_multiimport.attr("data-socketid")
												},
												dataType: "json",
												success: function(data) {
													if (data.result == "success") {
														if ($("#targets-person-multiimport-con").length) $("#targets-person-multiimport-con").remove();
														$targets_person_multiimport.remove();
														websocket.close();
													} else if (data.result == "error") {
														CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
													}
												},
												error: function() {
													CommonFun.bubbleMsg("连接服务失败");
												}
											});
										});
									});
									$targets_person_multiimport.find(".targets-person-multinew-enlarge").off("click").on("click", function() {
										var $section = $('<aside id="targets-person-multiimport-con"></aside>'),
											_div = '<div></div>';
										$section.append(_div, $targets_person_multiimport);
										$("body").append($section);
									});
									$targets_person_multiimport.find("#targets-person-multiimport-con-minimize").click(function() {
										var $targets_person_multiimport = $("#targets-person-multiimport");
										$("body").append($targets_person_multiimport);
										$("#targets-person-multiimport-con").remove();
									});
								}
							} else if (response.type == "verify") {
								var _article = '<p>导入完成，正在审核中：已完成<span class="stress-text">' + response.curnum +
									'</span>张，共<span class="stress-text">' + response.totalnum + '</span>张</p>' +
									'<a><span style="width:' + (response.curnum / response.totalnum * 100) + '%;"></span></a>';
								$targets_person_multiimport.children("article").children("section").html(_article);
							} else if (response.type == "complete") {
								var _footer = '<a id="targets-person-multiimport-con-done" class="targets-person-multinew-close">关闭</a>',
									_article = '<p>审核完成，审核通过<span class="stress-text">' + response.curnum +
									'</span>张，失败<span class="stress-text">' + response.errornum + '</span>张</p>' +
									'<a><span style="width:100%;"></span></a>';
								$targets_person_multiimport.children("article").children("section").html(_article);
								$targets_person_multiimport.children("footer").html(_footer);
								$targets_person_multiimport.find(".targets-person-multinew-close").off("click").on("click", function() {
									if ($("#targets-person-multiimport-con").length) $("#targets-person-multiimport-con").remove();
									else $targets_person_multiimport.remove();
								});
								that.targetsPersonRender(1, that, {
									lib_id: lib_id
								});
								websocket.close();
							} else if (response.type == "error") {
								if (response.errorMessage == "folder_error") CommonFun.bubbleMsg("获取文件失败：路径错误");
								websocket.close();
							} else {
								console.log("导入中，请稍后");
							}
						}
					} else {
						CommonFun.bubbleMsg("请填写文件地址");
					}

				});
			});
		},



		//targetsPerson渲染
		targetsPersonRender: function(page, that, option) {
			var that = that || this,
				_options = that.options,
				lib_id = option.lib_id,
				page = page || 1,
				search = (option && option.search) ? option.search : "",
				unpass = (option && option.unpass) ? option.unpass : "",
				url = search ? CommonPar.libAddr.targets + "/vipbase/search/vip/condition?imgcliqueid=" + lib_id + "&page=" + (page - 1) + "&number=30&condition=" + search : (unpass ? CommonPar.libAddr.targets + "/vipbase/search/vip?imgcliqueid=" + lib_id + "&page=" + (page - 1) + "&number=30&checkstatus=" + unpass : CommonPar.libAddr.targets + "/vipbase/search/vip?imgcliqueid=" + lib_id + "&page=" + (page - 1) + "&number=30");

			option.onepagenum = 30;
			_options.$targets_person_delete_tocheck.show();
			_options.$targets_person_delete_info.hide();
			//获取页面信息
			$.ajax({
				type: "get",
				url: url,
				dataType: "json",
				success: function(data) {
					var _data = data,
						$targets = "";
					if (data.result == "error") {
						CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
						return;
					}
					for (i in _data.data) {
						$targets += '<div data-id="' + _data.data[i].vipid + '">' +
							'<span class="state"></span>' +
							'<div>' +
							'<img src="' + _data.data[i].url + '" />' +
							'</div>' +
							'<p title="' + _data.data[i].name + '">' + CommonFun.stringCut(_data.data[i].name, 6) + '</p>' +
							'</div>';
					}
					_options.$targets_person_file.html($targets);
					_options.$targets_person.children("nav").children("p").first().text("共" + _data.total + "人");
					CommonFun.pagination(_options.$targets_person_list_pagination, that.targetsPersonRender, _data.total, that, option);

					//检测是否有目标
					if (!_data.total) {
						if (search) {
							_options.$targets_no_person.find("p[data-text='text']").text('抱歉，没有找到与“' + search + '”相关的任务');
							_options.$targets_no_person.find("[data-show='add']").hide();
						} else if (unpass) {
							_options.$targets_no_person.find("p[data-text='text']").text('暂无审核未通过目标');
							_options.$targets_no_person.find("[data-show='add']").hide();
						} else {
							_options.$targets_no_person.find("p[data-text='text']").text('暂无目标人员');
							_options.$targets_no_person.find("[data-show='add']").show();
						}
						_options.$targets_no_person.show();
						_options.$targets_person.hide();
						return;
					}
					_options.$targets_person.show();
					_options.$targets_no_person.hide();
					_options.$targets_person_file.children("div").off("click");

					//批量删除触发事件
					that.deletePersonCheck(page, that, lib_id, unpass);

					//对图片进行居中处理
					_options.$targets_person_file.children("div").children("div").bsPictureAlign({
						"img_dom": 0, //img的class，为0则选中该容器内所有img图片
						"style": "fill", //两种style：full为最短边对齐，过长剪裁；fill为最长边对齐，填充背景
						"width": "100px", //容器宽度，默认为100%
						"height": "122px", //容器高度，默认为300px
						"background": "#000" //背景填充颜色，默认为#000黑色
					});

					//选择目标进行跳转
					that.clickPersonTrack();
				},
				error: function() {
					CommonFun.bubbleMsg("获取目标库信息失败");
				}
			});

			//权限管理调用
			CommonFun.privilegeManage();


			return this;
		},



		//选择目标进行跳转
		clickPersonTrack: function() {
			var that = this,
				_options = that.options;
			_options.$targets_person_file.children("div").off("click").on("click", function() {
				var _id = $(this).attr("data-id");
				that.targetsPersonDetailInit(_id);
			});
		},



		//批量删除触发事件
		deletePersonCheck: function(page, that, lib_id, unpass) {
			var that = this,
				_options = that.options,
				$targets_person_delete_info = _options.$targets_person_delete_info,
				$targets_person_file = _options.$targets_person_file,
				$targets_person_delete_tocheck = _options.$targets_person_delete_tocheck;
			$targets_person_delete_tocheck.off("click").on("click", function() {
				$(this).hide();
				$targets_person_delete_info.show();
				$targets_person_file.children("div").addClass("chose-multi-unchecked-div");
				$targets_person_delete_info.children("p").attr("class", "chose-multi-unchecked-div");
				$targets_person_delete_info.find("a.targets-person-delete-num").text("（已选中0张照片）");
				//多选逻辑
				$targets_person_file.find("div.chose-multi-unchecked-div").off("click").on("click", function() {
					var $this = $(this),
						_num = 0;
					//多选逻辑
					if ($this.attr("class") == "chose-multi-checked-div") {
						$this.attr("class", "chose-multi-unchecked-div");
						$targets_person_delete_info.find("p.chose-multi-checked-div").attr("class", "chose-multi-unchecked-div");
					} else {
						$this.attr("class", "chose-multi-checked-div");
					}
					_num = $targets_person_file.find("div.chose-multi-checked-div").length;
					$targets_person_delete_info.find("a.targets-person-delete-num").text("（已选中" + _num + "张照片）");
				});
				$targets_person_delete_info.find("span.state").off("click").on("click", function() {
					var $this = $(this),
						$p = $this.parents("p"),
						_num = 0;
					//多选逻辑
					if ($p.attr("class") == "chose-multi-checked-div") {
						$p.attr("class", "chose-multi-unchecked-div");
						$targets_person_file.find("div.chose-multi-checked-div").attr("class", "chose-multi-unchecked-div");
					} else {
						$p.attr("class", "chose-multi-checked-div");
						$targets_person_file.find("div.chose-multi-unchecked-div").attr("class", "chose-multi-checked-div");
					}
					_num = $targets_person_file.find("div.chose-multi-checked-div").length;
					$targets_person_delete_info.find("a.targets-person-delete-num").text("（已选中" + _num + "张照片）");
				});
				//取消按钮
				$targets_person_delete_info.find("a.targets-person-delete-cancel").off("click").on("click", function() {
					$targets_person_delete_tocheck.show();
					$targets_person_delete_info.hide();
					$targets_person_file.children("div").removeClass();
					$targets_person_file.children("div").off("click");
					that.targetsPersonRender(page, that, {
						lib_id: lib_id,
						unpass: unpass,
					});
					that.clickPersonTrack();
				});
				//删除按钮
				$targets_person_delete_info.find("a.targets-person-delete").off("click").on("click", function() {
					var $check = $targets_person_file.find("div.chose-multi-checked-div"),
						check_list = [];
					if (!$check.length) {
						CommonFun.bubbleMsg("请选择要删除的目标");
					} else {
						$check.each(function() {
							check_list.push($(this).attr("data-id"));
						});
						CommonFun.bubbleLoading.setMsg("删除中");
						$.ajax({
							type: "post",
							url: CommonPar.libAddr.targets + "/vipbase/delete/vip/batch",
							data: {
								imgcliqueid: lib_id,
								"id[]": check_list
							},
							dataType: "json",
							success: function(data) {
								CommonFun.bubbleLoading.removeMsg();
								if (data.result == "success") {
									CommonFun.bubbleMsg("删除成功！");
									that.targetsPersonInit(_options.loading_lib_id);
								} else if (data.result == "error") {
									CommonFun.bubbleMsg("删除失败：" + data.errorMessage);
									return;
								}
							},
							error: function() {
								CommonFun.bubbleLoading.removeMsg();
								CommonFun.bubbleMsg("连接服务失败");
							}
						});
						/*CommonFun.confirmPassword("确认删除选中目标？", function() {
							$.ajax({
								type: "post",
								url: CommonPar.libAddr.targets + "/vipbase/delete/vip/batch",
								data: {
									imgcliqueid: lib_id,
									"id[]": check_list
								},
								dataType: "json",
								success: function(data) {
									console.log(data);
									if (data.result == "success") {
										CommonFun.bubbleMsg("删除成功！");
										that.targetsPersonInit(_options.loading_lib_id);
									} else {
										CommonFun.bubbleMsg("删除失败！");
									}
								},
								error: function() {
									CommonFun.bubbleMsg("连接服务失败");
								}
							});
						});*/
					}
				});

			});

			return this;
		},



		//搜索目标人员列表初始化
		searchPersonInit: function(lib_id) {
			var that = this,
				_options = that.options;
			_options.$targets_person_search_input.focus(function() {
				var $this = $(this);
				$this.parent("aside").addClass("focus");
				if ($this.val() == "搜索目标人员") $this.val("");
			}).blur(function() {
				var $this = $(this);
				$this.parent("aside").removeClass("focus");
				if ($this.val() == "") $this.val("搜索目标人员");
			});
			//点击搜索时触发事件
			_options.$targets_person_search_enter.off("click").on("click", function() {
				var $this = $(this),
					_val = $(this).siblings("#targets-person-search-input").val();
				if (_val == "搜索目标人员" || !_val) {
					that.targetsPersonRender(1, that, {
						lib_id: lib_id
					});
					return;
				}
				$this.parent("aside").removeClass("focus");
				//
				that.targetsPersonRender(1, that, {
					search: _val,
					lib_id: lib_id
				});
			});

			return this;
		},



		//PersonLoad加载单个数据
		personLoad: function(p_id) {
			var that = this,
				_options = that.options;
			$.ajax({
				type: "get",
				url: CommonPar.libAddr.targets + "/vipbase/search/vip/detail?vipid=" + p_id,
				async: false,
				dataType: "json",
				success: function(data) {
					if (data.result == "error") {
						CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
						return;
					}
					_options.person_info = data.data;
				}
			});

			return this;
		},



		//targetsPersonDetail初始化
		targetsPersonDetailInit: function(p_id) {
			var that = this,
				_options = that.options,
				$targets_person_detail_con = _options.$targets_person_detail_con,
				$nav_con = $targets_person_detail_con.find("nav.breadcrumb");
			//显示Person模块，关闭其他模块
			$targets_person_detail_con.show();
			_options.$targets_person_con.hide();
			_options.$targets_lib_con.hide();
			_options.$targets_lib_edit_con.hide();
			_options.$targets_person_multiimport_con.hide();
			_options.$targets_person_edit_con.hide();

			//加载信息
			that.personLoad(p_id);

			//目标信息加载
			var _data = _options.person_info,
				_sex = (_data.vip.gender == "male") ? "男" : ((_data.vip.gender == "female") ? "女" : "未知"),
				_level = (_data.vip.wantedlevel == "A") ? "重点" : ((_data.vip.wantedlevel == "B") ? "一般" : "未知"),
				_p_detail = '<p>目标姓名：' + _data.vip.name + '</p>' +
				'<section id="targets-person-detail-photo">' +
				'<p>目标照片：</p>' +
				'<section class="targets-person-detail-photo">' +
				'<p>审核通过<span class="stress-text">' + _data.headlist.successlist.length + '</span>张</p>';
			for (i in _data.headlist.successlist) {
				_p_detail += '<div data-id="' + _data.headlist.successlist[i].photouuid + '">' +
					'<div>' +
					(_data.headlist.successlist[i].ishead ? ('<span class="photo-cover">封面</span>') : '') +
					'<img src="' + _data.headlist.successlist[i].url + '"></div>' +
					'<p title="' + _data.headlist.successlist[i].name + '">' + CommonFun.stringCut(_data.headlist.successlist[i].name, 6) + '</p>' +
					'</div>';
			}
			_p_detail += '</section>';
			if (_data.headlist.errorlist.length) {
				_p_detail += '<section class="targets-person-detail-photo">' + '<p>审核未通过<span class="stress-text">' + _data.headlist.errorlist.length + '</span>张</p>';
				for (i in _data.headlist.errorlist) {
					_p_detail += '<div data-id="' + _data.headlist.errorlist[i].photouuid + '">' + '<div>' +
						'<img src="' + _data.headlist.errorlist[i].url + '" />' +
						'</div>' +
						'<p title="' + _data.headlist.errorlist[i].name + '">' + CommonFun.stringCut(_data.headlist.errorlist[i].name, 9) + '</p>' +
						'<p title="' + _data.headlist.errorlist[i].errorMessage + '">' + CommonFun.stringCut(_data.headlist.errorlist[i].errorMessage, 9) + '</p>' +
						'</div>';
				}
				_p_detail += '</section>';
			}

			_p_detail += '</section>' + '<aside>' +
				'<section>' +
				'<p><span>性别：</span>' + _sex + '</p>' +
				'<p><span>年龄：</span>' + _data.vip.age + '</p>' +
				'<p><span>身份证：</span>' + _data.vip.identityid + '</p>' +
				'<p><span>目标级别：</span>' + _level + '</p>' +
				'</section>' +
				'<section>' +
				'<p><span>隶属区域：</span>' + _data.vip.area + '</p>' +
				'<p><span>籍贯：</span>' + _data.vip.recruit + '</p>' +
				'<p><span>民族：</span>' + _data.vip.nation + '</p>' +
				'<p><span>目标描述：</span>' + _data.vip.remark + '</p>' +
				'</section>' +
				'</aside>';

			_options.$targets_person_detail.children("article").html(_p_detail);
			//对图片进行居中处理
			_options.$targets_person_detail.find(".targets-person-detail-photo").children("div").children("div").bsPictureAlign({
				"img_dom": 0, //img的class，为0则选中该容器内所有img图片
				"style": "fill", //两种style：full为最短边对齐，过长剪裁；fill为最长边对齐，填充背景
				"width": "100px", //容器宽度，默认为100%
				"height": "122px", //容器高度，默认为300px
				"background": "#000" //背景填充颜色，默认为#000黑色
			});
			$targets_person_detail_con.attr("data-id", _data.vip.serial);

			//nav设置
			_options.loading_person_id = p_id;
			_options.loading_person_name = _data.vip.name;
			//nav渲染
			that.targetsNavRender($nav_con);

			//编辑目标
			$targets_person_detail_con.find("a.targets-person-detail-toedit").off("click").on("click", function() {
				//编辑页面
				that.targetsPersonEditInit("edit", p_id);
			});

			//删除目标
			$targets_person_detail_con.find("a.targets-person-detail-delete").off("click").on("click", function() {
				CommonFun.confirmMsg("您确定删除该目标？", function() {
					CommonFun.bubbleLoading.setMsg("删除中");
					$.ajax({
						type: "post",
						url: CommonPar.libAddr.targets + "/vipbase/delete/vip/batch",
						data: {
							imgcliqueid: _options.loading_lib_id,
							"id[]": p_id.split(",")
						},
						dataType: "json",
						success: function(data) {
							CommonFun.bubbleLoading.removeMsg();
							if (data.result == "success") {
								CommonFun.bubbleMsg("删除成功！");
								that.targetsPersonInit(_options.loading_lib_id);
							} else if (data.result == "error") {
								CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
								return;
							}
						},
						error: function() {
							CommonFun.bubbleLoading.removeMsg();
							CommonFun.bubbleMsg("连接服务失败");
						}
					});
				});
			});

			//权限管理调用
			CommonFun.privilegeManage();

			return this;
		},



		//targetsPersonEdit初始化
		targetsPersonEditInit: function(mode, p_id) {
			var that = this,
				_options = that.options,
				$targets_person_multiimport_con = _options.$targets_person_multiimport_con;
			//显示Person模块，关闭其他模块
			_options.$targets_person_edit_con.show();
			_options.$targets_lib_con.hide();
			_options.$targets_lib_edit_con.hide();
			_options.$targets_person_multiimport_con.hide();
			_options.$targets_person_detail_con.hide();
			_options.$targets_person_con.hide();

			//删除数组置空
			_options.edit_delete_list = [];
			_options.edit_add_list = [];

			//渲染页面
			that.targetsPersonEditRender(mode, p_id);

			return this;
		},



		//targetsPerson渲染
		targetsPersonEditRender: function(mode, p_id) {
			var that = this,
				_options = that.options,
				$nav_con = _options.$targets_person_edit_con.find("nav.breadcrumb"),
				_article = '',
				_nav_con = '<a>首页</a><span class="breadcrumb-next"></span>' +
				'<a>目标库列表</a><span class="breadcrumb-next"></span>' +
				'<a data-nav="lib"></a><span class="breadcrumb-next"></span>' +
				((mode == "edit") ? ('<a data-nav="person"></a><span class="breadcrumb-next"></span>' +
					'<a data-nav="person-edit">编辑</a>') : '<a data-nav="person-new">新建</a>'),
				_name = '',
				_photo = '',
				_sex = '<a data-sex="male" class="chose-single"></a>男' +
				'<a data-sex="female" class="chose-single"></a>女',
				_level = '<a data-level="B" class="chose-single"></a>一般' +
				'<a data-level="A" class="chose-single"></a>重点',
				_age = '',
				_identity = '',
				_area = '',
				_recurit = '',
				_nation = '',
				_remark = '';

			//nav渲染
			$nav_con.html(_nav_con);
			that.targetsNavRender($nav_con);


			//检测是否编辑
			if (mode == "edit") {
				//加载信息
				that.personLoad(p_id);

				//目标信息加载
				var _data = _options.person_info;
				_name = _data.vip.name;
				_photo = '<p class="chose-multi-unchecked-div" id="targets-person-edit-photo-info">' +
					'<span class="state"></span>本页全选' +
					'<a class="targets-person-delete-num">（已选中0张照片）</a></p>' +
					'<section class="targets-person-edit-photo-pass">' +
					'<p>审核通过<span class="stress-text pass-num">' + _data.headlist.successlist.length + '</span>张</p>';
				for (i in _data.headlist.successlist) {
					_photo += '<div class="chose-multi-unchecked-div" data-uuid="' + _data.headlist.successlist[i].photouuid + '">' +
						'<span class="state"></span>' +
						'<div>' +
						(_data.headlist.successlist[i].ishead ? ('<span class="photo-cover">封面</span>') : '') +
						'<img src="' + _data.headlist.successlist[i].url + '" />' +
						'</div>' +
						'<p title="' + _data.headlist.successlist[i].name + '">' + CommonFun.stringCut(_data.headlist.successlist[i].name, 9) + '</p>' +
						'</div>';
				}
				_photo += '</section>';
				if (_data.headlist.errorlist.length) {
					_photo += '<section class="targets-person-edit-photo-unpass">' + '<p>审核未通过<span class="stress-text unpass-num">' + _data.headlist.errorlist.length + '</span>张</p>';
					for (i in _data.headlist.errorlist) {
						_photo += '<div class="chose-multi-unchecked-div" data-uuid="' + _data.headlist.errorlist[i].photouuid + '">' +
							'<span class="state"></span>' +
							'<div>' +
							'<img src="' + _data.headlist.errorlist[i].url + '" />' +
							'</div>' +
							'<p title="' + _data.headlist.errorlist[i].name + '">' + CommonFun.stringCut(_data.headlist.errorlist[i].name, 6) + '</p>' +
							'<p>' + _data.headlist.errorlist[i].errorMessage + '</p>' +
							'</div>';
					}
					_photo += '</section>';
				}
				_sex = '<a data-sex="male" class="' + (_data.vip.gender == "male" ? 'chose-single-active' : 'chose-single') + '"></a>男' +
					'<a data-sex="female" class="' + (_data.vip.gender == "female" ? 'chose-single-active' : 'chose-single') + '"></a>女';
				_level = '<a data-level="B" class="' + (_data.vip.wantedlevel == "B" ? 'chose-single-active' : 'chose-single') + '"></a>一般' +
					'<a data-level="A" class="' + (_data.vip.wantedlevel == "A" ? 'chose-single-active' : 'chose-single') + '"></a>重点';
				_age = _data.vip.age;
				_identity = _data.vip.identityid;
				_area = _data.vip.area;
				_recurit = _data.vip.recruit;
				_nation = _data.vip.nation;
				_remark = _data.vip.remark;
			}
			//加载信息页面
			_article += '<p>目标姓名：<input name="name" value="' + _name + '" type="text" /></p>' +
				'<section id="targets-person-edit-photo-con">' +
				'<p>目标照片：' +
				'<a class="targets-person-edit-photo-upload">上传</a>' +
				'<a class="targets-person-edit-photo-delete">删除</a>' +
				'<a class="targets-person-edit-photo-cover">设为封面</a>' +
				'</p>' +
				_photo +
				'</section>' +
				'<aside>' +
				'<section>' +
				'<p><span>性别：</span>' +
				_sex +
				'</p>' +
				'<p><span>年龄：</span><input name="age" value="' + _age + '" type="number" /></p>' +
				'<p><span>身份证：</span><input name="identity" value="' + _identity + '" type="number" /></p>' +
				'<p><span>目标级别：</span>' +
				_level +
				'</p>' +
				'</section>' +
				'<section>' +
				'<p><span>隶属区域：</span>' +
				'<input name="area" value="' + _area + '" type="text" />' +
				'</p>' +
				'<p><span>籍贯：</span>' +
				'<input name="recurit" value="' + _recurit + '" type="text" />' +
				'</p>' +
				'<p><span>民族：</span>' +
				'<input name="nation" value="' + _nation + '" type="text" />' +
				'</p>' +
				'<p><span>目标描述：</span>' +
				'<textarea name="remark" placeholder=""  scroll="scroll">' + _remark + '</textarea>' +
				'</p>' +
				'</section>' +
				'</aside>' +
				'<p>' +
				'<a id="targets-person-edit-submit">保存</a>' +
				'<a id="targets-person-edit-cancel">取消</a>' +
				'</p>';
			_options.$targets_person_edit.children("article").html(_article);
			_options.$targets_person_edit_con.attr("data-type", "new");
			$targets_person_edit_photo_con = $("#targets-person-edit-photo-con");
			that.targetsPersonEditBtnRender(mode, p_id);
			if (mode == "edit") {
				//对图片进行居中处理
				_options.$targets_person_edit.find("section.targets-person-edit-photo-unpass,section.targets-person-edit-photo-pass").children("div").children("div").bsPictureAlign({
					"img_dom": 0, //img的class，为0则选中该容器内所有img图片
					"style": "fill", //两种style：full为最短边对齐，过长剪裁；fill为最长边对齐，填充背景
					"width": "100px", //容器宽度，默认为100%
					"height": "122px", //容器高度，默认为300px
					"background": "#000" //背景填充颜色，默认为#000黑色
				});
				_options.$targets_person_edit_con.attr("data-type", "edit").attr("data-id", _data.vip.serial);
				$targets_person_edit_photo_con.attr("data-vipuuid", _data.vip.serial);
			}

			//权限管理调用
			CommonFun.privilegeManage();

			return this;
		},



		//targetsPersonEdit初始化
		targetsPersonEditBtnRender: function(mode, p_id) {
			var that = this,
				_options = that.options;

			//多选事件
			that.chosePersonEditPhoto();

			//删除事件
			$targets_person_edit_photo_con.find("a.targets-person-edit-photo-delete").off("click").on("click", function() {
				var $check = $targets_person_edit_photo_con.find("div.chose-multi-checked-div"),
					$pass_num = $targets_person_edit_photo_con.find("span.pass-num"),
					$unpass_num = $targets_person_edit_photo_con.find("span.unpass-num");
				if (!$check.length) {
					CommonFun.bubbleMsg("请选择要删除的照片");
				} else {
					CommonFun.confirmMsg("您确定删除这些照片？", function() {
						$check.each(function() {
							var $this = $(this),
								_uuid = $this.attr("data-uuid"),
								_src = $this.children("div").children("img").attr("src");
							// if ($this.parents(".targets-person-edit-photo-unpass").length) _uuid = "";
							_options.edit_delete_list.push({
								uuid: _uuid,
								url: _src
							});

							$this.remove();
						});
						if (!$targets_person_edit_photo_con.find("div.chose-multi-unchecked-div").length) {
							$(".targets-person-edit-photo-new, #targets-person-edit-photo-info").remove();
						}
						CommonFun.bubbleMsg("删除成功");
						$pass_num.text($targets_person_edit_photo_con.find(".targets-person-edit-photo-pass").children("div").length);
						$unpass_num.text($targets_person_edit_photo_con.find(".targets-person-edit-photo-unpass").children("div").length);
					});
				}
			});

			//设为封面事件
			$targets_person_edit_photo_con.find("a.targets-person-edit-photo-cover").off("click").on("click", function() {
				var $check = $targets_person_edit_photo_con.find("section.targets-person-edit-photo-pass").find("div.chose-multi-checked-div");
				if ($check.length != 1) {
					CommonFun.bubbleMsg("请选择一张通过审核的照片设为封面");
				} else {
					$targets_person_edit_photo_con.find("span.photo-cover").remove();
					$check.children("div").append('<span class="photo-cover">封面</span>');
				}
			});

			//上传事件
			that.targetsPersonEditPhotoUpload();

			//单选事件
			_options.$targets_person_edit.find("a.chose-single,a.chose-single-active").off("click").on("click", function() {
				var $this = $(this);
				$this.attr("class", "chose-single-active");
				$this.siblings("a").attr("class", "chose-single");
			});

			//确认按钮
			$("#targets-person-edit-submit").off("click").on("click", function() {
				var $targets_person_edit = _options.$targets_person_edit,
					$sex = $targets_person_edit.find("a.chose-single-active[data-sex]"),
					$level = $targets_person_edit.find("a.chose-single-active[data-level]"),
					_ishead = $targets_person_edit_photo_con.find("span.photo-cover"),
					_gender = $sex.length ? $sex.attr("data-sex") : "unknown",
					_wantedlevel = $level.length ? $level.attr("data-level") : "unknown",
					_msg = mode == "edit" ? "修改成功" : "新建成功",
					_url = mode == "edit" ? (CommonPar.libAddr.targets + "/vipbase/modify/vip/detail") : (CommonPar.libAddr.targets + "/vipbase/add/vip");
				if (!$targets_person_edit.find("input[name='name']").val() || !$targets_person_edit.find(".chose-multi-unchecked-div,.chose-multi-checked-div").length) {
					CommonFun.bubbleMsg("请填写姓名，以及上传一张以上的照片");
					return;
				}
				console.log(_gender, _wantedlevel);
				CommonFun.bubbleLoading.setMsg("提交中");
				_options.$targets_person_edit_con.ajaxSubmit({
					type: 'post',
					url: _url,
					dataType: 'json',
					data: {
						vipuuid: $targets_person_edit_photo_con.attr("data-vipuuid"),
						clique: _options.loading_lib_id,
						adddata: JSON.stringify(_options.edit_add_list),
						deletedata: JSON.stringify(_options.edit_delete_list),
						ishead: _ishead.length ? _ishead.parent("div").parent("div").attr("data-uuid") : $targets_person_edit_photo_con.find(".targets-person-edit-photo-pass").children("div").first().attr("data-uuid"),
						gender: _gender,
						wantedlevel: _wantedlevel,
					},
					success: function(data) {
						CommonFun.bubbleLoading.removeMsg();
						var _data = data;
						if (_data.result == "success") {
							CommonFun.bubbleMsg(_msg);
							that.targetsPersonDetailInit(_data.vipid);
						} else if (data.result == "error") {
							CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
							return;
						}
					},
					error: function() {
						CommonFun.bubbleLoading.removeMsg();
						CommonFun.bubbleMsg("连接服务失败");
					},
				});
			});

			//取消按钮
			$("#targets-person-edit-cancel").off("click").on("click", function() {
				that.targetsPersonInit(_options.loading_lib_id);
			});

			return this;
		},



		//上传事件
		targetsPersonEditPhotoUpload: function() {
			var that = this,
				_options = that.options,
				$targets_person_edit_photo_con = $("#targets-person-edit-photo-con");
			$targets_person_edit_photo_con.find("a.targets-person-edit-photo-upload").off("click").on("click", function() {
				//var $input = $("<input type='file' name='file" + _options.file_id + "' multiple='multiple' accept='image/*' />");
				var $input = $("<input type='file' name='file' multiple='multiple' accept='image/*' />"),
					$article = $("<article></article>")
				$targets_person_edit_photo_con.append($input);
				console.log($input);
				$input.change(function(e) {
					var files = e.target.files,
						ireg = /image\/.*/i,
						wrong_file = [],
						_first_load = true;
					if (files.length && files.length <= 100) {
						if ('WebSocket' in window) {
							websocket = new WebSocket("ws:" + window.location.host + "/websocket");
						} else if ('MozWebSocket' in window) {
							websocket = new MozWebSocket("ws:" + window.location.host + "/websocket");
						} else {
							alert("您的浏览器不支持websocket协议")
								// websocket = new SockJS("http://localhost:8080/websocket");
						}
						websocket.onopen = function(evnt) {
							//订阅消息事件
							var subscribeMsg = '{"type":"subscribe","data":""}'
							websocket.send(subscribeMsg.toString());
						};
						websocket.onmessage = function(evt) {
							var response = JSON.parse(evt.data);
							if (response.websocketid) {
								_options.$targets_person_edit_con.ajaxSubmit({
									type: 'post',
									url: CommonPar.libAddr.targets + "/vipbase/add/vip/pic",
									dataType: 'json',
									data: {
										clique: _options.loading_lib_id,
										websocketid: response.websocketid,
										vipuuid: $targets_person_edit_photo_con.attr("data-vipuuid") || "",
									},
									success: function(data) {
										if (data.result == "error") {
											CommonFun.bubbleMsg("错误信息：" + data.errorMessage);
											websocket.close();
										} else {
											$targets_person_edit_photo_con.attr("data-vipuuid", data.vipuuid);
										}
									},
									error: function() {
										CommonFun.bubbleMsg("连接服务失败");
									}
								});
							}
							console.log(response);
							if (response.type == "import") {
								var $p = $targets_person_edit_photo_con.find("#targets-person-edit-photo-info"),
									_article = '<p>已导入照片<span class="stress-text">' + response.curnum +
									'</span>张，共<span class="stress-text">' + response.totalnum + '</span>张</p>' +
									'<a><span style="width:' + (response.curnum / response.totalnum * 100) + '%;"></span></a>';
								if (_first_load) {
									_first_load = false;
									$article.append(_article);
									if ($p.length) $p.after($article);
									else $targets_person_edit_photo_con.prepend($article);
								} else {
									$targets_person_edit_photo_con.children("article").html(_article);
								}
							} else if (response.type == "verify") {
								var _article = '<p>导入完成，正在审核中：已完成<span class="stress-text">' + response.curnum +
									'</span>张，共<span class="stress-text">' + response.totalnum + '</span>张</p>' +
									'<a><span style="width:' + (response.curnum / response.totalnum * 100) + '%;"></span></a>';
								$targets_person_edit_photo_con.children("article").html(_article);
							} else if (response.type == "complete") {
								if(response.errorMessage){
									CommonFun.bubbleMsg(response.errorMessage);
								}
								var _data = response.data,
									$p = $targets_person_edit_photo_con.find("#targets-person-edit-photo-info"),
									$article_pass = $targets_person_edit_photo_con.find(".targets-person-edit-photo-pass"),
									$pass_num = $targets_person_edit_photo_con.find("span.pass-num"),
									$unpass_num = $targets_person_edit_photo_con.find("span.unpass-num"),
									_art_pass = $pass_num.length ? '' : '<p>审核通过<span class="stress-text pass-num">' + (Number(_data.getfeaturesuccess) + Number($pass_num.text())) + '</span>张</p>',
									$art_pass = $article_pass.length ? $article_pass : $('<section class="targets-person-edit-photo-pass"></section>'),
									$article_unpass = $targets_person_edit_photo_con.find(".targets-person-edit-photo-unpass"),
									_art_unpass = $unpass_num.length ? '' : '<p>审核未通过<span class="stress-text unpass-num">' + (Number(_data.getfeaturefail) + Number($unpass_num.text())) + '</span>张</p>',
									$art_unpass = $article_unpass.length ? $article_unpass : $('<section class="targets-person-edit-photo-unpass"></section>');
								for (i in _data.data.successlist) {
									_art_pass += '<div class="chose-multi-unchecked-div" data-uuid="' + _data.data.successlist[i].photouuid + '">' +
										'<span class="state"></span>' +
										'<div>' +
										'<img src="' + _data.data.successlist[i].url + '" />' +
										'</div>' +
										'<p title="' + _data.data.successlist[i].name + '">' + CommonFun.stringCut(_data.data.successlist[i].name, 6) + '</p>' +
										'</div>';
									_options.edit_add_list.push(_data.data.successlist[i]);
								}
								$art_pass.append(_art_pass);
								if (!$article_pass.length) $targets_person_edit_photo_con.append($art_pass);
								else $pass_num.text(Number(_data.getfeaturesuccess) + Number($pass_num.text()));
								if (_data.getfeaturefail > 0) {
									for (i in _data.data.errorlist) {
										_art_unpass += '<div class="chose-multi-unchecked-div" data-uuid="' + _data.data.errorlist[i].photouuid + '">' +
											'<span class="state"></span>' +
											'<div>' +
											'<img src="' + _data.data.errorlist[i].url + '" />' +
											'</div>' +
											'<p title="' + _data.data.errorlist[i].name + '">' + CommonFun.stringCut(_data.data.errorlist[i].name, 6) + '</p>' +
											'<p>' + _data.data.errorlist[i].errorMessage + '</p>' +
											'</div>';
										_options.edit_add_list.push(_data.data.errorlist[i]);
									}
									$art_unpass.append(_art_unpass);
									if (!$article_unpass.length) $targets_person_edit_photo_con.append($art_unpass);
									else $unpass_num.text(Number(_data.getfeaturefail) + Number($unpass_num.text()));

								}

								$targets_person_edit_photo_con.append(_article);
								if (!$p.length) {
									$p = '<p class="chose-multi-unchecked-div" id="targets-person-edit-photo-info"><span class="state"></span>本页全选<a class="targets-person-delete-num">（已选中0张照片）</a></p>';
									$targets_person_edit_photo_con.children("p").first().after($p);
								}
								//对图片进行居中处理
								_options.$targets_person_edit.find("section.targets-person-edit-photo-unpass,section.targets-person-edit-photo-pass").children("div").children("div").bsPictureAlign({
									"img_dom": 0, //img的class，为0则选中该容器内所有img图片
									"style": "fill", //两种style：full为最短边对齐，过长剪裁；fill为最长边对齐，填充背景
									"width": "100px", //容器宽度，默认为100%
									"height": "122px", //容器高度，默认为300px
									"background": "#000" //背景填充颜色，默认为#000黑色
								});
								that.chosePersonEditPhoto();
								$article.remove();
								websocket.close();
								$input.remove();
								$("#targets-person-edit-photo-info").attr("class", "chose-multi-unchecked-div");
							}
						}
					} else if (files.length > 100) {
						$input.remove();
						CommonFun.bubbleMsg("请选择不多于100张的照片");
					} else {
						$input.remove();
					}
				});
				$input.click();

			});

			return this;
		},



		//批量删除触发事件
		chosePersonEditPhoto: function() {
			var that = this,
				_options = that.options,
				$targets_person_edit_photo_con = $("#targets-person-edit-photo-con"),
				$targets_person_delete_info = $("#targets-person-edit-photo-info");
			//多选逻辑
			$targets_person_edit_photo_con.find("div.chose-multi-unchecked-div").off("click").on("click", function() {
				var $this = $(this),
					_num = 0;
				//多选逻辑
				if ($this.attr("class") == "chose-multi-checked-div") {
					$this.attr("class", "chose-multi-unchecked-div");
					$targets_person_edit_photo_con.find("p.chose-multi-checked-div").attr("class", "chose-multi-unchecked-div");
				} else {
					$this.attr("class", "chose-multi-checked-div");
				}
				_num = $targets_person_edit_photo_con.find("div.chose-multi-checked-div").length;
				$targets_person_delete_info.find("a.targets-person-delete-num").text("（已选中" + _num + "张照片）");
			});
			$targets_person_edit_photo_con.find("p.chose-multi-unchecked-div").find("span.state").off("click").on("click", function() {
				var $this = $(this),
					$p = $this.parent("p"),
					_num = 0;
				//多选逻辑
				if ($p.attr("class") == "chose-multi-checked-div") {
					$p.attr("class", "chose-multi-unchecked-div");
					$targets_person_edit_photo_con.find("div.chose-multi-checked-div").attr("class", "chose-multi-unchecked-div");
				} else {
					$p.attr("class", "chose-multi-checked-div");
					$targets_person_edit_photo_con.find("div.chose-multi-unchecked-div").attr("class", "chose-multi-checked-div");
				}
				_num = $targets_person_edit_photo_con.find("div.chose-multi-checked-div").length;
				$targets_person_delete_info.find("a.targets-person-delete-num").text("（已选中" + _num + "张照片）");
			});

			return this;
		},

	}
})(jQuery, window, document);
