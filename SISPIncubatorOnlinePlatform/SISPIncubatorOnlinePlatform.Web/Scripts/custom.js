$(function () {
    // 图片新闻切换
    $(".focusBannerContent").hover(function () { jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.2) }, function () { jQuery(this).find(".prev,.next").fadeOut() });
    $(".focusBannerContent").slide({ mainCell: ".pic", effect: "fold", autoPlay: true, delayTime: 600, trigger: "click" });

    //投资机构轮换
    $(".div_InvestDepScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });

    //项目融资
    $(".div_ItemScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });

    //日历事件列表
    $(".div_event_Tab").slide();

    //业务合作
    $(".div_businessScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });

    //创业长廊
    $(".div_jinjiScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 4, scroll: 1, autoPage: true, pnLoop: false });



    //计算投资机构页面向上按钮操作事件
    if ($(".In_div_list_content").length > 0 || $(".div-content").length > 0) {
        $(".divTopFlag").hide();
        var rightMargin = $(".In_div_list_content").css("margin-right");
        var rightNum = parseFloat(rightMargin);
        var rightPositionNum = 0;
        if (rightNum <= 0) {
            rightPositionNum = 20;
        } else {
            rightPositionNum = rightNum - 30 - 54;
        }

        $(".divTopFlag").css("right", rightPositionNum);

        $(window).scroll(function () {
            if ($(window).scrollTop() >= 100) {
                $('.divTopFlag').fadeIn(300);
            } else {
                $('.divTopFlag').fadeOut(300);
            }
        });
        $('.divTopFlag').click(function () {
            $('html,body').animate({ scrollTop: '0px' }, 800);
        });
    }

    CalculateRightFlagRightPosition('In_div_list_content');//投资机构页面右侧向上按钮的Postion计算
    CalculateRightFlagRightPosition('Info_divDes_Content');//孵化器介绍页面右侧向上按钮的Postion计算


    //孵化器介绍页面滚动效果
    $(".Info_DivScroll").hover(function () { jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.2) }, function () { jQuery(this).find(".prev,.next").fadeOut() });
    $(".Info_DivScroll").slide({ mainCell: ".bd ul", effect: "fold", delayTime: 300, autoPlay: true });
    // function moveBtn(){				
    // 	var prev=$(".Info_DivScroll .prev");				
    // 	var next=$(".Info_DivScroll .next");				
    // 	var body_w = document.body.clientWidth;				
    // 	var side_w = (body_w - 960) / 2 -50;				
    // 	if(body_w< 1080){					
    // 		prev.animate({"left":30, "opacity":0.5});					
    // 		next.animate({"right":30, "opacity":0.5});				
    // 	}else{					
    // 		prev.animate({"left":side_w, "opacity":0.5});					
    // 		next.animate({"right":side_w, "opacity":0.5});				
    // 	}	
    // }
    // moveBtn();	
    // $(window).resize(function(){moveBtn();});


})

//计算右侧向上点击按钮的右侧Position位置
function CalculateRightFlagRightPosition(classContentName) {
    if ($.trim(classContentName) != "") {
        if ($("." + classContentName).length > 0) {
            $(".divTopFlag").hide();
            var rightMargin = $("." + classContentName).css("margin-right");
            var rightNum = parseFloat(rightMargin);
            var rightPositionNum = 0;
            if (rightNum <= 0) {
                rightPositionNum = 20;
            } else {
                rightPositionNum = rightNum - 30 - 54;
            }
            $(".divTopFlag").css("right", rightPositionNum);

            $(window).scroll(function () {
                if ($(window).scrollTop() >= 100) {
                    $('.divTopFlag').fadeIn(300);
                } else {
                    $('.divTopFlag').fadeOut(300);
                }
            });
            $('.divTopFlag').click(function () {
                $('html,body').animate({ scrollTop: '0px' }, 800);
            });
        }

    }
}

