
// FOUND AT
// https://ssd.jpl.nasa.gov/horizons.cgi#top
// Ephemeris Type [change] : 	VECTORS
// Target Body [change] : 	?????
// Coordinate Origin [change] : 	Solar System Barycenter (SSB) [500@0]
// Time Span [change] : 	Start=2019-11-24, Stop=2019-12-24, Step=1 d
// Table Settings [change] : 	defaults
// Display/Output [change] : 	default (formatted HTML)

// VIEW
var zoom  = 100
var s     = 1
var cPos  = [0,0]
var centerplanet = 0
var numberformat = new Intl.NumberFormat({ maximumSignificantDigits: 3 });
var toexp = function (x,f) {  return Number.parseFloat(x).toExponential(f); }
// UNITS
var DAY   = 1
var AU    = 1
var Msun  = 1
var PI    = 3.141592563589793238
var kg,km,second,yr,G,gPRcm3;
var OBJECTS;
// TIME
var play           = true
var iterationjump  = 60
var dt = 30/24/60/iterationjump
var t              = 0
var date0          = "2019/11/24"
var dateoptions    = {year: 'numeric', month: 'long', day: 'numeric'};
// COLORS
let backgroundC,backgroundCC,trajectoryC,textC,planetC,labelC;


function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  buffer = createGraphics(windowWidth, windowHeight);

  textFont('Georgia');
  backgroundC = color(0,0,0)
  backgroundCC= color(0,0,0,100)
  trajectoryC = color(255,50)
  textC       = color(255,150)
  planetC     = color(255,50)
  labelC      = color("#EFC94C")

  buffer.background(backgroundC)
  frameRate(60)
  // Derived units
  kg      = 1/1988500e24 * Msun
  km      = 6.68459e-9   * AU
  second  = 1.15741e-5   * DAY
  yr      = 365.2422     * DAY
  gPRcm3  = 1e12*kg/(km*km*km)
  // Constants
  G  = 4*PI*PI/(1.000003040321850) * AU*AU*AU/(Msun*yr*yr);

  today = new Date()
  time0 = new Date(date0); // time of evalutation of positions
  time  = new Date(date0)

  OBJECTS = [];
  defineObjects();
  for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].prepare(OBJECTS)}

  evolveTo(new Date(),precise=true)
  addSlider(createSlider(-120, 120, 24*10*iterationjump*dt, 0.0001), "TIMESTEP [minutes]", function () {this.attribute("value",this.value()); dt=this.value()/24/60/iterationjump; })
  addSlider(createSlider(1, 1000, s, 1), "Radius Scaling", function () {this.attribute("value",this.value()); s=this.value(); })
  addSlider(createSlider(0, log(1e5), log(zoom), 0.1), "Zoom", function () {this.attribute("value",this.value()); var zr = exp(this.value())/zoom; buffer.image(buffer, 0.5*buffer.width*(1-zr),0.5*buffer.height*(1-zr), buffer.width*zr, buffer.height*zr); zoom=exp(this.value()); buffer.background(backgroundCC) })
  addButton(createButton('Play/pause'), function (){play = !play; } )
  addButton(createButton('To present'), function (){ evolveTo(new Date(),precise=true); } )
  addButton(createButton('Next object'), function (){ centerplanet += 1; centerplanet = (centerplanet+OBJECTS.length)%OBJECTS.length; buffer.background(backgroundC) } )
  addButton(createButton('Previous object'), function (){ centerplanet -= 1; centerplanet = (centerplanet+OBJECTS.length)%OBJECTS.length; buffer.background(backgroundC) } )
  addButton(createButton('Realtime'), function (){ dt = (1/60)/24/60/60/iterationjump } )
  addButton(createButton('Draw orbits'), function (){ drawOrbits(days=100) } )
}

function draw(){
  background(255)
  if(play){
    for(var j=0; j<iterationjump; j++){
      for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].move(dt)} // first find new positions
      for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].update()} // then update them
      t += dt
    }
    time  = new Date(date0)
    time.setMinutes(time0.getMinutes() + 1440*t)
  }

  fill(255,100)
  buffer.push()
  buffer.translate(width/2,height/2)
  image(buffer, 0, 0);
  for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].show(zoom,s)}
  buffer.pop()

  fill(0)
  textSize(30)
  textAlign(RIGHT)
  fill(textC)
  text(time.toLocaleString("en-US",{hour:"2-digit",minute:"2-digit",hour12:false})+" on "+time.toLocaleString("en-US",dateoptions),width-10,height-30)
  // text(time.toISOString(),width-10,height-30)
  textSize(14)
  textAlign(LEFT,BOTTOM)
  obj = OBJECTS[centerplanet]
  text(obj.name+"\n mass: " + toexp(obj.m/kg,3).replace("e+"," [10^") + " kg]\n radius: " + toexp(obj.radius/km,3).replace("e+"," [10^")+" km]",10,height-30)
  textAlign(LEFT,TOP)
}

