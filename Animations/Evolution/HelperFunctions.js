
function wrapper(x){
  return regulate(x)//1.0/(1+exp(-1.0*x))
}

function regulate(x){ // relu wrapper
  if(x>0){
    return x;
  }else{
    return 0.0;
  }
}

function activator(x,xT){
  return round(x-xT)
  // if(x>xT){
  //   return x;
  // }else{
  //   return 0.0;
  // }
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


// ============ COLORS ============
function defineColors(){
  Cdirt1  = color(64,50,25);   // rgb(64,50,25)
  Cdirt2  = color(89,73,42);   // rgb(89,73,42)
  Cgrass1 = color(39,89,2);    // rgb(39,89,2)
  Cgrass2 = color(85,140,3);   // rgb(85,140,3)
  Cwater  = color(22,107,140); // rgb(22,107,140) // rgb(31,58,100)
  Cwater2 = color(15,100,115); // rgb(15,100,155)


}
