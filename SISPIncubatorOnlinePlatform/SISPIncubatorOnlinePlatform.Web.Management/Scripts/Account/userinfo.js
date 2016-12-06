$(function () {
    ShowLoading();
    GetUserInfo();
});

//根据编号获取用户信息
function GetUserInfo() {
    var mobile = getUrlParam("mobile");
    var userid = getUrlParam("userid");
    var parameter;
    if (mobile != null && mobile != undefined && mobile != "") {
        parameter = {
            "requestUri": "/api/user/" + mobile,
            "requestParameters": {
                "Mobile": mobile
            }
        };
    } else {
        parameter = {
            "requestUri": "/api/user/pending/" + userid,
            "requestParameters": {
                "Mobile": ""
            }
        };
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result == null) {
                $(this).alert("用户未登录！");
            } else {
                $(".UserName").html(result.user_name);
                $(".hiduserid").val(result.user_id);
                //$(".Mobile").val(result.results[0].mobile);
                $("#divphone").html(result.user_mobile);
                $(".Email").html("<a class='mailtoEmail' href=\"mailto:" + result.user_email + "\">" + result.user_email + "</a>");
                var utype = result.user_type;
                $(".UserType").html(utype);
                $(".Address").html(result.user_address);
                $("#userlogo").attr("src", result.user_avatar);
                if (utype == "企业") {
                    $(".ComName").html(result.user_comname);
                    $(".linenseimg").attr("src", result.user_linenseimg);
                    $(".cardimg").attr("src", result.user_cardimg);
                    $(".Description").html(result.user_desc);
                    $(".comtype").show();
                }
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//通过或者拒绝
function UpdateApprove(approveStatus) {
    ShowLoading();
    var id = $(".hiduserid").val();
    var frPublish = {
        UserID: id
    };
    var formObj = {
        "User": frPublish,
        ApproveStatus: approveStatus
    };

    var parameter = {
        requestUri: "/api/user/approve",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert('审批成功');
            setTimeout(function () {
                window.opener.InitGetuserData();
                window.close();
            }, 2000);
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
            HideLoading();
        }
    });
}