function evolveTo(then,precise=false, dtFast = 30/24/60, dtMinute=1/24/60){
  console.log(precise)
  dt0 = dt
  var diff = then-time
  sign = (diff<0) ? -1 : 1
  dt = sign*dtFast // 30 min
  num = 0
  while(sign*(then-time)>0 & num<1e6){
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].move(dt)} // first find new positions
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].update()} // then update them
    t += dt
    time  = new Date(date0)
    time.setMinutes(time0.getMinutes() + 1440*t)
    num += 1
    if(sign*(then-time)<=1800000 & precise){dt = sign*dtMinute}
  }
  dt = dt0
}

function drawOrbits(days = 365){
  dt0 = dt
  then = new Date(time)
  then.setMinutes(then.getMinutes() + 1440*days)
  var diff = then-time
  sign = (diff<0) ? -1 : 1
  dt = sign*30/24/60 // 30 min
  num = 0
  while(sign*(then-time)>0 & num<1e6){
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].move(dt)} // first find new positions
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].update()} // then update them
    t += dt
    time  = new Date(date0)
    time.setMinutes(time0.getMinutes() + 1440*t)
    num += 1
    if(num%100==0){
      buffer.push()
      buffer.translate(width/2,height/2)
      image(buffer, 0, 0);
      for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].addToBuffer(zoom,s)} // then update them
      buffer.pop()
    }
  }
  then = new Date(time)
  then.setMinutes(then.getMinutes() - 2*1440*days)
  var diff = then-time
  sign = (diff<0) ? -1 : 1
  dt = sign*30/24/60 // 30 min
  num = 0
  while(sign*(then-time)>0 & num<1e6){
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].move(dt)} // first find new positions
    for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].update()} // then update them
    t += dt
    time  = new Date(date0)
    time.setMinutes(time0.getMinutes() + 1440*t)
    num += 1
    if(num%100==0){
      buffer.push()
      buffer.translate(width/2,height/2)
      image(buffer, 0, 0);
      for(var i=0; i<OBJECTS.length;i++){OBJECTS[i].addToBuffer(zoom,s)} // then update them
      buffer.pop()
    }
  }
  dt = dt0
  evolveTo(new Date())
}


// -----------------------------------------------------------------------------
class PlanetaryObject{
  constructor(name,m,rho,R,V,hierarchy=1,radius=null,c=null){
    this.color = (c==null) ? color('hsba('+int(random(0,255))+', 62%, 62%, 0.5)') : c
    this.name   = name
    this.radius = (radius==null) ? Math.pow(rho*3*m/(4*PI),1/3.) : radius
    this.hierarchy = hierarchy
    this.m      = m;      // kg
    this.R      = R;      // au
    this.V      = V;      // au/day
    this.Vn = [0,0,0];
    this.Rn = [0,0,0];
  }

  prepare(objects){ this.A = this.acceleration(objects) }


  acceleration(objects){
    var F = [0,0,0]
    for(var i=0; i<objects.length; i++){
        if(this.name!=objects[i].name){
          var dr = [objects[i].R[0]-this.R[0],objects[i].R[1]-this.R[1],objects[i].R[2]-this.R[2]]
          var dR = sqrt(sq(dr[0])+sq(dr[1])+sq(dr[2]))
          var Fmag = G*objects[i].m/(sq(dR)*dR)
          F[0] += Fmag*dr[0]
          F[1] += Fmag*dr[1]
          F[2] += Fmag*dr[2]
        } }
    return F
  }

  move(dt){ // VELOCITY VERLET
    this.Vn[0] = this.V[0] + 0.5*this.A[0]*dt
    this.Vn[1] = this.V[1] + 0.5*this.A[1]*dt
    this.Vn[2] = this.V[2] + 0.5*this.A[2]*dt
    this.Rn[0] = this.R[0] + this.Vn[0]*dt
    this.Rn[1] = this.R[1] + this.Vn[1]*dt
    this.Rn[2] = this.R[2] + this.Vn[2]*dt
    this.A = this.acceleration(OBJECTS)
    this.Vn[0] = this.Vn[0] + 0.5*this.A[0]*dt
    this.Vn[1] = this.Vn[1] + 0.5*this.A[1]*dt
    this.Vn[2] = this.Vn[2] + 0.5*this.A[2]*dt
  }

  update(){
    this.R = this.Rn
    this.V = this.Vn
  }

