function drawCompareCard (res){

  var vip = eval("(" + res.vip + ")");
  var appear = eval("(" + res.appear + ")")
  var similar = eval("(" + res.similar + ")");
  var escapeName = "";
  // console.log(similar);
  // console.log(vip.name);
  if(vip.name){
    if (vip.name.length > 9){
      escapeName = vip.name.slice(0, 9) + "...";
    } else {
      escapeName = vip.name;
    }
  }


  var rate = (0.1 * Math.round(Number(vip.rate) * 1000)).toFixed(1);

  //var headerInfo = [res.camera,
  //res.time,
  //majorResult.name];

  var card = '<div class="compareCard">' +
    '<div class="compareCardBody">' +
      '<span class="dateInfo">' + res.time + '</span>' +
      '<span class="cameraInfo">' + res.camera + '</span>' +
      '<ul class="ul-compareCard">' +
        '<li class="appearInfo compareCard-li">' +
          '<ul>' +
            '<li class="appearTitle">' +
              '<ul><li class="appearTitle-li"><div class="appearTitle-div"><img src="../img/appearimg.png" /></div></li>' +
              '<li class="appearTitle-li"><div class="appearTitle-div"><span class="appearTitle-span">Captured</span></div></li></ul>' +
            '</li>' +
            '<li class="appearInfo-li name-and-age"><span class="appearInfo-span hide">' + appear.gender + '</span></li>' +//'<span class="spanDivider">---</span>' + appear.age +
            '<li class="appearInfo-li"><span class="appearInfo-span hide">' + appear.info + '</span></li>' +
            '<li class="appearInfo-li"><span class="appearInfo-span hide">' + appear.clothes + '</span></li>' +
            '<li class="appearInfo-li"><span class="appearInfo-span hide">' + appear.feature + '</span></li>' +
          '</ul>' +
        '</li>' +

        '<li class="appearImg compareCard-li"><div class="appearImg-div"><img class="appearImg-img" src="' + pathPrefix + appear.pic + '" /></div></li>' +
        '<li class="separator compareCard-li"><div class="separator-div"><img src="../img/separator.png"></div></li>' +
        '<li class="vipImg compareCard-li">';

        if (rate > 92){
          card = card + '<div class="vipImg-div vipImg-div-should-be-red"><img class="vipImg-img" onload="autoResize(this)" src="' + pathPrefix + vip.pic + '" />' +
          '<span class="percentage">' + rate + '%</span></div></li>';
        } else {
          card = card + '<div class="vipImg-div"><img class="vipImg-img" onload="autoResize(this)" src="' + pathPrefix + vip.pic + '" />' +
          '<span class="percentage">' + rate + '%</span></div></li>';
        }


        card = card +
        '<li class="vipInfo compareCard-li">' +
          '<ul>' +
            '<li class="vipTitle"><ul><li class="vipTitle-li"><div class="vipTitle-div"><img src="../img/vipimg.png" /></div></li>' +
            '<li class="vipTitle-li"><div class="vipTitle-div"><span class="vipTitle-span">Target</span></div></li></ul></li>' +

            '<li class="vipInfo-li name-and-age"><span class="vipInfo-span" title="vip.name">' + /*vip.name*/escapeName + '</span></li>' +//+ '<span class="spanDivider">---</span>' + vip.age
            '<li class="vipInfo-li"><span class="vipInfo-span hide">' + vip.identifyid +  '</span></li>' +
            '<li class="vipInfo-li"><span class="vipInfo-span hide">' + vip.occupation +  '</span></li>' +
            '<li class="vipInfo-li"><span class="vipInfo-span hide">' + vip.info +  '</span></li>' +
          '</ul>' +
        '</li>' +
      '</ul>' +
    '</div><!--compare card body-->';
  var card_footer = '</div><!--compare card-->';

  var blacklist_header = '  <div class="blacklist">' +
      '<ul class="blacklistTitle">' +
        '<li class="blacklistTitle-li"><div><img src="../img/vipimg.png" /></div></li>' +
        '<li class="blacklistTitle-li"><div><span class="blacklistTitle-text">Similar</span></div></li>' +
      '</ul>' +
      '<div class="divider"></div>' +

      '<div class="blacklistBody">' +
        '<ul>';

  var blacklist_body = '';
  var i = 0;
  while(i < 4 && similar[i]){

    var subRate = (0.1 * Math.round(Number(similar[i].rate) * 1000)).toFixed(1);
    blacklist_body = blacklist_body +
            '<li class="blacklist-li">' +
              '<ul>';

              if (subRate > 92){
                blacklist_body = blacklist_body +
                '<li><div class="blacklist-div blacklist-div-should-be-red"><div class="inside-blacklist">' +
                  '<img class="blacklist-img" onload="autoResize(this)" src="' + pathPrefix + similar[i].pic + '" />' +
                  '</div>' +
                  '<span class="subPercentage">' + subRate + '%</span>' +
                '</div></li>';
              } else {
                blacklist_body = blacklist_body +
                '<li><div class="blacklist-div"><div class="inside-blacklist">' +
                  '<img class="blacklist-img" onload="autoResize(this)" src="' + pathPrefix + similar[i].pic + '" />' +
                  '</div>' +
                  '<span class="subPercentage">' + subRate + '%</span>' +
                '</div></li>';
              }
    if (similar[i].name){
      if(similar[i].name.length > 9){
        var nameEscape = similar[i].name.slice(0,9) + "...";
      } else {
        var nameEscape = similar[i].name;
      }
    } else {
      var nameEscape = similar[i].name;
    }
    blacklist_body = blacklist_body +
                '<li><div class="div-blacklistInfo"><span class="blacklistInfo" title="' + similar[i].name + '">' + nameEscape + '</span></div></li>' +
                '<li><div class="div-blacklistInfo"><span class="blacklistInfo hide">' + similar[i].age + '</span></div></li>' +
              '</ul>' +
            '</li>';
    i++;
  }

  var blacklist_footer = '</ul>' +
  '</div><!--blacklist body-->' +
  '</div><!--blacklist-->';

  var blacklist = blacklist_header + blacklist_body + blacklist_footer;

    if(i === 0){
      return card + card_footer;
    } else {
      return card + blacklist + card_footer;
    }
}

