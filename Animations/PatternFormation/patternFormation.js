// https://watermark.silverchair.com/artl.2010.16.2.16202.pdf?token=AQECAHi208BE49Ooan9kkhW_Ercy7Dm3ZL_9Cf3qfKAc485ysgAAArQwggKwBgkqhkiG9w0BBwagggKhMIICnQIBADCCApYGCSqGSIb3DQEHATAeBglghkgBZQMEAS4wEQQM0BkLrvIgRzuMnzquAgEQgIICZ6tlAXasNcLTcemNXgD6-0z2b0UiBX78J5MQffG6xmUyVmi9PRafdSWcErITfyXKO8_Hz5ncNPx8XinsATwB48_MXWxqh4pPN4LsnIGKjJ2lGHzvTJao1jpDakcWYtaBU1XXYIQFgW0ZX0VbIJCOJb8W5Peh6WTYFZMMyv2g71dII-VG06XromXJ3EFVPl4YkteVJlzeUVWivTR2pFKZFCre1G-QCXZYJNKDDt6qsdbfJRXuLo6g4FRHp-3JhYFBPJcLPYEb3lFLRv5FMVXYyIPOgLptfYLcOHFAC-ZUVQ1bcvn0rUnbZsChroNgaya03u6n_InlrKALCYrZjOnwd0ZKz7hEZqKUZoEJq-91D5XqifpJvrtmm6EWVUXJ2-mZ4yW9X8Gk6LodKS0ioC-vJunlqnfI7qx6w_yvscGYHdz-nLY46WC4TWU0yDH6GP9JzkoN7s91kjDIo4eIYLRbeNu8FjpObjqHu5XkFgzY31qn06f66Gz43dB0cuVPCSmGBz61y0m9wrAC8TMyQadC3_WgsyCtFhkYWuKan-vErAVWB2VwWfWRV_cxMY3ZBOs4ZficXhlPxqsp7lgZhqDlG58RZPxBIWqISRZHDfiGvx5H_lkZgmJXmz7AfrDLt3Y43FAbSX4zAtR1hFBc3OSEKFpTlq9rNn8jyJqNoB1IOyndhrYClZk3rLgrTZAH4wxd3UnTXF7xXy3okBl-IJaKMcdsx6bYi3opsIbxQSftVD1cNqNPSQ7aA3y9B8sinNWC9yNqwhxzgt_QKlDkyHupnA730wPbX_YDwpZQjnSNsR3In3urUJdCAg

/*
FUTURE PLANS
  -  CHOOSE RESOLUTION
  -  AUTO-DRAW MODE (statistics instead of walker by walker)
  -  ADD COLORS + COLOR-SCHEMES
  -X SHOW WALKER ERROR

*/
var showWalkers = true;
var pi = 3.141592653589;
var mouseMode = "create";
var play = true
var mouseSize = 20;
var angleS = [0,-pi/8,pi/8];
var angleM = [0,-pi/21,pi/21];
var angleL = [0,-pi/55,pi/55];
var senseS = [8,8,8];
var senseM = [21,21,21];
var senseL = [55,55,55];

var senseWs =[{name:"XL sensorspan", A:[0,-pi/ 5,pi/ 5]},
              {name:" L sensorspan", A:[0,-pi/ 8,pi/ 8]},
              {name:" M sensorspan", A:[0,-pi/13,pi/13]},
              {name:" S sensorspan", A:[0,-pi/21,pi/21]},
              {name:"XS sensorspan", A:[0,-pi/34,pi/34]}];

var senseLs =[  {name:"XXS sensorlength", L:[ 2, 2, 2]},
                {name:" XS sensorlength", L:[ 3, 3, 3]},
                {name:"  S sensorlength", L:[ 5, 5, 5]},
                {name:"  M sensorlength", L:[ 8, 8, 8]},
                {name:"  L sensorlength", L:[13,13,13]},
                {name:" XL sensorlength", L:[21,21,21]},
                {name:"XXL sensorlength", L:[34,34,34]}];

var colors = [{name:"SMEAR",      C:[null,null,null]}, // not really a color!
              {name:"dark",       C:[52,54,66,    255]},
              {name:"milk",       C:[242,235,199, 255]},
              {name:"teal",       C:[52,136,153,  255]},
              {name:"red",        C:[150,45,62,   255]},
              {name:"white",      C:[255,255,255, 255]},
              {name:"soil",       C:[119, 96, 69, 255]},
              {name:"algae",      C:[168,197, 69, 255]},
              {name:"dirt",       C:[223,211,182, 255]},
              {name:"oceanblue",  C:[0, 146, 178, 255]}];

