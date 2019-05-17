// ================================================
//               PLANS
// ================================================
/*

// SMALL FIXES
(*) Add smell (neighbor block fingerprint)
(*) Add "sexually reproduce with neighbor" response
(*) Add thirst & drink properties
(*) Improve stats pane -- adujstable + noRedraw/storage needed
(*) Add modular digestion/response/sense -- can drink water? can consume meat? ...
(*) Add boid-response for sensing properties of boid -- direction + health + ...
(*) Connect color DNA to realistic sense data -- i.e. carnivorousity
(*) Add erode terrain button -- random droplets carry terrain down along gradients
(*) Add Swimming species
(*) Add jumping/flying
(*) Prettify CSS
(*) Add n x inputs + STACKS + outputs for memory blocks
(*) Separate DNA mutators to make them adjustable in controlpanel
(*) Add grid of living boids

*/

// ================================================
//               PARAMETERS
// ================================================


// globalDNA = [
//   0: color 1 -- hasMemory (memoryBlocks if #>1)
//   1: color 2 -- carnivorous (if >0.5)
//   2: color 3
//   3:
//   4:
//   5:
//   6: senseLength
//   7: FOV
//   8: rays
//   9: rayPoints
//     Nx[a,b,c]: px responses
//     layers
//     stacks
//     0,0,0,0,0,  0,0,0,0,0,  0,0,0,0,0,    1,0,0, 0,1,0, 0,0,1,   0,0,0, 0,0,0, 0,0,0, 0,0,0, 0,0,0
// ]

