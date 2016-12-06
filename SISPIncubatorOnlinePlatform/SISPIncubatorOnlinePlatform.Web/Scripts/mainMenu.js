$(document).ready(function(){
	$(".content").after("<div class='mainMenu'><div class='mainMenuBox'><a class='mainMenuLink indexMenuLink' href='#'><span>首页</span></a><a class='mainMenuLink myMenuLink' href='#'><span>我的</span></a></div><div class='mainMenuMore'><span class='rightBtn'>〉</span><span class='leftBtn hide'>〈</span></div></div>");
	$(".mainMenuMore").click(function(){
		var div = $(".mainMenu");
		if(div.hasClass("dest")) {
			div.removeClass("dest").animate({left: '-162px'});
		} else {
			div.addClass("dest").animate({left: '0px'});
		};
		$(".rightBtn,.leftBtn").toggle();
	});
});