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

*/

// ================================================
//               PARAMETERS
// ================================================


// globalDNA = [
  // 0: color 1
  // 1: color 2
  // 2: color 3
  // 3: maxHealth
  // 4: hasMemory (memoryBlocks if #>1)
  // 5: carnivorous
  // 6: senseLength
  // 7: FOV
  // 8: rays
  // 9: rayPoints
  //   Nx[a,b,c]: px responses
  //   layers
  //   stacks
  //   0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,    1,0,0, 0,1,0, 0,0,1,   0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0
// ]

globalDNA = [0.9616288754798882, 0, 0.015665259720376218, 0.9124127183036169, 0, 0, 0.07990297249368813, 0.1954313895425622, 0, 0.11971413992556096, 1, 1, 1, 0.2, 0.19899298944827024, -0.14249105234799497, 0.04685435165358848, -0.061907755285282966, 0.17205059778249843, -0.03158643984914481, -0.12598975966665138, -0.02934107536930332, 0.085990142156817, 0.048096712290814324, 0.03095519982653895, 0, -0.11044146281036966, -0.15957493259183692, -0.2777550970528103, -0.025252040966851824, 0.2340593545841449, 0.01670221323291264, 0.006691526902958808, -0.07406562148061091, 0.12722094366677478, 0.03568031698457904, 0.2976945320737261, 0.10343633614907094, -0.08488824949732444, -0.031009096063088895, -0.30199603393372854, 0.1589103626286364, 0.09081211581844112, -0.03929452580001902, 0.07119400431465198]


// ------- GENERAL
var Nx        = 13*30;
var Ny        = 10*30;
var windowX   = Nx/4;
var windowY   = Ny/4;
var I         = 0;
var J         = 0;
var Screen    = "Information";

// ------- SPAWNING

// ------- ENVIRONMENT
var num                       = 55  // grass fertility noise
var falloff                   = 0.5 // grass fertility noise
var terrainScale              = 15
var terrainContrast           = 20.
var grassGrowth              = 0.01
var spreadGrowth             = 0.001
var grassFullLife            = 100
var grassThreshold            = 0.1
var grassEdibilityThreshold   = 0.001
var refillGrass               = false
var refillGrassNum            = 1


// ------- OBJECT
var healthLossPerTime     = 0.05;
var healthLossPerMove     = 0.5;
var healthLossPerBirth    = 0.4;
var healthLossPerAge      = 0.01;
var healthLossPerAttack   = 0.0;
var healthLossPerMaxHealth= 0.01;
var healthLossPerSense    = 0.0;
var healthGrainPerEat     = 50; // assuming fully grown grass
var maxHealth             = 500;
var boidRefillBarrier     = 50;
var attackHarm            = 400;
var carnivorousGain       = 8.5;
var DNAinfo = {
  "mutationProb"          : 1.0,
  "mutationSeverity"      : 0.05,
  "mutationProbPxResp"    : 0.1,
  "mutationSeverityPxResp": 0.1
}

// ------- STATS
var STATS = {
  boidCount: 0,
  memoryCount: 0,
  carnivorousCount: 0,
  senseraySum: 0,
  layersSum: 0,
  stacksSum: 0
}
/*
  (a+b+c)/3
*/


// ------- BRAIN
var killAxonProb          = 2.5;
var mutation_m            = 0.1 // severity --> mutatable?
var mutation_p            = 5.5  // probability --> mutatable?
var changeStacksProb      = 0.6;
var changeStacksSev       = 0.1;
var changeLayersProb      = 0.2;
var changeLayersSev       = 0.01;

// ------- VISUAL
var showNeuronValue       = false;
var drawHealth            = false;
var drawSensedBlocks      = true;


// ------- EVENTS
var onclick = "DIG";

// ------- DUMMYs
var MATRIX,CONTROLPANEL,dx,dy;
var Cdirt1, Cdirt2, Cgrass1, Cgrass2, Cwater;
var bestBoid;


function setup(){
  createCanvas(windowWidth, windowHeight);
  windowY   = windowX*windowHeight/windowWidth;
  frameRate(100);
  initateScenario();
}


function initateScenario(){
  dx = width/windowX;
  dy = height/windowY;
  defineColors();
  MATRIX = new Matrix(Nx,Ny);
  MATRIX.initialize(num,falloff,0.01);
  CONTROLPANEL = new ControlPanel();
  CONTROLPANEL.assignPositions(80,20,20,15);
  CONTROLPANEL.hideAll();
  noStroke();
}


