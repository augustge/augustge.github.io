function Source(x,y,ni=1.0){
  this.x = x
  this.y = y
  this.outside = true
  this.ni = ni;
  this.level = 0;

  this.initiate = function(){
  }

  this.display = function(){
    noStroke();
    fill(rayColor);
    ellipse(this.x,this.y,10,10);
  }

  this.displayRayTo = function(xp,yp,num){
    if(controlpanel.collimatedSource.checked()){
      var dX = (xp-width/2)  - this.x
      var dY = (yp-height/2) - this.y
      var dL = sqrt(sq(dX)+sq(dY))
      dX = dX/dL
      dY = dY/dL
      // central ray
      var ray = new Ray(this.x,this.y,dX,dY,ni=this.ni)
      ray.iterate(num)
      // Rayspan
      for(var t=raySep; t<raySpan; t+=raySep){
        var xi = this.x - 100*t*dY
        var yi = this.y + 100*t*dX
        var ray = new Ray(xi,yi,dX,dY,ni=this.ni)
        ray.iterate(num)
        var xi = this.x + 100*t*dY
        var yi = this.y - 100*t*dX
        var ray = new Ray(xi,yi,dX,dY,ni=this.ni)
        ray.iterate(num)
      }
    }else{
      var dX = (xp-width/2)  - this.x
      var dY = (yp-height/2) - this.y
      var dL = sqrt(sq(dX)+sq(dY))
      dX = dX/dL
      dY = dY/dL
      // central ray
      var ray = new Ray(this.x,this.y,dX,dY,ni=this.ni)
      ray.iterate(num)
      // Rayspan
      for(var t=raySep; t<raySpan; t+=raySep){
        var dxP = cos(t)*dX+sin(t)*dY
        var dyP = cos(t)*dY-sin(t)*dX
        var ray = new Ray(this.x,this.y,dxP,dyP,ni=this.ni)
        ray.iterate(num)
        var dxP = cos(t)*dX-sin(t)*dY
        var dyP = cos(t)*dY+sin(t)*dX
        var ray = new Ray(this.x,this.y,dxP,dyP,ni=this.ni)
        ray.iterate(num)
      }
    }
  }
}
