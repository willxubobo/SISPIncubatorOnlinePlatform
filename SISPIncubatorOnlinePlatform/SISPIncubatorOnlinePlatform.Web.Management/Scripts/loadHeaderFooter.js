$(function () {
    if ($(".divTopMenu")) {
        var headerUrl = window.location.protocol + "//" + window.location.host + "/header.html?" + Math.random();
        $(".divTopMenu").load(headerUrl + " #divHeader");
    }
    if ($(".divLeftNav")) {
        var leftUrl = window.location.protocol + "//" + window.location.host + "/LeftNavigation.html?" + Math.random();
        $(".divLeftNav").load(leftUrl + " #divLeftMenu");
    }
    InitUserData_Home();
    InitTopMenu();
});
//登录成功后加载用户信息
function InitUserData_Home() {
    $.ajax({
        type: "get",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/currentuser",
        //data: parameterJson,
        success: function (result) {
            if (result == null) {
                window.location.href = window.location.protocol + "//" + window.location.host + "/login.html?" + Math.random();
            } else {
                $("#uname").html(result.userName);
                $("#lblUserName").html(result.userName);
                $(".logout").attr("onclick", "OpenlogOutConfirm();");
                $("#imgadminlogo").attr("src", result.avatar);
            }
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}
//退出确认
function OpenlogOutConfirm() {
    $(".divlogOutConfirm").show();
}
//取消退出
function CloselogOutConfirm() {
    $(".divlogOutConfirm").hide();
}
//退出
function LogOut() {
    $.ajax({
        type: "post",
        url: "/api/proxy/logout",
        success: function () {
            window.location.href = window.location.protocol + "//" + window.location.host + "/login.html";
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//加载顶部菜单
function InitTopMenu() {
    ShowLoading();
    var searchObj = {
        PageSize: "10"
    }
    var parameter = {
        requestUri: "/api/functions",
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
               if (results != null && results != undefined && results.length > 0) {
                   GetTopMenuHtml(results);
               }
               HideLoading();

           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
//获取顶部菜单
var interval;
var isExist;
var topHtml;
function GetTopMenuHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        htmlItem += "<li class='liTopNav " + data[i].functionID + "' onclick=\"OpenNewPage('" + data[i].controller + "')\"><div class=\"nav-menu " + data[i].functionID + "\"><span>" + data[i].functionName + "</span><input id=\"hidControlUrl\" value='" + data[i].controller + "' type=\"hidden\" /><input id=\"hidPid\" value='" + data[i].functionID + "' type=\"hidden\" /></div></li>";
    }
    topHtml = htmlItem;
    isExist = false;
    interval = setInterval(SetTomMenu, 500);   
}

function SetTomMenu()
{
    if ($('.topmenu')) {
        $('.topmenu').empty();
        $('.topmenu').append(topHtml);
        InitTopSelectMenu();
        isExist = true;
    }
    if (isExist) {
        clearInterval(interval);
    }
}


//打开新的页面
function OpenNewPage(url) {
    var headerUrl = window.location.protocol + "//" + window.location.host + "/" + url;
    location.href=headerUrl;
}
//初始化顶部菜单选中
function InitTopSelectMenu() {
    var arUrl = window.location.href;
    
    //孵化器
    if (arUrl.toLowerCase().indexOf("/incubator/incubator.html") >= 0 || arUrl.toLowerCase().indexOf("/incubator/incubaorlist.html") >= 0
         || arUrl.toLowerCase().indexOf("/incubator/incubatorinfo.html") >= 0) {
        SelectTopmenuCheck("孵化器管理");
    }
    //孵化器申请/办公室租赁
    if (arUrl.toLowerCase().indexOf("/incubator/incubaorapplylistmanagment") >= 0 || arUrl.toLowerCase().indexOf("/incubator/incubaorapplylist") >= 0||
        arUrl.toLowerCase().indexOf("/office/manageoffice") >= 0 || arUrl.toLowerCase().indexOf("/office/officeapprovelist") >= 0 || arUrl.toLowerCase().indexOf("/incubator/projectreport") >= 0
        || arUrl.toLowerCase().indexOf("/incubator/incubatorapply.html") >= 0 || arUrl.toLowerCase().indexOf("/incubator/incubatorapplydetail.html") >= 0
        || arUrl.toLowerCase().indexOf("/incubator/incubatorapprove.html") >= 0 || arUrl.toLowerCase().indexOf("/office/officeapply.html") >= 0
         || arUrl.toLowerCase().indexOf("/office/officesettledaapplyapprove.html") >= 0 || arUrl.toLowerCase().indexOf("/office/officesettledaapplydetail.html") >= 0) {
        SelectTopmenuCheck("孵化器/办公室租赁");
    }
    //找投资
    if (arUrl.toLowerCase().indexOf("/investment/financingprojectmanagement") >= 0 || arUrl.toLowerCase().indexOf("investor/investorpendinglist.html") >= 0 ||
        arUrl.toLowerCase().indexOf("/investor/investormanagement.html") >= 0 || arUrl.toLowerCase().indexOf("/investment/financingprojectpendinglist.html") >= 0 || arUrl.toLowerCase().indexOf("/investor/investorapprove") >= 0
        || arUrl.toLowerCase().indexOf("/investor/investorauth.html") >= 0 || arUrl.toLowerCase().indexOf("/investor/investorinfo.html") >= 0
        || arUrl.toLowerCase().indexOf("/investor/investorlist.html") >= 0 || arUrl.toLowerCase().indexOf("/investor/SelectUser.html") >= 0
         || arUrl.toLowerCase().indexOf("/investment/financingprojectapprove.html") >= 0 || arUrl.toLowerCase().indexOf("/investment/financingprojectdetail.html") >= 0 || arUrl.toLowerCase().indexOf("/investment/financingprojectinfo.html") >= 0 || arUrl.toLowerCase().indexOf("/investment/financingprojectlist.html") >= 0 || arUrl.toLowerCase().indexOf("/investment/financingprojectpublish.html") >= 0) {
        SelectTopmenuCheck("找投资");
    }
    //活动管理
    if (arUrl.toLowerCase().indexOf("/activitydetail.html") >= 0 || arUrl.toLowerCase().indexOf("/activitylist.html") >= 0
         || arUrl.toLowerCase().indexOf("/activitymanagedetail.html") >= 0 || arUrl.toLowerCase().indexOf("/activitymanagelist.html") >= 0
         || arUrl.toLowerCase().indexOf("/activitypublishapply.html") >= 0 || arUrl.toLowerCase().indexOf("/activitystats.html") >= 0
         || arUrl.toLowerCase().indexOf("/incubatoractivityapply.html") >= 0 || arUrl.toLowerCase().indexOf("/signupinformation.html") >= 0) {
        SelectTopmenuCheck("活动管理");
    }
    //用户管理
    if (arUrl.toLowerCase().indexOf("/account/modifypassword.html") >= 0 || arUrl.toLowerCase().indexOf("/adduser.html") >= 0
         || arUrl.toLowerCase().indexOf("/userapprove.html") >= 0 || arUrl.toLowerCase().indexOf("/userinfo.html") >= 0
         || arUrl.toLowerCase().indexOf("/userpending.html") >= 0 || arUrl.toLowerCase().indexOf("/usermanagement.html") >= 0 || arUrl.toLowerCase().indexOf("/rolesmanagement.html") >= 0
        || arUrl.toLowerCase().indexOf("/addrole.html") >= 0 || arUrl.toLowerCase().indexOf("/rolerights.html") >= 0 ) {
        SelectTopmenuCheck("用户管理");
    }
    //找合作
    if (arUrl.toLowerCase().indexOf("/demandapprovallist.html") >= 0 || arUrl.toLowerCase().indexOf("/demanddetail.html") >= 0
        || arUrl.toLowerCase().indexOf("/demandmanagedetail.html") >= 0 || arUrl.toLowerCase().indexOf("/demandmanagellist.html") >= 0
        || arUrl.toLowerCase().indexOf("/demandpublish.html") >= 0 || arUrl.toLowerCase().indexOf("/serviceapprovallist.html") >= 0
        || arUrl.toLowerCase().indexOf("/servicedetail.html") >= 0 || arUrl.toLowerCase().indexOf("/servicemanagedetail.html") >= 0
        || arUrl.toLowerCase().indexOf("/servicemanagellist.html") >= 0 || arUrl.toLowerCase().indexOf("/servicepublish.html") >= 0) {
        SelectTopmenuCheck("找合作");
    }
    //基础数据
    if (arUrl.toLowerCase().indexOf("/advertisement/advertisementlist.html") >= 0 || arUrl.toLowerCase().indexOf("/advertisement/advertisement.html") >= 0
         || arUrl.toLowerCase().indexOf("/dictionary/dictionarymanagement.html") >= 0 || arUrl.toLowerCase().indexOf("/linkmanagement.html") >= 0
         || arUrl.toLowerCase().indexOf("/successfulcase.html") >= 0 || arUrl.toLowerCase().indexOf("/successfulcasedetail.html") >= 0
        || arUrl.toLowerCase().indexOf("/successfulcaselist.html") >= 0 || arUrl.toLowerCase().indexOf("message/messagelist.html") >= 0) {
        SelectTopmenuCheck("基础数据管理");
    }
}
//初始化左部菜单
function InitLeftSelectMunu() {
    var arUrl = window.location.href;
    var lastUrlIndex = arUrl.lastIndexOf("/");
    var lastUrlName = arUrl.substring(lastUrlIndex);
    SelectLeftMenuCheck(lastUrlName.toLowerCase());
}
//选中顶部菜单
function SelectTopmenuCheck(name) {
    var i = 0;
    $(".liTopNav").each(function() {
        var name1 = $(this).find("span").text();
        if (name1.toLowerCase().indexOf(name) >= 0) {
            var pid = $(this).find("#hidPid").val();
            $(this).find(".nav-menu").addClass("on");
            loadleftmenu(pid);
            mantopindex = i;
        }
        i++;
    });
}
//加载左面菜单
function loadleftmenu(pid) {
ShowLoading();
var searchObj = {
    ParentID: pid
}
var parameter = {
    requestUri: "/api/functions",
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
            if (results != null && results != undefined && results.length > 0) {
                GetLeftMenuHtml(results,pid);
            }
            HideLoading();

            InitLeftSelectMunu();
        },
        error: function (err) {
            ErrorResponse(err);
            HideLoading();
        }
    });
}
//加载左边菜单html
function GetLeftMenuHtml(data,pid) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        if (i == 0) {
            htmlItem += "<li class='LiLeftMenu' onclick=\"OpenNewPage('" + data[i].controller + "');\"><div class=\"subnav-menu\"><span>" + data[i].functionName + "</span><input id=\"hidControlLeftUrl\" value='" + data[i].controller + "' type=\"hidden\" /></div></li>";
            $("." + pid).attr("onclick", "OpenNewPage('" + data[i].controller + "');");
        } else {
            htmlItem += "<li class='LiLeftMenu' onclick=\"OpenNewPage('" + data[i].controller + "');\"><div class=\"subnav-menu\"><span>" + data[i].functionName + "</span><input id=\"hidControlLeftUrl\" value='" + data[i].controller + "' type=\"hidden\" /></div></li>";
        }
    }
    $('.leftmenuhtml').empty();
    $('.leftmenuhtml').append(htmlItem);
}
//选中左部菜单
function SelectLeftMenuCheck(name) {
    var ii = 0;
    $(".LiLeftMenu").each(function() {
        var url = $(this).find("#hidControlLeftUrl").val();
        if (url.toLowerCase().indexOf(name) >= 0) {
            $(this).find(".subnav-menu").addClass("on");
            indexLeftNav = ii;
        }
        if (name.indexOf("signupinformation.html") >= 0 && url.toLowerCase().indexOf("activitystats.html")>=0) {
            $(this).find(".subnav-menu").addClass("on");
            indexLeftNav = ii;
        }
        ii++;
    });
}