function draw(){
  if(CONTROLPANEL.PANELSELECT.value()=="Information"){
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.updateValues();
    CONTROLPANEL.statisticsAccounting();
    background(0);
    noStroke();
    textSize(60);
    textAlign(CENTER);
    textSize(60);fill(Cwater);
    text("EVOLUTION",width/2,height/4)
    textSize(14);fill(255);
    text("Welcome! In the 'Animation' screen, you can monitor the behaviour \n of the species that have evolved as they navigate the terrain. Each of \n these creatures have a unique brain. The brain of best creature \n (according to some arbitrary metric) is displayed in the \n 'Brain dynamics' screen. In the 'Controlpanel' screen \n you can adjust parameters for the terrain, creature mutation \n and creature health. If you press 'space' a DNA strand will appear \n in the control panel. Any valid DNA strand \n can be copied into the input box. Choosing the 'makeboid' option \n in the controlpanel then allows you (when in the animation screen) \n to place this creature in the terrain.   ",width/2,height/4+50)
    textSize(12); textAlign(LEFT);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Animation"){
    background(Cdirt2)
    strokeWeight(1);
    noStroke();
    // MATRIX.display(I,J,windowX,windowY);
    MATRIX.displayBackground(I,J,windowX,windowY);
    MATRIX.displayToplayer(I,J,windowX,windowY);
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.statisticsAccounting()
    fill(255);
    text(bestBoid.age, 10, 30);
    text(STATS.boidCount, 10, 40);
    text(boidRefillBarrier,10,60);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Brain dynamics"){
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    background(0);
    translate(0.1*width, 0.1*height);
    var sx = min(0.8*width/(bestBoid.BRAIN.layers+2),width/7);
    var sy = 0.8*height/max(bestBoid.BRAIN.stacks,bestBoid.BRAIN.inputs,bestBoid.BRAIN.outputs)
    bestBoid.BRAIN.display(sx,sy);
    CONTROLPANEL.statisticsAccounting()
    fill(255);
    text(bestBoid.age, -50, 30);
    text(STATS.boidCount, -50, 40);
    text(boidRefillBarrier,-50,50);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Controlpanel"){
    background(255);
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.updateValues();
    CONTROLPANEL.statisticsAccounting()
    CONTROLPANEL.display(80+140,20,20,15);
    fill(255,0,0)
    text(STATS.boidCount, width-50, height-50);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Statistics"){
    background(255);
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.statisticsAccounting()
    drawGraph(CONTROLPANEL.STATISTICS)
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


// GOOD DNA:
// 0.9145546261681798,0.020360855367930614,0.02480404618405932,0.9511804034053324,0,0.040938379452995194,0.12497755616313726,0.23111426651593933,0,0.16480059747790007,1,0.9536931539253147,1,0.28157998506229653,0.19899298944827024,-0.4783417480284491,0.6024136277854235,-0.08371740811939846,0.6076495448738523,0.9279053222159347,-0.1477405434550555,-0.03400815374732763,-0.09668985406511124,-0.14288901360116124,0.2359263281559183,-0.1642279884431649,-0.10982037147252122,-0.5437387418959092,-0.8371380750418582,-0.712300460639887,-0.20505444883120041,0,0.45841960958404937,-0.06468967079759902,-0.0295657392460809,0.2123654153034038,-0.2197816450165529,-0.021756237745751375,-0.018660290532103788,0.05802734914795066,0.05587159362002678,-0.5263030612821606,-0.0008652258622784403,0.3314910105699509,0.13687412079776468,-1.281811442744075,-0.16499490241037934,-0.03791331005265301,-0.3110149242781332,0.27440746629656826,-0.13790701133281064,0.20085890577132715,0.037099163450279526,0.20764713926753844,0

// 0.9026990751568944,0,0.03959308827432221,0.9106228622728454,0.01758090473390113,0.0013295130905739694,0.07048820465800715,0.2580085654298727,0.02325487724796675,0.14823150729838286,1,0.9632125256879858,1,0.2634645866066674,0.19703155395446967,-0.2743545918267417,0.4274984196828041,-0.08371740811939846,0.6743300647311541,0.8462353806237719,-0.10509023278875895,-0.08909706356977962,-0.15136653320980567,-0.1744220739667374,0.23098588700152195,-0.11191034961421907,-0.04820582370015296,-0.5550348851312439,-0.7263943917950393,-0.7311021019184747,0.13167090447220256,-0.28871259890641116,-0.07201937240864834,0.14679945307554104,-0.009556812566049525,-0.41410888522383327,0.4650887884568833,0.0826077725927762,-1.254508194147606,-0.10994816437166857,-0.3224371141393709,0.20044971609857706,0.1944867888247085,-0.020546675145016388,0.16569183598797288

// 0.8924518429844038,0.011425525724266958,0.07349580336231322,0.917846882317479,0,0.0013295130905739694,0.07048820465800715,0.2580085654298727,0.02325487724796675,0.14823150729838286,1,0.9632125256879858,1,0.2634645866066674,0.19899298944827024,-0.4944988660574199,0.4274984196828041,-0.15403665452282922,0,0.8771152797050517,-0.1477405434550555,-0.08909706356977962,-0.1935628933600571,-0.1750476024175939,0.2831966085289176,-0.21630821583880347,-0.15557941205882464,-0.5898407296610179,-0.7263943917950393,-0.8006138640989391,0.15662651937451155,-0.24803517506604664,-0.1522897234701083,-0.03893603042639104,-0.09147615029908457,-0.4169586823187362,0.46500348971068933,0.0826077725927762,-1.3184940688796507,0.025043728664573897,-0.3501405463409786,0.35495305936137145,0.2109377492482498,-0.10635523820140437,0.24610656463421932
