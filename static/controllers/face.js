angular.module('faceApp', []).controller('faceCtrl', function($scope, $http) {

    console.log($scope);
    $(function(){
        /*var sayCheese = new SayCheese('#webcam', { audio: false });
        sayCheese.on('start', function() {
          console.log("start cam");
        });
        sayCheese.start();*/
        $('#scroller-1').slimScroll({
            height: '150px'
        });

        $('#scroller').slimScroll({
            height: '758px'
        });

        var pre_width = $("#monitor").width();
        vxgplayer('vxg_media_player1').size(pre_width - 2, 537);

        $("#monitor").resize(function(){
            var width = $("#monitor").width();
            vxgplayer('vxg_media_player1').size(width - 2, 537);
        });
    });
});


