$(function () {
    InitServiceDemandData();
});
function InitServiceDemandData() {
    InitDemandData(demandpage);
    InitServiceData(servicepage);
    tabSwiper();
    InitEventByKeyUp();
}

function pagePagination(p) {
    pageNo = p;
    InitServiceData(pageNo - 1);
}
function pageDemandPagination(p) {
    pageNo = p;
    InitDemandData(pageNo - 1);
}
function InitEventByKeyUp() {
    $("#divService").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterservicefunction").val() + "()");
        }
    });
    $("#divDemand").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterdemandfunction").val() + "()");
        }
    });
}
var demandpage = 0;
var servicepage = 0;
function InitDemandData(demandpage) {
    //$("#demandNoDataDiv").hide();
    var searchObj = {
        PageSize: "10",
        PageNumber: demandpage,
        searchString: $("#searchDemandValue").val()
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
            $("#demandbusiness").empty();
            if (result.results && result.results.length > 0) {
                $("#demandNoData").hide();
                GetDemandHtml(result.results);
            } else {
                $("#demandNoData").show();
            }
            pageinit(result.totalCount, "10", "demand_pager", "pageDemandPagination");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function InitServiceData(servicepage) {
    //$("#serviceNoDataDiv").hide();
    var searchObj = {
        PageSize: "10",
        PageNumber: servicepage,
        searchString: $("#searchServiceValue").val()
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
            $("#servicebusiness").empty();
            if (result.results && result.results.length > 0) {
                $("#serviceNoData").hide();
                GetServiceHtml(result.results);
            } else {
                $("#serviceNoData").show();
            }
            pageinit(result.totalCount, "10", "div_pager", "pagePagination");
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
function GetDemandHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var companyName = data[i].companyName;
        var img = data[i].imgUrl;
        var projectDescription = data[i].projectDescription;
        if (GetLength(projectDescription) > 210) {
            projectDescription = cutstr(data[i].projectDescription, 210);
        }
        var phone = data[i].mobile;
        var email = data[i].email;
        var id = data[i].demandID;
        if (GetLength(companyName) > 20) {
            html += "<tr><td rowspan='3' class='tdImg' style='width: 160px !important;'><a href='demanddetail.html?id=" + id + "' target='_blank'><img src='" + img + "' /></a></td><td colspan='4' class='tdCompanyTitle'><a href='demanddetail.html?id=" + id + "' target='_blank' title='" + companyName + "'>" + cutstr(companyName, 20) + "</a></td></tr>";
        }
        else {
            html += "<tr><td rowspan='3' class='tdImg' style='width: 160px !important;'><a href='demanddetail.html?id=" + id + "' target='_blank'><img src='" + img + "' /></a></td><td colspan='4' class='tdCompanyTitle'><a href='demanddetail.html?id=" + id + "' target='_blank'>" + companyName + "</a></td></tr>";
        }
        html += "<tr><td colspan='4' class='tdCompanyContent'  title='" + data[i].projectDescription + "'>" + projectDescription + "</td></tr>";
        html += "<tr><td colspan='4' class=''  title='" + data[i].projectDescription + "'>所属类别：" + data[i].category + "</td></tr>";
        if (phone != "") {
            html += "<tr class='trBorderBottom'><td class='lastTd'></td><td>联系电话：<label>" + phone + "</label></td> <td colspan='2' >邮箱：<a href=\"mailto:" + email + "\"><span class=\"spanFlag\">" + email + "</span></a></td><td></td></tr>";
        }

    }
    $("#demandbusiness").append(html);
}

function GetServiceHtml(data) {
    var html = "";
    for (var i = 0; i < data.length; i++) {
        var industry = data[i].industryName;
        var companyName = data[i].companyName;
        var img = data[i].imgUrl;
        var description = data[i].description;
        if (GetLength(description) > 210) {
            description = cutstr(data[i].description, 210);
        }
        var phone = data[i].phoneNumber;
        var email = data[i].email;
        var category = data[i].category;
        var id = data[i].serviceID;
        html += "<tr><td rowspan='2' class='tdImg'><a href='servicedetail.html?id=" + id + "' target='_blank'><img src='" + img + "' /></a></td><td colspan='4' class='tdCompanyTitle'><a href='servicedetail.html?id=" + id + "' target='_blank'>" + companyName + "</a></td></tr>";
        html += "<tr><td colspan='4' class='tdCompanyContent' title='" + data[i].description + "'>" + description + "</td></tr>";
        if (GetLength(industry) > 12) {
            html += "<tr class='trBorderBottom'><td class='lastTd'></td><td>所属行业：<span title='" + industry + "'>" + cutstr(industry, 12) + "</span></td> <td>所属类别：<span>" + category + "</span></td>";
        }
        else {
            html += "<tr class='trBorderBottom'><td class='lastTd'></td><td>所属行业：<span>" + industry + "</span></td> <td>所属类别：<span>" + category + "</span></td>";
        }
        if (phone != "") {
            html += "<td>联系电话：<label>" + phone + "</label></td> <td>邮箱：<a href=\"mailto:" + email + "\"><span class=\"spanFlag\">" + email + "</span></a></td></tr>";
        }
        else {
            html += "<td></td> <td></td></tr>";
        }

    }
    $("#servicebusiness").append(html);
}
function tabSwiper() {
    $(".tabs-title-box .tab-title:first").addClass("tab-cur");
    $(".tabs-content-box>.tabs-content").not(":first").hide();
    $(".tabs-title-box>.tab-title").click(function () {
        $(this).addClass("tab-cur").siblings().removeClass("tab-cur");
        var index = $(".tabs-title-box>.tab-title").index(this);
        $(".tabs-content-box>.tabs-content").eq(index).show().siblings().hide();
    });

    $(".div_business_tab>div:first").addClass("selected");
    $(".div_business_tab_content>.div_business_content").not(":first").hide();
    $(".div_business_tab>div").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(".div_business_tab>div").index(this);
        $(".div_business_tab_content>.div_business_content").eq(index).show().siblings().hide();
    });

    $(".Ser_div_tab_content>div:first").addClass("selected");
    $(".Ser_div_content-box>div").not(":first").hide();
    $(".Ser_div_tab_content>div").click(function () {
        $(this).addClass("selected").siblings().removeClass("selected");
        var index = $(".Ser_div_tab_content>div").index(this);
        $(".Ser_div_content-box>div").eq(index).show().siblings().hide();
    });
    $(".tab-title-box>.tab-title:first").addClass("on");
    $(".tab-content-box>.tab-content").not(":first").hide();
    $(".tab-title-box>.tab-title").click(function () {
        $(this).addClass("on").siblings().removeClass("on");
        var index = $(".tab-title-box>.tab-title").index(this);
        $(".tab-content-box>.tab-content").eq(index).show().siblings().hide();
    });
}

