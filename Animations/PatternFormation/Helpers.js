
function setColorHEX(hex){
  colorInput.value( hex );
  colorInput.style('background-color',colorInput.value());
}
function setColorRGBA(rgba){
  colorInput.value( rgbToHex(rgba) );
  colorInput.style('background-color',colorInput.value());
}

function rgbToHex(rgb){
  r = rgb[0].toString(16); if(r.length==1){r="0"+r;}
  g = rgb[1].toString(16); if(g.length==1){g="0"+g;}
  b = rgb[2].toString(16); if(b.length==1){b="0"+b;}
  return "#" + r + g + b;
}

function distanceTo(A,B){
  return sq(A[0]-B[0])+sq(A[1]-B[1])+sq(A[1]-B[1])
}

function pixelFromCanvasCoord(x,y){
  var X = x*buffer.width/width;
  var Y = y*buffer.height/height;
  var i = 4*(int(Y)*buffer.width+int(X));
  return [buffer.pixels[i],buffer.pixels[i+1],buffer.pixels[i+2],buffer.pixels[i+3]];
}
