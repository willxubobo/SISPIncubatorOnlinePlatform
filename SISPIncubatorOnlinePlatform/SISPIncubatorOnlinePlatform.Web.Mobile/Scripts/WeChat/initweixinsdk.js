$(function () {
   // ShowLoading();
    ConfigWxSdk();
    var picurl = "http://" +window.location.host + "/images/f1.jpg";
    var ptitle = document.title;
    var shareurl =window.location.href;
    var desc = "苏州国际科技园创新加速平台";
    document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
        // 发送给好友
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', {
                "appid": "123",
                "img_url": picurl,
                "img_width": "160",
                "img_height": "160",
                "link": shareurl,
                "desc": desc,
                "title": ptitle
            }, function(res) {

            });
        });

        // 分享到朋友圈
        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke('shareTimeline', {
                "img_url": picurl,
                "img_width": "160",
                "img_height": "160",
                "link": shareurl,
                "desc": desc,
                "title": ptitle
            }, function(res) {
               
            });
        });

        // 分享到微博
        //WeixinJSBridge.on('menu:share:weibo', function (argv) {
        //    WeixinJSBridge.invoke('shareWeibo', {
        //        "img_url": picurl,
        //        "img_width": "160",
        //        "img_height": "160",
        //        "link": shareurl,
        //        "desc": desc,
        //        "title": ptitle
        //    }, function (res) {

        //    });
        //});

        // 分享到qq
        WeixinJSBridge.on('menu:share:qq', function (argv) {
            WeixinJSBridge.invoke('shareQQ', {
                "img_url": picurl,
                "img_width": "160",
                "img_height": "160",
                "link": shareurl,
                "desc": desc,
                "title": ptitle
            }, function (res) {

            });
        });
    }, false);
});

//配置上传图片
function ConfigWxSdk() {
    var purl =window.location.href.split('#')[0];
    var parameter = {
        "requestUri": "/api/weixin/ticket",
        "requestParameters": {
            "PageUrl": purl
        }
    };
    var parameterJson = JSON.stringify(parameter);
    $.ajax({
        type: "post",
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        url: "/api/proxy/post/anonymous",
        data: parameterJson,
        success: function (result) {
            if (result != undefined && result != null) {
                var data = result;
                data = eval("(" + data + ")");//实例化
                wxconfig(data);
                wx.ready(function () {
                    wx.checkJsApi({
                        jsApiList: [
                          'onMenuShareTimeline',
                          'onMenuShareAppMessage',
                          'chooseImage',
                          'onMenuShareWeibo'
                        ],
                        success: function (res) {

                        }
                    });
                });
            }
            HideLoading();
        },
        error: function (result) {
            ErrorResponse(result);
        }
    });
}

function wxconfig(data) {
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature,// 必填，签名，见附录1
        jsApiList: [
        'checkJsApi',
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo',
        'hideMenuItems',
        'showMenuItems',
        'hideAllNonBaseMenuItem',
        'showAllNonBaseMenuItem',
        'translateVoice',
        'startRecord',
        'stopRecord',
        'onRecordEnd',
        'playVoice',
        'pauseVoice',
        'stopVoice',
        'uploadVoice',
        'downloadVoice',
        'chooseImage',
        'previewImage',
        'uploadImage',
        'downloadImage',
        'getNetworkType',
        'openLocation',
        'getLocation',
        'hideOptionMenu',
        'showOptionMenu',
        'closeWindow',
        'scanQRCode',
        'chooseWXPay',
        'openProductSpecificView',
        'addCard',
        'chooseCard',
        'openCard'
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });
}