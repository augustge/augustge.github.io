

// ============  MATRIX     ============
function Matrix(Nx,Ny){
  this.Nx = Nx
  this.Ny = Ny
  this.M = new Array(this.Nx);
  for(var i=0; i<this.Nx; i++){
    this.M[i] = new Array(this.Ny);
    for(var j=0; j<this.Ny; j++){
      this.M[i][j] =  new Array(2); // ground and obj level
    }
  }

  this.initialize = function(num,falloff,objP){
    noiseDetail(num,falloff);
    for(var i=0; i<this.Nx; i++){
      for(var j=0; j<this.Ny; j++){
        this.M[i][j][0] = new Stationary(i,j);
        if(random(0,1)<objP && this.M[i][j][0].traversable){
          this.addBoid(i,j)
        }else{
          this.M[i][j][1] = null;
        }
      }
    }
  }

  this.addBoid = function(i,j){
    var mutateglobalDNA = mutateDNA(globalDNA)
    this.M[i][j][1] = new Object(i,j,mutateglobalDNA);
    bestBoid = this.M[i][j][1];
    boidCount++
  }

  this.addMutationOf = function(i,j,bestBoid){
    if(!this.M[i][j][1]){
      bestBoid = mutate(bestBoid,i,j,refillMutation_m,refillMutation_p);
      this.M[i][j][1] = bestBoid;
      boidCount++;
    }
  }

  this.do = function(){
    var boidScore = 0;
    for(var i=0; i<this.Nx; i++){
      for(var j=0; j<this.Ny; j++){
        this.M[i][j][0].do();
        if(this.M[i][j][1]!=null){
          this.M[i][j][1].do();
        }
      }
    }
    //  redistribute abilities to do
    count=0; // count boids
    maxScore=0;
    for(var i=0; i<this.Nx; i++){
      for(var j=0; j<this.Ny; j++){
        if(!!this.M[i][j][1]){
          this.M[i][j][1].hasNotMoved = true;
          count++;
          if(boidMetric(this.M[i][j][1])>maxScore){
            maxScore = boidMetric(this.M[i][j][1]);
            bestBoid = this.M[i][j][1]
          }
        }
      }
    }
    return count
  }

  this.display = function(I,J,windowX,windowY){
    for(var i=0; i<windowX; i++){
      for(var j=0; j<windowY; j++){
        var x = (I+i+Nx)%Nx;
        var y = (J+j+Ny)%Ny;
        this.M[x][y][0].display(i,j);
        if(this.M[x][y][1]!=null){
          this.M[x][y][1].display(i,j);
        }
      }}}

  this.displayBackground = function(I,J,windowX,windowY){
    for(var i=0; i<windowX; i++){
      for(var j=0; j<windowY; j++){
        var x = (I+i+Nx)%Nx;
        var y = (J+j+Ny)%Ny;
        this.M[x][y][0].display(i,j);
      }}}

  this.displayToplayer = function(I,J,windowX,windowY){
    for(var i=0; i<windowX; i++){
      for(var j=0; j<windowY; j++){
        var x = (I+i+Nx)%Nx;
        var y = (J+j+Ny)%Ny;
        if(this.M[x][y][1]!=null){
          this.M[x][y][1].display(i,j);
        }
      }}}

  this.refill = function(){
    // refill BOIDS
    while(boidCount<boidRefillBarrier){
    // if(boidCount<boidRefillBarrier){
      var i = int(random(this.Nx-1));
      var j = int(random(this.Ny-1));
      if(this.M[i][j][1] == null && this.M[i][j][0].traversable){
        // this.addBoid(i,j)
        this.addMutationOf(i,j,bestBoid);
      }
    }
    count = 0; // refill GRASS
    while(count<refillGrassNum && refillGrass){
      var i = int(random(this.Nx-1));
      var j = int(random(this.Ny-1));
      if(this.M[i][j][0].traversable){
        this.M[i][j][0].life = this.M[i][j][0].fullLife;
        count++;
      }
    }
  }



}
