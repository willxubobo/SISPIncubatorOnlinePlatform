$(function () {
    InitActivityData();

});

function InitActivityData() {
    InitActivityDetailData();
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
                    else if (data[i].approveResult == ""||data[i].approveResult ==null){
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
									<li><span>审核人：</span><span>"+approverUser+"<span></li>\
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

function InitActivityDetailData() {
    var id = getUrlParam("id");
    var type = getUrlParam("type");
    if (type != null && type != "") {
        $(".Info_divApplybtn").hide();
    }
    var category = getUrlParam("category");
    var activitydetail = {
        id: id,
        category: category
    };
    var parameter = {
        "requestUri": "/api/activitycalendar/detail",
        "requestParameters": activitydetail
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != null) {
                $("#activityTitle").text(result.topic)
                var startDate = new Date(result.startTime.replace(/T/g, ' ').split(' ')[0]);
                var startYear = startDate.getFullYear();
                var startMonth = startDate.getMonth() + 2;
                var startDay = startDate.getDate();
                var endDate = new Date(result.endTime.replace(/T/g, ' ').split(' ')[0]);
                var endYear = endDate.getFullYear();
                var endDay = endDate.getDate();
                var endMonth = endDate.getMonth() + 2;
                var startTime = new Date(startYear + '/' + startMonth + '/' + startDay).Format("yyyy-MM-dd");
                var endTime = new Date(endYear + '/' + endMonth + '/' + endDay).Format("yyyy-MM-dd");
                $("#dateTime").text(startTime + " ~ " + endTime);
                $("#timeBucket").text(result.timeBucket);
                $("#address").text(result.address);
                $("#sponsor").text(result.sponsor);
                $("#cosponsor").text(result.cosponsor);
                $("#phone").append("<lable> " + result.phoneNumber + "</lable>");
                $("#email").append("<a class='tellEmail' href='mailto:" + result.email + "'>" + result.email + "</a>");
                $("#activityTxt").html(result.activityDescription);
                $("#activityId").val(result.activityId);
                $("#hiddenName").val(result.userName);
                $("#hiddenPhone").val(result.mobile);
                var html = "";
                for (var i = 0; i < result.imgSrcList.length; i++) {
                    if (i < 5) {
                        html += " <li><a href=\"" + result.imgSrcList[i] + "\"><img src=\"" + result.imgSrcList[i] + "\"/></a></li>";
                    }
                }
                $(".Info_DivFocusIn").find("ul").each(function () {
                    $(this).append(html);
                })
                if (result.apply) {
                    $(".Info_divApplybtn").hide();
                }
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
    var category = getUrlParam("category");

    var formObj = {
        Id: id,
        Category: category,
        Comments: comments,
        ApproveStatus: approveStatus
    };

    var parameter = {
        requestUri: "/api/activity/approve",
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
                location.href = 'activitylist.html';
            }, 2000);

        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
