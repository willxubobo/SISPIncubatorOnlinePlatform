$(function () {
    CheckUserLogin();
    $("#foundedTime").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        maxDate: new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate()),
        onSelect: function (valueText, inst) {
            $(this).next().hide();
        }
    });
    $("#expiryDate").mobiscroll().date({
        theme: "default",
        lang: "zh",
        mode: "scroller",
        display: "bottom",
        animate: "fade",
        maxDate: new Date(new Date().getFullYear() + 3, new Date().getMonth(), new Date().getDate()),
        onSelect: function (valueText, inst) {
            $(this).next().hide();
        }
    });
    var demandId = getUrlParam("id");
    if (demandId != null && demandId != "") {
        GetInfo(demandId);
    }
});
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
            if (result != null && result.results.length > 0) {
                $("#companyName").val(result.results[0].companyName);
                $("#contact").val(result.results[0].contacts);
                $("#phone").val(result.results[0].mobile);
                $("#email").val(result.results[0].email);
                $("#projectDescription").val(result.results[0].projectDescription);
                $("#member").val(result.results[0].members);
                $("#intentionPartner").val(result.results[0].intentionPartner);
                $("#projectDescription").val(result.results[0].projectDescription);
                $("#demandDescription").val(result.results[0].demandDescription);
                $("#foundedTime").val(result.results[0].foundedTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").val("有效时间：");
                }
                else {
                    $("#expiryDate").val("有效时间：" + result.results[0].expiryDate.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0]);
                }
                var categoryVal = result.results[0].category;
                $("#div_publishCategory").find("input[type='radio'][value='" + categoryVal + "']").prop("checked", "checked");
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function PostDemandPublish() {
    if (!checkrequire()) {
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
    var expiryDate = $.trim($("#expiryDate").val());
    var category = $("#div_publishCategory").find("input[type='radio']:checked").val();//Sachiel Add

    var demandPublish = {
        DemandID:demandId,
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
        ExpiryDate: expiryDate,
        Category: category,
    };
    var formObj = {
        "DemandPublish": demandPublish
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
            gotosuccesspage();
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}