//页面加载
$(function () {
    $(".popupDiv").hide();
    $("#logOut").click(function () {
        $(".popupDiv").show();
    });
    $("#btnCancel").click(function () {
        $(".popupDiv").hide();
    });
    //$("#btnLogOut").click(function () {
    //    LogOut();
    //});


    //初始化数据
    InitData();
});

function InitData() {
    ShowLoading();
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        //data: parameterJson,
        success: function (result) {
            if (result == null) {
                $(this).loginconfirm();
            } else {
                $(".individualName").html(result.UserName);
                $("#userType").html("身份：" + result.UserType);
                $("#mobile").html("联系电话：" + result.Mobile);
                $("#email").html("Email：" + result.Email);
                $("#address").html("地址：" +result.Address);
                $(".personalPic img").attr("src", result.Avatar);
                $("#userId").attr("value", result.UserID);
                $("#txtMobile").attr("value", result.Mobile);
                GetMessageCount();
                GetUserRole(result.UserID);
                HideLoading();
            }
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function GetUserRole(id) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/user/role/" + id,
        "requestParameters": {
        
        }
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function(result) {
            if (result) {
                $("#myIncubator").show();
            }
            HideLoading();
        },
        error: function(result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function GetMessageCount() {
    ShowLoading();
    var formObj = {
        "SendTo": $("#userId").attr("value")
    };
    var parameter = {
        requestUri: "/api/message/count",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result > 0) {
                $("#messageCenter").after("<div class='newsNum'>" + result + "</div>");
            }
            //$(".newsNum").html(result);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function Redirect() {
    var mobile = $("#txtMobile").val();
   window.location.href = "http://" +window.location.host + "/account/improveuserinfo.html?mobile=" + mobile;
}

function LogOut() {
    ShowLoading();
    $.ajax({
        type: "post",
        url: "/api/proxy/logout",
        success: function () {
            ClearInitLogin();
           window.location.href = "login.html";
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}