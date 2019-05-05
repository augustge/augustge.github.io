
// ============ Key Events ============
function keyPressed(){
  if(keyCode==32){ // SPACE
    print(bestBoid.DNA)
    CONTROLPANEL.DNAbox.html(str(bestBoid.DNA));
  }else if(keyCode==80){ // P
    getGlobalDNA(CONTROLPANEL.DNAinput.value())
  }else if(keyCode==37){ // LEFT
    I -= 5;
    I = (I+Nx)%Nx
  }else if(keyCode==39){ // RIGHT
    I += 5;
    I = (I+Nx)%Nx
  }else if(keyCode==38){ // UP
    J -= 5;
    J = (J+Ny)%Ny
  }else if(keyCode==40){ // DOWN
    J += 5;
    J = (J+Ny)%Ny
  }else if(keyCode==189){ // -
    windowX += 5;
    windowY = windowX*height/width;
    dx = width/windowX;
    dy = height/windowY;
  }else if(keyCode==187){ // +
    windowX -= 5;
    windowY = windowX*height/width;
    dx = width/windowX;
    dy = height/windowY;
  }else if(keyCode==49){ // 1
    CONTROLPANEL.PANELSELECT.value("Animation");
    CONTROLPANEL.hideAll();
  }else if(keyCode==50){ // 2
    CONTROLPANEL.PANELSELECT.value("Brain dynamics");
    CONTROLPANEL.hideAll();
  }else if(keyCode==51){ // 3
    CONTROLPANEL.PANELSELECT.value("Controlpanel");
    CONTROLPANEL.showAll();
  }
  return false;
}


function getGlobalDNA(s){
  var dna = []
  s_split = s.split(",")
  for(var i=0; i<s_split.length;i++){
    dna.push(float(s_split[i]))
  }
  globalDNA = dna;
}



// ============ Mouse Events ============
function mousePressed(){
  if(CONTROLPANEL.PANELSELECT.value() == "Animation"){
    var i = (int(mouseX/float(dx)+I)+Nx)%Nx
    var j = (int(mouseY/float(dy)+J)+Ny)%Ny
    if(CONTROLPANEL.SELECTS[0].value()=="DIG"){ // dig terrain
      digAt(i,j,7,0.8,0.1)
    }else if(CONTROLPANEL.SELECTS[0].value()=="ELEVATE"){ // elevate terrain
      elevateAt(i,j,7,0.8,0.1)
    }else if(CONTROLPANEL.SELECTS[0].value()=="MAKEBOID"){ // place boid
      if(!MATRIX.M[i][j][1] && MATRIX.M[i][j][0].traversable){
        var mutateglobalDNA = mutateDNA(globalDNA)
        MATRIX.M[i][j][1] = new Object(i,j,mutateglobalDNA);
        // MATRIX.M[i][j][1] = mutate(bestBoid,i,j,mutation_m,mutation_p);
        boidCount++;
      }
    }
  }
}


function mouseDragged(){
  var X = int((mouseX-pmouseX)/dx);
  var Y = int((mouseY-pmouseY)/dy);
  I -= X;
  I = (I+Nx)%Nx
  J -= Y;
  J = (J+Ny)%Ny
}



function digAt(i,j,s,e,d){
  for(var x=-s; x<=s; x++){
    for(var y=-s; y<=s; y++){
      var ix = (i+x+Nx)%Nx
      var jy = (j+y+Ny)%Ny
      MATRIX.M[ix][jy][0].localID /= 1 + e*exp(-d*sq(x)-d*sq(y));
      MATRIX.M[ix][jy][0].reevaluateID();
    }
  }
}

function elevateAt(i,j,s,e,d){
  for(var x=-s; x<=s; x++){
    for(var y=-s; y<=s; y++){
      var ix = (i+x+Nx)%Nx
      var jy = (j+y+Ny)%Ny
      MATRIX.M[ix][jy][0].localID *= 1 + e*exp(-d*sq(x)-d*sq(y));
      MATRIX.M[ix][jy][0].reevaluateID();
    }
  }
}
