
var showWalkers = true;
var pi = 3.141592653589;
var mouseMode = "create";
var play = true
var mouseSize = 20;

var SMOOTHER = [[1/9.,1/9.,1/9.],
                [1/9.,1/9.,1/9.],
                [1/9.,1/9.,1/9.]]
var BOIDMODEL,resolutions,senseWs,senseLs,attractions,colors,colorInput;
var BOIDS = []


// var S,N,I1,I2,I3,I4;
function setup(){
  var canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("sketch-holder");
  buffer = createGraphics(windowWidth,windowHeight);
  defineGlobals();
  resolutions.push({name:"window size",       R:[windowWidth,windowHeight]})
  resolutions.push({name:"twice window size", R:[2*windowWidth,2*windowHeight]})
  resolutions.push({name:"half window size",  R:[int(windowWidth/2),int(windowHeight/2)]})
  buffer.pixelDensity(1);
  buffer.background(255);
  BOIDMODEL   = new Boid(new Sensor(senseWs[1].A,senseLs[1].L),new Navigator(1,0.3,0.3),attractions[0].f,colors[1].C)
  makeControls();
}


function draw(){
  // several iterations each draw
  background(255);
  image(buffer, 0, 0,width,height);
  if(play){
  for(var k =0;k<10;k++){
    buffer.loadPixels()
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].sense();}
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].act();}
    buffer.updatePixels();
  }
  }
  // draw walkers
  if(showWalkers){
    fill(255,0,0); stroke(255);
    for(var n=0; n<BOIDS.length; n++){
      BOIDS[n].display(5)
    }
  }
  if (mouseMode=="draw" || mouseMode=="erase") {
    stroke(BOIDMODEL.c);
    noFill();
    ellipse(mouseX,mouseY,mouseSize,mouseSize)
  }else if (mouseMode=="create") {
    BOIDMODEL.displaySpecial(mouseX,mouseY,10)
  }else if (mouseMode=="picker") {
    strokeWeight(5);
    noFill();
    stroke(BOIDMODEL.c)
    ellipse(mouseX,mouseY,mouseSize,mouseSize)
    strokeWeight(1);
  }


}


//------------------------------------------------------------------------------
// Main creature: Mainly a container of the propagated information
class Boid{
  constructor(sensor,navigator,cost,c){
    this.x  = 1+random( buffer.width-2);
    this.y  = 1+random(buffer.height-2);
    this.th = random(2*PI)
    this.dth = 0;
    this.smoother = false;
    this.sensor = sensor;
    this.navigator = navigator;
    this.cost = cost; // RGBA cost function
    this.c = c; // color
    this.cCost = c;
    this.force = 0.5;
    // this.interactor = interactor;
  }
  sense(){
    this.th += this.sensor.sense(this.x,this.y,this.th,this.cCost);
  }
  act(){
    var res = this.navigator.move(this.x,this.y,this.th);
    this.x  = res[0];
    this.y  = res[1];
    this.interact(int(this.x),int(this.y));
  }

  combineValues(a,aN){return (a+this.force*aN)/(1+this.force)} // completely discriminative
  pixelIndex(x,y){ return 4*(int(y)*buffer.width+int(x)) }

  smoothing(x,y){
    var mPX = [0.0,0.0,0.0,0.0];
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        var mi = SMOOTHER[xi+1][yi+1];
        mPX[0] += mi*buffer.pixels[i];
        mPX[1] += mi*buffer.pixels[i+1];
        mPX[2] += mi*buffer.pixels[i+2];
        mPX[3] += mi*buffer.pixels[i+3];
      }
    }
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        buffer.pixels[i]   = this.combineValues(buffer.pixels[i]  , mPX[0]);
        buffer.pixels[i+1] = this.combineValues(buffer.pixels[i+1], mPX[1]);
        buffer.pixels[i+2] = this.combineValues(buffer.pixels[i+2], mPX[2]);
        buffer.pixels[i+3] = this.combineValues(buffer.pixels[i+3], mPX[3]);
      }
    }
  }

  setPixelColor(x,y){
    let i = this.pixelIndex(x,y);
    buffer.pixels[i]   = this.combineValues(buffer.pixels[i],  this.c.levels[0]);
    buffer.pixels[i+1] = this.combineValues(buffer.pixels[i+1],this.c.levels[1]);
    buffer.pixels[i+2] = this.combineValues(buffer.pixels[i+2],this.c.levels[2]);
    buffer.pixels[i+3] = this.combineValues(buffer.pixels[i+3],this.c.levels[3]);
  }

  interact(x,y){
    if(this.smoother){
      this.smoothing(x,y)
    }else{
      this.setPixelColor(x,y)
    }
  }

  display(size){
    var X = this.x*width/buffer.width;
    var Y = this.y*height/buffer.height;
    var r = sqrt(sq(X-mouseX)+sq(Y-mouseY));
    var ms = size/(0.1+0.005*r)
    stroke(255-this.c.levels[0],255-this.c.levels[1],255-this.c.levels[2]);
    fill(this.c);
    ellipse(X,Y,size,size);
    noFill(); stroke(this.c);
    ellipse(X,Y,ms,ms);
    for(var k=0;k<this.sensor.angles.length;k++){
      var a = this.sensor.angles[k]
      var l = this.sensor.distances[k]*width/buffer.width
      line(X,Y,X+ms*cos(a+this.th),Y+ms*sin(a+this.th));
    }

  }

  displaySpecial(x,y,scale){
    stroke(this.c)
    noFill()
    var lmax = -1
    for(var k=0;k<this.sensor.angles.length;k++){
      var a = this.sensor.angles[k]
      var l = this.sensor.distances[k]*width/buffer.width
      line(x,y,x+l*cos(a),y+l*sin(a));
      if(l>lmax){lmax=l}
    }
    stroke(this.c)
    noFill()
    ellipse(x,y,2*lmax,2*lmax)
  }
}

