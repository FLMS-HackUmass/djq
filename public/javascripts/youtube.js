$(document).ready(function(){
  var input = $('#searchbar');
  input.keyup(function(){
     search(input.val());
  });

});


function showResponse(response){
  $('#results').empty();
  var res = response.items;
  console.log(res[0]);
  res.forEach(function(video){
    var djObj ={};
    djObj.title    = video.snippet.title;
    djObj.url      = video.id.videoId;
    djObj.thumbnail = video.snippet.thumbnails.default.url; 
    $('#results').append("<li>"+djObj.title+
           "<a href=https://www.youtube.com/watch?v="
              +djObj.url+"><img src="+djObj.thumbnail+"></a>"
                         +"</li>");
  });

}

function onClientLoad(){

  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad(){

  gapi.client.setApiKey('AIzaSyCGYJ3Qyz27hn0MKT7CSHlf7l9kB-qkLgY');
//  search();
}

function search(query){

  var req = gapi.client.youtube.search.list({
    part: 'snippet',
    q: query
  });

  req.execute(onSearchResponse);
}

function onSearchResponse(response) {
 
//  console.log(response);
  showResponse(response);
}
