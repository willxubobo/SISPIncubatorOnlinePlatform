//等比例放大和缩小图片

function AutoResizeImage(maxWidth, maxHeight, objImg) {
    var img = new Image();
    img.src = objImg.src;
    var hRatio;
    var wRatio;
    var Ratio = 1;
    var w = img.width;
    var h = img.height;
    wRatio = maxWidth / w;
    hRatio = maxHeight / h;
    if (maxWidth == 0 && maxHeight == 0) {
        Ratio = 1;
    } else if (maxWidth == 0) {//
        if (hRatio < 1) Ratio = hRatio;
    } else if (maxHeight == 0) {
        if (wRatio < 1) Ratio = wRatio;
    } else if (wRatio < 1 || hRatio < 1) {
        Ratio = (wRatio <= hRatio ? wRatio : hRatio);
    }
    if (Ratio < 1) {
        w = w * Ratio;
        h = h * Ratio;
    }
    //add by kimble
    if (w < maxWidth && h < maxHeight) {
        objImg.height = maxHeight;
        objImg.width = maxWidth;
    } else {
        objImg.height = h;
        objImg.width = w;
    }
    $(objImg).show();
    //objImg.height = h;
    //objImg.width = w;
}
//初始化插件
function InitPlug() {
    $(".divWechat_pop").hide();

    // 图片新闻切换
    $(".focusBannerContent").hover(function () { jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.2) }, function () { jQuery(this).find(".prev,.next").fadeOut() });
    $(".focusBannerContent").slide({ mainCell: ".pic", effect: "fold", autoPlay: true, delayTime: 600, trigger: "click" });

    //投资机构轮换
    //$(".div_InvestDepScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });

    //项目融资
    $(".div_ItemScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });
    

    //日历事件列表
    $(".div_event_Tab").slide();

    //业务合作
    $(".div_businessScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 3, scroll: 1, autoPage: true, pnLoop: false });

    //创业长廊
    $(".div_jinjiScroll").slide({ mainCell: "ul", autoPlay: false, effect: "left", vis: 4, scroll: 1, autoPage: true, pnLoop: false });

    //$(".div_InvestDepScroll").hover(function () { jQuery(this).find(".prev,.next").stop(true, true).fadeTo("show", 0.2) }, function () { jQuery(this).find(".prev,.next").fadeOut() });
    //$(".div_InvestDepScroll").slide({ mainCell: ".bd ul", effect: "fold", delayTime: 300, autoPlay: true });
}