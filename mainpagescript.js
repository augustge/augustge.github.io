
var canvas;

var div;

function setup(){
  canvas = createCanvas(windowWidth,windowHeight);

  div = createDiv("BOBOBO TATATA")
  div.position(width/2,height/2)
  div.attribute("w3-include-html","Brachistochroneproblemet.html")



}

function draw(){
  // background(0);
}

function mousePressed(){
  // var text = get_file("Brachistochroneproblemet.html",function(response){TEXT=response;});
  fileSelect = createFileInput(gotFile, 'multiple');
  // div.html(text)
}


function get_file(url, callback)
{
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, true);
    xmlhttp.onreadystatechange = function()
    {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200)
        {
            callback(xmlhttp.responseText);
        }
    }
    xmlhttp.send();
}


}

function gotFile(file) {
  var fileDiv = createDiv(file.name + ' ' + file.type + ' ' + file.subtype + ' ' + file.size + ' bytes');
  if (file.type === 'image') {
    var img = createImg(file.data);
    img.class('thumb');
  } else if (file.type === 'text') {
    createDiv(file.data);
  }
}
