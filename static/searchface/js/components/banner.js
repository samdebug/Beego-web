"use strict"

var pageDocName = ["surveillance", "history", "task", "target", "statistic", "search"];//文件名

var pageName = ["Monitor", "History", "Task", "Target", "Statistic", "Match"];//页面名

var suffixHtml = "";//文件后缀名

var Banner = '<ul>';

var Logo = '<li id="logo" class="logo-li logo-highlight"><div class="logo-li-div"><img id="logo-img" src="../img/logo.png"></div></li>';

var Navigation = '';

(function printNavigation (){

  var fileName = location.href.substr(location.href.lastIndexOf('/')+1);
  //fileName = fileName.replace(/.html/, "");
  var isCurrent = "";

  if (fileName == pageDocName[0]) {
     isCurrent = " current";
  }

  Navigation = Navigation + '<li class="logo-li' + isCurrent +'"><ul class="logo-li-ul">' +
        '<li class="navigation-li"><div class="logo-li-div"><img src="../img/' + pageDocName[0] + '.png" /></div></li>' +
        '<li class="navigation-li"><div class="logo-li-div logo-alpha-40"><a class="navigation-anchor" href="' + pageDocName[0] + suffixHtml + '">' + pageName[0] + '</a></div></li>' +
      '</ul></li>';

  pageName.splice(0, 1);
  pageDocName.splice(0, 1);

  if (pageName.length > 0){
    printNavigation();
  }
}());

Banner = Banner + Logo + Navigation + '</ul><ul class="account">';

var Avatar = '<li class="account-outside-base"><div class="account-outside-base">' +
    '<div id="account-li-div" onclick="goToAccount()"><ul>' +
      '<li class="account-li"><div><img id="user-avatar" src="../img/avatar.jpg"><!--user s avatar--></div></li>' +
      '<li class="account-li"><div id="div-username"><span id="username">Admin</span></div></li>' + //<!--最长4个中文字符-->
    '</ul></div>' +
  '</div></li>';

var Clock = '<div id="clock"><ul><li class="clock-li"><div class="clock-div"><img src="../img/clock.png" /></div></li>' +
  '<li class="clock-li"><div class="clock-div">' +
    '<span id="full-date"></span> ' +
    '<span id="now-time"></span>' +
  '</div></li><div>';

Banner = Banner + Avatar + '</ul>' + Clock;

document.getElementById("banner").innerHTML = Banner;

(function (){
  $(".navigation-anchor").on("mouseenter", function(){
    var logoList = this.parentNode.parentNode.parentNode.parentNode;
    $(logoList).addClass("actived");
  });
  $(".navigation-anchor").on("mouseleave", function(){
    var logoList = this.parentNode.parentNode.parentNode.parentNode;
    $(logoList).removeClass("actived");
  });
}());

function goToAccount(){
  window.location.href = "/account";
}
