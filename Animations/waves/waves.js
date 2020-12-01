
var dt = 0.1;
var g = 20;
var t = 0;
var P;

var BALLS = [];
var B;

function setup(){
  var C = createCanvas(window.innerWidth, window.innerHeight);
  C.parent("sketch-holder");

  P = new Person(width/2);
}

function draw(){
  background(255);

  t++;
  noStroke();
  fill(0);
  rect(0,height/2,width,height/2);

  P.display();
  for(var i=0; i<BALLS.length; i++){
    BALLS[i].move();
    BALLS[i].display();
  }


  if(keyIsPressed){
    keyIsPressedF();
  }

}

//==============================================================================

class Person{
  constructor(x){
    this.x = x;
    this.H = 50;
    this.W = 50;
    this.dx = 1;
    this.dy = 0;
  }

  move(dx){
    if(this.x+dx<width-this.W/2 && this.x+dx>this.W/2){
      this.x = this.x + dx;
    }
  }

  shoot(v){
    BALLS.push(new Ball(this.x,height/2-this.H/2,v*this.dx,v*this.dy));
  }

  display(){
    noStroke();
    fill(255,0,0);
    rect(this.x-this.W/2,height/2-this.H,this.W,this.H)

    this.dx = mouseX - this.x;
    this.dy = mouseY - height/2+this.H/2;
    var L = sqrt(sq(this.dx) + sq(this.dy));
    this.dx = this.dx/L; this.dy = this.dy/L;
    stroke(255,0,0);
    strokeWeight(8);
    line(this.x,height/2-this.H/2,this.x+50*this.dx,height/2-this.H/2+50*this.dy)
    strokeWeight(1);
  }
}

//==============================================================================

class Ball{
  constructor(x,y,vx,vy){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.R = 40;
  }

  move(){
    this.vy += g*dt;
    if(this.y+this.vy*dt > height/2-this.R/4){
      this.vy *= -1;
    }
    this.x  += this.vx*dt;
    this.y  += this.vy*dt;
  }

  display(){
    noStroke();
    fill(0);
    ellipse(this.x,this.y,this.R/2,this.R/2);
  }
}



//==============================================================================


function mousePressed(){
  var dx = mouseX - P.x;
  var dy = mouseY - height/2+P.H/2;
  var L = sqrt(sq(dx) + sq(dy));
  var v = L*0.3;
  P.shoot(v);
}


function keyIsPressedF(){
  if(keyCode==37){ // LEFT
    P.move(-10);
  }
  if(keyCode==39){ // RIGHT
    P.move(10);
  }
  if(keyCode==38){ // UP

  }
  if(keyCode==40){ // DOWN

  }
}
















//
