function ControlPanel(){
  this.initiate = function(){
    this.modeSelector = createSelect();
    this.modeSelector.option("Source")
    this.modeSelector.option("Lens 1")
    this.modeSelector.option("Lens 2")
    this.modeSelector.position(110,30)

    this.raySpanSlider = createSlider(0.01, 3.141592, raySpan, 0.01)
    this.raySpanSlider.position(110,50);

    this.raySepSlider = createSlider(0.001, 0.1, raySep, 0.001)
    this.raySepSlider.position(110,70);

    this.rayOpacity = createSlider(1, 50, 5, 1)
    this.rayOpacity.position(110,90);

    this.drawNormals = createCheckbox('Draw normals', false);
    this.drawNormals.position(110,110);

    this.collimatedSource = createCheckbox('Collimated', true);
    this.collimatedSource.position(110,130);
  }

  this.update = function(){
    rayColor = color(255,this.rayOpacity.value());
    raySpan = this.raySpanSlider.value();
    raySep  = this.raySepSlider.value();
  }

  this.draw = function(){
    textAlign(RIGHT)
    noStroke();
    fill(0)
    text("Ray span",        90,50+5)
    text("Ray separation",  90,70+5)
    text("Ray opacity",     90,90+5)
  }

  this.inside = function(x,y){
    return (x<300)&&(y<100)
  }
}