var attractions = [
  {name:"red attractor",  f:function(r,g,b,a){return sq(r)-sq(255);}},
  {name:"green attractor",f:function(r,g,b,a){return sq(g)-sq(255);}},
  {name:"blue attractor", f:function(r,g,b,a){return sq(b)-sq(255);}},
  {name:"red repellor",   f:function(r,g,b,a){return sq(r-255)-sq(255);}},
  {name:"green repellor", f:function(r,g,b,a){return sq(g-255)-sq(255);}},
  {name:"blue repellor",  f:function(r,g,b,a){return sq(b-255)-sq(255);}},
  {name:"dark attractor", f:function(r,g,b,a){return sq(r)+sq(g)+sq(b)-3*sq(255);}},
  {name:"light attractor",f:function(r,g,b,a){return sq(r-255)+sq(g-255)+sq(b-255)-3*sq(355);}},
  {name:"autophilic",     f:function(r,g,b,a){return sq(r-this.c[0])+sq(g-this.c[1])+sq(b-this.c[2]);}}]

var SMOOTHER = [[1/9.,1/9.,1/9.],
                [1/9.,1/9.,1/9.],
                [1/9.,1/9.,1/9.]]
var BOIDMODEL;
var SENSOR,NAVIGATOR,MANIPULATOR;
var ANGLE = angleS;
var SENSE = senseS;
var COST  = attractions[6].f;
var BOIDS = []

// var S,N,I1,I2,I3,I4;
function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  buffer = createGraphics(windowWidth,windowHeight);
  // buffer = createGraphics(windowWidth,windowHeight);
  buffer.pixelDensity(1);
  buffer.background(255);
  BOIDMODEL   = new Boid(new Sensor(angleS,senseS),new Navigator(1,0.3,0.3),attractions[6].f,colors[1].C)
  // SENSOR      = new Sensor(ANGLE,SENSE,COST);
  // NAVIGATOR   = new Navigator(1,0.3,0.3);
  // MANIPULATOR = new Interactor(colors[1].C);
  makeControls();
}


function draw(){
  // several iterations each draw
  background(255);
  image(buffer, 0, 0,width,height);
  if(play){
  for(var k =0;k<10;k++){
    buffer.loadPixels()
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].sense();}
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].act();}
    buffer.updatePixels();
  }
  }
  // draw walkers
  if(showWalkers){
    fill(255,0,0); stroke(255);
    for(var n=0; n<BOIDS.length; n++){
      var X = BOIDS[n].x * width/buffer.width;
      var Y = BOIDS[n].y * height/buffer.height; ellipse(X,Y,5,5);
  }}
  if (mouseMode=="draw" || mouseMode=="erase") {
    stroke(0);
    noFill();
    ellipse(mouseX,mouseY,mouseSize,mouseSize)
  }


}


//------------------------------------------------------------------------------
// Main creature: Mainly a container of the propagated information
class Boid{
  constructor(sensor,navigator,cost,c){
    this.x  = 1+random( buffer.width-2);
    this.y  = 1+random(buffer.height-2);
    this.th = random(2*PI)
    this.dth = 0;
    this.smoother = false;
    this.sensor = sensor;
    this.navigator = navigator;
    this.cost = cost; // RGBA cost function
    this.c = c; // color
    this.force = 0.5;
    // this.interactor = interactor;
  }
  sense(){
    this.th += this.sensor.sense(this.x,this.y,this.th,this.cost);
  }
  act(){
    var res = this.navigator.move(this.x,this.y,this.th);
    this.x  = res[0];
    this.y  = res[1];
    this.interact(int(this.x),int(this.y));
  }

  combineValues(a,aN){return (a+this.force*aN)/(1+this.force)} // completely discriminative
  pixelIndex(x,y){ return 4*(int(y)*buffer.width+int(x)) }

  smoothing(x,y){
    var mPX = [0.0,0.0,0.0,0.0]
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        var mi = SMOOTHER[xi+1][yi+1];
        mPX[0] += mi*buffer.pixels[i];
        mPX[1] += mi*buffer.pixels[i+1];
        mPX[2] += mi*buffer.pixels[i+2];
        mPX[3] += mi*buffer.pixels[i+3];
      }
    }
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        buffer.pixels[i]   = mPX[0];
        buffer.pixels[i+1] = mPX[1];
        buffer.pixels[i+2] = mPX[2];
        buffer.pixels[i+3] = mPX[3];
      }
    }
  }

  setPixelColor(x,y){
    let i = this.pixelIndex(x,y);
    buffer.pixels[i]   = this.combineValues(buffer.pixels[i],  this.c[0]);
    buffer.pixels[i+1] = this.combineValues(buffer.pixels[i+1],this.c[1]);
    buffer.pixels[i+2] = this.combineValues(buffer.pixels[i+2],this.c[2]);
    buffer.pixels[i+3] = this.combineValues(buffer.pixels[i+3],this.c[3]);
  }

  interact(x,y){
    if(this.smoother){
      this.smoothing(x,y)
    }else{
      this.setPixelColor(x,y)
    }
  }
}

