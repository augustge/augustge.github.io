/*
  MISSING:
  (1) Display velocity field in background
  (2) Add flush-button
*/

var dt              = 0.01;
var doSteps         = 10;
var Wx              = [-10,10];
var Wy              = [-10,10];
var wMousepress     = 1
var timeOn          = true
var showBackground  = true
var vorticities     = [-4,-3,-2,-1,0,1,2,3,4];
var vIndex          = 1

var VORTICES = []

var buffer,Sm,SM;

function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  buffer = createGraphics(windowWidth, windowHeight);
  Sm = 10
  SM = max(width,height)-10
  buffer.strokeWeight(0.5);

  VORTICES.push( new Vortex(-1,-1,1) )
  VORTICES.push( new Vortex(-1,1,1) )
  VORTICES.push( new Vortex(1,-1,-1) )
  VORTICES.push( new Vortex(1,1,-1) )

}

function draw(){

  background(255)
  buffer.background(255,10)
  image(buffer, 0, 0);

  for(var m=0; m<doSteps; m++){
    for(var n=0; n<VORTICES.length; n++){VORTICES[n].setGetspeedCoords(0.0)}
    for(var n=0; n<VORTICES.length; n++){VORTICES[n].getSpeed(VORTICES)}
    for(var n=0; n<VORTICES.length; n++){VORTICES[n].setGetspeedCoords(0.5*dt)}
    for(var n=0; n<VORTICES.length; n++){VORTICES[n].getSpeed(VORTICES)}
    for(var n=0; n<VORTICES.length; n++){VORTICES[n].iterate(dt)}
  }

  for(var n=VORTICES.length-1; n>=0; n--){ // backward traverse list
    VORTICES[n].show(Wx,Wy,Sm,SM)
    VORTICES[n].logThisPos()
    if(VORTICES[n].isOutside(Wx,Wy)){ // remove too distant
      VORTICES.splice(n,1);
    }
  }

  // Display Background Field
  if(showBackground){
    stroke(252, 184, 11)
    strokeWeight(1)
    for(var x=0; x<width; x+=20){
      for(var y=0; y<height; y+=20){
        var V = getVelocityField(x,y,VORTICES)
        var Vnorm = sqrt(sq(V[0])+sq(V[1]))
        line(x,y,x+5*V[0]/Vnorm,y+5*V[1]/Vnorm)
      }
    }
  }
  // Display Eraser
  if(wMousepress==0){
    stroke(18,20,23);
    noFill();
    strokeWeight(0.5);
    var r = (Sm-SM)/(Wx[0]-Wx[1]);
    ellipse(mouseX,mouseY,2*r,2*r);
  }
  // Display Text
  noStroke();
  fill(18,20,23)
  textSize(16);
  text("Vortices : "+str(VORTICES.length),100,100)
  text("Vorticity: "+str(wMousepress),100,120)
  text("Timestep : "+str(dt),100,140)
}

function timestep(h){
  var VV = []
  for(var n=0; n<VORTICES.length; n++){
    VORTICES[n].setGetspeedCoords(h)
    VORTICES[n].getSpeed(VORTICES)
  }
}

function getVelocityField(X,Y,vortices){
  var x  = map(X,Sm,SM,Wx[0],Wx[1])
  var y  = map(Y,Sm,SM,Wy[0],Wy[1])
  this.vx = 0
  this.vy = 0
  for(var n=0; n<vortices.length;n++){
    var other = vortices[n]
    var dx = x-other.xn
    var dy = y-other.yn
    var Rsq = sq(dx)+sq(dy)
    this.vx +=  other.w*dy/(2*PI*Rsq)
    this.vy += -other.w*dx/(2*PI*Rsq)
  }
  return [this.vx,this.vy]
}



class Vortex{
  constructor(x,y,w){
    this.x  = x
    this.y  = y
    this.x0 = x
    this.y0 = y
    this.vx = 0
    this.vy = 0
    this.w  = w
    if(w==0){
      this.color = color(252, 184, 11)
    }else if(w<0){
      this.color = color(0, 137, 192)
    }else{
      this.color = color(216, 85, 35)
    }

  }

  setGetspeedCoords(dt){
    this.xn = this.x + this.vx*dt;
    this.yn = this.y + this.vy*dt
  }

  isOutside(Wx,Wy){
    return !((this.x>Wx[0])&&(this.x<Wx[1])&&(this.y>Wy[0])&&(this.y<Wy[1]))
  }


  getSpeed(vortices){
    this.vx = 0
    this.vy = 0
    for(var n=0; n<vortices.length;n++){
      var other = vortices[n]
      if(other!=this){
        var dx = this.xn-other.xn
        var dy = this.yn-other.yn
        var Rsq = sq(dx)+sq(dy)
        this.vx +=  other.w*dy/(2*PI*Rsq)
        this.vy += -other.w*dx/(2*PI*Rsq)
      }
    }
    return [this.vx,this.vy]
  }

  logThisPos(){
    this.x0 = this.x
    this.y0 = this.y
  }

  iterate(dt){
    this.x = this.x + this.vx*dt
    this.y = this.y + this.vy*dt
  }

  show(Wx,Wy,Sm,SM){
    var X0 = map(this.x0,Wx[0],Wx[1],Sm,SM)
    var Y0 = map(this.y0,Wy[0],Wy[1],Sm,SM)
    var X  = map(this.x,Wx[0],Wx[1],Sm,SM)
    var Y  = map(this.y,Wy[0],Wy[1],Sm,SM)
    buffer.stroke(this.color)
    buffer.line(X0,Y0,X,Y)
    noStroke()
    fill(this.color)
    ellipse(X,Y,2+2*abs(this.w),2+2*abs(this.w))
  }
}



// =============================================================================

function mousePressed(){
  var xx  = map(mouseX,Sm,SM,Wx[0],Wx[1]);
  var yy  = map(mouseY,Sm,SM,Wy[0],Wy[1]);
  if(wMousepress==0){
    for(var n=VORTICES.length-1; n>=0; n--){ // backward traverse list
      var dSQ = sq(xx-VORTICES[n].x)+sq(yy-VORTICES[n].y);
      if(dSQ<1){ // remove if inside eraser
        VORTICES.splice(n,1);
      }
    }
  }else{
    var vortex = new Vortex(xx,yy,wMousepress)
    VORTICES.push(vortex)
    vortex.show(Wx,Wy,Sm,SM)
  }
}

function mouseDragged(){
}


function keyPressed(){
  if(keyCode==32){
    if(timeOn){
      timeOn = false;
      noLoop()
    }else{
      timeOn = true;
      loop()
    }
  }
  if(keyCode==39){ //RIGHT
    vIndex += 1;
    vIndex = (vIndex+vorticities.length)%vorticities.length;
    wMousepress = vorticities[vIndex];
  }
  if(keyCode==37){ // LEFT
    vIndex -= 1;
    vIndex = (vIndex+vorticities.length)%vorticities.length;
    wMousepress = vorticities[vIndex];
  }
  if(keyCode==38){ // UP
    dt *= 1.5;
  }
  if(keyCode==40){ // DOWN
    dt /= 1.5;
  }
  if(keyCode==84){ // T
    showBackground = !showBackground;
  }

  print(keyCode)
  return false
}
