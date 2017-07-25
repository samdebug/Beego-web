var title = "人脸检索";

$("title").text(title);

var host = "";
var prefix = "";
var suffix = "";
var urls = {
  login: function () {
    return host + "/login/submit?";
  },
  getCompareResult: function () {
    // return "../data/similarlist-50.json";
    return host + "/imgsearch/search/face";
  },
  getFiltratedResult: function (tid, page, number, start, stop, gender) {
    var genderFlag;
    var ageFlag;
    var flagStr = [];
    if (start === "" || stop === "") {
      ageFlag = 0;
    } else {
      ageFlag = 1;
    }

    if (gender === "") {
      genderFlag = 0;
    } else {
      genderFlag = 1;
    }

    flagStr = ageFlag.toString() + genderFlag.toString();

    if (flagStr == "00") {
      return host + "/imgsearch/search/face/page?taskid=" +
        tid + "&page=" + page + "&number=" + number;
    } else if (flagStr == "01") {
      return host + "/imgsearch/search/face/page?taskid=" +
        tid + "&page=" + page + "&number=" + number + "&gender=" + gender;
    } else if (flagStr == "10") {
      return host + "/imgsearch/search/face/page?taskid=" +
        tid + "&page=" + page + "&number=" + number + "&start=" + start +
        "&stop=" + stop;
    } else {
      return host + "/imgsearch/search/face/page?taskid=" +
        tid + "&page=" + page + "&number=" + number + "&start=" + start +
        "&stop=" + stop + "&gender=" + gender;
    }
  },
  getExportURL: function (tid, idSet_str, imgName) {
    return host + "/imgsearch/export/face?taskid=" + tid + "&vips=" + idSet_str + "&imagename=" + imgName;
  },
  getGroupList: function () {
    return host + "/vipbase/search/imgclique";
  },
  getPathToZip: function (url) {
    return host + "/" + url;
  },
  getPaginationPath: function (tid, page, number) {
    return host + "/imgsearch/search/face/page?taskid=" + tid + "&page=" + page + "&number=" + number;
  },
  setAccountInfo: function (id, name) {
    return host + "/manager/modify?id=" + id + "&name=" + name;
  },
  setPassword: function (id, oldPassword, newPassword) {
    return host + "/manager/modify/password?id=" + id +
    "&oldpd=" + oldPassword + "&newpd=" + newPassword;
  },
  getAllUsers: function (page, num) {
    return host + "/manager/all?page=" + page + "&number=" + num;
  },
  getVerifyResult: function () {
    return host + "/imgsearch/compare?";
  },
  getUserDetail: function (id) {
    return host + "/manager/detail?id=" + id;
  },
  setGroupListAccess: function (id, add, removed) {
    return host + "/manager/modify/privilege?id=" +
      id + "&newtarget=" + add + "&deletetarget=" + removed;
  },
  deleteUser: function (id) {
    return host + "/manager/delete?id=" + id;
  },
  resetPassword: function (id, passwd) {
    return host + "/manager/reset/password?id=" + id + "&newpd=" + passwd;
  },
  getRecords: function (account, page, number, condition) {
    return host + "/manager/search/log/condition?option=" +
      account + "&page=" + page + "&number=" + number + "&condition=" + condition;
  },
  getQuota: function () {
    return host + "/manager/user/count?";
  },
  createGroupList: function (cName, cRemark, createdBy) {
    return host + "/vipbase/add/imgclique?cliquename=" +
      cName + "&remark=" + cRemark + "&username=" + createdBy;
  },
  checkDuplication: function (cName) {
    return host + "/vipbase/search/imgclique/check?cliquename=" + cName;
  },
  addUser: function (userAccount, password, name, targets) {
    return host + "/manager/create?account=" +
      userAccount + "&password=" + password + "&name=" +
      name + "&targets=" + targets;
  },
  logout: function () {
    return host + "/logout?";
  }
};

