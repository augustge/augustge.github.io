

var sunflower;
var controlpanel;


function setup(){
  createCanvas(windowWidth, windowHeight);
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

  Cseed                 = c14
  CseedOld              = c2
  CsunflowerBackground  = c2
  Cbackground           = c12
  Ctext                 = c8

  sunflower = new Sunflower(width/2,height/2,1000)

  controlpanel = new ControlPanel()
  controlpanel.initiate()
}

function draw(){
  background(Cbackground)

  sunflower.do()
  sunflower.display()
  controlpanel.update()
  controlpanel.display()
}



function Sunflower(cx,cy,N){
  this.age = 0
  this.t   = 0
  this.cx   = cx
  this.cy   = cy
  this.N    = N
  this.phi  = 0.6180339887
  this.seeds = []
  this.growthRate = 1.
  this.seedSize = 5

  this.populate = function(num){
    for(var n=0; n<num; n++){
      this.do()
    }
  }

  this.makeSeed = function(){
    var seed = new Seed(1,this.t)
    this.seeds.push(seed)
    this.t += this.phi*TWO_PI
  }

  this.do = function(){
    this.age += this.growthRate
    if(this.age>1){
      this.makeSeed()
      this.age = 0
    }
    if(this.seeds.length>this.N){
      delete this.seeds[0]
      this.seeds.shift()
    }
    for(var i=0; i<this.seeds.length; i++){
      this.seeds[i].do(1.5*sqrt(PI*this.growthRate))
    }

  }

  this.display = function(){
    // noStroke()
    // fill(CsunflowerBackground)
    // ellipse(this.cx,this.cy,100,100)
    push()
    translate(this.cx,this.cy)
    for(var i=0; i<this.seeds.length; i++){
      this.seeds[i].display(this.seedSize)
    }
    pop()
  }
}

function Seed(r,t){
  this.r = r
  this.t = t
  this.age = 0

  this.do = function(speed){
    this.r += speed/this.r
    this.age += speed
  }

  this.display = function(size){
    var X = this.r * cos(this.t)
    var Y = this.r * sin(this.t)
    noStroke()

    var fak = this.age/1000.
    fill(lerpColor(Cseed, CseedOld, fak))
    ellipse(X,Y,size,size)
  }
}



//------------------------------------

function ControlPanel(){


  this.initiate = function(){
    this.populateButton = createButton('populate');
    this.populateButton.mousePressed(populatePressed);
    this.populateButton.position(20,30);

    this.Nslider = createSlider(100, 10000, sunflower.N, 1)
    this.Nslider.position(20,50);

    // this.angleSlider = createSlider(0, 1, sunflower.phi, 0.001)
    // this.angleSlider.position(20,70);

    this.selectAngle = createSelect();
    this.selectAngle.position(20,70);
    this.selectAngle.option('golden ratio');
    this.selectAngle.option('pi');
    this.selectAngle.option('eulers constant');
    this.selectAngle.option('sqrt(2)');
    this.selectAngle.option('5/8');
    this.selectAngle.option('8/13');
    this.selectAngle.option('21/34');

    this.selectAngle.changed(angleSelection);
  }

  this.display = function(){
    fill(Ctext)
    text("Number of seeds",150,55)
    // text("Phyllotaxis angle",150,75)
  }

  this.update = function(){
    sunflower.N   = this.Nslider.value()
    // sunflower.phi = this.angleSlider.value()

  }
}

function populatePressed(){
  sunflower.populate(10000)
}

function angleSelection(){
  if(controlpanel.selectAngle.value()=="golden ratio"){
    sunflower.phi = (1+sqrt(5))/2.
  }else if(controlpanel.selectAngle.value()=="pi"){
    sunflower.phi = 0.1415926535897932384626433832795
  }else if(controlpanel.selectAngle.value()=="eulers constant"){
    sunflower.phi = 0.7182818284590452353602874713527
  }else if(controlpanel.selectAngle.value()=="5/8"){
    sunflower.phi = 5/8.
  }else if(controlpanel.selectAngle.value()=="8/13"){
    sunflower.phi = 8/13.
  }else if(controlpanel.selectAngle.value()=="21/34"){
    sunflower.phi = 21/34.
  }else if(controlpanel.selectAngle.value()=="sqrt(2)"){
    sunflower.phi = sqrt(2)-1
  }
  print(sunflower.phi)
}
