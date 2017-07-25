var int=self.setInterval("Require_date()",100);
function Require_date()
  {
    var raw_time = new Date();
    raw_time = raw_time.toString();
    var week = raw_time.substr(0, 3);

    switch (week){
      case "Mon":
      week = "星期一";
      break;
      case "Tue":
      week = "星期二";
      break;
      case "Wed":
      week = "星期三";
      break;
      case "Thu":
      week = "星期四";
      break;
      case "Fri":
      week = "星期五";
      break;
      case "Sat":
      week = "星期六";
      break;
      case "Sun":
      week = "星期日";
      break;
    }

    var month = raw_time.substr(4, 3);

    //var month_set = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    var year = raw_time.substr(11, 4);
    var cur_time = raw_time.substr(16, 8);
    var day;
    if (raw_time.substr(8, 1) == "0") {
      day = raw_time.substr(9, 1);
    } else {
      day = raw_time.substr(8, 2);
    }

    document.getElementById("full-date").innerHTML = month + " " + day + " " + year + "   ";
    // document.getElementsByClassName("top_week")[0].innerHTML = week;
    document.getElementById("now-time").innerHTML = cur_time;
  }
