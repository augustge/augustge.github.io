
class GenericLens{
  constructor(){}

  setSurfaces(surfaces){this.surfs = surfaces;}

  populateSurfaces(surfaces){
    for(var i=0; i<this.surfs.length; i++){
      surfaces.push(this.surfs[i]);
    }
    return surfaces;
  }

  setComparator(compare){this.compare = compare;}

  isInside(x,y){
    var boolVec = [];
    for(var i=0; i<this.surfs.length; i++){
      boolVec.push( this.surfs[i].F(x,y)<0 );
    }
    return this.compare(boolVec);
  }
}


// ============================================================
//      PREDEFINED LENS SHAPES
// ============================================================
class BCXsphericalLens extends GenericLens{
  constructor(xC,yC,dx,dy,r1,r2,w){
    super();
    var dL = sqrt(sq(dx)+sq(dy));
    this.rC = [xC,yC];
    this.dr = [dx/dL,dy/dL];
    this.r1 = r1; this.r2 = r2;
    this.w = w;
    this.defineSurface();
  }

  defineSurface(){
    var r1 = this.r1;
    var r2 = this.r2;
    var x1 = this.rC[0] + this.dr[0]*sqrt(sq(r1)-sq(this.w/2));
    var y1 = this.rC[1] + this.dr[1]*sqrt(sq(r1)-sq(this.w/2));
    var x2 = this.rC[0] - this.dr[0]*sqrt(sq(r2)-sq(this.w/2));
    var y2 = this.rC[1] - this.dr[1]*sqrt(sq(r2)-sq(this.w/2));
    var s1 = new Surface(1.5,function(x,y){return sq(x-x1)+sq(y-y1)-sq(r1)});
    var s2 = new Surface(1.5,function(x,y){return sq(x-x2)+sq(y-y2)-sq(r2)});
    this.setSurfaces([s1,s2])
    this.setComparator(function(x){return x[0] && x[1];});
  }
}


class BCVsphericalLens extends GenericLens{
  constructor(xC,yC,dx,dy,r1,r2,w,th){
    super();
    var dL = sqrt(sq(dx)+sq(dy));
    this.rC = [xC,yC];
    this.dr = [dx/dL,dy/dL];
    this.r1 = r1; this.r2 = r2;
    this.w = w; this.th = th;
    this.defineSurface();
  }

  defineSurface(){
    var r1 = this.r1;
    var r2 = this.r2;
    var w  = this.w;
    var xC = this.rC[0];
    var yC = this.rC[1];
    var dx = this.dr[0];
    var dy = this.dr[1];
    var x1 = this.rC[0] + this.dr[0]*(r1+this.th/2);
    var y1 = this.rC[1] + this.dr[1]*(r1+this.th/2);
    var x2 = this.rC[0] - this.dr[0]*(r2+this.th/2);
    var y2 = this.rC[1] - this.dr[1]*(r2+this.th/2);
    var s1 = new Surface(1.5,function(x,y){return sq(x-x1)+sq(y-y1)-sq(r1)});
    var s2 = new Surface(1.5,function(x,y){return sq(x-x2)+sq(y-y2)-sq(r2)});
    var t1 = new Surface(1.5,function(x,y){
      return sq(x-xC-((x-xC)*dx+(y-yC)*dy)*dx)+sq(y-yC-((x-xC)*dx+(y-yC)*dy)*dy)-sq(w/2)}
    );
    var t2 = new Surface(1.5,function(x,y){
      return sq((x-(x1+x2)/2)*dx+(y-(y1+y2)/2)*dy)-sq(x1-x2)/16-sq(y1-y2)/16}
    );
    this.setSurfaces([s1,s2,t1,t2])
    this.setComparator(function(x){return !x[0] && !x[1] && x[2] && x[3];});
  }
}
