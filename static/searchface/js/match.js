;
(function () {
  "use strict";
  window.taskid = "";
  window.page_total = "0";
  window.fileName = "";
  var new_element=document.createElement("script");
  new_element.setAttribute("type","text/javascript"); 
　new_element.setAttribute("src","/static/layer/layer.js");
　document.body.appendChild(new_element);

  var force = {
    init: function () {
      force.inactiveForceButton();
    },
    inactiveForceButton: function () {
      // $("#forceMatchButton").addClass("inactived");
    }
  };

  var match = {
    init: function(){
      //初始化
      match.checkSearch();
      match.effectBinding();
      force.init();
      filter.init();
    },
    effectBinding: function(){
      /*
        上传图片和按钮的hover效果，另外还绑定了上传提交的事件
      */

      //上传图片，选择库部分hover效果
      $("#upload").
        on("mouseenter", function(){
          var self = $("#file");
          var picture = !!match.getUploadedPicture(self);
          $(this).addClass("frame-hover");
          if(picture) {
            $("#replacePic").show();
          }
          $("#matchSourcePic-span").css("color", "rgba(123, 245, 254, 1)");
        }).
        on("mouseleave", function(){
          $(this).removeClass("frame-hover");
          if($("#replacePic").css("display") != "none"){
            $("#replacePic").hide();
          }
          $("#matchSourcePic-span").css("color", "rgba(123, 245, 254, 0.5)");
        });

      $("#matchSourcePic-text").
        on("mouseenter", function(){
          var self = $("#file");
          var picture = !!match.getUploadedPicture(self);
          $("#upload").addClass("frame-hover");
          if(picture) {
            $("#replacePic").show();
          }
          $("#matchSourcePic-span").css("color", "rgba(123, 245, 254, 1)");
        }).
        on("mouseleave", function(){
          $("#upload").removeClass("frame-hover");
          if($("#replacePic").css("display") != "none"){
            $("#replacePic").hide();
          }
          $("#matchSourcePic-span").css("color", "rgba(123, 245, 254, 0.5)");
        });

      $("#matchSourceGroup").
        on("mouseenter", function(){
          $(this).addClass("frame-hover");
          // $(this).css({
          //   "opacity": "1",
          //   "border": "1px dashed #7BF5FE"
          // })
        }).
        on("mouseleave", function(){
          // $(this).css({
          //   "border": "1px dashed rgba(123, 245, 254, 0.5)",
          //   "opacity": "0.6"
          // });
          $(this).removeClass("frame-hover");
        });

      $("#search-button-div").
        on("mouseenter", function(){
          $(this).find("span").css("color", "#fff");
        }).
        on("mouseleave", function(){
          $(this).find("span").css("color", "#fff");
        });

      //选择目标库
      $("#matchSourceGroup").on("click", function(){
        match.getGroupList();
        $("#group-list").show();
      });
      //点击目标库外区域关闭目标库
      // $(document).click(function(e){
      //   var groupList = $("#group-list");   // 设置目标区域
      //   // 考虑点击触发元素的情况
      //   if(!groupList.is(e.target) && groupList.has(e.target).length === 0){ // Mark 1
      //     groupList.hide();// 功能代码
      //   }
      // });
      //提交功能
      match.makeThresholdList();
    },
    checkThreshold: function(){
      var checkResult = false;
      var threshold = Number($("#threshold-input").val());
      var thresholdTure = Number($("#threshold-input-true").val());

      if (!!threshold) {

        if(threshold <= 95 && threshold >= 9) {

          if (thresholdTure <= 0.95 && thresholdTure >= 0.09) {

            if((thresholdTure * 100).toFixed(0) == threshold) {

              checkResult = true;
            }
          }
        }
      }
      return checkResult;
    },
    checkSearch: function(){

      var self = $("#file");
      var picture = !!match.getUploadedPicture(self);
      var thdCheck = match.checkThreshold();
      var gid = !!$("#group").val();
      //var url = urls.getCompareResult();
      var url = urls.getCompareResult();

      // console.log(picture && gid && thdCheck);
      //这个事件要先检查预置条件，符合要求后才绑定
      //按钮hover效果
      if (picture && gid && thdCheck) {
        $("#startMatchButton").
          on("mouseenter", function(){
            $(this).addClass("button-hover");
            $(this).find("span").css("color", "#000000");
          }).
          on("mouseleave", function(){
            $(this).removeClass("button-hover");
            $(this).find("span").css("color", "rgba(113, 245, 255, 1)");
          }).off("click").
          on("click", function(){
            // 下方面板内容变成loading
            match.loading();

            // 清除换图时弱化的部分和提示
            $("#last-comparison").text("");
            $("#matchResults-ul").css("opacity", "1");
            $("#searching").text("");

            match.matching(url);
          }).
          removeClass("inactived");
          $("#startMatchButton-span").css("color", "rgb(21, 115, 191)");
      } else {
        $("#startMatchButton").
          off("mouseenter").
          off("mouseleave").
          off("click").
          addClass("inactived");
          $("#startMatchButton-span").css("color", "rgb(21, 115, 191)");
      }
    },
    loading: function () {
      $("#matchResults").hide();
      $("#guide").html("<span id='searching'>正在检索……</span>");
      $("#guide").show();
    },
    checkExport: function(signal){
      // 检查导出时的前置条件
      if (signal == 0) {
        $("#export-div").
          off("mouseenter").
          off("mouseleave").
          off("click").
          addClass("inactived");
        $("#export-span").css("color", "rgba(113, 245, 255, 0.4)");
      } else {
        $("#export-div").
          on("mouseenter", function(){
            $(this).addClass("button-hover");
            $(this).find("span").css("color", "#000000");
          }).
          on("mouseleave", function(){
            $(this).removeClass("button-hover");
            $(this).find("span").css("color", "rgba(113, 245, 255, 1)");
          }).
          off().on("click", function(){
            match.export();
          }).
          removeClass("inactived");
        $("#export-span").css("color", "rgba(113, 245, 255, 1)");
      }
    },
    matching: function(url){

      var data = {};
      // console.info($("#type").val());
      // console.log(!!$("#type").val());
      if (!!$("#type").val()) {
        data = {
          x: parseInt($("#x").attr("data-value")),
          y: parseInt($("#y").attr("data-value")),
          width: parseInt($("#width").attr("data-value")),
          height: parseInt($("#height").attr("data-value"))
        };
      }

      //上传图片并返回比对结果
      try {
        $(".selected-condition").text("不限");
        $("#age-filter-start").val("");
        $("#age-filter-stop").val("");
      } catch (err) {
        console.log("First submission");
      }
      $("#matchForm").ajaxSubmit({
        type: 'post', // 提交方式 get/post
        url: "/comparing",
        data: data,
        dataType: 'text',
        jsonp: "jsoncallback",
        success: function(data) {
          var result = eval("(" + data + ")");
          //console.log(result);
          var resultTotal;

          if (result.total > 300) {
            resultTotal = 300;
          } else {
            resultTotal = result.total;
          }

          window.page_total = Math.ceil(resultTotal/50);

          if(page_total > 1){
            $("#main").css("padding-bottom", "50px");
            $(".pagination").show();
            pagination.drawContent(1);
          } else {
            $("#main").css("padding-bottom", "0px");
            $(".pagination").hide();
          }

          if(result.result == "success"){
            window.taskid = result.taskid;
            $("#taskid").val(window.taskid);

            if(result.total == "0"){
              $("#guide").html('<img id="alert-img" src="/static/searchface/img/alert.png" /><span id="searching"> ' +
                '抱歉，没有找到相似的目标，请调低阈值或替换照片/目标库后重试</span>');
                return false;
            } else {
              $("#total, #stat").text(resultTotal);
            }
            $("#guide").hide();
            $("#matchResults").show();
            match.makeResultList(result.data, 0);
            // match.filter();
            $("#selected").text("0");
          } else {
            //处理异常
            switch(result.errorMessage){
              case "verifyserver: SDK_ERROR:_NO_FACE_DETECTED":
                // $("#guide").html("<span id='searching'>图片中未能检出人脸</span>");
                match.noFaceDetected();
              break;
              case "verifyserver: DB_NOT_FOUND":
                $("#guide").html("<span id='searching'>该数据库暂时不可用，可能已被修改</span>");
              break;
              case "verifyserver error":
                $("#searching").text("比对服务器异常");
              break;
              case "file is not picture":
                $("#guide").html("<span id='searching'>该文件可能已损坏或不是图片，请换个文件试试</span>");
              break;
              case authMsg.invalid():
                authMsg.logout();
              break;
              case authMsg.timeout():
                authMsg.logout();
              break;
              default:
                $("#guide").html("<span id='searching'>系统繁忙，请稍后再试或联系管理员 " + result.errorMessage + "</span>");
            }
          }
        },
        error: function(){
          $("#searching").text("网络连接出现异常");
        }
      });
    },
    noFaceDetected: function () {
      $("#guide").html("<img id='no-face-detected' src='/static/searchface/img/no-face-detected.png' />");
      $("#forceMatchButton").addClass("forceButton-actived");
      $("#forceMatchButton-span").css("color", "#7bf5fe");

      $("#forceMatchButton").off().on("click", function () {
        
        match.loading();

        $("#force-or-not").attr("value", "true");
        var url = urls.getCompareResult();
        match.matching(url);

        $("#force-or-not").attr("value", "false");
      });
    },
    revealForceButton: function () {
      $("#forceMatchButton").removeClass("forceButton-actived");
      $("#forceMatchButton-span").css("color", "rgba(123, 245, 254, 0.4)");
      $("#forceMatchButton").off();
    },
    setThreshold: function(threshold){
      $("#threshold-input").attr("value", threshold).val(threshold);
      $("#threshold-input-true").attr("value", Number(threshold)/100).val(Number(threshold)/100);
    },
    makeThresholdList: function(){
      $("#threshold-div").on("click", function(){

        $("#threshold-menu").show();
        var i = 9;
        var html = [];
        while(i > 0){
          html[i] = '<li class="threshold-menu-li"><span class="threshold-menu-span">' + (i*10) + '%</span></li>';
          i--;
        }
        $("#threshold-menu-ul").html(html);

        var threshold;

        $(".threshold-menu-li").off().on("click", function(){
          threshold = $(this).find("span").text().slice(0,2);
          match.setThreshold(threshold);
          $("#threshold-menu").hide();
          match.checkSearch();
        });

        if($(':focus').length !== 0){
          $(document).off().on("keydown", function(e){
            console.log(e.keyCode);
            if(e.keyCode == 13){
              threshold = $("#threshold-input").val();
              match.setThreshold(threshold);
              $("#threshold-menu").hide();
              match.checkSearch();
            }
          });
        }

        $("#threshold-input").off().on("blur", function(){
          threshold = $("#threshold-input").val();
          match.setThreshold(threshold);
          $(document).off("keydown");
          match.checkSearch();
        });
        match.makeThresholdColored();
      });
    },
    makeThresholdColored: function () {
      var value = $("#threshold-input").val().toString() + "%";
      var i = 0;
      while ($(".threshold-menu-li").eq(i).length) {
        if (value == $(".threshold-menu-span").eq(i).text()) {
          $(".threshold-menu-span").eq(i).css("color", "#7bf5fe");
        } else {
          $(".threshold-menu-span").eq(i).css("color", "rgba(123, 245, 254, 0.5)");
        }
        i ++;
      }
    },
    getGroupList: function(){
      //构建目标库列表的ajax请求
      $.ajax({
        type: 'get',
        url: '/temp',
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          var result = eval("(" + data + ")");
          //console.log(result);
          if(result.result != "success"){
            if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.invalid()) {
              authMsg.logout();
            } else {
              //alert("服务器异常！" + result.errorMessage);
              layer.msg("服务器异常！" + result.errorMessage);
              return false;
            }
          } else {
            result = result.data;
            var html = match.makeGroupList(result);
            $("#group-list-ul").html(html);
          }

        },
        error: function () {
          //alert("未能建立与服务器的连接");
          return layer.msg("未能建立与服务器的连接");
        }
      });
      match.processGroupEvent();
    },
    processGroupEvent: function(){
      //events of group list

      $(".gl-li").off().on("click", function(){
        if(!!$(this).hasClass("gl-li-on")){
          $(this).removeClass("gl-li-on");
        } else {
          $(".gl-li").removeClass("gl-li-on");
          $(this).addClass("gl-li-on");
        }

        if(!!$(this).find(".gl-span").hasClass("gl-span-on")){
          $(this).find(".gl-span").removeClass("gl-span-on");
        } else {
          $(".gl-span").removeClass("gl-span-on");
          $(this).find(".gl-span").addClass("gl-span-on");
        }
      });
      $(".gl-buttonPair-cancel").off().on("click", function(){
        $("#group-list").hide();
      });
      $(".gl-buttonPair-confirm").off().on("click", function(){
        var cid = $(".gl-span-on").attr("data-cid");
        var cName = $(".gl-span-on").text();
        if(!!cid){
          $("#group").attr("value", cid).val(cid);
          $("#group-text").text(cName);
          $("#group-list").hide();
        } else {
          //alert("No Targets Selected!");
          return layer.msg("请选择目标库");
        }

        $("#matchSourceGroup-text").show();
        $("#matchSourceGroup-span").text(cName);
        $("#matchSourceGroup").css("background-image", "url(/static/searchface/img/target-background.png)");
        $("#group-div").css("visibility", "hidden");

        //检查搜索前置条件
        match.checkSearch();
      });

      $("#search-button-div").on("click", function(){
        var str = $("#search-input").val();
        match.searchGroupList(str);
      });

      $("#search-input").on("focus", function(){
        $(document).on("keydown", function(e){
          if (e.keyCode == 13) {
            $("#search-button-div").click();
          }
        });
      }).on("blur", function(){
        $(document).off("keydown");
      });
    },
    makeGroupList: function(res){
      //构建目标库列表的html
      //console.log(res);
      var nameEscape = "";
      var total = res.total;
      $("#group-list-ul").attr("data-total", total);
      var html = [];
      var i = 0;
      while(res.data[i]){
        if(res.data[i].name.length > 12) {
          nameEscape = res.data[i].name.slice(0, 12) + "...";
        } else {
          nameEscape = res.data[i].name;
        }
        html[i] = '<li class="gl-li"><span class="gl-span" data-cid="' + res.data[i].id +
          '" title="' + res.data[i].name + '">' +
          nameEscape + '</span></li>';
        i++;
      }
      html.join("");
      return html;
    },
    searchGroupList: function(str){
      var total;
      $(".gl-li").show().removeClass("no-content");
      $(".none").remove();
      var srcText = "";
      var flag = "-1";
      var i = 0;
      while($(".gl-li").eq(i).length){
        srcText = $(".gl-li").eq(i).find("span").attr("title");
        console.log(typeof(srcText));
        console.log(srcText);
        flag = srcText.search(str);
        if(flag == "-1"){
          // 不含检索内容
          $(".gl-li").eq(i).addClass("no-content");
          $(".gl-li").eq(i).hide();
        } 
        // else {
        //   // 含检索内容
        // }
        i++;
      }
      total = $("#group-list-ul").attr("data-total");
      if (total == $(".no-content").size()){
        $("#group-list-ul").append('<li class="none"><span>未搜索到相关结果</span><li>');
      }

    },
    makeResultList: function(res, page){
      //构建结果列表
      page = Number(page);
      var list = [];
      var i = 0;
      var nameEscape = "";

      while(res[i] && i < 50){
        if(res[i].name.length > 8){
          nameEscape = res[i].name.slice(0, 8) + "...";
        } else {
          nameEscape = res[i].name;
        }
        list[i] = '<li class="resultList"><div class="resultList-wrapper">' +
          '<div class="resultList-div" data-uuid="' + res[i].uuid + '">' +
          '<span class="resultInfo resultID" style="display:none">' + res[i].identityId + '</span>' +
          '<span class="resultInfo resultRemark" style="display:none">' + res[i].remark + '</span>' +
          '<span class="resultInfo resultAge" style="display:none">' + res[i].age + '</span>' +
          '<span class="resultInfo resultGender" style="display:none">' + res[i].gender + '</span>' +
          '<img class="resultList-img" src="' + res[i].photourl +
          '" />' + '<img class="resultList-checkbox" src="/static/searchface/img/checkbox-off.png" />' +
          '' + '</div><div class="resultList-compare"><span>双击图片查看大图</span></div></div>' +
          '<span class="resultList-span"><span class="resultListHighlight"><span class="resultIndex">' + ((i+1) + 50 * page) +
          '</span>. 相似度<span class="similarity">' +
          Number(res[i].score * 100).toFixed(1) +
          '</span>%</span>' +
          '<br /><span class="resultName" title=' + res[i].name + '>' + nameEscape + '</span>' +
          '</li>';
        // console.log("a")
        i ++;
      }
      // console.log(i)
      // console.log(res)
      var html = list.join("");
      $("#matchResults-ul").html(html);
      match.selectPictures();
      match.showLargeScale(0);
      match.checkExport(0);
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
        imgObj.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
        try {
          imgObj.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = dataURL;
        } catch (err) {
          dataURL = "";
        }
      }
      //console.log(dataURL);
      return dataURL;
    },
    getUploadedFileName: function(evnt){
      try{
        $("#preview").show();
        var name = evnt.currentTarget.files[0].name;
        var escapeName = "";
        var suffix = "";
        if(evnt.currentTarget.files[0].name){
          if(name.length > 12){
            escapeName = name.slice(0, 12) + "...";
          } else {
            escapeName = name;
          }
          $("#aside-name").text(escapeName);
        }
        $("#upload").css("opacity", "1");
        $("#upload-div").hide();
        window.fileName = name;
        suffix = name.slice(name.lastIndexOf("."), name.length);
        suffix = suffix.toLowerCase();
        if (suffix != ".jpg" && suffix != ".png" && suffix != ".jpeg" && suffix != ".bmp") {
          //alert("您上传的文件可能不是图片，建议您更换文件后再试。如果您坚持上传该文件，可能无法得到搜索结果。");
          layer.msg("您上传的文件可能不是图片，建议您更换文件后再试。如果您坚持上传该文件，可能无法得到搜索结果。");
          escapeName = undefined;
        }
        return escapeName;
      } catch (err) {
        $("#preview, #present-data-canvas").hide();
        $("#upload").css("opacity", "0.6");
        $("#upload-div, #replacePic").show();
        //alert("未选择新图片。");
        return layer.msg("未选择新图片");
      }
    },
    uploadProcess: function(){
      //上传图片预览相关的逻辑
      $("#upload").on("click", function(){
        $("#file").click();
      });
      $("#file").on("change", function(e){
        var self = $(this);
        //get file name
        var fileName = match.getUploadedFileName(e);
        var picPath = match.getUploadedPicture(self);

        $("#preview").css("visibility", "hidden");
        $("#preview").attr('src', picPath);
        $("#preview").css("visibility", "visible");
        $("#aside-uploaded").attr('src', picPath);
        match.checkSearch();

        // 清除当前值
        $("#matchSourcePic")
          .removeAttr("data-originx")
          .removeAttr("data-originy")
          .removeAttr("data-originDeltaX")
          .removeAttr("data-originDeltaY");

        // 复原强制按钮
        match.revealForceButton();
        
        // console.log(fileName)
        // 未选择图片时，不弹出标定面板
        if (fileName !== undefined) {
          picture.init(picPath);
          $("#matchSourcePic-text").show();
          $("#matchSourcePic-span").text(fileName);
        } else {
          $("#matchSourcePic-text").hide();
          $("#matchSourcePic-span").text("");
        }

        // 弱化结果展示区域
        $("#last-comparison").text("上一次的");
        $("#matchResults-ul").css("opacity", "0.6");
        $("#searching").text("请点击“开始检索”按钮获得检索结果");
      });

      $("#preview").on("load", function () {
        match.autoResize(this);
      });
    },
    selectPictures: function () {
      //选择图片的功能
      var flag;
      var signal = 0;
      $(".resultList-wrapper")
        .on("mouseenter", function(){
          $(this).find(".resultList-div").addClass("resultList-div-hover");
          $(this).find(".resultList-checkbox").show();
          $(this.parentNode).find(".resultList-compare").show();
        })
        .on("mouseleave", function(){
          $(this.parentNode).find(".resultList-compare").hide();
          flag = match.getSelectedFlag($(this).find(".resultList-checkbox"));
          if(flag !== "on"){
            $(this).find(".resultList-div").removeClass("resultList-div-hover");
            $(this).find(".resultList-checkbox").hide();
          }
        });
      // $(".resultList-compare").on("click", function(){
      //   console.log("compare");
      // });
      $(".resultList-checkbox").on("click", function(){
        //选中图片的事件绑在这里
        var self = this.parentNode;
        flag = match.getSelectedFlag($(self).find(".resultList-checkbox"));
        if(flag == "off"){//从未选中到选中
          $(self).find(".resultList-checkbox").attr("src", "/static/searchface/img/checkbox-on.png");
          $(self).addClass("selectedPicture");
        } else {//选中到未选中
          $(self).find(".resultList-checkbox").attr("src", "/static/searchface/img/checkbox-off.png");
          $(self).removeClass("selectedPicture");
        }
        $("#selected").text($(".selectedPicture").size());
        //检查是否有选中
        match.checkExport($(".selectedPicture").size());
      });
      match.selectAll();
    },
    getSelectedFlag: function(self){
      //判断单个图像是否被选中，返回一个flag，on为选中，off为未选中
      var flag = self.attr("src");
      flag = flag.slice(flag.lastIndexOf("-") + 1, flag.lastIndexOf("."));
      return flag;
    },
    selectAll: function(){
      //全选图片的功能
      var flag = "";
      $("#checkbox").on("click", function(){
        flag = match.getSelectedFlag($(this));
        if(flag == "off"){
          $(this).attr("src", "/static/searchface/img/checkbox-on.png");
          $(".resultList-div").addClass("resultList-div-hover").addClass("selectedPicture");
          $(".resultList-div").find(".resultList-checkbox").show();
          $(".resultList-checkbox").attr("src", "/static/searchface/img/checkbox-on.png");
          $("#selected").text($("#total").text());

          //Checkbox style
          $(this).css("opacity", "1");
          $(".rg-header-span").eq(0).css("color", "rgba(123, 245, 254, 1)");

        } else {
          $(this).attr("src", "/static/searchface/img/checkbox-off.png");
          $(".resultList-div").removeClass("resultList-div-hover").removeClass("selectedPicture");
          $(".resultList-div").find(".resultList-checkbox").hide();
          $(".resultList-checkbox").attr("src", "/static/searchface/img/checkbox-off.png");
          $("#selected").text("0");

          //Checkbox style
          $(this).css("opacity", "0.5");
          $(".rg-header-span").eq(0).css("color", "rgba(123, 245, 254, 0.5)");
        }
      });
    },
    showLargeScale: function(page){
      //构建大图
      $(".resultList-img").on("dblclick", function(){
        var self = this.parentNode.parentNode.parentNode;
        //console.log(self)
        var index = Number($(".resultList").index(self));
        //console.log(index)
        match.loadLargeData(self, index, page);
      });
    },
    processLargeEvent: function(self, index){
      var i = index;
      $("#mask-for-large, #large").show();
      $("#large-img, #mask-for-large").off().on("click", function(){
        $("#mask-for-large, #large").hide();
        $(document).off("keydown");
      });

      $(".l-buttonPair-last").off().on("click", function(){
        var index = i - 1;
        var self = $(".resultList").eq(index);
        match.loadLargeData(self, index);
      });
      $(".l-buttonPair-next").off().on("click", function(){
        var index = i + 1;
        var self = $(".resultList").eq(index);
        match.loadLargeData(self, index);
      });

      $(document).off().on("keydown",function(e){
        if(e.keyCode == 37){
          //按左键上一页
          if($(".l-buttonPair-last").css("visibility") == "visible"){
            $(".l-buttonPair-last").click();
          }
        } else if (e.keyCode == 39) {
          //按右键下一页
          if ($(".l-buttonPair-next").css("visibility") == "visible") {
            $(".l-buttonPair-next").click();
          }
        }
      });

      //上一页，下一页
      $(".l-buttonPair-div").
        on("mouseenter", function(){
          $(this).addClass("l-buttonPair-div-hover");
          $(this).find("span").css("color", "#fff");
        }).
        on("mouseleave", function(){
          $(this).removeClass("l-buttonPair-div-hover");
          $(this).find("span").css("color", "#fff");
        });
    },
    loadLargeData: function(self, index, page){
      $(".l-buttonPair-next, .l-buttonPair-last").css("visibility", "visible");
      /*
        1、拿到index
        2、读取数据
        3、填充数据
        4、翻页前判断index值，翻页时index相应加减
        5、把新的index设置为当前的index
      */

      var amount = Number($(".resultList-img").size()) - 1;

      //判断当前是第几张图，决定翻页按钮是否激活
      if (Number(index) === 0){

        if ($(".resultList-img").size() === 1) {
          $(".l-buttonPair-next, .l-buttonPair-last").css("visibility", "hidden");
        } else {
          $(".l-buttonPair-last").css("visibility", "hidden");
        }

      } else if (Number(index) == 49 || Number(index) == Number(amount)) {
        $(".l-buttonPair-next").css("visibility", "hidden");
      } else {
        $(".l-buttonPair-next, .l-buttonPair-last").css("visibility", "visible");
      }
      // console.log(index);
      //获取数据
      var baseLine = $(".resultList").eq(index);
      var index_d = baseLine.find(".resultIndex").text();
      var name = baseLine.find(".resultName").attr("title");
      var name_d;
      var age = baseLine.find(".resultAge").text();
      //d for display
      var age_d;
      var gender = baseLine.find(".resultGender").text();
      var gender_d;
      var imgBaseName = baseLine.find(".resultRemark").text();
      var imgBN_d;
      var identityID = baseLine.find(".resultID").text();
      var identityID_d;
      var destURL = baseLine.find(".resultList-img").attr("src");
      var fileElement = $("#file");
      var sourceURL = match.getUploadedPicture(fileElement);
      var similarity = baseLine.find(".similarity").text();
      //转换数据，提高可读性
      if (name.length > 12) {
        name_d = name.slice(0, 12) + "...";
      } else {
        name_d = name;
      }

      if (gender == "male") {
        gender_d = "性别：男";
      } else if (gender == "female") {
        gender_d = "性别：女";
      } else {
        gender_d = "性别：--";
      }

      if (age == 0) {
        age_d = "年龄：--";
      } else {
        age_d = "年龄：" + age;
      }

      if (imgBaseName == "") {
        imgBN_d = "所属库：--";
      } else {
        imgBN_d = "所属库：" + imgBaseName;
      }

      if (identityID == "undefined" || identityID == "" ) {
        identityID_d = "身份证号：--";
      } else {
        identityID_d = "身份证号：" + identityID;
      }

      // 装配数据
      $("#number").text("第 " + index_d + " 个目标");
      $("#highlight-info").text("姓名：" + name_d).attr("title", name);
      $("#other-info").html(age_d + "<br />" +
          gender_d + "<br />" +
          imgBN_d + "<br />" + identityID_d);
      $("#l-percentage").html('<div><span>' + similarity + '%</span></div>');
      $("#l-Content-img").attr("src", destURL);
      $("#l-source-img").attr("src", sourceURL);
      match.processLargeEvent(self, index);
    },
    getExportIDset: function(){
      //返回所有需要导出的图片的uuid，字符串形式，逗号分隔
      var idSet = [];
      var totalSelectNum = 0;
      var i = 0;
      totalSelectNum = Number($(".selectedPicture").size());
      while(i < totalSelectNum){
        idSet[i] = $(".selectedPicture").eq(i).attr("data-uuid");
        i++;
      }
      idSet = idSet.toString();
      console.log(idSet);
      return idSet;
    },
    export: function(){
      //导出功能
      //TODO 正在生成下载链接
      var idSet = match.getExportIDset();
      var imgName = window.fileName;
      var taskid = $("#taskid").val();
      $.ajax({
        type: 'get',
        url: urls.getExportURL(taskid, idSet, imgName),
        dataType: 'text',
        jsonp: "jsoncallback",
        success: function (data) {
          var result = eval("(" + data + ")");
          //TODO 导出失败异常处理
          console.log(result);
          if(result.result == "error") {
            //alert("Oh, NOooooooooooooo!" + " " + result.reason);
            return layer.msg("Oh, NOooooooooooooo!" + " " + result.reason);
          } else {
            console.log(window.location.origin + result.url)
            setTimeout(function(){
              window.open(window.location.origin + result.url);
            }, 1000);
          }
        },
        error: function () {
          //alert("Connect Error!");
          return layer.msg("Connect Error!");
        }
      });
    },
    pagination: function(url, page){
      $.ajax({
        type: 'post',
        url: url,
        dataType: 'text',
        jsonp: "jsoncallback",
        success: function (data) {
          var result = eval("(" + data + ")");
          match.makeResultList(result.data, page);
        },
        error: function () {
          //alert("Connect Error!");
          return layer.msg("Connect Error!");
        }
      });
    },
    autoResize: function (obj) {
      $(obj).removeAttr("width").removeAttr("height");
      $(obj).css("margin-top", "0");
      var img = new Image();
      img.src = obj.src;
      var w = img.width;
      var h = img.height;

      if (Number(h) > Number(w)){
        $(obj).attr("height", "228");
      } else {
        $(obj).attr("width", "188");
        var y = Number(h) * Number(188)/Number(w);
  			var margin_top = (228 - y)*0.5;
  			$(obj).css("margin-top", margin_top);
      }
    }
  };

  var filter = {
    init: function () {
      $("#gender-menu").off().on("click", function () {
        var target = $("#gender-menu-body");
        $("#gender-menu-body").show();
        filter.outside(target);
      });

      $(".gender-menu-item").on("click", function () {
        var selected = $(this).text();
        $("#gender-on-select").text(selected);
        $("#gender-menu-body").hide();
      });
      filter.makePeopleFilter();
    },
    makePeopleFilter: function () {
      var html = "";
      var htmlArr = []
      var i = 0;
      while (i < (people.length)) {
        htmlArr[i] = '<div class="people-item"><div class="people-capital">' + people[i] + '</div>';
        i ++;
        htmlArr[i] = '<div class="people-content people-option">' + people[i] + "</div></div>";
        i ++;
      }
      html = htmlArr.join("");
      html = '<div class="people-item"><span class="people-item-all people-option">不限</span></div>' + html;

      $("#people-menu-body").html(html);  
      filter.enablePeopleFilter();    
    },
    enablePeopleFilter: function () {
      $("#people-menu").on("click", function () {
        $("#people-menu-body-wrapper").show();
      });

      $(".people-item").on("click", function () {
        var content = $(this).find(".people-option").text();
        if (content.length > 5) {
          $("#people-on-select")
            .text(content)
            .css("font-size", "14px");
        } else {
          $("#people-on-select")
            .text(content)
            .css("font-size", "16px");
        }
        
        $("#people-menu-body-wrapper").hide();
      });
    },
    makeRegionFilter: function () {
      var html = "";
      var htmlArr = [];
    },
    genderFilter: function () {
      
    },
    filterSubmit: function () {
      $(".age-filter-button").off().one("click", function () {

        var isValid = match.checkFilter();
        var genderCondition = $(".selected-condition").text();
        if (genderCondition == "男") {
          genderCondition = "male";
        } else if (genderCondition == "女") {
          genderCondition = "female";
        } else {
          genderCondition = "";
        }
        var startAge = $("#age-filter-start").val();;
        var stopAge = $("#age-filter-stop").val();

        // 自动纠正
        var temp = 0;
        if (Number(startAge) > Number(stopAge)) {
          temp = startAge;
          startAge = stopAge;
          stopAge = temp;
        }

        var taskid = $("#taskid").val();
        var url = urls.getFiltratedResult(taskid, 0, 50, startAge, stopAge, genderCondition);
        if (isValid === true) {
          $("#matchForm").ajaxSubmit({
            type: 'post', // 提交方式 get/post
            url: url,
            data: {
              x: parseInt($("#x").attr("data-value")),
              y: parseInt($("#y").attr("data-value")),
              width: parseInt($("#width").attr("data-value")),
              height: parseInt($("#height").attr("data-value"))
            },
            dataType: 'text',
            jsonp: "jsoncallback",
            success: function(data) {
              match.filterSubmit();
              var result = eval("(" + data + ")");

              window.page_total = Math.ceil(result.total/50);
              if(page_total > 1){
                $("#main").css("padding-bottom", "50px");
                $(".pagination").show();
                pagination.drawContent(1);
              } else {
                $("#main").css("padding-bottom", "0px");
                $(".pagination").hide();
              }

              if(result.result == "success"){
                window.taskid = result.taskid;
                if(result.total == "0"){
                  $("#matchResults-ul").html('<li id="none-li"><span id="none-span"> ' +
                    '抱歉，该过滤条件下没有结果</span></li>"');
                  $("#total, #stat").text(result.total);
                    return false;

                } else {
                  $("#total, #stat").text(result.total);
                }
                match.makeResultList(result.data, 0);
                match.filter();
                $("#selected").text("0");
              } else {
                //处理异常
                //alert("出错了" + " " + result.reason);
                return layer.msg("出错了" + " " + result.reason);
              }
            },
            error: function(){
              match.filterSubmit();
              //alert("网络连接出现异常！");
              return layer.msg("网络连接出现异常！");
            }
          });
        } else {
          //alert(isValid);
          layer.msg(isValid);
          match.filterSubmit();
        }
      });
    },
    checkFilter: function () {
      var startAge = $("#age-filter-start").val();
      var stopAge = $("#age-filter-stop").val();
      if (startAge !== "" && stopAge !== "") {
        if (isNaN(startAge)) {
          return "年龄段下限的值应该是一个数字";
        } else if (isNaN(stopAge)) {
          return "年龄段上限的值应该是一个数字";
        } else if (Number(startAge) > Number(stopAge)) {
          //alert("您输入的年龄段上限小于下限，不过我们会为您自动纠正");
          layer.msg("您输入的年龄段上限小于下限，不过我们会为您自动纠正");

          return true;
        } else {
          return true;
        }
      } else {
        //alert("您没有填写年龄段的上限或下限，将为您取消年龄段这个过滤条件");
        layer.msg("您没有填写年龄段的上限或下限，将为您取消年龄段这个过滤条件");
        return true;
      }
    },
    outside: function (target) {
      $(document).on("click", function (e) {
        if (!target.is(e.target) && target.has(e.target).length === 0) {
          $("#gender-menu-body").hide();
        }
        $(document).off();
      });
    }
  }

  var picture = {
    init: function (picPath) {
      picture.parameterInit();
      //picture.showMask(picPath);
    },
    showMask: function (picPath) {
      var windowHeight = $(window).height();
      var windowWidth = $(window).width();
      var html = '<img id="origin-picture" src="' + picPath + '" />' +
                  '<div id="canvas-div"><div id="wire-frame"></div></div>';
      var markBox = {
        cssID: "mark-box",
        option: 1,
        header: "人脸标定",
        body: html
      };

      popup.makeit(markBox);

      var heightOffset = 100; // 左边距50 + 右边距50
      var widthOffset = 140; // 上边距 70 + 下边距 70

      $("#mark-box").css({
        width: Number(windowWidth) - widthOffset,
        height: Number(windowHeight) - heightOffset,
      });

      $("#popup-body").css({
        // 100 是 header 高度 50px + footer 高度 50px
        "height": Number(windowHeight) - heightOffset - 100 + "px"
      });

      $("#popup-footer").css({
        // 50 是footer的高度，2是阴影宽度
        "top": Number(windowHeight) - heightOffset - 50 - 2 + "px"
      });

      $("#origin-picture").on("load", function () {
        // console.log("load event mark");
        var maxWidth = Number(windowWidth) - widthOffset;
        // 100 是 header 高度 50px + footer 高度 50px
        var maxHeight = Number(windowHeight) - heightOffset - 100;
        picture.autoResize(this, maxHeight, maxWidth);
        picture.setCanvas(this);
      });

      picture.confirm();
      picture.cancel();
    },
    setCanvas: function (obj) {
      // ATTENTION: actually, it is a div.
      var img = new Image();
      img.src = obj.src;
      var w = img.width;
      var h = img.height;

      var fitHeight = $("#origin-picture").attr("height");
      var fitWidth = $("#origin-picture").attr("width");

      if (!!fitHeight) {
        var fitW = Number(w) * Number(fitHeight) / Number(h);
        $("#canvas-div").css({
          "width": fitW,
          "height": fitHeight
        });
      } else if (!!fitWidth) {
        var fitH = Number(h) * Number(fitWidth) / Number(w);
        $("#canvas-div").css({
          "width": fitWidth,
          "height": fitH
        });
      } else {
        $("#canvas-div").css({
          "width": w,
          "height": h
        });
      }

      // Drag to draw a frame
      picture.framing();
    },
    framing: function () {
      $("#canvas-div").on("mousedown", function (e) {
        var ExamplePicture = $("#origin-picture");
        var deltaX = ExamplePicture.offset().left;
        var deltaY = ExamplePicture.offset().top;
        var x0 = e.pageX - deltaX;
        var y0 = e.pageY - deltaY;
        $("#wire-frame").css({
          "top": y0,
          "left": x0,
          "width": 0,
          "height": 0
        });
        picture.showFrameLine(deltaX, deltaY, x0, y0);
      });
    },
    showFrameLine: function (deltaX, deltaY, startX, startY) {
      // startX 是点击的那个点的横坐标
      // startY 是点击的那个点的纵坐标

      // deltaX 是图片相对屏幕的x轴位移
      // deltaY 是图片相对屏幕在Y轴的位移

      $("#canvas-div").on("mousemove", function (e) {
        // x1是当前位置的横坐标
        var x1 = e.pageX - deltaX;
        // y1是当前位置的纵坐标
        var y1 = e.pageY - deltaY;

        // 四个方向的拖拽
        if (x1 > startX && y1 > startY) {
          // x1 > startX, y1 > startY
          // 向右下方拖拽
          $("#wire-frame").show().css({
            "width": Number(x1) - Number(startX),
            "height": Number(y1) - Number(startY)
          });
        } else if (x1 > startX && y1 < startY) {
          // x1 > startX, y1 < startY
          // 向右上方拖拽
          $("#wire-frame").show().css({
            "top": y1,
            "left": startX,
            "width": Math.abs(Number(x1) - Number(startX)),
            "height": Math.abs(Number(y1) - Number(startY))
          });
        } else if (x1 < startX && y1 > startY) {
          // x1 < startX, y1 > startY
          // 向左下方拖拽
          $("#wire-frame").show().css({
            "top": startY,
            "left": x1,
            "width": Math.abs(Number(x1) - Number(startX)),
            "height": Math.abs(Number(y1) - Number(startY))
          });
        } else if (x1 < startX && y1 < startY) {
          // x1 < startX, y1 < startY
          // 向左上方拖拽
          $("#wire-frame").show().css({
            "top": y1,
            "left": x1,
            "width": Math.abs(Number(x1) - Number(startX)),
            "height": Math.abs(Number(y1) - Number(startY))
          });
        } else if (x1 == startX && y1 == startY) {
          // x1 = startX, y1 = startY
          // 没有拖拽

          // 不可能进入这个分支，因为没有拖拽的话不会出发mousemove的事件
          $("#wire-frame").hide();
        } else {
          // console.log("Strange error occured.");
        }

        // 处理区域外的mouseup事件
        // 根据坐标判断，在区域外直接off掉所有事件，重新绑定
        $(document).off().on("mouseup", function (e) {
          var canvasDiv = $("#canvas-div");
          var originPicture = $("#origin-picture");

          // 判断选中区域大小，直接取$("#wire-frame")的宽高
          var areaHeight = $("#wire-frame").height();
          var areaWidth = $("#wire-frame").width();
          // 如果小于4，则说明选出区域面积为0. 虚线框边框宽两个像素，两边边框共计4个像素
          if (Number(areaHeight) <= 4 && Number(areaWidth) <= 4) {
            // off掉选框这个事件，重新绑定，并隐藏虚线框
            picture.endFraming();
            $("#wire-frame").hide();
          } else {
            if ((!canvasDiv.is(e.target) && canvasDiv.has(e.target).length === 0) ||
                !originPicture.is(e.target)) {
              picture.endFraming();
              picture.injectData(startX, startY);
            }
          }
        });

        $("#mark-box").attr("data-x1", x1).attr("data-y1", y1);

      });

      // $("#canvas-div").on("mouseup", function () {
      //   picture.injectData(startX, startY);
      // });
    },
    injectData: function (x0, y0) {
      var img = new Image();
        var x1 = Number($("#mark-box").attr("data-x1"));
        var y1 = Number($("#mark-box").attr("data-y1"));
        // 选中区域长宽
        var deltaX = Math.abs(Number(x0) - Number(x1));
        var deltaY = Math.abs(Number(y0) - Number(y1));
        // 原点的横纵坐标
        var originX;
        var originY;
        // 原图长宽
        var originWidth = img.width;
        var originHeight = img.height;
        // 变换后的选中区域长宽
        var originDeltaX;
        var originDeltaY;
        // 变换系数
        var scale;

        picture.endFraming();
        // console.log(x0 + " " + y0 + " " + x1 + " " + y1);

        // 确定原点横纵坐标
        if (Number(x0) > x1) {
          originX = x1;
        } else {
          originX = x0;
        }

        if (Number(y0) > y1) {
          originY = y1;
        } else {
          originY = y0;
        }

        img.src = $("#origin-picture").attr("src");
        originWidth = img.width;
        originHeight = img.height;
        // 对选中的区域进行变换
        if (!!$("#origin-picture").attr("height")) {
          scale = Number($("#origin-picture").attr("height"))/Number(originHeight);
        } else if (!!$("#origin-picture").attr("width")) {
          scale = Number($("#origin-picture").attr("width"))/Number(originWidth);
        } else {
          scale = 1;
        }

        originDeltaX = deltaX/Number(scale);
        originDeltaY = deltaY/Number(scale);

        originX = Number(originX)/Number(scale);
        originY = Number(originY)/Number(scale);
        
        // 把数据注入到#matchSourcePic的data-*属性里，方便接下来调用
        $("#matchSourcePic")
          .attr("data-originX", originX)
          .attr("data-originY", originY)
          .attr("data-originDeltaX", originDeltaX)
          .attr("data-originDeltaY", originDeltaY);
    },
    endFraming: function () {
      $("#canvas-div").off();
      picture.framing();
    },
    autoResize: function (obj, maxHeight, maxWidth) {
      $(obj).removeAttr("width").removeAttr("height");
      // console.log(maxHeight);
      // console.log(maxWidth);
      var panelHeight;
      var panelWidth;
      var resizeHeight;
      var resizeWidth;
      var img = new Image();
      img.src = obj.src;
      var w = img.width;
      var h = img.height;
      // console.log(h + "   " + maxHeight);
      // console.log(w + "   " + maxWidth);
      if (Number(w) > Number(maxWidth) && Number(h) > Number(maxHeight)) {
        // overheight and overwidth
        panelHeight = $("#popup-body").height();
        panelWidth = $("#popup-body").width();
        
        resizeWidth = Number(panelHeight) * Number(w) / Number(h);
        resizeHeight = Number(panelWidth) * Number(h) / Number(w);

        if (Number(resizeWidth) > Number(panelWidth)) {
          $(obj).attr("width", maxWidth);
        } else if (Number(resizeHeight) > Number(panelHeight)) {
          $(obj).attr("height", maxHeight);
        }
      } else {
        // overwidth or overheight
        if (Number(w) > Number(maxWidth)) {
          $(obj).attr("width", maxWidth);
        } else if (Number(h) > Number(maxHeight)) {
          $(obj).attr("height", maxHeight);
        }
      }
      $("#origin-picture").show();
    },
    confirm: function () {
        var fitWidth;
        var fitHeight;
        var frameWidth;
        var frameHeight; 
        var scale;     
        var x;
        var y;
        var width;
        var height;
      $(".popup-confirm-div").off().on("click", function () {
        // 判断是否有选中区域
        // console.log($("#wire-frame").height());
        // console.log($("#wire-frame").width());
        if ($("#wire-frame").css("display") == "none") {
          // 虚线框是display: none的情况下，点击confirm不会裁剪
          picture.doNotCrop();
          popup.close();
          picture.setForceParameter();
        } else if (Number($("#wire-frame").height()) <= 48 && 
          Number($("#wire-frame").height()) <= 48) { // 选中范围过小，小于 48 x 48
            console.log("not large enough");
            //alert("我们识别的最小区域是48 x 48，您现在选中的区域小于这个值。我们建议您重新选择，否则您将无法得到的比对结果");
            layer.msg("我们识别的最小区域是48 x 48，您现在选中的区域小于这个值。我们建议您重新选择，否则您将无法得到的比对结果");
        } else { // 正常裁剪
          frameWidth = 188;
          frameHeight = 230; 
          scale = frameWidth / frameHeight;     
          x = $("#matchSourcePic").attr("data-originx");
          y = $("#matchSourcePic").attr("data-originy");
          width = $("#matchSourcePic").attr("data-originDeltaX");
          height = $("#matchSourcePic").attr("data-originDeltaY");
          // 在form里加一个空的div#parameterSet
          $("#parameterSet").html(
            '<input type="text" id="type" name="type" value="scaleOrCut" />' +
            '<div id="x" data-value="' + x + '" />' +
            '<div id="y" data-value="' + y + '" />' +
            '<div id="width" data-value="' + width + '" />' +
            '<div id="height" data-value="' + height + '" />' +
            '<input type="text" id="force-or-not" name="force" value="false" />'
          );

          // 点击标定框的确定时，换背景图，然后在div里写入内容
          // 也可以直接用canvas来做。这里用的是canvas
          var image = new Image();
          image.src = $("#origin-picture").attr("src");
          var canvas = $("#present-data-canvas")[0];
          var ctx = canvas.getContext('2d');

          $("#preview").hide();
          $("#present-data-canvas").attr("width", frameWidth - 2);
          $("#present-data-canvas").attr("height", frameHeight);

          $("#upload-div, #replacePic, #preview").hide();
          $("#present-data, #present-data-canvas").show();
          
          if (Number(width) >= Number(height)) {
            // -2：边框一个像素，两边就是两个像素，要减掉，下同
            fitHeight = (Number(height) * (frameWidth - 2) / Number(width));
            ctx.drawImage(image, x, y, width, height, 0, 0, (frameWidth - 2), Number(fitHeight));
            
            if (frameHeight > fitHeight) {
              $("#present-data-canvas").css("top", (frameHeight - fitHeight) / 2);
            } else {
              $("#present-data-canvas").css("top", "0");
            }

          } else {
            fitWidth = (Number(width) * (frameHeight - 2) / Number(height));
            ctx.drawImage(image, x, y, width, height, 0, 0, Number(fitWidth), (frameHeight - 2));
            
            if (frameWidth > fitWidth) {
              $("#present-data-canvas").css("left", (frameWidth - fitWidth) / 2);
            } else {
              $("#present-data-canvas").css("left", "0");
            }
          }

          $("#present-data").show();
          $("#preview, #upload-div, #replacePic").hide();
          popup.close();
        }
      });
    },
    cancel: function () {
      $(".popup-cancel-div, #popup-close, #mask").off().on("click", function () {
        popup.close();
        picture.doNotCrop();
        picture.setForceParameter();
      });
    },
    doNotCrop: function () {
      $("#present-data, #upload-div, #replacePic").hide();
      $("#preview").show().css("visibility", "visible");
    },
    parameterInit: function () {
      // 上传图片onChange时的初始化
      $("#upload-div, #replacePic, #preview").show();
      // $("#preview").removeAttr("src");
      $("#present-data, #present-data-canvas").hide();
      $("#upload-div").hide();
      $("#parameterSet").html('');
      $("#present-data-canvas").css({
        "top": "0",
        "left": "0"
      });
    },
    setForceParameter: function () {
      $("#parameterSet")
          .html('<input type="text" id="force-or-not" name="force" value="false" />');
    }
  };

  var paginationEvent = {
    pagination : function(){
      var page = 0;
      var url;
      var number = 50;
      $(".pages").off().on("click", function(){
        pagination.drawContent($(this).find("span").text());
        page = Number($(this).find("span").text()) - 1;
        var taskid = $("#taskid").val();
        url = urls.getPaginationPath(taskid, page, number);
        match.pagination(url, page);
        window.scrollTo(0, 0);
      });

      $(".pages, .lastPage, .nextPage")
        .on("mouseenter", function(){
          $(this).addClass("pageHover");
        })
        .on("mouseleave", function(){
          $(this).removeClass("pageHover");
        });

      // 给“上一页”，“下一页”添加事件
      $(".lastPage").off().on("click", function(){

        var page_token = Number($(".pageCurrent").find("span").text());
        if(page_token > 1){
          pagination.drawContent(page_token - 1);
          page = page_token - 1 - 1;
          var taskid = $("#taskid").val();
          url = urls.getPaginationPath(taskid, page, number);
          match.pagination(url, page);
          window.scrollTo(0,0);
        } else {
          //alert("已经是第一页了");
          layer.msg("已经是第一页了");
        }
      });
      $(".nextPage").off().on("click", function(){
        var page_token = Number($(".pageCurrent").find("span").text());
        console.log(page_token + "    " + typeof(page_token));
        console.log(page_total);
        if(page_token < page_total){
          pagination.drawContent(page_token + 1);
          page = page_token;
          var taskid = $("#taskid").val();
          url = urls.getPaginationPath(taskid, page, number);
          match.pagination(url, page);
          window.scrollTo(0,0);
        } else {
          //alert("已经是最后一页了");
          layer.msg("已经是最后一页了");
        }
      });

      $("#pageInput").off().on("focus", function(){
        $(document).keydown(function(e){
          // console.log(e.keyCode);
          if(e.keyCode == 13){
            pageJumpTo();
          }
        });
      });
      //输入页数跳转
      $(".paginationButton").off().on("click", function(){
        pageJumpTo();
      });

      function pageJumpTo(){
        var toPage = Number($(".pagination").find("input").val());
        if (toPage > 0 && toPage <= page_total){
          pagination.drawContent(toPage);
          page = toPage - 1;
          var taskid = $("#taskid").val();
          url = urls.getPaginationPath(taskid, page, number);
          match.pagination(url, page);
          window.scrollTo(0,0);
        } else {
          $(".pagination").find("input").val("");
        }
      }
    }
  };

  $.extend(pagination, paginationEvent);

  match.init();
  match.uploadProcess();
}());