//------------------------------------------------------------------------------
// Mechanism for reading pixel data and optimizing cost to generate and angle as a response
class Sensor{
  constructor(angles,distances){
    this.philic     = 1; // prefactor to distance cost
    this.angles     = angles // array of radians
    this.distances  = distances // array of radii
  }
  sensepoint(x,y,th,r,dth){ // retrieve sense-point
    var Xi = int(x+r*cos(th+dth));
    var Yi = int(y+r*sin(th+dth));
    return [1+(Xi-1+buffer.width-2)%(buffer.width-2),1+(Yi-1+buffer.height-2)%(buffer.height-2)]
  }
  getcolor(x,y){ // obtain pixel data
    let i = 4*(y*buffer.width+x);
    return [buffer.pixels[i],buffer.pixels[i+1],buffer.pixels[i+2],buffer.pixels[i+3]];
  }
  sense(x,y,th,cS){ // main function: Optimize cost over sensory scalars
    var costm  = Infinity; var thm = 0;
    for(var k=0; k<this.angles.length; k++){
      var p = this.sensepoint(x,y,th,this.distances[k],this.angles[k]); // meshpoint
      var c = this.getcolor(p[0],p[1]); // color at meshpoint
      var costk = this.philic*distanceTo(c,cS.levels); // cost/repulsion of detected of color
      if(costk<costm){ costm = costk; thm = this.angles[k]; } // if lowest cost
    }
    return thm
  }
}



//------------------------------------------------------------------------------
class Navigator{
  constructor(steplength,fluctuationTheta,fluctuationL){
    this.steplength    = steplength;
    this.fluctuationTH = fluctuationTheta; // relative!
    this.fluctuationL  = fluctuationL;     // relative!
  }
  move(x,y,th){ // position and dir of walker, delta theta (dth) of response
    // generate direction vector
    var dx = (1+random( -this.fluctuationL,this.fluctuationL))*cos(th)//this.steplength*cos(th);
    var dy = (1+random( -this.fluctuationL,this.fluctuationL))*sin(th)//this.steplength*sin(th);
    // MOVE + boundary condition
    var xN  = 1+( x+dx-1 + buffer.width -2)%(buffer.width -2);   // exclude 1px bd
    var yN  = 1+( y+dy-1 + buffer.height-2)%(buffer.height-2);   // exclude 1px bd

    var thN = th + random(-this.fluctuationTH,this.fluctuationTH)
    return [xN,yN,thN]
  }
}

function pixelFromCanvasCoord(x,y){
  var X = x*buffer.width/width;
  var Y = y*buffer.height/height;
  var i = 4*(int(Y)*buffer.width+int(X));
  return [buffer.pixels[i],buffer.pixels[i+1],buffer.pixels[i+2],buffer.pixels[i+3]];
}



//------------------------------------------------------------------------------

