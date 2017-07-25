;
(function(){
  "use strict";
  window.taskid = "";
  window.page_total = "0";
  window.fileName = "";
  window.realName = "";
  window.userAccount = "";
  var id = window.location.search;
  id = id.slice(4, id.length);
  $.ajax({
    type: 'get',
    url: urls.getUserDetail(id),
    dataType: 'text',
    jsonp: "jsoncallback",
    async: false,
    success: function (data) {
      var result = eval("(" + data + ")");
      console.log(data);
      window.realName = result.name;
      window.userAccount = result.account;
    },
    error: function () {
      alert("未能连接服务器。");
    }
  });

  var account = {
    init: function () {
      account.getUserName();
      account.getUserRealName();
      account.setPassword();
      account.breadcrumb();
    },
    getUserName: function () {
      var userAccount = window.userAccount;
      $(".content-username-span").text(userAccount);
    },
    getUserRealName: function () {
      var realName = window.realName;
      $(".content-userrealname-span").text(realName);
      account.setUserName();
    },
    setPopupParams: function () {
      var html = '<div class="change-password-li">' +
        '<div class="change-password-div"><div class="change-password-label">' +
          '<span class="change-password-span">新密码</span>' +
        '</div></div><div class="change-password-div">' +
          '<div><input class="input change-password-input"' +
          ' placeholder="密码长度不超过18位"' +
          ' type="password" name="change-password" /></div>' +
        '</div>' +
      '</div>' +
      '<div class="change-password-li change-password-hints">' +
        '<span class="change-password-hint-span">英文字母，数字或特殊符号</span>' +
      '</div>' +
      '<div class="change-password-li">' +
        '<div class="change-password-div"><div class="change-password-label">' +
          '<span class="change-password-span">确认密码</span>' +
        '</div></div><div class="change-password-div">' +
          '<div><input class="input change-password-input"' +
          ' placeholder="密码长度不超过18位"' +
          ' type="password" name="change-password" /></div>' +
        '</div>' +
        '<div class="change-password-li change-password-hints">' +
          '<span class="change-password-warning-span">' + '</span>' +
        '</div>' +
      '</div>';
      var json = {
        cssID : "change-password",
        option : 1,
        header : "修改密码",
        body : html
      };
      return json;
    },
    setPassword: function () {
      $(".change-password").off().one("click", function () {
        var json = account.setPopupParams();
        popup.makeit(json);
        $(".popup-confirm-div").off().on("click", function(){
          // var id = sessionStorage.id;
          // var pass0 = $(".change-password-input").eq(0).val();
          var pass1 = $(".change-password-input").eq(0).val();
          var pass2 = $(".change-password-input").eq(1).val();
          // if (pass0 === "" || pass0 === undefined){
          //   $(".change-password-warning-span").text("请输入原密码");
          //   return false;
          // }

          if (pass1 !== "" && pass2 !== "" && pass1 !== undefined && pass2 !== undefined) {

            if (pass1 === pass2) {
              $(".change-password-warning-span").text("");
              //sent an AJAX request to change password

              $.ajax({
                type: 'post',
                url: urls.resetPassword(id, pass1),
                dataType: 'text',
                jsonp: "jsoncallback",
                async: false,
                success: function (data) {
                  var result = eval("(" + data + ")");
                  if (result.result == "success") {
                    alert("修改成功！");
                    popup.close();
                  } else if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                    authMsg.logout();
                    return false;
                  } else {
                    alert ("修改失败 " + result.errorMessage);
                    return false;
                  }
                },
                error: function () {
                  alert("未能连接到服务器。请检查网络连接。");
                }
              });

            } else {
              $(".change-password-warning-span").text("两次输入的密码不一致");
            }
          } else {
            $(".change-password-warning-span").text("请输入新密码并且确认密码");
          }
        });
        account.setPassword();
      });
    },
    setUserName: function () {
      var textHTML = "";

      $(".change-name").on("click", function () {
        textHTML = $(".content-userrealname").html();

        var curUserName = $(".content-userrealname-span").text();
        var html = '<input id="content-realname-input" class="input"' +
         'type="text" name="realname" value="' + curUserName + '" />';

        $(".change-name").hide();
        $(".content-button-pair").css("display", "inline-block");

        $(".content-userrealname").html(html);

        account.confirmButton(textHTML);
        $("#content-realname-input").on("focus", function (e) {
          $("#content-realname-input").on("keydown", function (e) {
            if (e.keyCode == 13) {
              $(".confirm").click();
            }
          });
        }).on("blur", function () {
          $("#content-realname-input").off("keydown");
        });
      });

      $(".cancel").off().on("click", function(){
        $(".change-name").css("display", "inline-block");
        $(".content-button-pair").hide();
        $(".content-userrealname").html(textHTML);
      });
    },
    confirmButton: function (textHTML) {
      $(".confirm").one("click", function(){
        var newRealName = $("#content-realname-input").val();
        console.log(id)
        $.ajax({
          type: 'post',
          url: urls.setAccountInfo(id, newRealName),
          dataType: 'text',
          jsonp: "jsoncallback",
          async: false,
          success: function (data) {
            var result = eval("(" + data + ")");
            if (result.result == "success") {
              sessionStorage.realName = newRealName;
              $(".content-userrealname").html(textHTML);
              $(".content-userrealname-span").text(newRealName);
              account.confirmButton();
              $(".change-name").css("display", "inline-block");
              $(".content-button-pair").hide();
            } else {
              if (result.errorMessage == authMsg.invalid() || result.errorMessage == authMsg.timeout()) {
                authMsg.logout();
              } else {
                alert("修改失败：" + result.errorMessage);
              }
            }
          },
          error: function () {
            alert("未能连接到服务器。请检查网络连接。");
            account.confirmButton();
          }
        });
      });
    },
    breadcrumb: function () {
      $(".breadcrumb-span").eq(0).on("click", function () {
        window.location.href = href.gotoUserManagement();
      });

      $(".breadcrumb-span").eq(1).on("click", function () {
        window.location.reload(true);
      });
    }
  };

  account.init();
}());
