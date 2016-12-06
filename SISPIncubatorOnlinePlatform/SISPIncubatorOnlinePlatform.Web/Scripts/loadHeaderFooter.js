$(function () {
    if ($(".divTopNav")) {
        var headerUrl =window.location.protocol + "//" +window.location.host + "/Navigation.html?" + Math.random();
        $(".divTopNav").load(headerUrl);
    }
    if ($("#divFoot")) {
        var footUrl =window.location.protocol + "//" +window.location.host + "/Footer.html?" + Math.random();
        $("#divFoot").load(footUrl);
    }
    if ($("#divLeftNav")) {
        var leftUrl =window.location.protocol + "//" +window.location.host + "/LeftNavigation.html?" + Math.random();
        $("#divLeftNav").load(leftUrl);      
    } 
});