// ================================================
//               PLANS
// ================================================
/*

* (0) Start-Boid
    [1] Eats fruit
    [2] Reproduces much
    [3] Few degrees of freedom

* (1) Carnivore
    [1] Eats others (non-carnivores)
    [2] Not very reproductive
    [3] Lives for long

* (2) Grass-eater
    [1] Eats grass only 



  * GENERAL
  --> Add "store boid" button in brain display
  --> Add distribute stored boid
  --> Add INFO panel
  --> Fix zoom center
  -->

  * TERRAIN
  --> Main food: Fruit
  --> Special eaters: Grass, Others, ...
  --> Sophisticate grass (spreading, deminishing, variants, id vector)
        boid can only eat stuff within radius og eat vecot in grass space
  --> Better display

  * BOID
  --> Better Display:
      o
      o
  --> Mutatable response system?
      o sophisticated movement: feet lift/push
      o

  * BRAIN
  --> Memory blocks?


*/

// ================================================
//               PARAMETERS
// ================================================

// ------- GENERAL
var Nx        = 13*20;
var Ny        = 10*20;
var windowX   = Nx/4;
var windowY   = Ny/4;
var I         = 0;
var J         = 0;
var Screen    = "MAIN";

// ------- SPAWNING
var objSpawnProb  = 0.01

// ------- ENVIRONMENT
var num                       = 55  // grass fertility noise
var falloff                   = 0.5 // grass fertility noise
var terrainScale              = 15
var terrainContrast           = 20.
var grassGrowth               = 0.01
var spreadGrowth              = 0.001
var grassFullLife             = 100
var grassThreshold            = 0.1
var grassEdibilityThreshold   = 0.1
var refillGrass               = false
var refillGrassNum            = 1


// ------- OBJECT
var healthLossPerTime     = 0.05;
var healthLossPerMove     = 0.5;
var healthLossPerBirth    = 0.4;
var healthLossPerAge      = 0.01;
var healthLossPerAttack   = 0.5;
var healthLossPerMaxHealth= 0.01;
var healthLossPerSense    = 0.0001;
var healthGrainPerEat     = 50; // assuming fully grown grass
var maxHealth             = 500;
var numID                 = 10;
var DNAmutationProb       = 0.005;
var refillProbability     = 6.0;
var boidCount             = 0;
var boidRefillBarrier     = 500;
var attackHarm            = 300;
var addSensoryStackProb   = 0.5;
var removeSensoryStackProb= 0.5;
var carnivorousGain       = 8.5;

// ------- BRAIN
var killAxonProb          = 2.5;
var inputs_init           = 6
var outputs_init          = 5
var stacks_init           = 4
var layers_init           = 2
var refillMutation_m      = 0.5//1.0  // severity
var refillMutation_p      = 10.0//90.0 // probability
var mutation_m            = 0.1 // severity --> mutatable?
var mutation_p            = 0.5  // probability --> mutatable?
var addLayerProb          = 0.2
var removeLayerProb       = 0.2
var changeStacksProb      = 0.2;
var maxStacks             = 20
var maxBrainLayers        = 10
var addResponseProb       = 1.0
var removeResponseProb    = 1.0
var minResponses          = 5;
var maxResponses          = 6;
var changeSenseraysProb   = 1.0;
var changeSensepointsProb = 1.0;
var changeFOVProb         = 1.0;
var dFOV                  = 0.1;
var changeSenseLProb      = 10.0;
var dSenseLength          = 0.1;

// ------- VISUAL
var showNeuronValue       = false;
var drawHealth            = false;
var drawSensedBlocks      = false;


// ------- EVENTS
var onclick = "DIG";

// ------- DUMMYs
var MATRIX,CONTROLPANEL,dx,dy;
var Cdirt1, Cdirt2, Cgrass1, Cgrass2;
var bestBoid;

function setup(){
  createCanvas(windowWidth, windowHeight);
  frameRate(200);
  initateScenario();
}

function draw(){
  if(CONTROLPANEL.PANELSELECT.value()=="Animation"){
    background(Cdirt2)
    strokeWeight(1);
    noStroke();
    // MATRIX.display(I,J,windowX,windowY);
    MATRIX.displayBackground(I,J,windowX,windowY);
    MATRIX.displayToplayer(I,J,windowX,windowY);
    boidCount = MATRIX.do();
    MATRIX.refill();
    fill(255);
    text(bestBoid.age, 10, 30);
    text(boidCount, 10, 40);
    text(boidRefillBarrier,10,60);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Brain dynamics"){
    boidCount = MATRIX.do();
    MATRIX.refill();
    background(0);
    translate(0.1*width, 0.1*height);
    var sx = min(0.8*width/(bestBoid.BRAIN.layers+2),width/7);
    var sy = 0.8*height/max(bestBoid.BRAIN.stacks,bestBoid.BRAIN.inputs,bestBoid.BRAIN.outputs)
    bestBoid.BRAIN.display(sx,sy);
    fill(255);
    text(bestBoid.age, -50, 30);
    text(boidCount, -50, 40);
    text(boidRefillBarrier,-50,50);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Controlpanel"){
    background(255);
    boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.updateValues();
    CONTROLPANEL.display(80+140,20,20,15);
    fill(255,0,0)
    text(boidCount, width-50, height-50);
  }

  if(CONTROLPANEL.PANELSELECT.value()!=Screen){
    if(CONTROLPANEL.PANELSELECT.value()=="Controlpanel"){
      CONTROLPANEL.showAll();
    }else{
      CONTROLPANEL.hideAll();
    }
    Screen = CONTROLPANEL.PANELSELECT.value()
  }

  // refillProbability
}


function initateScenario(){
  dx = width/windowX;
  dy = height/windowY;

  MATRIX = new Matrix(Nx,Ny);
  MATRIX.initialize(num,falloff,objSpawnProb);

  CONTROLPANEL = new ControlPanel();
  CONTROLPANEL.assignPositions(80,20,20,15);
  CONTROLPANEL.hideAll();

  defineColors();
  noStroke();
}
