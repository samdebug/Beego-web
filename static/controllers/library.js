angular.module('libraryApp', []).controller('libraryCtrl', function($scope, $http) {

    console.log($scope);

    $scope.show_table = true;
    $scope.next_step = false;

    $scope.librarys = [{"name":"目标库1222", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"},{"name":"目标库2", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"}];
    /*$http.get("/library/load").success(function(data) {
        console.log(data);
        $scope.librarys = [{"name":"目标库1", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"},{"name":"目标库2", "id":"1","role":"黑名单","aim_count":"10","pic_count":"10","user":"sam","created":"2017年2月21号12:23:22"}];
    });*/

    $scope.show_table = function (strs) {
        console.log(strs);
        if (strs == "yes") {
            return $scope.show_table = true;
        }else{
            return $scope.show_table = false;
        }
    }
    /*$(function () {
        $('#hover, #striped, #condensed').click(function () {
            var classes = 'table';
  
            if ($('#hover').prop('checked')) {
                classes += ' table-hover';
            }
            if ($('#condensed').prop('checked')) {
                classes += ' table-condensed';
            }
            $('#table-style').bootstrapTable('destroy')
                .bootstrapTable({
                    classes: classes,
                    striped: $('#striped').prop('checked')
                });
        });
    });
  
    function rowStyle(row, index) {
        var classes = ['active', 'success', 'info', 'warning', 'danger'];
  
        if (index % 2 === 0 && index / 2 < classes.length) {
            return {
                classes: classes[index / 2]
            };
        }
        return {};
    }*/
});


