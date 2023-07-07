
  (function ($) {
  
  "use strict";

    // MENU
    $('.navbar-collapse a').on('click',function(){
      $(".navbar-collapse").collapse('hide');
    });
    
    // CUSTOM LINK
    $('.smoothscroll').click(function(){
      var el = $(this).attr('href');
      var elWrapped = $(el);
      var header_height = $('.navbar').height();
  
      scrollToDiv(elWrapped,header_height);
      return false;
  
      function scrollToDiv(element,navheight){
        var offset = element.offset();
        var offsetTop = offset.top;
        var totalScroll = offsetTop-navheight;
  
        $('body,html').animate({
        scrollTop: totalScroll
        }, 300);
      }
    });
  
  })(window.jQuery);




// Get all the caption elements
var captions = document.querySelectorAll('.job');

// Iterate over each caption element
captions.forEach(function(caption) {
  var text = caption.textContent;
  
  // Check if the text length exceeds 20 characters
  if (text.length > 20) {
    // Truncate the text and add three dots
    var truncatedText = text.slice(0, 20) + '...';
    
    // Update the caption element with the truncated text
    caption.textContent = truncatedText;
  }
});

