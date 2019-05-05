/*

*** Preset DNA content
DNA[0]   : color 1
DNA[1]   : color 2
DNA[2]   : color 3
DNA[3]   : maxHealth
DNA[4]   : hasMemory (memoryBlocks if #>1)
DNA[5]   : carnivorous
DNA[6]   : senseLength
DNA[7]   : FOV
DNA[8]   : rays
DNA[9]   : rayPoints
DNA[10]--> 10+3*(rays+1)*raypoints: pxResponse
DNA[i]    : stacks
DNA[i+1]  : layers
rest: brainstuff


*/


// ============ OBJECT       ============
class Object{
  constructor(x,y,DNA){
    // Fixed
    this.maxSpeed = 1;
    // Variables
    this.x = x;
    this.y = y;
    this.hasNotMoved = true;
    this.speed = 0;
    // Counters
    this.eats     = 0;
    this.children = 0;
    this.moves    = 0;
    // Mutateable
    this.reproductiveAge = 200;
    this.ageLossAge = 5*this.reproductiveAge;

    this.dir = [0,1];
    this.age = 0;

    var R             = colorwheel(120, 0.3, 6.28*DNA[0])
    var G             = colorwheel(120, 5.3, 6.28*DNA[1])
    var B             = colorwheel(120, 2.9, 6.28*DNA[2])
    this.color        = color(R,G,B)

    this.maxHealth    = maxHealth//*DNA[3];
    this.health       = maxHealth//*random(0.1,0.4);

    this.memoryBlocks  = int(5*DNA[4]-1);
    this.hasMemory    = this.memoryBlocks>0;

    this.carnivorous  = DNA[5]>0.5;
    this.senseLength  = 20*DNA[6];
    this.FOV          = 3.1415*DNA[7];
    this.rays         = int(10*DNA[8]);
    this.rayPoints    = int(10*DNA[9]);

    this.pxResponses = [];
    var I = 10+3*(this.rays+1)*this.rayPoints
    for(var i=10; i<I; i+=3){
      this.pxResponses.push([DNA[i],DNA[i+1],DNA[i+2]]);
    }
    this.stacks       = int(15*DNA[I]);
    this.layers       = int(10*DNA[I+1]);

    this.DNA = DNA;

    // rest: brainstuff
    this.initiateBrain(5,this.stacks,this.layers);

  }

  initiateBrain(outputs,stacks,layers){
    var brainDNA = this.DNA.slice(10+3*(this.rays+1)*this.rayPoints,this.DNA.length)
    var inputs  = 4+(this.rays+1)*this.rayPoints;
    var outputs = outputs;
    if(this.hasMemory){
      inputs  += this.memoryBlocks;
      outputs += this.memoryBlocks;
    }
    this.BRAIN = new Brain(inputs,outputs,this.stacks,this.layers)
    this.BRAIN.constructFromDNA(brainDNA)
  }

  do(){
    if(this.hasNotMoved){
      var sensed = this.sense();
      this.handleResponse(this.BRAIN.think(sensed))
      this.live();
      this.hasNotMoved = false;
    }
  }

  sense(){
    var sensed = new Array(this.BRAIN.inputs)
    var n = float(this.rays)/2.
    var m = float(this.rayPoints)
    var dt = this.FOV/(n+1)
    var dR = this.senseLength/m

    sensed[0] = this.health/this.maxHealth;
    sensed[1] = this.speed;
    sensed[2] = this.age/1000.;
    sensed[3] = MATRIX.M[int(this.x)][int(this.y)][0].life/float(grassFullLife)
    var count = 4
    var sensecount = 0;
    for(var ni=0; ni<=this.rays; ni++){
      var t = (ni-n)*dt
      var rayX = this.dir[0]*cos(t)-this.dir[1]*sin(t)
      var rayY = this.dir[0]*sin(t)+this.dir[1]*cos(t)
      for(var mi=0; mi<this.rayPoints; mi++){
        var r = dR*(mi+1);
        var xx = int((this.x+r*rayX+Nx)%Nx)
        var yy = int((this.y+r*rayY+Ny)%Ny)
        if(!!MATRIX.M[xx][yy][1]){
          // sensed[count] = -2-DNAdiff(this,MATRIX.M[xx][yy][1])
          var pxcol = MATRIX.M[xx][yy][1].color.levels;
        }else{
          var pxcol = MATRIX.M[xx][yy][0].color.levels;
        }
        var pxresponse = this.pxResponses[sensecount];
        var resp = pxresponse[0]*pxcol[0]+pxresponse[1]*pxcol[1]+pxresponse[2]*pxcol[2];
        sensed[count] = resp/765.
        sensecount++
        count++
      }
    }
    if(this.hasMemory){
      // Old memory output is new memory input
      var outputs = this.BRAIN.outputs
      sensed[count]   = this.BRAIN.out[outputs-1]
      sensed[count+1] = this.BRAIN.out[outputs-2]
    }
    this.sensed = sensed;
    return sensed;
  }



