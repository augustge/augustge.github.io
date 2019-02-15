
var Nx = 100;
var Ny = 100;
var L,W;
var s;

function setup(){
  createCanvas(windowWidth,windowHeight);
  setColors();

  L = new Lattice(Nx,Ny);
  L.initialize();

  W = new Walker(random(Nx),random(Nx));
  W.reset(L)

  s = min([width/Nx,height/Ny])
}

function draw(){
  background(200);
  L.display(s);

  while(! W.move(L)){}
  L.update(W)
  W.reset(L)
}

function Lattice(Nx,Ny){
  this.Nx = Nx;
  this.Ny = Ny;
  this.M = [];
  this.minH = this.Ny-1

  this.initialize = function(){
    for(var i=0; i<this.Nx; i++){
      this.M[i] = []
      for(var j=0; j<this.Ny; j++){
        this.M[i][j] = 0;
      }
    }
    this.source = this.makeSource()
    this.addInitialDrain()
  }

  this.makeSource = function(){
    var source = [];
    for(var i=1; i<this.Nx-1; i++){
      source.push([i,0])
    }
    return source
  }

  this.addInitialDrain = function(){
    for(var i=0; i<this.Nx; i++){
      this.M[i][this.Ny-1] = 1
    }
  }

  this.update = function(W){
    L.M[W.x][W.y] = 1;
    this.minH = min([this.minH,W.y])
  }

  this.display = function(s){
    noStroke();
    for(var i=0; i<this.Nx; i++){
      for(var j=0; j<this.Ny; j++){
        if(this.M[i][j]==0){
          fill(255);
        }else{
          fill(0);
        }
        rect(s*i,s*j,s,s)
      }
    }
  }
}




function Walker(x0,y0){
  this.x = x0;
  this.y = y0;
  this.up    = [  0, -1 ];
  this.down  = [  0,  1 ];
  this.right = [  1,  0 ];
  this.left  = [ -1,  0 ];

  this.reset = function(L){
    sourcePos = random(L.source)
    this.x = sourcePos[0];
    this.y = max(sourcePos[1],L.minH-1);
  }

  this.allowedMoves = function(L){
    var allowed = [];
    if(this.y>0){    allowed.push(this.up)   }
    if(this.y<L.Ny-1){ allowed.push(this.down)     }
    if(this.x>0){    allowed.push(this.left)   }
    if(this.x<L.Nx-1){ allowed.push(this.right)  }
    return allowed
  }

  this.move = function(L){
    var allowed = this.allowedMoves(L)
    var move = random(allowed);
    return this.doMove(move,L)
  }

  this.doMove = function(move,L){
    if(L.M[this.x+move[0]][this.y+move[1]]==1){
      // this.reset(L);
      return true
    }else{
      this.x += move[0];
      this.y += move[1];
      return false
    }
  }

  this.show = function(s){
    fill(c5);
    rect(s*this.x,s*this.y,s,s)
  }
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
  // 39. down arrow
  if(keyCode==37){
    W.doMove(W.left,L)
  }

  if(keyCode==39){
    W.doMove(W.right,L)
  }

  if(keyCode==38){
    W.doMove(W.up,L)
  }

  if(keyCode==40){
    W.doMove(W.down,L)
  }
}

//
