(function ($) {
    $.fn.extend({
        "alert": function (message) {
            var divAlert = $("#divalert");
            if (divAlert.length <= 0) {
                $('body').append("<div id='divalert' style='z-index:102' class='alertBox'><div class='center' style='width: 260px; height:200px;'><div class='alertBg'><div id='alertTxt' class='alertTxt'></div></div></div></div>");
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
        "imgalert": function (message, imgsrc) {
            if (!imgsrc) {
                imgsrc = "../images/pic.png";
            }
            var divAlert = $(".divimgalert");
            if (divAlert.length <= 0) {
                $('body').append("<div id='divimgalert'  style='z-index:102' class='alertBox'><div class='center' style='width: 263px; height:200px;'><div class='alertBg'><div class='alertPic' style='text-align: center;'><img src='" + imgsrc + "' alt=''/></div><div id='imgalertTxt' class='alertTxt'></div></div></div></div>");
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
        "imgalertPC": function (message, imgsrc) {
            if (!imgsrc) {
                imgsrc = "../images/pic.png";
            }
            var divAlert = $("#divAlertBoxPC");
            if (divAlert.length <= 0) {
                $('body').append("<div class='popup-div alertBoxPc' id='divAlertBoxPC'>\
                                   <div class='popup-bg'></div>\
                                   <div class='popup-content center' style='width: 263px;'>\
                                       <div class='popup-main-content padding20 white-bg'>\
                                           <div class='tips-img'>\
                                               <img src='/images/pc/NoEvents.png'>\
                                           </div>\
                                           <p class='tips-txt alertTxtPc' id='alertTxtPc'></p>\
                                       </div>\
                                   </div>\
                               </div>");
                popup();
            }

            $("#alertTxtPc").text(message);
            $("#divAlertBoxPC").fadeIn(400);

            setTimeout(function () { $("#divAlertBoxPC").fadeOut(200); }, 1500);
        }
    });
})(jQuery);

(function ($) {
    $.fn.extend({
        "loadingshow": function () {
            var divLoading = $(".loadingBox");
            if (divLoading.length <= 0) {
                $('body').append("<div class='loadingBox'  style='z-index:102' ><div class='loadPic center' style='width: 62px;height: 64px;'><img src='../images/pc/loading2.gif' alt='' /></div></div>");
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
            var returnUrl = window.location.href;
            if (divCofirm.length <= 0) {
                $('body').append("<div id='confirmDiv'  style='z-index:102'  class='popupDiv'>\
                                    <div class='center' style='width: 270px;height: 268px;'>\
                                        <div class='popupBox padding45'>\
                                            <div class='quitBg'></div>\
                                            <div class='quitTips'>您尚未登录，请先登录！</div>\
                                            <div class='quitBtnBox'>\
                                                <input class='baseBtn registerBtn blueBtn left' type='button' id='btnlogin' onclick='window.location.href=\"../Account/login.html?returnUrl=" + escape(returnUrl) + "\";' value='登录' />\
                                                <input class='baseBtn registerBtn darkBlueBtn right' type='button' id='btnCancel' onclick='window.location.href=\"../home.html\"' value='返回首页' >\
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

(function ($) {
    $.fn.extend({
        "loginconfirmPC": function () {
            scrollWidth();
            $(".popup-div").hide();
            var divCofirm = $(".logindiv");
            var returnUrl = window.location.href;
            var callback = "";
            if ($("#hidCallbackFunc")) {
                callback = $("#hidCallbackFunc").val();
            }

            if (divCofirm.length <= 0) {
                $('body').append("<div class='popup-div logindiv' id='divLogin'>\
                                    <div class='popup-bg'></div>\
                                    <div class='popup-content center' style='width: 950px; height: 511px;'>\
                                        <div class='popup-main-content padding0-45 white-bg'>\
                                            <div class='login-box'>\
                                                <div class='login-left'>\
                                                    <p class='login-title-txt'>微信扫描二维码登录</p>\
                                                    <div class='login-img'>\
                                                        <img id='imglogo' alt=''/>\
                                                    </div>\
                                                </div>\
                                                <div class='login-right'>\
                                                    <p class='login-title-txt'>或账户登录</p>\
                                                    <div class='login-enter-box'>\
                                                        <input class='ipt-enter ipt-lg user-ipt' type='text' id='txtMobile' placeholder='请输入手机号'>\
                                                        <input class='ipt-enter ipt-lg user-pw' id='txtPassword' type='password' placeholder='请输入密码'>\
                                                    </div>\
                                                    <div class='login-operate'>\
                                                        <div class='left'>\
                                                            <input class='login-operate-ipt' type='checkbox' onclick='KeepPwd();' id='btnKeepPwd'/>\
                                                            <label class='login-operate-txt'>记住密码</label>\
                                                        </div>\
                                                        <div class='right'>\
                                                            <input class='login-operate-ipt' type='checkbox' id='btnAutoLogin' onclick='KeepAutoLogin();'>\
                                                            <label class='login-operate-txt'>自动登录</label>\
                                                        </div>\
                                                    </div>\
                                                    <div class='btn-box login-btn-box'>\
                                                        <a class='base-btn sm-btn bule-btn left btnlogin' id='lbtnsubmit' href='javascript:;'>提交</a>\
                                                        <a class='base-btn sm-btn right btnCancel' href='javascript:;' onclick='Cancel()'>取消</a>\
                                                    </div>\
                                                    <div class='login-link-box'>\
                                                        <ul class='login-link-list'>\
                                                            <li>\
                                                                <a class='login-link' href='javascript:' onclick='showregister()'>用户注册</a>\
                                                            </li>\
                                                            <li>\
                                                                <a class='login-link' href='#' onclick='ShowRePwd()'>忘记密码</a>\
                                                            </li>\
                                                        </ul>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>");
                $(".btnlogin").click(function () {
                    Login(callback);
                });
                $("body").bind('keyup', { callback: callback }, EnterKeyUp);
                popup();
            } else {
                $(".logindiv").show();
            }          

            if ($('#Login').css('display') == "none") {
                $("#logOut").hide();
                $("#Login").show();
                if (typeof (InitUserData_Home) == "function") {
                    InitUserData_Home();
                }
            }
            else {
                var qrcodeImg = $("#imglogo_l").attr("src");
                if (qrcodeImg) {
                    InitQrCode(qrcodeImg);
                }
            }
            if (InitData()) {
                //自动登陆
                AutoLogin();
            }
        }
    });

    function EnterKeyUp(e) {
        if (e.keyCode == 13) {
            if (!$(".logindiv").is(":hidden")) {
                Login(e.data.callback);
            }
        }
    }

    function AutoLogin() {
        ///自动登陆
        var keepPwdClassName = $("#btnKeepPwd").is(':checked');
        var autoLoginClassName = $("#btnAutoLogin").is(':checked');
        if (keepPwdClassName && autoLoginClassName) {
            Login();
        }
    }

    function InitData() {
        ///如果是记住用户
        $("#txtMobile").val($.cookie("mobile"));
        if ($.cookie("rmbUser") == "true") {
            $("#btnKeepPwd").prop("checked", true);
            $("#txtPassword").val($.cookie("passWord"));
        }
        if ($.cookie("rmbUserAuto") == "true") {
            $("#btnAutoLogin").prop("checked", true);
            return true;
        }
        return false;
    }


})(jQuery);

(function ($) {
    $.fn.extend({
        "showapproveprogress": function (relateID) {
            ShowLoading();
            var id = relateID;
            var divApproveProgress = $("#divapproveprogress");
            var returnUrl = window.location.href;
            if (divApproveProgress.length <= 0) {
                $('body').append("<div class='popup-div hide' id='divapproveprogress'>\
		                            <div class='popup-bg'></div>\
		                            <div class='popup-content center' style='width: 625px;'>\
			                            <div class='popup-main-content white-bg'>\
				                            <div class='apply-settled-box'>\
					                            <div id='divApplyTitle' class='apply-settled-title'></div>\
					                            <div class='auditBox-list-scroll'>\
                                                <div id='divApproveNode' class='auditBox'>\
                                                </div>\
					                        </div>\
				                        </div>\
				                        <div class='btn-box audit-btn-box'>\
					                        <a class='base-btn sm-btn space25' href='javascript:;' onclick='$(\"#divapproveprogress\").hide();'>返回</a>\
				                        </div>\
			                        </div>\
		                        </div>\
	                        </div>");
                popup();
            }

            var searchObj = {
                ApproveRelateID: id
            }
            var parameter = {
                requestUri: "/api/approverecord/approveinfo",
                requestParameters: searchObj
            }
            var jsonData = JSON.stringify(parameter);
            $.ajax({
                type: "POST",
                url: "/api/proxy/post",
                data: jsonData,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                success: function (returndata) {
                    var data = returndata.results;
                    var htmlItem = "";

                    var applytype = data[0].applyType;
                    var strApplyType = "";
                    switch (applytype) {
                        case "0":
                            strApplyType = "孵化器入驻申请";
                            break;
                        case "1":
                            strApplyType = "办公室入驻申请";
                            break;
                        case "2":
                            strApplyType = "投资人资格申请";
                            break;
                        case "3":
                            strApplyType = "融资发布申请";
                            break;
                        case "4":
                            strApplyType = "服务发布申请";
                            break;
                        case "5":
                            strApplyType = "需求发布申请";
                            break;
                        case "6":
                            strApplyType = "活动发布申请";
                            break;
                        case "7":
                            strApplyType = "举办孵化器活动申请";
                            break;
                        default: strApplyType = ""; break;
                    }
                    $("#divApplyTitle").html(strApplyType + " - 审核进度");

                    for (i = 0; i < data.length; i++) {
                        var approvestatus = "";
                        if (applytype == "0") {
                            if (data[i].approveResult == "1") {
                                approvestatus = "公共孵化器审核中。";
                            } else if (data[i].approveResult == "2") {
                                approvestatus = "公共孵化器审核通过。";
                            } else if (data[i].approveResult == "3") {
                                approvestatus = "公共孵化器审核驳回。";
                            } else if (data[i].approveResult == "4") {
                                approvestatus = "审核通过。";
                            } else if (data[i].approveResult == "5") {
                                approvestatus = "品牌孵化器审核驳回。";
                            } else if (data[i].approveResult == "6") {
                                approvestatus = "撤销。";
                            }
                        }
                        else {
                            if (data[i].approveResult == "2") {
                                approvestatus = "审核通过。";
                            } else if (data[i].approveResult == "3") {
                                approvestatus = "审核驳回。";
                            } else if (data[i].approveResult == "4") {
                                approvestatus = "撤销。";
                            }
                        }
                        var coms = "";
                        if (data[i].comments != null && data[i].comments != undefined && data[i].comments != "") {
                            coms = data[i].comments;
                        }
                        if (i == 0) {
                            if (applytype == "0") {
                                if (data[i].approveResult == "6") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">申请人撤销。</p></div></div>";
                                } else if (data[i].approveResult == "4") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">审核通过。" + coms + "</p></div></div>";
                                } else if (data[i].approveResult == "2") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">品牌孵化器审核中。" + coms + "</p></div></div>";
                                } else if (data[i].approveResult == "5") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\">";
                                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">品牌孵化器审核驳回。" + coms + "</p></div></div>";
                                } else if (data[i].approveResult == "3") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\">";
                                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">公共孵化器审核驳回。" + coms + "</p></div></div>";
                                } else if ($.trim(data[i].approveResult) == "" || $.trim(data[i].approveResult) == "0") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\">";
                                    htmlItem += "<p class=\"auditTxt\">公共孵化器审核中。</p></div></div>";

                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
                                }
                            }
                            else {
                                if (data[i].approveResult == "4") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">申请人撤销。</p></div></div>";
                                } else if (data[i].approveResult == "2") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinished\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">审核通过。" + coms + "</p></div></div>";
                                } else if (data[i].approveResult == "3") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\">";
                                    htmlItem += "<p class=\"auditTxt\">退回修改中。</p></div></div>";

                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">审核驳回。" + coms + "</p></div></div>";
                                } else if ($.trim(data[i].approveResult) == "" || $.trim(data[i].approveResult) == "0") {
                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditCur\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\">";
                                    htmlItem += "<p class=\"auditTxt\">管理员审核中。</p></div></div>";

                                    htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                    htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                    htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
                                }
                            }
                        } else {
                            if ($.trim(data[i].approveResult) == "" || $.trim(data[i].approveResult) == "0") {
                                htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                htmlItem += "<p class=\"auditTxt\">提交申请。</p></div></div>";
                            } else {
                                htmlItem += "<div class=\"auditList\"><div class=\"auditInfo auditFinish\"></div>";
                                htmlItem += " <div class=\"auditListTxt\"><p class=\"auditTxt\">" + data[i].created.substring(0, 10) + "</p>";
                                htmlItem += "<p class=\"auditTxt\">" + approvestatus + "。" + coms + "</p></div></div>";
                            }
                        }
                    }
                    if (htmlItem != "") {
                        $('#divApproveNode').html(htmlItem);
                    }

                    $("#divapproveprogress").show();
                    HideLoading();
                },
                error: function (err) {
                    ErrorResponse(err);
                    HideLoading();
                }
            });
        }
    });
})(jQuery);



