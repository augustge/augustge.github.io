


class ControlPanel{
  constructor(){
    this.introduction = createDiv("<h1>EVOLUTION</h1>Welcome! In the 'Animation' screen, you can monitor the behaviour of the species that have evolved as they navigate the terrain. Each of these creatures have a unique brain. The brain of best creature (according to some arbitrary metric) is displayed in the 'Brain dynamics' screen. In the 'Controlpanel' screen you can adjust parameters for the terrain, creature mutation and creature health. If you press 'space' a DNA strand will appear in the control panel. Any valid DNA strand can be copied into the input box. Choosing the 'makeboid' option in the controlpanel then allows you (when in the animation screen) to place this creature in the terrain.");
    this.introduction.position(0,0);
    this.introduction.id("introduction")
    this.introduction.hide()

    this.selectcontainer = createDiv('');
    this.selectcontainer.position(10,10);
    this.selectcontainer.id("maincontainer");

    this.container = createDiv('');
    this.container.position(10,40);
    this.container.id("maincontainer");

    this.statMaxLength = 4 * 2*width/3;
    this.STATISTICS = [];

    this.SLIDERS      = [];
    this.SLIDERTEXTS  = [];
    this.SELECTS      = [];
    this.SELECTTEXTS  = [];
    this.CHECKBOX     = [];

    this.PANELSELECT = createSelect();
    this.PANELSELECT.option("Information");
    this.PANELSELECT.option("Animation");
    this.PANELSELECT.option("Brain dynamics");
    this.PANELSELECT.option("Controlpanel");
    this.PANELSELECT.option("Statistics");
    // this.PANELSELECT.position(width-200,10);
    this.SELECTS.push(this.PANELSELECT)
    this.SELECTTEXTS.push(createDiv("Choose panel"))

    this.mouseselect = createSelect();
    this.mouseselect.option("NONE");
    this.mouseselect.option("DIG");
    this.mouseselect.option("ELEVATE");
    this.mouseselect.option("MAKEBOID");
    this.SELECTS.push(this.mouseselect);
    this.SELECTTEXTS.push(createDiv("Choose mouse action"))

    //  (min,max,[value],[step])
    this.SLIDERTEXTS.push( createDiv("Grass growth" ));
    this.SLIDERS.push(     createSlider(0, 0.05, grassGrowth, 0.0001) );
    this.SLIDERTEXTS.push( createDiv("Health cost [time]" ));
    this.SLIDERS.push(     createSlider(0, 0.1, healthLossPerTime, 0.001) );
    this.SLIDERTEXTS.push( createDiv("Health cost [moving]" ));
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerMove, 0.01) );
    this.SLIDERTEXTS.push( createDiv("Health cost [stomach]" ));
    this.SLIDERS.push(     createSlider(0, 0.01, healthLossPerMaxHealth, 0.0001) );
    this.SLIDERTEXTS.push( createDiv("Health cost [sensory]" ));
    this.SLIDERS.push(     createSlider(0, 0.01, healthLossPerSense, 0.0001) );
    this.SLIDERTEXTS.push( createDiv("Health cost [aging]" ));
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerAge, 0.0001) );
    this.SLIDERTEXTS.push( createDiv("Health cost [birth]" ));
    this.SLIDERS.push(     createSlider(0, 1, healthLossPerBirth, 0.01) );
    this.SLIDERTEXTS.push( createDiv("Health cost [attack]" ));
    this.SLIDERS.push(     createSlider(0, maxHealth/10., healthLossPerAttack, 1) );
    this.SLIDERTEXTS.push( createDiv("Health gain [eat]" ));
    this.SLIDERS.push(     createSlider(0, 200, healthGrainPerEat, 0.1) );
    this.SLIDERTEXTS.push( createDiv("Max health" ));
    this.SLIDERS.push(     createSlider(1, 1000, maxHealth, 1) );
    this.SLIDERTEXTS.push( createDiv("Refill barrier" ));
    this.SLIDERS.push(     createSlider(0, 3000, boidRefillBarrier, 1) );
    this.SLIDERTEXTS.push( createDiv("Kill axion [prob]" ));
    this.SLIDERS.push(     createSlider(0, 10, killAxonProb, 0.001) );
    this.SLIDERTEXTS.push( createDiv("Mutation [severity]" ));
    this.SLIDERS.push(     createSlider(0, 1, mutation_m, 0.001) );
    this.SLIDERTEXTS.push( createDiv("Mutation [prob]" ));
    this.SLIDERS.push(     createSlider(0, 10, mutation_p, 0.01) );
    this.SLIDERTEXTS.push( createDiv("Grass edibility threshold" ));
    this.SLIDERS.push(     createSlider(0, 1, grassEdibilityThreshold, 0.001) );
    this.SLIDERTEXTS.push( createDiv("Change brainstack prob"))
    this.SLIDERS.push(     createSlider(0, 10, changeStacksProb ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Change brainstack severity"))
    this.SLIDERS.push(     createSlider(0, 0.5, changeStacksSev ,0.0001) );
    this.SLIDERTEXTS.push( createDiv("Change brainlayer prob"))
    this.SLIDERS.push(     createSlider(0, 10, changeLayersProb , 0.01) );
    this.SLIDERTEXTS.push( createDiv("Change brainlayer severity"))
    this.SLIDERS.push(     createSlider(0, 0.5, changeLayersSev , 0.0001) );
    this.SLIDERTEXTS.push( createDiv("DNA Mutation prob "))
    this.SLIDERS.push(     createSlider(0, 50, DNAinfo.mutationProb ,0.01) );
    this.SLIDERTEXTS.push( createDiv("DNA Mutation severity"))
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity, 0.01) );
    this.SLIDERTEXTS.push( createDiv("Pixel response prob"))
    this.SLIDERS.push(     createSlider(0, 50, DNAinfo.mutationProbPxResp , 0.01) );
    this.SLIDERTEXTS.push( createDiv("Pixel response severity"))
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverityPxResp , 0.01) );
    this.SLIDERTEXTS.push( createDiv("Attack harm"))
    this.SLIDERS.push(     createSlider(0, 1000, attackHarm ,1) );
    this.SLIDERTEXTS.push( createDiv("Water damage"))
    this.SLIDERS.push(     createSlider(0, 100, waterDamage ,0.1) );
    this.SLIDERTEXTS.push( createDiv("Carnivorous gain"))
    this.SLIDERS.push(     createSlider(0, 30, carnivorousGain ,0.1) );


    this.CHECKBOX.push( createCheckbox('Show neuron value', false) );
    this.CHECKBOX.push( createCheckbox('Draw boid-health', false) );
    this.CHECKBOX.push( createCheckbox('Draw sense-points', false) );

    //
    // var selectcontainer = createDiv("");
    // selectcontainer.id("container");
    // // selectcontainer.parent(this.container);
    for(var i=0; i<this.SELECTS.length; i++){
      var container_i = createDiv("");
      container_i.id("selectcontainer");
      container_i.parent(this.selectcontainer);
      this.SELECTS[i].id("select")
      this.SELECTS[i].parent(container_i);
      this.SELECTTEXTS[i].parent(container_i);
    }

    var checkboxcontainer = createDiv("");
    checkboxcontainer.id("container")
    checkboxcontainer.parent(this.container)
    for(var i=0; i<this.CHECKBOX.length; i++){
      this.CHECKBOX[i].parent(checkboxcontainer);
    }

    var slidercontainer = createDiv("");
    slidercontainer.id("container")
    slidercontainer.parent(this.container)
    for(var i=0; i<this.SLIDERS.length; i++){
      var container_i = createDiv("");
      container_i.id("entrycontainer");
      container_i.parent(slidercontainer)
      this.SLIDERS[i].parent(container_i);
      this.SLIDERS[i].attribute("value",this.SLIDERS[i].value())
      this.SLIDERTEXTS[i].id("slidertext")
      this.SLIDERTEXTS[i].parent(container_i)
    }

    var dnaboxcontainer = createDiv("")
    dnaboxcontainer.id("container")
    dnaboxcontainer.parent(this.container)

    this.DNAinput = createInput();
    this.DNAinput.attribute("description","Wriphjbds")
    this.DNAinput.parent(dnaboxcontainer)

    this.DNAbox = createDiv(str(globalDNA));
    this.DNAbox.id("DNAbox")
    this.DNAbox.parent(dnaboxcontainer)
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
    waterDamage                     = this.SLIDERS[24].value()
    carnivorousGain                 = this.SLIDERS[25].value()

    showNeuronValue       = this.CHECKBOX[0].checked();
    drawHealth            = this.CHECKBOX[1].checked();
    drawSensedBlocks      = this.CHECKBOX[2].checked();

    for(var i=0; i<this.SLIDERS.length; i++){
      this.SLIDERS[i].attribute("value",this.SLIDERS[i].value())
    }
  }

  hideAll(){
    this.container.hide()
  }

  showAll(){
    this.container.show()
  }

  statisticsAccounting(){
    this.STATISTICS.push(getStatsCopy(STATS));
    if(this.STATISTICS.length>this.statMaxLength){
      this.STATISTICS.shift(); // remove first element
    }
  }

}
