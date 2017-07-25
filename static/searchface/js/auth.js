;
(function(){

  var auth = {
    ifLogin: function () {
      try {
        if (sessionStorage.length === 0) {
          alert("未登录或会话已过期，请重新登录");
          auth.logout();
        }
      } catch (err) {
        alert("系统繁忙，请重试");
        auth.logout();
      }
    },
    logout: function () {
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
      window.location.href = href.logout();
    }
  };

  auth.ifLogin();
}());
