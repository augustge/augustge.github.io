
// var canvas;

var div;
var POSTS = [];

var pagesElm, pagesUl;
var postsElm, postsUl;
var postEntry;

function preload(){
  pagesElm    = document.getElementById('Pages');
  pagesUl     = document.getElementById('pagesList');
  postsElm    = document.getElementById('Posts');
  postsUl     = document.getElementById('postsList');
  postEntry   = document.getElementById('postEntry');

}

function setup(){
  // canvas = createCanvas(windowWidth,windowHeight);
  POSTS.push( new Post("Brachistochroneproblemet.html","Brachistochroneproblemet").initiate() )//"Brachistochroneproblemet") )
  POSTS.push( new Post("Brachistochroneproblemet.html","HIIPLA").initiate() )


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
    this.header.mousePressed(this.mouseEvent);
    this.header.parent(this.li_elm);
    return this
  }

  this.mouseEvent = function(){
    console.log("TRYING")
    var infile = loadStrings("Brachistochroneproblemet.txt",this.loadCallback);
    console.log("IN LOAD:")
    console.log(infile)
  }

  this.loadCallback = function(txt){
    console.log("IN CALLBACK:")
    console.log(result)
    console.log("got text:")
    console.log(txt)
    var div = createDiv(txt);
    console.log("created Div")
    div.parent(postEntry)
    console.log("updated parental status for div")
    text(txt,width/2,height/2)
    console.log("end")
    // return txt;
    // console.log(this.DIV)
    // console.log("END PRINT")
    // console.log(txt)
    // console.log("END PRINT 2")
    // this.DIV.html(txt);
  }

}

// function mousePressed(){
//   POSTS[0].load();
// }
