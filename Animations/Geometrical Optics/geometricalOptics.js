
var n0        = 1.0 // outside refractive
var raySpan   = 0.02//3.14/7; // PI/8
var raySep    = 0.1
var nRays     = 0;
var numItr    = 10;
var rayWidth  = 2;
var bufferW   = 500;
var bufferH   = 600;

var rayPoint = [0,1];

var source;
var LENSES  = [];
var SURFACES = [];
var BUFFERGRID;
var ray,controlpanel;
var backgroundColor,lensColor,rayColor,normalLineColor;

function setup(){
  createCanvas(windowWidth, windowHeight);
  buffer = createGraphics(windowWidth, windowHeight);

  c1 = color("rgb(47, 52, 59)");
  c2 = color("rgb(166, 121, 61)");
  c3 = color("rgb(255, 149, 11)");
  c4 = color("rgb(199, 121, 102)");
  c5 = color("rgb(227, 205, 164)");
  c6 = color("rgb(112, 48, 48)");
  c7 = color("rgb(126, 130, 122)");
  c8 = color("rgb(247, 239, 246)");
  c9 = color("rgb(196, 196, 189)");
  c10= color("rgb(86, 190, 215)");
  c11= color("rgb(212, 50, 21)");
  c12= color("rgb(69, 59, 61)");
  c13= color("rgb(255, 0, 0)");
  c14= color("rgb(255, 149, 11)");

  backgroundColor = c5;
  lensColor       = c7
  rayColor        = color(255,5)//c11 // color(10)//
  normalLineColor = c12 // color(255,0,0)

  // EXAMPLE OF EXOTIC USAGE
  // var s1 = new Surface(1.5,function(x,y){return y-10*sin(x/20)})//*exp(-sq(x/100))});
  // var s2 = new Surface(1.5,function(x,y){return y-100});
  // var lens = new GenericLens();
  // lens.setSurfaces([s1,s2]);
  // lens.setComparator(function(x){return !x[0] && x[1];});
  // SURFACES = lens.populateSurfaces(SURFACES)
  // LENSES.push(lens);


  var bcv = new BCVsphericalLens(0,-500,0,1,80,80,100,10)
  SURFACES = bcv.populateSurfaces(SURFACES)
  LENSES.push(bcv);

  // var bcx = new BCXsphericalLens(0,-550,0,1,10000,50,80)
  // SURFACES = bcx.populateSurfaces(SURFACES)
  // LENSES.push(bcx);

  var bcx = new BCXsphericalLens(0,-100,0,1,280,10000,350)
  SURFACES = bcx.populateSurfaces(SURFACES)
  LENSES.push(bcx);




  source = new Source(0,-height/3);
  source.initiate();

  controlpanel = new ControlPanel();
  controlpanel.initiate();

  rayPoint[0] = rayPoint[0]+width/2  + source.x;
  rayPoint[1] = rayPoint[1]+height/2 + source.y;

  buffer.pixelDensity(1)
  drawBuffer(bufferW,bufferH)

  noLoop()
}



function draw(){
  image(buffer, 0, 0);

  translate(width/2,height/2)
  controlpanel.update()

  blendMode(ADD)
  source.display()
  source.displayRayTo(rayPoint[0],rayPoint[1],numItr)
  blendMode(NORMAL)

  resetMatrix()
  controlpanel.draw()

}

//------------------------------------------------------------------------------
function drawBuffer(W=200,H=300){
  buffer.background(backgroundColor)
  buffer.loadPixels();
  for(var x=-W;x<W;x++){
    for(var y=-H;y<H;y++){
      for(var n=0; n<LENSES.length; n++){
        if(LENSES[n].isInside(x,y)){
          buffer.set(x+width/2,y+height/2,lensColor)
        }
      }
    }
  }
  buffer.updatePixels();
}




//------------------------------------------------------------------------------
// HELPERS

