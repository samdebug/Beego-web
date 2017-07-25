$("#login-form").css({
	"marginTop": ($(window).height() - 746)/2 + "px"
});

$("#login-form").submit(function (event) {
  event.preventDefault();
  var $form = $(this);
  var username = $form.find("input[name='username']").val();
  var password = $form.find("input[name='password']").val();
  $.ajax({
    url: urls.login(),
    data: {"username":username,"password":password},
    type: 'post',
    dataType: 'text',
		jsonp: "jsoncallback",
    success: function (data) {},
    error: function () {
      console.log("异常！");
    }
  }).done(function (data, status, jqXHR) {
  	var response = eval("(" + data + ")");
    var result = response.result;
    console.log(data);
    var userInfo = response.data;
    if(result === 'success'){
      for(var key in userInfo){
        sessionStorage.setItem(key,userInfo[key]);
      }
			console.log(sessionStorage);
			// example
			// {"username":"admin",
			// 	"realName":"??",
			// 	"gender":"female",
			// 	"jobInfo":"admin",
			// 	"avatar":"",
			// 	"registerDate":"2015-09-18 12:00:00",
			// 	"lastActiveDate":"2016-03-03 11:17:21",
			// 	"permission":"?????",
			// 	"isLocked":"false",
			// 	"pwdStrength":"3"}
    window.location.href = href.login();
    }else{
      alert("密码错误");
    }
	});
});
