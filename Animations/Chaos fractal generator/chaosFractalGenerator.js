
var reductionfactor = 3.;

var points     = [];
var iterate    = true;
var iterations = 0;
var iterationsPerDraw = 1000;
var mode = "Default" //"Default";
var p0 = new Iterator(0,0);

var pressDistSq, pointD;

var reductionSlider;
var modeSelector;
var removePointsButton;

function setup(){
  createCanvas(windowWidth,windowHeight);

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

  pressDistSq = sq(10);
  pointD      = 10;

  noStroke();

  modeSelector = createSelect();
  modeSelector.option("Default");
  modeSelector.option("Barnsley");
  modeSelector.position(50,50);

  removePointsButton = createButton("Remove points");
  removePointsButton.position(350,50);
  removePointsButton.mousePressed(removePoints);

  reductionSlider = createSlider(1, 3., 2., 0.1)
  reductionSlider.position(150,50);

}

function draw(){
  if(iterate){
    for(var j=0; j<iterationsPerDraw;j++){
      iterations += 1;
      if(mode=="Barnsley"){
        reductionSlider.hide();
        p0.iterateBarnsleysFern();
        stroke(c12);
        // point(p0.x+width/2,height/2-p0.y);
        point(width/2+0.3*p0.x,height-0.3*p0.y);
      }else if(mode=="Default"){
        reductionSlider.show();
        p0.iterate(reductionfactor);
        stroke(c12);
        point(p0.x,p0.y);
      }

    }
  }else{
    refreshPoints();
  }

  noStroke();
  if(mode=="Default"){
    fill(255);
    rect(0,0,width,80);
    fill(0);
    text(reductionSlider.value(),290,55);
    text("reduction factor",150,40);
    reductionfactor = reductionSlider.value();
  }
  if(mode!=modeSelector.value()){
    points = new Array();
    mode = modeSelector.value();
  }
}



function Iterator(x,y) {
  this.x = x;
  this.y = y;
  this.f1 = {
      a:0,        b:0,      c:1,
      d:0.16,     e:0,      f:0,
      p:0.01
  };
  this.f2 = {
      a:0.85,	    b:0.04,   c:-0.04,
      d:0.85,	    e:0,    	f:1.60,
      p:0.85
  }
  this.f3 = {
      a:0.20,	    b:-0.26,	c:0.23,
      d:0.22,	    e:0,      f:1.60,
      p:0.07
  }
  this.f4 = {
      a:-0.15,    b:0.28,	  c:0.26,
      d:0.24,   	e:0,      f:0.44,
      p:0.07
  }

  this.iterate = function(rf) {
    if(points.length>0){
      var p = random(points);
      var dx = (p.x-this.x)/rf;
      var dy = (p.y-this.y)/rf;
      this.x += dx;
      this.y += dy;
    }
  };

  this.iterateBarnsleysFern = function(){
    var rnd = random();

    if(rnd<this.f1.p){
      this.f(this.f1);
    }else if(rnd<this.f1.p+this.f2.p){
      this.f(this.f2);
    }else if(rnd<this.f1.p+this.f2.p+this.f3.p){
      this.f(this.f3);
    }
    else{
      this.f(this.f4);
    }

  }

  this.setBarnsleypoints = function(points){
    this.f1.e = points[0].x-width/2
    this.f1.f = points[0].y

    this.f2.e = points[1].x-width/2
    this.f2.f = points[1].y

    this.f3.e = points[2].x-width/2
    this.f3.f = points[2].y

    this.f4.e = points[3].x-width/2
    this.f4.f = points[3].y
  }

  this.f = function(o){ // general affine transformation
    xi = o.a*this.x + o.b*this.y + o.e
    yi = o.c*this.x + o.d*this.y + o.f
    this.x = xi
    this.y = yi
  }
}

function Point(x,y) {
  this.x = x;
  this.y = y;

  this.display = function(col) {
      fill(col);
      ellipse(this.x, this.y,pointD,pointD);
  };
}






function refreshPoints(){
  background(255);
  for(var i =0; i<points.length; i++){
    points[i].display(c13);
  }
}



function removePoints(){
  points = new Array();
}


function keyPressed(){
  if(keyCode==32 && mode=="Barnsley"){
    var cx = width;
    var cy = height/2;
    var s  = 1;
    points = [
      new Point(cx+s*0,cy+s*0),
      new Point(cx+s*0,cy+s*1.6),
      new Point(cx+s*0,cy+s*1.6),
      new Point(cx+s*0,cy+s*0.44)
    ]
  }else{
    iterate=!iterate;
  }
}

function mousePressed(){
  if(mode=="Barnsley" && mouseY>60){
    var notHover = true;
    for(var i=0; i<points.length; i++){
      if( sq(mouseX-points[i].x)+sq(mouseY-points[i].y) < pressDistSq){
        notHover = false;
      }
    }
    if(notHover){
      points.push(new Point(mouseX,mouseY));
    }
    if(points.length>4){ points.splice(0, 1); }
    p0.setBarnsleypoints(points);
  }else if(mode=="Default"){
    if(mouseY>60){
      points.push(new Point(mouseX,mouseY));
      p0.x = mouseX;
      p0.y = mouseY;
    }
  }
  refreshPoints();
}

function mouseDragged(){
  refreshPoints();
  if(points.length>=4){
    for(var i=0; i<points.length; i++){
      if( sq(mouseX-points[i].x)+sq(mouseY-points[i].y) < pressDistSq){
        points[i].display(c10);
        points[i].x = mouseX;
        points[i].y = mouseY;
      }
    }
    p0.setBarnsleypoints(points);
  }

}


//
