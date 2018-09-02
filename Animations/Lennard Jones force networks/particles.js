
var t = 1;
var dt = 0.001;
var rPerM = 5;

var rcutoff = 1e-17;
var iterationsPerDraw = 5;

// unit conversions
var PxPerMeter = 30.

// for particle creation by mouseclick
var X = 0;
var Y = 0;

// colors
var boxCol  = [100,100,100];
var backCol = [255,255,255];
// other
var sigma = 0.001;
var epsilon = 1;
var box;
var gravity;
var stress;
var lennardJones;
var g;
var N;
var T;
var vDamping;
var attenuation;
var acceleration;

function setup() {
  createCanvas(windowWidth, windowHeight);


  sliderSigma       = createSlider(0, 2, 1.16, 0.00001);
  sliderEpsilon     = createSlider(0, 100, 52., 0.00001);
  sliderTop         = createSlider(0, 10, 10, 0.01);
  sliderGravity     = createSlider(0, 10, 5, 0.1);
  sliderNumber      = createSlider(0, 100, 20, 1);
  sliderTemp        = createSlider(0, 2, 1, 0.1);
  sliderDamping     = createSlider(1, 50, 10, 1);
  sliderAttenuation = createSlider(0.0001,1,0.01,0.0001);

  refillButton  = createButton('REFILL BOX');
  refillButton.mousePressed(refillButtonPressed);

  lennardJonesCheckbox = createCheckbox('Lennard Jones', true);
  lennardJonesCheckbox.changed(toggleLJ);

  stressCheckbox = createCheckbox('Display stress', true);
  stressCheckbox.changed(toggleStress);

  acelerationCheckbox = createCheckbox('Display acceleration', false);
  acelerationCheckbox.changed(toggleAcceleration);

  gravityCheckbox = createCheckbox('Gravity', false);
  gravityCheckbox.changed(toggleGravity);

  g             = sliderGravity.value();
  sigma         = sliderSigma.value();
  N             = sliderNumber.value();
  T             = sliderTemp.value();
  vDamping      = sliderDamping.value();
  gravity       = gravityCheckbox.checked();
  lennardJones  = lennardJonesCheckbox.checked();
  stress        = stressCheckbox.checked();
  rPerM         = PxPerMeter*sigma;


  makebox(T,1,N);

}

function draw() {
    background(backCol[0],backCol[1],backCol[2]);

    sigma       = sliderSigma.value();
    rPerM       = PxPerMeter*sigma;
    epsilon     = sliderEpsilon.value();
    g           = sliderGravity.value();
    box.ybdT    = sliderTop.value();
    N           = sliderNumber.value();
    T           = sliderTemp.value();
    vDamping    = sliderDamping.value();
    attenuation = sliderAttenuation.value();
    translate(width/2,height/2);
    scale(1,-1);

    box.evolve(dt);
    box.display(20);
    box.displayContent();

    resetMatrix();
    showControlpanel();
}





// === CLASS BOX
function Box(xbdL,xbdR,ybdB,ybdT){
  this.xbdL = xbdL;
  this.xbdR = xbdR;
  this.ybdT = ybdT;
  this.ybdB = ybdB;
  this.particles = [];
}

Box.prototype.fill = function(N,T,m) {
  this.T = T
  for(var i=0; i<N; i++){
    x = random(this.xbdL,this.xbdR);
    y = random(this.ybdT,this.ybdB);

    // pick from Maxwell-Boltzmann
    var sd = sqrt(T/m); // T measured in [k deg]
    vx = randomGaussian(0,sd);
    vy = randomGaussian(0,sd);
    this.particles.push(new Particle(m,x,y,vx,vy));
  }
}

Box.prototype.addParticle = function(m,x,y,vx,vy) {
  this.particles.push(new Particle(m,x,y,vx,vy));
}


Box.prototype.evolve = function(dt) {
  for(var n=0; n<iterationsPerDraw; n++){
    for(var i=0; i<this.particles.length; i++){
      this.particles[i].getAcceleration(this.particles);
      this.particles[i].move(dt);
      this.particles[i].dampVelocity(vDamping);
      this.handleBoundary(i);
    }
  }
}


Box.prototype.handleBoundary = function(i) {
  // LEFT
  if(this.particles[i].x<this.xbdL){
    this.particles[i].x = this.xbdL;
    this.particles[i].vx *= -1;
  }

  // RIGHT
  if(this.particles[i].x>this.xbdR){
    this.particles[i].x = this.xbdR;
    this.particles[i].vx *= -1;
  }

  // BOTTOM
  if(this.particles[i].y<this.ybdB){
    this.particles[i].y = this.ybdB;
    this.particles[i].vy *= -1;
  }

  // TOP
  if(this.particles[i].y>this.ybdT){
    this.particles[i].y = this.ybdT;
    this.particles[i].vy *= -1;
  }
}

Box.prototype.display = function(thickness) {
  fill(boxCol[0],boxCol[1],boxCol[2]);
  noStroke();
  beginShape();
  vertex(PxPerMeter*this.xbdL-thickness,PxPerMeter*this.ybdT+thickness);
  vertex(PxPerMeter*this.xbdL-thickness,PxPerMeter*this.ybdB-thickness);
  vertex(PxPerMeter*this.xbdR+thickness,PxPerMeter*this.ybdB-thickness);
  vertex(PxPerMeter*this.xbdR+thickness,PxPerMeter*this.ybdT+thickness);
  beginContour();
  vertex(PxPerMeter*this.xbdR,PxPerMeter*this.ybdT);
  vertex(PxPerMeter*this.xbdR,PxPerMeter*this.ybdB);
  vertex(PxPerMeter*this.xbdL,PxPerMeter*this.ybdB);
  vertex(PxPerMeter*this.xbdL,PxPerMeter*this.ybdT);
  endContour();
  endShape(CLOSE);
}

