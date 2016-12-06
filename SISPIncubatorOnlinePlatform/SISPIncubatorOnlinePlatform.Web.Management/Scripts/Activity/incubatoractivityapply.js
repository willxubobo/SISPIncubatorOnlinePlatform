$(function () {
    InitLayDate();
    InitCheckBox();
    ue = UE.getEditor('container');
    CheckUserLogin();
});
var ue = "";

function GetInfo(activityId) {
    var parameter = {
        "requestUri": "/api/incubatoractivityapply/" + activityId,
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
            if (result != null && result.results.length > 0) {
                $("#companyName").val(result.results[0].companyName);
                $("#address").val(result.results[0].address);
                $("#email").val(result.results[0].email);
                $("#phone").val(result.results[0].phoneNumber);
                $("#topic").val(result.results[0].topic);
                $("#member").val(result.results[0].participants);
                $("#sponsor").val(result.results[0].sponsor);
                $("#cosponsor").val(result.results[0].co_sponsor);
                $("#startTime").val(result.results[0].startTime.substr(0, 10));
                $("#endTime").val(result.results[0].endTime.substr(0, 10));
                $("#timeBucket").val(result.results[0].timeBucket);
                $("#remark").val(result.results[0].remark);
                ue.setContent(result.results[0].activityDescription, true);
                $("#demandforspace").val(result.results[0].demandForSpace);
                $("#demandforstall").val(result.results[0].demandForStall);
                $("#hiddenStartTime").val(result.results[0].startTime);
                $("#hiddenEndTime").val(result.results[0].endTime);
                var industry = result.results[0].industry;
                var free = result.results[0].freeItem;
                var chargeItem = result.results[0].chargeItem;
                if (industry != "") {
                    var industryArry = industry.split(",");
                    for (var i = 0; i < industryArry.length; i++) {
                        $("input[value='" + industryArry[i] + "']").prop("checked", true);
                    }
                }
                if (free != "") {
                    var freeArry = free.split(",");
                    for (var i = 0; i < freeArry.length; i++) {
                        $("input[value='" + freeArry[i] + "']").prop("checked", true);
                    }
                }
                if (chargeItem != "") {
                    var chargeItemArry = chargeItem.split(",");
                    for (var i = 0; i < chargeItemArry.length; i++) {
                        $("input[value='" + chargeItemArry[i] + "']").prop("checked", true);
                    }
                }
            }
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function InitCheckBox() {
    ShowLoading();
    var dictionary = {
        Industry: "Industry",
        Free: "Free",
        ChargeItem: "ChargeItem"
    }
    var parameter = {
        requestUri: "/api/informations/activity",
        requestParameters: dictionary
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            var industrydata = result.results.industry;
            var industryhtml = "";
            for (var i = 0; i < industrydata.length; i++) {
                industryhtml += "<div class='checkDiv'><input class='baseCheckBox' type='checkbox' name='Industry' value=" + industrydata[i].id + " /><label class='checkBoxTxt'>" + industrydata[i].value + "</label></div>";
            }
            $("#industry").append(industryhtml);
            $("[name='Industry']:checkbox").each(function () {
                $(this).click(function () {
                    if ($("input[name='Industry']:checked").length > 0) {
                        $("#industryfailInfo").hide();
                    }
                });
            });
            var freedata = result.results.free;
            var freedatahtml = "";
            for (var i = 0; i < freedata.length; i++) {
                freedatahtml += "<div class='checkDiv'><input class='baseCheckBox' type='checkbox' name='FreeItem' value=" + freedata[i].id + " /><label class='checkBoxTxt'>" + freedata[i].value + "</label></div>";
            }
            $("#freeItem").append(freedatahtml);
            var chargeItemdata = result.results.chargeItem;
            var html = "";
            for (var i = 0; i < chargeItemdata.length; i++) {
                html += "<div class='checkDiv'><input class='baseCheckBox' type='checkbox' name='ChargeItem' value=" + chargeItemdata[i].id + " /><label class='checkBoxTxt'>" + chargeItemdata[i].value + "</label></div>";
            }
            $("#chargeItem").append(html);
            var activityId = getUrlParam("id");
            if (activityId != null && activityId != "") {
                GetInfo(activityId);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function PostActivity() {
    if (!checkarearequire("main-content")) {
        return false;
    }
    if (!CheckDateTime()) {
        return false;
    }
    var industry = "";
    $("#industry :checked").each(function () {
        industry += $(this).val() + ",";
    });
    if (industry != "") {
        industry = industry.substring(0, industry.length - 1);
    } else {
        $("#industryfailInfo").show();
        return false;
    }
    ShowLoading();
    var companyName = $.trim($("#companyName").val());
    var address = $.trim($("#address").val());
    var email = $.trim($("#email").val());
    var phone = $.trim($("#phone").val());
    var topic = $.trim($("#topic").val());
    var sponsor = $.trim($("#sponsor").val());
    var cosponsor = $.trim($("#cosponsor").val());
    var member = $.trim($("#member").val());
    var startTime = $.trim($("#startTime").val());
    var endTime = $.trim($("#endTime").val());
    var timeBucket = $.trim($("#timeBucket").val());
    var remark = $.trim($("#remark").val());
    var activitydescription = ue.getPlainTxt();
    var demandforspace = $.trim($("#demandforspace").val());
    var demandforstall = $.trim($("#demandforstall").val());
    var isShow = $("#isShow").attr("checked");
    var activityId = getUrlParam("id");
    var freeItem = "";
    $("#freeItem :checked").each(function () {
        freeItem += $(this).val() + ",";
    });
    if (freeItem != "") {
        freeItem = freeItem.substring(0, freeItem.length - 1);
    }
    var chargeItem = "";
    $("#chargeItem :checked").each(function () {
        chargeItem += $(this).val() + ",";
    });
    if (chargeItem != "") {
        chargeItem = chargeItem.substring(0, chargeItem.length - 1);
    }
    var incubatorActivityApply = {
        CompanyName: companyName,
        Address: address,
        Mobile: phone,
        Email: email,
        PhoneNumber: phone,
        Topic: topic,
        Sponsor: sponsor,
        Co_sponsor: cosponsor,
        Participants: member,
        Industry: industry,
        StartTime: startTime,
        EndTime: endTime,
        TimeBucket: timeBucket,
        Remark: remark,
        ActivityDescription: activitydescription,
        DemandForSpace: demandforspace,
        DemandForStall: demandforstall,
        FreeItem: freeItem,
        ChargeItem: chargeItem,
        Status: "1",
        ActivityID: activityId,
        Origin: "Web"
    };
    var formObj = {
        "IncubatorActivityApply": incubatorActivityApply,
         IsAdmin: true
    };
  
    var parameter = {
        requestUri: "/api/incubatorActivityApply",
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    var submiturl = "/api/proxy/put";
    if (activityId == null || activityId == "") {
        submiturl = "/api/proxy/post";
    }
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            if (result != null && result != "") {
                $(this).alert("提交成功！");
                setTimeout(function () {
                    window.opener.InitGetActivityData();
                    window.close();
                }, 2000);
            } 
            HideLoading();

        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function ActivityCancel() {
    window.close();
}

function InitLayDate() {
    laydate.skin('custom');//切换皮肤，请查看skins下面皮肤库
    laydate({
        elem: '#startTime', //需显示日期的元素选择器
        event: 'click', //触发事件
        format: 'YYYY-MM-DD', //日期格式
        istime: false, //是否开启时间选择
        isclear: true, //是否显示清空
        istoday: true, //是否显示今天
        issure: false, //是否显示确认
        festival: false, //是否显示节日
        min: laydate.now(7), //最小日期
        max: '2999-01-01', //最大日期
        start: laydate.now(7),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#startTimefailInfo").hide();
            $("#hiddenStartTime").val(dates);
            if ($("#endTime").val() != "" && new Date($("#startTime").val()) > new Date($("#endTime").val())) {
                $("#startTimefailInfo").html("开始日期不能大于结束日期！");
                $("#startTimefailInfo").show();
            }
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
        min: laydate.now(7), //最小日期
        max: '2999-01-01', //最大日期
        start: laydate.now(7),    //开始日期
        fixed: false, //是否固定在可视区域
        zIndex: 99999999, //css z-index
        choose: function (dates) { //选择好日期的回调
            $("#endTimefailInfo").hide();
            $("#hiddenEndTime").val(dates);
            if ($("#startTime").val() != "" && new Date($("#startTime").val()) > new Date($("#endTime").val())) {
                $("#endTimefailInfo").html("开始日期不能大于结束日期！");
                $("#endTimefailInfo").show();
            }
        }
    });
}