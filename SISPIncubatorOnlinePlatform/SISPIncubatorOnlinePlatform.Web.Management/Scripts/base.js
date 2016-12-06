$(document).ready(function(){
	IptFocus();
	NavHover();
	LeftNavHover();
	Registration();
    popup();
});
$(window).load(function(){
	
});
function IptFocus(){
	$(".enter-ipt").focus(function(){
		$(this).next(".ipt-icon").addClass("on");
	});
	$(".enter-ipt").blur(function(){
		$(this).next(".ipt-icon").removeClass("on");
	});
};
function Registration() {
    $(document).on("click", ".registerRadio", function () {
        $(this).addClass("on").siblings(".registerRadio").removeClass("on");
    });
};


var mantopindex;
function NavHover(){
	//mantopindex = $(".nav-menu.on").index();
	var hoverIndex;
	var clickI;
	$(document).on("mouseenter",".nav-menu",function(){
		$(".nav-menu").eq(mantopindex).animate({backgroundColor:"transparent"},300);
		$(this).stop(true).animate({backgroundColor:"#02a9f5"},300);
	});	
	$(document).on("mouseleave",".nav-menu",function(){
		hoverIndex = $(".nav-menu").index(this);
		if(hoverIndex!=mantopindex){
			$(this).stop(true).animate({backgroundColor:"transparent"},300);
		};
	});
	$(document).on("mouseleave",".nav-list",function(){
		if(hoverIndex!=mantopindex){
			$(this).find(".nav-menu").eq(mantopindex).stop(true).animate({backgroundColor:"#02a9f5"},200);
		};	
	});
	$(document).on("click",".nav-menu",function(e){
		$(".nav-menu").removeClass("on");
		$(this).addClass("on");
		clickI = $(".nav-menu").index(this);
		mantopindex = clickI;
	});
	$(document).on("mousedown",".nav-menu",function(e){
		if(e.which==1){
			$(this).find("span").stop(true).animate({top:"1px",left:"1px"},0);
		}		
	});
	$(document).on("mouseup",".nav-menu",function(e){
		if(e.which==1){
			$(this).find("span").stop(true).animate({top:"0px",left:"0px"},0);
		}
	});
};

var indexLeftNav;
function setmanageIndex(index) {
    indexLeftNav = index;
}
function LeftNavHover(){
	//indexLeftNav = $(".subnav-menu.on").index();
	$(document).on("mouseenter",".subnav-menu",function(){
		$(".subnav-menu").removeClass("active").removeClass("on");
		$(this).addClass("active");
	});
	$(document).on("mouseleave",".subnav-menu",function(){
		$(this).removeClass("active");
	});
	$(document).on("click",".subnav-menu",function(){
		$(this).addClass("on");
		var clickLeftNav = $(".subnav-menu").index(this);
		indexLeftNav = clickLeftNav;
	});
	$(document).on("mouseleave", ".sub-nav", function () {
	    $(".subnav-menu").removeClass("active").removeClass("on");
		$(".subnav-menu").eq(indexLeftNav).addClass("on");
	});
	$(document).on("mousedown",".subnav-menu",function(e){
		if(e.which==1){
			$(this).find("span").stop(true).animate({top:"1px",left:"1px"},0);
		}		
	});
	$(document).on("mouseup",".subnav-menu",function(e){
		if(e.which==1){
			$(this).find("span").stop(true).animate({top:"0px",left:"0px"},0);
		}
	});
};
function popup() {                                          //用于弹出框居中或者其他元素上下区中
    function centerWay() {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        $(".center").each(function () {
            $(this).css({ "position": "fixed", "z-index": "101" });
            var centerWidth = $(this).width();
            var centerHeight = $(this).height();
            var left = (screenWidth - centerWidth) / 2;
            var top = (screenHeight - centerHeight) / 2;
            if (screenHeight > centerHeight) {
                $(this).css({ "top": top, "left": left });
            };
            if (screenHeight < centerHeight) {
                $(this).css({ "top": "10%", "height": "80%", "left": left });
            };
        });
    };
    centerWay();
    $("html,body,.center").resize(function () {
        centerWay();
    });
};