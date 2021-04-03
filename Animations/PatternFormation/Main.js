
var showWalkers = true;
var pi          = 3.141592653589;
var mouseMode   = "create";
var attractmode = "s";
var play        = true
var mouseSize   = 20;
var phi  = [0.618033];
for(var k=0; k<10; k++){phi.push(phi[phi.length-1]*phi[0])}
var SMOOTHER  = [[1/9.,1/9.,1/9.],
                 [1/9.,1/9.,1/9.],
                 [1/9.,1/9.,1/9.]]
var BOIDMODEL,resolutions,senseWs,senseLs,attractions,colors,steplengths,colorInput;
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
  BOIDMODEL   = new Boid(new Sensor(senseWs[1].A,senseLs[1].L),new Navigator(1,phi[0],phi[0]),attractions[0].f,colors[1].C)
  makeControls();
}


function draw(){
  // several iterations each draw
  background(255);
  image(buffer, 0, 0,width,height);
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
  if(play){
  for(var k =0;k<10;k++){
    buffer.loadPixels()
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].sense();}
    for(var n=0; n<BOIDS.length; n++){BOIDS[n].act();}
    buffer.updatePixels();
  }
  }
}




//==============================================================================


function defineGlobals(){
  resolutions =[{name:" 600 x  400",    R:[ 600, 400]},
                {name:"2048 x 1536",    R:[2048,1536]},
                {name:"2048 x 2048",    R:[2048,2048]},
                {name:"1024 x 1024",    R:[1024,1024]},
                {name:" 512 x  512",    R:[ 512, 512]}]

  senseWs =[{name:"tetral sensorspan", A:[0,-2*pi/3,2*pi/3]},
            {name:"XXL sensorspan", A:[0,-pi*phi[1],pi*phi[1]]},
            {name:" XL sensorspan", A:[0,-pi*phi[2],pi*phi[2]]},
            {name:"  L sensorspan", A:[0,-pi*phi[3],pi*phi[3]]},
            {name:"  M sensorspan", A:[0,-pi*phi[4],pi*phi[4]]},
            {name:"  S sensorspan", A:[0,-pi*phi[5],pi*phi[5]]},
            {name:" XS sensorspan", A:[0,-pi*phi[6],pi*phi[6]]},
            {name:"XXS sensorspan", A:[0,-pi*phi[7],pi*phi[7]]}];

  senseLs =[  {name:"XXS sensorlength", L:2},
              {name:" XS sensorlength", L:3},
              {name:"  S sensorlength", L:5},
              {name:"  M sensorlength", L:8},
              {name:"  L sensorlength", L:13},
              {name:" XL sensorlength", L:21},
              {name:"XXL sensorlength", L:34}];

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
            {name:"dull pink    [3] ",  C:color('#F06060')},
            {name:"X1 ", C:color('#9768D1')},
            {name:"X2 ", C:color('#553285')},
            {name:"X3 ", C:color('#685C79')},
            {name:"X4 ", C:color('#455C7B')},
            {name:"X5 ", C:color('#AC6C82')},
            {name:"X6 ", C:color('#BF8A49')},
            {name:"X7 ", C:color('#0074D9')},
            {name:"X8 ", C:color('#FFE87A')},
            {name:"X9 ", C:color('#E62738')}
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

  steplengths = [
    {name:"px steplength",    V:1},
    {name:"L steplength",     V:1/phi[0]},
    {name:"XL steplength",    V:1/phi[1]},
    {name:"XXL steplength",   V:1/phi[2]}
  ]
}
