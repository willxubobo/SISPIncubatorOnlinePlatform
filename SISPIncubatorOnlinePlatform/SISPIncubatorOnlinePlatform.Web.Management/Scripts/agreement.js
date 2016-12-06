$(function() {
    LoadAgreementHtml();
    popup();
});

function LoadAgreementHtml() {
    var html = "";
    html += "<div class=\"popup-div divAgreement\" style='display:none;' >";
    html += "<div class=\"popup-bg\"></div>";
    html += " <div class=\"popup-content center\" style=\"width: 625px;\">";
    html += "  <div class=\"popup-main-content white-bg\">";
    html += "     <div class=\"apply-settled-box\">";
    html += "        <div class=\"apply-settled-title\">用户协议</div>";
    html += "       <div class=\"agreement-box-scroll\">";
    html += "          <div class=\"agreementTitle\">1.标题标题</div>";
    html += "            <div class=\"agreementTxt\">江苏苏大天宫创业投资管理有限公司是苏大科技园下属的孵化器专业管理公司，是由苏州大学2010年发起、波司登股份有限公司投资创办，是苏州工业园区创新服务体系的重要组成部分，是苏大科技园孵化器集群和专业技术平台的管理经营者。苏大天宫专注于科技创业孵化+投资、“产学研”转化、科技园运营，孵化培养一批符合苏州工业园区产业发展方向的高新技术企业。主要产业方向为云计算、大数据、移动互联网、生物医药、纳米材料、新能源汽车等...</div>";
    html += "             <div class=\"agreementTitle\">1.标题标题</div>";
    html += "                <div class=\"agreementTxt\">江苏苏大天宫创业投资管理有限公司是苏大科技园下属的孵化器专业管理公司，是由苏州大学2010年发起、波司登股份有限公司投资创办，是苏州工业园区创新服务体系的重要组成部分，是苏大科技园孵化器集群和专业技术平台的管理经营者。苏大天宫专注于科技创业孵化+投资、“产学研”转化、科技园运营，孵化培养一批符合苏州工业园区产业发展方向的高新技术企业。主要产业方向为云计算、大数据、移动互联网、生物医药、纳米材料、新能源汽车等...</div>";
    html += "               <div class=\"agreementTitle\">1.标题标题</div>";
    html += "                <div class=\"agreementTxt\">江苏苏大天宫创业投资管理有限公司是苏大科技园下属的孵化器专业管理公司，是由苏州大学2010年发起、波司登股份有限公司投资创办，是苏州工业园区创新服务体系的重要组成部分，是苏大科技园孵化器集群和专业技术平台的管理经营者。苏大天宫专注于科技创业孵化+投资、“产学研”转化、科技园运营，孵化培养一批符合苏州工业园区产业发展方向的高新技术企业。主要产业方向为云计算、大数据、移动互联网、生物医药、纳米材料、新能源汽车等...</div>";
    html += "                <div class=\"agreementTitle\">1.标题标题</div>";
    html += "                <div class=\"agreementTxt\">江苏苏大天宫创业投资管理有限公司是苏大科技园下属的孵化器专业管理公司，是由苏州大学2010年发起、波司登股份有限公司投资创办，是苏州工业园区创新服务体系的重要组成部分，是苏大科技园孵化器集群和专业技术平台的管理经营者。苏大天宫专注于科技创业孵化+投资、“产学研”转化、科技园运营，孵化培养一批符合苏州工业园区产业发展方向的高新技术企业。主要产业方向为云计算、大数据、移动互联网、生物医药、纳米材料、新能源汽车等...</div>";
    html += "            </div>";
    html += "        </div>";
    html += "        <div class=\"btn-box audit-btn-box\">";
    html += "            <a class=\"base-btn sm-btn bule-btn space25\" onclick='AgreeOK()' href=\"javascript:;\">同意</a>";
    html += "        </div>";
    html += "    </div>";
    html += " </div>";
    html += "</div>";
    if ($(".divAgreement").length<=0)
    {
        $("body").append(html);
    }
}
//同意
function AgreeOK() {
    var checkboxObj = $(".agreement-box").find("input[type='checkbox']");
    checkboxObj.prop("checked", true);
    if (typeof (ClickAgree) == "function") {
        ClickAgree(checkboxObj[0]);
    }
    $(".divAgreement").hide();
}
//打开协议
function OpenAgreement() {
    $(".divAgreement").show();
}