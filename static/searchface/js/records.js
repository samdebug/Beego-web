;
(function () {
  "use strict";// 严格模式
  // 操作记录用records这个词，不要用log，以防混淆
  window.page_total = "0";
  window.number = 12;
  var condition = "";
  var option = "all";
  var records = {
    init: function () {

      var moduleFilterHTML = records.makeModuleFilter();
      $(".module-filter-ul").html(moduleFilterHTML);
      var accountFilterHTML = records.makeAccountFilter();
      $(".account-filter-ul").html(accountFilterHTML);

      // 点击区域外收起下拉菜单
      $(document).on("click", function (e) {
        var moduleFilterDiv = $(".module-filter");
        var accountFilterDiv = $(".account-filter");

        if (!accountFilterDiv.is(e.target) && accountFilterDiv.has(e.target).length === 0) {
          console.log("outside");
          accountFilterDiv.attr("data-on", "0").removeClass("records-items-div-on");
          $(".account-filter-div").hide();
        }

        if (!moduleFilterDiv.is(e.target) && moduleFilterDiv.has(e.target).length === 0) {
          console.log("outside");
          moduleFilterDiv.attr("data-on", "0").removeClass("records-items-div-on");
          $(".module-filter-div").hide();
        }
      });

      records.getRecords();
      records.setAccountFilter();
      records.setModuleFilter();
      records.breadcrumb();
    },
    getAccountList: function () {
      var userInfo = {
        nameList : [],
        accountList: [],
        userID: []
      };
      $.ajax({
        type: 'get',
        url: urls.getAllUsers(0, 10000),
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          var i = 0;
          var html = "";
          var result = eval("(" + data + ")");

          if (result.result == "success") {
            while (result.user[i]) {
              userInfo.nameList[i] = result.user[i].name;
              userInfo.accountList[i] = result.user[i].account;
              userInfo.userID[i] = result.user[i].id;
              i++;
            }
            userInfo.accountList[i] = result.manager.account;
            userInfo.nameList[i] = result.manager.name;
            // console.log(userInfo.nameList);
            // console.log(userInfo.accountList);
          } else {
            if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
              authMsg.logout();
            } else {
              alert("操作失败 " + result.errorMessage);
            }
          }

        },
        error: function () {
          alert("未能连接服务器。");
        }
      });

      return userInfo;
    },
    setModuleFilter: function () {
      $(".module-filter-li")
        .on("mouseenter", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("module-filter-li, mouseenter");
          $(this).find(".module-filter-item-span").css("color", "rgba(123, 245, 254, 1)");
        })
        .on("mouseleave", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("module-filter-li, mouseleave");
          $(this).find(".module-filter-item-span").css("color", "rgba(123, 245, 254, 0.6)");
        })
        .on("click", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("module-filter-li, click");
          var page = 0;
          // var option = "";
          // var condition = "";
          var keywordEscape = $(this).attr("data-alias");
          var moduleFilter = this.parentNode.parentNode.parentNode;
          var filterKeyword = $(this).find(".module-filter-item-span").text();

          if (keywordEscape == "all") {
            option = keywordEscape;
            condition = "--";
          } else {
            option = "module";
            condition = keywordEscape;
          }

          // 提示目前不能双重条件过滤
          if ($(".account-filter").find(".records-items-div-span").text() !== "不限") {
            alert("该版本不支持双重条件过滤，我们会尽快在后续版本中添加此功能。");
          }
          $(".account-filter").find(".records-items-div-span").text("不限");
          console.log(condition);
          $.ajax({
            type: 'post',
            url: urls.getRecords(option, page, number, condition),
            dataType: 'text',
            jsonp: "jsoncallback",
            async: false,
            success: function (data) {
              var html = "";
              var result = eval("(" + data + ")");
              if (result.result == "success") {
                html = records.makeRecordItems(result.data);
                $(".item-background").html(html);
                window.page_total = Number(result.total) / Number(12);
                window.page_total = Math.ceil(window.page_total);

                pagination.drawContent(1);
                pagination.pagination();
              } else {
                if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                  authMsg.logout();
                } else {
                  alert("操作失败 " + result.errorMessage);
                }
              }
            },
            error: function () {
              alert("未能连接服务器。");
            }
          });

          $(moduleFilter).find(".records-items-div-span").text(filterKeyword);
        });
      $(".module-filter").on("click", function () {
        var flag = $(this).attr("data-on");
        if (flag == 1) {
          $(this).attr("data-on", "0");
          $(this).removeClass("records-items-div-on");
          $(".module-filter-div").hide();
        } else {
          // off 状态到 on状态
          $(this).attr("data-on", "1");
          $(this).addClass("records-items-div-on");
          $(".module-filter-div").show();
        }

      });
    },
    makeModuleFilter: function () {
      var i = 0;
      var html = "";
      var htmlArr = [];
      var ModuleArr = ["不限", "目标库管理", "用户管理", "人脸验证", "人脸图像检索", "账户管理"];
      var ModuleAlias = ["all", "targetsManagement", "management", "imageVerify", "imageSearch", "accountManage"];

      while (i < ModuleArr.length) {
        htmlArr[i] = '<li class="module-filter-li" data-alias="' +
          ModuleAlias[i] + '"><span class="module-filter-item-span">' +
          ModuleArr[i] + '</span></li>';
        i++;
      }
      html = htmlArr.join("");
      return html;
    },
    setAccountFilter: function () {

      $(".account-filter-li")
        .on("mouseenter", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("account-filter-li, mouseenter");
          $(this).find(".account-filter-item-span").css("color", "rgba(123, 245, 254, 1)");
        })
        .on("mouseleave", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("account-filter-li, mouseleave");
          $(this).find(".account-filter-item-span").css("color", "rgba(123, 245, 254, 0.6)");
        })
        .on("click", function () {
          // 打log出来测试是否有重复绑定的情况
          console.log("account-filter-li, click");

          var page = 0;
          // var option = "";
          // var condition = "";
          var accountFilter = this.parentNode.parentNode.parentNode;
          var filterKeyword = $(this).find(".account-filter-item-span").text();

          if (filterKeyword == "不限") {
            option = "all";
            condition = "--";
          } else {
            option = "account";
            condition = filterKeyword;
          }
          if ($(".module-filter").find(".records-items-div-span").text() !== "不限") {
            alert("该版本不支持双重条件过滤，我们会尽快在后续版本中添加此功能。");
          }
          $(".module-filter").find(".records-items-div-span").text("不限");
          console.log(condition);
          $.ajax({
            type: 'post',
            url: urls.getRecords(option, page, number, condition),
            dataType: 'text',
            jsonp: "jsoncallback",
            async: false,
            success: function (data) {
              var html = "";
              var result = eval("(" + data + ")");
              if (result.result == "success") {
                html = records.makeRecordItems(result.data);
                $(".item-background").html(html);

                window.page_total = Number(result.total) / Number(12);
                window.page_total = Math.ceil(window.page_total);

                pagination.drawContent(1);
                pagination.pagination();
              } else {
                if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                  authMsg.logout();
                } else {
                  alert("操作失败 " + result.errorMessage);
                }
              }
            },
            error: function () {
              alert("未能连接服务器。");
            }
          });


          $(accountFilter).find(".records-items-div-span").text(filterKeyword);
        });
      $(".account-filter").on("click", function () {
        var flag = $(this).attr("data-on");
        if (flag == 1) {
          $(this).attr("data-on", "0");
          $(this).removeClass("records-items-div-on");
          $(".account-filter-div").hide();
        } else {
          // off 状态到 on状态
          $(this).attr("data-on", "1");
          $(this).addClass("records-items-div-on");
          $(".account-filter-div").show();
        }
      });

    },
    makeAccountFilter: function () {
      var userInfo = records.getAccountList();

      var i = 0;
      var htmlArr = [];
      var html = "";
      htmlArr[0] = '<li class="account-filter-li" title="不限" data-aid="all">' +
        '<span class="account-filter-item-span">不限</span></li>';
      while (userInfo.accountList[i]) {
        htmlArr[i + 1] = '<li class="account-filter-li" title="' +
          userInfo.accountList[i] + '" data-aid="' + userInfo.userID[i] + '">' +
          '<span class="account-filter-item-span">' +
          userInfo.accountList[i] + '</span></li>';
        i++;
      }
      html = htmlArr.join("");
      return html;
    },
    getRecords: function () {
      var page = 0;
      // var option = "all";
      // var condition = "";
      records.sentGetRecordsAjax(option, page, number, condition, 1);
    },
    sentGetRecordsAjax: function (option, page, number, condition, flag) {
      $.ajax({
        type: 'post',
        url: urls.getRecords(option, page, number, condition),
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          window.option = option;
          window.condition = condition;
          var html = "";
          var result = eval("(" + data + ")");
          if (result.result == "success") {
            html = records.makeRecordItems(result.data);
            $(".item-background").html(html);

            var i = 1;
            // 第0项是表头，内容要从第一项开始取
            while ($(".detail").eq(i).length) {
              var widthShouldBe = $(".detail").eq(i).width();
              var heightShouldBe = $(".detail").eq(i).height();
              var widthActuallyIs = $(".detail").eq(i)
                .find(".records-items-column-span").width();
              var heightActuallyIs = $(".detail").eq(i)
                .find(".records-items-column-span").height();
              if (
                Number(widthActuallyIs) > Number(widthShouldBe) ||
                Number(heightActuallyIs) > Number(70)
              ) {
                $(".detail").eq(i).append('<div class="extra"><span class="more" title=\'' +
                  $(".detail").eq(i).find(".records-items-column-span").text() +
                  '\'>……（记录过长，已隐藏。鼠标悬停查看全部内容）</span></div>');
              }

              i++;
            }

            window.page_total = Number(result.total) / Number(12);
            window.page_total = Math.ceil(window.page_total);

            pagination.drawContent(flag);
            pagination.pagination();
          } else {
            if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
              authMsg.logout();
            } else {
              alert("操作失败 " + result.errorMessage);
            }
          }
        },
        error: function () {
          alert("未能连接服务器。");
        }
      });
    },
    makeRecordItems: function (res) {
      var i = 0;
      var html = "";
      var htmlArr = [];
      var moduleEscape = "";
      // var nameEscape = "";

      while (res[i]) {
        switch(res[i].module) {
          case "imageSearch":
            moduleEscape = "人脸图像检索";
          break;
          case "targetsManagement":
            moduleEscape = "目标库管理";
          break;
          case "imageVerify":
            moduleEscape = "人脸验证";
          break;
          case "management":
            moduleEscape = "用户管理";
          break;
          case "accountManage":
            moduleEscape = "账户管理";
          break;
        }

        htmlArr[i] = '<div class="records-item">' +
          '<div class="records-items-column module" data-module="' + res[i].module + '">' +
            '<span class="records-items-column-span">' + moduleEscape + '</span>' +
          '</div>' +
          '<div class="divider column-divider"></div>' +
          '<div class="records-items-column operation">' +
            '<span class="records-items-column-span">' + res[i].action + '</span>' +
          '</div>' +
          '<div class="divider column-divider"></div>' +
          '<div class="records-items-column detail">' +
            '<div class="detail-div"><span class="records-items-column-span" title="' + res[i].detail +
            '">' + res[i].detail + '</span></div>' +
          '</div>' +
          '<div class="divider column-divider"></div>' +
          '<div class="records-items-column username">';

          if (res[i].name !== "") {
            htmlArr[i] = htmlArr[i] + '<span class="records-items-column-span">' + res[i].name + '</span>';
          } else {
            htmlArr[i] = htmlArr[i] + '<span class="records-items-column-span" style="visibility:hidden">.</span>';
          }

          htmlArr[i] = htmlArr[i] + '</div>' +
          '<div class="divider column-divider"></div>' +
          '<div class="records-items-column account">' +
            '<span class="records-items-column-span">' + res[i].account + '</span>' +
          '</div>' +
          '<div class="divider column-divider"></div>' +
          '<div class="records-items-column time">' +
            '<span class="records-items-column-span">' + res[i].createtime + '</span>' +
          '</div>' +
        '</div>';

        i++;
      }
      html = htmlArr.join("");
      return html;
    },
    breadcrumb: function () {
      // 面包屑导航那里的跳转
      $(".records-header-span").eq(0).on("click", function () {
        window.location.href = href.gotoUserManagement();
      });
      $(".records-header-span").eq(1).on("click", function () {
        window.location.reload(true);
      });
    }
  };

  var paginationEvent = {
    pagination : function(){
      var page = 0;

      $(".pages").off().on("click", function(){
        pagination.drawContent($(this).find("span").text());
        page = Number($(this).find("span").text()) - 1;
        console.log(page);
        records.sentGetRecordsAjax(option, page, number, condition, (Number(page) + 1));
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
          records.sentGetRecordsAjax(option, page, number, condition, (Number(page) + 1));
          window.scrollTo(0,0);
        } else {
          alert("已经是第一页了");
        }
      });
      $(".nextPage").off().on("click", function(){
        var page_token = Number($(".pageCurrent").find("span").text());
        console.log(page_token + "    " + typeof(page_token));
        console.log(page_total);
        if(page_token < page_total){
          pagination.drawContent(page_token + 1);
          page = page_token;
          records.sentGetRecordsAjax(option, page, number, condition, (Number(page) + 1));
          window.scrollTo(0,0);
        } else {
          alert("已经是最后一页了");
        }
      });

      $("#pageInput").off().on("focus", function(){
        $(document).off("keydown").keydown(function(e){
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
          records.sentGetRecordsAjax(option, page, number, condition, (Number(page) + 1));
          window.scrollTo(0,0);
        } else {
          alert("输入不合法");
          $(".pagination").find("input").val("");
        }
      }
    }
  };

  $.extend(pagination, paginationEvent);

  records.init();
}());
