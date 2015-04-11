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
  //gapi.client.setApiKey('IzaSyBBo5HKKMfIQIzeTw9GUt5RMs1-M8Qrd78');
  gapi.client.setApiKey('IzaSyBBHxBJ7XlOcqvaStxp8AjOisyXP0T8BDg');
  //gapi.client.setApiKey('poo');
  search();
}

function search(){
  console.log("search");
  var req = gapi.client.youtube.search.list({
    part: 'id'
  });

  req.execute(onSearchResponse);
}

function onSearchResponse(response) {
  console.log("onsearchresponse");
  showResponse(response);
}
