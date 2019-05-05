class Ray{
  constructor(x,y,dx,dy,ni=1.0){
    this.ni = ni;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
  }

  Xt(t){return this.x+t*this.dx}
  Yt(t){return this.y+t*this.dy}

  refract(surface,nR){
    var r = [this.dx,this.dy]
    var [n, surfdir] = surface.getNormalVector(this.x,this.y,this.dx,this.dy)
    var c   = n[0]*this.dx+n[1]*this.dy;
    var fak = 1.0-sq(nR)*(1-sq(c))
    if(fak>0){
      var Dx = nR*this.dx - (nR*c+sqrt(fak))*n[0];
      var Dy = nR*this.dy - (nR*c+sqrt(fak))*n[1];
      var Dl = sqrt(sq(Dx)+sq(Dy));
      this.dx = Dx/Dl;
      this.dy = Dy/Dl;
    }else{ // if internal reflection
      var Dx = this.dx - 2*(this.dx*n[0]+this.dy*n[1])*n[0];
      var Dy = this.dy - 2*(this.dx*n[0]+this.dy*n[1])*n[1];
      var Dl = sqrt(sq(Dx)+sq(Dy));
      this.dx = Dx/Dl;
      this.dy = Dy/Dl;
    }
  }

  findNextPoint(tm=1,maxT=2000){
    var ts = maxT;
    var surface = false;
    var intoLensClose = undefined;
    // find closest point on surface boundaries that has variation
    // in pixel value
    for(var i=0; i<SURFACES.length; i++){
      var surf = SURFACES[i]
      var [tS,intoLens] = surf.findIntersectionPoint(
                          this.x,this.y,this.dx,this.dy,
                          tm,50,15,maxT)
      if(tS<ts && intoLens!==undefined){
        ts = tS;
        surface=surf;
        intoLensClose = intoLens;
      }
    }
    if(intoLensClose===undefined){
      return [ts,false,1.0]
    }else{
      if(intoLensClose){
        return [ts,surface,1.0/1.5]
      }else{
        return [ts,surface,1.5/1.0]
      }
    }
  }

  iterate(num){
    if(num>0){ // Keep on doing this
      // ==== FIND CLOSEST INTERSECTION POINT AND MOVE TO IT
      var [ts,surface,nR] = this.findNextPoint(1,2000)
      this.display(ts,surface);
      this.x = this.x+ts*this.dx
      this.y = this.y+ts*this.dy
      // ==== UPDATE DIRECTION
      if(surface && nR!=1.0){ // if it actually hits a surface
        this.refract(surface,nR)
        this.iterate(num-1)
      }
    }
  }

  display(L,surface,dl=15){
    var xNew = this.x+L*this.dx
    var yNew = this.y+L*this.dy
    if(surface!=false && controlpanel.drawNormals.checked()){ // normal line
      strokeWeight(1)
      stroke(normalLineColor)
      var [n,surfdir] = surface.getNormalVector(this.x,this.y)
      line(xNew-dl*n[0],yNew-dl*n[1],xNew+2*dl*n[0],yNew+2*dl*n[1])
    }
    stroke(rayColor)
    strokeWeight(rayWidth)
    line(this.x,this.y,xNew,yNew)
  }
}
