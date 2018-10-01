// PROBLEM WITH BRAIN:
//   * Neuron value seems to return undef/null
//   * Possibly due to best-boid selection
//   * Try: Use matrix approach
//       - Each layer is a matrix
//       - Between each matrix mapping, use non-linear convolution




// ============ BRAIN ============
function Brain(inputs,outputs,stacks,layers){
  this.inputs  = inputs;
  this.stacks  = stacks;
  this.outputs = outputs;
  this.layers  = layers;

  this.initiate = function(){
    this.out = new Array(this.outputs);
    this.neurons = new Array(this.stacks);
    for (var i=0; i<this.stacks; i++){
      this.neurons[i] = new Array(this.layers);
      this.neurons[i][0] = new Neuron(this.inputs);
      for (var j=1; j<this.layers; j++){
        this.neurons[i][j] = new Neuron(this.stacks);
        // this.neurons[i][j].addWeight(i,1.0);
      }
    }
    this.finalNeurons = new Array(this.outputs);
    for (var i=0; i<this.outputs; i++){
        this.finalNeurons[i] = new Neuron(this.stacks);
    }
  }

  this.think = function(input){
    this.sensed = input
    // first layer
    for (var i=0; i<this.stacks; i++) { // each neuron
      this.neurons[i][0].initialize();
      for (var k=0; k<this.inputs; k++) { // each input
        this.neurons[i][0].inputFrom(k,input[k]);
      }
      this.neurons[i][0].wrapValue(); // apply sigmoid
      // this.neurons[i][0].value = activator(this.neurons[i][0].value,0.0)
    }
    // for each deeper layer
    for (var n=1; n<this.layers; n++) { // each layer (except last)
      for (var i=0; i<this.stacks; i++) { // each neuron
        this.neurons[i][n].initialize();
        for (var k=0; k<this.stacks; k++) { // each input
          this.neurons[i][n].inputFrom(k,this.neurons[k][n-1].call());
        }
        this.neurons[i][n].wrapValue();
        // this.neurons[i][n].value = activator(this.neurons[i][n].value,0.0)
        // this.neurons[i][n].value = regulate(this.neurons[i][n].value)
      }
    }
    // for last layer
    for (var i=0; i<this.outputs; i++){ // each neuron
      this.finalNeurons[i].initialize();
      for (var k=0; k<this.stacks; k++){ // each input
        this.finalNeurons[i].inputFrom(k,this.neurons[k][this.layers-1].call());
      }
      // apply wrapper
      // this.finalNeurons[i].wrapValue();
      this.out[i] = atan(this.finalNeurons[i].call()); // atan wrapper in end
      this.out[i] = this.finalNeurons[i].call();
    }
    return this.out;
  }

  this.imitateBrain = function(brain){
    // every layer has 'stacks' neurons
    for (var i=0; i<min(brain.stacks,this.stacks); i++){
      // first takes 'input' inputs
      this.neurons[i][0].similarTo(brain.neurons[i][0]);
      // rest takes 'stacks' inputs
      for (var j=1; j<min(brain.layers,this.layers); j++){
        this.neurons[i][j].similarTo(brain.neurons[i][j]);
      }
    }
    for (var i=0; i<min(brain.outputs,this.outputs); i++){
      this.finalNeurons[i].similarTo(brain.finalNeurons[i]);
    }
    if( brain.stacks<this.stacks ){
      for (var i=this.layers-1; i>brain.layers; i++){
        for (var i=0; i<min(brain.stacks,this.stacks); i++){
          this.neurons[i][j].addWeight(j,1.0)
        }
      }
    }
  }

  this.mutate = function(m,p){
    for (var i=0; i<this.stacks; i++) {
      // first takes 'input' inputs
      if(random(100)<100./this.inputs){
        this.neurons[i][0].mutate(m,p);
      }
      // rest takes 'stacks' inputs
      for (var j=1; j<this.layers; j++) {
        if(random(100)<100./this.layers){
          this.neurons[i][j].mutate(m,p);
        }
      }
    }
    for (var i=0; i<this.outputs; i++) {
        this.finalNeurons[i].mutate(m,p);
    }
  }

  this.display = function(sx,sy){
    if(this.sensed && showNeuronValue){
      for (var i=0; i<this.sensed.length; i++){
        fill(255)
        text(round(100*this.sensed[i])/100.,0,sy*i)
      }
    }
    for (var i=0; i<this.stacks; i++) {
      // first takes 'input' inputs
      this.neurons[i][0].display(0,i,sx,sy);
      // rest takes 'stacks' inputs
      for (var j=1; j<this.layers; j++) {
        this.neurons[i][j].display(j,i,sx,sy);
      }
    }
    for (var i=0; i<outputs; i++) {
        this.finalNeurons[i].display(layers,i,sx,sy);
    }
  }
}





// ======== NEURON
function Neuron(inputs){
  this.value  = 0.0;
  this.inputs = inputs;
  this.W = new Array(inputs+1);
  for (var i=0; i<inputs+1; i++){ this.W[i] = 0.0;} //random(-1, 1); }
  // in-weights
  this.addWeight  = function(k,weight){
    this.W[k] = weight;
  }

  this.initialize = function(){
    this.value = this.W[this.inputs];
  }

  this.call       = function(){
    return this.value;
  }

  this.wrapValue = function(){
    this.value = wrapper(this.value)
  }

  this.inputFrom = function(k,signal){
    this.value += this.W[k]*signal
  }

  this.mutate = function(m,p){
    for (var i=0; i<this.inputs+1; i++) {
      if(random(100)<p){
        if(random(100)<killAxonProb){
          this.W[i] = 0.0;
        }else{
          this.W[i] = this.W[i]+random(-m,m);
        }
      }
    }
  }

  this.similarTo = function(neuron){
    for (var i=0; i<min(neuron.inputs,this.inputs); i++) {
        this.W[i] = neuron.W[i];
    }
  }

  this.display = function(n,m,sx,sy){
    for (var i=0; i<this.inputs; i++){
      if(atan(this.W[i])<0){
        strokeWeight(5*atan(-this.W[i]));
        stroke(255,0,0,180);
      }else{
        strokeWeight(5*atan(this.W[i]));
        stroke(0,255,0,180);
      }
      noFill();
      bezier(sx*n,sy*i, sx*n,sy*(i+0.5*(m-i) ), sx*(n+1),sy*(m-0.5*(m-i)), sx*(n+1),sy*m);
      //line(sx*n,sy*i, sx*(n+1),sy*m);
      if(atan(this.W[i])<0){
        fill(255,0,0,180);
      }else{
        fill(0,255,0,180);
      }
      noStroke();
      ellipse(sx*n,sy*i,10*this.W[this.inputs],10*this.W[this.inputs])
    }
    if(showNeuronValue){
      fill(255)
      text(round(100*this.value)/100.,sx*(n+1),sy*m)
    }
  }
}




function initialBrain(inputs,outputs,stacks,layers){
  var initBrain = new Brain(inputs,outputs,stacks,layers);
  initBrain.initiate()
  // initBrain.neurons[0][0].W[0]   = 1.0
  // if(layers>1){
  //   initBrain.neurons[0][1].W[0] = 1.0
  // }
  for(var i=1; i<layers; i++){
    for(var j=0; j<stacks; j++){
      initBrain.neurons[j][i].W[j] = 1.0
    }
  }
  return initBrain
}
