//保存页面
function SubmitAndSave() {
    if (!checkrequire()) {
        return false;
    }
    ShowLoading();
    var formObj = {
        "User": {
            "Password": $("#txtNewPwd").val(),
        },
        "OldPwd": $("#txtOldPwd").val(),
        "OperatorType": "mp"
    };
    var parameter = {
        requestUri: "/api/user",
        requestParameters: formObj
    }

    var modifyPasswordJson = JSON.stringify(parameter);
    $.ajax({
        type: "patch",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/patch/anonymous",
        data: modifyPasswordJson,
        success: function () {
            $(this).alert("密码修改成功！");
            setTimeout(function() {
                location.href = "../admin.html";
            }, 2000);
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
            HideLoading();
        }
    });
}