function upload_data (str){
  var i = 0;
  var appear = [];
  var vip = [];
  var camera;

  while(str[i]){
    str[i] = eval("(" + str[i] + ")");
    appear[i] = eval("(" + str[i].appear + ")");
    vip[i] = eval("(" + str[i].vip + ")")

    $(".dateInfo").eq(i).html(str[i].time.substr(11, 8) + " | " + str[i].camera);
    $(".appearImg-img").eq(i).attr("src", "" + appear[i].pic);
    $(".vipImg-img").eq(i).attr("src", "" + vip[i].pic);

    $(".appearInfo-li").eq(4 * i).html("<span>" + appear[i].gender + "</span>");//+ " | " + appear[i].age
    $(".appearInfo-li").eq(4 * i + 1).text(appear[i].info);
    $(".appearInfo-li").eq(4 * i + 2).text(appear[i].feature + "info");
    $(".appearInfo-li").eq(4 * i + 3).text(appear[i].clothes + "info");

    $(".vipInfo-li").eq(4 * i).html("<span>" + vip[i].gender + "</span>");//+ " | " +  vip[i].age
    $(".vipInfo-li").eq(4 * i + 1).text(vip[i].name);
    $(".vipInfo-li").eq(4 * i + 2).text(vip[i].identifyid);
    $(".vipInfo-li").eq(4 * i + 3).text(vip[i].occupation);//vip[i].occupation

    var rate = vip[i].rate;
    rate = Number(rate);
    rate = Math.round(rate * 1000);
    rate = (rate/10).toFixed(1);
    $(".percentage").eq(i).text(rate + "%");
    $(".mask").eq(i).find("span").text(rate + "%");
    // 最相似的人
    if (str[i].similar.length !== 2){
      $(".blacklist").eq(i).css("display", "block");
      var m = 0;
      var similar = eval("(" + str[i].similar + ")");

      var blacklist_body = "";
      while (m < 4 && similar[m]){
        blacklist_body = blacklist_body +
              '<li class="blacklist-li">' +
                '<ul>' +
                  '<li><div class="blacklist-div">' +
                    '<img class="blacklist-img" src="../img/avatar.jpg" />' +
                    '<div class="div-subPercentage"><span class="subPercentage">--.--%</span></div>' +
                  '</div></li>' +
                  '<li><div class="div-blacklistInfo"><span class="blacklistInfo">--</span></div></li>' +
                  '<li><div class="div-blacklistInfo"><span class="blacklistInfo">--</span></div></li>' +
                '</ul>' +
              '</li>';
        m++;
      }
      $(".blacklistBody").eq(i).find("ul").html(blacklist_body);
      m = 0;
      while (m < 4 && similar[m]){
        console.log(similar[m].pic);
        // $(".blacklist-li").eq(i).find(".storage-id-and-gender").eq(m).text(similar[m].identifyid + ".." + similar[m].gender);
        // $(".blacklist-li").eq(i).find(".storage-occupation").eq(m).text(similar[m].occupation);
        // $(".blacklist-li").eq(i).find(".storage-info").eq(m).text(similar[m].info);
        $(".blacklistBody").eq(i).find(".blacklist-img").eq(m).attr("src", "" + similar[m].pic);
        var sub_rate = Number(similar[m].rate);
        sub_rate = Math.round(sub_rate * 100);
        $(".blacklistBody").eq(i).find(".subPercentage").eq(m).text(sub_rate + "%");
        $(".blacklistBody").eq(i).find(".blacklistInfo").eq(2 * m).text(similar[m].name);
        $(".blacklistBody").eq(i).find(".blacklistInfo").eq(2 * m + 1).text(similar[m].age);
        // $(".cands_ul").eq(i).find(".mask_sub").eq(m).find("span").text(sub_rate + "%");
        var percent = sub_rate;
        m++;
      }
    }
    i++;
  }
}
