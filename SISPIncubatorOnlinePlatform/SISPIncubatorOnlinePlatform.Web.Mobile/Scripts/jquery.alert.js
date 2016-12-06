(function ($) {
    $.fn.extend({
        "alert": function (message) {
            var divAlert = $("#divalert");
            if (divAlert.length <= 0) {
                $('body').append("<div id='divalert' class='alertBox'><div class='center' style='width: 190px; height: 189px;'><div class='alertBg'><div id='alertTxt' class='alertTxt'></div></div></div></div>");
                popup();
            }

            $("#alertTxt").text(message);
            $("#divalert").fadeIn(400);

            setTimeout(function () { $("#divalert").fadeOut(200); }, 1500);
        }
    });
})(jQuery);

(function ($) {
    $.fn.extend({
        "confirm": function (options) {
            var defaults = {
                message:"确认删除吗？",
                yes: function () {
                }
            };

            var settings = $.extend(defaults, options || {});
           
            var divAlert = $("#divconfirm");
            if (divAlert.length <= 0) {
                $('body').append("<div id='divconfirm' class='alertBox'>\
                                        <div class='center' style='width: 190px; height: 189px;'>\
                                            <div class='alertBg'>\
                                                <div id='alertTxt' class='alertTxt'>\
                                                </div>\
                                                <div style=\"text-align:center;padding-top: 15px;\">\
                                                    <input id='btncusconfirm' type='button' style='color: white;background-color: gray;' value='确定' />&nbsp;&nbsp;&nbsp;\
                                                    <input id='btncuscancel' type='button' style='color: white;background-color: gray;' value='取消' onclick='$(\"#divconfirm\").hide();'/>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>");
                popup();
            }

            $("#btncusconfirm").click(function () {
                settings.yes.apply();
                $("#divconfirm").hide();
            })
            $("#btncuscancel").click(function () {
                $("#divconfirm").hide();
            })

            $("#alertTxt").text(options.message);
            $("#divconfirm").show();
        }
    });
})(jQuery);


(function ($) {
    $.fn.extend({
        "imgalert": function (message, imgsrc) {
            if (!imgsrc) {
                imgsrc = "../images/pic.png";
            }
            var divAlert = $(".divimgalert");
            if (divAlert.length <= 0) {
                $('body').append("<div id='divimgalert' class='alertBox'><div class='center' style='width: 190px; height: 189px;'><div class='alertBg'><div class='alertPic'><img src='" + imgsrc + "' alt=''/></div><div id='imgalertTxt' class='alertTxt'></div></div></div></div>");
                popup();
            }

            $("#imgalertTxt").text(message);
            $("#divimgalert").fadeIn(400);

            setTimeout(function () { $("#divimgalert").fadeOut(200); }, 1500);
        }
    });
})(jQuery);


(function ($) {
    $.fn.extend({
        "loadingshow": function () {
            var divLoading = $(".loadingBox");
            if (divLoading.length <= 0) {
                $('body').append("<div class='loadingBox'><div class='loadPic center'><img src='../images/loading.gif' alt='' /></div></div>");
                popup();
            } else {
                $(".loadingBox").removeClass("hide");
            }
        }
    });
})(jQuery);

(function ($) {
    $.fn.extend({
        "loadinghide": function () {
            var divLoading = $(".loadingBox");
            if (divLoading.length > 0) {
                $(".loadingBox").addClass("hide");
            }
        }
    });
})(jQuery);

(function ($) {
    $.fn.extend({
        "loginconfirm": function () {
            var divCofirm = $("#confirmDiv");
            var returnUrl =window.location.href;
            if (divCofirm.length <= 0) {
                $('body').append("<div id='confirmDiv' class='popupDiv'>\
                                    <div class='center' style='width: 270px;height: 268px;'>\
                                        <div class='popupBox padding45'>\
                                            <div class='quitBg'></div>\
                                            <div class='quitTips'>您尚未登录，请先登录！</div>\
                                            <div class='quitBtnBox'>\
                                                <input class='baseBtn registerBtn blueBtn left' type='button' id='btnlogin' onclick='window.location.href=\"/Account/login.html?"+ Math.random(6) +"&returnUrl=" +escape(returnUrl) + "\";' value='登录' />\
                                                <input class='baseBtn registerBtn darkBlueBtn right' type='button' id='btnCancel' onclick='window.location.href=\"/home.html?" + Math.random(6) + "\"' value='返回首页' >\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>");
                popup();
            } else {
                $("#confirmDiv").show();
            }           
        }
    });
})(jQuery);


