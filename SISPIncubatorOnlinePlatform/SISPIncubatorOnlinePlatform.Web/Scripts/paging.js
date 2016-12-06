﻿/*
keleyidivpagver 分页插件
http://keleyi.com
柯乐义
*/
var totalDemandPage = 0;
var totalDemandRecords = 0;
var demandPageNo = 1; //这里设置参数名(柯 乐 义 注 释)
function demandPageinit() {
    //生成分页控件 根据分页的形式在这里设置
    demandkkpager.init({
        pno: demandPageNo,
        //总页码
        total: totalDemandPage,
        //总数据条数
        totalDemandRecords: totalDemandRecords,
        //链接前部
        hrefFormer: 'paging',
        //链接尾部
        hrefLatter: '.htm',
        getDemandLink: function (n) {
            return this.hrefFormer + this.hrefLatter + "?p=" + n; //参数名跟上面相同
        }
    });
    demandkkpager.generDemandPageHtml();
}
var demandkkpager = {
    //divID
    pagerid: 'div_demandpager',
    //当前页码
    pno: 1,
    //总页码
    total: 1,
    //总数据条数
    totalDemandRecords: 0,
    //是否显示总页数
    isShowtotalDemandPage: true,
    //是否显示总记录数
    isShowtotalDemandRecords: true,
    //是否显示页码跳转输入框
    isgodemandpage: true,
    //链接前部
    hrefFormer: '',
    //链接尾部
    hrefLatter: '',
    /****链接算法****/
    getDemandLink: function (n) {
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
    focus_godemandpage: function () {
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

    blur_godemandpage: function () {
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
    godemandpage: function () {
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
        //window.location = this.getDemandLink(n);
        pageDemandPagination(n);
    },
    //分页按钮控件初始化
    init: function (config) {
        //赋值
        this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
        this.total = isNaN(config.total) ? 1 : parseInt(config.total);
        this.totalDemandRecords = isNaN(config.totalDemandRecords) ? 0 : parseInt(config.totalDemandRecords);
        if (config.pagerid) { this.pagerid = pagerid; }
        if (config.isShowtotalDemandPage != undefined) { this.isShowtotalDemandPage = config.isShowtotalDemandPage; }
        if (config.isShowtotalDemandRecords != undefined) { this.isShowtotalDemandRecords = config.isShowtotalDemandRecords; }
        if (config.isgodemandpage != undefined) { this.isgodemandpage = config.isgodemandpage; }
        this.hrefFormer = config.hrefFormer || '';
        this.hrefLatter = config.hrefLatter || '';
        if (config.getDemandLink && typeof (config.getDemandLink) == 'function') { this.getDemandLink = config.getDemandLink; }
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
    generDemandPageHtml: function () {
        if (!this.inited) {
            return;
        }

        var str_prv = '', str_next = '';
        if (this.hasPrv) {
            str_prv = '<a href="javascript:void(0)" onclick="pageDemandPagination(' + this.prv + ')" title="上一页">上一页</a>';
        } else {
            str_prv = '<span class="disabled">上一页</span>';
        }

        if (this.hasNext) {
            str_next = '<a href="javascript:void(0)" onclick="pageDemandPagination(' + this.next + ')" title="下一页">下一页</a>';
        } else {
            str_next = '<span class="disabled">下一页</span>';
        }


        var str = '';
        var dot = '<span>...</span>';
        var total_info = '';
        if (this.isShowtotalDemandPage || this.isShowtotalDemandRecords) {
            total_info = '<span class="normalsize">共';
            if (this.isShowtotalDemandPage) {
                total_info += this.total + '页';
                if (this.isShowtotalDemandRecords) {
                    total_info += '&nbsp;/&nbsp;';
                }
            }
            if (this.isShowtotalDemandRecords) {
                total_info += this.totalDemandRecords + '条数据';
            }

            total_info += '</span>';
        }

        var godemandpage_info = '';
        if (this.isgodemandpage) {
            godemandpage_info = '&nbsp;转到<span id="go_page_wrap" style="display:inline-block;width:44px;height:18px;border:1px solid #DFDFDF;margin:0px 1px;padding:0px;position:relative;left:0px;top:5px;">' +
					'<input type="button" id="btn_go" onclick="demandkkpager.godemandpage();" style="width:44px;height:20px;line-height:20px;padding:0px;font-family:arial,宋体,sans-serif;text-align:center;border:0px;background-color:#0063DC;color:#FFF;position:absolute;left:0px;top:-1px;display:none;" value="确定" />' +
					'<input type="text" id="btn_go_input" onfocus="demandkkpager.focus_godemandpage()" onkeypress="if(event.keyCode<48 || event.keyCode>57)return false;" onblur="demandkkpager.blur_godemandpage()" style="width:42px;height:16px;text-align:center;border:0px;position:absolute;left:0px;top:0px;outline:none;" value="' + this.next + '" /></span>页';
        }

        //分页处理
        if (this.total <= 8) {
            for (var i = 1; i <= this.total; i++) {
                if (this.pno == i) {
                    str += '<span class="curr">' + i + '</span>';
                } else {
                    str += '<a href="javascript:void(0)" onclick="pageDemandPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                }
            }
        } else {
            if (this.pno <= 5) {
                for (var i = 1; i <= 7; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a href="javascript:void(0)" onclick="pageDemandPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                    }
                }
                str += dot;
            } else {
                str += '<a href="javascript:void(0)" onclick="pageDemandPagination(1)" title="第1页">1</a>';
                str += '<a href="javascript:void(0)" onclick="pageDemandPagination(2)" title="第2页">2</a>';
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
                        str += '<a href="javascript:void(0)" onclick="pageDemandPagination(' + i + ')" title="第' + i + '页">' + i + '</a>';
                    }
                }
                if (end != this.total) {
                    str += dot;
                }
            }
        }

        str = "&nbsp;" + str_prv + str + str_next + total_info + godemandpage_info;
        $("#" + this.pagerid).html(str);
    }
};

function getDemandParameter(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}