  handleResponse(response){
    if(response[0]>0.0 && !this.carnivorous){this.eat();}
    if(response[1]>0.0){this.reproduce();}
    this.move(response[2]);
    this.turn(response[3]);
    // if(response[4]>0.0){this.attack();}
  }

  live(){
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

  eat(){
    var freshness = MATRIX.M[int(this.x)][int(this.y)][0].life/float(MATRIX.M[int(this.x)][int(this.y)][0].fullLife);
    var healthgain = healthGrainPerEat*freshness;
    if(MATRIX.M[int(this.x)][int(this.y)][0].life>grassEdibilityThreshold){
      this.health = min(this.health+healthgain,this.maxHealth)
      MATRIX.M[int(this.x)][int(this.y)][0].life /= 2.;
      this.eats++;
    }
  }

  attack(){
    this.health -= healthLossPerAttack; // even when nothing in front
    var i = int((this.x + this.dir[0]+Nx)%Nx);
    var j = int((this.y + this.dir[1]+Ny)%Ny);
    var boid = MATRIX.M[i][j][1]
    if(!!boid && boid!=this){ // neq null
      if(boid.health>attackHarm){
        boid.health -= attackHarm
      }else{
        boid.die()
        this.health = min(this.health+boid.health,this.maxHealth)//healthGainBoidEat
      }
    }
  }

  die(){
    MATRIX.M[int(this.x)][int(this.y)][1] = null;
    boidCount--;
    // MATRIX.M[int(this.x)][int(this.y)][0].life = MATRIX.M[int(this.x)][int(this.y)][0].fullLife
    delete this;
  }

  reproduce(){
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

  move(d){
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
      this.health -= healthLossPerMove*this.speed; //
      this.moves++;
      this.speed = this.speed/1.05; // damping
    }else if(!MATRIX.M[i][j][0].traversable){
      this.health /= 1.1; // water harm
    }else{
      this.speed = 0;
    }
  }

  turn(d){
    var dX      = cos(d)*this.dir[0]-sin(d)*this.dir[1];
    this.dir[1] = sin(d)*this.dir[0]+cos(d)*this.dir[1];
    this.dir[0] = dX;
  }

  getBrainCopy(brain){
    this.BRAIN = new Brain(brain.inputs,brain.outputs,brain.stacks,brain.layers)
    this.BRAIN.initiate();
    this.BRAIN.imitateBrain(brain)
  }

  display(i,j){

    strokeWeight(0.5)
    if(bestBoid==this){ stroke(255,0,0); }else{ stroke(0); }
    fill(this.color);
    var i = (this.x-I+Nx)%Nx;
    var j = (this.y-J+Ny)%Ny;
    var r = this.maxHealth/maxHealth
    if(this.carnivorous){
      line(dx*i,dy*j,dx*(i+0.7*r*this.dir[0]),dy*(j+0.7*r*this.dir[1]))
    }else{
      ellipse(dx*(i+0.35*r*this.dir[0]),dy*(j+0.35*r*this.dir[1]),0.2*dx,0.2*dy);
    }
    ellipse(dx*i,dy*j,0.6*r*dx,0.6*r*dy); // main body
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

      fill(0,50);
      noStroke();
      for(var ni=0; ni<=this.rays; ni++){
        var t = (ni-n)*dt
        var rayX = this.dir[0]*cos(t)-this.dir[1]*sin(t)
        var rayY = this.dir[0]*sin(t)+this.dir[1]*cos(t)
        for(var mi=0; mi<this.rayPoints; mi++){
          var r = dR*(mi+1);
          var xx = (this.x+r*rayX-I+Nx)%Nx
          var yy = (this.y+r*rayY-J+Ny)%Ny
          ellipse(xx*dx,yy*dy,5,5);
        }
      }
    }

  }
}







// ============ MUTATE ============
function makeCopyOf(boid,i,j){
  // var child = new Object(i,j,boid.BRAIN.outputs,boid.BRAIN.stacks,boid.BRAIN.layers);
  // var ID = new Array(numID);
  // for(var k=0; k<numID; k++){
  //   ID[k]=boid.ID[k]
  // }
  var baseDNA = [];
  for(var k=0; k<boid.DNA.length; k++){
    baseDNA.push(boid.DNA[k])
  }
  var child = new Object(i,j,DNA);
  return child;
  //
  // child.BRAIN.inputs  = boid.BRAIN.inputs;
  // child.BRAIN.outputs = boid.BRAIN.outputs;
  // child.BRAIN.stacks  = boid.BRAIN.stacks;
  // child.BRAIN.layers  = boid.BRAIN.layers;
  // child.senseLength = boid.senseLength
  // child.FOV         = boid.FOV
  // child.rays        = boid.rays
  // child.rayPoints   = boid.rayPoints
  // child.BRAIN.imitateBrain(boid.BRAIN);
  // child.initiate(ID);
  // return child;
}


