

var t = 0;
var s = 5;
var asg,sel,W,H;
var showDrawing = false;
var cursorDepth = -2

function setup(){
  C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  W = int(width/s);
  H = int(height/s);

  asg = new Autostereogram(W,H)
  asg.initiateMatrix(40)
  // noLoop()



  sel = createSelect();
  sel.position(20, 20);
  sel.option('Sharp shapes');
  sel.option('Smooth shapes');
  sel.option('Dynamic shapes');
  sel.option('Draw Image');
  // sel.changed(mySelectEvent);
}


function draw(){
  strokeWeight(1);
  background(255);
  // scale(s);
  asg.show(0,0);
  if(sel.value()=='Draw Image' && showDrawing){
    asg.showMatrix()
  }
  // asg.showAt(50,0)
  t += 1;
}


function Z(x,y){
  var z = 0
  if(sel.value()=='Sharp shapes'){
    if(sq(x-W/2)+sq(y-H/2)<sq(30)){ z -= 5 }
  }else if(sel.value()=='Smooth shapes'){
    z -= 3*(1+cos((2*PI/80)*sqrt(sq(x-W/2)+sq(y-H/2))))*exp(-0.0001*(sq(x-W/2)+sq(y-H/2)));
    // z -= 3*(1+cos((2*PI/80)*sqrt(sq(x-W/2-100)+sq(y-H/2))))*exp(-0.0001*(sq(x-W/2-100)+sq(y-H/2)));
  }else if(sel.value()=='Dynamic shapes'){
    z -= int(3*(1+cos((2*PI/50)*sqrt(sq(x-W/2)+sq(y-H/2))-t))*exp(-0.0001*(sq(x-W/2)+sq(y-H/2))));
  }else{
    var i = min(asg.W-1,max(0,x))
    var j = min(asg.h-1,max(0,y))
    z -= asg.matrix[i][j]

  }
  return z
}



function Autostereogram(W,H){
  this.W = W
  this.h = H
  this.P = []
  this.col = []
  this.Zshift = []

  this.initiateMatrix = function(w){
    this.w = w
    this.numI = this.W/w
    this.M  = []
    this.Zs = []
    for(var i=0; i<this.w; i++){
      var subM = []
      var subZ = []
      for(var j=0; j<this.h; j++){
        var c = color(random(0,255),random(0,255),random(0,255))
        subM.push(c)
        subZ.push(0)
      }
      this.M.push(subM)
      this.Zs.push(subZ)
    }

    this.matrix = [];
    for(var i=0; i<this.W; i++){
      var subMat = []
      for(var j=0; j<this.h; j++){
        subMat.push(0)
      }
      this.matrix.push(subMat)
    }
  }

  this.setMatrix = function(x,y,z){
    var i0 = int(x/s);
    var j0 = int(y/s);
    for(var di=-3; di<3; di++){
      for(var dj=-3; dj<3; dj++){
        var i = min(max(i0+di,0),asg.W);
        var j = min(max(j0+dj,0),asg.h);
        this.matrix[i][j] = z;
      }
    }
  }

  this.iterateSlice = function(I,X0,Y0){
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        fill(this.M[i][j])
        rect(X0+s*(i+I*this.w),Y0+s*j,s,s)
        this.Zs[i][j] += Z(i+I*this.w,j)
      }
    }
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        fill(this.M[i][j])
        rect(X0+s*(i+I*this.w+this.Zs[i][j]),Y0+s*j,s,s)
        // rect(X0+s*(i+I*this.w+round(this.Zs[i][j])),Y0+s*j,s,s)
      }
    }
  }

  this.show = function(X0,Y0){
    noStroke()
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
          this.Zs[i][j] = 0;
      }
    }
    for(var I=0; I<this.numI; I++){
      this.iterateSlice(I,X0,Y0);
    }
  }

  this.showMatrix = function(){
    for(var i=0; i<this.W; i++){
      for(var j=0; j<this.h; j++){
        if(this.matrix[i][j]!=0){
          fill(-255*(this.matrix[i][j]/5))
          rect(s*i,s*j,s,s)
        }
      }
    }
  }

}

function mouseDragged(){
  asg.setMatrix(mouseX,mouseY,cursorDepth)
}

function mousePressed(){
  asg.setMatrix(mouseX,mouseY,cursorDepth)
}

function keyPressed(){
  if(keyCode==32){ // SPACE
    showDrawing = !showDrawing;
  }else if(keyCode==38){ // UP
    cursorDepth += 1;
    cursorDepth = min(max(cursorDepth,-5),0)
  }else if(keyCode==40){
    cursorDepth -= 1;
    cursorDepth = min(max(cursorDepth,-5),0)
  }
}
