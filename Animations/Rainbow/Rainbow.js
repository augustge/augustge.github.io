
var eps = 0.0001

// REFRACTION
var n1 = 1.0;
var n2 = 1.5;
var reflective  = 0.2;
var absobtive   = 0.8;

// SOURCE
var sx = 100;
var sy = 100;
var sr = 10;
var nRay = 2000;
var rayOpacity = 6;
var nReflections = 8;
var drawIncoming = true;
var nColorsInSpectrum = 6;

// OBJECT
var R = 100
var x = 300
var y = 300


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(5);

  sx  = 200;
  sy  = height-200;
  x   = width/2;
  y   = height/2;

  indexSlider = createSlider(0.5, 4.5, 1.5, 0.1)
  indexSlider.position(90,50);

  numRaySlider = createSlider(10, 5000, 2000, 10)
  numRaySlider.position(90,70);

  numIterationsSlider = createSlider(1, 20, 8, 1)
  numIterationsSlider.position(90,90);

  numColorsSlider = createSlider(1, 10, 6, 1)
  numColorsSlider.position(90,110);

  opacitySlider = createSlider(1, 150, 6, 1)
  opacitySlider.position(90,130);

  reflectivitySlider = createSlider(0, 1, 0.2, 0.1)
  reflectivitySlider.position(90,150);

  radio = createRadio();
  radio.option("Droplet position",1);
  radio.option("Source Position",2);
  radio.style("color", "#FFFFFF");
  radio.position(90,170);

  drawIncomingCheckbox = createCheckbox("Draw incoming",true).style("color", "#FFFFFF")
  drawIncomingCheckbox.position(90,190);

  reducePowerCheckbox = createCheckbox("Reduce Power",true).style("color", "#FFFFFF")
  reducePowerCheckbox.position(90,210);

}

function draw() {
  n2                = indexSlider.value();
  nRay              = numRaySlider.value();
  nReflections      = numIterationsSlider.value();
  nColorsInSpectrum = numColorsSlider.value();
  rayOpacity        = opacitySlider.value();
  drawIncoming      = drawIncomingCheckbox.checked();
  reflective        = reflectivitySlider.value();
  absobtive         = 1-reflective;

  blendMode(BLEND);
  background(0);
  blendMode(ADD);
  noStroke();

  // OBJECT
  noFill();
  stroke(255);
  ellipse(x,y,2*R,2*R);


  // RAYS
  for(var i=0; i<nRay; i++){
    rx = cos(2*3.141592/nRay*i);
    ry = sin(2*3.141592/nRay*i);
    for(var l=0; l<1; l+=1.0/nColorsInSpectrum){
      procedure(sx,sy,rx,ry,1,false,l,nReflections)
    }

  }


  // RAYS
  // var rx = 1;
  // var ry = 0;
  // var sx = 0;
  // for(var sy=0; sy<height; sy+=height/nRay){
  //   procedure(sx,sy,rx,ry,1,false,1,nReflections)
  //   procedure(sx,sy,rx,ry,1,false,0.5,nReflections)
  //   procedure(sx,sy,rx,ry,1,false,0,nReflections)
  // }
  blendMode(BLEND);
  fill(255)
  textAlign(RIGHT)
  text("Refrection",80,55)
  text("Rays",80,75)
  text("Iterations",80,95)
  text("Colors",80,115)
  text("Opacity",80,135)
  text("Reflective",80,155)

  var xp = 90+indexSlider.width+5;
  textAlign(LEFT)
  text(n2,xp,55)
  text(nRay,xp,75)
  text(nReflections,xp,95)
  text(nColorsInSpectrum,xp,115)
  text(rayOpacity,xp,135)
  text(reflective,xp,155)

}

function mouseDragged(){
  if(radio.value()==1){
    x = mouseX;
    y = mouseY;
  }else if(radio.value()==2){
    sx = mouseX;
    sy = mouseY;
  }
}


