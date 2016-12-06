/*
keleyidivpagver 分页插件
http://keleyi.com
柯乐义
*/
var totalsecondPage = 0;
var totalsecondRecords = 0;
var secondPageNo = 1; //这里设置参数名(柯 乐 义 注 释)
function secondPageinit() {
    //生成分页控件 根据分页的形式在这里设置
    secondkkpager.init({
        pno: secondPageNo,
        //总页码
        total: totalsecondPage,
        //总数据条数
        totalsecondRecords: totalsecondRecords,
        //链接前部
        hrefFormer: 'secondpaging',
        //链接尾部
        hrefLatter: '.htm',
        getsecondLink: function (n) {
            return this.hrefFormer + this.hrefLatter + "?p=" + n; //参数名跟上面相同
        }
    });
    secondkkpager.genersecondPageHtml();
}
var secondkkpager = {
    //divID
    pagerid: 'div_secondpager',
    //当前页码
    pno: 1,
    //总页码
    total: 1,
    //总数据条数
    totalsecondRecords: 0,
    //是否显示总页数
    isShowtotalsecondPage: true,
    //是否显示总记录数
    isShowtotalsecondRecords: true,
    //是否显示页码跳转输入框
    isgosecondpage: true,
    //链接前部
    hrefFormer: '',
    //链接尾部
    hrefLatter: '',
    /****链接算法****/
    getsecondLink: function (n) {
        //这里的算法适用于比如：
        //hrefFormer=http://keleyi.com/news/20131212
        //hrefLatter=.html
        //那么首页（第1页）就是http://keleyi.com/news/20131212.html
        //第2页就是http://keleyi.com/news/20131212_2.html
        //第n页就是http://keleyi.com/news/20131212_n.html
        if (n == 1) {
            return this.hrefFormer + this.hrefLatter;
        } else {
            return this.hrefFormer + '_' + n + this.hrefLatter;
        }
    },
    //跳转框得到输入焦点时
    focus_gosecondpage: function () {
        var btnGo = $('#btn_go');
        $('#btn_go_input').attr('hideFocus', true);
        btnGo.show();
        btnGo.css('left', '0px');
        $('#go_page_wrap').css('border-color', '#6694E3');
        btnGo.animate({ left: '+=44' }, 50, function () {
            //$('#go_page_wrap').css('width','88px');
        });
    },

    //跳转框失去输入焦点时

    blur_gosecondpage: function () {
        setTimeout(function () {
            var btnGo = $('#btn_go');
            //$('#go_page_wrap').css('width','44px');
            btnGo.animate({
                left: '-=44'
            }, 100, function () {
                $('#btn_go').css('left', '0px');
                $('#btn_go').hide();
                $('#go_page_wrap').css('border-color', '#DFDFDF');
            });
        }, 400);
    },
    //跳转框页面跳转
    gosecondpage: function () {
        var str_page = $("#btn_go_input").val();
        if (isNaN(str_page)) {
            $("#btn_go_input").val(this.next);
            return;
        }
        var n = parseInt(str_page);
        if (n < 1 || n > this.total) {
            $("#btn_go_input").val(this.next);
            return;
        }
        //这里可以按需改window.open
        //window.location = this.getsecondLink(n);
        pagesecondPagination(n);
    },
    //分页按钮控件初始化
    init: function (config) {
        //赋值
        this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
        this.total = isNaN(config.total) ? 1 : parseInt(config.total);
        this.totalsecondRecords = isNaN(config.totalsecondRecords) ? 0 : parseInt(config.totalsecondRecords);
        if (config.pagerid) { this.pagerid = pagerid; }
        if (config.isShowtotalsecondPage != undefined) { this.isShowtotalsecondPage = config.isShowtotalsecondPage; }
        if (config.isShowtotalsecondRecords != undefined) { this.isShowtotalsecondRecords = config.isShowtotalsecondRecords; }
        if (config.isgosecondpage != undefined) { this.isgosecondpage = config.isgosecondpage; }
        this.hrefFormer = config.hrefFormer || '';
        this.hrefLatter = config.hrefLatter || '';
        if (config.getsecondLink && typeof (config.getsecondLink) == 'function') { this.getsecondLink = config.getsecondLink; }
        //验证
        if (this.pno < 1) this.pno = 1;
        this.total = (this.total <= 1) ? 1 : this.total;
        if (this.pno > this.total) this.pno = this.total;
        this.prv = (this.pno <= 2) ? 1 : (this.pno - 1);
        this.next = (this.pno >= this.total - 1) ? this.total : (this.pno + 1);
        this.hasPrv = (this.pno > 1);
        this.hasNext = (this.pno < this.total);

        this.inited = true;
    },
    //生成分页控件Html
    genersecondPageHtml: function () {
        if (!this.inited) {
            return;
        }

        var str_prv = '', str_next = '';
        if (this.hasPrv) {
            str_prv = '<a href="javascript:void(0)" onclick="pagesecondPagination(' + this.prv + ')" title="上一页">上一页</a>';
        } else {
            str_prv = '<span class="disabled">上一页</span>';
        }

        if (this.hasNext) {
            str_next = '<a href="javascript:void(0)" onclick="pagesecondPagination(' + this.next + ')" title="下一页">下一页</a>';
        } else {
            str_next = '<span class="disabled">下一页</span>';
        }


        var str = '';
        var dot = '<span>...</span>';
        var total_info = '';
        if (this.isShowtotalsecondPage || this.isShowtotalsecondRecords) {
            total_info = '<span class="normalsize">共';
            if (this.isShowtotalsecondPage) {
                total_info += this.total + '页';
                if (this.isShowtotalsecondRecords) {
                    total_info += '&nbsp;/&nbsp;';
                }
            }
            if (this.isShowtotalsecondRecords) {
                total_info += this.totalsecondRecords + '条数据';
            }

            total_info += '</span>';
        }

        var gosecondpage_info = '';
        if (this.isgosecondpage) {
            gosecondpage_info = '&nbsp;转到<span id="go_page_wrap" style="display:inline-block;width:44px;height:18px;border:1px solid #DFDFDF;margin:0px 1px;padding:0px;position:relative;left:0px;top:5px;">' +
					'<input type="button" id="btn_go" onclick="secondkkpager.gosecondpage();" style="width:44px;height:20px;line-height:20px;padding:0px;font-family:arial,宋体,sans-serif;text-align:center;border:0px;background-color:#0063DC;color:#FFF;position:absolute;left:0px;top:-1px;display:none;" value="确定" />' +
					'<input type="text" id="btn_go_input" onfocus="secondkkpager.focus_gosecondpage()" onkeypress="if(event.keyCode<48 || event.keyCode>57)return false;" onblur="secondkkpager.blur_gosecondpage()" style="width:42px;height:16px;text-align:center;border:0px;position:absolute;left:0px;top:0px;outline:none;" value="' + this.next + '" /></span>页';
        }

        //分页处理
        if (this.total <= 8) {
            for (var i = 1; i <= this.total; i++) {
                if (this.pno == i) {
                    str += '<span class="curr">' + i + '</span>';
                } else {
                    str += '<a href="javascript:void(0)" onclick="pagesecondPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                }
            }
        } else {
            if (this.pno <= 5) {
                for (var i = 1; i <= 7; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a href="javascript:void(0)" onclick="pagesecondPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                    }
                }
                str += dot;
            } else {
                str += '<a href="javascript:void(0)" onclick="pagesecondPagination(1)" title="第1页">1</a>';
                str += '<a href="javascript:void(0)" onclick="pagesecondPagination(2)" title="第2页">2</a>';
                str += dot;

                var begin = this.pno - 2;
                var end = this.pno + 2;
                if (end > this.total) {
                    end = this.total;
                    begin = end - 4;
                    if (this.pno - begin < 2) {
                        begin = begin - 1;
                    }
                } else if (end + 1 == this.total) {
                    end = this.total;
                }
                for (var i = begin; i <= end; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a href="javascript:void(0)" onclick="pagesecondPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                    }
                }
                if (end != this.total) {
                    str += dot;
                }
            }
        }

        str = "&nbsp;" + str_prv + str + str_next + total_info + gosecondpage_info;
        $("#" + this.pagerid).html(str);
    }
};

function getsecondParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}