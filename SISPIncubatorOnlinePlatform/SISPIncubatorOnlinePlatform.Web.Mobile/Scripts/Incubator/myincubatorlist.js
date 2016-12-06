//var myScroll,
//   upIcon = $("#up-icon"),
//   downIcon = $("#down-icon");

var page = 1;

$(function () {
    ShowLoading();
    GetData(page);
});

//function loaded() {


//    myScroll = new IScroll('.scroller', {
//        //probeType: 3,
//        mouseWheel: true,
//        click: true,
//        scrollbars: true,
//        interactiveScrollbars: true,
//        shrinkScrollbars: 'scale',
//        preventDefault: false,
//        preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT|A)$/ }
//    });

//    myScroll.on("scroll", function () {
  
//    });

//    myScroll.on("slideDown", function () {
//        if (this.y > 80) {
//            //alert("slideDown");
//            page = 1;
//            upIcon.removeClass("reverse_icon");
//        };
//    });

//    myScroll.on("slideUp", function () {
//        if (this.maxScrollY - this.y > 80) {
//            // alert("slideUp");
//            //page = page + 1;
//            //GetData(page);
//            //upIcon.removeClass("reverse_icon");
//        }
//    });
//    myScroll.on("scrollEnd", function() {
//        //alert('scrollEnd');
//    });
//}




function GetData(page) {

    var searchObj = {
        PageSize: "20",
        PageNumber: page,
        KeyWord: $("#divSearchCondition").val(),
        UserType: "common"
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
           url: "/api/proxy/post/anonymous",
           data: jsonData,
           dataType: "json",
           contentType: "application/json; charset=utf-8",
           success: function (data) {
               var results = data.results;
               GetHtml(results);
               CheckLoadMoreShowOrHide(results);
               HideLoading();
           },
           error: function (err) {
               ErrorResponse(err);
           }
       });
}
//点击加载更多 
function ClickLoadMore() {
    page = page + 1;
    GetData(page);
}
//判断加载更多是否出现
function CheckLoadMoreShowOrHide(results) {
    if ($(".businessList td").length < 20 || results.length<=0) {
        $(".divLoadMore").hide();
    } else {
        $(".divLoadMore").show();
    }
}

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
            var newLog = frontPart + "_s.jpg";

            htmlItem += "<td><a class=\"businessListDiv\"  href=\"#\"><div class=\"businessPicDiv\">";
            htmlItem += "  <div class=\"businessPicInfoBox\"> <div class=\"businessPic\">";
            htmlItem += " <img src='" + newLog + "' onclick=\"OpenInucubatorInfo('" + data[i].incubatorID + "')\"  /> </div><div class=\"businessPicTxt\">";
            htmlItem += "<p class=\"businessTitle\">" + data[i].incubatorName + "</p><input class=\"editBtn\" onclick=\"ModifyMyIncubator('" + data[i].incubatorID + "')\" type=\"button\"></div></div></div></a></td>";
            if (mm == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.businessList').append(html);
                htmlItem = "";
                mm = 0;
                continue;
            }

            if ((data.length - i == 1) && data.length % 2 == 1) {
                html = "<tr>" + htmlItem + "</tr>";
                $('.businessList').append(html);
                htmlItem = "";
            }
            mm++;
        }
    }
    if (data.length == 0&&page==1) {
        $("#divbusinessList").show();
    } else {
        $("#divbusinessList").hide();
    }
    //add  2016-04-26
    if (data.length == 1 && page == 1) {
        $(".businessList").find("tr:last").append("<td></td>");
    }

    var trObj = $(".businessList").find("tr:last");
    var picDivObj = trObj.find(".businessPicDiv");
    if (picDivObj.length == 1) {
        picDivObj.css("border-right", "0px solid #dadada");
    }
    //add  2016-04-26
}

function OpenInucubatorInfo(id) {
   window.location.href = 'incubatorinfo.html?id=' + id;
}

function SearchByKeys() {
    page = 1;
    $('.businessList').html("");
    GetData(page);
}

function ModifyMyIncubator(id) {
   window.location.href = 'modifyincubator.html?id=' + id;
}