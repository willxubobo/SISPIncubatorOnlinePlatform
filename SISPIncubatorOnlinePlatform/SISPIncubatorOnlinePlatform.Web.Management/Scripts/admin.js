

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
function GetTopMenuHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        htmlItem += "<li onclick=\"mantopindex="+i+";loadleftmenu('" + data[i].functionID + "')\"><div class=\"nav-menu " + data[i].functionID + "\"><span>" + data[i].functionName + "</span></div></li>";
    }
    $('.topmenu').empty();
    $('.topmenu').append(htmlItem);
    
}

//申请发布
function applypublish() {
    window.location.href = "financingrequirementspublish.html";
}

$(function () {
    InitTopMenu();
    var righturl = $(".hidrighturl").val();
    var topurl = $(".hidtopmenu").val();
    if ($.trim(righturl) == "") {
        $(".welcomecontent").show();
    } else {
        $("." + topurl).addClass("on");
        loadContent(righturl);
    }
    //测试用
    //loadContent("Link/linkmanagement.html");
});

//加载左面菜单
function loadleftmenu(pid) {
    $(".hidtopmenu").val(pid);
    $(".welcomecontent").hide();
    $(".left-area").show();
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
                   GetLeftMenuHtml(results);
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}

//加载左边菜单html
function GetLeftMenuHtml(data) {
    var htmlItem = "";
    for (i = 0; i < data.length; i++) {
        if (i == 0) {
            setmanageIndex(0);
            loadContent(data[i].controller);
            htmlItem += "<li onclick=\"loadContent('" + data[i].controller + "',"+i+");\"><div class=\"subnav-menu on\"><span>" + data[i].functionName + "</span></div></li>";
        } else {
            htmlItem += "<li onclick=\"loadContent('" + data[i].controller + "'," + i + ");\"><div class=\"subnav-menu\"><span>" + data[i].functionName + "</span></div></li>";
        }
    }
    $('.leftmenu').empty();
    $('.leftmenu').append(htmlItem);
    
}

//加载功能页面html
function loadContent(pageurl, pindex) {
    if (pindex != null && pindex != undefined) {
        indexLeftNav = pindex;
    }
    if ($(".right-area")) {
        $(".hidrighturl").val(pageurl);
        var pUrl = "";
        if (pageurl!=null&&pageurl.indexOf("?") > 0) {
            pUrl = window.location.protocol + "//" + window.location.host + "/" + pageurl + "&random=" + Math.random();
        } else {
            pUrl = window.location.protocol + "//" + window.location.host + "/" + pageurl + "?" + Math.random();
        }
        $("#hidDictionaryType").val($.getUrlVar("type",pUrl));
        $(".right-area").load(pUrl);
    }
}

