
var mx = -2*3.141592
var Mx = 2*3.141592
var my = -2*3.141592
var My = 2*3.141592
var Nx = 2*50
var Ny = 2*50
// EXPONENTIAL:
// var mx = -2*3.141592
// var Mx = 2*3.141592
// var my = -3.141592
// var My = 3.141592
// var Nx = 2*50
// var Ny = 50
var skipLines = 2
var pxToGrid;

var t = 0.

var MESH;

function setup(){
  createCanvas(windowWidth, windowHeight);
  // buffer = createGraphics(windowWidth, windowHeight);
  pxToGrid = max( (Mx-mx)/width , (My-my)/height )

  MESH = new Mesh(mx,Mx,my,My,Nx,Ny)
  MESH.init()


  // pendulum = new Pendulum(width/2,height/3,t10,t20,m)
  // pendulum.initiate(dt10,dt20)

  defineColors();

  // buffer.background(c1)
}

function draw(){
    translate(width/2,height/2)
    background(c1);
    MESH.transform( 0.5*(1-cos(t)) )
    MESH.display(pxToGrid,5)
    t += 0.01

}

function Mesh(mx,Mx,my,My,Nx,Ny){
  this.Bx = [mx,Mx];
  this.By = [my,My];
  this.dG = [(Mx-mx)/Nx,(My-my)/Ny];
  this.Nx = Nx;
  this.Ny = Ny;

  this.init = function(){
    this.M = new Array( this.Nx+1 )
    for(var i=0; i<=this.Nx; i++){
      this.M[i] = new Array( this.Ny+1 )
      for(var j=0; j<=this.Ny; j++){
        this.M[i][j] = new Point(this.Bx[0]+i*this.dG[0],this.By[0]+j*this.dG[1]);
      }
    }
  }

  this.transform = function(t){
    for(var i=0; i<=this.Nx; i++){
      for(var j=0; j<=this.Ny; j++){
        this.M[i][j].transform(t)
      }
    }
  }

  this.display = function(pxToGrid,Nth){
    noFill();
    stroke(c3);
    for(var i=0; i<=this.Nx; i+=skipLines){
      beginShape();
      if(int(i/skipLines)%Nth==0){strokeWeight(2)}else{strokeWeight(0.5)}
      for(var j=0; j<=this.Ny; j++){
        var x = this.M[i][j].R[0]
        var y = this.M[i][j].R[1]
        curveVertex(x/pxToGrid,y/pxToGrid)
      }
      endShape()
    }
    stroke(c11);
    for(var j=0; j<=this.Ny; j+=skipLines){
      beginShape();
      if(int(j/skipLines)%Nth==0){strokeWeight(2)}else{strokeWeight(0.5)}
      for(var i=0; i<=this.Nx; i++){
        var x = this.M[i][j].R[0]
        var y = this.M[i][j].R[1]
        curveVertex(x/pxToGrid,y/pxToGrid)
      }
      endShape()
    }
    // console.log(factorial(i))
    // console.log(2*3*4)

  }
}

function Point(x,y){
  this.R0 = [x,y];
  this.R = [x,y];

  this.func = function(R0){
      // var C = new Complex(R0[0],R0[1]).exp()
      var C = new Complex(1,0).div(R0[0],R0[1])
      // var C = new Complex(1,0).div(R0[0],R0[1]).pow(2)
      return [C.a,C.b]
  }

  this.transform = function(t){
    this.R = this.func(this.R0)
    this.R = [(this.R[0]-this.R0[0])*t+this.R0[0],(this.R[1]-this.R0[1])*t+this.R0[1]]
    return this.R
  }
}

function Complex(a,b){
  this.a = a;
  this.b = b;

  this.add = function(a2,b2){
    this.a += a2;
    this.b += b2;
    return this
  }

  this.sub = function(a2,b2){
    this.a -= a2;
    this.b -= b2;
    return this
  }

  this.mul = function(a2,b2){
    ad = this.a*a2 - this.b*b2;
    this.b = this.a*b2 + this.b*a2;
    this.a = ad
    return this
  }

  this.div = function(a2,b2){
    this.mul(a2,-b2)
    var r = sq(a2)+sq(b2)
    this.a /= r;
    this.b /= r;
    return this
  }

  this.Ndiv = function(c){
    this.a /= c;
    this.b /= c;
    return this
  }

  this.pow = function(n){
    var a0 = this.a
    var b0 = this.b
    for(var i=1; i<n; i++){this.mul(a0,b0)}
    return this
  }

  this.exp = function(){
    var res = new Complex(this.a,this.b)
    for(var i=2; i<25; i++){
      var term = new Complex(this.a,this.b).pow(i).Ndiv(factorial(i,1))
      res.add(term.a,term.b)
    }
    return res
  }
}

function factorial(n,a){
  if(n<=1){return a}else{return factorial(n-1,a*n)}
}


//
// function Cadd(A,B){
//     return [ A[0]+B[0] , A[1]+B[1] ]
// }
//
// function Cmul(A,B){
//     return [ A[0]*B[0]-A[1]*B[1] , A[0]*B[1]+A[1]*B[0] ]
// }
//
// function Cpow(A,n){
//   if(n<=1){return A}else{return Cmul(A,Cpow(A,n-1))}
// }
//
// function Cexp(A){
//   return A+Cpow(A,2)
// }





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
