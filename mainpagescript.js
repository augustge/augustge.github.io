
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
  var text = get_file("Brachistochroneproblemet.html",function(response){TEXT=response;});
  div.html(text)
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