  addToBuffer(zoom,s,hierarchy=null){
    if(hierarchy==null){ hierarchy = (zoom>=width) ? 3 : 2 }
    var X = (this.Rn[0]+cPos[0]-OBJECTS[centerplanet].Rn[0])*zoom
    var Y = (this.Rn[1]+cPos[1]-OBJECTS[centerplanet].Rn[1])*zoom
    if(this.hierarchy<=hierarchy){
      buffer.stroke(this.color)
      buffer.point(X,Y)
    }
  }

  show(zoom,s,hierarchy=null){
    if(hierarchy==null){ hierarchy = (zoom>=width) ? 3 : 2 }
    var X = (this.Rn[0]+cPos[0]-OBJECTS[centerplanet].Rn[0])*zoom
    var Y = (this.Rn[1]+cPos[1]-OBJECTS[centerplanet].Rn[1])*zoom
    if(this.name=="Sun"){s=1} // dont scale sun
    if(this.hierarchy<=hierarchy){
      buffer.stroke(this.color)
      buffer.point(X,Y)
      noStroke();
      fill(this.color)
      ellipse(X+width/2,Y+height/2,s*zoom*this.radius,s*zoom*this.radius)
    }
    if(this.hierarchy<hierarchy){
      fill(labelC)
      textAlign(CENTER)
      text(this.name,X+width/2,Y+height/2)
    }
  }
}

// ================================================================================
function keyPressed(){
  if(keyCode==38){ // UP
  }else if(keyCode==40){ // DOWN
  }else if(keyCode==39){ // RIGHT
    centerplanet += 1
    centerplanet = (centerplanet+OBJECTS.length)%OBJECTS.length
    buffer.background(backgroundC)
  }else if(keyCode==37){ // LEFT
    centerplanet -= 1
    centerplanet = (centerplanet+OBJECTS.length)%OBJECTS.length
    buffer.background(backgroundC)
  }else if(keyCode==90){ // Z
    zoom *= 1.2
    buffer.image(buffer, -0.5*0.2*buffer.width,-0.5*0.2*buffer.height, buffer.width*1.2, buffer.height*1.2);
    buffer.background(backgroundCC)
  }else if(keyCode==88){ // X
    zoom /= 1.2
    buffer.image(buffer, 0.5*buffer.width*(1-1/1.2),0.5*buffer.height*(1-1/1.2), buffer.width/1.2, buffer.height/1.2);
    buffer.background(backgroundCC)
  }else if(keyCode==32){ // SPACE
    play = !play;
  }
  console.log(keyCode)
  return false
}

function mouseDragged(){
  if(mouseY<height){
    var dx = mouseX-pmouseX
    var dy = mouseY-pmouseY
    cPos[0] += dx/zoom
    cPos[1] += dy/zoom
    buffer.image(buffer, dx, dy);
  }
}

function addSlider(S,text,updatefunc){
  S.parent(window.document.getElementById('control-holder'))
  S.attribute("value",S.value())
  S.attribute("text",text)
  S.input(updatefunc);
  return S;
}

function addButton(B,onpress){
  B.parent(window.document.getElementById('control-holder'))
  B.mousePressed(onpress)
}


// ================================================================================


