
function myfunction(obj){
var audio = new Audio('http://commondatastorage.googleapis.com/codeskulptor-assets/Collision8-Bit.ogg');
  if (document.getElementById(obj.id).checked)
  audio.play();
}