
var SOLVER;
var rSeed = 0
var a = 0.2;
var b = 0.2;
var c = 5.7;
var solverN = 5000;
var limX = [-10,10,0.5];
var limY = [-10,10,0.5];
var limZ = [-10,10,0.5];
var s = 50;
var panX = 0.0;
var panY = -3.141592;
let camD = 2*s*(limX[1]-limX[0]);
var T,C,cam;
var inpFx,inpFy,inpFz,sa,sb,sc;
var dt = 0.05
var Trajectories = [];

function setup(){
  C = createCanvas(windowWidth, windowHeight,WEBGL);
  C.parent("sketch-holder");

  SOLVER = new IVP( function(x,y,z){return -y-z;},
                    function(x,y,z){return x+a*y;},
                    function(x,y,z){return b+z*(x-c);});
  SOLVER.N = solverN;
  T = SOLVER.solve(1,1,1,0.01)

  setTrajectories(600,30,0.01);

  inputUpdate = function(e){e.target.setAttribute("value",e.target.value); redefineFunctions(); T = SOLVER.solve(1,1,1,dt);}
  inpFx = createFunctionSelector(createInput('-y-z'    ),"$F_x$",inputUpdate)
  inpFy = createFunctionSelector(createInput('x+a*y'    ),"$F_y$",inputUpdate)
  inpFz = createFunctionSelector(createInput('b+z*(x-c)'),"$F_z$",inputUpdate)

  sliderUpdate = function(e){
    e.target.setAttribute("value",e.target.value);
    T = SOLVER.solve(1,1,1,dt);
  }
  sa  = addSlider(createSlider(-8,8,a,0.0001), "a", sliderUpdate)
  sb  = addSlider(createSlider(-8,8,b,0.0001), "b", sliderUpdate)
  sc  = addSlider(createSlider(-8,8,c,0.0001), "c", sliderUpdate)

}

function draw(){
  a = sa.value(); b = sb.value(); c = sc.value();
  // SOLVER.Fx = function(x,y,z){return -y-z;}
  // SOLVER.Fy = function(x,y,z){return x+a*y;}
  // SOLVER.Fz = function(x,y,z){return b+z*(x-c);}

  background(0,0,0);
  let camX = camD*cos(panX)*sin(panY);
  let camY = camD*sin(panX)*sin(panY);
  let camZ = -camD*cos(panY);

  camera(camX,camY,camZ, 0,0,0, 0,0,-1);
  stroke(50,50);
  noFill();

  drawAxes();

  push()
  translate(s*T[0][0],s*T[1][0],s*T[2][0])
  fill(255,0,0)
  sphere(3)
  pop()

  noFill();
  stroke(255);
  beginShape()
  for(var n=0; n<SOLVER.N; n++){vertex(s*T[0][n],s*T[1][n],s*T[2][n]);}
  endShape()

  //stroke(100);
  for(var i=0; i<Trajectories.length; i++){
    let Ti = Trajectories[i];
    Ti.evolve()
    //var dcam = sqrt(sq(camX)+sq(camY)+sq(camZ))-sqrt(sq(camX-Ti.X[0]*s)+sq(camY-Ti.Y[0]*s)+sq(camZ-Ti.Z[0]*s));
    var fak = (1-i/Trajectories.length);
    stroke(200*fak,150*fak,0,100*fak);
    Ti.display()
  }

  swapTrajectory(600,30,0.01);

}

function mouseDragged(){
  if (C.elt.matches(':hover')){
    panX += 0.01*(mouseX-pmouseX);
    panY += 0.01*(mouseY-pmouseY);
  }
  return 0;
}

function mouseWheel(){
  if (C.elt.matches(':hover')){
    camD += event.delta;
  }
  if(scrollY+mouseY<height){
    return false;
  }
}

function keyPressed(){
  if(keyCode==32){
    rSeed += 1;
    setTrajectories(600,30,0.01);
    return false;
  }
  if(keyCode==13){
    if(isLooping()){noLoop();}else{loop();}
  }

}

function redefineFunctions(){
  SOLVER.Fx = new Function("x","y","z","return "+inpFx.elt.value)
  SOLVER.Fy = new Function("x","y","z","return "+inpFy.elt.value)
  SOLVER.Fz = new Function("x","y","z","return "+inpFz.elt.value)
  // SOLVER.Fx = function(x,y,z){return eval(inpFx.elt.value);}
  // SOLVER.Fy = function(x,y,z){return eval(inpFy.elt.value);}
  // SOLVER.Fz = function(x,y,z){return eval(inpFz.elt.value);}
}

function drawAxes(){
  stroke(100);

  beginShape()
  vertex(-camD,0,0);
  vertex(camD,0,0);
  endShape()

  beginShape()
  vertex(0,-camD,0);
  vertex(0,camD,0);
  endShape()

  beginShape()
  vertex(0,0,-camD);
  vertex(0,0,camD);
  endShape()
}


