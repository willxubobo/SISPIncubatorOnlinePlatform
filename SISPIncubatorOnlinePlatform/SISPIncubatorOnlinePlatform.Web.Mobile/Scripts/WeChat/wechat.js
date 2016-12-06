function addmenu() {
    var parameter = {
        "requestUri": "/api/weixin/addmenu",
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
            if (result == "0") {
                $(this).alert("添加成功！");
            } else {
                $(this).alert("添加失败！");
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function delmenu() {
    var parameter = {
        "requestUri": "/api/weixin/delmenu",
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
            if (result == "0") {
                $(this).alert("删除成功！");
            } else {
                $(this).alert("删除失败！");
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}