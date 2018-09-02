

var t       = 0;
var dt      = 0.2;
var G       = 10;
var N       = 200;
var D       = 700; // boundary

var Nx      = 40;
var Ny      = 30;
var iterationsPerLoop = 5;

// make planet
var vAttenuation = 0.1;
var mCx = 0;
var mCy = 0;
var makeMass = 10;

var S, cX, cY, SP;

var PLANETS = [];
var SLIDERTEXTS = [];
var SLIDERS     = [];
var BUTTONS     = [];

var canvas;

var backgroundColor, groundColor, planetColor, color1, color2;

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  c1 = color("#2F343B");
  c2 = color("#A6793D");
  c3 = color("#FF950B");
  c4 = color("#C77966");
  c5 = color("#E3CDA4");
  c6 = color("#703030");
  c7 = color("#7E827A");
  c8 = color("#F7EFF6");
  c9 = color("#C4C4BD");
  c10= color("#56BED7");
  c11= color("#D43215");
  c12= color("#453B3D");
  c13= color("#FF0000");
  c14= color("#FF950B");

  backgroundColor  = c1;
  smallPlanetColor = c5;
  bigPlanetColor   = c14;
  mouseLineColor   = c10;
  boundaryColor    = c13;

  // MAKE SLIDERS
  makeSliders();
  makeButtons();

  cX    = width/2;
  cY    = height/2;
  S     = 1.0;
  SP    = 1.0;

  // MAKE PLANETS
  // makeInitialPlanetsInGrid(Nx,Ny);
  makeInitialPlanetsInRandomCircular(0,0,N,500);
  // add sun
  PLANETS.push( new Planet(0,0,0,0,30) );
  addRotationalBias(0.005);
  // adjustToCenterOfMomentum();

}


function draw(){
  background(backgroundColor);

  adjustToSlidervalues();

  translate(cX,cY);
  scale(S);

  // evolve
  var newPLANETS    = [];
  for(var i=0; i<PLANETS.length; i++){
    for(var n=0; n<iterationsPerLoop; n++){
      PLANETS[i].evolve();
      PLANETS[i].getForce(PLANETS);
      PLANETS[i].bounceOnBoundary();
      // handle collision
      for(var j=0; j<i; j++){
        var distSq = sq(PLANETS[i].r[0]-PLANETS[j].r[0]) + sq(PLANETS[i].r[1]-PLANETS[j].r[1]);
        if(!PLANETS[i].dead && distSq<sq(PLANETS[i].R+PLANETS[j].R)){
          newPLANETS.push(getMergedPlanet(PLANETS[i],PLANETS[j]));
          PLANETS[i].dead=true;
          PLANETS[j].dead=true;
        }
      }
    }
    // display planet
    PLANETS[i].show();
  }
  // include only living planets in next loop
  for(var i=0; i<PLANETS.length; i++){
    if(!PLANETS[i].dead){
      newPLANETS.push(PLANETS[i]);
    }
  }
  PLANETS = newPLANETS;

  showBoundary();
  adjustToCenterOfMomentum();
  resetMatrix();
  if(mouseIsPressed){showMouseDynamics();}
  showControlpanel();
}

// =============================================================================

function Planet(x,y,vx,vy,m){
  this.dead = false;
  this.r    = [x,y];
  this.v    = [vx,vy];
  this.m    = m;
  this.F    = [0,0];
  this.R    = 2*sqrt(m/PI); //
  var f = atan(0.05*m);
  this.color= lerpColor(smallPlanetColor, bigPlanetColor, f);
}

Planet.prototype.getForce = function(planets){
  var F = [0,0];
  for(var i=0; i<planets.length; i++){
    var p = planets[i];
    if(p!=this){
      var Fi = this.force(planets[i]);
      F[0] += Fi[0];
      F[1] += Fi[1];
    }
  }
  this.F[0] = F[0];
  this.F[1] = F[1];
}

Planet.prototype.force = function(p){ // force exerted by p on this
  var deltaR = [ p.r[0]-this.r[0], p.r[1]-this.r[1]];
  var r   = sqrt( sq(deltaR[0]) + sq(deltaR[1]) );
  var Fx  = G*this.m*p.m/(r*r*r)*deltaR[0];
  var Fy  = G*this.m*p.m/(r*r*r)*deltaR[1];
  return [Fx,Fy];
}


Planet.prototype.evolve = function(){
  var a = [this.F[0]/this.m, this.F[1]/this.m];
  this.v[0] += a[0]*dt;
  this.v[1] += a[1]*dt;
  this.r[0] += this.v[0]*dt;
  this.r[1] += this.v[1]*dt;
}

Planet.prototype.killOnBoundary = function(){
  var dSq = sq(this.r[0])+sq(this.r[1]);
  if(dSq>sq(D)){
    this.dead = true;
  }
}

Planet.prototype.bounceOnBoundary = function(){
  var len   = sqrt(sq(this.r[0])+sq(this.r[1]));
  if(len>D){
    var rx = this.r[0]/len;
    var ry = this.r[1]/len;
    this.r[0] = D*rx;
    this.r[1] = D*ry;
    var vr = this.v[0]*rx+this.v[1]*ry;
    this.v[0] -= 2*vr*rx;
    this.v[1] -= 2*vr*ry;
    this.v[0] *= 0.5; // damp on bounce
    this.v[1] *= 0.5; // damp on bounce
  }
}

Planet.prototype.show = function(){
  noStroke();
  fill(this.color);
  ellipse(this.r[0],this.r[1],SP*2*this.R,SP*2*this.R);
}



