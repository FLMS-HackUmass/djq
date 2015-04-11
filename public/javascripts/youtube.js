function showResponse(response){
  console.log("showresponse");
  var res = JSON.stringify(res, '', 2);
  document.getElementById('text').innerHTML += res;
}

function onClientLoad(){
  console.log("onclientload");
  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
}

function onYouTubeApiLoad(){
  console.log("onapiload");
  gapi.client.setApiKey('AIzaSyCGYJ3Qyz27hn0MKT7CSHlf7l9kB-qkLgY');
  search();
}

function search(){
  console.log("search");
  var req = gapi.client.youtube.search.list({
    part: 'snippet'
  });

  req.execute(onSearchResponse);
}

function onSearchResponse(response) {
  console.log("onsearchresponse");
  console.log(response);
  showResponse(response);
}