Box.prototype.displayContent = function() {
  for(var i=0; i<this.particles.length; i++){
    this.particles[i].show();
  }
}



// === CLASS PARTICLE
function Particle(m,x,y,vx,vy){
  this.m = 1;
  this.r = rPerM*sqrt(this.m);
  this.x = x;
  this.y = y;
  this.vx = vx;
  this.vy = vy;
  this.ax = 0.0;
  this.ay = 0.0;
  this.T = 0.5*this.m*(sq(this.vx)+sq(this.vy));
}

Particle.prototype.getAcceleration = function(particles) {
  var Fx = 0;
  var Fy = 0;
  this.stress = 0;

  if(lennardJones){
    for(var i=0; i<particles.length; i++){
      if(particles[i]!=this){
        var rx = particles[i].x - this.x;
        var ry = particles[i].y - this.y;
        var rsq  = max([sq(rx)+sq(ry),rcutoff]);
        var rSinv = sq(sigma)/rsq;
        var xi = rSinv*rSinv*rSinv;
        var Fd = -epsilon*(2*sq(xi)-xi)/sqrt(rsq);
        Fx += Fd*rx;
        Fy += Fd*ry;

        this.stress += sqrt( sq(Fd*rx) + sq(Fd*ry) );
      }
    }
  }
  this.ax = Fx/this.m;
  this.ay = Fy/this.m;
  if(gravity){this.ay -= g;}
}

Particle.prototype.move = function(dt) {
  this.vx = this.vx + this.ax*dt
  this.vy = this.vy + this.ay*dt
  this.x = this.x   + this.vx*dt
  this.y = this.y   + this.vy*dt
}


Particle.prototype.dampVelocity = function(damping) {
  this.vx = min([this.vx,damping]);
  this.vy = min([this.vy,damping]);
}


Particle.prototype.show = function() {
  strokeWeight(this.r);
  var s = this.stress;
  if(stress){
    stroke(125*(atan(attenuation*s)+1),0,0);
  }else{
    stroke(0);
  }
  point(PxPerMeter*this.x,PxPerMeter*this.y);
  if(acceleration){
    strokeWeight(1);
    stroke(0,255,0);
    var a = 2*sqrt(sq(this.ax)+sq(this.ay));
    line(PxPerMeter*this.x,PxPerMeter*this.y,PxPerMeter*(this.x+this.ax/a),PxPerMeter*(this.y+this.ay/a));
  }
}




// =============================

function showControlpanel(){
  fill(0);
  noStroke();

  var classSeparation = 170;

  // General
  var ypos = 20
  refillButton.position( 20, ypos);

  text(sliderTop.value(),170,ypos+45);
  text("Box height",20,ypos+30);
  sliderTop.position(40, ypos+40);

  text(N,170,ypos+75);
  text("Number of particles",20,ypos+60);
  sliderNumber.position(40, ypos+70);

  text(T,170,ypos+105);
  text("Initial temperature",20,ypos+90);
  sliderTemp.position(40, ypos+100);

  text(vDamping,170,ypos+135);
  text("Velocity damping",20,ypos+120);
  sliderDamping.position(40, ypos+130);

  // Lennard Jones
  ypos += classSeparation;
  lennardJonesCheckbox.position(20,ypos);

  text(sigma,170,ypos+45);
  text("Radius",20,ypos+30);
  sliderSigma.position(  40, ypos+40);

  text(epsilon,170,ypos+75);
  text("Magnitude",20,ypos+60);
  sliderEpsilon.position(40,ypos+70);

  // Stress
  stressCheckbox.position(20,ypos+100);

  text(attenuation,170,ypos+135);
  text("Stress attenuation",20,ypos+120);
  sliderAttenuation.position(40,ypos+130);

  acelerationCheckbox.position(20,ypos+150);

  // Gravity
  ypos += classSeparation;
  gravityCheckbox.position(20,ypos);

  text(g,170,ypos+45);
  text("Magnitude",20,ypos+30);
  sliderGravity.position(  40, ypos+40);



}


function makebox(T,m,N){
  box = new Box(-10,10,-10,10);
  box.fill(N,T,m);
}

function refillButtonPressed(){
  makebox(T,1,N);
}

function toggleGravity(){       gravity       = this.checked(); }
function toggleLJ(){            lennardJones  = this.checked(); }
function toggleStress(){        stress        = this.checked(); }
function toggleAcceleration(){  acceleration  = this.checked(); }

function mousePressed(){
  X  = (mouseX - width/2)/PxPerMeter;
  Y  = -(mouseY - height/2)/PxPerMeter;
  line(0,0,mouseX,mouseY);
}

function mouseReleased(){
  var Xn = (mouseX - width/2)/PxPerMeter;
  var Yn = -(mouseY - height/2)/PxPerMeter;
  var Vx = Xn-X;
  var Vy = Yn-Y;
  if(X>box.xbdL && X<box.xbdR && Y<box.ybdT && Y>box.ybdB){
    box.addParticle(1,X,Y,100*Vx,100*Vy);
  }
}


function keyPressed() {

}







//
