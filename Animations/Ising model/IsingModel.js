
var lattice;
var Tslider;

function setup(){
  createCanvas(windowWidth,windowHeight);
  setColors();

  Tslider = createSlider(0, 10, 2, 0.01).class("terminatorSlider");

  lattice = new Lattice(int(width/10),int(height/10),0.76*width,0.76*height,Tslider.value());
  lattice.fillLatticeRandom();


}

function draw(){
  background(0);

  fill(c1);
  textSize(25);
  lattice.T = Tslider.value();
  text(lattice.T,30+0.2*width,35);
  Tslider.position(20,20);

  lattice.show(width/2,height/2);
  lattice.doCycle();

}

function Lattice(Nx,Ny,W,H,T){
  this.T  = T;
  this.Nx = Nx;
  this.Ny = Ny;
  this.W  = W;
  this.H  = H;
  this.Sx = map(1,0,Nx,0,W);
  this.Sy = map(1,0,Ny,0,H);

  this.cycles = 0;

  this.M  = new Array(Nx);
  for(var i=0; i<Nx; i++){
    this.M[i] = new Array(Ny);
    for(var j=0; j<Ny; j++){
      this.M[i][j] = 0;
    }
  }
}

Lattice.prototype.remakeGrid = function(Nx,Ny){
  this.M  = new Array(Nx);
  for(var i=0; i<Nx; i++){
    this.M[i] = new Array(Ny);
    for(var j=0; j<Ny; j++){
      this.M[i][j] = 0;
    }
  }
}

Lattice.prototype.fillLatticeRandom = function(){
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      this.M[i][j] = random([-1,1]); // rand in {-1,1}
    }
  }
}

Lattice.prototype.fillLatticeWith = function(s){
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      this.M[i][j] = s; // rand in {-1,1}
    }
  }
}

Lattice.prototype.dE = function(i,j){
  // mangler -1 siden S[i][j] er flippet
  var s = this.M[(this.Nx+i-1)%this.Nx][j%this.Ny]
  s    += this.M[i%this.Nx         ][(this.Ny+j-1)%this.Ny]
  s    += this.M[(i+1)%this.Nx     ][j%this.Ny]
  s    += this.M[i%this.Nx         ][(j+1)%this.Ny]
  var E = this.M[i][j]*s;
  return E;
}

Lattice.prototype.doFlip = function(i,j){
  var rani = int(random(this.Nx)); //pick random
  var ranj = int(random(this.Ny)); //pick random
  var dE = 2*this.dE(rani, ranj); // energy change:  +1 since flipped   1/2'ing since every energy is counted twice
  if(dE<0){
    this.M[rani][ranj]*=-1; // accept the flip
    // this.energy += dE;
  }else if(exp(-dE/this.T)>random(1)){
    this.M[rani][ranj]*=-1; // accept the flip
    // this.energy += dE;
  }else{
    // this.energy += 0;
  }
  this.cycles ++;
}

Lattice.prototype.doCycle = function(){
  for(var i=0; i<this.Nx*this.Ny; i++){
    this.doFlip();
  }
}

Lattice.prototype.doCycles = function(n){
  for(var k=0; k<n; k++){
    this.doCycle();
  }
}



Lattice.prototype.show = function(x0,y0){ // centerpos
  push()
  translate(x0-this.Sx/2.,y0-this.Sy/2.);
  noStroke();
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      if(this.M[i][j]==1){
        fill(c5);
      }else{
        fill(c1);
      }
      var x = map(i,0,this.Nx,-this.W/2.,this.W/2.);
      var y = map(j,0,this.Ny,-this.H/2.,this.H/2.);
      rect(x,y,this.Sx,this.Sy);
    }
  }
  pop();
}


// =============================================================================
function setColors(){
  c1 = color("#E3CDA4");
  c2 = color("#C77966");
  c3 = color("#2F343B");
  c4 = color("#7E827A");
  c5 = color("#703030");
}


// =============================================================================
function keyPressed(){
  // 36. left arrow,
  // 38. right arrow,
  // 37. up arrow,
  if(keyCode==38){
    lattice.T += 0.1;
    Tslider.value(lattice.T);
  }
  // 39. down arrow
  if(keyCode==40){
    lattice.T -= 0.1;
    Tslider.value(lattice.T);
  }
}

//
