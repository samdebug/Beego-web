var CameraList = {
  MakeIt : function(element){
    element
      .html('<div class="CameraSelect stSwitch"' +
       'data-pic="../img/camera-list.png"'+
       'data-buttonValue="Select Camera"' +
       'data-defaultState="off"></div>' +
       '<div id="MakeCameraList"></div>')
      .on("click", function(){
        $("#MakeCameraList").show().css("bottom", "34px");
      });

    var cameraListHTML = '<div class="camL-groove"></div>' +
       '<div class="camL-body"><ul class="camL-body-ul">';

    var url = urls.getCameraList();

    $.ajax({
      type: 'get',
      url: url,
      dataType: 'text',
      jsonp: "jsoncallback",
      success: function (data) {
        var response = eval("(" + data + ")");
        var cameraLIST = '';
        var i = 0;
        while(response.data[i]){
          cameraLIST = cameraLIST +
          '<li class="camL-Item camL-list-' + response.data[i].id + '" data-id="'+ response.data[i].id + '"' +
          'data-videoServerIP="' + response.data[i].videoserverip + '" data-videoServerPort="' + response.data[i].videoserverport + '"><ul>' +
            '<li class="camL-Item-li"><img class="camL-Item-img" src="../img/not-checked.png" /></li>' +
            '<li class="camL-Item-li';

            // enable it when @WangJin is ready

            // if(response.data[i].state != "正常"){
            //   cameraLIST = cameraLIST + " fail";
            // }
            cameraLIST = cameraLIST + ' camL-ItemText"><span class="camL-Item-span">' + response.data[i].address + '</span></li>' +
          '</ul></li>';
          i++;
        }
        $(".camL-body-ul").html(cameraLIST);
      },
      error: function(){
        console.log("API disconnected.");
      }
    });

    cameraListHTML = cameraListHTML + '</ul></div>' +
      '<footer class="camL-footer">' +
      '<ul class="camL-footer-ul"><li class="camL-footer-li"><div class="camL-Cancel stButton" data-buttonValue="Cancel"></div></li>' +
      '<li class="camL-footer-li"><div class="camL-Confirm stButton" data-buttonValue="Submit"></div></li></ul>' +
      '</footer>';
      // console.log(camLiqueListHTML)
    $("#MakeCameraList").html(cameraListHTML);
  }
};
