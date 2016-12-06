
var page = 1;

$(function () {

    //if (!CheckUserLogin()) return;
    CheckUserLogin();
    InitFormData();
});
//初始化页面表单
function InitFormData() {
    $("#txtCompanyPhone").bind("keyup", function () {
        this.value = this.value.replace(/[^\d-]/g, "");
    });
    //获取团队人数
    GetTeamMembers();

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

//打开详情页面
function OpenInucubatorInfo(id) {
    window.location.href = 'incubatorinfo.html?id=' + id;
}

function CancelPage() {
    window.location.href = 'incubaorapplylistmanagment.html';
}

function SubmitForm() {
    //var a16 = true;
    //if ($(".incubatorItem").length <= 0) {
    //    $(".divIncubatorTips").show();
    //    a16 = false;
    //}
    if (!checkarearequire("divContent")) return;
    var applyId = $("#hidApplyId").val();

    ShowLoading();
    //提交，再次提交
    if ($.trim(applyId) != "") {
        ReSubmitAndSaveForm();
    }
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
        ApplyStatus: "resumbitadmin"
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
            $(this).alert('保存成功');
            setTimeout(function () {
                if (window.opener != null) {
                    window.opener.GetIncubatorApplyList();
                }
                window.close();
                //location.href = "incubaorapplylistmanagment.html";
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

               var html = "<img onclick=\"OpenInucubatorInfo('" + results[0].incubatorID + "')\" style='width:200px;height:200px;' src='" + results[0].incubatorLogoPath + "'  alt=\"\"/>";
               html += "<div class=\"apply-txt\">" + results[0].incubatorName + "</div><input type=\"hidden\" value='" + results[0].incubatorID + "' id=\"hidValue\"/>";

               $(".divIncubator").html(html);


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
