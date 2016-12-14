var clipboard = new Clipboard('.btn');

clipboard.on('success', function(e) {
    showToast();
    e.clearSelection();
});

$(document).ready(function(){

  var promise = $.getJSON("https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1&callback=");
  promise.done(function(a) {
    var quote = "<div class='row'><blockquote><p>"+a[0].content+"</p><footer>"+a[0].title+"</footer></blockquote></div><div class='clearfix'></div>";
    var stripedContent = $(a[0].content).text();
    quote += "<div class='row'><a class='btn btn-social btn-twitter' href='https://twitter.com/intent/tweet?text="+stripedContent+"' target='_blank'>Tweet</a><button class='btn' data-clipboard-text='"+stripedContent+"'>Copy to clipboard</button></div>";
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

  var btn = document.getElementById('my-btn');
    btn.onclick = function(event){
  		btn.children[0].classList.add('spin-animation');
          setTimeout(function(){
          	btn.children[0].classList.remove('spin-animation');
          }, 500);
      quoteRefresh();
    }
});

PullToRefresh.init({
  mainElement: 'body',
  onRefresh: function(){
    quoteRefresh();
  }
});

function quoteRefresh(){
  $.ajax( {
    url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',
    success: function(data) {
      var post = data.shift(); // The data is an array of posts. Grab the first one.
      var quote = "<div class='row'><blockquote><p>"+post.content+"</p><footer>"+post.title+"</footer></blockquote></div><div class='clearfix'></div>";
      var stripedContent = $(post.content).text();
      quote += "<div class='row'><a class='btn btn-social btn-twitter' href='https://twitter.com/intent/tweet?text="+stripedContent+"' target='_blank'>Tweet</a><button class='btn' data-clipboard-text='"+stripedContent+"'>Copy to clipboard</button></div>";
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

function showToast() {
    // Get the toast DIV
    var x = document.getElementById("toast")

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
}

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
