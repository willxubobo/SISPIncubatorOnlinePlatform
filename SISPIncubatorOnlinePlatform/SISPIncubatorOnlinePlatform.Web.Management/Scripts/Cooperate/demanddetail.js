$(function () {
    InitDemandData();

});

function InitDemandData() {
    InitDemandDetailData();
    InitApprovedRecord();
}

function InitApprovedRecord() {
    var id = getUrlParam("id");
    var searchObj = {
        ApproveRelateID: id
    }
    var parameter = {
        requestUri: "/api/approverecord/approveinfo",
        requestParameters: searchObj
    }
    var jsonData = JSON.stringify(parameter);
    $.ajax({
        type: "POST",
        url: "/api/proxy/post",
        data: jsonData,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (returndata) {
            var data = returndata.results;
            var htmlItem = "";

            var applytype = data[0].applyType;
            var strApplyType = "";//审批类型
            switch (applytype) {
                case "0":
                    strApplyType = "孵化器入驻申请";
                    break;
                case "1":
                    strApplyType = "办公室入驻申请";
                    break;
                case "2":
                    strApplyType = "投资人资格申请";
                    break;
                case "3":
                    strApplyType = "融资发布申请";
                    break;
                case "4":
                    strApplyType = "服务发布申请";
                    break;
                case "5":
                    strApplyType = "需求发布申请";
                    break;
                case "6":
                    strApplyType = "活动发布申请";
                    break;
                case "7":
                    strApplyType = "举办孵化器活动申请";
                    break;
                default: strApplyType = ""; break;
            }
            for (i = 0; i < data.length; i++) {
                var approvestatus = "";
                if (data[i].approveResult == "2") {
                    approvestatus = "审核通过。";
                    $("#trApproveCommment").hide();
                    $(".tdApproveComment").hide();
                    $(".tdBtnAction").hide();
                } else if (data[i].approveResult == "3") {
                    approvestatus = "审核驳回。";
                } else if (data[i].approveResult == "4") {
                    approvestatus = "撤销。";
                }
                else if (data[i].approveResult == "" || data[i].approveResult == null) {
                    approvestatus = "提交申请。";
                }
                var coms = "";
                if (data[i].comments != null && data[i].comments != undefined && data[i].comments != "") {
                    coms = data[i].comments;
                }
                var created = data[i].created.substring(0, 10);
                var approverUser = data[i].approverUser;
                htmlItem += "<tr>\
							<td colspan='4' class='tdApproveResult'>\
								<p>" + coms + "</p>\
								<ul>\
									<li>" + strApplyType + "</li>\
									<li><span>结果：</span><span>" + approvestatus + "</span></li>\
									<li><span>审核人：</span><span>"+ approverUser + "<span></li>\
									<li><span>时间：</span><span>" + created + "<span></li>\
								</ul>\
							</td>\
						</tr>";
            }
            $("#trApproveRecord").after(htmlItem);

            HideLoading();
        },
        error: function (err) {
            ErrorResponse(err);
            HideLoading();
        }
    });

}

function InitDemandDetailData() {
    var demandId = getUrlParam("id");
    var parameter = {
        "requestUri": "/api/demandpublish/" + demandId,
        "requestParameters": {

        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/get/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result.results && result.results.length > 0) {
                $("#headImg").prop("src", result.results[0].imgUrl);
                $("#companyName").text(result.results[0].companyName);
                $("#contact").text("联系人：" + result.results[0].contacts);
                $("#phone").text(result.results[0].mobile);
                $("#email").append("<a class='tellEmail' href='mailto:" + result.results[0].email + "'>" + result.results[0].email + "</a>");
                $("#projectDescription").text(result.results[0].projectDescription);
                $("#member").text("团队人数：" + result.results[0].members);
                $("#intentionPartner").text("意向合作对象：" + result.results[0].intentionPartner);
                $("#demandDescription").text(result.results[0].demandDescription);
                $("#foundedTime").text("成立时间：" + result.results[0].foundedTime.substr(0, 10));
                if (result.results[0].expiryDate == "" || result.results[0].expiryDate == null) {
                    $("#expiryDate").text("有效时间：");
                }
                else {
                    $("#expiryDate").text("有效时间：" + result.results[0].expiryDate.substr(0, 10));
                }
                $("#category").text("所属类别：" + result.results[0].category);
            }
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

//提交通过 
//通过或者拒绝
function UpdateApprove(approveStatus) {
    var comments = $("#txtComments").val();
    if ($.trim(comments) == "") {
        $("#txtComments").next().show();
        return;
    } else {
        $("#txtComments").next().hide();
    }

    var id = getUrlParam("id");

    var formObj = {
        Id: id,
        Comments: comments,
        ApproveStatus: approveStatus
    };

    var parameter = {
        requestUri: "/api/demandpublishs/approve",
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
                location.href = 'demandapprovallist.html';
            }, 2000);

        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
