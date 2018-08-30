
var canvas;

var div;
var POSTS = [];

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  POSTS.push( new Post("Brachistochroneproblemet.html","THIS IS A TEST 2"))//"Brachistochroneproblemet") )

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
    var infile = loadStrings("Brachistochroneproblemet.txt",this.loadCallback);
  }

  this.loadCallback = function(text){
    this.text = text
    text(text,width/2,height/2)
    this.DIV.html(text);
  }
}

function mousePressed(){
  POSTS[0].load();
}