function makeControls(){
  // Should probably transition to sliders/inputs instead
  addButton(createButton("play/pause"),function(){play=!play;})
  addSelect([["Create walker","create"],["Draw","draw"],["Walker eraser","erase"],["Color picker","picker"]],"Create walker",function(e){mouseMode=e.target.selectedOptions[0].value;})
  addSelect(resolutions.map(({ name }) => [name,name]),"window size",function(e){
    var resolution = resolutions.filter( ({name}) => name==e.target.selectedOptions[0].value)[0].R;
    newBuffer = createGraphics(resolution[0],resolution[1]);
    newBuffer.pixelDensity(1);
    newBuffer.image(buffer,0,0,newBuffer.width,newBuffer.height);
    for(var n=BOIDS.length-1; n>=0;n--){BOIDS[n].x *= newBuffer.width/buffer.width; BOIDS[n].y *= newBuffer.height/buffer.height}
    buffer = newBuffer;
  })
  // sensor widths
  addSelect(senseWs.map(({ name }) => [name,name]),senseWs[2].name,function(e){
    var angles = senseWs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].A;
    BOIDMODEL.sensor = new Sensor(angles,BOIDMODEL.sensor.distances);})
  // sensor lengths
  addSelect(senseLs.map(({ name }) => [name,name]),senseLs[1].name,function(e){
    var distances = senseLs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].L;
    BOIDMODEL.sensor = new Sensor(BOIDMODEL.sensor.angles,distances);})
  // attractions
  addSelect([["Philic",1],["Phobic",-1]],"Philic",function(e){BOIDMODEL.sensor.philic=e.target.selectedOptions[0].value;})
  addSelect([["Self","s"],["Black","d"],["White","w"],["Chosen","c"]],"s",function(e){
    var v=e.target.selectedOptions[0].value;
    if(v=="s"){     BOIDMODEL.cCost = BOIDMODEL.c;}
    else if(v=="d"){BOIDMODEL.cCost = color(0);}
    else if(v="w"){ BOIDMODEL.cCost = color(255);}
    else if(v="c"){ BOIDMODEL.cCost = color(colorInput.value());}
  })
  // addSelect(attractions.map(({ name }) => [name,name]),"dark attractor",function(e){
  //   BOIDMODEL.cost = attractions.filter(({name}) => name==e.target.selectedOptions[0].value)[0].f;})
  // color
  colorInput = createInput(); colorInput.parent(window.document.getElementById('control-holder'))
  colorInput.changed(function(){BOIDMODEL.c = color(colorInput.value()); colorInput.style('background-color',colorInput.value());})
  addSelect(colors.map(({ name }) => [name,name]),colors[1].name,function(e){
    var v = e.target.selectedOptions[0].value;
    var c = colors.filter(({name}) => name==v)[0].C;
    setColorRGBA(c.levels);// colorInput.value( rgbToHex(c.levels) ); colorInput.style('background-color',colorInput.value());
    BOIDMODEL.c = c; BOIDMODEL.smoother = v=="SMEAR"; })
  addButton(createButton("Show/hide walkers"),function(){showWalkers=!showWalkers;})
  addButton(createButton("Kill all walkers"),function(){BOIDS=[];})
  addButton(createButton("Clear canvas with selected color"),function(){buffer.background(BOIDMODEL.c);})
  addButton(createButton("Download image"),function(){saveCanvas(buffer,"autoArt","jpg");})
}

function addSelect(options,selected,update){
  var s = createSelect()
  s.parent(window.document.getElementById('control-holder'));
  for(var k=0; k<options.length;k++){
    s.option(options[k][0],options[k][1]) // name, [value]
  }
  s.changed(update);
  s.selected(selected)
  s.elt.dispatchEvent(new Event("change"));
}

function addButton(b,f){
  b.parent(window.document.getElementById('control-holder')); b.mousePressed(f);
  return b;
}

function duplicateBoidModel(model){
  var b = new Boid(model.sensor,model.navigator,model.cost,model.c);
  b.smoother = model.smoother;
  b.force = model.force;
  b.cCost = model.cCost;
  return b
}

function setColorHEX(hex){
  colorInput.value( hex );
  colorInput.style('background-color',colorInput.value());
}
function setColorRGBA(rgba){
  colorInput.value( rgbToHex(rgba) );
  colorInput.style('background-color',colorInput.value());
}

function rgbToHex(rgb){
  r = rgb[0].toString(16); if(r.length==1){r="0"+r;}
  g = rgb[1].toString(16); if(g.length==1){g="0"+g;}
  b = rgb[2].toString(16); if(b.length==1){b="0"+b;}
  return "#" + r + g + b;
}

function distanceTo(A,B){
  return sq(A[0]-B[0])+sq(A[1]-B[1])+sq(A[1]-B[1])
}


//==============================================================================

