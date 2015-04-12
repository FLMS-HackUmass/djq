var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player = null;
function onYouTubeIframeAPIReady() {
  if(player !== null) return;
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerReady(event) {
  queue.popSong();
  console.log(onPlayerReady);
  event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    setTimeout(stopVideo, 6000);
    done = true;
  }
  if(event.data == YT.PlayerState.ENDED){
    
  }
}
function stopVideo() {
  player.stopVideo();
}
function playVideo(){
  player.playVideo();
}
function changeVideo(videoId){
  player.videoId = videoId;
}