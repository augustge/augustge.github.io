


var PI    = 3.141592653589

var t  = 0;
var dt = 1;
var numC = 10;
var maxnum = 500;
var Ps = [];
var CIRCS = [[0,0]];
var PPs = [];

var timeslider, circleSlider;


function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  buffer = createGraphics(windowWidth, windowHeight);
  timeslider = createSlider(0, 10, dt, 0.01);
  timeslider.position(100,20);
  circleSlider = createSlider(1, 100, numC, 1);
  circleSlider.position(100,40);
}

function draw(){
  t += timeslider.value();
  noFill();
  image(buffer, 0, 0);

  strokeWeight(2); stroke(166, 121, 81);
  drawLine(Ps,x0=width/2,y0=height/2);

  strokeWeight(2);
  buffer.background(251,239,216,20)
  buffer.noFill();
  buffer.stroke(255, 68, 13);
  buffer.beginShape()
  for(var i=0; i<PPs.length; i++){
    vertex(PPs[i][0],PPs[i][1]);
  }
  buffer.endShape()

  fill(191, 179, 189); noStroke();
  ellipse(width/2,height/2,10,10);
  strokeWeight(0.5); stroke(191, 179, 189);
  drawCircles(int(t)%Ps.length,circleSlider.value());
  drawCirclesCascade(int(t)%Ps.length,circleSlider.value());

  fill(0); noStroke();
  textAlign(RIGHT)
  text("Timestep: "+str(timeslider.value()),80,25)
  text("Circles: "+str(circleSlider.value()),80,45)

}

function drawLine(P,x0=0,y0=0){
  beginShape()
  for(var i=0; i<P.length; i++){
    vertex(P[i][0]+x0,P[i][1]+y0)
  }
  endShape()
}


function drawCircles(n,num,sw1=0.5,sw2=2){
  var R = [width/2,height/2];
  var N = Ps.length;
  for(var i=0; i<min(num,CIRCS.length); i++){
    var r = CIRCS[i][0]/N
    var a = CIRCS[i][1]
    var f = 2*PI*CIRCS[i][2]*n/N;
    Rn = [ R[0]+r*cos(f+a), R[1]+r*sin(f+a) ]

    fill(191, 179, 189,10); strokeWeight(sw1);
    ellipse(R[0],R[1],2*r,2*r)
    noFill();
    strokeWeight(sw2)
    line(R[0],R[1],Rn[0],Rn[1])
    R[0] = Rn[0];
    R[1] = Rn[1];
  }
  PPs.push([R[0],R[1]]);
  if(PPs.length>Ps.length){PPs.shift()}
}

function drawCirclesCascade(n,num,sw1=0.5,sw2=0.5,scale=0.4){
  var R = 60;
  var N = Ps.length;
  for(var i=0; i<min(num,CIRCS.length); i++){
    var r = CIRCS[i][0]/N * scale
    var a = CIRCS[i][1]
    var f = 2*PI*CIRCS[i][2]*n/N;
    var Rn = [ r*cos(f+a), r*sin(f+a) ]
    R += r;
    fill(191, 179, 189,10); strokeWeight(sw1);
    ellipse(60,R,2*r,2*r)
    noFill();
    strokeWeight(sw2)
    line(60,R,60+Rn[0],R+Rn[1])
    R += r;
  }
}


function getCircles(){
  var res = fft_Circles(Ps);
  res.sort(([c1], [c2]) => c2 - c1)
  return res;
}


// ==================================================
function fft(xn){
  var N = xn.length;
  var Xk = [];
  for( var k=0; k<N; k++){Xk.push([0,0]);} // initialize Xk
  for( var k=0; k<N; k++){
    for( var n=0; n<N; n++){
      var wn = 2*PI*k*n/N;
      var Snk = sin(wn)
      var Cnk = cos(wn)
      Xk[k][0] += xn[n][0]*Cnk - xn[n][1]*Snk;
      Xk[k][1] += xn[n][0]*Snk + xn[n][1]*Cnk;
    }
  }
  return Xk
}

function ifft(Xk){
  var N = Xk.length;
  var xn = [];
  for( var k=0; k<N; k++){xn.push([0,0]);} // initialize Xk
  for( var k=0; k<N; k++){
    for( var n=0; n<N; n++){
      var wn = -2*PI*k*n/N;
      var Snk = sin(wn)
      var Cnk = cos(wn)
      xn[k][0] += Xk[n][0]*Cnk - Xk[n][1]*Snk;
      xn[k][1] += Xk[n][0]*Snk + Xk[n][1]*Cnk;
    }
  }
  return Xk
}
// ==================================================

function fft_Circles(xn){
  var N = xn.length;
  var Xk = [];
  var res = []; // indices & radii & angles
  for( var k=0; k<N; k++){Xk.push([0,0]);} // initialize Xk
  for( var k=0; k<N; k++){
    for( var n=0; n<N; n++){
      var wn = 2*PI*k*n/N;
      var Snk = sin(wn)
      var Cnk = cos(wn)
      Xk[k][0] += xn[n][0]*Cnk - xn[n][1]*Snk;
      Xk[k][1] += xn[n][0]*Snk + xn[n][1]*Cnk;
    }
    res.push( [sqrt(sq(Xk[k][1])+sq(Xk[k][0])), atan2(Xk[k][1],Xk[k][0]), k] );
  }
  return res
}
// ==================================================



function mouseDragged(){
  if( mouseY>80){
    Ps.push([mouseX-width/2,mouseY-height/2])
    if(Ps.length>maxnum){Ps.shift()}
    CIRCS = getCircles();
  }
}

function keyPressed(){
  if(keyCode==32){ // SPACE
    Ps = [];
    CIRCS = [[0,0]];
    PPs = [];
  }

  if(keyCode==13){ // ENTER
    PPs = [];
  }
}
