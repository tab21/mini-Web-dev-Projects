var colors=["red","yellow","green","blue"];
var gamepattern=[]
var userpattern=[]
var start=false;
var level = 0;

$(document).keypress(function(){
  if (!start){
    $("h1").text("Game is on")
    $("b").text(level);
    $("h2").remove();
    sequence();
    start=true;
  }
});

$("button").click(function(){
  var clickedColor =$(this).attr("class");
  userpattern.push(clickedColor);  
  press(clickedColor);  
  checkAns(userpattern.length-1);
});

function checkAns(current){
  if (userpattern[current]===gamepattern[current]){
    if (userpattern.length===gamepattern.length){
      setTimeout(function (){
        sequence()},1000);
    }
  }else {
    $("h2").remove();
    $("h1").text("Wrong!!!");
    $("h1").after("<h2>Game Over, Press any key to restart.</h2>");
    $("body").addClass("over");
    
    setTimeout(function(){
       $("body").removeClass("over");
    },100);
    
    start=false ;
    gamepattern=[];
    level=0;
    
    
  }
  
}
function sequence(){
  userpattern=[];
  level++;
  $("b").text(level);
  
  var i= Math.floor(Math.random()*4);
  gamepattern.push(colors[i]);
  
  $("#"+colors[i]).fadeIn(100).fadeOut(100).fadeIn(100);
}

function press(color){
  $("#"+color).addClass("pressed");
  setTimeout(function(){
    $("#"+color).removeClass("pressed");
  },100);
}






