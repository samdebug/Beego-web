;
(function(){
  "use strict";
  window.taskid = "";
  window.page_total = "0";
  window.fileName = "";
  window.realName = "";

  var addUser = {
    init: function () {
      addUser.menuPanel();
      addUser.inputAffect();

      addUser.saving();
      addUser.cancelling();
      addUser.callGroupListPanel();
      addUser.createGroupList();
      addUser.searchEvent();

    },
    menuPanel: function () {
      $("body")
        .off("mouseenter", ".menu-li")
        .off("mouseleave", ".menu-li")
        .on("mouseenter", ".menu-li", function () {
          $(this).find(".menu-span").css("opacity", "1");
          $(this).find(".menu-img").show();
        })
        .on("mouseleave", ".menu-li", function () {
          $(this).find(".menu-span").css("opacity", "0.8");
          $(this).find(".menu-img").hide();
        });

      $("body").off("click", ".menu-img")
        .on("click", ".menu-img", function () {
          $(this.parentNode).remove();
          $("#menu-total-amount").text($(".menu-li").size());
        });

    },
    inputAffect: function () {
      $("input").on("focus", function () {
        var css = {
          "border": "1px solid #7BF5FE",
          "box-shadow": "inset 0px 1px 3px 0px rgba(0,0,0,0.50)",
          "border-radius": "1px",
          "color": "rgba(123, 245, 254, 1)"
        };
        $(this).css(css);
      }).on("blur", function () {
        var css = {
          "border": "1px solid #407F85",
        	"box-shadow": "inset 0px 1px 3px 0px rgba(0,0,0,0.50)",
        	"border-radius": "1px",
          "color": "rgba(123, 245, 254, 0.5)"
        };
        $(this).css(css);
      });

      $(".group-list-search-input").on("focus", function () {

      });
    },
    saving: function () {
      $(".confirm-button").on("click", function () {
        // addUser.check();
        var feedback = addUser.check();
        var targetArr = addUser.getSeletedIDSet();
        var targets = targetArr.join(",");
        var name = feedback.realName;
        var password = feedback.passwd;
        var userAccount = feedback.account;

        var url= urls.addUser(userAccount, password, name, targets);

        if (typeof(feedback) == "object") {

          $.ajax({
            type: 'post',
            url: url,
            dataType: 'text',
            jsonp: "jsoncallback",
            // async: false,
            success: function (data) {
              var result = eval("(" + data + ")");
              console.log(data);
              if (result.result == "success") {
                alert("创建成功");
                window.location.href = href.gotoUserManagement();
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
        } else {
          alert(feedback);
        }

      });
    },
    check: function () {
      var newUser = {
        account : $(".add-user-input").eq(0).val(),
        passwd : $(".add-user-input").eq(1).val(),
        passwdV : $(".add-user-input").eq(2).val(),
        realName : $(".add-user-input").eq(3).val()
      };
      var accountRemain = $(".add-user-input").eq(0).val().replace(/\d/g, "").replace(/\w/g, "");
      var passwdChineseCharFlag = /[\u4e00-\u9fa5]/.test($(".add-user-input").eq(1).val());

      if (newUser.account === "") {
        return "账户不能为空";
      } else if (accountRemain !== "") {// TODO 判断中文字符和特殊符号
        return "账户不能含有汉字或特殊字符";
      } else if (newUser.account.length > 18) {
        return "账户不能超过18个字符";
      } else if (newUser.passwd === "") {
        return "密码不能为空";
      } else if (newUser.passwd.length > 18) {
        return "密码长度不能超过18个字符";
      } else if (newUser.passwd !== newUser.passwdV) {
        return "密码不一致";
      } else if (Number($(".menu-li").size()) === 0) {
        return "请至少为该用户分派一个目标库";
      } else if (passwdChineseCharFlag === true) {
        return "密码中不能含有汉字";
      } else {
        return newUser;
      }
    },
    cancelling: function () {
      $(".cancel-button").on("click", function () {
        window.location.href = href.gotoUserManagement();
      });
    },
    makeGroupListPanel: function () {
      // var groupList = userMgr.makeGroupList();
      var html = '<div class="searchBox-div">' +
          '<img src="../img/search-logo.png" class="searchBox-img" />' +
          '<input class="group-list-search-input"' +
          'type="text" name="groupListSearch"' +
          'placeholder="请输入搜索关键字" />' +
          '<div class="searchBox-button inactived">' +
            '<span class="searchBox-button-span">搜索</span>' +
          '</div>' +
        '</div>' +
        '<div class="group-list-body-groove"></div>' +
        '<div class="group-list-body">' +
          '<ul class="unselectable group-list-ul"></ul>' +
        '</div>' +
        '<div class="group-list-button-pair">' +
          '<div class="confirm group-list-button">' +
            '<span class="group-list-confirm-span">确定</span>' +
          '</div>' +
          '<div class="cancel group-list-button">' +
            '<span class="group-list-cancel-span">取消</span>' +
          '</div>' +
        '</div>';

      $(".group-list-panel").html(html);
      addUser.getGroupList();

    },
    confirmGroupListSelection: function (){
      $(".group-list-button").eq(0).off().on("click", function () {
        // 双向绑定落实修改，所以确定什么也不用做
        addUser.restore();
      });
    },
    cancelGroupListSelection: function (content) {
      $(".group-list-button").eq(1).off().on("click", function () {
        // TODO 复原
        $("#menu-ul").html(content);
        $("#menu-total-amount").text($(".menu-li").size());
        addUser.restore();
      });
    },
    groupListSelecting: function () {

      $(".group-list-li").off().on("click", function () {
        var flag = $(this).attr("data-flag");
        var group_list_panel = this.parentNode.parentNode.parentNode.parentNode.parentNode;
        var cid;
        var cName;
        var cNameEscape;
          if (flag == 1) {// 从选中到没选
            // 检查是否把所有库都取消选中了
            if ($(group_list_panel).find("[data-flag=1]").size() == 1) {
              alert("每个账户应至少分配一个库");
              console.log($("[data-flag=1]").size());
            } else {
              $(this).attr("data-flag", "0");
              $(this).find(".group-list-img").attr("src", "../img/checkbox-off-alt.png").css("opacity", "0.5");
              $(this).find(".group-list-span").css("color", "rgba(123, 245, 254, 0.5)");
              // 可使用的库列表，双向绑定
              cid = $(this).attr("data-cid");
              cName = $(this).attr("title");//用title里的值，text()被转义过
              // TODO 双向联动，此处要修改
              console.log(cid + "  " + cName)
              $("#menu-ul").find("[data-tid=" + cid + "]").remove();
              $("#menu-total-amount").text($(".menu-li").size());
            }
          } else {// 从没选到选中
            $(this).attr("data-flag", "1");
            $(this).find(".group-list-img").attr("src", "../img/checkbox-on-alt.png").css("opacity", "1");
            $(this).find(".group-list-span").css("color", "rgba(123, 245, 254, 1)");
            // 可使用的库列表，双向绑定

            cid = $(this).attr("data-cid");
            cName = $(this).text(); //text()转义过，正好进行长度限制
            cNameEscape = $(this).attr("title");


            $("#menu-ul")
              .append('<li class="menu-li" title="' + cNameEscape + '" data-tid="' + cid +
                '"><span class="menu-span" ' +
                'style="color: rgb(123, 245, 254);">' + cName +
                '</span><img class="menu-img" src="../img/close.png" /></li>');
            $("#menu-total-amount").text($(".menu-li").size());
          }

      });
    },
    restore: function () {
      $(".group-list-panel").html("");
      $(".group-list-panel").hide();
      $(".add-user-menu-header").eq(2).removeClass("add-user-menu-header-on");
    },
    getGroupList: function () {
      $.ajax({
        type: 'get',
        url: urls.getGroupList(),
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          var html;
          var result = eval("(" + data + ")");
          console.log(result);
          if (result.result == "success") {
             html = addUser.makeGroupList(result.data);
            //  console.log(html);
             $(".group-list-ul").html(html);
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
    makeGroupList: function(res){
      //构建目标库列表的html
      console.log(res);
      var nameEscape = "";
      var total = res.total;
      $(".group-list-ul").attr("data-total", total);
      var htmlArr = []
      var html = "";
      var i = 0;
      while(res.data[i]){
        if(res.data[i].name.length > 12) {
          nameEscape = res.data[i].name.slice(0, 12) + "...";
        } else {
          nameEscape = res.data[i].name;
        }
        htmlArr[i] = '<li class="group-list-li group-list-li-' + res.data[i].id +
          '" data-cid="' + res.data[i].id + '"' +
            ' title="' + res.data[i].name + '"><img class="group-list-img" ' +
            'src="../img/checkbox-off-alt.png" /><!--' +
            '--><span class="group-list-span">' + nameEscape + '</span>' +
          '</li>';
        i++;
      }
      html = htmlArr.join("");
      return html;
    },
    searchGroupList: function(str){
      var total;
      $(".group-list-li").show().removeClass("no-content");
      $(".none").remove();
      var srcText = "";
      var flag = "-1";
      var i = 0;
      while($(".group-list-li").eq(i).length){
        srcText = $(".group-list-li").eq(i).attr("title");
        // console.log(typeof(srcText));
        // console.log(srcText);
        flag = srcText.search(str);
        if(flag == "-1"){
          // 不含检索内容
          $(".group-list-li").eq(i).addClass("no-content");
          $(".group-list-li").eq(i).hide();
        } else {
          // 含检索内容
        }
        i++;
      }
      total = $(".group-list-ul").attr("data-total");
      if (total == $(".no-content").size()){
        $(".group-list-ul").append('<li class="none"><span>未搜索到相关结果</span><li>');
      }
    },
    searchEvent: function () {
      // 绑定搜索目标库事件
      $(".searchBox-button").off("click").on("click", function(){
        var str = $(".group-list-search-input").val();
        addUser.searchGroupList(str);
      });

      $(".group-list-search-input").off("focus").on("focus", function(){
        $(document).on("keydown", function(e){
          if (e.keyCode == 13) {
            $(".searchBox-button").click();
          }
        });
        // $(this.parentNode).css("border", "1px solid #7bf5fe");
        // $(this.previousSibling).css("opacity", "1");
      }).off("blur").on("blur", function(){
        $(document).off("keydown");
        // $(this.parentNode).css("border", "1px solid #407F85");
        // $(this.previousSibling).css("opacity", "0.5");
      }).off("keyup").on("keyup", function () {
        if ($(this).val() !== "") {
          $(this.nextSibling).removeClass("inactived").addClass("available");
        } else {
          $(this.nextSibling).removeClass("available").addClass("inactived");
        }
      });
    },
    callGroupListPanel: function () {
      $(".add-user-menu-header").eq(2).on("click", function () {
        var i = 0;
        var IDSet = addUser.getSeletedIDSet();
        var menuScrollContent = $("#menu-ul").html();
        if ($(this).hasClass("add-user-menu-header-on")) {
          addUser.restore();
        } else {
          addUser.makeGroupListPanel();
          $(".group-list-ul").find(".group-list-li").attr("data-flag", "0");
          $(".group-list-ul")
            .find(".group-list-img")
            .attr("src", "../img/checkbox-off-alt.png")
            .css("opacity", "0.5");
          $(".group-list-ul")
            .find(".group-list-span").css("color", "rgba(123, 245, 254, 0.5)");
          while (i < IDSet.length) {
            $(".group-list-ul")
              .find("[data-cid=" + IDSet[i] + "]").attr("data-flag", "1");
            $(".group-list-ul")
              .find("[data-cid=" + IDSet[i] + "]")
              .find(".group-list-img")
              .css("opacity", "1")
              .attr("src", "../img/checkbox-on-alt.png");
            $(".group-list-ul")
              .find("[data-cid=" + IDSet[i] + "]")
              .find(".group-list-span").css("color", "rgba(123, 245, 254, 1)");
            i++;
          }

          $(".group-list-panel").show();
          $(this).addClass("add-user-menu-header-on");

          $(document).off().on("click", function (e) {
            var GroupListPanel = $(".group-list-panel");
            var GroupListButton = $(".add-user-menu-header").eq(2);
            var isTarget = (!GroupListPanel.is(e.target) || !GroupListButton.is(e.target));
            var isChildofTarget = (GroupListPanel.has(e.target).length || GroupListButton.is(e.target));
            if ((isTarget && isChildofTarget) === 0) {
              console.log("outside");
              // 边框变黄，警告用户 “弹窗未收回”
              $(".group-list-panel").css({
                "border": "1px solid yellow",
                "box-shadow": "0px 0px 30px 0px rgba(255, 255, 0, 0.49)"
              });
              setTimeout(function () {
                $(".group-list-panel").css({
                  "border": "1px solid #71F5FF",
                  "box-shadow": "0px 0px 30px 0px rgba(112, 244, 255, 0.49)"
                });
              }, 1000);

            } else {
              addUser.groupListSelecting();
              addUser.cancelGroupListSelection(menuScrollContent);
              addUser.confirmGroupListSelection();
            }
          });
          addUser.searchEvent();
        }
      });
    },
    getSeletedIDSet: function () {
      var i = 0;
      var IDSet = [];
      while ($(".menu-li").eq(i).length) {
        IDSet[i] = $(".menu-li").eq(i).attr("data-tid");
        i++;
      }
      return IDSet;
    },
    createGroupList: function () {
      var html = '<div id="create-group-body">' +
          '<div id="create-group-name" class="create-group-div">' +
            '<span class="create-group-span">名称</span>' +
            '<input class="input" id="create-input-name" name="name"' +
            'type="text" placeholder="请输入库名称（必填）" />' +
          '</div>' +
          '<div id="create-group-remark" class="create-group-div">' +
            '<div class="remark-div"><span class="create-group-span">备注</span></div>' +
            '<div class="remark-div"><textarea id="create-group-remark-textarea"></textarea></div>' +
          '</div>' +
        '</div>';
      var createdBy = sessionStorage.username;
      var json = {
        option: 0,
        cssID: "create-group-list",
        body: html,
        header: "创建目标库"
      };
      $("#menu-hint-clickable").on("click", function () {
        popup.makeit(json);
        addUser.sendCreateAjax();
      });
    },
    sendCreateAjax: function () {

      $("#create-group-list").find(".popup-confirm-div").off().on("click", function () {
        var cName = $("#create-input-name").val();
        var cRemark = $("#create-group-remark-textarea").val();
        if ($("#create-input-name").val() === "") {
          // 如果没填库名称，库名称处边框变黄提醒
          $("#create-input-name").css("border", "1px solid yellow");
          $("#create-input-name").attr("placeholder", "库名称不能为空");
          setTimeout(function () {
            $("#create-input-name").css("border", "1px solid rgba(123, 245, 254, 0.5)");
          }, 2000);
        } else {
          // 先对库名称判重，如果有名称相同的库则拦截
          console.log(cName);
          $.ajax({
            type: 'post',
            url: urls.checkDuplication(cName),
            dataType: 'text',
            jsonp: "jsoncallback",
            async: false,
            success: function (data) {
              var result = eval("(" + data + ")");
              if (result.result == "success") {
                // 没有同名库，继续发送创建请求
                $.ajax({
                  type: 'post',
                  url: urls.createGroupList(cName, cRemark, sessionStorage.username),
                  dataType: 'text',
                  jsonp: "jsoncallback",
                  async: false,
                  success: function (data) {
                    var result = eval("(" + data + ")");
                    if (result.result == "success") {
                      alert("创建成功！");
                      $("#mask").remove();
                      $("#create-group-list").remove();
                    } else {
                      console.log(result);
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
              } else {
                alert("您已经创建了一个名称相同的库了。");
              }
            },
            error: function () {
              alert("未能连接服务器。");
            }
          });
        }
      });
    }
  };
  addUser.init();
}());
