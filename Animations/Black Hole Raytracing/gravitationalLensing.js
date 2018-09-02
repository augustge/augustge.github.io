

var Dl = 10.;
var Ds = 20.;
var fovX = 3.141592/5.0e6 //5000000.;
var fovY = 3.141592/5.0e6 //5000000.;

var Mpbh = 1.;
// var bkgImg;
// var img;

// function preload(){
//   bkgImg = loadImage("Textures/paper.jpg");
// }

var DISPLAY;
var LENS;
var SOURCE;

function setup(){
  // createCanvas(windowWidth, windowHeight);

  createCanvas(600, 400);
  // createCanvas(300, 300);


  fovY = fovX/(width/float(height))

  DISPLAY = new Display(width,height,200,200)
  // DISPLAY.initialize(0.,0.,fovX,fovY)
  DISPLAY.initializePixels(0.,0.,fovX,fovY)

  LENS = new Lens(Mpbh,0,0)
  SOURCE = new Source(fovX/100.,0,0)

  // makeControls();

  pixelDensity(1);

  noStroke();
}

function draw(){
  background(0);

  var thetaMouseX = map(mouseX, 0, width, DISPLAY.thetaXmin, DISPLAY.thetaXmax)
  var thetaMouseY = map(mouseY, 0, height, DISPLAY.thetaYmin, DISPLAY.thetaYmax)
  LENS.x = Dl*sin(thetaMouseX);
  LENS.y = Dl*sin(thetaMouseY);
  //

  loadPixels();
  DISPLAY.doPixels()
  updatePixels();


}



function Display(W,H,nX,nY){
  this.W = W;
  this.G = H;
  this.dX = W/nX;
  this.dY = H/nY;
  this.nY = nY;
  this.nX = nX;

  this.initialize = function(thetaX0,thetaY0,fovX,fovY){
    this.thetaX0 = thetaX0
    this.thetaY0 = thetaY0
    this.fovX = fovX
    this.fovY = fovY
    this.thetaXmin = thetaX0-0.5*this.fovX
    this.thetaXmax = thetaX0+0.5*this.fovX
    this.thetaYmin = thetaY0-0.5*this.fovY
    this.thetaYmax = thetaY0+0.5*this.fovY


    var RAYS  = new Array(this.nX);
    for(var i=0; i<this.nX; i++){
      RAYS[i]   = new Array(this.nY);
      for(var j=0; j<this.nY; j++){
        thetaX = this.thetaXmin+i*this.fovX/this.nX
        thetaY = this.thetaYmin+j*this.fovY/this.nY
        RAYS[i][j] = new Ray(i,j,thetaX,thetaY)
      }
    }
    this.RAYS = RAYS
  }

  this.initializePixels = function(thetaX0,thetaY0,fovX,fovY){
    this.thetaX0 = thetaX0
    this.thetaY0 = thetaY0
    this.fovX = fovX
    this.fovY = fovY
    this.thetaXmin = thetaX0-0.5*this.fovX
    this.thetaXmax = thetaX0+0.5*this.fovX
    this.thetaYmin = thetaY0-0.5*this.fovY
    this.thetaYmax = thetaY0+0.5*this.fovY
    this.nX = width
    this.nY = height
    this.dX = W/this.nX;
    this.dY = H/this.nY;

    var d = pixelDensity();

    var RAYS  = new Array(this.nX);
    for(var i=0; i<this.nX; i++){
      RAYS[i]   = new Array(this.nY);
      for(var j=0; j<this.nY; j++){
        thetaX = this.thetaXmin+i*this.fovX/this.nX
        thetaY = this.thetaYmin+j*this.fovY/this.nY
        RAYS[i][j] = new Ray(i,j,thetaX,thetaY)
      }
    }
    this.RAYS = RAYS
  }

  this.perform = function(){
    for(var i=0; i<this.nX; i++){
      for(var j=0; j<this.nY; j++){
        thetaX = this.thetaXmin+i*this.fovX/this.nX
        thetaY = this.thetaYmin+j*this.fovY/this.nY
        this.RAYS[i][j].thetaX = thetaX;
        this.RAYS[i][j].thetaY = thetaY;
        this.RAYS[i][j].evolveToLensPlane()
        this.RAYS[i][j].deflect()
        this.RAYS[i][j].evolveToSourcePlane()
        var value = this.RAYS[i][j].getPixelColor(SOURCE.fov)

        fill(value)
        stroke(255)
        rect(i*this.dX,j*this.dY,this.dX,this.dY)
        // text(value,i*this.dX,j*this.dY)
      }
    }
  }

  this.doPixels = function(){
    var d = pixelDensity();
    for(var i=0; i<this.nX; i++){
      for(var j=0; j<this.nY; j++){
        thetaX = this.thetaXmin+i*this.fovX/this.nX
        thetaY = this.thetaYmin+j*this.fovY/this.nY
        this.RAYS[i][j].thetaX = thetaX;
        this.RAYS[i][j].thetaY = thetaY;
        this.RAYS[i][j].evolveToLensPlane()
        this.RAYS[i][j].deflect()
        this.RAYS[i][j].evolveToSourcePlane()
        var value = this.RAYS[i][j].getPixelColor(SOURCE.fov)

        setPixel(d,i,j,value,value,value,255)
        // fill(value)
        // stroke(255)
        // rect(i*this.dX,j*this.dY,this.dX,this.dY)
        // text(value,i*this.dX,j*this.dY)
      }
    }


  }

}

