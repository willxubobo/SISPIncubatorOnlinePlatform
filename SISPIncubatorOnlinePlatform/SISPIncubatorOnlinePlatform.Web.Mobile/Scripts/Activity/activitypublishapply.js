$(function () {
    CheckUserLogin();
    $("#startTime").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
        maxDate: new Date(new Date().getFullYear()+10, new Date().getMonth(), new Date().getDate()),
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
        minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 7),
        maxDate: new Date(new Date().getFullYear() + 10, new Date().getMonth(), new Date().getDate()),
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
    InitIndustryCheckBox();
    InitRemark();
});
function GetInfo(activityId) {
    ShowLoading();
    var parameter = {
        "requestUri": "/api/activitypublishapply/" + activityId,
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
                $("#sponsor").val(result.results[0].sponsor);
                $("#cosponsor").val(result.results[0].co_sponsor);
                $("#startTime").val(result.results[0].startTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                $("#endTime").val(result.results[0].endTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                $("#timeBucket").val(result.results[0].timeBucket);
                $("#activitydescription").val(result.results[0].activityDescription);
                $("#hiddenStartTime").val(result.results[0].startTime);
                $("#hiddenEndTime").val(result.results[0].endTime);
                var industry = result.results[0].industry;
                if (industry != "") {
                    var industryArry = industry.split(",");
                    for (var i = 0; i < industryArry.length; i++) {
                        $("input[value='" + industryArry[i] + "']").prop("checked", true);
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
                        <img src='" + data[i].sThumb +"'>\
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
    var medid = "";
    var filename = "";
    $(".hidmedid").each(function () {
        medid += $(this).val() + ",";
        filename += guid() + ",";
    });
    var activityId = getUrlParam("id");
    var companyName = $.trim($("#companyName").val());
    var address = $.trim($("#address").val());
    var email = $.trim($("#email").val());
    var phone = $.trim($("#phone").val());
    var topic = $.trim($("#topic").val());
    var sponsor = $.trim($("#sponsor").val());
    var cosponsor = $.trim($("#cosponsor").val());
    var startTime = $.trim($("#startTime").val());
    var endTime = $.trim($("#endTime").val());
    var timeBucket = $.trim($("#timeBucket").val());
    var activitydescription = $.trim($("#activitydescription").val());
    var activitypublishapply = {
        CompanyName: companyName,
        Address: address,
        Mobile: phone,
        Email: email,
        PhoneNumber: phone,
        Topic: topic,
        Sponsor: sponsor,
        Co_sponsor: cosponsor,
        Industry: industry,
        StartTime: startTime,
        EndTime: endTime,
        TimeBucket:timeBucket,
        ActivityDescription: activitydescription,
        Status: "1",
        ActivityID: activityId,
        Origin: "WeChat"
    };
    var formObj = {
        "ActivityPublishApply": activitypublishapply
    };
    var parameter = {
        requestUri: "/api/activitypublishapply",
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


function InitIndustryCheckBox() {
    ShowLoading();
    var dictionary = {
        Key: "Industry"
    }
    var parameter = {
        requestUri: "/api/informations",
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
            if (result != null && result.results.length > 0) {
                var data = result.results;
                var html = "";
                for (var i = 0; i < data.length; i++) {
                    html += "<div class='checkDiv'><input class='baseCheckBox' type='checkbox' name='Industry' value=" + data[i].id + " /><label class='checkBoxTxt'>" + data[i].value + "</label></div>";
                }
                $("#industry").append(html);
                $("[name='Industry']:checkbox").each(function () {
                    $(this).click(function () {
                        if ($("input[name='Industry']:checked").length > 0) {
                            $("#industryfailInfo").hide();
                        }
                    });
                });
                var activityId = getUrlParam("id");
                if (activityId != null && activityId != "") {
                    GetInfo(activityId);
                    GetImgs(activityId);
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


    