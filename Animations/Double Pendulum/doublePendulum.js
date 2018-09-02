

var PI    = 3.141592653589
var dt    = 0.001;
var sPX   = 100;
var l     = 1;
var t10   = 0.3;
var t20   = 0;
var dt10  = 0;
var dt20  = 0;
var m     = 10;
var g     = 9.81;
var Nitr  = 20;

var toggle = [false,false];

var play = true;


var pendulum;

function setup(){
  createCanvas(windowWidth, windowHeight);
  buffer = createGraphics(windowWidth, windowHeight);


  pendulum = new Pendulum(width/2,height/3,t10,t20,m)
  pendulum.initiate(dt10,dt20)

  defineColors();

  buffer.background(c1)
}

function draw(){
  // if(mode=="pretty"){ background(c12); }


  image(buffer, 0, 0);
  // buffer.blendMode(MULTIPLY)
  buffer.blendMode(ADD)
  pendulum.do(Nitr,0.0001,true);

  infopanel()

}

function Pendulum(cx,cy,t10,t20,m){
  this.cx     = cx;
  this.cy     = cy;
  this.t1     = t10;
  this.t2     = t20;
  this.m      = m;
}

Pendulum.prototype.phaseSpaceVel = function(v){
  var deltaT = (v[0]-v[1])*180/PI    ;
  var fak = 6./(this.m*sq(l)) / (16.-9*sq(cos(deltaT)))     ;
  var dummy1 = -0.5*this.m*sq(l)
  var v0 = fak*(2.*v[2]-3.*cos(deltaT)*v[3]);
  var v1 = fak*(8.*v[3]-3.*cos(deltaT)*v[2]);
  var v2 = dummy1*( v0*v1*sin(deltaT)+(3.*g/l)*sin(v[0]*180/PI) )
  var v3 = dummy1*( -v0*v1*sin(deltaT)+(g/l)*sin(v[1]*180/PI) )
  return [v0,v1,v2,v3]
}


Pendulum.prototype.initiate = function(dt10,dt20){
  var deltaT = (this.t1-this.t2)*180/PI    ;
  this.pt1 = this.m*sq(l)/6. * ( 8*dt10+3*dt20*cos(deltaT) ) ;
  this.pt2 = this.m*sq(l)/6. * ( 2*dt20+3*dt10*cos(deltaT) ) ;
}

Pendulum.prototype.move = function(dt){
  var Vd = this.phaseSpaceVel([this.t1,this.t2,this.pt1,this.pt2])

  var t1d  = this.t1  + Vd[0]*0.5*dt ;
  var t2d  = this.t2  + Vd[1]*0.5*dt ;
  var pt1d = this.pt1 + Vd[2]*0.5*dt ;
  var pt2d = this.pt2 + Vd[3]*0.5*dt ;

  var V = this.phaseSpaceVel([t1d,t2d,pt1d,pt2d])

  this.t1 = this.t1 + V[0]*dt ;
  this.t2 = this.t2 + V[1]*dt ;
  this.pt1 = this.pt1 + V[2]*dt ;
  this.pt2 = this.pt2 + V[3]*dt ;
}

Pendulum.prototype.do = function(Nitr,dt,addToBuffer){
    if(play){
      this.obtainPoints()
      var pX2 = this.X2
      var pY2 = this.Y2
      for(var j=0; j<Nitr; j++){
        this.obtainPoints()
        var pX2 = this.X2
        var pY2 = this.Y2
        this.move(dt)
        if(addToBuffer){
          buffer.strokeWeight(2);
          buffer.stroke(5);
          this.obtainPoints()
          buffer.line(pX2,pY2,this.X2,this.Y2)
        }
      }
    }
    this.show();
}


Pendulum.prototype.obtainPoints = function(){
  this.X1 = sPX * l * sin(this.t1*180/PI) + this.cx ;
  this.Y1 = sPX * l * cos(this.t1*180/PI) + this.cy ;
  this.X2 = sPX * l * sin(this.t2*180/PI) + this.X1 ;
  this.Y2 = sPX * l * cos(this.t2*180/PI) + this.Y1 ;
}