function intersectCircle(x0,y0,dx,dy,Cx,Cy,R){
  var Dx = x0-Cx
  var Dy = y0-Cy
  var B = 2*( dx*Dx + dy*Dy )
  var C = sq(Dx)+sq(Dy)-sq(R)
  if(sq(B)>4*C){ // solution exist
    var L = [-B/2.+sqrt(sq(B)-4*C)/2.,-B/2.-sqrt(sq(B)-4*C)/2.]
    return L.filter(function(x){ return x > 0.5 }) // filter out negative
  }else{
    return []
  }
}

function repopulateSurfaces(){
  SURFACES = [];
  for(var i=0; i<LENSES.length; i++){
    SURFACES = LENSES[i].populateSurfaces(SURFACES);
  }
}

//------------------------------------------------------------------------------

function getTopSurfaceAt(x,y){
    var lvl = 0;
    var topsurf = undefined;
    for(var i=0; i<SURFACES.length; i++){
      if(SURFACES[i].F(x,y)<0 && SURFACES[i].level>lvl){
        lvl = SURFACES[i].level;
        topsurf = SURFACES[i];
      }
    }
    return topsurf
}



function comparePixelColors(x1,y1,x2,y2){
  var i1 = (int(y1+height/2) * width + int(x1+width/2)) * 4;
  var i2 = (int(y2+height/2) * width + int(x2+width/2)) * 4;
  var Req = buffer.pixels[i1]    ==buffer.pixels[i2];
  var Geq = buffer.pixels[i1 + 1]==buffer.pixels[i2 + 1];
  var Beq = buffer.pixels[i1 + 2]==buffer.pixels[i2 + 2];
  var Aeq = buffer.pixels[i1 + 3]==buffer.pixels[i2 + 3];
  return Req && Geq && Beq && Aeq; // true if pixels are equal
}

function pixelIsLens(x,y){
  var i1 = (int(y+height/2) * width + int(x+width/2)) * 4;
  var Req = buffer.pixels[i1]    ==lensColor.levels[0];
  var Geq = buffer.pixels[i1 + 1]==lensColor.levels[1];
  var Beq = buffer.pixels[i1 + 2]==lensColor.levels[2];
  var Aeq = buffer.pixels[i1 + 3]==lensColor.levels[3];
  return Req && Geq && Beq && Aeq; // true if pixels are equal
}


//------------------------------------------------------------------------------

function mousePressed(event){
  print("--mouse--")
  print(mouseX,mouseY,pixelIsLens(mouseX-width/2,mouseY-height/2))
  if(!controlpanel.inside(mouseX,mouseY)){
    if(controlpanel.modeSelector.value()=="Source"){
      if(mouseButton === LEFT){
        rayPoint = [mouseX,mouseY]
      }else{
        source.x = mouseX-width/2
        source.y = mouseY-height/2
      }
    }else if(controlpanel.modeSelector.value()=="Lens 1"){
      if(mouseButton === LEFT){
        LENSES[0].rC[0] = mouseX-width/2;
        LENSES[0].rC[1] = mouseY-height/2;
        LENSES[0].defineSurface();
        repopulateSurfaces();
        drawBuffer(bufferW,bufferH);
      }
    }else if(controlpanel.modeSelector.value()=="Lens 2"){
      if(mouseButton === LEFT){
        LENSES[1].rC[0] = mouseX-width/2;
        LENSES[1].rC[1] = mouseY-height/2;
        LENSES[1].defineSurface();
        repopulateSurfaces();
        drawBuffer(bufferW,bufferH);
      }
    }
  }
  redraw();
}
//
// function doubleClicked() {
// }
//
function mouseDragged(){
  var dx = mouseX-pmouseX
  var dy = mouseY-pmouseY
  if(controlpanel.modeSelector.value()=="Source"){
    rayPoint[0] = mouseX;
    rayPoint[1] = mouseY;
  }
  redraw();
}
//
// function keyPressed(){
//   // redraw()
// }
