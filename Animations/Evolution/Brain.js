// PROBLEM WITH BRAIN:
//   * Neuron value seems to return undef/null
//   * Possibly due to best-boid selection
//   * Try: Use matrix approach
//       - Each layer is a matrix
//       - Between each matrix mapping, use non-linear convolution




// ============ BRAIN ============
class Brain{
  constructor(inputs,outputs,stacks,layers){
    this.inputs  = inputs;
    this.stacks  = stacks;
    this.outputs = outputs;
    this.layers  = layers;
  }

  initiate(){
    this.out = new Array(this.outputs);
    for(var i=0; i<this.outputs; i++){this.out[i]=0;}
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

  think(input){
    this.sensed = input
    // first layer
    for (var i=0; i<this.stacks; i++) { // each neuron
      this.neurons[i][0].initialize();
      for (var k=0; k<this.inputs; k++) { // each input
        this.neurons[i][0].inputFrom(k,input[k]);
      }
      this.neurons[i][0].wrapValue(); // apply sigmoid
    }
    // for each deeper layer
    for (var n=1; n<this.layers; n++) { // each layer (except last)
      for (var i=0; i<this.stacks; i++) { // each neuron
        this.neurons[i][n].initialize();
        for (var k=0; k<this.stacks; k++) { // each input
          this.neurons[i][n].inputFrom(k,this.neurons[k][n-1].call());
        }
        this.neurons[i][n].wrapValue();
      }
    }
    // for last layer
    for (var i=0; i<this.outputs; i++){ // each neuron
      this.finalNeurons[i].initialize();
      for (var k=0; k<this.stacks; k++){ // each input
        this.finalNeurons[i].inputFrom(k,this.neurons[k][this.layers-1].call());
      }
      // apply wrapper
      this.out[i] = atan(this.finalNeurons[i].call()); // atan wrapper in end
      this.out[i] = this.finalNeurons[i].call();
    }
    return this.out;
  }

  imitateBrain(brain){
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

  mutate(m,p){
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

  display(sx,sy){

    for (var i=0; i<this.sensed.length; i++){
      if(this.sensed && showNeuronValue){
        fill(255);text(round(100*this.sensed[i])/100.,0,sy*i)
      }else{
        // fill(255); noStroke();text("I",0,sy*i)
        noStroke();fill(255);ellipse(0,sy*i,15,15)
      }
    }
    for (var i=0; i<this.stacks; i++) {
      // first takes 'input' inputs
      this.neurons[i][0].display(0,i,sx,sy);
      // fill(255); noStroke(); text("H",sx,sy*i)
      // rest takes 'stacks' inputs
      for (var j=1; j<this.layers; j++) {
        this.neurons[i][j].display(j,i,sx,sy);
        // fill(255); noStroke(); text("H",sx*(1+j),sy*i)
      }
    }
    for (var i=0; i<this.outputs; i++) {
      this.finalNeurons[i].display(this.layers,i,sx,sy);
      // fill(255); noStroke(); text("F",sx*(this.layers+1),sy*i)
    }
  }

  constructFromDNA(DNA){
    this.out = new Array(this.outputs);
    for(var i=0; i<this.outputs; i++){this.out[i]=0;}
    this.neurons = new Array(this.stacks);
    for (var i=0; i<this.stacks; i++){
      this.neurons[i] = new Array(this.layers);
      this.neurons[i][0] = new Neuron(this.inputs);
      for(var ii=0; ii<this.inputs; ii++){
        var index = 2+i*this.inputs+ii;
        this.neurons[i][0].addWeight(ii,DNA[index]);
      }
      for (var j=1; j<this.layers; j++){
        this.neurons[i][j] = new Neuron(this.stacks);
        for(var ii=0; ii<this.stacks; ii++){
          // var index = 2+this.inputs*this.stacks+j*this.stacks+ii
          var index = 2+(this.inputs+(j-1)*this.stacks+i)*this.stacks+ii
          this.neurons[i][j].addWeight(ii,DNA[index]);
        }
      }
    }
    this.finalNeurons = new Array(this.outputs);
    for (var i=0; i<this.outputs; i++){
        this.finalNeurons[i] = new Neuron(this.stacks);
        for(var ii=0; ii<this.stacks; ii++){
          var index = 2+(this.inputs+(this.layers-1)*this.stacks)*this.stacks
          index += i*this.stacks+ii;
          this.finalNeurons[i].addWeight(ii,DNA[index])
        }
    }

  }

}





// ======== NEURON
class Neuron{
  constructor(inputs){
    this.value  = 0.0;
    this.inputs = inputs;
    this.W = new Array(inputs+1);
    for (var i=0; i<inputs+1; i++){ this.W[i] = 0.0;} //random(-1, 1); }
  }
  // in-weights
  addWeight(k,weight){
    this.W[k] = weight;
  }

  initialize(){
    this.value = this.W[this.inputs];
  }

  call(){
    return this.value;
  }

  wrapValue(){
    this.value = wrapper(this.value)
  }

  inputFrom(k,signal){
    this.value += this.W[k]*signal
  }

  mutate(m,p){
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

  similarTo(neuron){
    for (var i=0; i<min(neuron.inputs,this.inputs); i++) {
        this.W[i] = neuron.W[i];
    }
  }

  display(n,m,sx,sy){
    noStroke();fill(255);ellipse(sx*(n+1),sy*m,15,15)
    for (var i=0; i<this.inputs; i++){
      if(atan(this.W[i])<0){
        strokeWeight(-6*atan(this.W[i]));
        stroke(255,0,0,180);
      }else{
        strokeWeight(6*atan(this.W[i]));
        stroke(0,255,0,180);
      }
      noFill();
      bezier(sx*n,sy*i, sx*n,sy*(i+0.5*(m-i) ), sx*(n+1),sy*(m-0.5*(m-i)), sx*(n+1),sy*m);
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
  for(var i=1; i<layers; i++){
    for(var j=0; j<stacks; j++){
      initBrain.neurons[j][i].W[j] = 1.0
    }
  }
  return initBrain
}
