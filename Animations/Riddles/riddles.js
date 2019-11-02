

var RIDDLES = [];

function setup(){
  var C = createCanvas(windowWidth, windowHeight);
  C.parent("sketch-holder");
  RIDDLES.push(
  new Riddle("Pile of Coins",
  "You are in a dark room and in front of you is an unknown number of coins, but you know that 20 of them are facing heads up. If you are allowed to flip coins, how can you divide the pile in two in such a way that you are certain that both piles contain the same number of coins facing heads up?",3))
  RIDDLES.push(
  new Riddle("Touching Coins","What is the maximal number of (equal) coins you can put together such that every coin touches every other coin? How would you arrange the coins to achieve this?",3))
  RIDDLES.push(
  new Riddle("Touching Cigarettes","What is the maximal number of (equal) cigarettes you can put together such that every cigarette touches every other cigarette? How would you arrange the cigarette to achieve this?",3))
  RIDDLES.push(
  new Riddle("Twelve Apples","",3))

  for(var i=0; i<RIDDLES.length; i++){
    RIDDLES[i].setPosition(100+50*(i/10),100+50*(i%10))
  }

}

function draw(){
  background(255)
  for(var i=0; i<RIDDLES.length; i++){
    RIDDLES[i].display()
  }

}


class Riddle{
  constructor(title,description,difficulty){
    this.title        = title
    this.description  = description
    this.difficulty   = difficulty
  }

  setPosition(x,y){
    this.X = x;
    this.Y = y;
    return this
  }

  display(){
    text(this.title,this.X,this.Y)
  }
}
