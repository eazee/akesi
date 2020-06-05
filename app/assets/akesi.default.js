$(function() {
    // navbar functionality
    $(".navbar-burger").click(function() {
        $(this).toggleClass("is-active");
        $("#"+$(this).data("target")).toggleClass("is-active");
    });
  });