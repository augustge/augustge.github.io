
function wrapper(x){
  return atan(x) // ARCTAN
  // return max(x,0); // RELU
  // return 1.0/(1+exp(-x)); // SIGMOID
}


function DNAdiff(boid1,boid2){
  var diff = 0
  for(var i=0; i<min(boid1.ID.length,boid2.ID.length); i++){
    diff += sq(boid1.ID[i]-boid2.ID[i])
  }
  return sqrt(diff)
}

function colorwheel(a,theta,x){
  return a*(1+cos(theta+x))
}

function boidMetric(boid){
  return 20*boid.health + 10*boid.children + 5*boid.eats + boid.moves + boid.age/float(healthLossPerTime+healthLossPerMove+healthLossPerBirth)
}


function getPixelColor(x,y){
  var i = (y * width + x) * 4;
  return [ pixels[i],pixels[i+1],pixels[i+2] ];
}


// ============ COLORS ============
function defineColors(){
  // Cdirt1  = color("rgb(64,50,25)");
  // Cdirt2  = color("rgb(89,73,42)");
  // Cgrass1 = color("rgb(39,89,2)");
  // Cgrass2 = color("rgb(85,140,3)");
  // Cwater  = color("rgb(22,107,140)");
  // Cwater2 = color("rgb(15,100,155)");


  Cdirt2  = color("#A68572");
  Cgrass2 = color("#65A603");
  Cwater  = color("#67B8DE");
  Cdirt1  = color("#D9B5A0");
  Cgrass1 = color("rgb(39,89,2)");
  Cwater2 = color("#F0F2F1");
}
