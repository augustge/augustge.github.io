// ============ OBJECT       ============
function Object(x,y,outputs,stacks,layers){
  this.x = x;
  this.y = y;
  this.eats     = 0;
  this.children = 0;
  this.moves    = 0;
  this.maxSpeed = 1;
  this.reproductiveAge = 300;
  this.ageLossAge = 7*this.reproductiveAge;
  this.hasNotMoved = true;
  this.hasMemory   = false;
  this.senseLength = 2.3
  this.FOV  = PI/2.
  this.rays = 2
  this.speed = 0;
  this.rayPoints = 2
  this.carnivorous = false;
  this.maxHealth = maxHealth
  this.BRAIN = initialBrain(4+(this.rays+1)*this.rayPoints,outputs,stacks,layers)
  this.sensed = new Array(this.BRAIN.inputs)

  this.initiateBrain = function(outputs,stacks,layers){
    if(this.hasMemory){
      this.BRAIN = initialBrain(5+2*(this.rays+1)*this.rayPoints,outputs,stacks,layers)
    }else{
      this.BRAIN = initialBrain(4+(this.rays+1)*this.rayPoints,outputs,stacks,layers)
    }
    this.sensed = new Array(this.BRAIN.inputs)
  }

  this.initiate = function(ID){
    // this.BRAIN.initiate();
    this.dir = [0,1];
    this.age = 0;
    var R = colorwheel(120,0.3, 6.28*ID[0])
    var G = colorwheel(120, 5.3, 6.28*ID[1])
    var B = colorwheel(120, 2.9, 6.28*ID[2])
    this.color = color(R,G,B)
    this.maxHealth = ID[3]*maxHealth
    this.health = maxHealth*random(0.1,0.4);
    this.carnivorous = ID[4]>3;
    this.ID = ID;
  }

  this.do = function(){
    if(this.hasNotMoved){
      var sensed = this.sense();
      this.handleResponse(this.BRAIN.think(sensed))
      // if(random(100)<0.1){this.reproduce();} // involuntary reproduction
      this.live();
      this.hasNotMoved = false;
    }
  }

  this.sense = function(){
    var sensed = new Array(this.BRAIN.inputs)
    var n = float(this.rays)/2.
    var m = float(this.rayPoints)
    var dt = this.FOV/(n+1)
    var dR = this.senseLength/m


    sensed[0] = this.health/this.maxHealth
    sensed[1] = this.speed
    sensed[2] = this.age/1000.
    sensed[3] = MATRIX.M[int(this.x)][int(this.y)][0].life/float(grassFullLife)
    var count = 4
    for(var t=-n*dt; t<=n*dt; t+=dt){
      var rayX = this.dir[0]*cos(t)-this.dir[1]*sin(t)
      var rayY = this.dir[0]*sin(t)+this.dir[1]*cos(t)
      for(var r=dR; r<=this.senseLength; r+=dR){
        var xx = int((this.x+r*rayX+Nx)%Nx)
        var yy = int((this.y+r*rayY+Ny)%Ny)
        if(!!MATRIX.M[xx][yy][1]){
          sensed[count] = -2-DNAdiff(this,MATRIX.M[xx][yy][1])
        }else{
          sensed[count] = MATRIX.M[xx][yy][0].life/float(grassFullLife)
        }
        count++
      }
    }
    if(this.hasMemory){
      var newlySensedNum = count
      for(var i=3; i<newlySensedNum; i++){
        sensed[count] = this.sensed[i]
        count++
      }
    }
    this.sensed = sensed;
    return sensed;
  }



  this.handleResponse = function(response){
    if(response[0]>0.0 && !this.carnivorous){
        this.eat();
    }
    if(response[1]>0.0){
      this.reproduce();
    }
    this.move(response[2]);
    this.turn(response[3]);
    if(response[4]>0.0){
      this.attack();
    }
  }

  this.live = function(){
    this.age += 1;
    var healthLoss = healthLossPerTime;
    healthLoss += this.rayPoints*this.rays*healthLossPerSense
    healthLoss += this.BRAIN.stacks*this.BRAIN.layers*0.0001
    if(this.age>this.ageLossAge){
      healthLoss += this.age*healthLossPerAge
    }
    healthLoss += this.maxHealth/maxHealth*healthLossPerMaxHealth
    if(this.hasMemory){
      healthLoss += 0.001
    }
    if(!this.carnivorous){
      this.health -= healthLoss;
    }else{
      this.health -= healthLoss/carnivorousGain;
    }
    if(this.health<=0){ // DIE
      this.die()
    }
  }

  this.eat = function(){
    var freshness = MATRIX.M[int(this.x)][int(this.y)][0].life/float(MATRIX.M[int(this.x)][int(this.y)][0].fullLife);
    var healthgain = healthGrainPerEat*freshness;
    if(MATRIX.M[int(this.x)][int(this.y)][0].life>grassEdibilityThreshold){
      this.health = min(this.health+healthgain,this.maxHealth)
      MATRIX.M[int(this.x)][int(this.y)][0].life /= 2.;
      this.eats++;
    }
  }

  this.attack = function(){
    this.health -= healthLossPerAttack; // even when nothing in front
    var i = int((this.x + this.dir[0]+Nx)%Nx);
    var j = int((this.y + this.dir[1]+Ny)%Ny);
    var boid = MATRIX.M[i][j][1]
    if(!!boid){ // neq null
      if(boid.health>attackHarm){
        boid.health -= attackHarm
      }else{
        boid.die()
        this.health = min(boid.health,this.maxHealth)//healthGainBoidEat
      }
    }
  }

  this.die = function(){
    MATRIX.M[int(this.x)][int(this.y)][1] = null;
    boidCount--;
    // MATRIX.M[int(this.x)][int(this.y)][0].life = MATRIX.M[int(this.x)][int(this.y)][0].fullLife
    delete this;
  }

  this.reproduce = function(){
      var i = int((this.x + this.dir[0] + Nx)%Nx);
      var j = int((this.y + this.dir[1] + Ny)%Ny);
      if(!MATRIX.M[i][j][1] && MATRIX.M[i][j][0].traversable
        && this.health > healthLossPerBirth*this.maxHealth
        && this.age > this.reproductiveAge){
        this.health -= healthLossPerBirth*this.maxHealth;
        MATRIX.M[i][j][1] = mutate(this,i,j,mutation_m,mutation_p);
        MATRIX.M[i][j][1].health = this.health/2.;
        MATRIX.M[i][j][1].hasNotMoved = false;
        this.health = this.health/2.;
        boidCount++;
        this.children++;
      }
  }

  this.move = function(d){
    this.speed += d
    this.speed = min(this.maxSpeed,this.speed)
    this.speed = max(this.speed,0)
    var i = int((this.x + this.speed*this.dir[0]+Nx)%Nx);
    var j = int((this.y + this.speed*this.dir[1]+Ny)%Ny);
    if(!MATRIX.M[i][j][1] && MATRIX.M[i][j][0].traversable){
      MATRIX.M[i][j][1] = this;
      MATRIX.M[int(this.x)][int(this.y)][1] = null;
      this.x = (this.x + this.speed*this.dir[0]+Nx)%Nx;
      this.y = (this.y + this.speed*this.dir[1]+Ny)%Ny;
      this.health -= healthLossPerMove*this.speed;
      this.moves++;
      this.speed = this.speed/1.05;
    }else if(!MATRIX.M[i][j][0].traversable){
      this.health /= 1.1; // water harm
    }else{
      this.speed = 0;
    }
  }

  this.turn = function(d){
    var dX      = cos(d)*this.dir[0]-sin(d)*this.dir[1]
    this.dir[1] = sin(d)*this.dir[0]+cos(d)*this.dir[1]
    this.dir[0] = dX
  }

  this.getBrainCopy = function(brain){
    this.BRAIN = new Brain(brain.inputs,brain.outputs,brain.stacks,brain.layers)
    this.BRAIN.initiate();
    this.BRAIN.imitateBrain(brain)
  }

  this.display = function(i,j){
    strokeWeight(0.5)
    if(bestBoid==this){ stroke(255,0,0)}else{ stroke(0) }
    fill(this.color);
    var i = (this.x-I+Nx)%Nx;
    var j = (this.y-J+Ny)%Ny;
    var r = this.maxHealth/maxHealth
    if(this.carnivorous){
      line(dx*i,dy*j,dx*(i+0.7*r*this.dir[0]),dy*(j+0.7*r*this.dir[1]))
    }else{
      ellipse(dx*(i+0.35*r*this.dir[0]),dy*(j+0.35*r*this.dir[1]),0.2*dx,0.2*dy);
    }
    ellipse(dx*i,dy*j,0.6*r*dx,0.6*r*dy);
    if(this.hasMemory){
      ellipse(dx*i,dy*j,0.4*r*dx,0.4*r*dy);
    }

    if(drawHealth){
      noStroke();
      if(bestBoid==this){
        fill(255,0,0,100);
      }else{
        fill(0,255,0,50);
      }
      ellipse(dx*i,dy*j,10*dx*this.health/float(this.maxHealth),10*dy*this.health/float(this.maxHealth));
    }

    if(drawSensedBlocks){
      var n = float(this.rays)/2.
      var m = float(this.rayPoints)
      var dt = this.FOV/(n+1)
      var dR = this.senseLength/m

      fill(0,50)
      noStroke();
      for(var t=-n*dt; t<=n*dt; t+=dt){
        var rayX = this.dir[0]*cos(t)-this.dir[1]*sin(t)
        var rayY = this.dir[0]*sin(t)+this.dir[1]*cos(t)
        for(var r=dR; r<=this.senseLength; r+=dR){
          var xx = (this.x+r*rayX-I+Nx)%Nx
          var yy = (this.y+r*rayY-J+Ny)%Ny
          ellipse(xx*dx,yy*dy,5,5)
        }
      }
    }

  }
}







