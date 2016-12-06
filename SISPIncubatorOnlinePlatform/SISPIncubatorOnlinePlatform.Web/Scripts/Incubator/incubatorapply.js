
var page = 1;

$(function () {


    $("#txtCompanyPhone").bind("keyup", function () {
        this.value = this.value.replace(/[^\d-]/g, "");
    });

    //获取团队人数
    GetTeamMembers();

    if (!CheckUserLogin()) return;

    InitFormData();
});
//初始化页面表单
function InitFormData() {



    InitRedirectIncubator();

    var id = getUrlParam("rid");
    if ($.trim(id) != "") {
       $(".btnDeleteApply").show();
        $("#hidApplyId").val(id);
        LoadModifyData();
    }
}

//初始化团队人数选择
function GetTeamMembers() {

    ShowLoading();

    var formObj = {
        Key: "TeamMember",
        PageNumber: 1,
        PageSize: 10000
    };

    var parameter = {
        requestUri: "/api/informations",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post/anonymous",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            var results = data.results;
            var html = "";
            for (var i = 0; i < results.length; i++) {
                html += "<option value='" + results[i].value + "'>" + results[i].value + "</option>";
            }
            $(".selectTeamNumber").append(html);

            $(".selectIpt").select2({
                minimumResultsForSearch: Infinity
            });
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}

//处理其他页面跳转过来的功能
function InitRedirectIncubator() {
    var incubatorId = getUrlParam("infoid");
    var incubatorName = getUrlParam("name");
    var logoPath = getUrlParam("path");
    if (incubatorId != null) {
        var html = "";

        html += "<li class='incubatorItem'> <div class=\"apply-img\"><a class=\"apply-close-a\" onclick=\"RemoveSelectIncubator(this);\" href=\"javascript:;\"></a><img onclick=\"OpenInucubatorInfo('" + incubatorId + "')\" src='" + logoPath + "'  alt=\"\"/></div>";
        html += "<div class=\"apply-txt\">" + incubatorName + "</div><input type=\"hidden\" value='" + incubatorId + "' id=\"hidValue\"/></li>";

        $(".aSelectIncubator").parent().before(html);
    }
}
//删除选择的孵化器
function RemoveSelectIncubator(obj) {
    $(obj).parent().parent().remove();
}
/***********打开孵化器层**********/
var page = 1;
//加载孵化器选择
function GetIncubatorData(page) {
    ShowLoading();

    var searchObj = {
        PageSize: "20",
        PageNumber: page,
        KeyWord: ""
        //KeyWord: '123'
    }

    var parameter = {
        requestUri: "/api/incubators",
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
            GetHtml(results);
            //$(".popupBox").height($(window).height());
            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//加载孵化器html
function GetHtml(data) {
    var html = "";
    var mm = 0;
    var allhtml = "";

    var html = "";
    var htmlItem = "";

    for (i = 0; i < data.length; i++) {

        if (mm < 2) {
            var logo = data[i].logo;

            var index = logo.lastIndexOf(".");
            var frontPart = logo.substring(0, index);
            var lastPart = logo.substring(index);
            var newLog = frontPart + "_s" + lastPart;

            htmlItem += " <td><div class=\"apply-settle-div\"><input class=\"apply-checkbox left chkIncubator\" id='" + data[i].incubatorID + "' type=\"checkbox\"><div class=\"apply-img-box left\">";
            htmlItem += "<img src='" + newLog + "' ></div><div class=\"apply-name-txt\"><div title=\"" + data[i].incubatorName + "\" class=\"over-txt\">" + data[i].incubatorName + "</div><div class=\"run-over\">...</div></div></div></td>";
            if (mm == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.tabIncubatorList').append(html);
                htmlItem = "";
                mm = 0;
                continue;
            }
            if ((data.length - i == 1) && data.length % 2 == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.tabIncubatorList').append(html);
                htmlItem = "";
            }
            mm++;
        }
    }
    if (data.length == 0 && page == 1) {
        $("#divbusinessList").show();
    } else {
        $("#divbusinessList").hide();
    }
}
//打开孵化器层
function OpenIncubatorPop() {
    $(".incubatorPop").show();
    GetIncubatorData(page);
}
//确定选择孵化器
function SaveOk() {
    var html = "";

    $(".chkIncubator:checked").each(function () {
        var id = $(this).attr("id");
        var path = $(this).parent().find("img").attr("src");
        var isExist = false;
        $(".incubatorItem").each(function () {
            var itemId = $(this).find("#hidValue").val();
            if (id == itemId) {
                isExist = true;
            }
        });
        if (!isExist) {
            html += "<li class='incubatorItem'> <div class=\"apply-img\"><a class=\"apply-close-a\" onclick=\"RemoveSelectIncubator(this);\" href=\"javascript:;\"></a><img onclick=\"OpenInucubatorInfo('" + id + "')\" src='" + path + "'  alt=\"\"/></div>";
            html += "<div class=\"apply-txt\">" + name + "</div><input type=\"hidden\" value='" + id + "' id=\"hidValue\"/></li>";
        }
    });

    var sIncubator = new Array();
    $(".chkIncubator:checked").each(function() {
        var id = $(this).attr("id");
        sIncubator.push(id);
    });
    $(".incubatorItem").each(function () {
        var itemId = $(this).find("#hidValue").val();
        sIncubator.push(itemId);
    });
    var aNewArray = sIncubator.delRepeat7();
    if (aNewArray.length >3 ) {
        $(this).alert('孵化器选择不能超过三个,请检查！');
        return;
    }

    $(".aSelectIncubator").parent().before(html);
    CloseIncubatorPop();
}
//关闭孵化器层
function CloseIncubatorPop() {
    page = 1;
    $(".incubatorPop").hide();
    $(".chkIncubator").prop("checked", false);
    $('.tabIncubatorList').empty();
}
/***********打开孵化器层**********/
//打开详情页面
function OpenInucubatorInfo(id) {
    window.opne('incubatorinfo.html?id=' + id);
}

function SubmitForm() {

    var a16 = true;
    if ($(".incubatorItem").length <= 0) {
        $(".divIncubatorTips").show();
        a16 = false;
    }
    if (!checkarearequire("divContent") || !a16) return;
    var applyId = $("#hidApplyId").val();
    $("#aSubmit").hide();
    ShowLoading();
    //提交，再次提交
    if ($.trim(applyId) == "") {
        SubmitAndSaveForm();
    } else {
        ReSubmitAndSaveForm();
    }
}
//提交保存
function SubmitAndSaveForm() {

    var incubatorArray = "";
    $(".incubatorItem").each(function () {
        var id = $(this).find("#hidValue").val();
        incubatorArray = incubatorArray + ";" + id;
    });

    var incubatorObj = {
        ProjectName: $("#txtProjectName").val(),
        CompanyName: $("#txtCompanyName").val(),
        CompanyTel: $("#txtCompanyPhone").val(),
        ProjectOwner: $("#txtProjectOwner").val(),
        ContactTel: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        TeamMembers: $(".selectTeamNumber").val(),
        ProductDescription: $("#txtProductDescription").val(),
        CoreStaffResume: $("#txtCoreStaffResume").val(),
        MarketRiskAnalysis: $("#txtMarketRiskAnalysis").val(),
        FinancingSituation: $("#txtFinancingSituation").val()
    };

    var formObj = {
        "IncubatorApply": incubatorObj,
        Incubators: incubatorArray
    };

    var parameter = {
        requestUri: "/api/incubatorapply",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
            $(this).alert('提交成功');
            setTimeout(function () {
                location.href = 'myincubatorapply.html';
            }, 2000);
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//再次提交保存
function ReSubmitAndSaveForm() {
    var applyId = $("#hidApplyId").val();

    var incubatorObj = {
        ApplyID: applyId,
        ProjectName: $("#txtProjectName").val(),
        CompanyName: $("#txtCompanyName").val(),
        CompanyTel: $("#txtCompanyPhone").val(),
        ProjectOwner: $("#txtProjectOwner").val(),
        ContactTel: $("#txtPhone").val(),
        Email: $("#txtEmail").val(),
        TeamMembers: $(".selectTeamNumber").val(),
        ProductDescription: $("#txtProductDescription").val(),
        CoreStaffResume: $("#txtCoreStaffResume").val(),
        MarketRiskAnalysis: $("#txtMarketRiskAnalysis").val(),
        FinancingSituation: $("#txtFinancingSituation").val(),
        ApplyStatus: "resumbit"
    };

    var formObj = {
        "IncubatorApply": incubatorObj
    };

    var parameter = {
        requestUri: "/api/incubatorapply",
        requestParameters: formObj
    }

    var jsonData = JSON.stringify(parameter);

    $.ajax(
    {
        type: "POST",
        url: "/api/proxy/put",
        data: jsonData,
        contentType: "application/json; charset=utf-8",
        success: function (results) {
            //alert("Success");
             $(this).alert('提交成功');
             setTimeout(function () {
                  if (window.opener != null) {
                      window.opener.GetMyIncubatorApply();
                }
                window.close();
                //location.href = '../home.html';
             }, 2000);
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
/*****重新发起页面开始****/
function LoadModifyData() {

    var id = $("#hidApplyId").val();
    var parameter = {
        requestUri: "/api/incubatorapply/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/get",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;

               $("#txtProjectName").val(results[0].projectName);
               $("#txtCompanyName").val(results[0].companyName);
               $("#txtCompanyPhone").val(results[0].companyTel);
               $("#txtProjectOwner").val(results[0].projectOwner);
               $("#txtPhone").val(results[0].contactTel);
               $("#txtEmail").val(results[0].email);
               $(".selectTeamNumber").val(results[0].teamMembers);
               $("#txtProductDescription").val(results[0].productDescription);
               $("#txtCoreStaffResume").val(results[0].coreStaffResume);
               $("#txtMarketRiskAnalysis").val(results[0].marketRiskAnalysis);
               $("#txtFinancingSituation").val(results[0].financingSituation);

               //var index = results[0].incubatorLogoPath.lastIndexOf(".");
               //var frontPart = results[0].incubatorLogoPath.substring(0, index);
               //var lastPart = results[0].incubatorLogoPath.substring(index);
               //var newLog = frontPart + "_s" + lastPart;

               var html = "<li class='incubatorItem'> <div class=\"apply-img\"><img onclick=\"OpenInucubatorInfo('" + results[0].incubatorID + "')\" src='" + results[0].incubatorLogoPath + "'  alt=\"\"/></div>";
               html += "<div class=\"apply-txt\">" + results[0].incubatorName + "</div><input type=\"hidden\" value='" + results[0].incubatorID + "' id=\"hidValue\"/></li>";

               $(".aSelectIncubator").parent().before(html);


               $(".selectIpt").select2({
                   minimumResultsForSearch: Infinity
               });

               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
    $(".aSelectIncubator").removeClass("apply-add-btn").addClass("hide");
}
/*****重新发起页面结束****/

//删除申请
function DeleteIncubatorAppply() {
    var id = $("#hidApplyId").val();
    var parameter = {
        requestUri: "/api/incubatorapply/" + id,
        requestParameters: id
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax(
       {
           type: "POST",
           url: "/api/proxy/delete",
           data: jsonData,
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               $(this).alert('删除成功');
               setTimeout(function () {
                   if (window.opener != null) {
                       window.opener.GetMyIncubatorApply();
                   }
                   window.close();
                   //location.href = '../home.html';
               }, 2000);
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}

//点击同意协议
function ClickAgree(obj) {
    if (obj.checked) {
        $("#aSubmit").removeClass("grayBtn");
        $("#aSubmit").attr("onclick", "SubmitForm();");
        $("#aSubmit").css("cursor", "");
    } else {
        $("#aSubmit").addClass("grayBtn");
        $("#aSubmit").css("cursor", "default");
        $("#aSubmit").removeAttr("onclick");
    }
}