

var S = [[150,0],[0,150]]; // spanning lattice square

var bufferSize = [150,150];

var SYM;


function setup(){
  defineColors();
  createCanvas(window.innerWidth-10, window.innerHeight-10);

  // blendMode(MULTIPLY);

  SYM = new SymmetryBase(S);
  var symmetry = generate_p2(S[0],S[1])
  SYM.symmetries = SYM.symmetries.concat(symmetry)

  // var symmetry = generate_p2(S[0],S[1])
  // var symmetry = generate_pm(S[0],S[1])
  // var symmetry = generate_pg(S[0],S[1])
  // var symmetry = generate_cm(S[0],S[1])
  // var symmetry = generate_pmm(S[0],S[1])


  dropdown = createSelect();
  dropdown.option("P1 ", 0 )
  dropdown.option("P2 ", 1 )
  dropdown.option("Pm ", 2 )
  dropdown.option("Pg ", 3 )
  dropdown.option("Cm ", 4 )
  dropdown.option("Pmm", 5 )
  dropdown.option("Pmg", 6 )
  dropdown.changed(dropdownChanged)
  dropdown.selected(1)
  dropdown.position(50,50)

  button = createButton('clear canvas');
  button.position(50,70);
  button.mousePressed(clearCanvas);



  background(255);
  translate(width/2,height/2)
  scale(1,-1)
  SYM.showLattice()
  noLoop();
}


function draw(){
  translate(width/2,height/2)
  scale(1,-1)

  // image(buffer, width/2, -height/2);

  // SYM.showLattice()
  // SYM.showPoints()
}


function SymmetryBase(S){
  this.S = S;
  this.points = [];
  this.symmetries = [new Translation(S[0],S[1],1,1)];
  // this.symmetries = [];

  this.showLattice = function(){
    stroke(230)
    fill(230)
    beginShape();
      vertex(0,0)
      vertex(this.S[0][0],this.S[0][1])
      vertex(this.S[0][0]+this.S[1][0],this.S[0][1]+this.S[1][1])
      vertex(this.S[1][0],this.S[1][1])
    endShape(CLOSE);
    for(var i=this.symmetries.length-1; i>=0; i--){
      this.symmetries[i].show();
    }
  }


  this.addPoint = function(x,y){
    if(x<width && y<height){
      this.drawSympoints(x,y)
      this.points.push([x,y])
    }
  }


  this.rotation = function(cx,cy,theta,x,y){
    xn = cx + (x-cx)*cos(theta) + (y-cy)*sin(theta)
    yn = cy - (x-cx)*sin(theta) + (y-cy)*cos(theta)
    return [xn,yn]
  }

  this.collectSympoints = function(x,y){
    var points = [[x,y]]
    for(var i=this.symmetries.length-1; i>=0; i--){
      var symmetry = this.symmetries[i];
      var addedPoints = []

      for(var j=0; j<points.length; j++){
          var sympoints = symmetry.getAll(points[j][0],points[j][1])
          addedPoints = addedPoints.concat(sympoints);
          print(j,[points[j][0],points[j][1]],sympoints)
      }
      points = points.concat(addedPoints);
    }
    return points
  }

  this.drawSympoints = function(x,y){
    var points = [[x,y]]
    for(var i=this.symmetries.length-1; i>=0; i--){
      var symmetry = this.symmetries[i];
      var addedPoints = [];

      for(var j=0; j<points.length; j++){
          var sympoints = symmetry.getAll(points[j][0],points[j][1])
          addedPoints = addedPoints.concat(sympoints);
      }
      points = points.concat(addedPoints);
    }
    this.showPoint(x,y)
    for(var n=0; n<addedPoints.length; n++){
      this.showPoint(addedPoints[n][0],addedPoints[n][1])
    }
    return points
  }

  this.showPoint = function(x,y){
    stroke(0)
    point(x,y,3,3)
  }

  this.showPoints = function(){
    for(var i=0; i<this.points.length; i++){ // go through points
      var symPoints = this.getSympoints(this.points[i][0],this.points[i][1])
      for(var j=0; j<symPoints.length; j++){
          this.showPoint(symPoints[j][0],symPoints[j][1])
      }
    }
  }
}

// ===================================================


