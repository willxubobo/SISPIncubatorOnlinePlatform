var myScroll,
        upIcon = $("#up-icon"),
        downIcon = $("#down-icon");

var page = 1;


$(function () {

    CheckUserLogin();

    $("#txtCompanyPhone,#txtPhone").bind("keyup", function () {
        this.value = this.value.replace(/[^\d-]/g, "");
    });
    //获取团队人数
    GetTeamMembers();

    InitRedirectIncubator();


    var id = getUrlParam("rid");
    if ($.trim(id) != "") {
        $(".btnDeleteApply").removeClass("hide");
        $("#hidApplyId").val(id);
        LoadModifyData();
    }
    //GetData(page);
});

//处理其他页面跳转过来的功能
function InitRedirectIncubator() {
    var incubatorId = getUrlParam("infoid");
    if (incubatorId != null) {
        var parameter = {
            requestUri: "/api/incubator/" + incubatorId,
            requestParameters: incubatorId
        }
        var jsonData = JSON.stringify(parameter);
        $.ajax(
           {
               type: "POST",
               url: "/api/proxy/get/anonymous",
               data: jsonData,
               contentType: "application/json; charset=utf-8",
               success: function (data) {
                   var results = data.results;
                   var logo = results[0].logo;
                   var html = "";
                   var index = logo.lastIndexOf(".");
                   var frontPart = logo.substring(0, index);
                   var newLog = frontPart + "_s.jpg";

                   html += "<li class='incubatorItem'><div class=\"incubatorPic\"><img  src='" + newLog + "'  alt=\"\"/>";
                   html += " <a class=\"removeBtn\" onclick='RemoveIncubatorItem(this);' href='#'></a></div>";
                   html += "<div class=\"incubatorTxt\">" + (results[0].incubatorName.length > 10 ? results[0].incubatorName.substring(0,9) + "..." : results[0].incubatorName) + "</div><input type=\"hidden\" value='" + incubatorId + "' id=\"hidValue\"/></li>";

                   $(".aSelectIncubator").parent().before(html);
               },
               error: function (err) {
                   ErrorResponse(err);
               }
           });

      
    }
}

function SubmitForm() {
    var a16 = true;
    if ($(".incubatorItem").length <= 0) {
        $(".divIncubatorTips").show();
        a16 = false;
    }
    if (!checkrequire() || !a16) return;
    var applyId = $("#hidApplyId").val();

    ShowLoading();
    //提交，再次提交
    if ($.trim(applyId) == "") {
        SubmitAndSaveForm();
    } else {
        ReSubmitAndSaveForm();
    }
}

