
var s0    = -150;
// var theta = 20;
// var scaleReduction = 0.5;

var fractal = "Tree";
var SLIDERS = [];
var SLIDERTEXTS = [];

var treeSLIDERS = [];
var treeSLIDERTEXTS = [];
var squareSLIDERS = [];
var squareSLIDERTEXTS = [];
var sierpinskiSLIDERS = [];
var sierpinskiSLIDERTEXTS = [];
var kochSLIDERS = [];
var kochSLIDERTEXTS = [];

var theta,scaleReduction,interations,showFractal,fillcolor,size;

function setup() {
  createCanvas(windowWidth, windowHeight);

  fractalSelector = createSelect();

  // linear fractal tree
  fractalSelector.option("Tree");

  treeSLIDERTEXTS.push("Scale factor");
  treeSLIDERS.push(createSlider(0, 1, 0.618, 0.001).hide());

  treeSLIDERTEXTS.push("Separation angle");
  treeSLIDERS.push(createSlider(0, 360, 120, 0.01).hide());

  treeSLIDERTEXTS.push("Iterations");
  treeSLIDERS.push(createSlider(1, 15, 10, 1).hide());

  treeSLIDERTEXTS.push("Size");
  treeSLIDERS.push(createSlider(200, 1000, 10, 1).hide());


  // square factal
  fractalSelector.option("Square corners");

  squareSLIDERTEXTS.push("Scale factor");
  squareSLIDERS.push(createSlider(0, 1, 0.618, 0.001).hide());

  squareSLIDERTEXTS.push("Iterations");
  squareSLIDERS.push(createSlider(0, 9, 5, 1).hide());


  // Sierpinski
  fractalSelector.option("Sierpinski");

  sierpinskiSLIDERTEXTS.push("Iterations");
  sierpinskiSLIDERS.push(createSlider(1, 6, 3, 1).hide());

  sierpinskiSLIDERTEXTS.push("Initial size");
  sierpinskiSLIDERS.push(createSlider(100, 1000, 600, 10).hide());

  // Koch
  fractalSelector.option("Koch snowflake");

  kochSLIDERTEXTS.push("Iterations");
  kochSLIDERS.push(createSlider(0, 10, 2, 1).hide());

  kochSLIDERTEXTS.push("Initial size");
  kochSLIDERS.push(createSlider(100, 1000, 500, 10).hide());

  kochSLIDERTEXTS.push("Initial rotation");
  kochSLIDERS.push(createSlider(-180, 180, 0, 0.001).hide());

  kochSLIDERTEXTS.push("Fill color");
  kochSLIDERS.push(createSlider(0, 255, 0, 1).hide());

  kochSLIDERTEXTS.push("Line width");
  kochSLIDERS.push(createSlider(0, 5, 0.1, 0.001).hide());

  //
  SLIDERS     = treeSLIDERS;
  SLIDERTEXTS = treeSLIDERTEXTS;
  fractalSelector.changed(fractalChoice);
}

function draw() {
  background(255);

  if(fractal=="Tree"){
    SLIDERS         = treeSLIDERS;
    SLIDERTEXTS     = treeSLIDERTEXTS;
    scaleReduction  = treeSLIDERS[0].value();
    theta           = treeSLIDERS[1].value() * PI/180;
    iterations      = treeSLIDERS[2].value();
    s0              =-treeSLIDERS[3].value();
    strokeWeight(20);
    noFill();
    stroke(0);
    translate(width/2,3*height/4);
    drawBranch(iterations);
  }else if(fractal=="Square corners"){
    SLIDERS         = squareSLIDERS;
    SLIDERTEXTS     = squareSLIDERTEXTS;
    scaleReduction  = squareSLIDERS[0].value();
    iterations      = squareSLIDERS[1].value();
    fill(0);
    noStroke();
    translate(width/2,height/2);
    drawSquare(iterations);
  }else if(fractal=="Sierpinski"){
    SLIDERS     = sierpinskiSLIDERS;
    SLIDERTEXTS = sierpinskiSLIDERTEXTS;
    iterations  = sierpinskiSLIDERS[0].value();
    initialSize = sierpinskiSLIDERS[1].value();
    scaleReduction = 0.3333;
    translate(width/2,height/2);
    drawSierpinski(initialSize,iterations);
  }else if(fractal=="Koch snowflake"){
    SLIDERS     = kochSLIDERS;
    SLIDERTEXTS = kochSLIDERTEXTS;
    iterations       = kochSLIDERS[0].value();
    initialSize      = kochSLIDERS[1].value();
    var initialAngle = kochSLIDERS[2].value()*PI/180;
    fillcolor        = kochSLIDERS[3].value();
    var lineWidth    = kochSLIDERS[4].value();
    scaleReduction = 0.333;
    translate(width/2,height/2);
    noFill();
    stroke(0);
    strokeWeight(lineWidth);
    drawKoch(initialSize,iterations,initialAngle);
  }

  drawControlpanel();

}


