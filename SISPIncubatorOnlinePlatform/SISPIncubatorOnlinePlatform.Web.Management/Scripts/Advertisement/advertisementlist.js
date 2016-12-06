//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    //if (!CheckUserLogin())return;

    ShowLoading();
    GetData();
});

function GetData() {
    $("#tbBodyContent").html("");
    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: "",
        Type:"admin"
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

                   totalRecords = data.totalCount;
                   pageinit(data.totalCount, ps, "divpager");

                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
               else {
                   if (totalRecords == 0) {
                       $("#divNodata").show();
                   } else {
                       $("#divNodata").hide();
                   }
               }
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


        var isShow = (data[i].isShow == true ? "是" : "否");

        var url = data[i].url;
        if (data[i].picture != "") {
            url = data[i].picture;
        }

        htmlItem += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].adid + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].description + "' class=\"over-txt\">" + data[i].description + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].url + "' class=\"over-txt\">" + data[i].url + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + data[i].hits + "</td>";
        htmlItem += "<td>" + isShow + "</td>";
        htmlItem += "<td>" + data[i].statusDes + "</td>";
        //htmlItem += "<td>" + createdF.FormatIncludeZero("yyyy-MM-dd") + "</td>";
        htmlItem += "<td><a class=\"operate-btn edit-btn\" title=\"编辑\" onclick=\"ModifyAdvertisement('" + data[i].adid + "')\" href=\"#\"></a>" +
            "<a class=\"operate-btn detail-btn\" onclick=\"ShowInfo('" + data[i].adid + "')\" title=\"查看详情\" href=\"#\"></a> ";
        htmlItem += "  <a class=\"operate-btn remove-btn\" title='删除' onclick=\"DeleteItemById('" + data[i].adid + "');\"></a></td></tr>";
    }
    if ($.trim(htmlItem) != "") {
        $("#tbBodyContent").html(htmlItem);
    }

}
//分页
function pagePagination(p) {
    pageNo = p;
    GetData();
}
//全选
function ChkAll(obj) {
    if (obj.checked) {
        $(".chkItem").prop("checked", true);
    } else {
        $(".chkItem").prop("checked", false);
    }
}
//单项选择
function ChkItem() {
    if ($(".chkItem:checked").length == $(".chkItem").length) {
        $(".chkAll").prop("checked", true);
    } else {
        $(".chkAll").prop("checked", false);
    }
}
//打开撤销确认对话框
function OpenConfirm() {
    $(".divConfirm").show();
}
//关闭撤销确认对话框
function CloseConfirm() {
    $(".divConfirm").hide();
    $("#hidIds").val("");
}
//全部删除
function DeleteSelect() {
    if ($(".chkItem:checked").length <= 0) {
        $(this).alert('请选择需要删除的项目！');
        return;
    }

    var allIds = "";
    $(".chkItem:checked").each(function () {
        var id = $(this).val();
        allIds = allIds + "|" + id;
    });
    $("#hidIds").val(allIds);
    OpenConfirm();
}
//删除单项
function DeleteItemById(id) {
    $("#hidIds").val(id);
    OpenConfirm();
}
//删除孵化器
function DeleteAdvertisements() {

    var searchObj = {
        Ads: $("#hidIds").val()
    }

    var parameter = {
        requestUri: "/api/advertisements/pcdm",
        requestParameters: searchObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/post/",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               CloseConfirm();
               $(this).alert('删除成功');
               setTimeout(function () {
                   GetData();
               }, 2000);

           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//新增广告
function AddAdvertisement() {
    window.open("/Advertisement/advertisement.html");
}
//修改广告
function ModifyAdvertisement(id) {
    window.open("/Advertisement/advertisement.html?id=" + id);
}
//打开详情
function ShowInfo(id) {
    window.open("/Advertisement/advertisementinfo.html?id=" + id);
}