var href = {
  login: function () {
    return prefix + "/match" + suffix;
  },
  addUser: function () {
    return prefix + "/adduser" + suffix;
  },
  accountSetting: function (id) {
    return prefix + "/accountSetting" + suffix + "?id=" + id;
  },
  checkRecord: function () {
    return prefix + "/records" + suffix;
  },
  gotoUserManagement: function () {
    return prefix + "/userManagement" + suffix;
  },
  logout: function () {
    return prefix + "/login" + suffix;
  }
};

var popup = {
  makeit: function (json) {
    var html = popup.makeHTMLelement(json);
    $("body").append(html);
    popup.cancel();
  },
  makeHTMLelement: function (json) {
    var mask = '<div id="mask"></div>';
    var html = mask + '<div id="' + json.cssID + '" class="unselectable popup-container">' +
      '<div id="popup-container"><div id="popup-header">' +
        '<span id="popup-header-span">' + json.header + '</span>' +
        '<img src="../img/close.png" id="popup-close" />' +
      '</div>' +
      '<div id="popup-body">' + json.body + '</div>' +
      '<div id="popup-footer">' +
        '<ul id="popup-footer-ul">';
    if (json.option == 1) {
      //"json.option == 1" refers to we offer an option to users
      //so they can choose yes or no to a certain operation
      html = html + '<li class="popup-footer-li">';
    } else {
      //"json.option == 0" means that it is just a message, the only
      // thing require users to do is click yes button
      html = html + '<li class="popup-footer-li hide">';
    }
    html = html + '<div class="popup-footer-div popup-cancel-div">' +
              '<span class="popup-footer-span popup-cancel-span">取消</span>' +
            '</div>' +
          '</li>' +
          '<li class="popup-footer-li">' +
            '<div class="popup-footer-div popup-confirm-div">' +
              '<span class="popup-footer-span popup-confirm-span">确定</span>' +
            '</div>' +
          '</li>' +
        '</ul>' +
      '</div></div>' +
    '</div>';
    return html;
  },
  cancel: function () {
    $(".popup-cancel-div, #popup-close, #mask").off().on("click", function () {
      popup.close();
    });
  },
  close: function () {
    $("#mask").remove();
    $(".popup-container").remove();
  }
};

var authMsg = {
  invalid: function () {
    return "session invalidate";
  },
  timeout: function () {
    return "no login";
  },
  logout: function () {
    alert("未登录或会话已过期，请重新登录");
    auth.logout();
  }
};


// var zooming = {
//   // 这个方法做自适应还是比较low的，有机会的话还是要从样式上来解决自适应的问题
//   init: function () {
//     $(window).resize(function () {
//       zooming.getZoomParam();
//     });
//   },
//   getZoomParam: function () {
//     // 1900 是当前页面显示出来的高度
//     // 宽度其实无所谓的，这里随便赋了个比较小的值
//     var windowWidthScale = Number($(window).width()) / 1900;
//     var windowHeightScale = Number($(window).height()) / 480;
//     // console.log(typeof(windowWidthScale));
//     // console.log(typeof(windowHeightScale));
//     if (windowWidthScale > windowHeightScale) {
//       zooming.zooming(windowHeightScale);
//     } else {
//       zooming.zooming(windowWidthScale);
//     }
//   },
//   zooming: function (scale) {
//     scale = Number(scale);
//     // 0.715是怎么来的？
//     // 1366 / 1920 = 0.719，然后随便取一个比较近似的值
//     // 0.72是实际测试出来的一个比例，在该比例下页面不会变形的太严重
// 	  if (scale < 0.715) {
//       $("html").css("zoom", "0.72");
//     } else if (scale >= 0.715 && scale < 0.75) {
//       $("html").css("zoom", "0.72");
//     } else if (scale >= 0.75 && scale < 0.833333) {
//       $("html").css("zoom", "0.75")
//     } else if (scale >= 0.833333 && scale < 1) {
//       $("html").css("zoom", "0.833333");
//     } else if (scale >= 1) {
//       $("html").css("zoom", "1");
//     }
//   }
// }
// zooming.init();
// window.onload = zooming.getZoomParam();
// 不要瞎逼搞
