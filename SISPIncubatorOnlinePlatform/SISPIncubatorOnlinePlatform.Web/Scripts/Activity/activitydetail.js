$(function () {
    InitActivityData();
});

function InitActivityData() {
    InitActivityDetailData();
}
function InitActivityDetailData() {
    var id = getUrlParam("id");
    var type = getUrlParam("type");
    var status = getUrlParam("status");
    if (type != null && type != "") {
        $(".Info_divApplybtn").hide();
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
                $("#activityTitle").attr("title", result.topic);
                $("#activityTitle").text(result.topic)
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
                if (result.email == "") {
                    $("#email").text("登陆可见");
                    $("#phone").text("登陆可见");
                }
                else {
                    $("#email").empty();
                    
                    $("#phone").text(result.phoneNumber);
                    $("#email").append("<a class='tellEmail' href='mailto:" + result.email + "'>" + result.email + "</a>");
                }
               
                $("#activityTxt").html(result.activityDescription);
                $("#activityId").val(result.activityId);
                $("#hiddenName").val(result.userName);
                $("#hiddenPhone").val(result.mobile);
                var html = "";
                for (var i = 0; i < result.imgSrcList.length; i++) {
                    if (i < 5) {
                        html += " <li><a href=\"" + result.imgSrcList[i] + "\"><img src=\"" + result.imgSrcList[i] + "\"/></a></li>";
                    }
                }
                $(".Info_DivFocusIn").find("ul").each(function () {
                    $(this).append(html);
                })
                if (result.apply) {
                    $(".Info_divApplybtn").hide();
                }
            }

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//打开弹出层
function ShowActivitySignUp() {
    if (CheckUserLogin()) {
        $.ajax({
            type: "get",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            url: "/api/proxy/currentuser",
            async:false,
            success: function (result) {
                $("#txtName").val(result.userName);
                $("#txtPhone").val(result.mobile);
            }
        });
        $("#activityapply").show();
    }
}

function ActivitySaveOk() {
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
            ActivityCancel();
            $(".Info_divApplybtn").hide();
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function ActivityCancel() {
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
    $("#activityapply").hide();
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
