
var pxToLen = 10;
var mouseWind = false;

var fdMean    = 0.6;
var fdStd     = 0.1;
var dThMean   = 3.1415/12
var dThStd    = dThMean/2
var gamma     = 0.382

var time = 0;
var TREE;

function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  sfM  = addSlider(createSlider(0, 1.0,   fdMean,   0.0001), "Mean mass splitting (f)")
  sfS  = addSlider(createSlider(0, 1.0,   fdStd,    0.0001), "Std mass splitting (f)")
  sthM = addSlider(createSlider(0, PI/2,  dThMean,  0.0001), "Mean branching angle (delta theta)")
  sthS = addSlider(createSlider(0, PI/2,  dThStd,   0.0001), "Std branching angle (delta theta)")
  sgam = addSlider(createSlider(0, 1,     gamma,    0.0001), "Branch length scaling (gamma)")
  sL   = addSlider(createSlider(0, 20,    6,        0.0001), "Root Length")
  sd   = addSlider(createSlider(0, 40,    10,       0.0001), "Root Thickness")
  sC   = addSlider(createSlider(0, 0.1,   0.01,     0.0001), "Leaf Cutoff")
  sW   = addSlider(createSlider(0, 2,     1,        0.0001), "Wind strength")


  TREE = new Tree([width/2,height],[0,-1],sL.value(),sd.value());
}

function draw(){
  background(167, 213, 242)
  time += 0.01;
  if( frameCount%2==0 ){
    var fX = 0.02*sW.value()*(1+cos(time));
    var fY = 0.01*sW.value()*sin(time);
    if(mouseWind){
      fX += 0.0004*(mouseX-width/2);
      fY += 0.0004*(mouseY-height/2);
    }
    TREE.applyForce([fX,fY])
  }

  TREE.display();

  // Update slider values
  sfM.attribute( "value", sfM.value())
  sfS.attribute( "value", sfS.value())
  sthM.attribute("value",sthM.value())
  sthS.attribute("value",sthS.value())
  sgam.attribute("value",sgam.value())
  sL.attribute(  "value",  sL.value())
  sd.attribute(  "value",  sd.value())
  sC.attribute(  "value",  sC.value())
  sW.attribute(  "value",  sW.value())
}



// ================================================================

class Tree{
  constructor(R0,D,L,d){
    this.root = new Branch(R0,D,L,d)
  }

  resample(R0,D,L,d){
    this.root = new Branch(R0,D,L,d)
  }

  applyForce(F){
    this.root.applyForce(this.root.R,this.root.D,F)
  }

  display(){
    this.root.display()
  }
}





// ================================================================

class Branch{
  constructor(R,D,L,d){ // R root, D direction, L length, d diameter
    this.fd    = randomGaussian(sfM.value(), fdStd).clamp(0,1)//random(fdMin,fdMax)//randomGaussian(0.8, 0.0001) // flux splitting fraction
    this.dth   = randomGaussian(sthM.value(), sthS.value())
    this.gamma = sgam.value()
    this.R = R
    this.D = D
    this.Rp = R;
    this.Dp = D;
    this.L = L
    this.d = d
    if(d>sC.value()){
      this.leaf=false
      this.setBranchoffs()
    }else{
      this.leaf=true
      this.th = atan2(this.D[1],this.D[0])
      var cR = 59+random(-35,35);
      var cG = 145+random(-35,35);
      var cB = 15+random(-35,35);
      this.c = color(cR,cG,cB,200);
    }
  }

  // This is where the magic happens!
  setBranchoffs(){
    var Rn = [this.R[0]+pxToLen*this.L*this.D[0],this.R[1]+pxToLen*this.L*this.D[1]];

    if(random()<0.5){ // this is to remove order in child branches
      var d1 = (this.fd)*this.d;
      var d2 = (1-this.fd)*this.d;
      var L1 = pow(this.fd,this.gamma)*this.L
      var L2 = pow(1-this.fd,this.gamma)*this.L
    }else{
      var d2 = (this.fd)*this.d;
      var d1 = (1-this.fd)*this.d;
      var L2 = pow(this.fd,this.gamma)*this.L
      var L1 = pow(1-this.fd,this.gamma)*this.L
    }

    var th0 = atan( (sq(L1*d1)-sq(L2*d2))/(sq(L1*d1)+sq(L2*d2)) * tan(this.dth) )

    this.th1 = th0 - this.dth
    this.th2 = th0 + this.dth

    var D1 = rotateVec(this.D,this.th1)
    var D2 = rotateVec(this.D,this.th2)

    this.B1 = new Branch(Rn,D1,L1,d1)
    this.B2 = new Branch(Rn,D2,L2,d2)
  }

  applyForce(Rn,Dn,F){
    // Compute change in branch direction given force F
    var dD = [F[0]/sqrt(this.d),F[1]/sqrt(this.d)]

    // Update self
    this.Rp[0] = Rn[0];
    this.Rp[1] = Rn[1];
    var lenDnew = sqrt(sq(Dn[0]+dD[0])+sq(Dn[1]+dD[1]));
    this.Dp = [(Dn[0]+dD[0])/lenDnew,(Dn[1]+dD[1])/lenDnew];

    // Update children
    if(!this.leaf){
      var RnX = this.Rp[0]+pxToLen*this.L*this.Dp[0]
      var RnY = this.Rp[1]+pxToLen*this.L*this.Dp[1]
      var Rnn = [RnX,RnY];
      var D1 = rotateVec(this.Dp,this.th1)
      var D2 = rotateVec(this.Dp,this.th2)
      this.B1.applyForce(Rnn,D1,F)
      this.B2.applyForce(Rnn,D2,F)
    }else{
      this.th = atan2(this.Dp[1],this.Dp[0])
    }
  }


  display(){
    stroke(38, 25, 13)
    strokeWeight(this.d+0.3)
    var xF = this.Rp[0]+pxToLen*this.L*this.Dp[0]
    var yF = this.Rp[1]+pxToLen*this.L*this.Dp[1]
    line(this.Rp[0],this.Rp[1],xF,yF)
    if(this.leaf){
      noStroke();
      fill(this.c)
      push()
      translate(xF+4*this.Dp[0],yF+4*this.Dp[1])
      rotate(this.th)
      ellipse(0,0,8,3)
      pop()
    }else{
      this.B1.display()
      this.B2.display()
    }

  }
}


function rotateVec(R,t){
  return [R[0]*cos(t)+R[1]*sin(t),R[1]*cos(t)-R[0]*sin(t)];
}



function keyPressed(){
  if(keyCode==32){ // SPACE
    TREE.resample(TREE.root.R,TREE.root.D,sL.value(),sd.value())
  }
  if(keyCode==13){ // ENTER
    mouseWind = !mouseWind;
  }
  return false
}


Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
}

function addSlider(S,text){
  var container = createDiv("");
  container.class("entrycontainer");
  container.parent( window.document.getElementById('control-holder') )
  S.parent(container);
  S.attribute("value",S.value())
  var textDiv = createDiv(text)
  textDiv.class("slidertext")
  textDiv.parent(container)
  return S;
}




//
