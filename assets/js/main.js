$(document).ready(function () {
    $("a.open").click(function () {
        $(".content").addClass("active");
    });

    $("a.close").click(function () {
        $(".content").removeClass("active");
    });
});