function drawLiveLine(px,py,rx,ry,lamb,power,id,n){
  //stroke(lerpColor(color(255,0,0,power*rayOpacity), color(0,0,255,power*rayOpacity), id))
  if(!reducePowerCheckbox.checked()){
    power = 1;
  }
  if(id<0.5){
    stroke(lerpColor(color(255,0,0,power*rayOpacity), color(0,150,0,power*rayOpacity), 2*id))
    // stroke(255,0,0,power*rayOpacity);
  }else{
    stroke(lerpColor(color(0,150,0,power*rayOpacity), color(0,0,255,power*rayOpacity), 2*id-1))
    // stroke(0,255,0,power*rayOpacity);
  }
  if(drawIncoming){
    line(px,py,px+lamb*rx,py+lamb*ry)
  }else if(n!=nReflections){
    line(px,py,px+lamb*rx,py+lamb*ry)
  }
}

function procedure(px,py,rx,ry,power,inside,id,n){
  if(n>0){
    lamb = getLamb(px,py,rx,ry,x,y)
    if(lamb!=false){
      drawLiveLine(px,py,rx,ry,lamb,power,id,n)
      px = px+lamb*rx // point on sphere
      py = py+lamb*ry // point on sphere
      if(inside){
        nx = (x-px)/R // from point to center normalized
        ny = (y-py)/R // from point to center normalized
      }else{
        nx = (px-x)/R // from center to point normalized
        ny = (py-y)/R // from center to point normalized
      }

      var Rlist2 = reflectRay(rx,ry,nx,ny)
      var Rx = Rlist2[0]; var Ry=Rlist2[1]

      if(inside){
        var Rlist = bendRay(rx,ry,nx,ny,n2*(1+0.1*id),n1)
      }else{
        var Rlist = bendRay(rx,ry,nx,ny,n1,n2*(1+0.1*id))
      }

      if(Rlist!=false){
        procedure(px+eps*Rx,py+eps*Ry,Rx,Ry,power*reflective,inside,id,n-1)
        rx = Rlist[0]; ry=Rlist[1]
        procedure(px+eps*rx,py+eps*ry,rx,ry,power*absobtive,!inside,id,n-1)
      }else{
        procedure(px+eps*Rx,py+eps*Ry,Rx,Ry,power,inside,id,n-1)
      }
    }else{
      drawLiveLine(px,py,rx,ry,2000,power,id,n)
    }
  }
}

function getLamb(sx,sy,rx,ry,x,y){
  // (sx,sy): source
  // (x,y):   circle
  // (rx,ry): ray
  var X = x-sx
  var Y = y-sy
  det = sq(rx*X+ry*Y)-(sq(rx)+sq(ry))*(sq(X)+sq(Y)-sq(R))
  if(det > 0){
    var rsq = sq(rx)+sq(ry)
    lamb = (rx*X+ry*Y-sqrt(det))/rsq
    if(lamb<0){
      lamb = (rx*X+ry*Y+sqrt(det))/rsq
      if(lamb<0){ lamb=false }
    }
  }else{
    lamb = false
  }
  return lamb
}

function bendRay(rx,ry,nx,ny,nIn,nOut){
  var c     = -nx*rx-ny*ry; // -n.r
  var nRel  = nIn/nOut;
  var fak = 1-sq(nRel)*(1-sq(c))
  if(fak>0){
    var Rx = nRel*rx+(nRel*c-sqrt(fak))*nx;
    var Ry = nRel*ry+(nRel*c-sqrt(fak))*ny;
    return [Rx,Ry]
  }else{
    return false;
  }
}


function reflectRay(rx,ry,nx,ny){
  Hx = (rx*nx+ry*ny)*nx
  Hy = (rx*nx+ry*ny)*ny
  Rx = rx-2*Hx
  Ry = ry-2*Hy
  return[Rx,Ry]
}



// ===========
function checkboxEvent(){
  if(this.checked){
    drawIncoming = true;
  }else{
    drawIncoming = false;
  }
}




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
