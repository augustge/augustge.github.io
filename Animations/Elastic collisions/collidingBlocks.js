
var t = 0;
var B,buff1,buff2,W,dt,m1,m2,v1,v2,x1,x2;
var SLIDERS;

var C1,C2,C3,C4,C5;


function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  W = min(width,height)
  buff1 = createGraphics(W/2,W/2);
  buff2 = createGraphics(W/2,W/2);

  dt  = addSlider(createSlider(0, 1.0,   0.5, 0.0001), "TIMESTEP")
  m1  = addSlider(createSlider(1, 10000.0,   100.0 ), "MASS 1")
  m2  = addSlider(createSlider(1, 10000.0,   1000.0), "MASS 2")
  x1  = addSlider(createSlider(0, 1.0,   0.5, 0.01 ), "POSITION 1")
  x2  = addSlider(createSlider(0, 1.0,   1.0, 0.01 ), "POSITION 2")
  v1  = addSlider(createSlider(-10.0, 10.0,   5.0, 0.01), "VELOCITY 1")
  v2  = addSlider(createSlider(-10.0, 10.0,  -5.0, 0.01), "VELOCITY 2")
  SLIDERS = [dt,m1,m2,x1,x2,v1,v2];
  B = new Blocks(0,width)
  B.addBlock(x1.value(), v1.value(), m1.value())
  B.addBlock(x2.value(), v2.value(), m2.value())

  C1 = color(75,80,63);     //rgb(75,80,63)
  C2 = color(242,242,242);  //rgb(242,242,242)
  C3 = color(217,216,210);  //rgb(217,216,210)
  C4 = color(92,81,72);     //rgb(92,81,72)
  C5 = color(166,115,96);   //rgb(166,115,96)

  B.logState()
  buff1.background(C1)
  buff2.background(C1)
}


function draw(){
  t += dt.value();
  background(C1)

  B.logState();
  var dtmin = B.iterate(dt.value())
  B.showMomentumSpace(buff1.width/2,buff1.height/2,0.8*W/4);
  B.showPositionSpace(buff2.width/2,buff2.height/2,0.8*W/4);
  while(dt.value()-dtmin>1e-10){
    print("tock")
    B.logState();
    dtmin += B.iterate(dt.value()-dtmin);
    B.showMomentumSpace(buff1.width/2,buff1.height/2,0.8*W/4);
    B.showPositionSpace(buff2.width/2,buff2.height/2,0.8*W/4);
  }

  fill(255)
  rect(0,height/2,width,-height)

  B.showMomentumSpace(buff1.width/2,buff1.height/2,0.8*W/4);
  B.showPositionSpace(buff2.width/2,buff2.height/2,0.8*W/4);
  image(buff1,       0, height/2);
  image(buff2, width/2, height/2);
  B.show();



  noStroke()
  fill(C2)
  // text("Position 1",width/2+W/4+0.8*W/4,height/2+W/4)
  // text("Position 2",width/2+W/4,height/2+W/4-0.8*W/4)
  // text("Momentum 1",W/4+0.8*W/4,height/2+W/4)
  // text("Momentum 2",W/4,height/2+W/4-0.8*W/4)
  textAlign(CENTER)
  text("Position Space",width/2+W/4,height/2+W/4-0.8*W/4)
  text("Momentum Space",W/4,height/2+W/4-0.8*W/4)
  textAlign(LEFT)
  textSize(25)
  fill(C1)
  text("Collisions: "+str(B.bH[0]+B.wH[0]),width/2,20)
  textSize(16)
}


class Blocks{
  constructor(xL,xR){
    this.X = [];
    this.V = [];
    this.M = [];
    this.W = [];
    this.B = [xL,xR];
    this.bH = [];
    this.wH = [];
  }

  setX(num,x){
    this.X[num] = map(x,0,1,this.B[0]+this.W[num]/2,this.B[1]-this.W[num]/2);
  }

  setM(num,m){
    this.M[num] = m;
    this.W[num] = 5*pow(m, 1/3);
  }

  setV(num,v){
    this.V[num] = v;
  }

  addBlock(x,v,m){
    var w = 5*pow(m, 1/3)
    this.X.push(map(x,0,1,this.B[0]+w/2,this.B[1]-w/2))
    this.V.push(v)
    this.M.push(m)
    this.W.push(w)
    this.bH.push(0)
    this.wH.push(0)
  }

  logState(){
    this.X0 = this.X.slice()
    this.V0 = this.V.slice()
  }


