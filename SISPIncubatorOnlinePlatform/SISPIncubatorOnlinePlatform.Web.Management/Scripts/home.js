$(function () {
    //初始化日历
    $('.calendar').mobiscroll().calendar({
        theme: 'mobiscroll',
        lang: 'zh',
        display: 'inline',
        dateFormat: 'mm/dd/yy',
        markedDisplay: 'bottom',
        layout: 'fixed',
        calendarWidth: '258',
        marked: [{
            d: '4/8',
            color: '#EBAE75'
        }, {
            d: '4/10',
            color: '#EBAE75'
        }, {
            d: '4/21',
            color: '#EBAE75'
        }, {
            d: '4/25',
            color: '#EBAE75'
        }, {
            d: '4/26',
            color: '#EBAE75'
        }],
        navigation: 'month',
        monthNames: ['. 01', '. 02', '. 03', '. 04', '. 05', '. 06', '. 07', '. 08', '. 09', '. 10', '. 11', '. 12']
    });

    //添加链接地址
    //办公室入驻
    $(".divSection").find("li.thirdSection").click(function () {
        window.open("office/officesettledaapply.html");
    });
    //孵化器入驻
    $(".divSection").find("li.sixthSection").click(function () {
        window.open("Incubator/incubatorapply.html");
    });
});

//点击孵化器，打开孵化器详情
function OpenIncubatorApply(id) {
    window.open("incubator/incubatorinfo.html?id="+id);
}

