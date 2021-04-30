

var play = true;
var perturbOnMove = true;
var place         = true;
var dX = 10;
var numberOfEvolutionsPerFrame = 1;
var velocity = 0.2;
var Nx,Ny;
var dr = 5;
var W, H, C;
var dampingFactor = 0.995;
var wave;
var coloring;


var panX = 0.0;
var panY = -3.141592/1.5;
let camD = 200;
var camX, camY, camZ;

function setup(){
  C = createCanvas(windowWidth, windowHeight,WEBGL);
  C.parent("sketch-holder");
  H = height; W = width;
  Nx = int(height/dr);
  Ny = int(height/dr);
  wave = new Wave(velocity,height,height,Nx,Ny);
  wave.createLattice();

  playCheckbox          = createCheckbox('play', true);
  perturbOnMoveCheckbox = createCheckbox('perturb on move', false);
  placeCheckbox         = createCheckbox("place source (else: barrier)",true);
  dampingSlider         = createSlider(-10, 0, -2, 0.5);

  playCheckbox.parent("control-holder");
  perturbOnMoveCheckbox.parent("control-holder");
  placeCheckbox.parent("control-holder");
  dampingSlider.parent("control-holder");

  // strokeWeight(1.5*dr);
  perspective();
}

function draw(){
  background(0);
  dampingFactor = 1-pow(10,dampingSlider.value());
  play          = playCheckbox.checked();
  perturbOnMove = perturbOnMoveCheckbox.checked();
  place         = placeCheckbox.checked();


  camX = camD*sin(panX)*sin(panY);
  camY = camD*cos(panX)*sin(panY);
  camZ = -camD*cos(panY);
  camera(camX,camY,camZ, 0,0,0, 0,0,-1);

  stroke(255);
  if(play){
    for(var i=0; i<numberOfEvolutionsPerFrame; i++){
      wave.evolve();
      wave.damping(dampingFactor);
    }
  }

  // strokeWeight(1);
  // stroke(255,100);
  // pointLight(255, 255, 255, 0, 0, 200);
  // specularMaterial(50,50,200);
  // shininess(50);
  // wave.show();
  // normalMaterial();
  stroke(255);
  wave.showMesh();
  // wave.showPoints();
  // wave.show();
  stroke(255,0,0,50);
  wave.showDepthPoints();



  var X = -mouseX + width/2 ;
  var Y = 0;
  var Z = -mouseY + height/2;
  // FOV: PI/3.0
  var DX = X-camX;
  var DY = Y-camY;
  var DZ = Z-camZ;

  fill(255,0,0);
  stroke(255,0,0);
  var dc = getMouseRay()
  noStroke();
  // fill(255,0,0);
  var n = -camZ/dc[2];
  var sVec = [camX+n*dc[0],camY+n*dc[1],camZ+n*dc[2]];
  fill(255,0,0);
  push(); translate(sVec[0],sVec[1],sVec[2]); sphere(5); pop();

}


function getMouseRay(){
  var aX = 2*(mouseX/width-0.5)*(PI/3);//map(mouseX,0,width,-PI/3,PI/3);
  var aY = 2*(mouseY/height-0.5)*(PI/3); // map(mouseY,0,height,-PI/3,PI/3);

  var cNorm = sqrt(sq(camX)+sq(camY)+sq(camZ));
  var cV  = [camX/cNorm,camY/cNorm,camZ/cNorm]; // camera direction
  var cUp = [0,0,-1];
  var cR  = cross(cUp,cV);
  var cU  = cross(cV,cR);

  var cVY  = rotateVector(cV, cR, aY);
  var cVX  = rotateVector(cV, cU, -aX);
  var dC = [cVX[0]+cVY[0],cVX[1]+cVY[1],cVX[2]+cVY[2]]
  dCnorm = sqrt(sq(dC[0])+sq(dC[1])+sq(dC[2]));

  return [dC[0]/dCnorm,dC[1]/dCnorm,dC[2]/dCnorm]
}

function getOnPress(){
  var dc = getMouseRay()
  var n = -camZ/dc[2];
  var sVec = [camX+n*dc[0],camY+n*dc[1],0];
  return [camX+n*dc[0],camY+n*dc[1]]
}

