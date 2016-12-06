//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");


$(function () {
    //if (!CheckUserLogin())return;
    CheckUserLogin();
    ShowLoading();
    GetData();
});

function GetData() {

    var ps = 10;
    var searchObj = {
        PageSize: ps,
        PageNumber: pageNo,
        KeyWord: "",
        UserType: "admin"
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/incubators/pcweb",
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
        var createdF = new Date(data[i].created);

        var isShow = (data[i].isShow == true ? "是" : "否");
        var isDelete = (data[i].isDelete == true ? "是" : "否");
        var isExistTmp =( data[i].agreementTemplateDto == null ? "否" : "是");

        htmlItem += "<tr><td><input class=\"base-checkbox chkItem\" value='" + data[i].incubatorID + "' onclick='ChkItem()' type=\"checkbox\"></td>";
        htmlItem += "<td>" + data[i].incubatorName + "</td>";
        htmlItem += "<td><div class=\"over-txt-p\"><div title='" + data[i].description + "' class=\"over-txt\">" + data[i].description + "</div><div class=\"run-over\">...</div></div></td>";
        htmlItem += "<td>" + createdF.FormatIncludeZero("yyyy-MM-dd") + "</td>";
        htmlItem += "<td>" + data[i].sort + "</td>";
        htmlItem += "<td>" + isShow + "</td>";
        htmlItem += "<td>" + isDelete + "</td>";
        htmlItem += "<td>" + isExistTmp + "</td>";
        htmlItem += "<td><a class=\"operate-btn edit-btn\" title=\"编辑\" onclick=\"ModifyMyIncubator('" + data[i].incubatorID + "')\" href=\"#\"></a><a class=\"operate-btn detail-btn\" onclick=\"OpenInucubatorInfo('" + data[i].incubatorID + "')\" title=\"查看详情\" href=\"#\"></a> ";
        htmlItem += "<a class=\"operate-btn upload-btn\" title='上传模版' onclick=\"OpenUploadDialog('" + data[i].incubatorID + "');\"></a>";
        htmlItem += "  <a class=\"operate-btn remove-btn\" title='删除' onclick=\"DeleteIncubatorById('" + data[i].incubatorID + "');\"></a></td></tr>";
    }
    if ($.trim(htmlItem) != "") {
        $("#tbBodyContent").html(htmlItem);
    }

}

function OpenInucubatorInfo(id) {
    window.open('/Incubator/incubatorinfo.html?id=' + id);
}

function SearchByKeys() {
    $('#tbBodyContent').html("");
    pageNo = 1;
    GetData();
}
//修改
function ModifyMyIncubator(id) {
    //location.href = 'modifyincubator.html?id=' + id;
    window.open('/Incubator/incubator.html?id=' + id);
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
//删除单项
function DeleteIncubatorById(id) {
    $("#hidIds").val(id);
    OpenConfirm();
}
//删除孵化器
function DeleteIncubator() {

    var searchObj = {
        Ids: $("#hidIds").val()
    }

    var parameter = {
        requestUri: "/api/incubators/pcdm",
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
//删除多个
function DeleteIncubatorSelect() {

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
//新增孵化器
function AddIncubator() {
    window.open('/Incubator/incubator.html');
}
//打开上传模版窗口
function OpenUploadDialog(id) {
    $("#hidUploadId").val(id);
    $(".divUploadTemp").show();
}
//关闭上传模版窗口
function CloseUploadDialog() {
    $("#hidUploadId").val("");
    $(".divUploadTemp").hide();
    $("#fileTemp").val("");
}
//上传模版
function UploadIncubatorTemp() {
    var id = $("#hidUploadId").val();
    var file = $("#fileTemp").val();
    if (file == "") {
        $(this).alert("请选择文件");
        //CloseUploadDialog();
        return;
    }
    ShowLoading();
    $.ajaxFileUpload({
        url: '/api/proxy/uploadaggreementtempfile', //用于文件上传的服务器端请求地址
        contentType: "application/json; charset=utf-8",
        secureuri: false, //一般设置为false
        fileElementId: "fileTemp", //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type: 'post',
        data: { IncubatorApplyId: id, DeleteIds: "" },
        success: function (data, status) //服务器成功响应处理函数
        {
            HideLoading();
            if(data['headImgUrl'] != undefined && data['headImgUrl'] != null&&data['headImgUrl']=="success") {
                $(this).alert("上传成功");
                setTimeout(function () {
                    GetData();
                    CloseUploadDialog();
                }, 2000);
            } else {
                $(this).alert("上传失败,请检查");
                setTimeout(function () {
                    CloseUploadDialog();
                }, 2000);
            }

        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            $(this).alert(e);
        }
    });
}