globalDNA = [0.1,0.4,0.3,0,0,0,0,0,0,0,0.2,0.1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]

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
var terrainScale              = 10
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
var waterDamage           = 10;
var healthGrainPerEat     = 50; // assuming fully grown grass
var maxHealth             = 500;
var boidRefillBarrier     = 50;
var attackHarm            = 400;
var carnivorousGain       = 8.5;
var DNAinfo = {
  "mutationProb"          : [ 0.5,  0.5,  1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0],
  "mutationSeverity"      : [0.05, 0.02, 0.05, 0.01, 0.05, 0.05, 0.01, 0.01, 0.01, 0.01],
  "mutationProbPxResp"    : 0.,
  "mutationSeverityPxResp": 0.01
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


// ------- BRAIN
var killAxonProb          = 0.1;
var mutation_m            = 0.1  // severity --> mutatable?
var mutation_p            = 5.5  // probability --> mutatable?
var changeStacksProb      = 0.6;
var changeStacksSev       = 0.1;
var changeLayersProb      = 0.2;
var changeLayersSev       = 0.01;

// ------- VISUAL
var showNeuronValue       = false;
var drawHealth            = false;
var drawSensedBlocks      = true;


// ------- DUMMYs
var MATRIX,CONTROLPANEL,dx,dy;
var Cdirt1, Cdirt2, Cgrass1, Cgrass2, Cwater;
var bestBoid;


function setup(){
  createCanvas(window.innerWidth-10, window.innerHeight-10);
  // frameRate(100);
  initateScenario();
}


function initateScenario(){
  windowY   = windowX*windowHeight/windowWidth;
  dx = width/windowX;
  dy = height/windowY;
  defineColors();
  MATRIX = new Matrix(Nx,Ny);
  MATRIX.initialize(num,falloff,0.01);
  CONTROLPANEL = new ControlPanel();
  CONTROLPANEL.hideAll();
  noStroke();
}


function draw(){
  if(CONTROLPANEL.PANELSELECT.value()=="Information"){
    STATS.boidCount = MATRIX.do(display=true);
    MATRIX.refill();
    CONTROLPANEL.updateValues();
    CONTROLPANEL.statisticsAccounting();
    CONTROLPANEL.introduction.show();
  }else if(CONTROLPANEL.PANELSELECT.value()=="Animation"){
    background(Cdirt2)
    strokeWeight(1);
    noStroke();
    // MATRIX.display(I,J,windowX,windowY);
    MATRIX.displayBackground(I,J,windowX,windowY);
    MATRIX.displayToplayer(I,J,windowX,windowY);
    STATS.boidCount = MATRIX.do(display=true);
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
    background(0);
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.updateValues();
    CONTROLPANEL.statisticsAccounting();
    fill(255,0,0)
    text(STATS.boidCount, width-50, height-50);
  }else if(CONTROLPANEL.PANELSELECT.value()=="Statistics"){
    background(255);
    strokeWeight(1);
    STATS.boidCount = MATRIX.do();
    MATRIX.refill();
    CONTROLPANEL.statisticsAccounting()
    drawGraph(CONTROLPANEL.STATISTICS)
  }

  if(CONTROLPANEL.PANELSELECT.value()!=Screen){
    if(CONTROLPANEL.PANELSELECT.value()=="Information"){
      CONTROLPANEL.introduction.show()
      CONTROLPANEL.container.hide()
    }else if(CONTROLPANEL.PANELSELECT.value()=="Controlpanel"){
      CONTROLPANEL.container.show()
      CONTROLPANEL.introduction.hide()
    }else{
      CONTROLPANEL.container.hide()
      CONTROLPANEL.introduction.hide()
    }
    Screen = CONTROLPANEL.PANELSELECT.value()
  }

  // refillProbability
}


// GOOD DNA:
// 0.9145546261681798,0.020360855367930614,0.02480404618405932,0.9511804034053324,0,0.040938379452995194,0.12497755616313726,0.23111426651593933,0,0.16480059747790007,1,0.9536931539253147,1,0.28157998506229653,0.19899298944827024,-0.4783417480284491,0.6024136277854235,-0.08371740811939846,0.6076495448738523,0.9279053222159347,-0.1477405434550555,-0.03400815374732763,-0.09668985406511124,-0.14288901360116124,0.2359263281559183,-0.1642279884431649,-0.10982037147252122,-0.5437387418959092,-0.8371380750418582,-0.712300460639887,-0.20505444883120041,0,0.45841960958404937,-0.06468967079759902,-0.0295657392460809,0.2123654153034038,-0.2197816450165529,-0.021756237745751375,-0.018660290532103788,0.05802734914795066,0.05587159362002678,-0.5263030612821606,-0.0008652258622784403,0.3314910105699509,0.13687412079776468,-1.281811442744075,-0.16499490241037934,-0.03791331005265301,-0.3110149242781332,0.27440746629656826,-0.13790701133281064,0.20085890577132715,0.037099163450279526,0.20764713926753844,0

// 0.9026990751568944,0,0.03959308827432221,0.9106228622728454,0.01758090473390113,0.0013295130905739694,0.07048820465800715,0.2580085654298727,0.02325487724796675,0.14823150729838286,1,0.9632125256879858,1,0.2634645866066674,0.19703155395446967,-0.2743545918267417,0.4274984196828041,-0.08371740811939846,0.6743300647311541,0.8462353806237719,-0.10509023278875895,-0.08909706356977962,-0.15136653320980567,-0.1744220739667374,0.23098588700152195,-0.11191034961421907,-0.04820582370015296,-0.5550348851312439,-0.7263943917950393,-0.7311021019184747,0.13167090447220256,-0.28871259890641116,-0.07201937240864834,0.14679945307554104,-0.009556812566049525,-0.41410888522383327,0.4650887884568833,0.0826077725927762,-1.254508194147606,-0.10994816437166857,-0.3224371141393709,0.20044971609857706,0.1944867888247085,-0.020546675145016388,0.16569183598797288

// 0.8924518429844038,0.011425525724266958,0.07349580336231322,0.917846882317479,0,0.0013295130905739694,0.07048820465800715,0.2580085654298727,0.02325487724796675,0.14823150729838286,1,0.9632125256879858,1,0.2634645866066674,0.19899298944827024,-0.4944988660574199,0.4274984196828041,-0.15403665452282922,0,0.8771152797050517,-0.1477405434550555,-0.08909706356977962,-0.1935628933600571,-0.1750476024175939,0.2831966085289176,-0.21630821583880347,-0.15557941205882464,-0.5898407296610179,-0.7263943917950393,-0.8006138640989391,0.15662651937451155,-0.24803517506604664,-0.1522897234701083,-0.03893603042639104,-0.09147615029908457,-0.4169586823187362,0.46500348971068933,0.0826077725927762,-1.3184940688796507,0.025043728664573897,-0.3501405463409786,0.35495305936137145,0.2109377492482498,-0.10635523820140437,0.24610656463421932
