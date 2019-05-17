
function wrapper(x){
  return atan(x) // ARCTAN
  // return max(x,0); // RELU
  // return 1.0/(1+exp(-x)); // SIGMOID
}


function DNAdiff(boid1,boid2){
  var diff = 0
  for(var i=0; i<min(boid1.ID.length,boid2.ID.length); i++){
    diff += sq(boid1.ID[i]-boid2.ID[i])
  }
  return sqrt(diff)
}

function boidMetric(boid){
  return 20*boid.health + 10*boid.children + 5*boid.eats + boid.moves + boid.age/float(healthLossPerTime+healthLossPerMove+healthLossPerBirth)
}

function countBoid(boid){
  STATS.boidCount++;
  if(boid.hasMemory){   STATS.memoryCount++;}
  if(boid.carnivorous){ STATS.carnivorousCount++;}
  STATS.senseraySum += (boid.rays+1)*boid.rayPoints;
  STATS.layersSum   += boid.layers;
  STATS.stacksSum   += boid.stacks;
}

function uncountBoid(boid){
  STATS.boidCount--;
  if(boid.hasMemory){   STATS.memoryCount--;}
  if(boid.carnivorous){ STATS.carnivorousCount--;}
  STATS.senseraySum -= (boid.rays+1)*boid.rayPoints;
  STATS.layersSum   -= boid.layers;
  STATS.stacksSum   -= boid.stacks;
}

function getStatsCopy(stats){
  var stat = {}
  for (var property in stats) {
    stat[property] = stats[property];
  }
  return stat
}


function getGlobalDNA(s){
  var dna = []
  s_split = s.split(",")
  for(var i=0; i<s_split.length;i++){
    dna.push(float(s_split[i]))
  }
  return dna;
}


function CopyToClipboard(containerid) {
  var elm = document.getElementById(containerid);
  // for Internet Explorer
  if(document.body.createTextRange) {
    var range = document.body.createTextRange();
    range.moveToElementText(elm);
    range.select();
    document.execCommand("Copy");
  }
  else if(window.getSelection) {
    // other browsers
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(elm);
    selection.removeAllRanges();
    selection.addRange(range);
    print(selection,range)
    document.execCommand("Copy");
  }
}


function colorwheel(a,theta,x){
  return a*(1+cos(theta+x))
}


// ============ COLORS ============
function defineColors(){
  // Cdirt1  = color("rgb(64,50,25)");
  // Cdirt2  = color("rgb(89,73,42)");
  // Cgrass1 = color("rgb(39,89,2)");
  // Cgrass2 = color("rgb(85,140,3)");
  // Cwater  = color("rgb(22,107,140)");
  // Cwater2 = color("rgb(15,100,155)");


  Cdirt2  = color("rgb(89,73,42)")//"#A68572");
  Cgrass1 = color("rgba(101,166,3,0)");
  Cgrass2 = color("#65A603");
  Cwater  = color("#67B8DE");
  Cdirt1  = color("#D9B5A0");
  Cgrass1 = color("rgb(39,89,2)");
  Cwater2 = color("#F0F2F1");
}
