


class ControlPanel{
  constructor(){
    this.statMaxLength = 2 * 2*width/3;
    this.STATISTICS = [];

    this.PANELSELECT = createSelect();
    this.PANELSELECT.option("Animation");
    this.PANELSELECT.option("Brain dynamics");
    this.PANELSELECT.option("Controlpanel");
    this.PANELSELECT.option("Statistics");
    this.PANELSELECT.position(width-200,10);
    this.SLIDERS      = new Array(24);
    this.SLIDERTEXTS  = new Array(24);
    this.SELECTS      = new Array(2);
    this.CHECKBOX     = new Array(4);
    //  (min,max,[value],[step])
    this.SLIDERTEXTS[0]  = "Grass growth"
    this.SLIDERS[0]      = createSlider(0, 0.05, grassGrowth, 0.0001)
    this.SLIDERTEXTS[1]  = "Health cost [time]"
    this.SLIDERS[1]      = createSlider(0, 0.1, healthLossPerTime, 0.001)
    this.SLIDERTEXTS[2]  = "Health cost [moving]"
    this.SLIDERS[2]      = createSlider(0, 1, healthLossPerMove, 0.01)
    this.SLIDERTEXTS[3]  = "Health cost [stomach]"
    this.SLIDERS[3]      = createSlider(0, 0.01, healthLossPerMaxHealth, 0.0001)
    this.SLIDERTEXTS[4]  = "Health cost [sensory]"
    this.SLIDERS[4]      = createSlider(0, 0.01, healthLossPerSense, 0.0001)
    this.SLIDERTEXTS[5]  = "Health cost [aging]"
    this.SLIDERS[5]      = createSlider(0, 1, healthLossPerAge, 0.0001)
    this.SLIDERTEXTS[6]  = "Health cost [birth]"
    this.SLIDERS[6]      = createSlider(0, 1, healthLossPerBirth, 0.01)
    this.SLIDERTEXTS[7]  = "Health cost [attack]"
    this.SLIDERS[7]      = createSlider(0, maxHealth/10., healthLossPerAttack, 1)
    this.SLIDERTEXTS[8]  = "Health gain [eat]"
    this.SLIDERS[8]      = createSlider(0, 200, healthGrainPerEat, 0.1)
    this.SLIDERTEXTS[9]  = "Max health"
    this.SLIDERS[9]      = createSlider(1, 1000, maxHealth, 1)
      this.SLIDERTEXTS[10] = "DNA mutation [prob]"
      this.SLIDERS[10]     = createSlider(0, 0.1, 0.1, 0.0001)
    this.SLIDERTEXTS[11] = "Refill barrier"
    this.SLIDERS[11]     = createSlider(0, 3000, boidRefillBarrier, 1)
    this.SLIDERTEXTS[12] = "Kill axion [prob]"
    this.SLIDERS[12]     = createSlider(0, 10, killAxonProb, 0.001)
    this.SLIDERTEXTS[13] = "Refill mutation [severity]"
    this.SLIDERS[13]     = createSlider(0, 5, refillMutation_m, 0.001)
    this.SLIDERTEXTS[14] = "Refill mutation [prob]"
    this.SLIDERS[14]     = createSlider(0, 100, refillMutation_p, 0.001)
    this.SLIDERTEXTS[15] = "Mutation [severity]"
    this.SLIDERS[15]     = createSlider(0, 1, mutation_m, 0.001)
    this.SLIDERTEXTS[16] = "Mutation [prob]"
    this.SLIDERS[16]     = createSlider(0, 10, mutation_p, 0.01)
    this.SLIDERTEXTS[17] = "Senserays [prob]"
    this.SLIDERS[17]     = createSlider(0, 5, changeSenseraysProb, 0.01)
    this.SLIDERTEXTS[18] = "Sensepoints [prob]"
    this.SLIDERS[18]     = createSlider(0, 5, changeSensepointsProb, 0.01)
    this.SLIDERTEXTS[19] = "FOV [prob]"
    this.SLIDERS[19]     = createSlider(0, 50, changeFOVProb, 0.1)
    this.SLIDERTEXTS[20] = "FOV [severity]"
    this.SLIDERS[20]     = createSlider(0, 1, dFOV, 0.001)
    this.SLIDERTEXTS[21] = "Senselength [prob]"
    this.SLIDERS[21]     = createSlider(0, 50, changeSenseLProb, 0.1)
    this.SLIDERTEXTS[22] = "Senselength [severity]"
    this.SLIDERS[22]     = createSlider(0, 2, dSenseLength, 0.01)
    this.SLIDERTEXTS[23] = "Grass edibility threshold"
    this.SLIDERS[23]     = createSlider(0, 1, grassEdibilityThreshold, 0.001)

    this.SELECTS[0] = createSelect();
    this.SELECTS[0].option("NONE");
    this.SELECTS[0].option("DIG");
    this.SELECTS[0].option("ELEVATE");
    this.SELECTS[0].option("MAKEBOID");

    this.CHECKBOX[0] = createCheckbox('Show neuron value', false);
    this.CHECKBOX[1] = createCheckbox('Draw boid-health', false);
    this.CHECKBOX[2] = createCheckbox('Draw sense-points', true);
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
    grassGrowth             = this.SLIDERS[ 0].value()
    healthLossPerTime       = this.SLIDERS[ 1].value()
    healthLossPerMove       = this.SLIDERS[ 2].value()
    healthLossPerMaxHealth  = this.SLIDERS[ 3].value()
    healthLossPerSense      = this.SLIDERS[ 4].value()
    healthLossPerAge        = this.SLIDERS[ 5].value()
    healthLossPerBirth      = this.SLIDERS[ 6].value()
    healthLossPerAttack     = this.SLIDERS[ 7].value()
    healthGrainPerEat       = this.SLIDERS[ 8].value()
    maxHealth               = this.SLIDERS[ 9].value()
    // DNAmutationProb         = this.SLIDERS[10].value()
    boidRefillBarrier       = this.SLIDERS[11].value()
    killAxonProb            = this.SLIDERS[12].value()
    refillMutation_m        = this.SLIDERS[13].value()
    refillMutation_p        = this.SLIDERS[14].value()
    mutation_m              = this.SLIDERS[15].value()
    mutation_p              = this.SLIDERS[16].value()
    changeSenseraysProb     = this.SLIDERS[17].value()
    changeSensepointsProb   = this.SLIDERS[18].value()
    changeFOVProb           = this.SLIDERS[19].value()
    dFOV                    = this.SLIDERS[20].value()
    changeSenseLProb        = this.SLIDERS[21].value()
    dSenseLength            = this.SLIDERS[22].value()
    grassEdibilityThreshold = this.SLIDERS[23].value()

    showNeuronValue       = this.CHECKBOX[0].checked();
    drawHealth            = this.CHECKBOX[1].checked();
    drawSensedBlocks      = this.CHECKBOX[2].checked();
    refillGrass           = this.CHECKBOX[3].checked();
    // onclick             = this.SELECTS[0].value()

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
    this.STATISTICS.push(boidCount);
    if(this.STATISTICS.length>this.statMaxLength){
      this.STATISTICS.shift(); // remove first element
    }
  }

  display(x0,y0,Dx,Dy){
    strokeWeight(1);
    noStroke();
    fill(0);
    for(var i=0; i<this.SLIDERS.length; i++){
      text(this.SLIDERTEXTS[i],x0,y0+Dy*i+6);
      text(this.SLIDERS[i].value(),x0-180,y0+Dy*i+6);
    }
  }
}