function Mirror(c,d){
  this.name = "reflect"
  this.c = c;
  var l = sqrt(d[0]*d[0]+d[1]*d[1])
  this.d = [d[0]/l,d[1]/l];

  this.do = function(x,y){
    var dot = (x-this.c[0])*this.d[0]+(y-this.c[1])*this.d[1]
    var proj = [ dot*this.d[0], dot*this.d[1] ]
    xn = 2*this.c[0] - x +2*proj[0]
    yn = 2*this.c[1] - y +2*proj[1]
    return [xn,yn]
  }

  this.getAll = function(x,y){
    return [[x,y],this.do(x,y)]
  }

  this.getAllDifferent = function(x,y){
    return [this.do(x,y)]
  }

  this.show = function(){
    var K = 1000
    stroke(glideColor)
    line(this.c[0]-K*this.d[0],this.c[1]-K*this.d[1],this.c[0]+K*this.d[0],this.c[1]+K*this.d[1])
  }
}

// ===================================================

function GlideReflection(c,d,L){ // c: point on line, d: dir of line, L: length of glide
  this.name = "glide"
  this.c = c;
  var l = sqrt(d[0]*d[0]+d[1]*d[1])
  this.d = [d[0]/l,d[1]/l];
  this.L = L

  this.do = function(x,y){
    xx = x + this.L * this.d[0]
    yy = y + this.L * this.d[1]
    var dot = (xx-this.c[0])*this.d[0]+(yy-this.c[1])*this.d[1]
    var proj = [ dot*this.d[0], dot*this.d[1] ]
    xn = 2*this.c[0] - xx +2*proj[0]
    yn = 2*this.c[1] - yy +2*proj[1]
    return [xn,yn]
  }

  this.getAll = function(x,y){
    return [[x,y],this.do(x,y)]
  }

  this.getAllDifferent = function(x,y){
    return [this.do(x,y)]
  }

  this.show = function(){
    var K = this.L
    stroke(glideColor)
    fill(glideColor)
    line(this.c[0],this.c[1],this.c[0]+K*this.d[0],this.c[1]+K*this.d[1])
    ellipse(this.c[0],this.c[0],3,3)
    ellipse(this.c[0]+K*this.d[0],this.c[1]+K*this.d[1],3,3)
  }
}

// ===================================================
function Rotation(cx,cy,N){
  this.name = "rotate"
  this.cx = cx;
  this.cy = cy;
  this.N  = N;
  this.dTheta = 2*PI/N;

  this.do = function(i,x,y){
    xn = cx + (x-this.cx)*cos(i*this.dTheta) + (y-this.cy)*sin(i*this.dTheta)
    yn = cy - (x-this.cx)*sin(i*this.dTheta) + (y-this.cy)*cos(i*this.dTheta)
    return [xn,yn]
  }

  this.getAll = function(x,y){
    var points = []
    for( var i = 0; i<this.N; i++){
      points.push(this.do(i,x,y))
    }
    return points
  }

  this.getAllDifferent = function(x,y){
    var points = []
    for( var i = 1; i<this.N; i++){
      points.push(this.do(i,x,y))
    }
    return points
  }

  this.show = function(){
    stroke(rotateColor)
    fill(rotateColor)
    var R = random()
    ellipse(this.cx,this.cy,3,3)
    var points = this.getAll(this.cx+10*cos(R),this.cy+10*sin(R))
    for( var i=0; i<points.length; i++){
      line(this.cx,this.cy,points[i][0],points[i][1])
      ellipse(points[i][0],points[i][1],3,3)
    }
  }
}



// ===================================================

function Translation(S1,S2,N1,N2){
  this.name = "translate"
  this.S1 = S1;
  this.S2 = S2;
  this.N1 = N1;
  this.N2 = N2;

  this.do = function(i,j,x,y){
    xn = x + i*this.S1[0] + j*this.S2[0]
    yn = y + i*this.S1[1] + j*this.S2[1]
    return [xn,yn]
  }

  this.getAll = function(x,y){
    var points = []
    for( var i = -this.N1; i<=this.N1; i++){
      for( var j = -this.N2; j<=this.N2; j++){
        points.push(this.do(i,j,x,y))
      }
    }
    return points
  }

  this.getAllDifferent = function(x,y){
    var points = []
    for( var i = -this.N1; i<=this.N1; i++){
      for( var j = -this.N2; j<=this.N2; j++){
        if(i!=0 || j!=0){
          points.push(this.do(i,j,x,y))
        }
      }
    }
    return points
  }

  this.show = function(){

  }
}

// ===================================================

function generate_p1(S1,S2){
  return [];
}

function generate_p2(S1,S2){
  var p2 = []
  var cx = (S1[0]+S2[0])/2
  var cy = (S1[1]+S2[1])/2
  p2.push( new Rotation(cx,cy,2) )
  return p2
}