//------------------------------------------------------------------------------
// Mechanism for reading pixel data and optimizing cost to generate and angle as a response
class Sensor{
  constructor(angles,distances){
    this.angles     = angles // array of radians
    this.distances  = distances // array of radii
  }
  sensepoint(x,y,th,r,dth){ // retrieve sense-point
    var Xi = int(x+r*cos(th+dth));
    var Yi = int(y+r*sin(th+dth));
    return [Xi,Yi]
  }
  getcolor(x,y){ // obtain pixel data
    let i = 4*(y*buffer.width+x);
    return [buffer.pixels[i],buffer.pixels[i+1],buffer.pixels[i+2],buffer.pixels[i+3]];
  }
  sense(x,y,th,cost){ // main function: Optimize cost over sensory scalars
    var costm  = Infinity;
    var thm = 0
    for(var k=0; k<this.angles.length; k++){
      var p = this.sensepoint(x,y,th,this.distances[k],this.angles[k]); // meshpoint
      var c = this.getcolor(p[0],p[1]); // color at meshpoint
      var costk = cost(c[0],c[1],c[2],c[3]); // cost/repulsion of detected of color
      if(costk<costm){ costm = costk; thm = this.angles[k]; } // if lowest cost
    }
    return thm
  }
}

//------------------------------------------------------------------------------
class Navigator{
  constructor(steplength,fluctuationTheta,fluctuationL){
    this.steplength    = steplength;
    this.fluctuationTH = fluctuationTheta; // relative!
    this.fluctuationL  = fluctuationL;     // relative!
  }
  move(x,y,th){ // position and dir of walker, delta theta (dth) of response
    // generate direction vector
    var dx = (1+random( -this.fluctuationL,this.fluctuationL))*cos(th)//this.steplength*cos(th);
    var dy = (1+random( -this.fluctuationL,this.fluctuationL))*sin(th)//this.steplength*sin(th);
    // MOVE + boundary condition
    var xN  = 1+( x+dx-1 + buffer.width -2)%(buffer.width -2);   // exclude 1px bd
    var yN  = 1+( y+dy-1 + buffer.height-2)%(buffer.height-2); // exclude 1px bd
    var thN = th + random(-this.fluctuationTH,this.fluctuationTH)
    return [xN,yN,thN]
  }
}

function makeControls(){
  // Should probably transition to sliders/inputs instead
  addButton(createButton("Show walkers"),function(){showWalkers=!showWalkers;})
  addButton(createButton("Kill all walkers"),function(){BOIDS=[];})
  addButton(createButton("play/pause"),function(){play=!play;})
  addButton(createButton("Download image"),function(){saveCanvas('autoArt', 'jpg');})
  addSelect([["Create walker","create"],["Draw","draw"],["Walker eraser","erase"]],"Create walker",function(e){mouseMode=e.target.selectedOptions[0].value;})
  // sensor widths
  addSelect(senseWs.map(({ name }) => [name,name]),senseWs[1].name,function(e){
    var angles = senseWs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].A;
    BOIDMODEL.sensor = new Sensor(angles,BOIDMODEL.sensor.distances);})
  // sensor lengths
  addSelect(senseLs.map(({ name }) => [name,name]),senseLs[1].name,function(e){
    var distances = senseLs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].L;
    BOIDMODEL.sensor = new Sensor(BOIDMODEL.sensor.angles,distances);})
  // attractions
  addSelect(attractions.map(({ name }) => [name,name]),"dark attractor",function(e){
    BOIDMODEL.cost = attractions.filter(({name}) => name==e.target.selectedOptions[0].value)[0].f;})
  // color
  addSelect(colors.map(({ name }) => [name,name]),"dark",function(e){
    var v = e.target.selectedOptions[0].value;
    var c = colors.filter(({name}) => name==v)[0].C;
    if(v=="SMEAR"){BOIDMODEL.c = c; BOIDMODEL.smoother = true; }else{ BOIDMODEL.c = c; } })
}

function addSelect(options,selected,update){
  var s = createSelect()
  s.parent(window.document.getElementById('control-holder'));
  for(var k=0; k<options.length;k++){
    s.option(options[k][0],options[k][1]) // name, [value]
  }
  s.changed(update);
  s.selected(selected)
  s.elt.dispatchEvent(new Event("change"));
}

function addButton(b,f){
  b.parent(window.document.getElementById('control-holder')); b.mousePressed(f);
  return b;
}


//==============================================================================

function mousePressed(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if(mouseMode=="create"){
      var b = new Boid(BOIDMODEL.sensor,BOIDMODEL.navigator,BOIDMODEL.cost,BOIDMODEL.c);
      b.x = xx; b.y = yy;
      BOIDS.push(b);
    }else if (mouseMode=="erase") {
      for(var n=BOIDS.length-1; n>=0;n--){
        if(sq(BOIDS[n].x-xx)+sq(BOIDS[n].y-yy)<sq(mouseSize*buffer.width/width)){
          BOIDS.splice(n, 1);
        }
      }
    }
  }
}

function mouseDragged(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if (mouseMode=="draw") {
      buffer.noStroke();
      buffer.fill(MANIPULATOR.c[0],MANIPULATOR.c[1],MANIPULATOR.c[2],MANIPULATOR.c[3]);
      buffer.ellipse(xx,yy,mouseSize*buffer.width/width,mouseSize*buffer.height/height);
    }
    // add ensemle-draw
  }
}

function keyPressed(){
  if(keyCode==32){showWalkers=!showWalkers;}
  return false;
}
