
function makeControls(){
  var controlHolder = window.document.getElementById('control-holder');
  var colorHolder = window.document.getElementById('color-container');
  var propsHolder = window.document.getElementById('props-container');
  var otherHolder = window.document.getElementById('other-container');

  for(var i=0; i<colors.length; i++){addColorButton(colors[i].name,colors[i].C);}
  // Should probably transition to sliders/inputs instead
  addButton(createButton("play/pause"),function(){play=!play;},otherHolder)
  addButton(createButton("Seize visuals"),function(){seizeVisuals=!seizeVisuals;},otherHolder)
  addSelect([["Create walker","create"],["Draw","draw"],["Walker eraser","erase"],["Color picker","picker"]],"Create walker",function(e){mouseMode=e.target.selectedOptions[0].value;},otherHolder)
  addSelect(resolutions.map(({ name }) => [name,name]),"window size",changedResolution,otherHolder)
  // sensor widths
  addSelect(senseWs.map(({ name }) => [name,name]),senseWs[1].name,function(e){
    var angles = senseWs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].A;
    BOIDMODEL.sensor = new Sensor(angles,BOIDMODEL.sensor.distance);},propsHolder)
  // sensor lengths
  addSelect(senseLs.map(({ name }) => [name,name]),senseLs[0].name,function(e){
    var distances = senseLs.filter(({name}) => name==e.target.selectedOptions[0].value)[0].L;
    BOIDMODEL.sensor = new Sensor(BOIDMODEL.sensor.angles,distances);},propsHolder)
  // step lengths
  addSelect(steplengths.map(({ name }) => [name,name]),steplengths[0].name,function(e){
    var l = steplengths.filter(({name}) => name==e.target.selectedOptions[0].value)[0].V
    BOIDMODEL.navigator = new Navigator(l,phi[1],phi[1]);},propsHolder)
  // attractions
  addSelect([["Philic",1],["Phobic",-1]],"Philic",function(e){
    BOIDMODEL.sensor = new Sensor(BOIDMODEL.sensor.angles,BOIDMODEL.sensor.distance);
    BOIDMODEL.sensor.philic=e.target.selectedOptions[0].value;},propsHolder)
  addSelect([["Self","s"],["Black","d"],["White","w"],["Chosen","c"]],"s",setAttractor,propsHolder)
  // addSelect(attractions.map(({ name }) => [name,name]),"dark attractor",function(e){
  //   BOIDMODEL.cost = attractions.filter(({name}) => name==e.target.selectedOptions[0].value)[0].f;})
  // color
  colorInput = createInput(); colorInput.parent(colorHolder)
  colorInput.changed(colorInputChanged)
  // addSelect(colors.map(({ name }) => [name,name]),colors[1].name,colorSelectChanged)
  addButton(createButton("Show/hide walkers"),function(){showWalkers=!showWalkers;},otherHolder)
  addButton(createButton("Kill all walkers"),function(){BOIDS=[];},otherHolder)
  addButton(createButton("Clear canvas with selected color"),function(){buffer.background(BOIDMODEL.c);},otherHolder)
  addButton(createButton("Download image"),function(){saveCanvas(buffer,"autoArt","jpg");},otherHolder)
}

function setAttractor(e){
    var v=e.target.selectedOptions[0].value;
    console.log(v);
    BOIDMODEL.self = v=="s";
    if(v=="s"){     BOIDMODEL.cCost = BOIDMODEL.c;}
    else if(v=="d"){BOIDMODEL.cCost = color(0);}
    else if(v=="w"){ BOIDMODEL.cCost = color(255);}
    else if(v=="c"){ BOIDMODEL.cCost = color(colorInput.value());}
}

function changedResolution(e){
  var resolution = resolutions.filter( ({name}) => name==e.target.selectedOptions[0].value)[0].R;
  newBuffer = createGraphics(resolution[0],resolution[1]);
  newBuffer.pixelDensity(1);
  newBuffer.image(buffer,0,0,newBuffer.width,newBuffer.height);
  for(var n=BOIDS.length-1; n>=0;n--){BOIDS[n].x *= newBuffer.width/buffer.width; BOIDS[n].y *= newBuffer.height/buffer.height}
  buffer = newBuffer;
}

function colorInputChanged(){
  BOIDMODEL.c = color(colorInput.value());
  if(BOIDMODEL.self){BOIDMODEL.cCost = color(colorInput.value());}
  colorInput.style('border-color',colorInput.value());
}

function colorSelectChanged(e){
    var v = e.target.selectedOptions[0].value;
    var c = colors.filter(({name}) => name==v)[0].C;
    setColorRGBA(c.levels);// colorInput.value( rgbToHex(c.levels) ); colorInput.style('background-color',colorInput.value());
    BOIDMODEL.c = c;
    if(BOIDMODEL.self){BOIDMODEL.cCost = c;}
    BOIDMODEL.smoother = v=="SMEAR";
}

function addSelect(options,selected,update,parent){
  var s = createSelect()
  s.parent(parent);
  for(var k=0; k<options.length;k++){s.option(options[k][0],options[k][1])}
  s.changed(update);
  s.selected(selected)
  s.elt.dispatchEvent(new Event("change"));
}

function addButton(b,f,parent){
  b.parent(parent); b.mousePressed(f);
  return b;
}

function addColorButton(name,c){
  var b = createButton("C")
  if(name=="SMEAR"){
    b.style("background-color","#FFF"); b.style("color","#000");
    b.elt.innerHTML = "SMEAR";
  }else{
    b.elt.innerHTML = "C";
    b.style("background-color",c); b.style("color",c);
    b.value(rgbToHex(c.levels));
  }
  b.parent(window.document.getElementById('color-container'));
  b.mousePressed(function(){
    BOIDMODEL.c = color(c);
    if(BOIDMODEL.self){BOIDMODEL.cCost = color(c);}
    BOIDMODEL.smoother = name=="SMEAR";
    colorInput.style('border-color',c);
    colorInput.value(rgbToHex(c.levels));
  });
}

function colorButtonPress(e){
  var v = e.target.selectedOptions[0]
  console.log(v)
}




function mousePressed(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if(mouseMode=="create"){
      var b = duplicateBoidModel(BOIDMODEL);
      b.x = xx; b.y = yy;
      BOIDS.push(b);
    }else if (mouseMode=="erase") {
      for(var n=BOIDS.length-1; n>=0;n--){
        if(sq(BOIDS[n].x-xx)+sq(BOIDS[n].y-yy)<sq(0.5*mouseSize*buffer.width/width)){
          BOIDS.splice(n, 1);
        }
      }
    }else if (mouseMode=="picker") {
      var rgba = pixelFromCanvasCoord(mouseX,mouseY);
      setColorRGBA(rgba);
      BOIDMODEL.c = color(rgbToHex(rgba));
    }
  }
}

function mouseDragged(){
  if((mouseX<width) && (mouseY<height)){
    var xx = mouseX * buffer.width/width;
    var yy = mouseY * buffer.height/height;
    if (mouseMode=="draw") {
      buffer.noStroke();
      buffer.fill(BOIDMODEL.c);
      buffer.ellipse(xx,yy,mouseSize*buffer.width/width,mouseSize*buffer.height/height);
    }
    // add ensemle-draw
  }
}

function keyPressed(){
  if(keyCode==32){showWalkers=!showWalkers;}
}