// ================================================================
function F(X,Y){
  return [-Y[1]-Y[2],Y[0]-a*Y[1],b+Y[2]*(Z[0]-c)] // Rössler system
}


class IVP{
  constructor(Fx,Fy,Fz){
    this.N = 2000;
    this.Fx = Fx;
    this.Fy = Fy;
    this.Fz = Fz;
  }

  solve(X0,Y0,Z0,dR){
    var X = [X0];
    var Y = [Y0];
    var Z = [Z0];
    for(var n=0; n<this.N; n++){
      var R = this.step(X[n],Y[n],Z[n],dR);
      X.push(R[0])
      Y.push(R[1])
      Z.push(R[2])
    }
    return [X,Y,Z];
  }

  step(x,y,z,dr){
    var k1x = this.Fx(x,y,z);
    var k1y = this.Fy(x,y,z);
    var k1z = this.Fz(x,y,z);
    var k2x = this.Fx(x+0.5*dr*k1x,y+0.5*dr*k1y,z+0.5*dr*k1z);
    var k2y = this.Fy(x+0.5*dr*k1x,y+0.5*dr*k1y,z+0.5*dr*k1z);
    var k2z = this.Fz(x+0.5*dr*k1x,y+0.5*dr*k1y,z+0.5*dr*k1z);
    var k3x = this.Fx(x+0.5*dr*k2x,y+0.5*dr*k2y,z+0.5*dr*k2z);
    var k3y = this.Fy(x+0.5*dr*k2x,y+0.5*dr*k2y,z+0.5*dr*k2z);
    var k3z = this.Fz(x+0.5*dr*k2x,y+0.5*dr*k2y,z+0.5*dr*k2z);
    var k4x = this.Fx(x+dr*k3x,y+dr*k3y,z+dr*k3z);
    var k4y = this.Fy(x+dr*k3x,y+dr*k3y,z+dr*k3z);
    var k4z = this.Fz(x+dr*k3x,y+dr*k3y,z+dr*k3z);
    var xn = x + dr*(k1x+2*k2x+2*k3x+k4x)/6
    var yn = y + dr*(k1y+2*k2y+2*k3y+k4y)/6
    var zn = z + dr*(k1z+2*k2z+2*k3z+k4z)/6
    return [xn,yn,zn]
  }

}

class Trajectory{
  constructor(x0,y0,z0,dt,N,solver){
    this.N = N;
    this.dt = dt;
    this.solver = solver;
    this.X = [x0];
    this.Y = [y0];
    this.Z = [z0];
    for(var i=0; i<this.N-1; i++){this.addStep()}
  }

  addStep(){
    var n = this.X.length-1;
    var Rnew = SOLVER.step(this.X[n],this.Y[n],this.Z[n],this.dt);
    this.X.push(Rnew[0]);
    this.Y.push(Rnew[1]);
    this.Z.push(Rnew[2]);
  }

  evolve(){
    this.X.shift();
    this.Y.shift();
    this.Z.shift();
    var n = this.X.length-1;
    var Rnew = SOLVER.step(this.X[n],this.Y[n],this.Z[n],this.dt);
    this.X.push(Rnew[0]);
    this.Y.push(Rnew[1]);
    this.Z.push(Rnew[2]);
  }

  display(){
    beginShape();
    for(var n=0; n<this.N; n++){ vertex(s*this.X[n],s*this.Y[n],s*this.Z[n]); }
    endShape();
  }
}


function setTrajectories(num,N,dt){
  randomSeed(rSeed);
  Trajectories = [];
  for(var i=0; i<num; i++){
    var x0 = camD*(0.5-1*random())/s;
    var y0 = camD*(0.5-1*random())/s;;
    var z0 = camD*(0.5-1*random())/s;;
    Trajectories.push( new Trajectory(x0,y0,z0,dt,N))
  }
}

function swapTrajectory(num,N,dt){
  Trajectories.shift();
  var x0 = camD*(0.5-1*random())/s;
  var y0 = camD*(0.5-1*random())/s;;
  var z0 = camD*(0.5-1*random())/s;;
  Trajectories.push( new Trajectory(x0,y0,z0,dt,N));
}

// ================================================================

Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

function addSlider(S,text,func){
  var container = createDiv("");
  container.class("entrycontainer");
  container.parent( window.document.getElementById('control-holder') )
  S.parent(container);
  S.elt.onchange = func
  S.elt.oninput = func
  S.attribute("value",S.value())
  var textDiv = createDiv(text)
  textDiv.class("slidertext")
  textDiv.parent(container)
  return S;
}


function createFunctionSelector(S,text,func){
  var container = createDiv("");
  container.class("entrycontainer");
  container.parent( window.document.getElementById('control-holder') )
  var textDiv = createDiv(text)
  textDiv.class("slidertext")
  textDiv.parent(container)
  S.parent(container);
  S.class("text-input")
  S.elt.onchange = func;
  S.elt.oninput = func;
  return S;
}



//
