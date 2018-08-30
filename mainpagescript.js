
var canvas;

var div;
var POSTS = [];

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  div = createDiv("BOBOBO TATATA")
  div.position(width/2,height/2)
  div.attribute("w3-include-html","Brachistochroneproblemet.html")

  POSTS.push( new Post("Brachistochroneproblemet.html","Brachistochroneproblemet") )

}

function draw(){
  // background(0);
}

function Post(filename,title){
  this.filename = filename
  this.title = title
  this.DIV = createDiv(title)

  this.load = function(){
    var infile = loadStrings("Brachistochroneproblemet.html",this.loadCallback);
  }
  this.loadCallback = function(text){
    this.DIV.html(text);
  }
}

function mousePressed(){
  // var text = get_file("Brachistochroneproblemet.html",function(response){TEXT=response;});
  POSTS[0].load();
}
