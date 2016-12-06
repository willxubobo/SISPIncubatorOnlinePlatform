$(function () {
    if (!CheckUserLogin()) {
        return false;
    }
    InitMyFollowData();
    InitEventByKeyUp();
})

function InitEventByKeyUp() {
    $("#divProjecr").bind('keyup', function (event) {
            if (event.keyCode == 13) {
                eval("" + $("#enterprojectfunction").val() + "()");
            }
    });
    $("#divFollow").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterfollowfunction").val() + "()");
        }
    });
    $("#divFans").bind('keyup', function (event) {
        if (event.keyCode == 13) {
            eval("" + $("#enterfansfunction").val() + "()");
        }
    });
}

function InitMyFollowData() {
    pagePagination(1);
    pageFansPagination(1);
    pageInvestorPagination(1);
}
function pagePagination(p) {
    pageNo = p;
    InitFollowData(pageNo-1);
}
function pageFansPagination(p) {
    pageNo = p;
    InitFansData(pageNo - 1);
}
function pageInvestorPagination(p) {
    pageNo = p;
    InitFollowInvestorData(pageNo - 1);
}
function InitFansData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        searchString: $("#searchFansValue").val()
    }
    var parameter = {
        requestUri: "/api/myfansfollows",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            GetFansHtml(result.results);
            pageinit(result.totalCount, "10", "div_demandpager", "pageFansPagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function InitFollowInvestorData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        searchString: $("#searchFollowValue").val()
    }
    var parameter = {
        requestUri: "/api/myinvestorfollows",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            GetInvestorHtml(result.results);
            pageinit(result.totalCount, "10", "div_secondpager", "pageInvestorPagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
    
}

function InitFollowData(page) {
    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        searchString: $("#searchProjectValue").val()
    }
    var parameter = {
        requestUri: "/api/myfinancingrequirementfollows",
        "requestParameters": searchObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            GettFollowHtml(result.results);
            pageinit(result.totalCount, "10", "div_pager", "pagePagination");
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}

function GetInvestorHtml(data) {
    var html = "";
    if (data.length > 0) {
        $("#followOrganizationNoData").hide();
        for (var i = 0; i < data.length; i++) {
            var companyName = data[i].companyName;
            var followID = data[i].followID;
            var frid = data[i].frid;
            var investmentField = data[i].investmentField;
            var uname = data[i].userName;
            var isf = 0;
            if (data[i].isFollowed) {
                isf = 1;
            }
            var fundScale = data[i].fundScale + "万元";
            if (GetLength(companyName) > 20) {
                html += " <tr class='" + followID + "'><td title='" + companyName + "'>" + cutstr(companyName,20) + "</td><td>" + investmentField + "</td><td>" + fundScale + "</td>";
            }
            else {
                html += " <tr class='" + followID + "'><td>" + companyName + "</td><td>" + investmentField + "</td><td>" + fundScale + "</td>";
            }
            html += "<td><a class='operate-btn detail-btn' onclick=\"showinfoinvestor('" + frid + "','" + isf + "','" + followID + "','" + uname + "');\"></a><a class='operate-btn cancel-btn' onclick=\"UnFollowProject('" + followID + "')\"></a></td></tr>";
        }
    } else {
        $("#followOrganizationNoData").show();
    }
    $("#investorBody").empty();
    $("#investorBody").append(html);
}
function GettFollowHtml(data) {
    var html = "";
    if (data.length > 0) {
        $("#followProjectNoData").hide();
        for (var i = 0; i < data.length; i++) {
            var productionName = data[i].productionName;
            var followID = data[i].followID;
            var frid = data[i].frid;
            var industry = data[i].industryName;
            var financingAmount = data[i].financingAmount + "万元";
            var isf = 0;
            var uid = data[i].userID;
            var uname = data[i].userName;
            if (data[i].isFollowed) {
                isf = 1;
            }
            if (GetLength(productionName) > 20) {
                html += " <tr class='" + followID + "'><td title='" + productionName + "'>" + cutstr(productionName, 20) + "</td>";
            }
            else {
                html += " <tr class='" + followID + "'><td>" + productionName + "</td>";
            }
            if (GetLength(industry) > 24) {
                html+="<td title='" + industry + "'>" + cutstr(industry, 24) + "</td><td>" + financingAmount + "</td>";
            } else {
                html += " <tr class='" + followID + "'><td>" + productionName + "</td><td>" + industry + "</td><td>" + financingAmount + "</td>";
            }
           
            html += "<td><a class='operate-btn detail-btn'  onclick=\"showinfo('" + frid + "','" + isf + "','" + followID + "','" + uid + "','" + uname + "');\"></a><a class='operate-btn cancel-btn' onclick=\"UnFollowProject('" + followID + "')\"></a></td></tr>";
        }
    } else {
        $("#followProjectNoData").show();
    }
    $("#financingfollowsBody").empty();
    $("#financingfollowsBody").append(html);
}
function showinfo(id, isf, fid, uid, uname) {
    window.open("../Investment/financingprojectinfo.html?mytype=my&frid=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname) + "&uid=" + uid);
}
function showinfoinvestor(id, isf, fid, uname) {
    window.open("../Investor/investorinfo.html?mytype=my&id=" + id + "&isf=" + isf + "&fid=" + fid + "&uname=" + escape(uname));
}
function GetFansHtml(data) {
    var html = "";
    if (data.length > 0) {
        $("#fansNoData").hide();
        for (var i = 0; i < data.length; i++) {
            var userName = data[i].userName;
            var userType = data[i].userType;
            var email = data[i].email;
            html += " <tr><td>" + userName + "</td><td>" + userType + "</td><td>" + email + "</td></tr>";
        }
    }
    else {
        $("#fansNoData").show();
    }

    $("#fansBody").empty();
    $("#fansBody").append(html);
}

function SearchProjectData() {
    $("#searchProjectValue").empty();
    $("#searchProjectValue").val($.trim($("#txtSearchProject").val()));
    pagePagination(1);
}
function SearchFollowData() {
    $("#searchFollowValue").empty();
    $("#searchFollowValue").val($.trim($("#txtSearchFollow").val()));
    pageInvestorPagination(1);

}

function SearchFansData() {
    $("#searchFansValue").empty();
    $("#searchFansValue").val($.trim($("#txtFansFollow").val()));
    pageFansPagination(1);

}

//取消关注
function UnFollowProject(obj) {
    ShowLoading();
    var formObj = {
    };
    var parameter = {
        requestUri: "/api/financingrequirementfollow/" + obj,
        requestParameters: formObj
    }
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/delete",
        data: parameterJson,
        success: function (result) {
            $(this).alert("取消关注成功！");
            $("." + obj).remove();
            HideLoading();
        },
        error: function (result) {
            HideLoading();
            ErrorResponse(result);
        }
    });
}