function generate_pm(S1,S2){
  var pm = []
  var c = [(S1[0]+S2[0])/2,(S1[1]+S2[1])/2]
  var d = [S1[0],S1[1]]
  pm.push( new Mirror(c,d) )
  return pm
}

function generate_pg(S1,S2){
  var P = []
  var L = sqrt(S1[0]*S1[0]+S1[1]*S1[1])/2
  var c = [S2[0]/2,S2[1]/2]
  var d = [S1[0],S1[1]]
  P.push( new GlideReflection(c,d,L) )
  return P
}

function generate_cm(S1,S2){
  var P = []
  var L = sqrt(sq(S1[0]+S2[0])+sq(S1[1]+S2[1]))/2
  var c = [0,0]
  var d = [S1[0]+S2[0],S1[1]+S2[1]]
  P.push( new Mirror(c,d) )
  return P
}

function generate_pmm(S1,S2){
  var P = []
  var cx = (S1[0]+S2[0])/2
  var cy = (S1[1]+S2[1])/2
  P.push( new Rotation(cx,cy,2) )
  var c = [S1[0]/2,S1[1]/2]
  var d = [S2[0],S2[1]]
  P.push( new Mirror(c,d) )
  var c = [S2[0]/2,S2[1]/2]
  var d = [S1[0],S1[1]]
  P.push( new Mirror(c,d) )
  return P
}

function generate_pmg(S1,S2){
  var P = []
  // var cx = (S1[0]+S2[0]/2)/2
  // var cy = (S1[1]+S2[1]/2)/2
  // P.push( new Rotation(cx,cy,2) )
  var cx = (S1[0]/2+S2[0])/2
  var cy = (S1[1]/2+S2[1])/2
  P.push( new Rotation(cx,cy,2) )
  var c = [S1[0]/2,S1[1]/2]
  var d = [S2[0],S2[1]]
  P.push( new Mirror(c,d) )
  var L = sqrt(sq(S1[0])+sq(S1[1]))/2
  var c = [S2[0]/2,S2[1]/2]
  var d = [S1[0],S1[1]]
  P.push( new GlideReflection(c,d,L) )
  return P
}












// ===================================================


function dropdownChanged(){
  SYM = new SymmetryBase(S);
  var translations = [new Translation(S[0],S[1],1,1)];

  if(this.value()==0){
    var symmetry = generate_p1(S[0],S[1])
  }else if(this.value()==1){
    var symmetry = generate_p2(S[0],S[1])
  }else if(this.value()==2){
    var symmetry = generate_pm(S[0],S[1])
  }else if(this.value()==3){
    var symmetry = generate_pg(S[0],S[1])
  }else if(this.value()==4){
    var symmetry = generate_cm(S[0],S[1])
  }else if(this.value()==5){
    var symmetry = generate_pmm(S[0],S[1])
  }else if(this.value()==6){
    var symmetry = generate_pmg(S[0],S[1])
  }else{
    var symmetry = []
  }

  SYM.symmetries = SYM.symmetries.concat(symmetry)
  background(255)
  SYM.showLattice()
  // var symmetry = generate_p1(S[0],S[1])
  // var symmetry = generate_p2(S[0],S[1])
  // var symmetry = generate_pm(S[0],S[1])
  // var symmetry = generate_pg(S[0],S[1])
  // var symmetry = generate_cm(S[0],S[1])
  // var symmetry = generate_pmm(S[0],S[1])
}


function clearCanvas(){
  background(255)
  SYM.showLattice()
}


function mousePressed(){
  SYM.addPoint(mouseX-width/2,height/2-mouseY)
  redraw();
}

function mouseDragged(){
  SYM.addPoint(mouseX-width/2,height/2-mouseY)
  redraw();
}


function keyPressed(){
  print(keyCode)
  if(keyCode==37){ // LEFT
    PLAYER.moveLeft()
  }
  if(keyCode==39){ // RIGHT
    PLAYER.moveRight()
  }
  if(keyCode==38){ // UP
    PLAYER.moveUp()
  }
  if(keyCode==40){ // DOWN
    PLAYER.moveDown()
  }
  if(keyCode==80){ // P

  }
  if(keyCode==70){ // F

  }
  if(keyCode==83){ // S

  }
  if(keyCode==73){ // I

  }
  if(keyCode==32){ // SPACE

  }
  if(keyCode==38){ // UP

   }
  if(keyCode==40){ // DOWN

  }

}







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

  glideColor   = c10
  reflectColor = c11
  rotateColor  = c3
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
