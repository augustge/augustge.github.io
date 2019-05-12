

// DRAW STATS GRAPH
function drawGraph(DATA,posC=[100,height-50],numfactor=0.2,timefactor=0.5,avgfactor=20.0){
  noFill()
  stroke(50);
  var L = DATA.length
  line(posC[0],posC[1],posC[0]+timefactor*L,posC[1])
  textSize(10);
  textAlign(LEFT);
  for(var n=0; n<50; n++){
    noStroke();fill(200);
    stroke(200);
    text(str(n*100),posC[0],posC[1]-numfactor*n*100)
    noFill();stroke(230);
    line(posC[0],posC[1]-numfactor*n*100,posC[0]+timefactor*L,posC[1]-numfactor*n*100)
  }
  textAlign(RIGHT);
  noStroke()
  fill(0);
  text("Count",posC[0],posC[1]-numfactor*DATA[L-1].boidCount);
  fill(0,255,0);
  text("Memory Count",posC[0],posC[1]-numfactor*DATA[L-1].memoryCount);
  fill(255,0,0);
  text("Carnivorous Count",posC[0],posC[1]-numfactor*DATA[L-1].carnivorousCount);
  stroke(0,0,255);
  text("100x Senserays avg",posC[0],posC[1]-avgfactor*(DATA[L-1].senseraySum/DATA[L-1].boidCount));
  stroke(0,255,255);
  text("100x Stacks avg",posC[0],posC[1]-avgfactor*(DATA[L-1].stacksSum/DATA[L-1].boidCount));
  stroke(255,0,255);
  text("100x Layers avg",posC[0],posC[1]-avgfactor*(DATA[L-1].layersSum/DATA[L-1].boidCount));
  noFill();
  for(var j=0; j<L; j++){
    stroke(0);
    point(posC[0]+timefactor*(L-j),posC[1]-numfactor*DATA[j].boidCount);
    stroke(0,255,0);
    point(posC[0]+timefactor*(L-j),posC[1]-numfactor*DATA[j].memoryCount);
    stroke(255,0,0);
    point(posC[0]+timefactor*(L-j),posC[1]-numfactor*DATA[j].carnivorousCount);
    stroke(0,0,255);
    point(posC[0]+timefactor*(L-j),posC[1]-avgfactor*(DATA[j].senseraySum/DATA[j].boidCount));
    stroke(0,255,255);
    point(posC[0]+timefactor*(L-j),posC[1]-avgfactor*(DATA[j].stacksSum/DATA[j].boidCount));
    stroke(255,0,255);
    point(posC[0]+timefactor*(L-j),posC[1]-avgfactor*(DATA[j].layersSum/DATA[j].boidCount));
  }
}
