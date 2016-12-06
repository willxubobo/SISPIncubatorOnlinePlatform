$(function () {
    CheckUserLogin();
    $("#startTime").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        onSelect: function (valueText, inst) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var startdate = new Date(year + '/' + month + '/' + day)
            var startTime = startdate.Format("yyyy-MM-dd");
            var result = (new Date(valueText) - startdate) / (24 * 60 * 60 * 1000);

            if (result < 7) {
                $("#startTime").next().html("必须晚于当前时间一周！");
                $("#startTime").next().show();
            } else {
                $("#startTime").next().hide();
                $("#hiddenStartTime").val(valueText);
                var hiddenEndTime = $.trim($("#hiddenEndTime").val());
                if (new Date(hiddenEndTime) >= startdate) {
                    $("#endTime").next().hide();
                }
                if (hiddenEndTime != "") {
                    if (new Date(valueText) > new Date(hiddenEndTime)) {
                        $("#startTime").next().html("开始日期不能大于结束日期！");
                        $("#startTime").next().show();
                    }
                }
            }
        }
    });
    $("#endTime").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        onSelect: function (valueText, inst) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var enddate = new Date(year + '/' + month + '/' + day);
            var endTime = enddate.Format("yyyy-MM-dd");
            var result = (new Date(valueText) - enddate) / (24 * 60 * 60 * 1000);
            if (result < 7) {
                $("#endTime").next().html("必须晚于当前时间一周！");
                $("#endTime").next().show();
            } else {
                $("#endTime").next().hide();
                $("#hiddenEndTime").val(valueText);
                var hiddenStartime = $.trim($("#hiddenStartTime").val());
                if (new Date(hiddenStartime) >= enddate) {
                    $("#startTime").next().hide();
                }
                if (hiddenStartime != "") {
                    if (new Date(valueText) < new Date(hiddenStartime)) {
                        $("#endTime").next().html("开始日期不能大于结束日期！");
                        $("#endTime").next().show();
                    }
                }
            }
        }
    });
    InitCheckBox();
    InitRemark();
});
function GetInfo(activityId) {
    ShowLoading();
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
                $("#member").val(result.results[0].member);
                $("#sponsor").val(result.results[0].sponsor);
                $("#cosponsor").val(result.results[0].co_sponsor);
                $("#startTime").val(result.results[0].startTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                $("#endTime").val(result.results[0].endTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                $("#timeBucket").val(result.results[0].timeBucket);
                $("#activitydescription").val(result.results[0].activityDescription);
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
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function GetImgs(activityId) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/activityimages/" + activityId,
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
                var data = result.results;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html = "<li>\
                        <div class='incubatorPic'>\
                        <img src='" + data[i].sThumb + "'>\
                        <a class='removeBtn' onclick='removeImg(this)' src='" + data[i].imgSrc + "' ></a>\
                        </div>\
                    </li>";
                    $(".addIncubatorBtn").parent().before(html);
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
function PostActivity() {
    if (!checkrequire()) {
        return false;
    }
    if (!CheckDateTime()) {
        return false;
    }
    if (!checkImgs()) {
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
    var activitydescription = $.trim($("#activitydescription").val());
    var demandforspace = $.trim($("#demandforspace").val());
    var demandforstall = $.trim($("#demandforstall").val());
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
    var medid = "";
    var filename = "";
    $(".hidmedid").each(function () {
        medid += $(this).val() + ",";
        filename += guid() + ",";
    });
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
        ActivityDescription: activitydescription,
        DemandForSpace: demandforspace,
        DemandForStall: demandforstall,
        FreeItem: freeItem,
        ChargeItem: chargeItem,
        Status: "1",
        ActivityID: activityId,
        Origin: "WeChat"
    };
    var formObj = {
        "IncubatorActivityApply": incubatorActivityApply
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
                UpLoadImg(result.id, medid, filename);
            } else {
                UpLoadImg(activityId, medid, filename);
            }
            HideLoading();

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
                GetImgs(activityId);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}