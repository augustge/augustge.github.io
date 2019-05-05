

class Surface{ // Surface is F(x,y)=0
  constructor(n,F){
    this.n = n;
    this.F = F;
  }

  intersectHelper(FF,t0,t1,s0,s1,N){
    var tm = (t0+t1)/2;
    if(N>0){
      var sm = FF(tm)>0;
      if(s0==sm){
        return this.intersectHelper(FF,tm,t1,sm,s1,N-1)
      }else{
        return this.intersectHelper(FF,t0,tm,s0,sm,N-1)
      }
    }else{
      return tm;
    }
  }

  findIntersectionPoint(x,y,dx,dy,tm=1e-6,tM=50,N=10,maxT=1000){
    var F = this.F;
    var FF = function(t){return F(x+t*dx,y+t*dy)}
    var sm = FF(tm)>0;
    for(var ti=tm; ti<=maxT; ti+=tM){
      var si = FF(ti)>0;
      if(si!=sm){
        var t0 = max(tm,ti-tM);
        var s0 = FF(t0)>0;
        var t1 = ti;
        var s1 = si;
        break;
      }
    }
    var ts = this.intersectHelper(FF,t0,t1,s0,s1,N);
    var compare = true; var dt = 0;
    while(compare && dt<10){
      dt += 1;
      var compare = comparePixelColors(x+(ts-dt)*dx,y+(ts-dt)*dy,x+(ts+dt)*dx,y+(ts+dt)*dy);
    }
    if(!compare){
      var intoLens = pixelIsLens(x+(ts+dt)*dx,y+(ts+dt)*dy);
      return [ts,intoLens]
    }else{
      return [maxT,undefined]
    }
  }

  getNormal(x,y,ddx=1e-5,ddy=1e-5){
    var dX = (this.F(x+ddx,y)-this.F(x-ddx,y))/(2*ddx)
    var dY = (this.F(x,y+ddy)-this.F(x,y-ddy))/(2*ddy)
    var dL = sqrt(sq(dX)+sq(dY))
    return [dX/dL,dY/dL]
  }

  getNormalVector(x,y,dx,dy,ddx=1e-5,ddy=1e-5){
    var n = this.getNormal(x,y,ddx=ddx,ddy=ddy)
    if(n[0]*dx+n[1]*dy>0){
      return [[-n[0],-n[1]],true]
    }else{
      return [n,false]
    }
  }

  findPointOnSurface(x0=0,y0=0,nMax=1000,
      xBd=[-1000,1000],yBd=[-1000,1000],N=10){
    var s0 = F(x0,y0)>0;
    for(var n=0; n<nMax; n++){
      var x = random(xBd[0],xBd[1]);
      var y = random(yBd[0],yBd[1]);
      var s1 = F(x,y)>0;
      if( s1!=s0 ){ break; }
    }
    var dx = x-x0;
    var dy = y-y0;
    var FF = function(t){return F(x0+t*dx,y0+t*dy)}
    var ts = this.intersectHelper(FF,0,1,s0,s1,N);
    this.rOnSurface = [x0+ts*dx,y0+ts*dy]
    return this.rOnSurface
  }

  getNextPointOnSurface(r,dl,sgn=1){
    var n = this.getNormal(r[0],r[1],ddx=1e-5,ddy=1e-5)
    var v = [-n[1],n[0]]
    return [[r[0]+sgn*dl*v[0],r[1]+sgn*dl*v[1]],v]
  }

  getSurfacePoints(r,sgn,Nsteps=100,dl=5,cyclic=true){
    var R = [r];
    if(cyclic){
      var dist = 10*dl;
      i = 0;
      while(dist>=5*dl || i<6){
        [Rdummy,v] = this.getNextPointOnSurface(R[i],dl/2,sgn=sgn)
        Rnext = [R[i][0]+sgn*v[0]*dl,R[i][1]+sgn*v[1]*dl]
        R.push( Rnext )
        dist = sqrt(sq(R[i+1][0]-R[0][0])+sq(R[i+1][1]-R[0][1]))
        if(i>Nsteps){break}
        i++;
      }
      return R
    }else{
      for(var i=0; i<Nsteps; i++){
        [Rdummy,v] = this.getNextPointOnSurface(R[i],dl/2,sgn=sgn)
        Rnext = [R[i][0]+sgn*v[0]*dl,R[i][1]+sgn*v[1]*dl]
        R.push( Rnext )
      }
      return R
    }
  }

  drawSurface(r,sgn,Nsteps=100,dl=5){
    var ri = r;
    for(var i=0; i<Nsteps; i++){
      var n = this.getNormal(ri[0],ri[1],ddx=1e-5,ddy=1e-5)
      var v = [-n[1],n[0]]
      vertex(ri[0],ri[1])
      var ri = [ri[0]+sgn*dl*v[0],ri[1]+sgn*dl*v[1]]
    }
    vertex(ri[0],ri[1])
  }

  display(steps=50,contours=false){
    strokeWeight(1)
    stroke(0,10)
    if(contours){
      noFill();
    }else{
      if(this.n==1.5){
        fill(lensColor)
      }else{
        fill(c5)
      }
    }
    beginShape();
    for(var i=0; i<this.points.length; i+=steps){
      p = this.points[i]
      vertex(p[0],p[1])
    }
    vertex(this.points[0][0],this.points[0][1])
    endShape(CLOSE);
  }


}
