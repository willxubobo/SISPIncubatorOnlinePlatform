
$(function () {
    if (!CheckUserLogin()) return;
    InitFormData();
});
function InitFormData() {
    var applyId = getUrlParam("id");
    if ($.trim(applyId) != "") {
        $("#hidApplyId").val(applyId);
        GetIncubatorApplyInfo(applyId);
    }
}
//获取单个申请记录
function GetIncubatorApplyInfo(id) {
    ShowLoading();
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

               $("#divProjectName").html(results[0].projectName);
               $("#divCompanyName").html(results[0].companyName);
               $("#divCompanyPhone").html(results[0].companyTel);
               $("#divProjectOwner").html(results[0].projectOwner);
               $("#divContactPhone").html(results[0].contactTel);
               $("#divEmail").html(results[0].email);
               $("#divTeamMembers").html(results[0].teamMembers);
               $("#pProductDescription").html(results[0].productDescription);
               $("#pCoreStaffResume").html(results[0].coreStaffResume);
               $("#pMarketRiskAnalysis").html(results[0].marketRiskAnalysis);
               $("#pFinancingSituation").html(results[0].financingSituation);
               $("#spanIncubatorName").text(results[0].incubatorName);

               var approveHistory = results[0].approveRecords;
               var html = "";
               for (var i = 0; i < approveHistory.length; i++) {

                   var node = "提交申请";
                   var result = "提交申请";
                   if (approveHistory[i].approveResult == null && approveHistory[i].approveNode == "0") {
                       node = "提交申请";
                       result = "提交申请";
                   } else if (approveHistory[i].approveNode == "1") {
                       node = "管理员审批";
                       result = "审批通过";
                   }
                   else if (approveHistory[i].approveNode == "3") {
                       node = "管理员审批";
                       result = "审批驳回";
                   }

                   html += "<tr>";
                   html += "<td colspan=\"4\" class=\"tdApproveResult\">";
                   html += " <p>" + node + "</p>";
                   html += " <ul>";
                   html += "    <li>公共孵化器审核</li>";
                   html += "   <li><span>结果：</span><span>" + result + "</span></li>";
                   html += " <li><span>审核人：</span><span>" + approveHistory[i].approverUser + "<span></span></span></li>";
                   html += "                   <li><span>时间：</span><span>" + approveHistory[i].createdDate + "<span></span></span></li>";
                   html += "                </ul>";
                   html += "            </td>";
                   html += "        </tr>";
               }
               $("#trApproveHistory").after(html);
               if (results[0].agreementTemplate != null) {
                   $("#tgAgreeementTemplate").html("<a title=\"" + results[0].agreementTemplate.fileName + "\" href='" + results[0].agreementTemplate.fileUrl + "'>" + results[0].agreementTemplate.fileName + "</a>")
               } else {
                   $("#tgAgreeementTemplate").html("无");
               }


               var attachments = results[0].listAttachments;
               var atttachhtml = "";
               for (var i = 0; i < attachments.length; i++) {
                   atttachhtml += "<tr><td style='width:200px;'><a class='aIsExistFile' href=\"" + attachments[i].fileUrl + "\">" + attachments[i].fileName + "</a><input type=\"button\" class=\"uploaded-remove\" onclick=\"DeleteFile('" + attachments[i].attachementID + "',this)\"  /></td></tr>";
               }
               $(".tbFileList").append(atttachhtml);
               
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//新增附件项目
function AddUploadFile() {
    var fGuid = guid();
    var html = "<tr><td> <div class=\"relative\"><input id='" + fGuid + "' name=\"file\" onchange=\"ChangeFile(this)\" class='fileItem' type=\"file\" />" +
        "<input class=\"file-view\" type=\"button\" value=\"选择文件\"><input id=\"field-name\" style=\"width: 260px;\" type=\"text\" readonly=\"readonly\"><input class='btnRemove' onclick='RemoveUploadFile(this)'  type=\"button\"  /> </div></td></tr>";
    $(".tbUploadList").append(html);
    if ($(".fileItem").length > 1) {
        $(".btnRemove").show();
    } else {
        $(".btnRemove").hide();
    }
}
//移除附件项目
function RemoveUploadFile(obj) {
    $(obj).parent().parent().remove();
    if ($(".fileItem").length > 1) {
        $(".btnRemove").show();
    } else {
        $(".btnRemove").hide();
    }
}
//上传附件
function SaveFiles() {
   
    var isEmpty = false;
    var uids = "";
    for (var i = 0; i < $(".fileItem").length ; i++) {
        if ($(".fileItem")[i].value != "") {
            //$(this).alert("第" + (i + 1) + "行附件为空，请选择附件");
            isEmpty = true;
        }
        uids = uids + ";" + $($(".fileItem")[i]).attr("id");
    }

    if (!isEmpty && $(".aIsExistFile").length <= 0) {
        $(this).alert('请上传协议附件');
        return;
    }
    ShowLoading();
    $.ajaxFileUpload({
        url: '/api/proxy/uploadaggreementfile', //用于文件上传的服务器端请求地址
        contentType: "application/json; charset=utf-8",
        secureuri: false, //一般设置为false
        fileElementId: uids, //文件上传空间的id属性  <input type="file" id="file" name="file" />
        dataType: 'json', //返回值类型 一般设置为json
        type: 'post',
        data: { IncubatorApplyId: $("#hidApplyId").val(), DeleteIds: $("#hidDeleteFileId").val() },
        success: function (data, status) //服务器成功响应处理函数
        {
            HideLoading();
            $(this).alert("保存成功");
            setTimeout(function () {
                location.href = "incubatorapproveandlist.html";
            }, 2000);
           
        },
        error: function (data, status, e) //服务器响应失败处理函数
        {
            $(this).alert(e);
        }
    });
}
//删除附件
function DeleteFile(aid,obj) {
    var oldId = $("#hidDeleteFileId").val();
    $("#hidDeleteFileId").val(oldId + "|" + aid);
    $(obj).parent().parent().remove();
}

function ChangeFile(obj) {
    $(obj).parent().find("#field-name").val($(obj).val());
}