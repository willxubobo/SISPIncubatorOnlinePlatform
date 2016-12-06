function pagePagination(p) {
    pageNo = p;
    GetDictionaryData(p - 1, 0);
}

//加载投资机构
function GetDictionaryData(page, type) {
    var type = $("#hidtype").val();

    ShowLoading();
    var searchObj = {
        PageSize: "10",
        PageNumber: pageNo - 1,
        KeyWord: $.trim($("#txtkeyword").val()),
        Key: "",
        ModuleType: type
    }
    var parameter = {
        requestUri: "/api/dictionarys",
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
               //totalPage = data.totalPage;
               totalRecords = data.totalCount;
               if (results != null && results != undefined && results.length > 0) {
                   $("#divNodata").hide();
                   GetDictionaryHtml(results, type);
                   pageinit(totalRecords, "10", "div_pager");
               } else {
                   $('#DictionaryBody').empty();
                   $("#divNodata").show();
                   pageinit(0, "10", "div_pager");
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
function GetDictionaryHtml(data, type) {
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {
        var statustex = "";
        var operHtml = "";
        switch (data[i].key) {
            case "ActivityRemark":
                statustex = "活动申请备注信息"; break;
            case "Industry": statustex = "行业分类"; break;
            case "InvestmentStage": statustex = "投资阶段"; break;
        }
        operHtml += "<a class=\"operate-btn edit-btn\" href=\"javascript:void(0)\" onclick=\"editDictionary('" + data[i].id + "');\" title='修改'></a><a class=\"operate-btn remove-btn\" onclick=\"OpenConfirm('" + data[i].id + "',this);\" title='删除' href=\"javascript:\"></a>";
        htmlItem += "<tr>";
        htmlItem += "<td>" + statustex + "</td><td><div class=\"over-txt-p\"><div title='" + data[i].value + "' class=\"over-txt\">" + data[i].value + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + operHtml + "<input type=\"hidden\" id=\"hidIsDelete\" value='" + data[i].isExistData + "'  /></td>";

        htmlItem += "</tr>";
    }
    $('#DictionaryBody').empty();
    $('#DictionaryBody').append(htmlItem);
}
//修改
function editDictionary(frid) {
    window.open("adddictionary.html?id=" + frid);
}



$(function () {
    var type =   getUrlParam("type");
    if ($.trim(type) != "") {
        $("#hidtype").val(type);
        InitGetDictionaryData();
    }

});

function InitGetDictionaryData() {
    pagePagination(1);
}
//打开撤销确认对话框
function OpenConfirm(id, obj) {
    var isDelete = $(obj).parent().find("#hidIsDelete").val();
    if (isDelete == "true") {
        $(this).alert("该数据在业务表中已使用，无法进行删除，请检查！");
        return;
    }
    $(".divConfirm").show();
    $("#hidid").val(id);
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidid").val("");
}
//执行删除功能
function DelDictionary() {

    var id = $("#hidid").val();

    ShowLoading();

    var formObj = {
        UserID: id
    };

    var parameter = {
        requestUri: "/api/information/" + id,
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/delete",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (results) {
               $(this).alert("删除成功");

               CloseConfirm();
               HideLoading();
               InitGetDictionaryData();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}