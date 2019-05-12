


class ControlPanel{
  constructor(){
    this.statMaxLength = 4 * 2*width/3;
    this.STATISTICS = [];

    this.PANELSELECT = createSelect();
    this.PANELSELECT.option("Information");
    this.PANELSELECT.option("Animation");
    this.PANELSELECT.option("Brain dynamics");
    this.PANELSELECT.option("Controlpanel");
    this.PANELSELECT.option("Statistics");
    this.PANELSELECT.position(width-200,10);
    this.SLIDERS      = [];
    this.SLIDERTEXTS  = [];
    this.SELECTS      = new Array(2);
    this.CHECKBOX     = new Array(4);
    //  (min,max,[value],[step])

    this.SLIDERTEXTS.push( "Grass growth" );
    this.SLIDERS.push(     createSlider(0, 0.05, grassGrowth, 0.0001) );
    this.SLIDERTEXTS.push( "Health cost [time]" );
    this.SLIDERS.push(     createSlider(0, 0.1, healthLossPerTime, 0.001) );
    this.SLIDERTEXTS.push( "Health cost [moving]" );
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerMove, 0.01) );
    this.SLIDERTEXTS.push( "Health cost [stomach]" );
    this.SLIDERS.push(     createSlider(0, 0.01, healthLossPerMaxHealth, 0.0001) );
    this.SLIDERTEXTS.push( "Health cost [sensory]" );
    this.SLIDERS.push(     createSlider(0, 0.01, healthLossPerSense, 0.0001) );
    this.SLIDERTEXTS.push( "Health cost [aging]" );
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerAge, 0.0001) );
    this.SLIDERTEXTS.push( "Health cost [birth]" );
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerBirth, 0.01) );
    this.SLIDERTEXTS.push( "Health cost [attack]" );
    this.SLIDERS.push(     createSlider(0, maxHealth/10., healthLossPerAttack, 1) );
    this.SLIDERTEXTS.push( "Health gain [eat]" );
    this.SLIDERS.push(     createSlider(0, 200, healthGrainPerEat, 0.1) );
    this.SLIDERTEXTS.push( "Max health" );
    this.SLIDERS.push(     createSlider(1, 1000, maxHealth, 1) );
    this.SLIDERTEXTS.push( "Refill barrier" );
    this.SLIDERS.push(     createSlider(0, 3000, boidRefillBarrier, 1) );
    this.SLIDERTEXTS.push( "Kill axion [prob]" );
    this.SLIDERS.push(     createSlider(0, 10, killAxonProb, 0.001) );
    this.SLIDERTEXTS.push( "Mutation [severity]" );
    this.SLIDERS.push(     createSlider(0, 1, mutation_m, 0.001) );
    this.SLIDERTEXTS.push( "Mutation [prob]" );
    this.SLIDERS.push(     createSlider(0, 10, mutation_p, 0.01) );
    this.SLIDERTEXTS.push( "Grass edibility threshold" );
    this.SLIDERS.push(     createSlider(0, 1, grassEdibilityThreshold, 0.001) );
    this.SLIDERTEXTS.push( "Change brainstack prob")
    this.SLIDERS.push(     createSlider(0, 10, changeStacksProb ,0.01) );
    this.SLIDERTEXTS.push( "Change brainstack severity")
    this.SLIDERS.push(     createSlider(0, 0.5, changeStacksSev ,0.0001) );
    this.SLIDERTEXTS.push( "Change brainlayer prob")
    this.SLIDERS.push(     createSlider(0, 10, changeLayersProb , 0.01) );
    this.SLIDERTEXTS.push( "Change brainlayer severity")
    this.SLIDERS.push(     createSlider(0, 0.5, changeLayersSev , 0.0001) );
    this.SLIDERTEXTS.push( "DNA Mutation prob ")
    this.SLIDERS.push(     createSlider(0, 50, DNAinfo.mutationProb ,0.01) );
    this.SLIDERTEXTS.push( "DNA Mutation severity")
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity, 0.01) );
    this.SLIDERTEXTS.push( "Pixel response prob")
    this.SLIDERS.push(     createSlider(0, 50, DNAinfo.mutationProbPxResp , 0.01) );
    this.SLIDERTEXTS.push( "Pixel response severity")
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverityPxResp , 0.01) );
    this.SLIDERTEXTS.push( "Attack harm")
    this.SLIDERS.push(     createSlider(0, 1000, attackHarm ,1) );
    this.SLIDERTEXTS.push( "Carnivorous gain")
    this.SLIDERS.push(     createSlider(0, 30, carnivorousGain ,0.1) );

    this.SELECTS[0] = createSelect();
    this.SELECTS[0].option("NONE");
    this.SELECTS[0].option("DIG");
    this.SELECTS[0].option("ELEVATE");
    this.SELECTS[0].option("MAKEBOID");

    this.CHECKBOX[0] = createCheckbox('Show neuron value', false);
    this.CHECKBOX[1] = createCheckbox('Draw boid-health', false);
    this.CHECKBOX[2] = createCheckbox('Draw sense-points', false);
    this.CHECKBOX[3] = createCheckbox('Force-refill terrain', false);

    this.DNAbox = createDiv(str(globalDNA));
    this.DNAbox.style("width: 300px; word-wrap: break-word; font-size: 6px;")
    this.DNAinput = createInput();
  }

  assignPositions(x0,y0,Dx,Dy){
    for(var i=0; i<this.SLIDERS.length; i++){
      this.SLIDERS[i].position(x0,y0+Dy*i);
    }
    for(var i=0; i<this.CHECKBOX.length; i++){
      this.CHECKBOX[i].position(x0+300,y0+20+Dy*i);
    }
    this.SELECTS[0].position(x0+300,y0+40+Dy*this.CHECKBOX.length);
    this.DNAbox.position(x0+300,y0+150)
    this.DNAinput.position(x0,y0+10+Dy*(this.SLIDERS.length+this.CHECKBOX.length))
  }

  updateValues(){
    grassGrowth                     = this.SLIDERS[ 0].value()
    healthLossPerTime               = this.SLIDERS[ 1].value()
    healthLossPerMove               = this.SLIDERS[ 2].value()
    healthLossPerMaxHealth          = this.SLIDERS[ 3].value()
    healthLossPerSense              = this.SLIDERS[ 4].value()
    healthLossPerAge                = this.SLIDERS[ 5].value()
    healthLossPerBirth              = this.SLIDERS[ 6].value()
    healthLossPerAttack             = this.SLIDERS[ 7].value()
    healthGrainPerEat               = this.SLIDERS[ 8].value()
    maxHealth                       = this.SLIDERS[ 9].value()
    boidRefillBarrier               = this.SLIDERS[10].value()
    killAxonProb                    = this.SLIDERS[11].value()
    mutation_m                      = this.SLIDERS[12].value()
    mutation_p                      = this.SLIDERS[13].value()
    grassEdibilityThreshold         = this.SLIDERS[14].value()
    changeStacksProb                = this.SLIDERS[15].value()
    changeStacksSev                 = this.SLIDERS[16].value()
    changeLayersProb                = this.SLIDERS[17].value()
    changeLayersSev                 = this.SLIDERS[18].value()
    DNAinfo.mutationProb            = this.SLIDERS[19].value()
    DNAinfo.mutationSeverity        = this.SLIDERS[20].value()
    DNAinfo.mutationProbPxResp      = this.SLIDERS[21].value()
    DNAinfo.mutationSeverityPxResp  = this.SLIDERS[22].value()
    attackHarm                      = this.SLIDERS[23].value()
    carnivorousGain                 = this.SLIDERS[24].value()

    showNeuronValue       = this.CHECKBOX[0].checked();
    drawHealth            = this.CHECKBOX[1].checked();
    drawSensedBlocks      = this.CHECKBOX[2].checked();
    refillGrass           = this.CHECKBOX[3].checked();
  }

  hideAll(){
    for(var i=0; i<this.SLIDERS.length; i++){
      this.SLIDERS[i].hide();
    }
    for(var i=0; i<this.CHECKBOX.length; i++){
      this.CHECKBOX[i].hide()
    }
    this.SELECTS[0].hide()
    this.DNAbox.hide()
    this.DNAinput.hide()
  }

  showAll(){
    for(var i=0; i<this.SLIDERS.length; i++){
      this.SLIDERS[i].show();
    }
    for(var i=0; i<this.CHECKBOX.length; i++){
      this.CHECKBOX[i].show()
    }
    this.SELECTS[0].show()
    this.DNAbox.show()
    this.DNAinput.show()
  }

  statisticsAccounting(){
    this.STATISTICS.push(getStatsCopy(STATS));
    if(this.STATISTICS.length>this.statMaxLength){
      this.STATISTICS.shift(); // remove first element
    }
  }

  display(x0,y0,Dx,Dy){
    strokeWeight(1);
    noStroke();
    fill(0);
    textAlign(LEFT);
    for(var i=0; i<this.SLIDERS.length; i++){
      text(this.SLIDERTEXTS[i],x0,y0+Dy*i+6);
      text(this.SLIDERS[i].value(),x0-180,y0+Dy*i+6);
    }
  }
}
