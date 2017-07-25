;(function(){
  "use strict";
  var banner = {
    makePageArray: function(){
      var pageTitle = ["surveillance", "history", "tasks", "clique", "statistic", "match"];
      return pageTitle;
    },
    makeIconArray: function(){
      var navIcon = ["surveillance", "history", "task", "target", "statistic", "match"];
      return navIcon;
    },
    makeBanner: function(){
      var navIcon = banner.makeIconArray();
      var pageTitle = banner.makePageArray();
      var Clock = '<div id="clock"><ul><li class="clock-li"><div class="clock-div"><img src="../img/clock.png" /></div></li>' +
        '<li class="clock-li"><div class="clock-div clock-text">' +
          '<span id="full-date"></span> ' +
          '<span id="now-time"></span>' +
        '</div></li></div>';
      var nav = ["Monitor", "History", "Task", "Target", "Statistic", "Match"];
      var bannerItem = [];
      var i = 0;
      while (nav[i]){
        bannerItem[i] = '<li class="banner-li" id="' +
                        pageTitle[i] + '"><img src="../img/' +
                        navIcon[i] + '.png"><span>' + nav[i] + '</span></li>';
        i++;
      }
      var bannerHTML = '<div id="banner-div"><ul class="left">' +
                        bannerItem.slice(0,3).join('') + '</ul><ul class="right">' +
                        bannerItem.slice(3,6).join('') + '</ul></div>' +
                        Clock;
      return bannerHTML;
    },
    render: function(){
      var Ban = banner.makeBanner();
      $("#banner").html(Ban);
      banner.highlightCurrent();
    },
    setEvent: function(){
      $(".banner-li").on("click", function(){
        var dst = $(this).attr("id");
        window.location.href = "../html/" + dst + ".html";
      });
      $(".banner-li").on("mouseenter", function(){
        if(!$(this).hasClass("current")){
          var iconHover = $(this).find("img").attr("src");
          iconHover = iconHover.slice(iconHover.lastIndexOf("/") + 1).replace(".png", "-hover.png");
          $(this).addClass("on");
          $(this).find("img").attr("src", "../img/" + iconHover);
        }
      });
      $(".banner-li").on("mouseleave", function(){
        if(!$(this).hasClass("current")){
          var iconName = $(this).find("img").attr("src");
          iconName = iconName.slice(iconName.lastIndexOf("/") + 1).replace("-hover.png", ".png");
          $(this).removeClass("on");
          $(this).find("img").attr("src", "../img/" + iconName);
        }
      });
      $("#statistic").off("click");
      $("#match").off("click");
    },
    highlightCurrent: function(){
      var pageTitle = banner.makePageArray();
      var navIcon = banner.makeIconArray();
      var current = window.location.href;
      current = current.slice(current.lastIndexOf("/") + 1).replace(".html", "");
      var i = 0;
      while(pageTitle[i]){
        if (pageTitle[i] == current){
          $(".banner-li").eq(i).addClass("current");
          $(".banner-li").eq(i).find("img").attr("src", "../img/" + navIcon[i] + "-hover.png");
        }
        i++;
      }
      banner.setEvent();
    }
  };
  banner.render();
})();
