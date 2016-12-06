//兼容ie6的fixed代码 
//jQuery(function($j){
//	$j('#pop').positionFixed()
//})
(function ($j) {
    $j.positionFixed = function (el) {
        $j(el).each(function () {
            new fixed(this)
        })
        return el;
    }
    $j.fn.positionFixed = function () {
        return $j.positionFixed(this)
    }
    var fixed = $j.positionFixed.impl = function (el) {
        var o = this;
        o.sts = {
            target: $j(el).css('position', 'fixed'),
            container: $j(window)
        }
        o.sts.currentCss = {
            top: o.sts.target.css('top'),
            right: o.sts.target.css('right'),
            bottom: o.sts.target.css('bottom'),
            left: o.sts.target.css('left')
        }
        if (!o.ie6) return;
        o.bindEvent();
    }
    $j.extend(fixed.prototype, {
        //ie6 : $.browser.msie && $.browser.version < 7.0,
        bindEvent: function () {
            var o = this;
            o.sts.target.css('position', 'absolute')
            o.overRelative().initBasePos();
            o.sts.target.css(o.sts.basePos)
            o.sts.container.scroll(o.scrollEvent()).resize(o.resizeEvent());
            o.setPos();
        },
        overRelative: function () {
            var o = this;
            var relative = o.sts.target.parents().filter(function () {
                if ($j(this).css('position') == 'relative') return this;
            })
            if (relative.size() > 0) relative.after(o.sts.target)
            return o;
        },
        initBasePos: function () {
            var o = this;
            o.sts.basePos = {
                top: o.sts.target.offset().top - (o.sts.currentCss.top == 'auto' ? o.sts.container.scrollTop() : 0),
                left: o.sts.target.offset().left - (o.sts.currentCss.left == 'auto' ? o.sts.container.scrollLeft() : 0)
            }
            return o;
        },
        setPos: function () {
            var o = this;
            o.sts.target.css({
                top: o.sts.container.scrollTop() + o.sts.basePos.top,
                left: o.sts.container.scrollLeft() + o.sts.basePos.left
            })
        },
        scrollEvent: function () {
            var o = this;
            return function () {
                o.setPos();
            }
        },
        resizeEvent: function () {
            var o = this;
            return function () {
                setTimeout(function () {
                    o.sts.target.css(o.sts.currentCss);
                    o.initBasePos();
                    o.setPos()
                }, 1)
            }
        }
    })
})(jQuery)

jQuery(function ($j) {
    $j('#footer').positionFixed();
})

//pop右下角弹窗函数
function Pop(title, url, intro) {
    this.title = title;
    this.url = url;
    this.intro = intro;
    this.apearTime = 1000;
    this.hideTime = 500;
    this.delay = 5000;
    //添加信息
    this.addInfo();
    //显示
    this.showDiv();
    //关闭
    this.closeDiv();
}
Pop.prototype = {
    addInfo: function () {
        $("#popTitle a").attr('href', this.url).html(this.title);
        var content = "";
        if (this.intro.length >= 110) {
            content = this.intro.substring(0, 110) + "...";
        } else {
            content = this.intro;
        }
        $("#popIntro").html(content);
        $("#popMore a").attr('href', this.url);
    },
    showDiv: function (time) {
        if (!$.support.style) {
            $('#pop').slideDown(this.apearTime).delay(this.delay).fadeOut(400);;
        } else {//调用jquery.fixed.js,解决ie6不能用fixed
            $('#pop').show();
            jQuery(function ($j) {
                $j('#pop').positionFixed();
            });
        }
    },
    closeDiv: function () {
        $("#popClose").click(function () {
            $('#pop').hide();
        }
        );
    }
}


$(function () {
    var html = "";
    html += " <div id=\"pop\" class='popTips' style=\"display:none;\">";
    html += "<div id=\"popHead\">";
    html += "   <a id=\"popClose\" title=\"关闭\">关闭</a>";
    html += "   <h2>温馨提示</h2>";
    html += "</div>";
    html += "<div id=\"popContent\">";
    html += "    <dl>";
    html += "        <dt id=\"popTitle\"><a href=\"http://yanue.info/\" target=\"_blank\">这里是参数</a></dt>";
    html += "        <dd id=\"popIntro\">这里是内容简介</dd>";
    html += "    </dl>";
    html += "    <p id=\"popMore\"><a href=\"http://yanue.info/\" target=\"_blank\">查看 »</a></p>";
    html += " </div>";
    html += " </div>";

    if ($(".popTips").length <= 0) {
        $("body").append(html);
    }
    GetMsg();
});

function GetMsg() {
    var searchObj = {
        MsgType: "pop"
        //KeyWord: '123'
    }
    var parameter = {
        requestUri: "/api/messages",
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
            if (results.length > 0) {
                var msgType = results[0].msgType;
                var title = "系统消息";
                var content = results[0].content;
                var sendfromname = results[0].sendFromUserName;
                if (msgType == "1") {
                    title = "个人会话";
                }
                if (sendfromname!=null) {
                    title = title + "(来自：" + sendfromname + ")";
                }
                ShowPopTips(title, content);
            }
        },
        error: function (err) {
            ErrorResponse(err);
        }
    });
}
//每3分钟更新一次
var timeX = 1000 * 60 * 0.3;
setInterval("GetMsg()", timeX);//1000为1秒钟,设置为1分钟。 


function ShowPopTips(title, content) {
    var pop = new Pop(title, "/MessageCenter/messagecenter.html", content);
}