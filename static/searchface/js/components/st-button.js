$().ready(function(){
  $(".stButton").html(function(){
    if ($(this).attr("data-pic")){
      return '<ul>' +
            '<li><img src="' + $(this).attr("data-pic") + '" /></li>' +
            '<li><span>' + $(this).attr("data-buttonValue") + '</span></li>' +
          '</ul>';
    } else {
      return '<ul>' +
            '<li><span>' + $(this).attr("data-buttonValue") + '</span></li>' +
          '</ul>';
    }
  });

  $(".stSwitch")
    .html(function(){
      if ($(this).attr("data-pic")){
        return '<ul>' +
              '<li><img src="' + $(this).attr("data-pic") + '" /></li>' +
              '<li><span>' + $(this).attr("data-buttonValue") + '</span></li>' +
            '</ul>';
      } else {
        return '<ul>' +
              '<li><span>' + $(this).attr("data-buttonValue") + '</span></li>' +
            '</ul>';
      }
    })
    .on("click", function(){
      if ($(this).attr("data-defaultState") == "off"){
        $(this).addClass("stSwitchOn");
        $(this).attr("data-defaultState", "on");
      } else if ($(this).attr("data-defaultState") == "on") {
        $(this).removeClass("stSwitchOn");
        $(this).attr("data-defaultState", "off");
      } else {
        $(this)
          .on("mousedown", function(){
            $(this).addClass("stSwitchOn");
            $(this).off("mouseleave").on("mouseleave", function(){
              $(this).removeClass("stSwitchOn");
            });
          })
          .on("mouseup", function(){
            $(this).removeClass("stSwitchOn");
          });
      }
    });
    // .on("mousedown", function(){
    //   $(this).addClass("stSwitchOn");
    //   $(this).off("mouseleave").on("mouseleave", function(){
    //     $(this).removeClass("stSwitchOn");
    //   });
    // })
    // .on("mouseup", function(){
    //   $(this).removeClass("stSwitchOn");
    // });
});
