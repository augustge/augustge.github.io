
/*
 TODO:
 * Automatically disqus-boxes for individual posts
 * Tags for posts
 * List directory for automatic post listing?

 DONE:
 * Add un-activating upon double-click on post title
*/



var canvas;

var div;
var POSTS = [];

var pagesElm,  pagesUl;
var postsElm,  postsUl;
var postEntry, postDiv;

var activePost = null;

function preload(){
  pagesElm    = document.getElementById('Pages');
  pagesUl     = document.getElementById('pagesList');
  postsElm    = document.getElementById('Posts');
  postsUl     = document.getElementById('postsList');
  postEntry   = document.getElementById('postEntry');
  postDiv     = document.getElementById('postDiv');

}

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);
  canvas.style("top","0");
  canvas.style("position","sticky");
  POSTS.push( new Post("Brachistochroneproblemet.html","Brachistochroneproblemet").initiate() )//"Brachistochroneproblemet") )
  POSTS.push( new Post("FirstPost.html","hookle kookle").initiate() )


}

function draw(){
  background(200);
}

function Post(filename,title){
  this.filename = filename
  this.title    = title;
  // tags

  this.initiate = function(){
    this.li_elm = createElement("li","")
    this.li_elm.parent(postsUl)
    this.header = createElement("a",this.title)
    this.header.class("link-entry")
    this.header.style("cursor","pointer")
    this.header.parent(this.li_elm);
    console.log(filename)
    this.header.mousePressed(function (){
      if(activePost==filename){
        postDiv  = select('#postDiv');
        postDiv.html("");
        activePost = null;
      }else{
        loadStrings(filename,loadPost,loadPostError);
        activePost = filename;
      }
    });
    return this
  }

}

function loadPost(result){
  console.log("TEST")
  var txt = join(result," ")
  postDiv  = select('#postDiv');
  postDiv.html(txt)
  console.log("TEST2")
  postDiv.html(txt) // update html content
  console.log("TEST3")
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // redo mathjax typesetting
  console.log("TEST4")
  // return result
}

function loadPostError(){
  postDiv  = select('#postDiv');
  // postDiv.html("");
}

function deActivateOthers(){
  for(var i=0; i<POSTS.length; i++){
    POSTS[i].active = false;
  }
}

// async function
function loadActivePost(activePost){
  loadStrings(activePost.filename,loadPost,loadPostError);
}
