$(function () {
    var roleid = getUrlParam("roleid");
    if (roleid != null && roleid != undefined && roleid != "") {
        //GetInfo(roleid);
        $(".hidroleid").val(roleid);
    }
    GetMenu();
});
//获取已配置的菜单信息
function initMenu() {
    var roleid = $(".hidroleid").val();
    var parameter = {
        "requestUri": "/api/rolefunctions",
        "requestParameters": {
            RoleID: roleid
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result != undefined && result.results.length > 0) {
                var content = ",";
                for (var i = 0; i < result.results.length; i++) {
                    var item = result.results[i];
                    content += item.functionID + ",";
                }
                $(document).find("input[type='checkbox']").each(function () {
                    if (content.indexOf($(this).val())!=-1) {
                        $(this).prop("checked", "checked");
                    }
                });
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//获取菜单信息
function GetMenu() {
    var parameter = {
        "requestUri": "/api/functions/all",
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            if (result != null && result != undefined && result.results.length > 0) {
                var content = "";
                for (var i = 0; i < result.results.length; i++) {
                    var item = result.results[i];
                    if (item.parentID == null) {
                        content += "<div class=\"module\">";
                        content += "<div class=\"module-title\"><input class=\"check-ipt pc" + i + "\" type=\"checkbox\" onclick=\"checkpar(this,'pc"+i+"')\" value=\"" + item.functionID + "\">"+item.functionName+"</div>";
                        content += getitem(result.results, item.functionID, "pc" + i);
                        content += "</div>";
                    }
                }
                $(".rightcontent").html(content);
                initMenu();
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//累加子级
function getitem(obj,fid,pclass) {
    var content = "<div class=\"module-content\"><table class=\"base-layout-table\"><tr>";
    for (var i = 0; i < obj.length; i++) {
        var item = obj[i];
        if (item.parentID == fid) {
            content += "<td>";
            content += "<input class=\"check-ipt\" pcv=\"" + pclass + "\" type=\"checkbox\" onclick=\"checkitem(this,'"+pclass+"')\" value=\"" + item.functionID + "\">" + item.functionName + "</td>";
        }
    }
    content += "</tr></table></div>";
    return content;
}

function checkpar(obj, pc) {
    if ($(obj).prop("checked") == true) {
        $(this).prop("checked", "checked");
        $(document).find("input[type='checkbox']").each(function() {
            if ($(this).attr("pcv") == pc) {
                $(this).prop("checked", "checked");
            }
        });
    }
    else {
        $(this).prop("checked", "");
        $(document).find("input[type='checkbox']").each(function () {
            if ($(this).attr("pcv") == pc) {
                $(this).prop("checked", "");
            }
        });
    }
}

function checkitem(obj, pc) {
    if ($(obj).prop("checked") == true) {
        $(this).prop("checked", "checked");
        $("." + pc).prop("checked", "checked");
    }
    else {
        $(this).prop("checked", "");
        var isall = true;
        $(document).find("input[type='checkbox']").each(function () {
            if ($(this).attr("pcv") == pc && $(this).prop("checked") == true) {
                isall = false;
                return false;
            }
        });
        if (isall) {
            $("." + pc).prop("checked", "");
        }
    }
}

//提交修改
function PostRoleFunctionsPublish() {
    var fids = "";
    $(document).find("input[type='checkbox']").each(function() {
        if ($(this).prop("checked") == true) {
            fids += $(this).val() + ",";
        }
    });
    if (fids == "") {
        $(this).alert("未选择任何项！无法保存！");
        return false;
    }
    ShowLoading();
    var RoleID = $.trim($(".hidroleid").val());

    var formObj = {
        RoleID: RoleID,
        FunctionsID: fids
    };
    var parameter = {
        requestUri: "/api/rolefunction",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);

    $.ajax({
        type: "POST",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post",
        data: parameterJson,
        success: function (result) {
            $(this).alert("提交成功！");
            setTimeout(function () {
                window.opener.InitGetroleData();
                window.close();
            }, 2000);

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}