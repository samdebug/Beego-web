var pagination = {
  drawContent : function(num){
    num = Number(num);
    var i = 0;
    window.page_element = "";
    if (page_total > 8){
      if (num >= 6){//num_min = 6
        if (page_total < 11){
          if (num <= page_total - 3){
            i = 0;
            while(i < page_total && i < 8){
              page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i + num - 4) + '</span></div></li>';
              i++;
            }
          } else {
            i = 0;
            while(i < page_total && i < 8){
              page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i + page_total - 7) + '</span></div></li>';
              i++;
            }
          }
        } else {
          if (num < page_total - 3){
            // console.log(num + "第6页往后，总页数大于8页")
            i = 0;
            while(i < page_total && i < 8){
              page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i + num - 4) + '</span></div></li>';
              i++;
            }
          } else {
            i = 0;
            while(i < page_total && i < 8){
              page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i + page_total - 7) + '</span></div></li>';
              i++;
            }
          }
        }
      } else {
        i = 0;
        while(i < 8){
          page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i+1) + '</span></div></li>';
          i++;
        }
      }
    } else {
      i = 0;
      while(i < page_total && i < 8){
        page_element = page_element + '<li class="pages"><div class="pages-div"><span class="pages-span">' + (i+1) + '</span></div></li>';
        i++;
      }
    }
    var html = '<li class="lastPage"><div class="lastPage-div"><span class="lastPage-span">上一页</span></div></li>';
          // + '<li class="pages pageCurrent"><div><span>1</span></div></li>';
    html = html + page_element + '<li class="nextPage"><div class="nextPage-div"><span class="nextPage-span">下一页</span></div></li>' +
          '<li class="total"><div class="total-div"><span class="total-span">共 ' + page_total + ' 页</span></div></li>' +
          '<li class="toPage"><div class="toPage-div"><span class="toPage-span">跳转到 </span></div></li>' +
          '<li class="li-pageInput"><div class="pageInput-div"><input id="pageInput" type="text" /></div></li>' +
          '<li class="toPage"><div class="toPage-div"><span class="toPage-span"> 页</span></div></li>' +
          '<li class="pageSubmit"><button class="paginationButton"><span class="paginationButton-span">确定</span></button></li>';

    // 重绘
    $(".pagination").find("ul").html(html);
    //加亮
    var j = 0;
    while (j < 10){
      if ($(".pages").eq(j).find("span").text() == num){
        $(".pages").eq(j).addClass("pageCurrent");
      }
      j++;
    }
    $(".lastPage-div, .nextPage-div").on("mouseenter", function(){
      $(this).css("opacity", "1");
    }).on("mouseleave", function(){
      $(this).css("opacity", "0.5");
    });
    pagination.pagination();
  },
  pagination : null
};