function defineObjects(){
  OBJECTS.push(new PlanetaryObject("Sun",1988500e24*kg,1.408/gPRcm3,
      [-3.479548933206940E-03, 7.507892942541419E-03,  1.423980327224241E-05],
      [-8.435057902017636E-06, -1.581020074796732E-06,  2.316035750316440E-07],
      hierarchy=0,radius=696340*km))
  OBJECTS.push(new PlanetaryObject("Mercury",3.302e23*kg,5.427/gPRcm3,
      [-1.876381520248047E-01, 2.729851094974095E-01,  3.860137493283028E-02],
      [-2.880212527702528E-02,-1.494342400244370E-02,1.420667180887246E-03],
      hierarchy=1,radius=2439.7*km))
  OBJECTS.push(new PlanetaryObject("Venus",48.685e23*kg,5.204/gPRcm3,
      [4.023968825346559E-01, -5.962091282848500E-01, -3.169155319477308E-02],
      [1.664224228107012E-02, 1.121337992902592E-02,-8.067471145448681E-04],
      hierarchy=1,radius=6051.8*km))
  OBJECTS.push(new PlanetaryObject("Earth",5.97219e24*kg,5.51/gPRcm3,
      [4.733899044729349E-01 ,8.721655186632229E-01, -2.915378785978234E-05],
      [-1.535782803583044E-02, 8.248519548534240E-03, 8.701911397566279E-08],
      hierarchy=1,radius=6371*km))
  OBJECTS.push(new PlanetaryObject("Mars",6.4171e23*kg,3.933/gPRcm3,
      [-1.566507615289128E+00,-4.433615397451655E-01,  2.891647917431645E-02],
      [4.391855643405547E-03,-1.225048536738343E-02,-3.644055920216107E-04],
      hierarchy=1,radius=3389.5*km))
  OBJECTS.push(new PlanetaryObject("Jupiter",1898.13e24*kg,1.326/gPRcm3,
      [2.398987905478092E-01, -5.228171375084345E+00,  1.631569440344870E-02],
      [7.446437966068977E-03,7.062325348503164E-04,-1.694754675721655E-04],
      hierarchy=1,radius=69911*km))
  OBJECTS.push(new PlanetaryObject("Saturn",5.6834e26*kg,0.687/gPRcm3,
      [3.608156454272707E+00, -9.358275564678564E+00,  1.908357576490018E-02],
      [4.896951055905732E-03,  1.989884808683989E-03, -2.292889283131322E-04],
      hierarchy=1,radius=58232*km))
  OBJECTS.push(new PlanetaryObject("Uranus",86.813e24*kg,1.271/gPRcm3,
      [1.630821662260476E+01,  1.127079949171262E+01, -1.694148786793367E-01],
      [-2.264989811476159E-03, 3.052281082250763E-03,  4.077335412490153E-05],
      hierarchy=1,radius=25362*km))
  OBJECTS.push(new PlanetaryObject("Neptune",102.413e24*kg,1.638/gPRcm3,
      [2.921421858952530E+01, -6.476969762720352E+00, -5.398896941636903E-01],
      [6.588961955221450E-04,  3.083793907671489E-03, -7.849918779045290E-05],
      hierarchy=1,radius=24622*km))
  OBJECTS.push(new PlanetaryObject("ganymede",1482e20*kg,1.94/gPRcm3,
      [2.395026592191973E-01, -5.221027735991870E+00,  1.658125273503958E-02],
      [1.175713154753192E-03,  3.739345366573758E-04, -2.669029234793870E-04],
      hierarchy=2,radius=2634.1*km))
  OBJECTS.push(new PlanetaryObject("Titan",13455.3e19*kg,1.880/gPRcm3,
      [3.614581049204343E+00, -9.354301777353360E+00,  1.639596372648561E-02],
      [3.015529906786324E-03,  4.447469385100544E-03, -1.308797299398324E-03],
      hierarchy=2,radius=2574.7*km))
  OBJECTS.push(new PlanetaryObject("Callisto",1076e20*kg,1.851/gPRcm3,
      [2.309391455919436E-01, -5.237099757979207E+00,  1.591339876323325E-02],
      [1.078829804499844E-02, -2.614813825368700E-03, -2.292944111904776E-04],
      hierarchy=2,radius=2410.3*km))
  OBJECTS.push(new PlanetaryObject("Io",893.3e20*kg,3.530/gPRcm3,
      [2.374309519355300E-01, -5.226813260521281E+00,  1.632928306577299E-02],
      [2.581200915250378E-03, -8.046466476316565E-03, -5.601519022307468E-04],
      hierarchy=2,radius=1821.6*km))
  OBJECTS.push(new PlanetaryObject("Moon",7.349e22*kg,3.3437/gPRcm3,
      [4.711953447714849E-01,  8.710900717136029E-01,  1.818446162250391E-04],
      [-1.509113308996579E-02,  7.689876296218871E-03, -1.609428746041303E-05],
      hierarchy=2,radius=1737.1*km))
  OBJECTS.push(new PlanetaryObject("Europa",479.7e20*kg,2.99/gPRcm3,
      [2.416214051431489E-01, -5.232274953191260E+00,  1.618482144669543E-02],
      [1.483448831946814E-02,  3.750357969044653E-03,  1.103980055677597E-04],
      hierarchy=2,radius=1560.8*km))
  OBJECTS.push(new PlanetaryObject("Pluto",1.307e22*kg,1.86/gPRcm3,
      [1.285990230840684E+01, -3.138276448501142E+01, -3.617005212124610E-01],
      [2.975164667645290E-03,  5.296407568110372E-04, -9.045237793018655E-04],
      hierarchy=1,radius=1188.3*km))
  OBJECTS.push(new PlanetaryObject("Triton",214.7e20*kg,2.054/gPRcm3,
      [2.921587280200924E+01, -6.477326586914225E+00, -5.415479029135662E-01],
      [-6.192374693337490E-04,  1.061016987936212E-03, -9.168646889495590E-04],
      hierarchy=2,radius=1353.4*km))
}
