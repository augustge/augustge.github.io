
// var canvas;

var div;
var POSTS = [];

var pagesElm, pagesUl;
var postsElm, postsUl;

function preload(){
  pagesElm = document.getElementById('Pages');
  pagesUl  = document.getElementById('pagesList');
  postsElm = document.getElementById('Posts');
  postsUl  = document.getElementById('postsList');


}

function setup(){
  // canvas = createCanvas(windowWidth,windowHeight);
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOPLA").initiate() )//"Brachistochroneproblemet") )
  POSTS.push( new Post("Brachistochroneproblemet.html","HIIPLA").initiate() )
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOKLA").initiate() )
  POSTS.push( new Post("Brachistochroneproblemet.html","HOOFLA").initiate() )


}

function draw(){
  // background(0);
}

function Post(filename,title){
  this.filename = filename
  this.title    = title;

  this.initiate = function(){
    this.li_elm = createElement("li","")
    this.li_elm.parent(postsUl)
    this.header = createElement("a",this.title)
    this.header.class("link-entry")
    this.header.style("cursor","pointer")
    this.header.mousePressed(this.load);
    this.header.parent(this.li_elm);
    return this
  }

  this.mouseEvent = function(){
    this.load();
  }

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
    return txt;
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

// function mousePressed(){
//   POSTS[0].load();
// }
