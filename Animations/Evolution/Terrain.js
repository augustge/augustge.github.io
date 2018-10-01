

// ============ STATIONARY   ============
function Stationary(x,y){
  this.x = x;
  this.y = y;
  this.localID = 1.0/(1+exp(-terrainContrast*(noise(x/terrainScale,y/terrainScale)-0.5)));
  if(this.localID>grassThreshold){
    this.type = "GRASS"
    this.traversable = true;
    this.growth = 1+grassGrowth*this.localID;
    this.fullLife = grassFullLife*this.localID;
    this.life = random(0,0.5)*this.fullLife;
  }else{
    this.type = "WATER"
    this.traversable = false;
    this.life = -grassFullLife;
  }

  this.reevaluateID = function(){
    if(this.localID>grassThreshold){
      this.type = "GRASS"
      this.traversable = true;
      this.growth = 1+grassGrowth*this.localID;
      this.fullLife = grassFullLife*this.localID;
      this.life = random(0,0.5)*this.fullLife;
    }else{
      this.type = "WATER"
      this.traversable = false;
      this.life = -1;
    }
  }

  this.do = function(){
    if(this.type=="GRASS"){
      this.grow(); // grow, reproduce, ...
    }else if(this.type=="WATER"){

    }
  }

  this.grow = function(){
    if(this.life<=this.fullLife){
      this.life *= this.growth;
    }else{
      for(var i=-1; i<=1; i++){
        for(var j=-1; j<=1; j++){
          var X = (this.x + i + Nx)%Nx
          var Y = (this.y + j + Ny)%Ny
          if(X!=this.x && Y!=this.y && MATRIX.M[X][Y][0].traversable){
            if(MATRIX.M[X][Y][0].life<=MATRIX.M[X][Y][0].fullLife){
              MATRIX.M[X][Y][0].life *= 1+spreadGrowth/8.*MATRIX.M[X][Y][0].localID;
            }
          }
        }
      }
    }
  }

  this.display = function(i,j){
    if(this.type=="GRASS"){
      noStroke();
      fill(lerpColor(Cdirt1,Cgrass2,this.life/this.fullLife/5.));
      rect(dx*i,dy*j,dx,dy);
      // strokeWeight(dx/5.)
      // for(var k=0; k<int(this.life/10.); k++){
      //   stroke(Cgrass2)
      //   // stroke(85,140,3,100)
      //   // 31	37	41	43	47	53	59	61	67	71
      //   // 64081	64091	64109	64123	64151	64153	64157	64171	64187	64189
      //   var id1 = (104729*22973*this.localID%(dx*k))/(dx*k)
      //   var id2 = (103001*27919*this.localID%(dy*k))/(dy*k)
      //   point(dx*(i+id1),dy*(j+id2))
      // }
    }else{
      noStroke();
      fill(Cwater);
      rect(dx*i,dy*j,dx,dy);
    }

  }
}
