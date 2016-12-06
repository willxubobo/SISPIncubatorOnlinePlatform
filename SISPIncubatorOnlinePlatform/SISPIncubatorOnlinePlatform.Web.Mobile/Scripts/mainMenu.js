$(document).ready(function(){
    $(".content").after("<div class='mainMenu'><div class='mainMenuBox'><a class='mainMenuLink indexLeftLink' href='#'><span>首页</span></a><a class='mainMenuLink myMenuLink' href='#'><span>我的</span></a></div><div class='mainMenuMore'><span class='rightBtn'>〉</span><span class='leftBtn hide'>〈</span></div></div>");
    $(".indexLeftLink").click(function () {
        window.location.href = "/home.html?" + Math.random(6);
    });
    $(".myMenuLink").click(function () {
        window.location.href = "/account/myprofile.html?" + Math.random(6);
    });
    $(".mainMenuMore").click(function (e) {
		var div = $(".mainMenu");
		if(div.hasClass("dest")) {
			$(".wrap").css("min-height","auto");
			div.removeClass("dest").animate({left: '-162px'},200);
		} else {
			var H = $(window).height();
            $(".wrap").css("min-height",H);
			div.addClass("dest").animate({left: '0px'},200);
		};
		$(".rightBtn,.leftBtn").toggle();
		var ev = e || window.event;
         if(ev.stopPropagation){
            ev.stopPropagation();
        }
        else if(window.event){
            window.event.cancelBubble = true;//兼容IE
        }
	});
	$(".mainMenu").click(function(e){
		var ev = e || window.event;
         if(ev.stopPropagation){
            ev.stopPropagation();
        }
        else if(window.event){
            window.event.cancelBubble = true;//兼容IE
        }
	});
	$(".wrap").click(function(){
		$(".wrap").css("min-height","auto");
        $(".mainMenu").removeClass("dest").animate({left: '-162px'},200);
		$(".rightBtn").show();
		$(".leftBtn").hide();	
    });
});


	