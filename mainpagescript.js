
var canvas;

var div;
var POSTS = [];

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  POSTS.push( new Post("Brachistochroneproblemet.html","Brachistochroneproblemet") )

}

function draw(){
  // background(0);
}

function Post(filename,title){
  this.filename = filename
  this.title = title
  this.DIV = createDiv(title)
  this.DIV.position(width/2,height/2);

  this.load = function(){
    var infile = loadStrings("Brachistochroneproblemet.html",this.loadCallback);
  }
  
  this.loadCallback = function(text){
    this.DIV.html(text);
  }
}

function mousePressed(){
  POSTS[0].load();
}