function mutateDNA(oldDNA){
  var DNA = [];
  // basic DNA
  for(var k=0; k<10; k++){
    var newDNAkey = oldDNA[k]
    if(random(100)<DNAinfo.mutationProb[k]){
      newDNAkey += random(-DNAinfo.mutationSeverity[k],DNAinfo.mutationSeverity[k]);
      newDNAkey = max(min(newDNAkey,1),0);
    }
    DNA.push(newDNAkey);
  }

  var oldsensepointsNum = 3*(int(10*oldDNA[8])+1)*int(10*oldDNA[9]); //3*(rays+1)*rayPoints
  var sensepointsNum    = 3*(int(10*   DNA[8])+1)*int(10*   DNA[9]); //3*(rays+1)*rayPoints
  var deltaNum = sensepointsNum-oldsensepointsNum

  for(var i=0; i<min(oldsensepointsNum,sensepointsNum); i++){
    var newDNAkey = oldDNA[k+i]
    if(random(100)<DNAinfo.mutationProbPxResp){
      newDNAkey += random(-DNAinfo.mutationSeverityPxResp,DNAinfo.mutationSeverityPxResp);
      newDNAkey = max(min(newDNAkey,1),0);
    }
    DNA.push(newDNAkey);
  }
  if(deltaNum>0){ // add pxResponseData to new sensepoint
    for(var i=0; i<deltaNum; i++){
      DNA.push(1);
    }
  }
  var brainDNA = oldDNA.slice(k+oldsensepointsNum,oldDNA.length)

  DNA.push(brainDNA[0]); // stacks
  DNA.push(brainDNA[1]); // layers
  if(random(100)<changeStacksProb){
    DNA[10]+=random(-changeStacksSev,changeStacksSev)
    DNA[10] = max(min(DNA[10],1),0);
  }
  if(random(100)<changeLayersProb){
    DNA[11]+=random(-changeLayersSev,changeLayersSev)
    DNA[11] = max(min(DNA[11],1),0);
  }
  var oldmemoryBlocks = int(5*oldDNA[4]-1);
  var oldinputs  = 4+(int(10*   oldDNA[8])+1)*int(10*   oldDNA[9]);
  var oldoutputs = 5;
  if(oldmemoryBlocks>0){
    oldinputs  += oldmemoryBlocks;
    oldoutputs += oldmemoryBlocks;
  }
  var memoryBlocks = int(5*DNA[4]-1);
  var inputs  = 4+(int(10*   DNA[8])+1)*int(10*   DNA[9]);
  var outputs = 5;
  if(memoryBlocks>0){
    inputs  += memoryBlocks;
    outputs += memoryBlocks;
  }
  var oldstacks       = int(15*oldDNA[10]);
  var oldlayers       = int(10*oldDNA[11]);
  var stacks          = int(15*DNA[10]);
  var layers          = int(10*DNA[11]);

  var L = inputs*stacks+(layers-1)*stacks*stacks+outputs*stacks;//(inputs+(layers-1)*stacks+outputs)*stacks;

  var newbrainDNA = [];
  for(var i=0; i<L; i++){ newbrainDNA.push(0); }

  for (var i=0; i<oldstacks; i++){ // stacks
    for(var ii=0; ii<oldinputs; ii++){ // inputs
      var oldindex = 2+i*oldinputs+ii;
      var index = i*inputs+ii;
      if(index<L){ newbrainDNA[index] = brainDNA[oldindex]; }
    }
    for (var j=1; j<oldlayers; j++){ // layers
      for(var ii=0; ii<oldstacks; ii++){ // stacks
        var oldindex = 2+(oldinputs+(j-1)*oldstacks+i)*oldstacks+ii
        var index    = (inputs+(j-1)*stacks+i)*stacks+ii
        if(index<L){ newbrainDNA[index] = brainDNA[oldindex]; }
      }
    }
  }
  for (var i=0; i<oldoutputs; i++){
      for(var ii=0; ii<oldstacks; ii++){
        var oldindex = 2+(oldinputs+(oldlayers-1)*oldstacks)*oldstacks+i*oldstacks+ii;
        var index = (inputs+(layers-1)*stacks)*stacks+i*stacks+ii;
        if(index<L){ newbrainDNA[index] = brainDNA[oldindex]; }
      }
  }
  if(layers>oldlayers){
    for(var i=0; i<stacks; i++){
        var index    = (inputs+(layers-1)*stacks+i)*stacks+i
        newbrainDNA[index] = 0.5;
    }
  }


  for(var i=0; i<newbrainDNA.length; i++){
    var brainpoint = newbrainDNA[i]
    if(random(100)<mutation_p){
      brainpoint += random(-mutation_m,mutation_m);
    }else if(random(100)<killAxonProb){
      brainpoint = 0;
    }
    DNA.push(brainpoint)
  }


  return DNA
}


function mutate(boid,i,j,m,p){
    var DNA = mutateDNA(boid.DNA)
    var child = new Object(i,j,DNA);
    return child;
}
