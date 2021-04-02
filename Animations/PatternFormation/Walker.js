//------------------------------------------------------------------------------
// Main creature: Mainly a container of the propagated information
class Boid{
  constructor(sensor,navigator,cost,c){
    this.x  = 1+random( buffer.width-2);
    this.y  = 1+random(buffer.height-2);
    this.th = random(2*PI)
    this.dth = 0;
    this.smoother = false;
    this.sensor = sensor;
    this.navigator = navigator;
    this.cost = cost; // RGBA cost function
    this.c = c; // color
    this.cCost = c;
    this.force = 0.618;
    this.self = true;
    // this.interactor = interactor;
  }
  sense(){
    this.th += this.sensor.sense(this.x,this.y,this.th,this.cCost);
  }
  act(){
    var res = this.navigator.move(this.x,this.y,this.th);
    this.x  = res[0];
    this.y  = res[1];
    this.interact(int(this.x),int(this.y));
  }

  combineValues(a,aN){return (a+this.force*aN)/(1+this.force)} // completely discriminative
  pixelIndex(x,y){ return 4*(int(y)*buffer.width+int(x)) }

  smoothing(x,y){
    var mPX = [0.0,0.0,0.0,0.0];
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        var mi = SMOOTHER[xi+1][yi+1];
        mPX[0] += mi*buffer.pixels[i];
        mPX[1] += mi*buffer.pixels[i+1];
        mPX[2] += mi*buffer.pixels[i+2];
        mPX[3] += mi*buffer.pixels[i+3];
      }
    }
    for(var xi=-1; xi<=1; xi++){
      for(var yi=-1; yi<=1; yi++){
        let i = this.pixelIndex(x+xi,y+yi);
        buffer.pixels[i]   = this.combineValues(buffer.pixels[i]  , mPX[0]);
        buffer.pixels[i+1] = this.combineValues(buffer.pixels[i+1], mPX[1]);
        buffer.pixels[i+2] = this.combineValues(buffer.pixels[i+2], mPX[2]);
        buffer.pixels[i+3] = this.combineValues(buffer.pixels[i+3], mPX[3]);
      }
    }
  }

  setPixelColor(x,y){
    let i = this.pixelIndex(x,y);
    buffer.pixels[i]   = this.combineValues(buffer.pixels[i],  this.c.levels[0]);
    buffer.pixels[i+1] = this.combineValues(buffer.pixels[i+1],this.c.levels[1]);
    buffer.pixels[i+2] = this.combineValues(buffer.pixels[i+2],this.c.levels[2]);
    buffer.pixels[i+3] = this.combineValues(buffer.pixels[i+3],this.c.levels[3]);
  }

  interact(x,y){
    if(this.smoother){
      this.smoothing(x,y)
    }else{
      this.setPixelColor(x,y)
    }
  }

  display(size){
    var X = this.x*width/buffer.width;
    var Y = this.y*height/buffer.height;
    var r = sqrt(sq(X-mouseX)+sq(Y-mouseY));
    var ms = size/(0.1+0.005*r)
    stroke(255-this.c.levels[0],255-this.c.levels[1],255-this.c.levels[2]);
    fill(this.c);
    ellipse(X,Y,size,size);
    noFill(); stroke(this.c);
    ellipse(X,Y,ms,ms);
    for(var k=0;k<this.sensor.angles.length;k++){
      var a = this.sensor.angles[k]
      var l = this.sensor.distance*width/buffer.width
      line(X,Y,X+ms*cos(a+this.th),Y+ms*sin(a+this.th));
    }

  }

  displaySpecial(x,y,scale){
    stroke(this.c)
    noFill()
    var lmax = -1
    for(var k=0;k<this.sensor.angles.length;k++){
      var a = this.sensor.angles[k]
      var l = this.sensor.distance*width/buffer.width
      line(x,y,x+l*cos(a),y+l*sin(a));
      if(l>lmax){lmax=l}
    }
    stroke(this.c)
    noFill()
    ellipse(x,y,2*lmax,2*lmax)
  }
}

//------------------------------------------------------------------------------
// Mechanism for reading pixel data and optimizing cost to generate and angle as a response
class Sensor{
  constructor(angles,distance){
    this.philic     = 1; // prefactor to distance cost
    this.angles     = angles // array of radians
    this.distance  = distance // array of radii
  }
  sensepoint(x,y,th,r,dth){ // retrieve sense-point
    var Xi = int(x+r*cos(th+dth));
    var Yi = int(y+r*sin(th+dth));
    return [1+(Xi-1+buffer.width-2)%(buffer.width-2),1+(Yi-1+buffer.height-2)%(buffer.height-2)]
  }
  getcolor(x,y){ // obtain pixel data
    let i = 4*(y*buffer.width+x);
    return [buffer.pixels[i],buffer.pixels[i+1],buffer.pixels[i+2],buffer.pixels[i+3]];
  }
  sense(x,y,th,cS){ // main function: Optimize cost over sensory scalars
    var costm  = Infinity; var thm = 0;
    for(var k=0; k<this.angles.length; k++){
      var p = this.sensepoint(x,y,th,this.distance,this.angles[k]); // meshpoint
      var c = this.getcolor(p[0],p[1]); // color at meshpoint
      var costk = this.philic*distanceTo(c,cS.levels); // cost/repulsion of detected of color
      if(costk<costm){ costm = costk; thm = this.angles[k]; } // if lowest cost
    }
    return thm
  }
}



//------------------------------------------------------------------------------
class Navigator{
  constructor(steplength,fluctuationTheta,fluctuationL){
    this.steplength    = steplength;
    this.fluctuationTH = fluctuationTheta; // relative!
    this.fluctuationL  = fluctuationL;     // relative!
  }
  move(x,y,th){ // position and dir of walker, delta theta (dth) of response
    // generate direction vector
    var dx = this.steplength*(1+random( -this.fluctuationL,this.fluctuationL))*cos(th)//this.steplength*cos(th);
    var dy = this.steplength*(1+random( -this.fluctuationL,this.fluctuationL))*sin(th)//this.steplength*sin(th);
    // MOVE + boundary condition
    var xN  = 1+( x+dx-1 + buffer.width -2)%(buffer.width -2);   // exclude 1px bd
    var yN  = 1+( y+dy-1 + buffer.height-2)%(buffer.height-2);   // exclude 1px bd

    var thN = th + random(-this.fluctuationTH,this.fluctuationTH)
    return [xN,yN,thN]
  }
}


function duplicateBoidModel(model){
  var b = new Boid(model.sensor,model.navigator,model.cost,model.c);
  b.smoother = model.smoother;
  b.force = model.force;
  b.cCost = model.cCost;
  return b
}
