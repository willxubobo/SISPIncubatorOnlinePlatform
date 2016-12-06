$(function () {
    $("#searchValue").val();
    InitDemandData(demandpage,false);
    InitServiceData(servicepage, false);
});
var demandpage = 0;
var servicepage = 0;

function GetData() {
    $("#searchValue").val( $.trim($(".incubatorSearchIpt").val()));
    var type = $(".curTitle").children("div").text();
    if (type == "服务信息") {
        InitServiceData(0,false);
    } else {
        InitDemandData(0,false);
    }
}

function ClearSearchValue() {
    if ($(".incubatorSearchIpt").val().length == 0) {
        $("#searchValue").val();
    }
}

function InitDemandData(demandpage, loadmore) {
    ShowLoading();
    $("#demandNoDataDiv").hide();
    var searchObj = {
        PageSize: "10",
        PageNumber: demandpage,
        searchString: $("#searchValue").val()
    }
    var parameter = {
        requestUri: "/api/demandpublishs",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.results.length > 0) {
                GetDemandHtml(result.results, loadmore);
                CheckLoadMoreShowOrHide(result.results);
            } else {
                if (loadmore == false) {
                    $("#demandInformation").empty();
                    $("#demandNoDataDiv").show();
                }
                CheckLoadMoreShowOrHide(result.results);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
function InitServiceData(servicepage, loadmore) {
    ShowLoading();
    $("#serviceNoDataDiv").hide();
    var searchObj = {
        PageSize: "10",
        PageNumber: servicepage,
        searchString: $("#searchValue").val()
    }
    var parameter = {
        requestUri: "/api/servicepublishes",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null && result.results.length > 0) {
                GetServiceHtml(result.results, loadmore);
                CheckLoadMoreShowOrHide(result.results);
            } else {
                if (loadmore == false) {
                    $("#serviceInformation").empty();
                    $("#serviceNoDataDiv").show();
                }
                CheckLoadMoreShowOrHide(result.results);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
function GetDemandHtml(data, loadmore) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var companyName = data[i].companyName;
        var contacts = data[i].contacts;
        var mobile = data[i].mobile;
        var email = data[i].email;
        var category = data[i].category;
        var foundedTime = data[i].foundedTime.replace(/T/g, ' ').replace(/-/gm, '/').split(' ')[0];
        if (mobile != "") {
            html += "<li>\
                    <div class='SITxtBox' onclick=\"showdemandinfo('" + data[i].demandID + "')\";>\
                        <p class='SITitle'>" + companyName + "</p>\
                         <div class='SITxt'>\
                            <p class='leftSITxt'>联系人：<span>" + contacts + "</span></p>\
                            <p class='rightSITxt'>成立时间：<span>" + foundedTime + "</span></p>\
                        </div>\
                        <div class='SITxt'>\
                            <span>所属类别：</span><span>" + category + "</span>\
                         </div>\
                         <div class='SITxt'>\
                            <span>联系电话：</span><a class='tellEmail' href='tel:"+ mobile + "'>" + mobile + "</a>\
                         </div>\
                        <div class='SITxt'>\
                            <span>邮箱：</span><a class='tellEmail' href='mailto:"+ email + "'>" + email + "</a>\
                         </div>\
                     </div>\
                  </li>";
        }
        else {
            html += "<li>\
                    <div class='SITxtBox' onclick=\"showdemandinfo('" + data[i].demandID + "')\";>\
                        <p class='SITitle'>" + companyName + "</p>\
                         <div class='SITxt'>\
                            <p class='leftSITxt'>联系人：<span>" + contacts + "</span></p>\
                            <p class='rightSITxt'>成立时间：<span>" + foundedTime + "</span></p>\
                        </div>\
                        <div class='SITxt'>\
                            <span>所属类别：</span><span>" + category + "</span>\
                         </div>\
                         <div class='SITxt'>\
                            <span>联系电话：登陆可见</span>\
                         </div>\
                        <div class='SITxt'>\
                            <span>邮箱：登陆可见</span>\
                         </div>\
                     </div>\
                  </li>";
        }

    }
    if (loadmore == false) {
        $("#demandInformation").children().remove();
    }
    $("#demandInformation").append(html);
}
function GetServiceHtml(data, loadmore) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var companyName = data[i].companyName;
        var industry = data[i].industryName;
        var mobile = data[i].phoneNumber;
        var email = data[i].email;
        var category = data[i].category;
        if (mobile != "") {
            html += "<li>\
                    <div class='SITxtBox' onclick=\"showserviceinfo('" + data[i].serviceID + "');\">\
                        <p class='SITitle'>" + companyName + "</p>\
                         <div class='SITxt'>\
                            <p class='leftSITxt'>所属行业：<span>" + industry + "</span></p>\
                            <p class='rightSITxt'>所属类别：<span>" + category + "</span></p>\
                        </div>\
                         <div class='SITxt'>\
                            <span>联系电话：</span><a class='tellEmail' href='tel:"+ mobile + "'>" + mobile + "</a>\
                         </div>\
                        <div class='SITxt'>\
                            <span>邮箱：</span><a class='tellEmail' href='mailto:"+ email + "'>" + email + "</a>\
                         </div>\
                     </div>\
                  </li>";
        }
        else {
            html += "<li>\
                    <div class='SITxtBox' onclick=\"showserviceinfo('" + data[i].serviceID + "');\">\
                        <p class='SITitle'>" + companyName + "</p>\
                         <div class='SITxt'>\
                            <p class='leftSITxt'>所属行业：<span>" + industry + "</span></p>\
                            <p class='rightSITxt'>所属类别：<span>" + category + "</span></p>\
                        </div>\
                         <div class='SITxt'>\
                            <span>联系电话：登陆可见</span>\
                         </div>\
                        <div class='SITxt'>\
                            <span>邮箱：登陆可见</span>\
                         </div>\
                     </div>\
                  </li>";
        }

    }
    if (loadmore == false) {
        $("#serviceInformation").children().remove();
    }
    $("#serviceInformation").append(html);
}
function ClickLoadDemandMore() {
    demandpage = demandpage + 1;
    InitDemandData(demandpage,true);
}

function ClickLoadServiceMore() {
    servicepage = servicepage + 1;
    InitServiceData(servicepage, true);
}

//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($(".projectList li").length < 10 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}
function showserviceinfo(id) {
   window.location.href = "servicedetail.html?id=" + id;
}
function showdemandinfo(id) {
   window.location.href = "demanddetail.html?id=" + id;
}

