
var canvas;

var div;

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  div = createDiv("BOBOBO TATATA")
  div.position(width/2,height/2)
  div.attribute("w3-include-html","Brachistochroneproblemet.html")



}

function draw(){
  // background(0);
}

function mousePressed(){
  // var text = get_file("Brachistochroneproblemet.html",function(response){TEXT=response;});
  infile = loadStrings("Brachistochroneproblemet.html");
  div.html(infile)
}


function gotFile(file) {
  var fileDiv = createDiv(file.name + ' ' + file.type + ' ' + file.subtype + ' ' + file.size + ' bytes');
  if (file.type === 'image') {
    var img = createImg(file.data);
    img.class('thumb');
  } else if (file.type === 'text') {
    createDiv(file.data);
  }
}
