


class ControlPanel{
  constructor(){
    this.introduction = select("#introduction")
    this.introduction.position(0,0);
    this.introduction.hide()

    this.selectcontainer = createDiv('');
    this.selectcontainer.position(10,10);
    this.selectcontainer.class("selectcontainer");

    this.container = createDiv('');
    this.container.position(10,40);
    this.container.class("maincontainer");

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

    this.SLIDERTEXTS.push( createDiv("Memory mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[0] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Memory mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[0] ,0.001) );

    this.SLIDERTEXTS.push( createDiv("Carnivorous mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[1] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Carnivorous mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[1] ,0.001) );

    this.SLIDERTEXTS.push( createDiv("Senselength mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[6] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Senselength mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[6] ,0.001) );

    this.SLIDERTEXTS.push( createDiv("FOV mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[7] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("FOV mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[7] ,0.001) );

    this.SLIDERTEXTS.push( createDiv("Senserays mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[8] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Senserays mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[8] ,0.001) );

    this.SLIDERTEXTS.push( createDiv("Raypoints mutation [prob]"));
    this.SLIDERS.push(     createSlider(0, 10, DNAinfo.mutationProb[9] ,0.01) );
    this.SLIDERTEXTS.push( createDiv("Raypoints mutation [severity]"));
    this.SLIDERS.push(     createSlider(0, 0.5, DNAinfo.mutationSeverity[9] ,0.001) );



    this.CHECKBOX.push( createCheckbox('Show neuron value', false) );
    this.CHECKBOX.push( createCheckbox('Draw boid-health', false) );
    this.CHECKBOX.push( createCheckbox('Draw sense-points', false) );

    //
    // var selectcontainer = createDiv("");
    // selectcontainer.id("container");
    // // selectcontainer.parent(this.container);
    for(var i=0; i<this.SELECTS.length; i++){
      var container_i = createDiv("");
      container_i.class("selectcontainerChild");
      container_i.parent(this.selectcontainer);
      this.SELECTS[i].class("select")
      this.SELECTS[i].parent(container_i);
      this.SELECTTEXTS[i].parent(container_i);
    }

    var checkboxcontainer = createDiv("");
    checkboxcontainer.class("container")
    checkboxcontainer.parent(this.container)
    for(var i=0; i<this.CHECKBOX.length; i++){
      this.CHECKBOX[i].parent(checkboxcontainer);
    }

    var slidercontainer = createDiv("");
    slidercontainer.class("container")
    slidercontainer.parent(this.container)
    for(var i=0; i<this.SLIDERS.length; i++){
      var container_i = createDiv("");
      container_i.class("entrycontainer");
      container_i.parent(slidercontainer)
      this.SLIDERS[i].parent(container_i);
      this.SLIDERS[i].attribute("value",this.SLIDERS[i].value())
      this.SLIDERTEXTS[i].class("slidertext")
      this.SLIDERTEXTS[i].parent(container_i)
    }

    var dnaboxcontainer = createDiv("")
    dnaboxcontainer.class("container")
    dnaboxcontainer.parent(this.container)

    this.DNAinput = createInput();
    this.DNAinput.parent(dnaboxcontainer)

    this.DNAbox = createDiv(str(globalDNA));
    this.DNAbox.class("DNAbox")
    this.DNAbox.id("dnaBox")
    this.DNAbox.attribute("onclick","CopyToClipboard('dnaBox')")
    this.DNAbox.parent(dnaboxcontainer)
  }

  updateValues(){
    var i = 0;
    grassGrowth                     = this.SLIDERS[i].value(); i++;
    healthLossPerTime               = this.SLIDERS[i].value(); i++;
    healthLossPerMove               = this.SLIDERS[i].value(); i++;
    healthLossPerMaxHealth          = this.SLIDERS[i].value(); i++;
    healthLossPerSense              = this.SLIDERS[i].value(); i++;
    healthLossPerAge                = this.SLIDERS[i].value(); i++;
    healthLossPerBirth              = this.SLIDERS[i].value(); i++;
    healthLossPerAttack             = this.SLIDERS[i].value(); i++;
    healthGrainPerEat               = this.SLIDERS[i].value(); i++;
    maxHealth                       = this.SLIDERS[i].value(); i++;
    boidRefillBarrier               = this.SLIDERS[i].value(); i++;
    killAxonProb                    = this.SLIDERS[i].value(); i++;
    mutation_m                      = this.SLIDERS[i].value(); i++;
    mutation_p                      = this.SLIDERS[i].value(); i++;
    grassEdibilityThreshold         = this.SLIDERS[i].value(); i++;
    changeStacksProb                = this.SLIDERS[i].value(); i++;
    changeStacksSev                 = this.SLIDERS[i].value(); i++;
    changeLayersProb                = this.SLIDERS[i].value(); i++;
    changeLayersSev                 = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProbPxResp      = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverityPxResp  = this.SLIDERS[i].value(); i++;
    attackHarm                      = this.SLIDERS[i].value(); i++;
    waterDamage                     = this.SLIDERS[i].value(); i++;
    carnivorousGain                 = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[0]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[0]     = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[1]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[1]     = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[6]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[6]     = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[7]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[7]     = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[8]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[8]     = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationProb[9]         = this.SLIDERS[i].value(); i++;
    DNAinfo.mutationSeverity[9]     = this.SLIDERS[i].value(); i++;


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
