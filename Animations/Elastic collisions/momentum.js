
var t  = 1;
var dt = 0.01;
var timestepsPerDraw = 20;
var sliderPercent = 0.2;

var ground;
var backgroundColor, groundColor, boxColor, color1, color2;
var statBox   = false;
var chosenBox = false;
var STAT;
var SLIDERS     = [];
var SLIDERTEXTS = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  setColors();

  ground  = new Ground( (1-0.618)*height, groundColor);
  ground.addBox(100.0,   0.0,  1.0,  boxColor);
  ground.addBox(200.0,   0.0,  0.5,  boxColor);
  ground.addBox(500.0,  -2.0,  1.0,  boxColor);

  STAT    = new Statistics(width/2,ground.y+100,width/2-100,300);

  makeSliders();

}




function draw() {
    background(backgroundColor);

    adjustToSlidervalues();

    t += dt;

    ground.show();
    for(var k=0; k<timestepsPerDraw; k++){
      ground.do(dt);
      ground.showContent();
    }

    if(statBox!=false){
      STAT.show();
    }

    resetMatrix();
    showControlpanel();

}





function Ground(yval,color){
  this.y       = yval;
  this.color   = color;
  this.objects = [];
}

Ground.prototype.addBox = function(x,v,m,color){
  var box   = new Box(x,v,m,color);
  statBox = box;
  box.setParameters(this.y);
  this.objects.push( box );
}

Ground.prototype.do = function(dt){
  for(var i=0; i<this.objects.length; i++){
    if(chosenBox!=this.objects[i]){ // chosen box does not move
      this.objects[i].evolve(dt);
      this.objects[i].handleCollisionWithBoundary();
      for(var j=0; j<i; j++){
        if(chosenBox!=this.objects[j]){ // nothing collides with chosen box
          if(abs(this.objects[i].x-this.objects[j].x) < this.objects[i].S+this.objects[j].S){
            this.objects[i].handleCollisionWith(this.objects[j]);
          }
        }
      }
    }
  }
}

Ground.prototype.show = function(){
  noStroke();
  fill(this.color);
  rect(0,this.y,width,height-this.y);
}

Ground.prototype.showContent = function(){
  for(var i=0; i<this.objects.length; i++){
    this.objects[i].show();
  }
}

Ground.prototype.selectClickedBox = function(X,Y){
  var found = false;
  for(var i=0; i<this.objects.length; i++){
    if(abs(X-this.objects[i].x)<this.objects[i].S && abs(Y-this.y+this.objects[i].S)<this.objects[i].S){
      if(chosenBox!=this.objects[i]){
        chosenBox = this.objects[i];
        SLIDERS[1].value(chosenBox.m);
        SLIDERS[2].value(chosenBox.v);
        SLIDERS[3].value(chosenBox.x);
        found = true;
      }
    }
  }
  if(!found && Y<ground.y){
    chosenBox=false;
  }
}



// === CLASS BOX
function Box(x,v,m,color){
  this.t = 0;
  this.x = x;
  this.v = v;
  this.m = m;
  this.color = color;
  this.S = 20*sqrt(this.m);
}


Box.prototype.evolve = function(dt) {
    this.t += dt;
    this.x += this.v*dt;
}

Box.prototype.handleCollisionWithBoundary = function() {
  // collide with infinitely heavy walls
  if(this.x<this.S){
    this.x = this.S;
    this.v *= -1;
  }else if(this.x+this.S>width){
    this.x = width-this.S;
    this.v *= -1;
  }
}

Box.prototype.handleCollisionWith = function(other) {
  // ellastic collision
  var relM = this.m/other.m;
  var v1 = (2*other.v+relM*this.v-this.v)/(1+relM);
  var v2 = v1+this.v-other.v;

  this.v  = v1;
  other.v = v2;
}

Box.prototype.setParameters = function(yval){
  this.y = yval;
}

Box.prototype.show = function() {
  this.S = 20*sqrt(this.m);
  if(chosenBox==this){
    fill(color1);
  }else if(statBox==this){
    fill(color2);
  }else{
    fill(this.color);
  }
  rect(this.x-this.S,this.y-2*this.S,2*this.S,2*this.S);
  if(statBox==this){
    STAT.log(this.x,this.v,this.t);
  }
}

// ========= CLASS STATISTICS ==================
function Statistics(x,y,W,H){
  this.maxN = 2000;
  this.x = x;
  this.y = y;
  this.W = W;
  this.H = H;
  this.data = [];
  this.T = 1;
}

Statistics.prototype.log = function(x,v,t){
  if(this.data.length>this.maxN){
    for(var j=0; j<this.maxN-1; j++){
      this.data[j] = this.data[j+1];
    }
    this.data[this.maxN-1] = [x,v,t];
  }else{
    this.data.push([x,v,t]);
  }
}

Statistics.prototype.show = function(){
  push();
  translate(this.x,this.y);
  fill(color1);
  rect(0,0,this.W,this.H);

  noFill();
  stroke(0,255,0);
  beginShape();
  for(var i=0; i<this.data.length; i++){
    var x = map(this.data[i][0],0,width,0,this.H);
    var I = map(i,0,this.data.length,0,this.W);
    vertex(I,x);
  }
  endShape();

  stroke(255,0,0);
  beginShape();
  for(var i=0; i<this.data.length; i++){
    var v = map(this.data[i][1],-20,20,0,this.H);
    var I = map(i,0,this.data.length,0,this.W);
    vertex(I,v);
  }
  endShape();
  pop();
}





function adjustToSlidervalues(){
  dt    = pow(10,SLIDERS[0].value());
  if(chosenBox!=false){
    chosenBox.m = SLIDERS[1].value();
    chosenBox.v = SLIDERS[2].value();
    chosenBox.x = SLIDERS[3].value();
  }
}



// =============================
function setColors(){
  backgroundColor = color("#E3CDA4");
  groundColor     = color("#C77966");
  boxColor        = color("#2F343B");
  color1          = color("#7E827A");
  color2          = color("#703030");
}

function makeSliders(){
  SLIDERTEXTS.push("Timestep\n(exp)");
  SLIDERS.push(createSlider(-6, -1, -1, 0.01).class("terminatorSlider"));

  SLIDERTEXTS.push("Mass");
  SLIDERS.push(createSlider(0.1, 10, 2, 0.01).class("terminatorSlider"));

  SLIDERTEXTS.push("Velocity");
  SLIDERS.push(createSlider(-20, 20, 1, 0.01).class("terminatorSlider"));

  SLIDERTEXTS.push("Position");
  SLIDERS.push(createSlider(0, width, width/2, 1).class("terminatorSlider"));
}


// =============================

function showControlpanel(){
  fill(0);
  noStroke();

  // General
  var top             = ground.y+40;
  var textSep         = 20;
  var xpos            = 100;
  var sliderSep       = 50;
  var classSeparation = 170;

  textSize(16);

  for(var i=0; i<SLIDERS.length; i++){
    textAlign(RIGHT);
    text(SLIDERTEXTS[i],    xpos-textSep, top+i*sliderSep+10);
    SLIDERS[i].position(    xpos, top+i*sliderSep);
    textAlign(LEFT);
    text(SLIDERS[i].value(),xpos+sliderPercent*width, top+i*sliderSep+10);
  }

}




function mousePressed(){

  // select box
  ground.selectClickedBox(mouseX,mouseY);
}






//