function cross(a,b){
  return [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
}

function rotateVector(v,u,t){ // vector v, axis u, angle t
  var ct = cos(t);
  var st = sin(t);
  return [ (ct+sq(u[0])*(1-ct))*v[0] + (u[0]*u[1]*(1-ct)-u[2]*st)*v[1] + (u[0]*u[2]*(1-ct)+u[1]*st)*v[2],
           (u[0]*u[1]*(1-ct)+u[2]*st)*v[0] + (ct+sq(u[1])*(1-ct))*v[1] + (u[1]*u[2]*(1-ct)-u[0]*st)*v[2],
           (u[0]*u[2]*(1-ct)-u[1]*st)*v[0] + (u[1]*u[2]*(1-ct)+u[0]*st)*v[1] + (ct+sq(u[2])*(1-ct))*v[2]];
}



class Wave{
  constructor(c,W,H,Nx,Ny){
    this.K = c;
    this.W = W;
    this.H = H;
    this.Nx = Nx;
    this.Ny = Ny;
  }

  createLattice(){
    var Unew  = new Array(this.Nx);
    var U     = new Array(this.Nx);
    var Up    = new Array(this.Nx);
    var C     = new Array(this.Nx);
    for(var i=0; i<this.Nx; i++){
      Unew[i]   = new Array(this.Ny);
      U[i]      = new Array(this.Ny);
      Up[i]     = new Array(this.Ny);
      C[i]      = new Array(this.Ny);
      for(var j=0; j<this.Ny; j++){
        Unew[i][j]  = 0.0;
        U[i][j]     = 0.0;
        Up[i][j]    = 0.0;
        C[i][j]     = 1;
      }
    }
    this.U = U;
    this.Unew = Unew;
    this.Up = Up;
    this.C = C;
  }

  perturb(mx,my,std,amp){
    for(var i=1; i<this.Nx-1; i++){
      for(var j=1; j<this.Ny-1; j++){
        var mi = map(mx,-this.W/2,this.W/2,0,this.Nx);
        var mj = map(my,-this.H/2,this.H/2,0,this.Ny);
        this.U[i][j] -= amp * exp(-(sq(i-mi)+sq(j-mj))/(2.0*std));
      }
    }
  }

  elevate(mx,my,std,amp){
    for(var i=1; i<this.Nx-1; i++){
      for(var j=1; j<this.Ny-1; j++){
        var mi = map(mx,-this.W/2,this.W/2,0,this.Nx);
        var mj = map(my,-this.H/2,this.H/2,0,this.Ny);
        this.C[i][j] -= amp * exp(-(sq(i-mi)+sq(j-mj))/(2.0*std));
      }
    }
  }

  constrain(x,y,r){
    var I = map(x,-this.W/2,this.W/2,0,this.Nx);
    var J = map(y,-this.H/2,this.H/2,0,this.Ny);
    for(var i=0; i<this.Nx; i++){
      for(var j=0; j<this.Ny; j++){
        if(sq(I-i)+sq(J-j)<sq(r)){
          this.C[i][j] = true;
        }
      }
    }
  }

  damping(f){
    for(var i=1; i<this.Nx-1; i++){for(var j=1; j<this.Ny-1; j++){this.U[i][j] *= f;}}
  }

  evolve(){
    for(var i=1; i<this.Nx-1; i++){
      for(var j=1; j<this.Ny-1; j++){
        this.Unew[i][j]  = 2.0*this.U[i][j]-this.Up[i][j]; // time part
        if(this.C[i][j]>0){
          var Kij = this.K*this.C[i][j];
        }else{
          var Kij = 0;
        }
        this.Unew[i][j] += Kij*(this.U[i+1][j]+this.U[i-1][j]+this.U[i][j-1]+this.U[i][j+1]-4*this.U[i][j]);  // space part
        // this.Unew[i][j] *= !(this.C[i][j]>0); // cancel on barrier
      }
    }
    for(var i=1; i<this.Nx-1; i++){
      arrayCopy(this.U[i],this.Up[i]);
      arrayCopy(this.Unew[i],this.U[i]);
    }
  }

  showMesh(){
    noFill();
    for(var i=0; i<this.Nx; i++){
      beginShape();
      for(var j=0; j<this.Ny; j++){
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
      }
      endShape();
    }
    for(var j=0; j<this.Ny; j++){
      beginShape();
      for(var i=0; i<this.Nx; i++){
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
      }
      endShape();
    }
  }

  showDepthMesh(){
    noFill();
    for(var i=0; i<this.Nx; i++){
      beginShape();
      for(var j=0; j<this.Ny; j++){
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,-10*dr*this.C[i][j]);
      }
      endShape();
    }
    for(var j=0; j<this.Ny; j++){
      beginShape();
      for(var i=0; i<this.Nx; i++){
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,-10*dr*this.C[i][j]);
      }
      endShape();
    }
  }

  show(){
    beginShape(TRIANGLE_STRIP);
    for(var i=1; i<this.Nx-1; i+=2){
      for(var j=0; j<this.Ny-1; j++){
        vertex((i-1-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i-1][j]);
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
      }
      vertex((i-1-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
      for(var j=this.Ny-1; j>=0; j--){
        vertex((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
        vertex((i+1-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i+1][j]);
      }
    }
    endShape();
  }

  showPoints(){
    for(var i=0; i<this.Nx-1; i++){
      for(var j=0; j<this.Ny-1; j++){
        point((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,dr*this.U[i][j]);
      }}
  }

  showDepthPoints(){
    for(var i=0; i<this.Nx-1; i++){
      for(var j=0; j<this.Ny-1; j++){
        point((i-this.Nx/2)*dr,(j-this.Ny/2)*dr,-10*dr*this.C[i][j]);
      }}
  }
}




function mousePressed(){
  var mPos = getOnPress()
  print(mPos);
  if(place){
    wave.perturb(mPos[0],mPos[1],5,2);
  }else{
    // wave.constrain(mPos[0],mPos[1],2);
    wave.elevate(mPos[0],mPos[1],100,0.5);
  }
}

function mouseDragged(){
  if(!place){
    wave.constrain(mouseX,mouseY,2);
  }

  // if (C.elt.matches(':hover')){
  panX += 0.01*(mouseX-pmouseX);
  panY -= 0.01*(mouseY-pmouseY);
  // }
}

function mouseWheel(){
  camD += event.delta;
  // return false;
}


function mouseMoved(){
  if(perturbOnMove){
    wave.perturb(mouseX,mouseY,2,0.5);
  }
}

function keyPressed(){
  if(keyCode==32){ // SPACE
    play=!play;
  }
  if(keyCode==112){ // P
    place = !place;
  }
}
