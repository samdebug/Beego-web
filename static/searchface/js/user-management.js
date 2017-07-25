;
(function () {
  window.page_total = 0;
  window.quotaUsed = "--";
  window.groupListHTML = {};
  window.num = 10;

  var userMgr = {
    init: function () {
      $.ajax({
        type: 'get',
        url: urls.getQuota(),
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          var avaliableList;
          var groupList;
          var groupPanel;
          var result = eval("(" + data + ")");
          window.quotaUsed = result.count;
          if (result.result == "success") {
            $(".amount").text(result.count + "/" + result.maxCount);
            $("#quota").find("span").eq(0).text(" " + result.maxCount + " ");
            $("#quota").find("span").eq(1).text(" " + result.count + " ");
            $("#quota").find("span").eq(2).text(" " + (result.maxCount - result.count) + " ");
          } else {
            if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
              authMsg.logout();
            } else {
              alert("操作失败 " + result.errorMessage);
            }
          }
        },
        error: function () {
          alert("Connect Error!");
        }
      });

      userMgr.getGroupList();
      userMgr.getAllUsers();
      userMgr.gotoAdduser();
      userMgr.gotoLog();
    },
    getGroupList: function () {
      $.ajax({
        type: 'get',
        url: urls.getGroupList(),
        dataType: 'text',
        jsonp: "jsoncallback",
        async: false,
        success: function (data) {
          var result = eval ("(" + data + ")");

          if (result.result == "success") {
            window.groupListHTML = result.data;
          } else {
            alert("ERROR!");
          }
        },
        error: function () {
          alert("Connect Error!");
        }
      });
    },
    getAllUsers: function () {
      var page = 0;
      userMgr.getAllUsersAjax(page, num, 1);
    },
    getAllUsersAjax: function (page, num, flag) {
      $.ajax({
        type: 'get',
        url: urls.getAllUsers(page, num),
        dataType: 'text',
        jsonp: "jsoncallback",
        success: function (data) {
          var avaliableList;
          var groupList;
          var groupPanel;
          var result = eval("(" + data + ")");

          $(".item-background").html("");

          if (result.result == "success") {
            if (result.manager.account !== "") {
              var adminItem = userMgr.makeUserItem(result.manager);
              $(".item-background").append(adminItem);
            } else {
              console.log("Error occurs when getting Admin account. Or there is no Admin at all.");
            }
            var userItem = [];
            var i = 0;
            try {
              while (result.user[i]) {
                avaliableList = userMgr.getAvailableGroupList(result.user[i].targets);
                userItem[i] = '<div class="user-list-items" data-uid="' +
                    result.user[i].id + '">' +
                    '<div class="item-li user-column">' +
                      '<span class="user-list-span">' + result.user[i].name + '</span>' +
                    '</div><!--' +
                    '--><div class="item-li invisible item-divider"></div><!--' +
                    '--><div class="item-li account-column">' +
                      '<span class="user-list-span">' + result.user[i].account + '</span>' +
                      '<img class="item-li-img item-li-img-delete" src="../img/delete.png" />' +
                      '<img class="item-li-img item-li-img-edit" src="../img/edit.png" />' +
                    '</div><!--' +
                    '--><div class="item-li invisible item-divider"></div><!--' +
                    '--><div class="item-li privilege-column">' +
                      '<div class="privilege-div">' +
                        '<span class="user-list-span">可使用的库</span>' +
                        '<div class="call-group-list-div"></div>' +
                        '<ul class="privilege-ul">' +
                          avaliableList +
                        '</ul>' +
                      '</div>' +
                    '</div>' +
                  '</div>';
                $(".item-background").append(userItem[i]);

                groupPanel = userMgr.makeGroupListPanel();
                $(".call-group-list-div").html(groupPanel);

                i++;
              }
            } catch (err) {
              console.log("Error occurs when getting all users. Or there is no users at all.");
            }
            window.page_total = Number(window.quotaUsed / 10);
            window.page_total = Math.ceil(window.page_total);
            pagination.drawContent(flag);
            pagination.pagination();

            // 绑定搜索目标库事件
            $(".searchBox-button").off("click").on("click", function(){
              var str = $(".group-list-search-input").val();
              userMgr.searchGroupList(str);
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

          } else {
            alert("Error!");
          }
          userMgr.setEvent();
        },
        error: function () {
          alert("Connect Error!");
        }
      });
    },
    setEvent: function () {
      $(".user-list-items")
        .on("mouseenter", function () {
          $(this).find(".user-list-span, .privilege-span")
            .css("color", "rgba(123, 245, 254, 1)");
          $(this).find(".item-li-img, .call-group-list-button").show();
        }).on("mouseleave", function () {
          $(this).find(".user-list-span, .privilege-span")
            .css("color", "rgba(123, 245, 254, 0.5)");
          $(this).find(".item-li-img, .call-group-list-button").hide();
        });

      // 单个普通用户的编辑和删除
      userMgr.edit();
      userMgr.delete();

      $(".call-group-list-button").off().on("click", function () {
        var selectedGroup;
        var userItem = this.parentNode.parentNode.parentNode.parentNode;
        // 先解绑该item的mouseleave事件
        $(".user-list-items").off();
        // 解绑编辑和删除事件
        $("body").off();
        // 换样式
        $(this).addClass("call-group-list-button-on");
        // 添加操作目标库面板的事件
        userMgr.groupListPanelEvent(userItem);

        $(this.parentNode).find(".group-list-panel").show();
        var groupList = userMgr.makeGroupList(window.groupListHTML);
        $(this.parentNode).find(".group-list-ul").html(groupList);
        $(".group-list-panel").click();

        // 装载已选中的库
        userMgr.loadSelectedGroup(userItem);
      });

    },
    loadSelectedGroup: function (self) {
      var i = 0;
      var selectedGroup = userMgr.getSelectedGroup(self);
      while (!!selectedGroup[i]) {
        $(self).find(".group-list-li-" + selectedGroup[i]).attr("data-flag", "1");
        $(self).find(".group-list-li-" + selectedGroup[i])
          .find(".group-list-img")
          .attr("src", "../img/checkbox-on-alt.png")
          .css("opacity", "1");
        $(self).find(".group-list-li-" + selectedGroup[i])
          .find(".group-list-span").css("color", "rgba(123, 245, 254, 1)");

        i++;
      }
    },
    getSelectedGroup: function (self) {
      // 之所以拆出来，是因为后面还要用这个selectedGroups
      var i = 0;
      var selectedGroup = [];
      while ($(self).find(".privilege-li").eq(i).length) {
        selectedGroup[i] = $(self).find(".privilege-li").eq(i).attr("data-tid");
        i++;
      }
      return selectedGroup;
    },
    groupListPanelEvent: function (userItem) {
      var selectedGroupIDSet = userMgr.getSelectedGroup(userItem);
      // 获得当前的该账户可用的目标库
      var currentSelectedGroups = $(userItem).find(".privilege-ul").html();
      $(document).off().on("click", function (e) {
        var self = this;

        // 选中当前item，具体方法是选中被按下去的按钮，然后向上找它的父元素
        var currentItem = $(".call-group-list-button-on")
          .parent().parent().parent().parent();
        // console.log(e.target);
        var GroupListPanel = $(".call-group-list-div");

        if (!GroupListPanel.is(e.target) && GroupListPanel.has(e.target).length === 0) {
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
          $(".user-list-items").
            addClass("user-list-items-normal")
            .removeClass("user-list-items");
          // 当前item背景高亮
          currentItem.addClass("user-list-items-hover");
          // eq(1) 取消按钮，eq(0)确定按钮
          $(userItem).find(".group-list-button").eq(1).off().on("click", function () {
            // TODO 还原之前的选择
            $(userItem).find(".privilege-ul").html(currentSelectedGroups);
            userMgr.restore();
          });
          $(userItem).find(".group-list-button").eq(0).off().on("click", function () {
            // 发请求在数据库里落实对库的更改
            var currentItem = this.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            var id = $(currentItem).attr("data-uid");

            var newSelectedIDLine = [];
            var add = "";
            var addArray = [];
            var removed = "";
            var removedArray = [];
            var i = 0;
            var j = 0;
            var indexArray_new = [];
            var indexArray_old = [];

            while ($(userItem).find("[data-flag=1]").eq(i).length) {
              newSelectedIDLine[i] = $(userItem).find(".group-list-ul").find("[data-flag=1]")
                .eq(i).attr("data-cid");
              i++;
            }

            // 获得新老数组中相同元素的位置

            i = 0;
            while (!!newSelectedIDLine[i]) {
              j = 0;
              while (!!selectedGroupIDSet[j]) {
                if (newSelectedIDLine[i] == selectedGroupIDSet[j]){
                  indexArray_new.push(i);
                  indexArray_old.push(j);
                }
                j++;
              }
              i++;
            }

            // 从原数组中剔除相同元素
            i = 0;
            // 数组.concat(newSelectedIDLine)，创建一个newSelectedIDLine的拷贝
            // 防止newSelectedIDLine的值受到更改
            addArray = addArray.concat(newSelectedIDLine);

            while (i < indexArray_new.length) {
              addArray.splice(indexArray_new[i]-i, 1);
              i++;
            }

            // 从新数组中剔除相同元素
            i = 0;

            removedArray = removedArray.concat(selectedGroupIDSet);

            while (i < indexArray_old.length) {
              removedArray.splice(indexArray_old[i]-i, 1);
              i++;
            }

            add = addArray.join(",");
            removed = removedArray.join(",");

            $.ajax({
              type: 'post',
              url: urls.setGroupListAccess(id, add, removed),
              dataType: 'text',
              jsonp: "jsoncallback",
              async: false,
              success: function (data) {
                var result = eval ("(" + data + ")");
                if (result.result == "success") {
                  alert("修改成功");
                } else {
                  if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                    authMsg.logout();
                  } else {
                    alert("操作失败 " + result.errorMessage);
                  }
                }
              },
              error: function () {
                alert("未连接数据库！");
              }
            });

            userMgr.restore();
          });
          // 给开关式按钮绑定点击隐藏目标库列表面板的事件
          $(".call-group-list-button-on").off().on("click", function () {
            userMgr.restore();
            // 点击开关式按钮隐藏目标库面板的时候会将user-list-items还原，
            // 而此时鼠标还在当前点击的user-list-items内，
            // 因此需要先对当前的条目进行一个mouseenter事件
            $(this.parentNode.parentNode).mouseenter();
          });

          // 选择目标库
          userMgr.selectingGroupList(userItem);

        }
      });
    },
    selectingGroupList: function (userItem) {

      $(".group-list-li").off().on("click", function () {
        var flag = $(this).attr("data-flag");
        var privilege_div = this.parentNode.parentNode.parentNode.parentNode.parentNode;
        var cid;
        var cName;
          if (flag == 1) {// 从选中到没选
            // 检查是否把所有库都取消选中了
            if ($(userItem).find("[data-flag=1]").size() == 1) {
              alert("每个账户应至少分配一个库");
              console.log($("[data-flag=1]").size());
            } else {
              $(this).attr("data-flag", "0");
              $(this).find(".group-list-img").attr("src", "../img/checkbox-off-alt.png").css("opacity", "0.5");
              $(this).find(".group-list-span").css("color", "rgba(123, 245, 254, 0.5)");
              // 可使用的库列表，双向绑定
              cid = $(this).attr("data-cid");
              cName = $(this).attr("title");//用title里的值，text()被转义过
              $(privilege_div).find("[data-tid=" + cid + "]").remove();
            }
          } else {// 从没选到选中
            $(this).attr("data-flag", "1");
            $(this).find(".group-list-img").attr("src", "../img/checkbox-on-alt.png").css("opacity", "1");
            $(this).find(".group-list-span").css("color", "rgba(123, 245, 254, 1)");
            // 可使用的库列表，双向绑定

            cid = $(this).attr("data-cid");
            cName = $(this).attr("title");//用title里的值，text()被转义过
            $(privilege_div).find(".privilege-ul")
              .append('<li class="privilege-li" data-tid="' + cid +
                '"><span class="privilege-span" ' +
                'style="color: rgb(123, 245, 254);">' + cName +
                '</span></li>');
          }

      });
    },
    restore: function () {
      $(".group-list-panel").hide();
      $(".user-list-items-normal")
        .addClass("user-list-items")
        .removeClass("user-list-items-hover")
        .removeClass("user-list-items-normal");
      $(".call-group-list-button").removeClass("call-group-list-button-on").hide();
      $(".item-li-img").hide();
      $(".user-list-span, .privilege-span").css("color", "rgba(123, 245, 254, 0.5)");
      $(document).off("click");

      userMgr.setEvent();
    },
    makeUserItem: function (res) {
      var html = '<div class="user-list-items">' +
        '<div class="item-li user-column">' +
          '<span class="user-list-span">' + res.name + '</span>' +
        '</div><!--' +
        '--><div class="item-li invisible item-divider"></div><!--' +
        '--><div class="item-li account-column">' +
          '<span class="user-list-span">' + res.account + '</span>' +
        '</div><!--' +
        '--><div class="item-li invisible item-divider"></div><!--' +
        '--><div class="item-li privilege-column"><!--' +
            '--><span class="user-list-span">管理员</span>' +
        '</div>' +
      '</div>';
      return html;
    },
    getAvailableGroupList: function (targets) {
      var htmlArray = [];
      var html = "";
      var nameEscape = "";

      try {
        var i = 0;
        while (targets[i]) {

          if (targets[i].name.length > 70) {
            nameEscape = targets[i].name.slice(0, 70) + "...";
          } else {
            nameEscape = targets[i].name;
          }

          htmlArray[i] = '<li class="privilege-li" data-tid="' + targets[i].id + '">' +
            '<span class="privilege-span">' + nameEscape + '</span>' +
          '</li>';
          i++;
        }
      } catch (err) {
        html = "空";
      }

      html = htmlArray.join("");

      return html;
    },
    makeGroupListPanel: function () {
      // var groupList = userMgr.makeGroupList();
      var html = '<div class="call-group-list-button unselectable">' +
        '<img class="group-list-button-img" src="../img/edit.png" /><!--' +
        '--><span class="group-list-button-span">编辑</span>' +
      '</div>' +
      '<div class="group-list-panel">' +
        '<div class="searchBox-div">' +
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
        '</div>' +
      '</div>';
      // $(".call-group-list-div").html(html);
      // $(".group-list-ul").html(groupList);
      return html;
    },
    makeGroupList: function(res){
      //构建目标库列表的html
      console.log(res);
      var nameEscape = "";
      var total = res.total;
      $(".group-list-ul").attr("data-total", total);
      var html = [];
      var i = 0;
      while(res.data[i]){
        if(res.data[i].name.length > 12) {
          nameEscape = res.data[i].name.slice(0, 12) + "...";
        } else {
          nameEscape = res.data[i].name;
        }
        html[i] = '<li class="group-list-li group-list-li-' + res.data[i].id +
          '" data-cid="' + res.data[i].id + '"' +
            ' title="' + res.data[i].name + '"><img class="group-list-img" ' +
            'src="../img/checkbox-off-alt.png" /><!--' +
            '--><span class="group-list-span">' + nameEscape + '</span>' +
          '</li>';
        i++;
      }
      html.join("");
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
    edit: function () {
      $("body").on("click", ".item-li-img-edit", function () {
        var id = $(this.parentNode.parentNode).attr("data-uid");
        window.location.href = href.accountSetting(id);
      });
    },
    delete: function () {
      $("body").off("click", ".item-li-img-delete").on("click", ".item-li-img-delete", function () {
        var id = $(this.parentNode.parentNode).attr("data-uid");
        var deletedAccount = $(this.parentNode.parentNode)
          .find(".account-column").find("span").text();

        var html = '<div id="alart-box"><span id="delete-warning-span">您确定要删除用户' +
          '<span id="deleted-account">' + deletedAccount +
          '</span>吗？<br /><br />该操作不可恢复！</span></div>';
        var json = {
          option: 1,
          cssID: "deleteConfirmBox",
          header: "删除用户",
          body: html
        };
        popup.makeit(json);
        $("#deleteConfirmBox").find(".popup-confirm-div").on("click", function () {
          $.ajax({
            type: 'post',
            url: urls.deleteUser(id),
            dataType: 'text',
            jsonp: "jsoncallback",
            async: false,
            success: function (data) {
              var result = eval ("(" + data + ")");
              if (result.result == "success") {
                alert("删除成功");
                window.location.reload(true);
              } else {
                if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                  authMsg.logout();
                } else {
                  alert("操作失败 " + result.errorMessage);
                }
              }
            },
            error: function () {
              alert("Connect Error!");
            }
          });
        });
      });
    },
    gotoAdduser: function () {
      $("#create-user").on("click", function () {
        window.location.href = href.addUser();
      });
    },
    gotoLog: function () {
      $("#check-record").on("click", function () {
        // 操作记录在这种可以从控制台调用的地方用record这个词比较好
        // 以防跟log混淆，虽然这里没什么log
        window.location.href = href.checkRecord();
      });
    }
  };

  var paginationEvent = {
    pagination : function(){
      var page = 0;
      $(".pages").off().on("click", function(){
        pagination.drawContent($(this).find("span").text());
        page = Number($(this).find("span").text()) - 1;
        userMgr.getAllUsersAjax(page, num, (Number(page) + 1));
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
          userMgr.getAllUsersAjax(page, num, (Number(page) + 1));
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
          userMgr.getAllUsersAjax(page, num, (Number(page) + 1));
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
          userMgr.getAllUsersAjax(page, num, (Number(page) + 1));
          window.scrollTo(0,0);
        } else {
          alert("输入不合法");
          $(".pagination").find("input").val("");
        }
      }
    }
  };

  $.extend(pagination, paginationEvent);

  userMgr.init();
}());
