$(function(){
    var ul = document.getElementById("sidebar");
    var list = ul.getElementsByTagName("li");  

    /*for(var j=0;j<list.length;j++){  
        list[j].onclick = (function(num){  
            return function(){  
                if ( num == 5 || num == 6) {
                    layer.msg("正在建设中,敬请期待....");
                } 
            };  
        })(j);  
    }*/ 

    /*事件委托*/
    var ul = document.getElementById("sidebar");
    ul.addEventListener('click',function(e){
        if (e.target.innerText == ' 历史记录' || e.target.innerText == ' 数据统计'){
            layer.msg("正在建设中,敬请期待....");
        }
    })
   
    /*$("#sidebar").on('click',function(e){
        console.log(e);
        if (e.currentTarget.children.toLowerCase() == 'li'){
            console.log(e); 
        }
    })*/

    /*$('#sidebar li a').click(function(){
        /*console.log($(this).context.innerText);
        $('#sidebar li').removeClass('active');
        $(this).parent().addClass('active');
        var index = $(this).context.innerText;

        if (index == " 历史记录" || index == " 人脸检索" || index == " 数据统计") {
            layer.msg("正在建设中,敬请期待....");
        }
    })*/

    /*$.ajax({
        url: "http://192.168.2.82:8005/getUMsg/827083",
        dataType: 'json',
        method: 'GET',
        success: function(data) {
            console.log(data);
        },
        error: function(xhr) {
            console.log(xhr);
        }
    })*/
})


