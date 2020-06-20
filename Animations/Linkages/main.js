
var t = 0;
var play = false;
var POINTS;
var isPressed = false;
var mouseDist = 10;
var piDrag = 0;

function setup() {
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  buffer = createGraphics(windowWidth, windowHeight);

  POINTS = [];
  var p1 = new Point(width/2,height/2,true)
  POINTS.push( p1);
  // POINTS.push( p2 );

}


function draw() {
  t += 1;

  background(255)
  image(buffer, 0, 0);
  if(play){
    fill(255,0,0);
  }else{
    fill(0,0,0);
  }
  rect(0,0,10,10)

  var p = POINTS[piDrag];
  var dX = mouseX-p.r[0]
  var dY = mouseY-p.r[1]
  var dL = sqrt(sq(dX)+sq(dY));
  p.F = [dX,dY]
  for(var i=0; i<POINTS.length; i++){
    POINTS[i].updatePosition()
  }
  for(var n=0; n<10; n++){
    for(var i=0; i<POINTS.length; i++){
      POINTS[i].do(0.05)
    }
  }
  for(var i=0; i<POINTS.length; i++){
    POINTS[i].display()
  }

  interactionVisuals();
}

function proj(A,B){
  var BSQ = sq(B[0])+sq(B[1]);
  var dot = A[0]*B[0] + A[1]*B[1];
  return [B[0]*dot/BSQ,B[1]*dot/BSQ]
}

function interactionVisuals(){
  if(isPressed!=false){
    noStroke()
    fill(0,255,0);
    if(isPressed.fixed){
      rect(isPressed.r[0]-5,isPressed.r[1]-5,10,10);
    }else{
      ellipse(isPressed.r[0],isPressed.r[1],10,10);
    }
    strokeWeight(5)
    stroke(0,255,0)
    line(isPressed.r[0],isPressed.r[1],mouseX,mouseY)
  }
  var pD = POINTS[piDrag];
  fill(0,0,255,50);
  ellipse(pD.r[0],pD.r[1],20,20);

}


class Point{
  constructor(x,y,fixed){
    this.is_set = false;
    this.rods = [];
    this.r  = [x,y];
    this.r0 = [x,y];
    this.v  = [0,0];
    this.F  = [0,0];
    this.fixed = fixed;
  }

  placeRod(other){
    var L = sqrt(sq(this.r[0]-other.r[0])+sq(this.r[1]-other.r[1]));
    this.rods.push([other,L]);
    other.rods.push([this,L]);
    return this
  }

  getFeedback(FP){
    this.is_set ++;
    if(this.fixed){
      return [-FP[0],-FP[1]];
    }else{
      this.F[0] += FP[0];
      this.F[1] += FP[1];
      var FB = [0,0]
      var num = this.rods.length;
      for(var i=0; i<num; i++){
        var is     = this.rods[i][1];
        var other = this.rods[i][0];
        if(other.is_set < 1){
          var dX  = this.r[0]-other.r[0];
          var dY  = this.r[1]-other.r[1];
          var FP  = proj(this.F,[dX,dY]); // make sure dr point in direction of F
          var FBi = other.getFeedback(FP);
          FB[0] += FBi[0];
          FB[1] += FBi[1];
        }
      }
      this.F[0] -= FB[0];
      this.F[1] -= FB[1];
      return [0,0];
    }
  }

  setForce(F0){
    this.F[0] += F0[0];
    this.F[1] += F0[1];
    this.is_set ++;
    var num = this.rods.length;
    var div = 1//num;//num>1? num-1 : 1;
    for(var i=0; i<num; i++){
      var L     = this.rods[i][1];
      var other = this.rods[i][0];
      if(other.is_set<1){
        var dX  = this.r[0]-other.r[0];
        var dY  = this.r[1]-other.r[1];
        var FP  = proj(this.F,[dX,dY]); // make sure dr point in direction of F
        var FBi = other.getFeedback([FP[0]/div,FP[1]/div]);
        this.F[0] += FBi[0];
        this.F[1] += FBi[1];
      }
    }
  }