function showserviceinfo(id) {
    window.location.href = "servicedetail.html?id=" + id;
}
function showdemandinfo(id) {
    window.location.href = "demanddetail.html?id=" + id;
}

function SearchServiceData() {
    $("#servicebusiness").empty();
    $("#searchServiceValue").val($.trim($("#txtServiceCondition").val()));
    pagePagination(1);
}
function SearchDemandData() {
    $("#demandbusiness").empty();
    $("#searchDemandValue").val($.trim($("#txtDemandCondition").val()));
    pageDemandPagination(1);

}

function GetAdvertisement() {
    ///Type:home(首页),investment(投资机构),cooperation(业务合作),financing(融资项目),
    var ps = 100000;
    var searchObj = {
        PageSize: ps,
        PageNumber: 1,
        KeyWord: "",
        Type: "cooperation"
    }
    var parameter = {
        requestUri: "/api/advertisements",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               if (results) {
                   GetHtml(results);
               }
               InitPlug();
               HideLoading();
           },
           error: function (err) {
               HideLoading();
               ErrorResponse(err);
           }
       });
}

//获取我的孵化器列表的html
function GetHtml(data) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {

        var url = data[i].url;
        if (data[i].picture != "") {
            url = data[i].picture;
        }

        if ($.trim(url) != "") {
            htmlItem += "<li><a onclick=\"ShowInfo('" + data[i].adid + "')\" style='cursor: pointer' target=\"_blank\"><img src=\"" + url + "\" /></a></li>";
        } else {
            htmlItem += "<li><a onclick=\"ShowInfo('" + data[i].adid + "')\" style='cursor: pointer' target=\"_blank\"><img src=\"images/pc/banner1.jpg\" /></a></li>";
        }
    }
    if ($.trim(htmlItem) != "") {
        $(".In_div_bannerImg").html(htmlItem);
    } else {
        $(".In_div_bannerImg").html("<li><a  target=\"_blank\"><img src=\"images/pc/banner1.jpg\" /></a></li>");
    }

}
