
/*
 TODO:
 * Automatically disqus-boxes for individual posts
 * Tags for posts
 * List directory for automatic post listing?

 DONE:
 * Add un-activating upon double-click on post title
 * Add canvas background CSS class
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
  canvas = createCanvas(window.innerWidth, window.innerHeight);
  canvas.class("stickyCanvasBackground");
  // text(window.location.href,width/2,height/2)
  // text(window.location.hostname,width/2,height/2)
  // text(window.location.pathname,width/2,height/2)
  noLoop();
  // canvas.position("fixed")
  // canvas.style("position","fixed !important");
  // canvas.style("z-index","-1");

  POSTS.push( new Post("Brachistochroneproblemet.html","Brachistochroneproblemet").initiate() )//"Brachistochroneproblemet") )
  POSTS.push( new Post("FirstPost.html","hookle kookle").initiate() )


}

function draw(){
  // background(0);
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
        postDiv  = select('#postDiv');
        postDiv.attribute("src","POSTS/"+filename)
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        // loadStrings("POSTS/"+filename,loadPost,loadPostError);
        activePost = filename;
      }
    },{passive: true});
    return this
  }

}

function loadPost(result){
  var txt = join(result," ")
  postDiv  = select('#postDiv');
  postDiv.html(txt) // update html content
  postDiv.attribute("href","#inPost")
  MathJax.Hub.Queue(["Typeset",MathJax.Hub]); // redo mathjax typesetting
  console.log("TATATATA")
  obj = select('#postDiv').elt;
  obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  console.log("FOFOFOFOFOF")
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