function drawBranch(n){

  line(0,0,0,s0);
  translate(0,s0);

  if(n>0){
    push()
    rotate(-theta/2.);
    scale(scaleReduction,scaleReduction);
    drawBranch(n-1);
    pop();

    push();
    rotate(theta/2.);
    scale(scaleReduction,scaleReduction);
    drawBranch(n-1);
    pop();
  }
}

function drawSquare(n){

  rect(-s0/2.,-s0/2.,s0,s0);

  if(n>0){
    push()
    translate(s0/2.,s0/2.);
    scale(scaleReduction,scaleReduction);
    translate(s0/2.,s0/2.);
    drawSquare(n-1);
    pop();

    push()
    translate(s0/2.,-s0/2.);
    scale(scaleReduction,scaleReduction);
    translate(s0/2.,-s0/2.);
    drawSquare(n-1);
    pop();

    push()
    translate(-s0/2.,-s0/2.);
    scale(scaleReduction,scaleReduction);
    translate(-s0/2.,-s0/2.);
    drawSquare(n-1);
    pop();

    push()
    translate(-s0/2.,s0/2.);
    scale(scaleReduction,scaleReduction);
    translate(-s0/2.,s0/2.);
    drawSquare(n-1);
    pop();

  }
}


function drawSierpinski(size0,n){
  fill(0)
  rect(-size0/2.,-size0/2.,size0,size0);

  fill(255);
  sierpinskiIterate(scaleReduction*size0,n);
}

function sierpinskiIterate(size0,n){

  rect(-size0/2.,-size0/2.,size0,size0);

  if(n>0){
    for(var k=-1; k<=1; k++){
      for(var m=-1; m<=1; m++){
        push();
        translate(k*size0,m*size0);
        sierpinskiIterate(scaleReduction*size0,n-1);
        pop();
      }
    }
  }
}

function drawKoch(size0,n,t0){
  var sx = -1/2.*size0  ;
  var sy = size0/sqrt(6);
  fill(fillcolor);

  beginShape();

  vertex(sx,sy);

  kochIterate(scaleReduction*size0,n,sx,sy,t0);
  sx += size0*cos(t0);
  sy += size0*sin(t0);
  kochIterate(scaleReduction*size0,n,sx,sy,t0-2*PI/3);
  sx += size0*cos(t0-2*PI/3);
  sy += size0*sin(t0-2*PI/3);
  kochIterate(scaleReduction*size0,n,sx,sy,t0-4*PI/3);
  // sx += size0*cos(4*PI/3);
  // sy += size0*sin(4*PI/3);
  // vertex(s);
  endShape(CLOSE);
}

function kochIterate(size0,n,sx,sy,t){
  var angle = PI/3;//kochSLIDERS[0].value();
  if(n>0){
    kochIterate(scaleReduction*size0,n-1,sx,sy,t);
    var SX = sx+size0*cos(t);
    var SY = sy+size0*sin(t);
    kochIterate(scaleReduction*size0,n-1,SX,SY,t+PI/3);
    SX += size0*cos(t+angle);
    SY += size0*sin(t+angle);
    kochIterate(scaleReduction*size0,n-1,SX,SY,t-PI/3);
    SX += size0*cos(t-angle);
    SY += size0*sin(t-angle);
    kochIterate(scaleReduction*size0,n-1,SX,SY,t);
  }else{
    vertex(sx,sy);
    vertex(sx+size0*cos(t),sy+size0*sin(t));
  }
}


function drawControlpanel(){
  resetMatrix();
  fill(0);
  noStroke();

  text("DISPLAY FRACTAL",20,25);
  fractalSelector.position(140,20);

  var separation = 40;
  var ypos = 80;
  var textSep = 10;

  for(var i=0; i<SLIDERS.length; i++){
    SLIDERS[i].show();
    text(SLIDERTEXTS[i] + ": "+str(SLIDERS[i].value()),20,ypos+separation*i-textSep);
    SLIDERS[i].position(40,ypos+separation*i);
  }


}


function fractalChoice(){
  fractal = this.value();

  for( var i=0; i<SLIDERS.length; i++){
    SLIDERS[i].hide();
  }

}






//
