$(function () {
    CheckUserLogin();
    InitLayDate();
    var demandId = getUrlParam("id");
    if (demandId != null && demandId != "") {
        GetInfo(demandId);
    }
})

function GetInfo(demandId) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/demandpublish/" + demandId,
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                $("#companyName").val(result.results[0].companyName);
                $("#contact").val(result.results[0].contacts);
                $("#phone").val(result.results[0].mobile);
                $("#email").val(result.results[0].email);
                $("#projectDescription").val(result.results[0].projectDescription);
                $("#member").val(result.results[0].members);
                $("#intentionPartner").val(result.results[0].intentionPartner);
                $("#projectDescription").val(result.results[0].projectDescription);
                $("#demandDescription").val(result.results[0].demandDescription);
                $("#foundedTime").val(result.results[0].foundedTime.substr(0, 10));
                var categoryVal = result.results[0].category;
                $("#div_publishCategory").find("input[type='radio'][value='" + categoryVal + "']").prop("checked", "checked");
                if (result.results[0].isShow) {
                    $("#isShow").prop("checked", true);
                }
                else {
                    $("#isShow").prop("checked", false);
                }
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#endTime").val("");
                    $("#hiddenEndTime").val("");
                    
                }
                else {
                    $("#endTime").val(result.results[0].expiryDate.substr(0, 10));
                    $("#hiddenEndTime").val(result.results[0].expiryDate.substr(0, 10));
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

function InitLayDate() {
    laydate.skin('custom');//切换皮肤，请查看skins下面皮肤库
    laydate({
        elem: '#foundedTime', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: '1900-01-01', //最小日期
        max: laydate.now(), //最大日期
        start: laydate.now(),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#foundedTime").next().hide();
        }
    });
    laydate({
        elem: '#endTime', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: laydate.now(1), //最小日期
        max: '2999-01-01', //最大日期
        start: laydate.now(90),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#endTimefailInfo").hide();
            $("#hiddenEndTime").val(dates);
        }
    });
}
function PostDemandPublish() {
    if (!checkarearequire("main-content")) {
        return false;
    }

    ShowLoading();
    var demandId = getUrlParam("id");
    var companyName = $.trim($("#companyName").val());
    var contact = $.trim($("#contact").val());
    var phone = $.trim($("#phone").val());
    var email = $.trim($("#email").val());
    var foundedTime = $.trim($("#foundedTime").val());
    var member = $.trim($("#member").val());
    var intentionPartner = $.trim($("#intentionPartner").val());
    var projectDescription = $.trim($("#projectDescription").val());
    var demandDescription = $.trim($("#demandDescription").val());
    var isShow = $("#isShow").prop("checked");
    var expiryDate = $.trim($("#hiddenEndTime").val());
    var category = $("#div_publishCategory").find("input[type='radio']:checked").val();//Sachiel Add

    var demandPublish = {
        DemandID: demandId,
        CompanyName: companyName,
        Contacts: contact,
        Mobile: phone,
        Email: email,
        FoundedTime: foundedTime,
        Members: member,
        ProjectDescription: projectDescription,
        DemandDescription: demandDescription,
        IntentionPartner: intentionPartner,
        Status: "1",
        IsShow: isShow,
        ExpiryDate: expiryDate,
        Category: category
    };
    var formObj = {
        "DemandPublish": demandPublish,
        IsAdmin:true
    };
    var parameter = {
        requestUri: "/api/demandpublish",
        requestParameters: formObj
    }
    var submiturl = "/api/proxy/put";
    if (demandId == null || demandId == "") {
        submiturl = "/api/proxy/post";
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function () {
            $(this).alert("提交成功！");
            setTimeout(function () {
                window.opener.IniDemandData();
                window.close();
            }, 2000);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function DemandCancel() {
    window.close();
}