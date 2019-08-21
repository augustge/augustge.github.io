
var S         = 300.0;
var maxN      = 100;
var maxNdraw  = 10;
var addNUM    = 50;
var scatterD  = true;
var center;
var c0 = [0,0];


function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  buffer = createGraphics(windowWidth, windowHeight);

  center = [width/2,height/2];

  strokeWeight(2); stroke(255);
  // buffer.background(255);
  buffer.pixelDensity(1);
}

function draw(){

  image(buffer, 0, 0);

  var mx = (mouseX-center[0])/S+c0[0];
  var my = (mouseY-center[1])/S+c0[1];
  var n = drawIterations(0,0,mx,my,maxNdraw)
  if( scatterD ){
    drawAllPixels();
    // drawRandomIterations(50);
    buffer.updatePixels();
    scatterD = false;
  }
}

// ===============================================================

function drawIterations(x,y,cx,cy,n){
  var itr = 0
  while (x*x + y*y <= 4  &&  itr < n) {
    var xd  = x*x - y*y + cx;
    var yd  = 2*x*y + cy;
    var R0 = [S*(x-c0[0])+center[0],S*(y-c0[1])+center[1]];
    var R1 = [S*(xd-c0[0])+center[0],S*(yd-c0[1])+center[1]];
    line(R0[0],R0[1],R1[0],R1[1]);
    x = xd;
    y = yd;
    itr += 1;
  }
  return itr==n? 0 : itr;
}

function getIterations(x,y,cx,cy,n){
  var q = sq(x-0.25)+y*y;
  if( q*(q+x-0.25)>y*y/4 ){
    return 0
  }else{
  itr = 0
  rsquare = 0
  isquare = 0
  zsquare = 0
  while (rsquare + isquare <= 4  &&  itr < n) {
    x = rsquare - isquare + cx;
    y = zsquare - rsquare - isquare + cy;
    rsquare = x*x;
    isquare = y*y;
    zsquare = (x + y)*(x + y);
    itr += 1;
  }
  return itr==n? 0 : itr;
  }
}


function drawAllPixels(){
  for(var x=0; x<width; x++){
    for(var y=0; y<height; y++){
      var X = (x-center[0])/S+c0[0];
      var Y = (y-center[1])/S+c0[1];
      var n = getIterations(0,0,X,Y,maxN);
      drawEndpoint(x,y,n);
    }
  }
}

function drawRandomIterations(num){
  for(var n=0; n<num; n++){
    var x = random(width); //randomGaussian(mouseX, 20);
    var y = random(height); //randomGaussian(mouseY, 20);
    var X = (x-center[0])/S+c0[0];
    var Y = (y-center[1])/S+c0[1];
    var n = getIterations(0,0,X,Y,maxN);
    drawEndpoint(x,y,n);
  }
}

function drawEndpoint(x,y,n){
  if(n==0){
    var c = color(0,0,0);
  }else{
    var R = 255*(1+cos(0.1*n))/2;
    var G = 255*(1+cos(0.1*n+PI/2))/2;
    var B = 255*(1+cos(0.1*n+PI/3))/2;
    var c = color(R,G,B);
  }
  buffer.set(x,y, c);
}


// ===============================================================



function mousePressed(){
}

function mouseDragged(){
  c0[0] -= (mouseX-pmouseX)/S;
  c0[1] -= (mouseY-pmouseY)/S;
  scatterD = true;
}


function keyPressed(){
  if(keyCode==32){ // SPACE
    // scatterD = !scatterD;
  }
  if(keyCode == 37){ // LEFT
  }else if(keyCode == 39){ // RIGHT
  }else if(keyCode == 38){ // UP
    S *= 1.2;
    scatterD = true;
  }else if(keyCode == 40){ // DOWN
    S /= 1.2;
    scatterD = true;
  }
  return false;
}







//
