function showResponse(response){
  $('#results').empty();
  var res = response.items;
//  console.log(res[0]);
  var songPicker = {};
  var co = 0;
  res.forEach(function(video){
    var djObj ={};
    djObj.title    = video.snippet.title;
    djObj.url      = video.id.videoId;
    djObj.thumbnail = video.snippet.thumbnails.default.url; 
  //  $('#results').append("<li class=\"song\">"+djObj.title+
          // "<a href=https://www.youtube.com/watch?v="
  //            djObj.url+"<img src="+djObj.thumbnail+"></a>" 
  //                       +"</li>");
    songPicker[co.toString()] = djObj;
   // console.log(songPicker[co.toString()]);
    co++;
  });
  //console.log(songPicker);
  chooseSong(songPicker); 
}
var songz = [];
function chooseSong( songs ){
  
  if(!songs || songs === undefined) {
    return;
  }

  var t;
  for(t = 0; t < 5; t++){
    var song = songs[t.toString()];
    songz[t] = song;
    $("#results").append("<a class='list-group-item' song='"+JSON.stringify(song)+"' id='song" + t + "'>"
      +"<img class='search-result img-thumbnail img-responsive' src='" + song.thumbnail + "'>"
      +song.title
      +"</a>");
    $("#song" + t).click(function(event){
          testLog(JSON.parse($(this).attr('song')));
    });
  }
  
}

function testLog(song) {
  var username = window.location.href.split("/");
  username = username[username.length-1];
  console.log(song)
  $.ajax({
     type: 'POST',
     data: song,
     success: function() {   console.log("YAY!:" + song); },
     error: function(){   console.log("BOO!:" + song); },
     url: username + '/addSong/',
     cache:false
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


