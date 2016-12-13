$(document).ready(function(){

  $.getJSON("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=", function(a) {
    var quote = "<div class='row'><blockquote><p>"+a[0].content+"</p><footer>"+a[0].title+"</footer></blockquote></div><div class='clearfix'></div><div class='row'><a class='btn btn-social btn-twitter' href='https://twitter.com/intent/tweet?text="+a[0].content+"'>Tweet</a></div>";
    $("#quotes").append(quote);
    localStorage.setItem('quote', quote);
  })
  .fail(function() {
    var quote = localStorage.getItem('quote');
    if(quote!=''){
      $("#quotes").html('');
      $("#quotes").append(quote);
    }
  });
});

PullToRefresh.init({
  mainElement: 'body',
  onRefresh: function(){
    $.ajax( {
      url: 'http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
      success: function(data) {
        var post = data.shift(); // The data is an array of posts. Grab the first one.
        var quote = "<blockquote><p>"+post.content+"</p><footer>"+post.title+"</footer></blockquote>";
        $("#quotes").html('');
        $("#quotes").append(quote);
        localStorage.setItem('quote', quote);
      },
      error: function(xhr, textStatus, errorThrown){
        var quote = localStorage.getItem('quote');
        if(quote!=''){
          $("#quotes").html('');
          $("#quotes").append(quote);
        }
      },
      cache: false
    });
  }
});

// Registering ServiceWorker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ',    registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}
