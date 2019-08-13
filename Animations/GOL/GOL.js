

var GOL;
var play = true;
var currentPattern = [[1]];
var sel;



function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  var w = int(width/6)
  var h = int(height/6)
  GOL = new GameOfLife(w,h,6,6);

  sel = createSelect();
  sel.position(20, 20);
  sel.option('point');
  sel.option('glider');
  sel.option('toad');
  sel.option('beacon');
  sel.option('LWSS');
  sel.option('R-pentomino');
  sel.changed(patternUpdate);

  noStroke()
}

function draw(){
  background(0);
  GOL.show(0,0);
  play? GOL.iterate() : null;
  play? GOL.finalize() : GOL.showRules(0,0);

  var mx = int(mouseX/GOL.sx)
  var my = int(mouseY/GOL.sy)
  var i0 = min(max(mx,0),GOL.w-1)
  var j0 = min(max(my,0),GOL.h-1)
  GOL.showPencil(0,0,i0,j0,currentPattern)
}


class GameOfLife{
  constructor(w,h,sx,sy){
    this.w = w;
    this.h = h;
    this.sx = sx;
    this.sy = sy;
    this.matrix = [];
    this.matrixN = [];
    for(var i=0; i<w; i++){
      var subM = [];
      var subMN = [];
      for(var j=0; j<h; j++){
        subM.push( 0 );
        subMN.push( 0 );
      }
      this.matrix.push(subM);
      this.matrixN.push(subMN);
    }
  }

  neighbours(i,j){
    var M = this.matrix;
    var r1 = M[I(i-1)][J(j-1)]  +M[i][J(j-1)] +M[I(i+1)][J(j-1)]
    var r2 = M[I(i-1)][j]                     +M[I(i+1)][j]
    var r3 = M[I(i-1)][J(j+1)]  +M[i][J(j+1)] +M[I(i+1)][J(j+1)]
    return r1+r2+r3
  }

  iterate(){
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        var ngb = this.neighbours(i,j)
        if(this.matrix[i][j]==1){ // alive
          if(ngb<2){
            // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            this.matrixN[i][j] = 0;
          }else if(ngb<=3){
            //  Any live cell with two or three live neighbours lives on to the next generation.
            this.matrixN[i][j] = 1;
          }else{
            //  Any live cell with more than three live neighbours dies, as if by overpopulation.
            this.matrixN[i][j] = 0;
          }
        }else if(ngb==3){  // dead and ==3 ngb's
          //  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          this.matrixN[i][j] = 1;
        }
      }
    }
  }

  finalize(){
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        this.matrix[i][j] = this.matrixN[i][j];
      }
    }
  }

  toggleLiveCell(i,j){
    this.matrix[i][j]==1? this.matrix[i][j]=0 : this.matrix[i][j]=1;
  }

  initiatePattern(i0,j0,pattern){
    for(var i=0; i<pattern.length; i++){
      for(var j=0; j<pattern[i].length; j++){
        this.matrix[I(i0+i)][J(j0+j)] = pattern[i][j];
      }
    }
  }

  show(X0,Y0){
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        this.matrix[i][j]==0 ? fill(100) : fill(255);
        rect(X0+i*this.sx,Y0+j*this.sy,this.sx,this.sy)
      }
    }
  }

  showRules(X0,Y0){
    for(var i=1; i<this.w-1; i++){
      for(var j=1; j<this.h-1; j++){
        var ngb = this.neighbours(i,j)
        if(this.matrix[i][j]==1){
          if(ngb<2){
            // Any live cell with fewer than two live neighbours dies, as if by underpopulation.
            fill(255,0,0)
          }else if(ngb<=3){
            //  Any live cell with two or three live neighbours lives on to the next generation.
            fill(255)
          }else{
            //  Any live cell with more than three live neighbours dies, as if by overpopulation.
            fill(255,0,0)
          }
        }else if(ngb==3){
          //  Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
          fill(0,255,0)
        }else{
          noFill()
        }
        rect(X0+i*this.sx,Y0+j*this.sy,this.sx,this.sy)
      }
    }
  }

  showPencil(X0,Y0,i0,j0,pattern){
    noFill()
    for(var i=0; i<pattern.length; i++){
      for(var j=0; j<pattern[i].length; j++){
        if(pattern[i][j]==1){
          stroke(255)
          rect(X0+I(i0+i)*this.sx,Y0+J(j0+j)*this.sy,this.sx,this.sy)
        }
      }
    }
    noStroke();
  }

}


// ===============================================================

function patternUpdate(){
    if(sel.value()=="point"){
      currentPattern = [[1]];
    }else if(sel.value()=="glider"){
      currentPattern =[[0,0,1],
                       [1,0,1],
                       [0,1,1]];
    }else if(sel.value()=="toad"){
      currentPattern =[[0,1,1,1],
                       [1,1,1,0]];
    }else if(sel.value()=="beacon"){
      currentPattern =[[1,1,0,0],
                       [1,1,0,0],
                       [0,0,1,1],
                       [0,0,1,1]];
    }else if(sel.value()=="LWSS"){
      currentPattern =[[0,1,1,1,1],
                       [1,0,0,0,1],
                       [0,0,0,0,1],
                       [1,0,0,1,0]];
    }else if(sel.value()=="R-pentomino"){
      currentPattern =[[0,1,1],
                       [1,1,0],
                       [0,1,0]];
    }
}

// ===============================================================


function I(i){ return (i+GOL.w)%GOL.w }
function J(j){ return (j+GOL.h)%GOL.h }

// ===============================================================



function mousePressed(){
  var mx = int(mouseX/GOL.sx)
  var my = int(mouseY/GOL.sy)
  var i = min(max(mx,0),GOL.w-1)
  var j = min(max(my,0),GOL.h-1)
  GOL.initiatePattern(i,j,currentPattern)
}


function keyPressed(){
  if(keyCode==32){ // SPACE
    play = !play;
  }
  // L U R D
  // 37 38 39 40
  return false;
}







//
