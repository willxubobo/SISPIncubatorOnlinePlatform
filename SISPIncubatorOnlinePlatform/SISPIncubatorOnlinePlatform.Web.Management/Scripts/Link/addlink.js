$(function () {
    var linkid = getUrlParam("id");
    if (linkid != null && linkid != undefined && linkid != "") {
        ShowLoading();
        GetlinkInfo(linkid);
        $(".lastmenu").html("修改友情链接信息");
    }

});

//根据编号获取用户信息
function GetlinkInfo(linkid) {
    var parameter = {
        "requestUri": "/api/linklist/" + linkid,
        "requestParameters": {
            "linkid": linkid
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
            if (result == null) {
                $(this).alert("获取友情链接信息失败！");
            } else {
                $(".Sort").val(result.linklist_sort);
                $(".LinkTitle").val(result.linklist_title);
                $(".LinkUrl").val(result.linklist_url);
                $(".hidid").val(result.linklist_id);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//提交修改
function savelinkform() {
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var linkID = $.trim($(".hidid").val());
    var ltitle = $.trim($(".LinkTitle").val());
    var lsort = $.trim($(".Sort").val());
    var lurl = $.trim($(".LinkUrl").val());

    var frPublish = {
        Title: ltitle,
        Url: lurl,
        Sort: lsort,
        LinkID: linkID
    };
    var formObj = {
        "LinkList": frPublish
    };
    var parameter = {
        requestUri: "/api/linklist",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);
    var rlinkid = getUrlParam("id");
    var submiturl = "/api/proxy/put";
    if (rlinkid == null || rlinkid == undefined || rlinkid == "") {
        submiturl = "/api/proxy/post";
    }
    $.ajax({
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: submiturl,
        data: parameterJson,
        success: function (result) {
            $(this).alert("提交成功！");
            setTimeout(function () {
                if (typeof(window.opener.InitGetlinkData) == "function") {
                    window.opener.InitGetlinkData();
                }
                window.close();
            }, 2000);

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}