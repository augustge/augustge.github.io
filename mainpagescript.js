
var canvas;

var div;
var POSTS = [];

var texter;

function preload(){
  texter = document.getElementById('1');
}

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);
  POSTS.push( new Post("Brachistochroneproblemet.html","THIS IS A TEST 3"))//"Brachistochroneproblemet") )


}

function draw(){
  // background(0);
}

function Post(filename,title){
  this.filename = filename
  this.title = title
  this.header = createElement("h3","KOKO")
  this.header.id("design")
  this.header.attribute("title","BOBO")
  this.header.parent(texter)

  // <h3 id="design" title="TATA" onClick="openClose(1)" style="cursor:hand; cursor:pointer;">TATA</h3>
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
