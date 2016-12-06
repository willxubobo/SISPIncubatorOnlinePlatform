$(function () {
    var Dictionaryid = getUrlParam("id");
    if (Dictionaryid != null && Dictionaryid != undefined && Dictionaryid != "") {
        ShowLoading();
        GetDictionaryInfo(Dictionaryid);
        $(".lastmenu").html("修改字典信息");
    } else {
        $(".selectIpt").select2({
            minimumResultsForSearch: Infinity
        });
    }
    
});

//根据编号获取用户信息
function GetDictionaryInfo(Dictionaryid) {
    var parameter = {
        "requestUri": "/api/information/" + Dictionaryid,
        "requestParameters": {
            "Dictionaryid": Dictionaryid
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
                $(this).alert("获取字典信息失败！");
            } else {
                $("#selectBtn").val(result.key_name);
                $(".selectIpt").select2({
                    minimumResultsForSearch: Infinity
                });
                $(".Sort").val(result.key_sort);
                $(".Description").val(result.key_value);
                $(".hidid").val(result.key_id);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//提交修改
function saveDictionaryform() {
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var keyname = $("#selectBtn").val();
    var DictionaryID = $.trim($(".hidid").val());
    var keyvalue = $.trim($(".Description").val());
    var keySort = $.trim($(".Sort").val());

    var frPublish = {
        Key: keyname,
        Value: keyvalue,
        Sort: keySort,
        ID: DictionaryID
    };
    var formObj = {
        "Dictionary": frPublish
    };
    var parameter = {
        requestUri: "/api/information",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);
    var rDictionaryid = getUrlParam("id");
    var submiturl = "/api/proxy/put";
    if (rDictionaryid == null || rDictionaryid == undefined || rDictionaryid == "") {
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
                window.opener.InitGetDictionaryData();
                window.close();
            }, 2000);

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}