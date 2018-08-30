
var canvas;

var div;
var POSTS = [];

var pagesElm, postsElm;

function preload(){
  pagesElm = document.getElementById('Pages');
  postsElm = document.getElementById('Posts');
}

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOPLA"))//"Brachistochroneproblemet") )
  POSTS.push( new Post("Brachistochroneproblemet.html","HIIPLA"))
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOKLA"))
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOFLA"))


}

function draw(){
  // background(0);
}

function Post(filename,title){
  this.filename = filename
  this.title = title
  this.header = createElement("h3","FAFA")
  // this.header.id("design")
  // this.header.attribute("title","BOBO")
  this.header.parent(postsElm);
  // <h3 id="design" class="select" title="Posts">Select a Design:</h3>
  this.DIV = createDiv(title);
  this.DIV.position(width/2,height/2);
  console.log("this is 'this.DIV':")
  console.log(this.DIV)
  console.log("--> end")

  this.load = function(){
    console.log("TRYING")
    var infile = loadStrings("Brachistochroneproblemet.txt",this.loadCallback);
    console.log("IN LOAD:")
    console.log(infile)
    this.showPost();
  }

  this.loadCallback = function(txt){
    this.TEXT = txt
    text(txt,width/2,height/2)
    // console.log(this.DIV)
    // console.log("END PRINT")
    // console.log(txt)
    // console.log("END PRINT 2")
    // this.DIV.html(txt);
  }

  this.showPost = function(){
    this.DIV.html(this.TEXT);
  }
}

function mousePressed(){
  POSTS[0].load();
}