//提交保存
function SubmitAndSaveForm() {

    var incubatorArray = "";
    $(".incubatorItem").each(function () {
        var id = $(this).find("#hidValue").val();
        incubatorArray = incubatorArray + ";" + id;
    });

    var incubatorObj = {
        ProjectName: $("#txtProjectName").val(),
        CompanyName: $("#txtCompanyName").val(),
        CompanyTel: $("#txtCompanyPhone").val(),
        ProjectOwner: $("#txtProjectOwner").val(),
        ContactTel: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        TeamMembers: $(".selectTeamNumber").val(),
        ProductDescription: $("#txtProductDescription").val(),
        CoreStaffResume: $("#txtCoreStaffResume").val(),
        MarketRiskAnalysis: $("#txtMarketRiskAnalysis").val(),
        FinancingSituation: $("#txtFinancingSituation").val()
    };

    var formObj = {
        "IncubatorApply": incubatorObj,
        Incubators: incubatorArray
    };

    var parameter = {
        requestUri: "/api/incubatorapply",
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
            gotosuccesspage();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//再次提交保存
function ReSubmitAndSaveForm() {
    var applyId = $("#hidApplyId").val();

    var incubatorObj = {
        ApplyID:applyId,
        ProjectName: $("#txtProjectName").val(),
        CompanyName: $("#txtCompanyName").val(),
        CompanyTel: $("#txtCompanyPhone").val(),
        ProjectOwner: $("#txtProjectOwner").val(),
        ContactTel: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        TeamMembers: $(".selectTeamNumber").val(),
        ProductDescription: $("#txtProductDescription").val(),
        CoreStaffResume: $("#txtCoreStaffResume").val(),
        MarketRiskAnalysis: $("#txtMarketRiskAnalysis").val(),
        FinancingSituation: $("#txtFinancingSituation").val(),
        ApplyStatus:"resumbit"
    };

    var formObj = {
        "IncubatorApply": incubatorObj
    };

    var parameter = {
        requestUri: "/api/incubatorapply",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/put",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            gotosuccesspage();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}

//取消
function Cancel() {
   window.location.href = 'incubatorlist.html';
}
//初始化团队人数选择
function GetTeamMembers() {

    ShowLoading();

    var formObj = {
        Key: "TeamMember",
        PageNumber: 1,
        PageSize: 10000
    };

    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post/anonymous",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var results = data.results;
            var html = "";
            for (var i = 0; i < results.length; i++) {
                html += "<option value='" + results[i].value + "'>" + results[i].value + "</option>";
            }
            $(".selectTeamNumber").append(html);

            $("#selectBtn").mobiscroll().select({
                theme: "default",
                lang: "zh",
                mode: "scroller",
                display: "bottom",
                animate: "fade"
            });
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}


function GetData(page) {

    var searchObj = {
        PageSize: "20",
        PageNumber: page,
        KeyWord: ""
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/incubators",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var results = data.results;
            GetHtml(results);
            CheckLoadMoreShowOrHide(results);
            //$(".popupBox").height($(window).height());
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });

}

function GetHtml(data) {
    var html = "";
    var mm = 0;
    var allhtml = "";

    var html = "";
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {

        if (mm < 2) {
            var logo = data[i].logo;

            var index = logo.lastIndexOf(".");
            var frontPart = logo.substring(0, index);
            var newLog = frontPart + "_s.jpg";

            htmlItem += "<td><div class=\"incubatorPic\"><img id='" + data[i].incubatorID + "' src='" + newLog + "' onclick='SelectOne(this)' />";
            htmlItem += "</div><div class=\"incubatorTxt\">" + data[i].incubatorName + "</div></td>";
            if (mm == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.tabIncubatorList').append(html);
                htmlItem = "";
                mm = 0;
                continue;
            }

            if ((data.length - i == 1) && data.length % 2 == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.tabIncubatorList').append(html);
                htmlItem = "";
            }
            mm++;
        }
    }
    if (data.length == 0 && page == 1) {
        $("#divbusinessList").show();
    } else {
        $("#divbusinessList").hide();
    }
}

//点击加载更多 
function ClickLoadMore() {
    page = page + 1;
    GetData(page);
}
//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($(".tabIncubatorList td").length < 20 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

//点击图标标识
function SelectOne(obj) {

    var nextObj = $(obj).next("a");
    if (nextObj.length > 0) {
        $(obj).next().remove();
    } else {
        $(obj).after("<a class=\"picCheckBtn\"></a>");
    }
}

function CancelLayer() {
    page = 1;
    $(".picCheckBtn").remove();
    $(".divLayerIncubator").addClass("hide");
    $(".wrap").css("overflow", "auto");
    $(".wrap").css("height", "auto");
    HideLoading();
}

function OpenLayer() {

    ShowLoading();
    $('.tabIncubatorList tr').empty();

    $(".divLayerIncubator").removeClass("hide");

    var H = $(window).height();
    $(".wrap").css("height", H);
    $(".wrap").css("overflow", "hidden");

    GetData(page);
}

function SaveOk() {
    var checkItem = $(".picCheckBtn");
    var html = "";
    checkItem.each(function () {
        var pObj = $(this).parent();
        var id = pObj.find("img").attr("id");
        var path = pObj.find("img").attr("src");
        var name = pObj.next(".incubatorTxt").html();

        var isExist = false;

        $(".incubatorItem").each(function () {
            var itemId = $(this).find("#hidValue").val();
            if (id == itemId) {
                isExist = true;
            }
        });
        if (!isExist) {
            html += "<li class='incubatorItem'><div class=\"incubatorPic\"><img onclick=\"OpenInucubatorInfo('" + id + "')\" src='" + path + "'  alt=\"\"/>";
            html += " <a class=\"removeBtn\" onclick='RemoveIncubatorItem(this);' href='#aAgree'></a></div>";
            html += "<div class=\"incubatorTxt\">" + (name.length > 10 ? name.substring(0,9) + "..." : name) + "</div><input type=\"hidden\" value='" + id + "' id=\"hidValue\"/></li>";
        }
    });
    $(".aSelectIncubator").parent().before(html);
    CancelLayer();
    $(".divIncubatorTips").hide();
}
//删除
function RemoveIncubatorItem(obj) {
    $(obj).parent().parent().remove();
    $("#").focus();
}
//打开详情页面
function OpenInucubatorInfo(id) {
   window.location.href = 'incubatorinfo.html?id=' + id;
}

//
/*****重新发起页面开始****/
function LoadModifyData() {

    var id = $("#hidApplyId").val();
    var parameter = {
        requestUri: "/api/incubatorapply/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;

               $("#txtProjectName").val(results[0].projectName);
               $("#txtCompanyName").val(results[0].companyName);
               $("#txtCompanyPhone").val(results[0].companyTel);
               $("#txtProjectOwner").val(results[0].projectOwner);
               $("#txtPhone").val(results[0].contactTel);
               $("#txtEmail").val(results[0].email);
               $(".selectTeamNumber").val(results[0].teamMembers);
               $("#txtProductDescription").val(results[0].productDescription);
               $("#txtCoreStaffResume").val(results[0].coreStaffResume);
               $("#txtMarketRiskAnalysis").val(results[0].marketRiskAnalysis);
               $("#txtFinancingSituation").val(results[0].financingSituation);

               var html = "<li class='incubatorItem'><div class=\"incubatorPic\"><img onclick=\"OpenInucubatorInfo('" + results[0].incubatorID + "')\" src='" + results[0].incubatorLogoPath + "'  alt=\"\"/>";
               html += " </div>";
               html += "<div class=\"incubatorTxt\">" + (results[0].incubatorName.length > 10 ? results[0].incubatorName.substring(0,9) + "..." : results[0].incubatorName) + "</div><input type=\"hidden\" value='" + results[0].incubatorID + "' id=\"hidValue\"/></li>";
               $(".aSelectIncubator").parent().before(html);

               $("#selectBtn").mobiscroll().select({
                   theme: "default",
                   lang: "zh",
                   mode: "scroller",
                   display: "bottom",
                   animate: "fade"
               });

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
    $(".aSelectIncubator").removeClass("addIncubatorBtn").addClass("hide");
}
/*****重新发起页面结束****/

//删除申请
function DeleteIncubatorAppply() {
    var id = $("#hidApplyId").val();
    var parameter = {
        requestUri: "/api/incubatorapply/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/delete",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
              window.location.href = "../myapply.html";
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//function SearchByKeys() {
//    page = 1;
//    $('.tabIncubatorList').html("");
//    GetData(page);
//}