// ============ MUTATE ============
function makeCopyOf(boid,i,j){
  var child = new Object(i,j,boid.BRAIN.outputs,boid.BRAIN.stacks,boid.BRAIN.layers);
  var ID = new Array(numID);
  for(var k=0; k<numID; k++){
    ID[k]=boid.ID[k]
  }
  child.BRAIN.inputs  = boid.BRAIN.inputs;
  child.BRAIN.outputs = boid.BRAIN.outputs;
  child.BRAIN.stacks  = boid.BRAIN.stacks;
  child.BRAIN.layers  = boid.BRAIN.layers;
  child.senseLength = boid.senseLength
  child.FOV         = boid.FOV
  child.rays        = boid.rays
  child.rayPoints   = boid.rayPoints
  child.BRAIN.imitateBrain(boid.BRAIN);
  child.initiate(ID);
  return child;
}



function mutate(boid,i,j,m,p){
    var child = new Object(i,j,boid.BRAIN.outputs,boid.BRAIN.stacks,boid.BRAIN.layers);
    child.senseLength = boid.senseLength
    child.FOV         = boid.FOV
    child.rays        = boid.rays
    child.rayPoints   = boid.rayPoints
    if(random(100)<0.5){
      child.hasMemory = !child.hasMemory;
    }

    if(random(100)<changeStacksProb && child.BRAIN.stacks>1){
      // child.initiateBrain(child.BRAIN.outputs,child.BRAIN.stacks-1,child.BRAIN.layers)
      child.BRAIN.stacks = child.BRAIN.stacks-1
    }else if(random(100)<changeStacksProb && child.BRAIN.stacks<12){
      // child.initiateBrain(child.BRAIN.outputs,child.BRAIN.stacks+1,child.BRAIN.layers)
      child.BRAIN.stacks = child.BRAIN.stacks+1
    }

    if(random(100)<removeLayerProb && child.BRAIN.layers>1){
      child.BRAIN.layers = child.BRAIN.layers-1;
    }else if(random(100)<addLayerProb && child.BRAIN.layers<10){
      child.BRAIN.layers = child.BRAIN.layers+1;
    }

    // change sensory: senseLength, FOV, rays, rayPoints
    if(random(100)<changeSenseraysProb && child.rays<8){
      child.rays += 1;
    }else if(random(100)<changeSenseraysProb && child.rays>1){
      child.rays -= 1;
    }
    if(random(100)<changeSensepointsProb && child.rayPoints<8){
      child.rayPoints += 1;
    }else if(random(100)<changeSensepointsProb && child.rayPoints>1){
      child.rayPoints -= 1;
    }
    if(random(100)<changeFOVProb && child.FOV<PI/1.5 && child.FOV>PI/10.){
      child.FOV += random(-dFOV,dFOV);
    }
    if(random(100)<changeSenseLProb && child.senseLength>0.5+dSenseLength){
      child.senseLength += random(-dSenseLength,dSenseLength);
    }
    child.initiateBrain(child.BRAIN.outputs,child.BRAIN.stacks,child.BRAIN.layers)

    // child.getBrainCopy(boid.BRAIN);
    //  mutate old DNA
    var ID = new Array(numID);
    for(var k=0; k<numID; k++){
      ID[k]=boid.ID[k]+DNAmutationProb*random(-1,1)
    }
    // inherit brain structure
    child.initiate(ID);
    // imitate brain of parent
    child.BRAIN.imitateBrain(boid.BRAIN);
    // mutate inherited brain
    child.BRAIN.mutate(m,p)
    return child;
}
