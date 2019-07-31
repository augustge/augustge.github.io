

var t = 0;
var asg;
var sel;

function setup(){
  C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  asg = new Autostereogram(width,height)
  asg.initiateMatrix(80)
  noLoop()

  sel = createSelect();
  sel.position(20, 20);
  sel.option('Sharp shapes');
  sel.option('Smooth shapes');
  sel.option('Dynamic shapes');
  sel.changed(mySelectEvent);
}


function draw(){
  strokeWeight(1)
  background(255)
  asg.show(0,0)
  // asg.showAt(50,0)
  t += 1;

}


function Z(x,y){
  var z = 0
  if(sel.value()=='Sharp shapes'){
    if(sq(x-400)+sq(y-100)<sq(50)){ z -= 5 }
    if(sq(x-300)+sq(y-150)<sq(40)){ z -= 2 }
    if(abs(x-300)+abs(y-250)<abs(50)){ z -= 4 }
    if(abs(x-300)+abs(y-250)<abs(30)){ z += 4 }
  }else if(sel.value()=='Smooth shapes'){
    z -= 3*(1+cos((2*PI/80)*sqrt(sq(x-width/2+100)+sq(y-height/2))))*exp(-0.0001*(sq(x-width/2+100)+sq(y-height/2)))
    z -= 3*(1+cos((2*PI/80)*sqrt(sq(x-width/2-100)+sq(y-height/2))))*exp(-0.0001*(sq(x-width/2-100)+sq(y-height/2)))
  }else{
    z -= 3*(1+cos((2*PI/50)*sqrt(sq(x-width/2)+sq(y-height/2))-t))*exp(-0.0001*(sq(x-width/2)+sq(y-height/2)))
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
  }

  this.iterateSlice = function(I,X0,Y0){
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        stroke(this.M[i][j])
        point(X0+i+I*this.w,Y0+j)
        this.Zs[i][j] += Z(i+I*this.w,j)
      }
    }
    for(var i=0; i<this.w; i++){
      for(var j=0; j<this.h; j++){
        stroke(this.M[i][j])
        point(X0+i+I*this.w+this.Zs[i][j],Y0+j)
      }
    }
  }

  this.show = function(X0,Y0){
    for(var I=0; I<this.numI; I++){
      this.iterateSlice(I,X0,Y0)
    }
  }

}


function mySelectEvent(){
  redraw();
  if(sel.value()=='Dynamic shapes'){
    loop();
  }else{
    noLoop();
  }
}
