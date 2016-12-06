$(function () {
    var roleid = getUrlParam("roleid");
    if (roleid != null && roleid != undefined && roleid != "") {
        ShowLoading();
        GetRoleInfo(roleid);
        $(".lastmenu").html("修改角色信息");
    }
});

//根据编号获取用户信息
function GetRoleInfo(roleid) {
    var parameter = {
        "requestUri": "/api/role/" + roleid,
        "requestParameters": {
            "roleid": roleid
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
                $(this).alert("获取角色信息失败！");
            } else {
                $(".RoleName").val(result.role_name);
                if (result.is_admin == "True") {
                    $(".IsAdmin").prop("checked", true);
                }
                $(".Description").val(result.role_description);
                $(".hidroleid").val(result.roleid);
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}
//提交修改
function saveroleform() {
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var RoleName = $.trim($(".RoleName").val());
    var RoleID = $.trim($(".hidroleid").val());
    var description = $.trim($(".Description").val());

    var isadmin = 0;
    if ($(".IsAdmin").is(":checked")) {
        isadmin = 1;
    }

    var frPublish = {
        RoleName: RoleName,
        IsAdmin: isadmin,
        RoleID: RoleID,
        Description: description
    };
    var formObj = {
        "Roles": frPublish
    };
    var parameter = {
        requestUri: "/api/role",
        requestParameters: formObj
    }

    var parameterJson = JSON.stringify(parameter);
    var rroleid = getUrlParam("roleid");
    var submiturl = "/api/proxy/put";
    if (rroleid == null || rroleid == undefined || rroleid == "") {
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
                window.opener.InitGetroleData();
                window.close();
            }, 2000);

        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}