  iterate(dt){
    // Collect event times
    var dtS = [];
    for(var n=0; n<this.X.length; n++){
      var dt1L = (this.B[0]+this.W[n]/2-this.X[n])/this.V[n]
      var dt1R = (this.B[1]-this.W[n]/2-this.X[n])/this.V[n]
      dtS.push([dt1L,n,-1]); dtS.push([dt1R,n,-1]);
      for(var m=0; m<this.X.length; m++){
          if(n!=m){
            var sep = this.W[n]/2+this.W[m]/2
            var dtC = abs(this.X[n]+sep-this.X[m])/(this.V[n]-this.V[m])
            dtS.push([dtC,n,m]);
          }
      }
    }
    // Pick minimal dtn>0 that is <dt
    var dtmin = dt;
    var info = [-1,-1];
    for(var n=0; n<dtS.length; n++){
      if(dtS[n][0]>1e-12 && dtS[n][0]<dtmin){
        dtmin = dtS[n][0];
        info = [dtS[n][1],dtS[n][2]];
      }
    }
    // move to that time
    if(info[0]==-1){ // nothing interesting
      this.movestraight(dt)
      return dt
    }else{
      this.movestraight(dtmin)
      this.handleMomentum(info[0],info[1])
      return dtmin
    }
  }


  handleMomentum(n,m){
    if(m<0){
      this.V[n] *= -1;
      this.wH[n] += 1;
    }else{
      var rm = this.M[n]/this.M[m];
      var e = rm*sq(this.V[n]) + sq(this.V[m]);
      var p = rm*this.V[n] + this.V[m];
      this.V[n] = ( p - sqrt(sq(p)-(1+1/rm)*(sq(p)-e) ) )/(rm+1)
      this.V[m] = p - rm * this.V[n]
      this.bH[n] += 1;
    }
  }

  movestraight(dt){
    for(var n=0; n<this.X.length; n++){
      this.X[n] += this.V[n]*dt
    }
  }

  show(){
    textAlign(CENTER)
    for(var i=0; i<this.X.length; i++){
      noStroke()
      fill(C5)
      rect(this.X[i]-this.W[i]/2,height/2-this.W[i],this.W[i],this.W[i])
      noStroke()
      fill(C5)
      text(this.M[i],this.X[i],height/2+14)
    }
    textAlign(LEFT)
  }

  showMomentumSpace(x0,y0,s){
    buff1.stroke(C2)
    buff1.strokeWeight(0.5)
    var L = s
    buff1.line(x0-L,y0,x0+L,y0)
    buff1.line(x0,y0-L,x0,y0+L)
    var E = sqrt(2*this.M[0]*sq(this.V[0])+2*this.M[1]*sq(this.V[1]))
    var X0 = x0+s*sqrt(this.M[0])*this.V0[0]/E
    var Y0 = y0+s*sqrt(this.M[1])*this.V0[1]/E
    var X1 = x0+s*sqrt(this.M[0])*this.V[0]/E
    var Y1 = y0+s*sqrt(this.M[1])*this.V[1]/E
    buff1.stroke(C5)
    buff1.strokeWeight(1)
    buff1.line(X0,Y0,X1,Y1)
  }

  showPositionSpace(x0,y0,s){
    buff2.stroke(C2)
    buff2.strokeWeight(0.5)
    var L = s
    buff2.line(x0-L,y0,x0+L,y0)
    buff2.line(x0,y0-L,x0,y0+L)
    var rM = this.M[0]/this.M[1]
    var X0 = x0+map(this.X0[0],this.B[0],this.B[1],-s*sqrt(rM),s*sqrt(rM))
    var Y0 = y0+map(this.X0[1],this.B[0],this.B[1],-s,s)
    var X1 = x0+map( this.X[0],this.B[0],this.B[1],-s*sqrt(rM),s*sqrt(rM))
    var Y1 = y0+map( this.X[1],this.B[0],this.B[1],-s,s)
    buff2.stroke(C5)
    buff2.strokeWeight(1)
    buff2.line(X0,Y0,X1,Y1)
  }
}



function addSlider(S,text){
  S.parent(window.document.getElementById('control-holder'))
  S.attribute("value",S.value())
  S.attribute("text",text)
  S.input(updateSliders);
  return S;
}

function updateSliders(){
  this.attribute("value",this.value())
  if(this.attribute("text") == "POSITION 1"){
    B.setX(0,this.attribute("value"))
  }else if(this.attribute("text") == "POSITION 2"){
    B.setX(1,this.attribute("value"))
  }else if(this.attribute("text") == "VELOCITY 1"){
    B.setV(0,this.attribute("value"))
  }else if(this.attribute("text") == "VELOCITY 2"){
    B.setV(1,this.attribute("value"))
  }else if(this.attribute("text") == "MASS 1"){
    B.setM(0,this.attribute("value"))
  }else if(this.attribute("text") == "MASS 2"){
    B.setM(1,this.attribute("value"))
  }
  buff1.background(C1)
  buff2.background(C1)
  B.bH = [0,0];
  B.wH = [0,0];
}

function keyPressed(){

}