function mousePressed(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if(mouseMode=="create"){
      var b = duplicateBoidModel(BOIDMODEL);
      b.x = xx; b.y = yy;
      BOIDS.push(b);
    }else if (mouseMode=="erase") {
      for(var n=BOIDS.length-1; n>=0;n--){
        if(sq(BOIDS[n].x-xx)+sq(BOIDS[n].y-yy)<sq(mouseSize*buffer.width/width)){
          BOIDS.splice(n, 1);
        }
      }
    }else if (mouseMode=="picker") {
      var rgba = pixelFromCanvasCoord(mouseX,mouseY);
      setColorRGBA(rgba);
      BOIDMODEL.c = color(rgbToHex(rgba));
    }
  }
}

function mouseDragged(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if (mouseMode=="draw") {
      buffer.noStroke();
      buffer.fill(BOIDMODEL.c);
      buffer.ellipse(xx,yy,mouseSize*buffer.width/width,mouseSize*buffer.height/height);
    }
    // add ensemle-draw
  }
}

function keyPressed(){
  if(keyCode==32){showWalkers=!showWalkers;}
}


function defineGlobals(){
  resolutions =[{name:" 600 x  400",    R:[ 600, 400]},
                {name:"2048 x 1536",    R:[2048,1536]},
                {name:"2048 x 2048",    R:[2048,2048]},
                {name:"1024 x 1024",    R:[1024,1024]},
                {name:" 512 x  512",    R:[ 512, 512]}]

  senseWs =[{name:" XL sensorspan", A:[0,-pi/ 5,pi/ 5]},
            {name:"  L sensorspan", A:[0,-pi/ 8,pi/ 8]},
            {name:"  M sensorspan", A:[0,-pi/13,pi/13]},
            {name:"  S sensorspan", A:[0,-pi/21,pi/21]},
            {name:" XS sensorspan", A:[0,-pi/34,pi/34]},
            {name:"XXS sensorspan", A:[0,-pi/55,pi/55]}];

  senseLs =[  {name:"XXS sensorlength", L:[ 2, 2, 2]},
              {name:" XS sensorlength", L:[ 3, 3, 3]},
              {name:"  S sensorlength", L:[ 5, 5, 5]},
              {name:"  M sensorlength", L:[ 8, 8, 8]},
              {name:"  L sensorlength", L:[13,13,13]},
              {name:" XL sensorlength", L:[21,21,21]},
              {name:"XXL sensorlength", L:[34,34,34]}];

  colors = [{name:"SMEAR",              C:color('#000000')}, // not really a color!
            {name:"black        [0] ",  C:color('#000000')},
            {name:"white        [0] ",  C:color('#FFFFFF')},
            {name:"dark         [1] ",  C:color('#343642')},
            {name:"milk         [1] ",  C:color('#f2ebc7')},
            {name:"teal         [1] ",  C:color('#348899')},
            {name:"firebrick    [1] ",  C:color('#962d3e')},
            {name:"soil         [2] ",  C:color('#776045')},
            {name:"algae        [2] ",  C:color('#a8c545')},
            {name:"dirt         [2] ",  C:color('#dfd3b6')},
            {name:"oceanblue    [2] ",  C:color('#0092b2')},
            {name:"vintage ink  [3] ",  C:color('#5C4B51')},
            {name:"vintage teal [3] ",  C:color('#8CBEB2')},
            {name:"pergament    [3] ",  C:color('#F2EBBF')},
            {name:"orange       [3] ",  C:color('#F3B562')},
            {name:"dull pink    [3] ",  C:color('#F06060')}
          ];

  attractions = [
              {name:"autophilic",       f:function(rgba,self){return  sq(rgba[0]-self[0])+sq(rgba[1]-self[1])+sq(rgba[2]-self[2]);}},
              {name:"autophobic",       f:function(rgba,self){return -sq(rgba[0]-self[0])-sq(rgba[1]-self[1])-sq(rgba[2]-self[2]);}},
              {name:"dark   attractor", f:function(rgba,self){return sq(rgba[0])+sq(rgba[1])+sq(rgba[2]);}},
              {name:"bright attractor", f:function(rgba,self){return sq(rgba[0]-255)+sq(rgba[1]-255)+sq(rgba[2]-255);}},
              {name:"red   attractor",  f:function(rgba,self){return sq(rgba[0]);}},
              {name:"red repulsor",     f:function(rgba,self){return sq(rgba[0]-255);}},
              {name:"green   attractor",f:function(rgba,self){return sq(rgba[1]);}},
              {name:"green repulsor",   f:function(rgba,self){return sq(rgba[1]-255);}},
              {name:"blue   attractor", f:function(rgba,self){return sq(rgba[2]);}},
              {name:"blue repulsor",    f:function(rgba,self){return sq(rgba[2]-255);}}
            ]
}
