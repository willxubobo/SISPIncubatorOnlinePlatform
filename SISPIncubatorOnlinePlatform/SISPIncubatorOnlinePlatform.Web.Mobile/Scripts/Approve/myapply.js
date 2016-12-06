var page = 0;

$(function () {
    ShowLoading();
    GetData(page);
});
function GetData(page) {

    var searchObj = {
        PageSize: "10",
        PageNumber: page,
        KeyWord: ""
    }

    var parameter = {
        requestUri: "/api/approverecord/myapply",
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
               $(".nodata").hide();
               $('#ulapply').show();
               var results = data.results;
               if (data.results.length > 0) {
                   GetHtml(results);
                   CheckLoadMoreShowOrHide(results);
               } else {
                   if (page == 0) {
                       nodata();
                   } else {
                       $(".divLoadMore").hide();
                   }
               }
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
               HideLoading();
           }
       });
}
//点击加载更多
function ClickLoadMore() {
    ShowLoading();
    page = page + 1;
    GetData(page);
}
//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($("#ulapply li").length < 10 || results.length <= 0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

function GetHtml(data) {
    var htmlItem = "";
    
    for (i = 0; i < data.length; i++) {
        var applytype = data[i].applyType;
        switch (applytype) {
            case "0":
                applytype = "孵化器入驻申请"; break;
            case "1":
                applytype = "办公室入驻申请"; break;
            case "2":
                applytype = "投资人资格申请"; break;
            case "3":
                applytype = "融资发布申请"; break;
            case "4":
                applytype = "服务发布申请"; break;
            case "5":
                applytype = "需求发布申请"; break;
            case "6":
                applytype = "活动发布申请"; break;
            case "7":
                applytype = "举办孵化器活动申请"; break;
            default: applytype = ""; break;
        }
        var approvestatus = "<div class=\"applicationStatic yellowBg\">待审核</div>";
        if (data[i].approveResult == "2") {
            approvestatus = "<div class=\"applicationStatic greenBg\">审核通过</div>";
        } else if (data[i].approveResult == "3") {
            approvestatus = "<div class=\"applicationStatic redBg\">审核拒核</div>";
        }
        //htmlItem += "<li><a class=\"applicationLink\" href=\"javascript:void(0);\" onclick=\"showinfo('"+data[i].approveRelateID+"');\">";
        //htmlItem += "<div class=\"applicationTitle\">" + data[i].created.substring(0, 10)+" " + applytype + "</div>";
        //htmlItem += approvestatus;
        //htmlItem += "<div class=\"PLMore\"></div></a></li>";

        htmlItem += "<li><a class=\"applicationLink\" onclick=\"showinfo('" + data[i].approveRelateID + "');\" >";
        htmlItem += "                <div class=\"applicationTitle\">";
        htmlItem += "                       <span class=\"apTitle\">" + applytype + "</span>";
        htmlItem += "                     <span class=\"apDate\">"+ data[i].created.substring(0, 10)+"</span>";
        htmlItem += "                    </div>";
        htmlItem += approvestatus;
        htmlItem += "                  <div class=\"PLMore\"></div>";
        htmlItem += "             </a></li>";
    }
    if (htmlItem != "") {
        $('#ulapply').append(htmlItem);
    }
}
//暂无数据
function nodata() {
    //var htmlItem = "<li>暂无数据！</li>";
    $(".nodata").show();
    $('#ulapply').empty().hide();
}
//详情
function showinfo(id) {
   window.location.href = "approveprogress.html?id=" + id;
}