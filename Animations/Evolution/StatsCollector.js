

// DRAW STATS GRAPH
function drawGraph(DATA,posC=[100,height-50],numfactor=0.1,timefactor=0.5){
  noFill()
  stroke(50);
  var L = DATA.length
  line(posC[0],posC[1],posC[0]+timefactor*L,posC[1])
  stroke(200);
  textSize(10);
  textAlign(LEFT);
  for(var n=0; n<50; n++){
    noStroke();fill(200);
    text(str(n*100),posC[0],posC[1]-numfactor*n*100)
    noFill();stroke(200);
    line(posC[0],posC[1]-numfactor*n*100,posC[0]+timefactor*L,posC[1]-numfactor*n*100)
  }
  stroke(0);
  for(var j=0; j<L; j++){
    point(posC[0]+timefactor*(L-j),posC[1]-numfactor*DATA[j]);
  }
}
