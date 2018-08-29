
var canvas;


function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  div = createDiv("test")
  div.position(width/2,height/2)
  div.attribute("w3-include-html","Brachistochroneproblemet.html")

  var text = get_file("Brachistochroneproblemet.html",True);
  div.html(text)

}

function draw(){
  // background(0);
}