Pendulum.prototype.show = function(){
  var X1 = sPX * l * sin(this.t1*180/PI) + this.cx ;
  var Y1 = sPX * l * cos(this.t1*180/PI) + this.cy ;
  var X2 = sPX * l * sin(this.t2*180/PI) + X1 ;
  var Y2 = sPX * l * cos(this.t2*180/PI) + Y1 ;

  this.X1 = X1
  this.Y1 = Y1
  this.X2 = X2
  this.Y2 = Y2

  noStroke()
  fill(c10)
  if(toggle[0]){
    ellipse(X1,Y1,20,20)
  }else if(toggle[1]){
    ellipse(X2,Y2,20,20)
  }

  strokeWeight(5);
  stroke(c2)
  line( this.cx, this.cy, X1, Y1);
  line( X1, Y1, X2, Y2);


}


// =============================================================================

function infopanel(){
  noStroke()
  fill(c2)
  textSize(14)
  textAlign(CENTER)
  text("DOUBLE PENDULUM",width/2,20)
  textAlign(LEFT)
  fill(c8)
  textSize(12)
  text("Iterations per draw: ",20,20)
  fill(c10)
  text(Nitr,150,20)

  fill(c7)
  text("INSTRUCTIONS: ",20,50)
  textSize(8)
  text("Press P  to play/pause ",  20,60)
  text("Press F  to flush path ",  20,70)
  text("Press S  to stop pendulum",20,80)
  text("Press UP to increase iterations",20,90)
  text("Press DOWN to decrease iterations",20,100)
  text("Press on a joint to select/deselect (in pause)",20,110)
  text("Drag to adjust initial condition",20,120)
}



// =============================================================================

function mousePressed(){
  pendulum.obtainPoints()
  var dx1 = pendulum.X1-mouseX
  var dy1 = pendulum.Y1-mouseY
  var dx2 = pendulum.X2-mouseX
  var dy2 = pendulum.Y2-mouseY
  if(sq(dx1)+sq(dy1)<sq(10)){
    toggle[0] = !toggle[0]
    toggle[1] = false
  }else if(sq(dx2)+sq(dy2)<sq(10)){
    toggle[1] = !toggle[1]
    toggle[0] = false
  }

}

function mouseDragged(){
  if(!play){
    var dmx = mouseX-pmouseX
    var dmy = mouseY-pmouseY

    pendulum.obtainPoints()
    if(toggle[0]){
      var dx = pendulum.cx-mouseX
      var dy = pendulum.cy-mouseY
      var t1 = atan2(-dy, dx) * PI/180. + PI
      pendulum.t1 = t1
      pendulum.initiate(0,0)
    }else if(toggle[1]){
      var dx = pendulum.X1-mouseX
      var dy = pendulum.Y1-mouseY
      var t2 = atan2(-dy, dx) * PI/180. + PI
      pendulum.t2 = t2
      pendulum.initiate(0,0)
    }



  }
}


function keyPressed(){
  print(keyCode)
  if(keyCode==80){ // P
    play = !play;
  }
  if(keyCode==70){ // F
    buffer.blendMode(NORMAL)
    buffer.background(c1)
  }
  if(keyCode==83){ // S
    pendulum.initiate(0,0)
  }
  if(keyCode==73){ // I

  }
  if(keyCode==32){ // SPACE

  }
  if(keyCode==38){ // UP
    if(Nitr<300){ Nitr+=5;}
   }
  if(keyCode==40){ // DOWN
    if(Nitr>10){ Nitr-=5;}
  }

  if(!play){
    toggle[0] = false
    toggle[1] = false
  }
}







function defineColors(){
  c1 = color("#2F343B");
  c2 = color("#A6793D");
  c3 = color("#FF950B");
  c4 = color("#C77966");
  c5 = color("#E3CDA4");
  c6 = color("#703030");
  c7 = color("#7E827A");
  c8 = color("#F7EFF6");
  c9 = color("#C4C4BD");
  c10= color("#56BED7");
  c11= color("#D43215");
  c12= color("#453B3D");
  c13= color("#FF0000");
  c14= color("#FF950B");
  // c1 = color("rgb(47, 52, 59)");
  // c2 = color("rgb(166, 121, 61)");
  // c3 = color("rgb(255, 149, 11)");
  // c4 = color("rgb(199, 121, 102)");
  // c5 = color("rgb(227, 205, 164)");
  // c6 = color("rgb(112, 48, 48)");
  // c7 = color("rgb(126, 130, 122)");
  // c8 = color("rgb(247, 239, 246)");
  // c9 = color("rgb(196, 196, 189)");
  // c10= color("rgb(86, 190, 215)");
  // c11= color("rgb(212, 50, 21)");
  // c12= color("rgb(69, 59, 61)");
  // c13= color("rgb(255, 0, 0)");
  // c14= color("rgb(255, 149, 11)");
}
