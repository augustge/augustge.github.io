

// ============ STATIONARY   ============
class Stationary{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.localID = 1.0/(1+exp(-terrainContrast*(noise(x/terrainScale,y/terrainScale)-0.5)));
    this.rndID = random(1);
    if(this.localID>grassThreshold){
      this.type     = "GRASS";
      this.traversable = true;
      this.growth   = 1+grassGrowth*this.localID;
      this.fullLife = grassFullLife*this.localID;
      this.life     = random(0,0.5)*this.fullLife;
      this.color = lerpColor(Cdirt1,Cgrass2,this.life/this.fullLife);
    }else{
      this.type = "WATER";
      this.traversable = false;
      this.life = -grassFullLife;
      this.color = Cwater;
    }
  }

  reevaluateID(){
    if(this.localID>grassThreshold){
      this.type = "GRASS";
      this.traversable = true;
      this.growth = 1+grassGrowth*this.localID;
      this.fullLife = grassFullLife*this.localID;
      this.life = random(0,0.5)*this.fullLife;
      this.color = lerpColor(Cdirt1,Cgrass2,this.life/this.fullLife);
    }else{
      this.type = "WATER";
      this.traversable = false;
      this.life = -1;
      this.color = Cwater;
    }
  }

  do(){
    if(this.type=="GRASS"){
      this.grow(); // grow, reproduce, ...
    }else if(this.type=="WATER"){

    }
  }

  grow(){
    if(this.life<=this.fullLife){
      this.life *= this.growth;
      this.color = lerpColor(Cdirt1,Cgrass2,this.life/this.fullLife);
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

  display(i,j){
    noStroke();
    fill(this.color);
    rect(dx*i,dy*j,dx,dy);
  }
}
