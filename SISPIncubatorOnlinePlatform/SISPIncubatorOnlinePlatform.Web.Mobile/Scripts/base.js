$(document).ready(function () {
    $(".choseBtn,.agreeBtn").click(function () {
        $(this).toggleClass("on");
    });
    minHeight();
    searchLayout();
    loginCheck();
    popup();
    Registration();
    incubatorTabs();
    MinHeight();
    indexLayout();
});

$(window).load(function () {
    curDate();
    indexCenter();
});


function minHeight() {
    function pageHeight() {
        var pageHeight = $(window).height();
        var contentHeight = $(".loginContent").height();
        if (pageHeight >= contentHeight+70) {
            $(".loginContent").css("min-height", pageHeight).find(".userOperateBox").addClass("userOperateBoxLayout").removeClass("userOperateBoxLayoutOne");
        } else {
            $(".loginContent").css("min-height", pageHeight).find(".userOperateBox").removeClass("userOperateBoxLayout").addClass("userOperateBoxLayoutOne");
        };
    };
    pageHeight();
    $("html,body").resize(function () {
        pageHeight();
    });
};

function searchLayout(){
    $(".incubatorSearchIpt").val("");
    $(".incubatorSearchIpt").focus(function(){
        $(this).prop("placeholder","搜索");
        $(this).prev(".incubatorSearchIptBg").addClass("txtLeft").find("span").hide();
        $(this).parent(".searchBox").animate({marginRight:"50px"},function(){$(".searchBtn").animate({opacity:"1"});});
        $(".agreenBtnBox").hide();
    });
    $(".incubatorSearchIpt").blur(function(){                       //mobile搜索框失去焦点动作
        if($(this).val()==""){
            $(this).prop("placeholder","");
            $(this).prev(".incubatorSearchIptBg").removeClass("txtLeft").find("span").show();
            $(this).parent(".searchBox").stop(true).animate({marginRight:"0px"});
            $(".searchBtn").stop(true).animate({opacity:"0"},0);
        };
        $(".agreenBtnBox").show();
    });
};

function popup() {                                          //用于弹出框居中或者其他元素上下区中
    function centerWay() {
        var screenWidth = $(window).width();
        var screenHeight = $(window).height();
        $(".center").each(function () {
            $(this).css({"position":"fixed","z-index":"51"});
            var centerWidth = $(this).width();
            var centerHeight = $(this).height();
            var left = (screenWidth - centerWidth) / 2;
            var top = (screenHeight - centerHeight) / 2;
            if (screenHeight > centerHeight) {
                $(this).css({ "top": top, "left": left });
            };
            if (screenHeight < centerHeight) {
                $(this).css({ "top": "50px", "left": left });
            };
        });
    };
    centerWay();
    $("html,body,.center").resize(function () {
        centerWay();
    });
};

function loginCheck() {                                                           //登录验证
    $(".loginBtn").click(function () {
        if ($("#txtMobile").val() == "") {
            if ($("#txtPassword").val() == "") {
                $(".alertTxt").text("请输入手机号和密码");
                $(".alertBox").fadeIn(400);
                setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            } else {
                $(".alertTxt").text("请输入手机号");
                $(".alertBox").fadeIn(400);
                setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            };
        };
        if ($("#txtPassword").val() == "") {
            if ($("#txtMobile").val() == "") {
                $(".alertTxt").text("请输入手机号和密码");
                $(".alertBox").fadeIn(400);
                setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            } else {
                $(".alertTxt").text("请输入密码");
                $(".alertBox").fadeIn(400);
                setTimeout(function () { $(".alertBox").fadeOut(200); }, 1500);
            };
        };
    });
};

function Registration() {
    $(document).on("click", ".registerRadio", function () {
        $(this).addClass("on").siblings(".registerRadio").removeClass("on");
    });
};

function curDate() {
    var myDate = new Date();
    var curYear1 = myDate.getFullYear();
    var curMonth1 = myDate.getMonth() + 1;
    if (curMonth1 < 10) {
        curMonth1 = "0" + curMonth1;
    };
    $(".curMonth").html(curMonth1);
    $(".curYear").html(curYear1);
};

function indexCenter() {
    function indexPicCenter() {
        var indexWidth = $(".indexBox").width();
        var indexHeight = $(".indexBox").height();

        var indexLinkWidth = $(".indexLinkBox").width();
        var indexLinkHeight = $(".indexLinkBox").height();
        $(".indexLinkBox").css({ "left": -(indexLinkWidth - indexWidth) / 2, "top": -(indexLinkHeight - indexHeight) / 2 });
    };
    indexPicCenter();
    $("html,body").resize(function () {
        indexPicCenter();
    });

}

function incubatorTabs() {
    $(".infoTitle:first").addClass("curTitle");
    $(".businessTxtBox>div").not(":first").hide();
    $(".infoTitle>div").click(function () {
        $(this).parent().addClass("curTitle").siblings().removeClass("curTitle");
        var index = $(".infoTitle>div").index(this);
        $(".businessTxtBox>div").eq(index).fadeIn(400).siblings().hide();
    });

    $(".projectInfoTabs>.projectTabs:first").addClass("on");
    $(".projectBox>.projectBoxContent").not(":first").hide();
    $(".projectInfoTabs>.projectTabs").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var className = $(this).attr("class");
        if (className.indexOf("sendfrom") > 0) {
            $(".divSendToOperator").hide();
            $(".divSendFromOperator").show();
        } else {
            $(".divSendToOperator").show();
            $(".divSendFromOperator").hide();
        }
        var index = $(".projectInfoTabs>.projectTabs").index(this);
        $(".projectBox>.projectBoxContent").eq(index).fadeIn(400).siblings().hide();
    });
};

function MinHeight() {
    var pageH = $(window).height();
    $(".content").css({ "min-height": pageH, "position": "relative" });
};

function indexLayout(){
    var H = $(window).height();
    if (H<500) {
        $(".indexLinkBox").addClass("indexTop");
    }else{
        $(".indexLinkBox").removeClass("indexTop");
    };
};