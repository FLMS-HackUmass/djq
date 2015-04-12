var myapp = { songlist: [] };

$(document).ready(function(){
  console.log("The doc is ready");

  /*$('#searchbar').keypress(function(){
      console.log($('#searchbar').val());
      search($('#searchbar').val());
  });*/
  
  //document.getElementById('searchbar')
  /*$('#dialog').dialog({
      autoOpen:false,
      height: 500,
      width: 500,
      buttons: {
        "Add Song": function(){alert("useless");}
      }
    }
  );*/

  /*$("#add_button").click(function(){
    $("#dialog").dialog("open");
  });*/
 

});

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

function chooseSong( songs ){
  
  if(!songs || songs === undefined) {
    return;
  }

  var t;
  for(t = 0; t < 5; t++){
    $("#results").append("<li>"+songs[t.toString()].title+"</li>");
  }
  $("#results > li").click(function(){
    var index = $("#results > li").index(this);
    myapp.songlist.push(songs[index.toString()]);
    //console.log(myapp.songlist);
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