function getMergedPlanet(p1,p2){
  // get total mass
  var m = p1.m + p2.m;
  // get CM
  var x = (p1.m*p1.r[0]+p2.m*p2.r[0])/m;
  var y = (p1.m*p1.r[1]+p2.m*p2.r[1])/m;
  // get velocity from momentum conservation
  var vx = (p1.m*p1.v[0]+p2.m*p2.v[0])/m;
  var vy = (p1.m*p1.v[1]+p2.m*p2.v[1])/m;
  return new Planet(x,y,vx,vy,m);
}


function makeInitialPlanetsInGrid(Nx,Ny){
  for(var i=0; i<Nx; i++){
    for(var j=0; j<Ny; j++){
      var x   = map(i, 0, Nx,0,width);
      var y   = map(j, 0, Ny,0,height);
      var vx  = random(-0.5,0.5);
      var vy  = random(-0.5,0.5);
      var m   = random(1,5);
      PLANETS.push( new Planet(x,y,vx,vy,m) );
    }
  }
}

function makeInitialPlanetsInRandomCircular(cx,cy,N,R){
  for(var i=0; i<N; i++){
    var x   = cx+random(-R,R);
    var y   = cy+random(-sqrt(sq(R)-sq(x)),sqrt(sq(R)-sq(x)));
    var vx  = random(-0.2,0.2);
    var vy  = random(-0.2,0.2);
    var m   = random(0.1,1);
    PLANETS.push( new Planet(x,y,vx,vy,m) );
  }
}

function adjustToCenterOfMomentum(){
  // calculate CM
  var Rx = 0.0;
  var Ry = 0.0;
  var Vx = 0.0;
  var Vy = 0.0;
  var M  = 0.0;
  for(var i=0; i<PLANETS.length; i++){
    Rx += PLANETS[i].m*PLANETS[i].r[0];
    Ry += PLANETS[i].m*PLANETS[i].r[1];
    Vx += PLANETS[i].m*PLANETS[i].v[0];
    Vy += PLANETS[i].m*PLANETS[i].v[1];
    M  += PLANETS[i].m;
  }
  Rx /= M; Ry /= M;
  Vx /= M; Vy /= M;
  // adjust to CM
  for(var i=0; i<PLANETS.length; i++){
    PLANETS[i].r[0] -= Rx;
    PLANETS[i].r[1] -= Ry;
    PLANETS[i].v[0] -= Vx;
    PLANETS[i].v[1] -= Vy;
  }
}


function addRotationalBias(w){
  for(var i=0; i<PLANETS.length; i++){
    PLANETS[i].v[0] +=  w*PLANETS[i].r[1];
    PLANETS[i].v[1] += -w*PLANETS[i].r[0];
  }
}

function showBoundary(){
  noFill();
  stroke(boundaryColor);
  ellipse(0,0,2*D,2*D);
}

// =============================================================================
function fillButtonPressed(){
  makeInitialPlanetsInRandomCircular(0,0,N,D);
}

function emptyButtonPressed(){
  PLANETS = [];
}

function giveRotationalBiasButton(){
  addRotationalBias(0.005);
}

function makeCentralObjectButton(){
  PLANETS.push( new Planet(0,0,0,0,30) );
}

// =============================================================================

function makeSliders(){
  SLIDERTEXTS.push("Global zoom");
  SLIDERS.push(createSlider(0.1, 5.0, 1.0, 0.01).class("terminatorSlider"));

  SLIDERTEXTS.push("Planet scale");
  SLIDERS.push(createSlider(0.1, 5.0, 1.0, 0.01).class("terminatorSlider"));

  SLIDERTEXTS.push("Planet mass");
  SLIDERS.push(createSlider(1, 30, 10.0, 0.01).class("terminatorSlider"));
}

function makeButtons(){
  var b = createButton('Fill box with random planets')
  b.mousePressed(fillButtonPressed);
  BUTTONS.push(b);

  b = createButton('Give roational bias')
  b.mousePressed(giveRotationalBiasButton);
  BUTTONS.push(b);

  b = createButton('Clear universe')
  b.mousePressed(emptyButtonPressed);
  BUTTONS.push(b);
}

function adjustToSlidervalues(){
  S         = SLIDERS[0].value(); // scale factor
  SP        = SLIDERS[1].value(); // radial scale factor
  makeMass  = SLIDERS[2].value();
}

function showControlpanel(){
  fill(255);
  noStroke();
  // General
  var top             = 40;
  var textSep         = 20;
  var xpos            = 120;
  var sliderSep       = 50;
  var classSeparation = 170;

  textSize(16);
  for(var i=0; i<SLIDERS.length; i++){
    textAlign(RIGHT);
    text(SLIDERTEXTS[i],    xpos-textSep, top+i*sliderSep+10);
    SLIDERS[i].position(    xpos, top+i*sliderSep);
    textAlign(LEFT);
    text(SLIDERS[i].value(),xpos+0.2*width, top+i*sliderSep+10);
  }

  var buttonSep = 20;
  var buttonX   = 20;
  for(var i=0; i<BUTTONS.length; i++){
    BUTTONS[i].position(    buttonX, top+i*buttonSep+SLIDERS.length*sliderSep);
  }
}


window.onresize = resize;

function resize() {
  canvas.size(windowWidth,windowHeight);
}


// =============================================================================

function showMouseDynamics(){
  noStroke();
  fill(mouseLineColor);
  ellipse(mCx,mCy,5,5);
  noFill(0);
  stroke(mouseLineColor);
  line(mCx,mCy,mouseX,mouseY);
}

function mousePressed(){
  mCx = mouseX;
  mCy = mouseY;
}

function mouseReleased(){
  var vx = vAttenuation*(mouseX - mCx);
  var vy = vAttenuation*(mouseY - mCy);
  var planet = new Planet((mouseX-cX)/S,(mouseY-cY)/S,vx,vy,makeMass);
  PLANETS.push( planet );
}




//
