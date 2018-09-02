

var play = true;
var perturbOnMove = true;
var place         = true;
var numberOfEvolutionsPerFrame = 2;
var velocity = 0.4;
var Nx = 90;//150;
var Ny = 100;//90;
var dr = 7;
var W, H;
var dampingFactor = 0.995;
var wave;
var coloring;


function setup(){
  createCanvas(windowWidth,windowHeight);
  W = width;
  H = height;
  Nx = int(W/dr);
  Ny = int(H/dr);
  wave = new Wave(velocity,W,H,Nx,Ny);
  wave.createLattice();

  playCheckbox          = createCheckbox('play', true);
  perturbOnMoveCheckbox = createCheckbox('perturb on move', false);
  placeCheckbox         = createCheckbox("place source (else: barrier)",true);
  dampingSlider         = createSlider(-10, 0, -2, 0.5);
  coloringSlider        = createSlider(0.01, 1, 0.2, 0.01);
  showSelector          = createSelect();

  showSelector.option("Triangulate");
  showSelector.option("Colored dots");
  showSelector.option("Lines");
  showSelector.option("Horizontal lines only");


  playCheckbox.position(20,60);
  perturbOnMoveCheckbox.position(20,80);
  placeCheckbox.position(20,100);
  showSelector.position(20,20)

  strokeWeight(1.5*dr);
}

function draw(){
  background(0);
  dampingFactor = 1-pow(10,dampingSlider.value());
  play          = playCheckbox.checked();
  perturbOnMove = perturbOnMoveCheckbox.checked();
  place         = placeCheckbox.checked();
  coloring      = coloringSlider.value();

  if(play){
    for(var i=0; i<numberOfEvolutionsPerFrame; i++){
      wave.evolve();
      wave.damping(dampingFactor);
    }
  }

  if(showSelector.value()=="Lines"){
    wave.showLines();
  }else if(showSelector.value()=="Colored dots"){
    strokeWeight(1.5*dr);
    wave.showDots();
  }else if(showSelector.value()=="Horizontal lines only"){
    strokeWeight(1.5*dr);
    wave.showLinesHorizontal();
  }else if(showSelector.value()=="Triangulate"){
    noStroke();
    wave.showTriangles(2);
  }

  noStroke();
  fill(255,150);
  rect(0,0,260,150);
  fill(0);
  text("Damping",20,45);
  dampingSlider.position(80,40);
  text("10^("+str(dampingSlider.value())+")",210,45);

  text("Coloring",20,125);
  coloringSlider.position(80,120);

}





function Wave(c,W,H,Nx,Ny){
  this.K = c; //  (cdt/dx)^2
  this.W = W;
  this.H = H;
  this.Nx = Nx;
  this.Ny = Ny;
}

Wave.prototype.createLattice = function(){
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
      C[i][j]     = false;
    }
  }
  this.U = U;
  this.Unew = Unew;
  this.Up = Up;
  this.C = C;
}

Wave.prototype.perturb = function(mx,my,std,amp){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      var mi = map(mx,0,this.W,0,this.Nx);
      var mj = map(my,0,this.H,0,this.Ny);
      this.U[i][j] -= amp * exp(-(sq(i-mi)+sq(j-mj))/(2.0*std));
    }
  }
}

Wave.prototype.constrain = function(x,y,r){
  var I = map(x,0,this.W,0,this.Nx);
  var J = map(y,0,this.H,0,this.Ny);
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      if(sq(I-i)+sq(J-j)<sq(r)){
        this.C[i][j] = true;
      }
    }
  }
}

Wave.prototype.damping = function(f){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      this.U[i][j] *= f;
    }
  }
}

Wave.prototype.evolve = function(){
  for(var i=1; i<this.Nx-1; i++){
    for(var j=1; j<this.Ny-1; j++){
      this.Unew[i][j]  = 2.0*this.U[i][j]-this.Up[i][j]; // time part
      this.Unew[i][j] += this.K*(this.U[i+1][j]+this.U[i-1][j]+this.U[i][j-1]+this.U[i][j+1]-4*this.U[i][j]);  // space part
      this.Unew[i][j] *= !this.C[i][j]; // cancel on barrier
    }
  }
  // update
  for(var i=1; i<this.Nx-1; i++){
    arrayCopy(this.U[i],this.Up[i]);
    arrayCopy(this.Unew[i],this.U[i]);
  }
}


Wave.prototype.showTriangles = function(skipPoints){
  var high = color(209, 219, 189);
  var low  = color(25, 52, 65);
  for(var i=0; i<this.Nx-skipPoints; i+=skipPoints){
    beginShape(TRIANGLE_STRIP);
    for(var j=0; j<this.Ny; j+=skipPoints){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var xn= map(i+skipPoints,0,this.Nx,0,this.W);
      var val = 10*this.U[i][j];
      var valn= 10*this.U[i+skipPoints][j];
      if(this.C[i][j]){
        fill(255);
      }else{
        var lamb = 0.5-0.5*atan(coloring*val);
        fill(lerpColor(low, high, lamb));
      }
      vertex(x,y+val);
      vertex(xn,y+valn);


    }
    endShape();
  }

}
Wave.prototype.showLines = function(){
  strokeWeight(0.4);
  noFill();
  stroke(255);
  for(var i=0; i<this.Nx; i++){
    beginShape();
    for(var j=0; j<this.Ny; j++){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var val = 40*this.U[i][j];
      vertex(x,y+val);
    }
    endShape();
  }
  for(var j=0; j<this.Ny; j++){
    beginShape();
    for(var i=0; i<this.Nx; i++){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var val = 40*this.U[i][j];
      vertex(x,y+val);
    }
    endShape();
  }
}
Wave.prototype.showLinesHorizontal = function(){
  strokeWeight(0.4);
  noFill();
  stroke(255);
  for(var j=0; j<this.Ny; j++){
    beginShape();
    for(var i=0; i<this.Nx; i++){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var val = 40*this.U[i][j];
      vertex(x,y+val);
    }
    endShape();
  }
}
Wave.prototype.showDots = function(){
  for(var i=0; i<this.Nx; i++){
    for(var j=0; j<this.Ny; j++){
      var x = map(i,0,this.Nx,0,this.W);
      var y = map(j,0,this.Ny,0,this.H);
      var val = PI*atan(this.U[i][j]);
      if(this.C[i][j]){
        stroke(0);
      }else{
        stroke(127+127*cos(val),127+127*cos(val+PI/3.),127+127*cos(val-4*PI/3.));
      }
      point(x,y);
    }
  }
}


function mousePressed(){
  if(place){
    wave.perturb(mouseX,mouseY,5,2);
  }else{
    wave.constrain(mouseX,mouseY,2);
  }
}

function mouseDragged(){
  if(!place){
    wave.constrain(mouseX,mouseY,2);
  }
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