// ------------------------------------------------
function setPixel(d,x,y,R,G,B,A){
  // for (var i = 0; i < d; i++) {
    // for (var j = 0; j < d; j++) {
    var i = 0
    var j = 0
      var idx = 4 * ((y * d + j) * width * d + (x * d + i));
      pixels[idx]   = R;
      pixels[idx+1] = G;
      pixels[idx+2] = B;
      pixels[idx+3] = A;
    // }
  // }
}

// ------------------------------------------------

function Ray(i,j,thetaX,thetaY){
  this.i = i
  this.j = j
  this.thetaX = thetaX
  this.thetaY = thetaY
  this.X0 = Ds*sin(this.thetaX)  // undeflected
  this.Y0 = Ds*sin(this.thetaY)  // undeflected

  this.evolveToLensPlane = function(){
    this.X = Dl*sin(this.thetaX)
    this.Y = Dl*sin(this.thetaY)
  }

  this.deflect = function(){
    var R = sqrt(sq(this.X-LENS.x)+sq(this.Y-LENS.y))
    var a = 4.*4.78005899832E-14*LENS.mass/R //this.alpha(R)
    var angLen = sqrt(sq(this.thetaX-LENS.x/Dl)+sq(this.thetaY-LENS.y/Dl))
    var dirX = (LENS.x/Dl-this.thetaX)/angLen
    var dirY = (LENS.y/Dl-this.thetaY)/angLen
    var aX = a * dirX
    var aY = a * dirY
    this.thetaX = this.thetaX + aX
    this.thetaY = this.thetaY + aY
  }

  this.evolveToSourcePlane = function(){
    this.X = this.X + (Ds-Dl)*sin(this.thetaX)
    this.Y = this.Y + (Ds-Dl)*sin(this.thetaY)
    // this.R = sqrt(this.X**2+this.Y**2)
  }

  this.getPixelColor = function(){
    // return 255*atan(this.R/1000000.)
    return SOURCE.getColor(this.X,this.Y)
    // if(this.R < Rspan){
    //   return 255;
    // }else{
    //   return int(255.*pow(Rspan/this.R,4));
    // }
  }
}


function Lens(mass,x,y){
  this.mass = mass
  this.x = x
  this.y = y
}

function Source(fov,thetaX,thetaY){
  this.fov = fov
  this.thetaX = thetaX
  this.thetaY = thetaY
  this.Rspan = Ds*sin(fov)
  this.X = Ds*sin(thetaX)
  this.Y = Ds*sin(thetaY)

  this.getColor = function(X,Y){
    var Rsq = sq(X-this.X) + sq(Y-this.Y)
    if(Rsq < sq(this.Rspan)){
      return 255;
    }else{
      return int(255.*sq(sq(this.Rspan)/Rsq));
    }
  }
}


// --------------------------------------------------------
// function makeControls(){
//   resolutionSlider = createSlider(10, 300, 100, 10);
// }




//
