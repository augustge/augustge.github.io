


var figure;
var maxA = 4;
var x0   = 0.1;
var numX = 200;
var numA = 500;
var iterate = true;

var SLIDERTEXTS = [];
var SLIDERS     = [];
var C,buffer,bufferpoints;

function setup(){
  C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  buffer = createGraphics(windowWidth, windowHeight/2);
  bufferpoints = new Bufferpoints(numX,numA)

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

  figure = new Figure(0,width,height/2,height,1.0);
  figure.fillWithRandomLines(10);
  figure.update();
  makeSliders();

  buffer.background(255);
}



function draw(){
  background(c8);
  adjustToSlidervalues();

  // buffer.ellipse(mouseX,mouseY,10,10)
  if(iterate){
    bufferpoints.iterate();
    bufferpoints.refreshDisplay();
  }
  strokeWeight(3);
  stroke(c3);
  var A0 = map(figure.A,0,maxA,0,buffer.width)
  line(A0,height/2,A0,height);

  //translate(0,height);
  //scale(1,-1);

  figure.show();

  resetMatrix();

  C.blendMode(MULTIPLY)
  image(buffer, 0,height/2);
  C.blendMode(BLEND)
}


function Figure(xm,xM,ym,yM,A){
  this.xm = xm;
  this.xM = xM;
  this.ym = ym;
  this.yM = yM;
  this.A  = A;

  this.x0         = 0.5;
  this.iterations = 50;

  this.Ps    = []; //initial points of lines
  this.LINES = [];

}

Figure.prototype.newLine = function(){
  this.line = new Line(this.x0);
}

Figure.prototype.iterateLine = function(N){
  for(var j=0; j<N; j++){
    this.line.iterate();
  }
}

Figure.prototype.update = function(){
  this.Xm = 0;//2/PI*atan(20*this.A)-1;
  this.XM = 1;
  this.Ym = 0;
  this.YM = -this.A/4.-0.1;
  this.updateLine();
  this.updateAllLines();
}

Figure.prototype.updateLine = function(){
  this.newLine();
  this.iterateLine(this.iterations);
}

Figure.prototype.getX = function(x){
  return map(x,this.Xm,this.XM,this.xm,this.xM);
}

Figure.prototype.getY = function(y){
  return map(y,this.Ym,this.YM,this.ym,this.yM);
}

Figure.prototype.show = function(){
  this.drawPlot(1000);
  this.showAllLines(0.5,c10);
  this.line.show(2,c13);
}

Figure.prototype.fillWithRandomLines = function(N){
  this.LINES = [];
  this.Ps    = [];
  for(var i=0; i<N; i++){
    var p = random(this.Xm,this.XM);
    this.Ps.push(p);
    var line = new Line(p);
    for(var j=0; j<this.iterations; j++){
      line.iterate();
    }
    this.LINES.push( line );
  }
}

Figure.prototype.updateAllLines = function(){
  var newLINES = [];
  for(var i=0; i<this.LINES.length; i++){
    var line = new Line(this.Ps[i]);
    var newLine = new Line(line.x0);
    for(var j=0; j<this.iterations; j++){
      newLine.iterate();
    }
    newLINES.push( newLine );
  }
  this.LINES = newLINES;
}

Figure.prototype.showAllLines = function(w,c){
  for(var k=0; k<this.LINES.length; k++){
    this.LINES[k].show(w,c);
  }
}

Figure.prototype.drawPlot = function(N){
  strokeWeight(2);
  noFill();

  // axes
  stroke(c7);
  var x0 = this.getX(0);
  var y0 = this.getY(0);
  beginShape();
  vertex(x0,this.ym);
  vertex(x0,this.yM);
  endShape();
  beginShape();
  vertex(this.xm,y0);
  vertex(this.xM,y0);
  endShape();

  // plot
  stroke(c1);
  beginShape();
  for(var i=0; i<N; i++){
    var X = map(i,0,N,this.Xm,this.XM);
    var Y = f(X,this.A);
    if(Y>0){
      var x = this.getX(X);
      var y = this.getY(Y);
      vertex(x,y);
    }
  }
  endShape();

  // straight line
  stroke(c2);
  beginShape();
  for(var i=0; i<N; i++){
    var X = map(i,0,N,this.Xm,this.XM); // map to x-val
    var x = this.getX(X); // map to pixels
    var y = this.getY(X); // map to pixels
    vertex(x,y);
  }
  endShape();
}


