function tabToggle(obj){
	$(".tabs-div")
			.removeClass("tabs-div-1-actived")
			.removeClass("tabs-div-2-actived")
			.removeClass("tabs-div-3-actived")
			.removeClass("tabs-div-4-actived");
	var index = (Number($(".tabs-div").index(obj.parentNode)) + 1)
	$(obj.parentNode).addClass("tabs-div-" + index + "-actived");

	$(".tab-pane").hide();
	$(".tab-pane").eq(index - 1).show();
}