  getForces(){
    var num = this.rods.length;
    for(var i=0; i<num; i++){
      var L     = this.rods[i][1];
      var other = this.rods[i][0];
      var dX  = this.r[0]-other.r[0];
      var dY  = this.r[1]-other.r[1];
      var dL  = sqrt(sq(dX)+sq(dY));
      this.F[0] += 10*(L-dL)*dX/dL
      this.F[1] += 10*(L-dL)*dY/dL
    }
  }

  getF(){
    var Fx = 0;
    var Fy = 0;
    var num = this.rods.length;
    for(var i=0; i<num; i++){
      var L     = this.rods[i][1];
      var other = this.rods[i][0];
      var dX  = this.r[0]-other.r[0];
      var dY  = this.r[1]-other.r[1];
      var dL  = sqrt(sq(dX)+sq(dY));
      Fx += 30*(L-dL)*dX/dL
      Fy += 30*(L-dL)*dY/dL
    }
    return [this.F[0]+Fx,this.F[1]+Fy]
  }

  updatePosition(){
    this.r0 = [this.r[0],this.r[1]];
  }

  do(dt){
    if(play && !this.fixed){
      var F = this.getF();
      this.v[0] += F[0]*dt;
      this.v[1] += F[1]*dt;
      this.r[0] += this.v[0]*dt;
      this.r[1] += this.v[1]*dt;
      this.v[0] /= 1.1;
      this.v[1] /= 1.1;
    }
    this.F = [0,0];
    this.is_set = 0;
  }

  display(){
    noStroke();
    var mR = [mouseX,mouseY];
    var dist = sqrt(sq(this.r[0]-mR[0])+sq(this.r[1]-mR[1]))
    if(dist<mouseDist){
      fill(0,255,0);
    }else{
      fill(0);
    }
    if(this.fixed){
      rect(this.r[0]-5,this.r[1]-5,10,10);
    }else{
      ellipse(this.r[0],this.r[1],10,10);
    }
    buffer.stroke(255,0,0)
    buffer.line(this.r0[0],this.r0[1],this.r[0],this.r[1])

    for(var i=0; i<this.rods.length; i++){
      var other = this.rods[i][0]
      strokeWeight(5)
      stroke(0)
      line(this.r[0],this.r[1],other.r[0],other.r[1])

    }

    strokeWeight(1)
    noFill()
    stroke(255,0,0)
    line(this.r[0],this.r[1],this.r[0]+this.F[0],this.r[1]+this.F[1])

  }
}


function mousePressed(){
  var mR = [mouseX,mouseY];
  isPressed = false;
  for(var i=0; i<POINTS.length; i++){
    var p = POINTS[i];
    var dist = sqrt(sq(p.r[0]-mR[0])+sq(p.r[1]-mR[1]))
    if(dist<mouseDist){
      isPressed = p;
      buffer.background(255)
    }
  }
  if(isPressed==false){ // not on any points
    piDrag = (piDrag+1)%POINTS.length;
  }
}

function mouseReleased(){
  var mR = [mouseX,mouseY];
  if(isPressed!=false){
    for(var i=0; i<POINTS.length; i++){
      var p = POINTS[i];
      var dist = sqrt(sq(p.r[0]-mR[0])+sq(p.r[1]-mR[1]))
      if(dist<mouseDist){
        if(p!=isPressed){
          isPressed.placeRod(p);
        }else{
          isPressed.fixed = !isPressed.fixed;
        }
        isPressed = false;
      }
    }
    if(isPressed!=false){ // not on existing point
      p = new Point(mR[0],mR[1],false);
      POINTS.push(p);
      isPressed.placeRod(p);
      isPressed = false;
    }
  }
}


function keyPressed(){
  print(keyCode)
  if(keyCode==32){
    play = !play;
  }
}
