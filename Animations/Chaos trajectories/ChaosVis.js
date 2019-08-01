
var rho     = 28;
var sigma   = 10;
var beta    = 8/3;

var numBL   = 100;
var num     = 5000;
var dt      = 0.01;
var s       = 10;

var rotX = 0;
var rotY = 0;
var index = 0;

var p = [0,0,0];

var C;
var r;

var L = [];
var SLIDERS = [];
var rhoDiv;
var sigmaDiv;
var betaDiv;

var LORENTZ;
var BIFURC;
var sel,col1,col2;

function setup(){
  C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");

  LORENTZ = new LorentzSystem(rho,sigma,beta)
  LORENTZ.repopulate(num)

  BIFURC = new BifurcateLorentz(0,110,500,sigma,beta)

  col1 = color(241, 196, 16)
  col2 = color(242, 242, 242)

  sel = createSelect();
  sel.position(20, 20);
  sel.option('XY dynamic');
  sel.option('YZ dynamic');
  sel.option('Bifurcation X');

  var rhoSlider = createSlider(0, 80, rho, 0.0001)
  rhoSlider.position(20,40)
  var sigmaSlider = createSlider(0, 40, sigma, 0.0001)
  sigmaSlider.position(20,60)
  var betaSlider = createSlider(0, 40, beta, 0.0001)
  betaSlider.position(20,80)
  SLIDERS.push( rhoSlider )
  SLIDERS.push( sigmaSlider )
  SLIDERS.push( betaSlider )

  rhoDiv = createDiv("rho")
  rhoDiv.position(180,40)
  sigmaDiv = createDiv("sigma")
  sigmaDiv.position(180,60)
  betaDiv = createDiv("beta")
  betaDiv.position(180,80)

  background(70, 70, 70)
  stroke(255)
  strokeWeight(2)
}


function draw(){
  background(70, 70, 70)
  if(sel.value()=="XY dynamic"){
    LORENTZ.evolve(dt,1)
    LORENTZ.displayXY(0,width,height,0)
  }else if(sel.value()=="YZ dynamic"){
    LORENTZ.evolve(dt,1)
    LORENTZ.displayYZ(0,width,height,0)
  }else{
    BIFURC.evolve(dt,100)
    BIFURC.display(100,width-100,height-100,100)
  }

  LORENTZ.rho   = SLIDERS[0].value()
  LORENTZ.sigma = SLIDERS[1].value()
  LORENTZ.beta  = SLIDERS[2].value()
  rhoDiv.html("rho:"+str(LORENTZ.rho))
  sigmaDiv.html("sigma:"+str(LORENTZ.sigma))
  betaDiv.html("beta:"+str(LORENTZ.beta))
}

function BifurcateLorentz(rhoMin,rhoMax,num,sigma,beta){
  this.rhoMin = rhoMin;
  this.rhoMax = rhoMax;
  this.num    = num;
  this.L      = [];

  randomSeed(1);
  for(var rho=rhoMin; rho<rhoMax; rho+=(rhoMax-rhoMin)/num){
    var ls = new LorentzSystem(rho,sigma,beta)
    ls.repopulate(numBL)
    this.L.push(ls)
  }

  this.evolve = function(dt,N){
    for(var i=0; i<this.L.length; i++){
      this.L[i].evolve(dt,N)
      this.L[i].logZmax()
    }
  }

  this.display = function(Xmin,Xmax,Ymin,Ymax){
    stroke(255,100)
    for(var i=0; i<this.L.length; i++){
      for(var j=0; j<this.L[i].X.length; j++){
        var x = map(this.L[i].rho, rhoMin, rhoMax, Xmin,Xmax)
        var y = map(this.L[i].X[j], -20, 20, Ymin, Ymax)
        point(x,y)
      }
    }
  }
}




function LorentzSystem(rho,sigma,beta){
  this.rho = rho
  this.sigma = sigma
  this.beta = beta
  this.X = []
  this.Y = []
  this.Z = []

  this.repopulate = function(n,s=10){
    this.X = []
    this.Y = []
    this.Z = []
    this.n = n
    this.Zmax = []
    for(var i=0; i<n; i++){
      this.X.push( randomGaussian(p[0],s) )
      this.Y.push( randomGaussian(p[1],s) )
      this.Z.push( randomGaussian(p[2],s) )
      this.Zmax.push( 0 )
    }
  }

  this.logZmax = function(){
    for(var i=0; i<this.Z.length; i++){
      if(this.Z[i]>this.Zmax[i]){
        this.Zmax[i] = this.Z[i];
      }
    }
  }

  this.diffEq = function(x0,y0,z0){
    var dx = this.sigma*(y0-x0)
    var dy = x0*(this.rho-z0)-y0
    var dz = x0*y0-this.beta*z0
    return [dx,dy,dz]
  }

  this.evolve = function(dt,N){
    for(var j=0; j<N; j++){
      for(var i=0; i<this.X.length; i++){
        // RK4 integration
        var k1 = this.diffEq(this.X[i],this.Y[i],this.Z[i])
        var k2 = this.diffEq(this.X[i]+0.5*k1[0]*dt,this.Y[i]+0.5*k1[1]*dt,this.Z[i]+0.5*k1[2]*dt)
        var k3 = this.diffEq(this.X[i]+0.5*k2[0]*dt,this.Y[i]+0.5*k2[1]*dt,this.Z[i]+0.5*k2[2]*dt)
        var k4 = this.diffEq(this.X[i]+k3[0]*dt,this.Y[i]+k3[1]*dt,this.Z[i]+k3[2]*dt)
        this.X[i] += dt*(k1[0]+2*k2[0]+2*k3[0]+k4[0])/6
        this.Y[i] += dt*(k1[1]+2*k2[1]+2*k3[1]+k4[1])/6
        this.Z[i] += dt*(k1[2]+2*k2[2]+2*k3[2]+k4[2])/6
      }
    }
  }

  this.displayYZ = function(Ymin,Ymax,Zmin,Zmax){
    for(var i=0; i<this.X.length; i++){
      stroke(lerpColor(col1, col2, (atan(-this.X[i])*2/PI+1)/2))
      var x = map(this.Y[i], -40, 40, Ymin,Ymax)
      var y = map(this.Z[i], 0, 80, Zmin,Zmax)
      point(x,y)
    }
  }

  this.displayXY = function(Xmin,Xmax,Ymin,Ymax){
    for(var i=0; i<this.X.length; i++){
      stroke(lerpColor(col1, col2, (atan(this.Z[i])*2/PI+1)/2))
      var x = map(this.X[i], -40, 40, Xmin,Xmax)
      var y = map(this.Y[i], -40, 40, Ymin,Ymax)
      point(x,y)
    }
  }

}



//
function mousePressed(){
  if(mouseY>100 && sel.value()!='Bifurcation X'){
    if(sel.value()=="XY dynamic"){
      p[0] = map(mouseX, 0,width,-40, 40)
      p[1] = map(mouseY, height,0,-40, 40)
      p[2] = 0
    }else{
      p[0] = 0
      p[1] = map(mouseX, 0,width, -40,40)
      p[2] = map(mouseY, height,0, 0,80)
    }
    LORENTZ.repopulate(num,1)
  }
}
