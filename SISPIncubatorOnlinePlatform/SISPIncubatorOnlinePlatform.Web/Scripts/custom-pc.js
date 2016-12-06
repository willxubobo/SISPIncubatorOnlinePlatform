var activeIndex;
$(document).ready(function () {
    tabSwiper();   
    navHover();
	minPageH();
});
function initNav() {
    tabSwiper();
    navHover();
    minPageH();
}

function tabSwiper(){
    $(".tabs-title-box .tab-title:first").addClass("tab-cur");
    $(".tabs-content-box>.tabs-content").not(":first").hide();
    //$(".tabs-title-box>.tab-title").hover(function () {
    //    $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
    //    var index = $(".tabs-title-box>.tab-title").index(this);
    //    $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    //});
    //add by kimble
    $(".tabs-title-box>.tab-title-Incubator").on("click", function () {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
        var index = $(".tabs-title-box>.tab-title-Incubator").index(this);
        $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    });


    $(".div_business_tab>div:first").addClass("selected");
    $(".div_business_tab_content>.div_business_content").not(":first").hide();
    $(".div_business_tab>div").hover(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(".div_business_tab>div").index(this);
        $(".div_business_tab_content>.div_business_content").eq(index).fadeIn(1000).siblings().hide();
    });

    $(".tab-title-box>.tab-title:first").addClass("on");
    $(".tab-content-box>.tab-content").not(":first").hide();
    $(".tab-title-box>.tab-title").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = $(".tab-title-box>.tab-title").index(this);
        $(".tab-content-box>.tab-content").eq(index).show().siblings().hide();
    });
};

function setIndex(index) {
    activeIndex = index;
}
function navHover() {   
    $(document).on("click", ".left-nav-div:not('.active')", function () {
        $(".left-nav-div").removeClass("active");
        activeIndex = $(".left-nav-div").index(this);
        $(this).stop(true).parent("li").siblings("li").find(".active-icon").hide();
        $(this).stop(true).addClass("active").parent("li").siblings("li").find(".left-nav-div").removeClass("active");        
    });
    $(document).on("mouseenter", ".left-nav-div:not('.active')", function () {
        var div = $(this).parent("li").siblings("li").find(".left-nav-div");
        div.removeClass("on");
        div.children(".active-icon").hide();
        div.stop(true).animate({ width: "166px", height: "60px", left: "0px", top: "0px" }, 200);

        $(".left-nav-div").removeClass("active");
        $(this).addClass("on").parent("li").siblings("li").find(".left-nav-div").removeClass("on");
        $(this).stop(true).animate({ width: "174px", height: "68px", left: "-4px", top: "-4px" }, 200, function () {
            $(this).children(".active-icon").fadeIn(200);
        });
    });
    $(document).on("mouseleave", ".left-nav-div:not('.active')", function () {
        $(this).removeClass("on");
        $(this).children(".active-icon").hide();
        $(this).stop(true).animate({ width: "166px", height: "60px", left: "0px", top: "0px" }, 200);
    });
    $(document).on("mouseleave", ".left-nav-list", function () {     
        $(".left-nav-div").eq(activeIndex).addClass("active");
    });
};

function minPageH() {
    function mainPageH() {
        var leftH = $(".left-nav-box").height();
        $(".right-result-box,.result-box").css("min-height", leftH);
    };
    mainPageH();

    $(".div_business_tab>div:first").addClass("selected");
    $(".div_business_tab_content>.div_business_content").not(":first").hide(); 
    $(".div_business_tab>div").hover(function(){
    	$(this).addClass("selected").siblings().removeClass("selected");
	    var index = $(".div_business_tab>div").index(this);
	    $(".div_business_tab_content>.div_business_content").eq(index).fadeIn(1000).siblings().hide();
    }); 

    $(".tab-title-box>.tab-title:first").addClass("on");
    $(".tab-content-box>.tab-content").not(":first").hide(); 
    $(".tab-title-box>.tab-title").click(function(){
    	$(this).addClass("on").siblings().removeClass("on");
	    var index = $(".tab-title-box>.tab-title").index(this);
	    $(".tab-content-box>.tab-content").eq(index).show().siblings().hide();
    });
};

function minPageH(){
	function mainPageH(){
		var leftH = $(".left-nav-box").height();
		$(".right-result-box,.result-box").css("min-height",leftH);
	};
	mainPageH();
};