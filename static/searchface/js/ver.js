;
(function(){
	"use strict";
	var ver = {
		init: function () {
			ver.addSrcPicture(0);
			ver.addSrcPicture(1);
		},
		addSrcPicture: function (index) {
			$(".picture-area").eq(index).on("click", function () {
				$(".compare-box-input").eq(index).click();
			});
			ver.loadPicture(index);
		},
		loadPicture: function (index) {
			$(".compare-box-input").eq(index).on("change", function (e) {
				var self = $(this);

				$(".compare-box-before-upload").eq($("input").index(this)).hide();
				$(".compare-box-span").eq($("input").index(this)).hide();

				var src = ver.getUploadedPicture(self);
				var name = ver.getUploadedFileName(e);

				if (src === false) {
					console.log("good");
				} else {
					src = ver.getUploadedPicture(self);
					$(".compare-box-img").eq(index).attr("data-name", name);

					$(".compare-box-img").eq(index)
						.hide().attr("src", src);

					$(".compare-box-img").off().on("load", function () {
						autoResize(this);
					}).show();

					// 检查是否符合开始比对的条件，即左右两边都已经上传了图片
					// 通过文件名来判断
					// 上面的代码保证了上传图片必然会有文件名，文件名储存在
					// 图片展示元素$(".compare-box-img")的data-name这个属性里
					// 如果图片名为空，或者undefined等这种异常情况，即认为是没有上传合法的图片
					ver.checkValid();
				}

			});
		},
		checkValid: function () {
			var name1 = $(".compare-box-img").eq(0).attr("data-name");
			var name2 = $(".compare-box-img").eq(1).attr("data-name");

			if (name1 !== "" && name1 !== undefined && name2 !== "" && name2 !== undefined) {
				// 去除不可点击样式，添加比对事件
				$(".submitButton").removeClass("invalid").addClass("available");
				$("#state").text("点击开始匹配按钮获得比对结果");
				ver.verify();
			} else {
				$(".submitButton").removeClass("available")
					.addClass("invalid").off("click");
			}
		},
		verify: function () {
			$(".submitButton").off().one("click", function () {
				$("#state").text("正在比对……");
				//请求比对结果
				$(".similarity-span").text("--.-%");
				$("#ver").ajaxSubmit({
	        type: 'post', // 提交方式 get/post
	        url: urls.getVerifyResult(),
	        dataType: 'text',
	        jsonp: "jsoncallback",
	        success: function(data) {

	          var result = eval("(" + data + ")");

						if (result.result == "success") {
							$("#state").text("比对完成，点击虚线框内任意位置更换图片");
							var similarity = result.score * 100;
							similarity = similarity.toFixed(1);
							$(".similarity-span").text(similarity + "%");
						} else {
							var hint = "";
							if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
								authMsg.logout();
							} else if (result.errorMessage == "verify server connection refuse") {
								hint = "比对服务器拒绝连接，请检查服务器运行状态";
							} else if (result.errorMessage == "save file error") {
								hint = "服务器内部错误";
							} else if (result.errorMessage == "analysis result error" || result.errorMessage == "SDK_ERROR:RPC_ERROR OK") {
								hint = "提取图片信息失败，请更换图片后重试";
							} else if (result.errorMessage == "SDK_ERROR:_NO_FACE_DETECTED") {
								hint = "图片中未检测到人脸，请更换一组图片";
							} else {
								hint = "系统繁忙，请重试。如仍未正常运行请联系服务提供商 " + result.errorMessage;
							}

							$("#state").text(hint);
						}
						ver.verify();
	        },
	        error: function(){
						$("#state").text("网络连接出现异常！");
						ver.verify();
	        }
	      });

			});
		},
		getUploadedPicture: function(self){
	    //返回上传图片后供预览的地址
	    var $file = self;
	    var fileObj = $file[0];
	    var windowURL = window.URL || window.webkitURL;
	    var dataURL;

	    if(fileObj && fileObj.files && fileObj.files[0]){
	      dataURL = windowURL.createObjectURL(fileObj.files[0]);
	    }else{
	      dataURL = $file.val();
	      var imgObj = document.getElementById("preview");
	      // 两个坑:
	      // 1、在设置filter属性时，元素必须已经存在在DOM树中，动态创建的Node，也需要在设置属性前加入到DOM中，先设置属性在加入，无效；
	      // 2、src属性需要像下面的方式添加，上面的两种方式添加，无效；
	      try {
					imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
	        imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;

				} catch (err) {
	        dataURL = "";
					// 获得相应的picture-area元素
					var div = self.prev().get(0);
					// 清除之前居中时候的样式
					$(div).find(".compare-box-img").css("margin-top", "0");
					$(div).find(".compare-box-img").removeAttr("width").removeAttr("height");

					// 清楚非法的图片链接
					$(div).find(".compare-box-img").attr("src", "");

					// 显示 上传本地照片 那个图和字
					$(div).find(".compare-box-before-upload").show();
					$(div).find(".compare-box-span").show();

					// 开始匹配按钮 变成不可点击状态
					$(".submitButton").removeClass("available")
						.addClass("invalid").off("click");

					// 改变提示文字
					$("#state").text("您没有选择图片，因此不能进行比对。");

					// 清楚原有百分比
					$(".similarity-span").text("--.-%");

					// 请出用来判断图片是否存在的图片名，该值储存在.compare-box-img的data-name里
					$(div).find(".compare-box-img").attr("data-name", "");

					// 该函数返回false，供后续步骤判断用
					return false;
	      }

	    }
			return dataURL;
	  },
	  getUploadedFileName: function(evnt){
	    try{
	      var name = evnt.currentTarget.files[0].name;
	      var escapeName = "";
	      var suffix = "";
	      if(evnt.currentTarget.files[0].name){
	        if(name.length > 12){
	          escapeName = name.slice(0, 12) + "...";
	        } else {
	          escapeName = name;
	        }
	      }
	      window.fileName = name;
	      suffix = name.slice(name.lastIndexOf("."), name.length);
				// 检查文件后缀名是否为png、jpg、jpeg或bmp
	      if (suffix != ".jpg" && suffix != ".png" && suffix != ".jpeg" && suffix != ".bmp") {
	        alert("您上传的文件可能不是图片，建议您更换文件后再试。如果您坚持上传该文件，可能无法得到搜索结果。");
	        return false;
	      }
	      return escapeName;
	    } catch (err) {
	      //获得上传图片链接的那个try catch语句里已经处理异常了
	    }
	  }
	};
	ver.init();

	function autoResize(obj){
		$(obj).css("margin-top", "0");
		$(obj).removeAttr("width").removeAttr("height");
	  var img = new Image();
	  img.src = obj.src;
	  var w = img.width;
	  var h = img.height;
		// console.log(w + "  " + h);
	  if (Number(h) > Number(w)){
	    $(obj).attr("height", "334");
	  } else {
	    $(obj).attr("width", "276");
			var y = Number(h) * Number(276)/Number(w);
			var margin_top = (334 - y)*0.5;
			$(obj).css("margin-top", margin_top);
	  }
	}
}());