function Line(x0){
  this.X   = [x0];
  this.xp  = x0;
  this.x0  = x0;
}

Line.prototype.iterate = function(){
  this.xp = f(this.xp,figure.A);
  this.X.push(this.xp);
}

Line.prototype.show = function(w,col){
  noFill();
  strokeWeight(w);
  stroke(col);
  beginShape();
  // first line
  var x  = figure.getX(this.X[0]);
  var y  = figure.getY(0);
  vertex(x,y);
  // continued
  for(var i=0; i<this.X.length; i++){
    var X   = this.X[i];
    var Y   = f(this.X[i],figure.A);
    var y   = figure.getY(Y);
    var x   = figure.getX(X);
    var xofy= figure.getX(Y);
    vertex(x,y);
    vertex(xofy,y);
  }
  endShape();
}


function f(x,A){
  return A*x*(1.0-x);
}

// ============================================================
class Bufferpoints{
  constructor(nx,na){
    this.nx = nx
    this.na = na
    this.makePoints()
  }

  makePoints(){
    this.Ai = []
    this.P = []
    for(var i=0; i<this.na; i++){
      this.Ai.push(maxA*i/this.na);
      var PP = [];
      for(var j=0; j<this.nx; j++){ PP.push(random()); }
      this.P.push(PP)
    }
  }

  iterate(){
    for(var i=0; i<this.na; i++){
      for(var j=0; j<this.nx; j++){
        this.P[i][j] = this.Ai[i]*this.P[i][j]*(1-this.P[i][j]);
      }
    }
  }

  refreshDisplay(){
    buffer.strokeWeight(2);
    buffer.stroke(c1,10);
    buffer.background(255);
    for(var i=0; i<this.na; i++){
      for(var j=0; j<this.nx; j++){
        var xj = this.P[i][j]
        var ai = this.Ai[i]
        var xJ = map(xj,0,1,buffer.height,0)
        var aI = map(ai,0,maxA,0,buffer.width)
        buffer.point(aI,xJ)
      }
    }
  }

}



// ============================================================

function makeSliders(){
  SLIDERTEXTS.push("Slope:");
  var mother = createDiv("Slope")
  mother.parent("control-holder")
  var slider = createSlider(0, maxA, 1.0, 0.01)
  slider.attribute("value",slider.value());
  slider.attribute("style","width:50%;");
  slider.parent(mother)
  SLIDERS.push( slider );
}

function adjustToSlidervalues(){
  figure.A = SLIDERS[0].value();
  figure.update();
  // figure.iterateLine(figure.iterations);
}


// ============================================================

function mousePressed(){
  if(mouseX>figure.xm && mouseX<figure.xM){
    figure.x0 = map(mouseX,figure.xm,figure.xM,figure.Xm,figure.XM);
    figure.update();
    // figure.iterateLine(figure.iterations);
  }
}

function mouseDragged(){
  if(mouseX>figure.xm && mouseX<figure.xM){
    figure.x0 = map(mouseX,figure.xm,figure.xM,figure.Xm,figure.XM);
    figure.update();
    // figure.iterateLine(figure.iterations);
  }
}

function keyPressed(){
  if(keyCode==13){ // enter
    bufferpoints.makePoints();
  }
  if(keyCode==32){ // space
    iterate = !iterate;
  }
  if(keyCode==37){ //left
    figure.x0 -= 0.05;
  }

  if(keyCode==39){ //right
    figure.x0 += 0.05;
  }
}






//
