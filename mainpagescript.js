
var canvas;

var div;
var POSTS = [];

var texter;

function preload(){
  texter = document.getElementById('1');
}

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
  this.header = createElement("h3","KOKO")
  this.header.id("design")
  this.header.attribute("title","BOBO")
  this.header.parent(texter);
  this.DIV = createDiv(title);
  this.DIV.position(width/2,height/2);

  this.load = function(){
    console.log("TRYING")
    var infile = loadStrings("Brachistochroneproblemet.txt",this.loadCallback);
  }

  this.loadCallback = function(txt){
    this.TEXT = txt
    text(txt,width/2,height/2)
    console.log("PRINT")
    console.log(this.DIV)
    console.log("END PRINT")
    this.DIV.html(txt);
  }
}

function mousePressed(){
  POSTS[0].load();
}
