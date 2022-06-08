$( document ).ready(function() {
  var windowSize = $(window).width();

  $(window).resize(function() {
  windowSize = $(window).width();
  });

  $('#nav-search-form').submit( function(){
    if($(".search-box").val() == '' && windowSize < 1200) {
        $('#nav-search-form').hide();
        $('#search-icon').fadeIn();
    }
  });
  $(document).on('click', '.open-search', function(){
    $('#nav-search-form').fadeIn();
    $('#search-icon').hide();
  });
});