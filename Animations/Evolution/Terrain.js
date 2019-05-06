

// ============ STATIONARY   ============
class Stationary{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.localID = 1.0/(1+exp(-terrainContrast*(noise(x/terrainScale,y/terrainScale)-0.5)));
    this.rndID = random(1);
    this.groundColor = lerpColor(Cdirt2,Cdirt1,sqrt(this.localID));
    if(this.localID>grassThreshold){
      this.type     = "GRASS";
      this.traversable = true;
      this.growth   = 1+grassGrowth*this.localID;
      this.fullLife = grassFullLife*(1-this.localID);
      this.life     = random(0,0.5)*this.fullLife;
      this.color = lerpColor(this.groundColor,Cgrass2,this.life/this.fullLife);
    }else{
      this.type = "WATER";
      this.traversable = false;
      this.life = -grassFullLife;
      this.color = color(Cwater.levels[0],Cwater.levels[1],Cwater.levels[2],100);
    }
  }

  reevaluateID(){
    this.groundColor = lerpColor(Cdirt2,Cdirt1,sqrt(this.localID));
    if(this.localID>grassThreshold){
      this.type = "GRASS";
      this.traversable = true;
      this.growth = 1+grassGrowth*this.localID;
      this.fullLife = grassFullLife*this.localID;
      this.life = random(0,0.5)*this.fullLife;
      this.color = lerpColor(this.groundColor,Cgrass2,this.life/this.fullLife);
    }else{
      this.type = "WATER";
      this.traversable = false;
      this.life = -1;
      this.color = color(Cwater.levels[0],Cwater.levels[1],Cwater.levels[2],100);
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
    if(this.type=="WATER"){
      fill(this.groundColor);
      rect(dx*i,dy*j,dx,dy);
      fill(this.color);
      rect(dx*i,dy*j,dx,dy);
    }else if(this.type=="GRASS"){
      fill(this.color);
      rect(dx*i,dy*j,dx,dy);
    }

  }
}
