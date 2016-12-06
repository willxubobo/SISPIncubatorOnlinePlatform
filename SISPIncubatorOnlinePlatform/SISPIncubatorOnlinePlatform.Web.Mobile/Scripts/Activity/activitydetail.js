$(function () {
    InitData();
});
function InitData() {
    ShowLoading();
    var id = getUrlParam("id");
    var type = getUrlParam("type");
    if (type != null && type != "") {
        $(".agreenBtnBox").hide();
    }
    var category = getUrlParam("category");
    var activitydetail = {
        id: id,
        category: category
    };
    var parameter = {
        "requestUri": "/api/activitycalendar/detail",
        "requestParameters": activitydetail
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null) {
                $(".activityTitle").text(result.topic);
                var startDate = new Date(result.startTime.replace(/T/g, ' ').split(' ')[0]);
                var startYear = startDate.getFullYear();
                var startMonth = startDate.getMonth() + 2;
                var startDay = startDate.getDate();
                var endDate = new Date(result.endTime.replace(/T/g, ' ').split(' ')[0]);
                var endYear = endDate.getFullYear();
                var endDay = endDate.getDate();
                var endMonth = endDate.getMonth() + 2;
                var startTime = new Date(startYear + '/' + startMonth + '/' + startDay).Format("yyyy-MM-dd");
                var endTime = new Date(endYear + '/' + endMonth + '/' + endDay).Format("yyyy-MM-dd");
                $("#dateTime").text(startTime + " ~ " + endTime);
                $("#timeBucket").text(result.timeBucket);
                $("#address").text(result.address);
                $("#sponsor").text(result.sponsor);
                $("#cosponsor").text(result.cosponsor);
                if (result.phoneNumber == "") {
                    $("#email").text("登陆可见");
                    $("#phone").text("登陆可见");
                }
                else {
                    $("#phone").append("<a class='tellEmail' href='tel:" + result.phoneNumber + "'>" + result.phoneNumber + "</a>");
                    $("#email").append("<a class='tellEmail' href='mailto:" + result.email + "'>" + result.email + "</a>");
                }
              
                $(".activityTxt").html(ProcessWrap(result.activityDescription));
                $("#activityId").val(result.activityId);
                $("#hiddenName").val(result.userName);
                $("#hiddenPhone").val(result.mobile);
                var html = "";
                for (var i = 0; i < result.imgSrcList.length; i++) {
                    html += " <a href=\"" + result.imgSrcList[i] + "\"><img src=\"" + result.imgSrcList[i] + "\"/></a>";
                }
                $(".activityPic").append(html);
                if (result.apply) {
                    $(".agreenBtnBox").hide();
                }
            }
            HideLoading();

        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

//打开弹出层
function ShowActivitySignUp() {
    CheckUserLogin();
    $("#txtName").val($("#hiddenName").val());
    $("#txtPhone").val($("#hiddenPhone").val());
    $(".popupDiv").show();
}

function SaveOk() {
    if (!ValidationLayer()) return;
    ShowLoading();
    var activitySignUp = {
        ActivityID: $("#activityId").val(),
        SignUpName: $("#txtName").val(),
        PhoneNumber: $("#txtPhone").val(),
        WorkingCompany: $("#txtCompanyName").val()
    };
    var formObj = {
        "ActivitySignUp": activitySignUp
    };
    var parameter = {
        "requestUri": "/api/activitysignup",
        "requestParameters": formObj
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("报名成功");
            Cancel();
            $(".agreenBtnBox").hide();
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function Cancel() {
    ClearData();
    HideActivitySignUp();
}
//清空弹出层的数据
function ClearData() {
    $("#txtName").val("");
    $("#txtPhone").val("");
    $("#txtCompanyName").val("");
}
function HideActivitySignUp() {
    $(".popupDiv").hide();
    HideTips();
}

//验证弹出层的数据
function ValidationLayer() {
    var txtName = $("#txtName").val();
    var txtPhone = $("#txtPhone").val();
    var txtCompanyName = $("#txtCompanyName").val();
    if ($.trim(txtName) == "") {
        $("#divName").html("姓名不能为空！");
        $("#divName").show();
        return false;
    }
    if ($.trim(txtPhone) == "") {
        $("#divPhone").html("手机号不能为空！");
        $("#divPhone").show();
        return false;
    }
    if ($.trim(txtCompanyName) == "") {
        $("#divCompanyName").html("所在公司不能为空！");
        $("#divCompanyName").show();
        return false;
    }
    if (!checkphone($.trim(txtPhone))) {
        $("#divPhone").html("手机号格式不正确！");
        $("#divPhone").show();
        return false;
    }
    HideTips();
    return true;
}
//隐藏错误提示
function HideTips() {
    $("#divName").hide();
    $("#divPhone").hide();
    $("#divCompanyName").hide();
}
