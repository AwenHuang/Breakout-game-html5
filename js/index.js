
// global value for localStorage funtion triggered by rank button 
var player_name;
var points;
var players = [];
var scores = [];
var Players;
var Scores;



/*-- start() triggered by start button --*/
function start(){

  // draw canvas
  var canvas = $('#game-canvas')[0]; 
  var context = canvas.getContext('2d');

  var height = canvas.height;
  var width = canvas.width;

  var paddleWidth = 125;
  var paddleHeight = 8;

  var ballSize = 28;
  var speed = 4;
 
  points = 0;
  

  /* PADDLE INTERACTION */
  
  // mouse motion
  
    $(document).bind('mouseenter touchstart',function(e) {
      e.preventDefault();
      $(this).bind('mousemove touchmove',function(e) {
        mouseX = e.originalEvent.pageX;
        $('.paddle').css('left',mouseX-(paddleWidth/2)+'px');
      });
    });
    $(document).bind('mouseleave touchend',function(e) {
      $(document).unbind('mousemove touchmove');
    });
  


  var paddleX = 0;
  var paddleY = 0 ;

  // move paddle by keyboard left and right 
  function movePaddle(){
    if(paddleMove == 'RIGHT'){
      if((paddleX+paddleWidth) < (width)){
          paddleX = paddleX + 10;
        }
        $('.paddle').css('left',paddleX+'px');

    }
    else if(paddleMove == 'LEFT'){
      if(paddleX > 0){
          paddleX = paddleX - 10;
        }
         $('.paddle').css('left',paddleX+'px');
    }
  }

  var bouncingSound = new Audio("MarioJump.ogg");
  var breakingSound = new Audio("CoinSound.ogg");

  /* BALL MOTION */
  var ballX;
  var ballY;
  var moveX = speed;
  var moveY = speed;


  var ball_colors = ['#FF44AA','#FFFF33','#CCFF33','#99FF33','#33FFAA','#33FFDD','#33CCFF','#5555FF','#7744FF','#B94FFF','#FF00FF'];
  var paddle_colors = ['#191970','#483D8B','#0000CD','#4682B4','#008B8B','#5F9EA0','#48D1CC','#228B22','#3CB371','#32CD32','#B8860B','#CD5C5C','#8B008B'];

  function moveBall(){
    paddleX = Math.round($('.paddle').position().left);
    paddleY = Math.round($('.paddle').position().top);
    
    if (ballX >= width-ballSize) {moveX = -speed;}
    else if (ballX <= 0) {moveX = +speed;}

    rowheight = BRICKHEIGHT;
    colwidth = BRICKWIDTH;
    row = Math.floor(ballY/rowheight);
    col = Math.floor(ballX/colwidth);

    // detect which brick had collision , mark the brick as broken
    if (ballY < NROWS * rowheight && row >= 0 && col >= 0 && bricks[row][col] == 1) {
      breakingSound.play();
      moveY = +speed;
      bricks[row][col] = 0;
      points++;  
     
    }
    if(points == (NROWS*NCOLS)){
    endGame();
  }

    if (ballY >= height-ballSize) {endGame();}  // if ball touches bottom
    else if (ballY <= 0) {moveY = +speed;}
    
    if (moveY > 0 && ballY >= paddleY-ballSize && ballY <= paddleY+paddleHeight) {
      if (ballX >= paddleX-ballSize && ballX <= paddleX+paddleWidth) {
        //You can write ball bounce from paddle here.
        bouncingSound.play();
        // if ball toches the paddle , change color of both ball and paddle 
        var random_color = ball_colors[parseInt(Math.random()*ball_colors.length)];
        document.getElementById("ball").style.background = random_color;

        var random_color_p = paddle_colors[parseInt(Math.random()*paddle_colors.length)];
        document.getElementById("paddle").style.borderColor = random_color_p;

        moveY = -speed;  // bounce from paddle to top 
      }
    }
    ballX = ballX+(moveX);
    ballY = ballY+(moveY);
   
    document.getElementById("ball").style.left=ballX+"px";
    document.getElementById("ball").style.top=ballY+"px";

  }

  var bricks;
  var NROWS = 5 ;
  var NCOLS = 8;
  var BRICKWIDTH = (width/NCOLS);
  var BRICKHEIGHT = 25;

  
  var rowcolors = ["#C10066", "#CC0000", "#E63F00", "#EE7700", "#DDAA00"];

  function initbricks() {
      bricks = new Array(NROWS);
      for (i=0; i < NROWS; i++) {
          bricks[i] = new Array(NCOLS);
          for (j=0; j < NCOLS; j++) {
              bricks[i][j] = 1;
          }
      }
  }

  function drawbricks() {
    for (i=0; i < NROWS; i++) {
      context.fillStyle = rowcolors[i];
      for (j=0; j < NCOLS; j++) {
        if (bricks[i][j] == 1) {
          rect((j * (BRICKWIDTH)), 
               (i * (BRICKHEIGHT)),
               BRICKWIDTH, BRICKHEIGHT);
           // Also draw blackish border around the brick
          context.strokeRect(j*BRICKWIDTH+1,i*BRICKHEIGHT+1,BRICKWIDTH-2,BRICKHEIGHT-2);
        }
      }
    }
  }

  function rect(x,y,w,h) {
    context.beginPath();
    context.rect(x,y,w,h);
    context.closePath();
    context.fill();
  }

  

  function displayScoreBoard(){

    //Set the text font and color
    context.fillStyle = 'black';
    context.font = "20px Courier New";
  
    //Clear the bottom 30 pixels of the canvas
    context.clearRect(0,height-30,width,30);  
    // Write Text 5 pixels from the bottom of the canvas
    context.fillText('Points: '+points,width-200,height-50);
    // Write timer
    context.fillText('Time: '+minutes+ ':' +seconds,width-200,height-100);
  }
  
  var minutes = '00';
  var seconds = '00';
  var sec = 0;

  // count-up timer
  function pad ( val ) { return val > 9 ? val : "0" + val; }
    setInterval( function(){
    seconds = pad(++sec%60);
    minutes = pad(parseInt(sec/60,10));
  } , 1000);
  
  var gameloop;
  var paddleMove;

  function animate(){
    context.clearRect(0,0,canvas.width,canvas.height);
    displayScoreBoard();
    movePaddle();
    moveBall();

    drawbricks();
    

  }

  function startGame(){


     document.getElementById("mask").style.opacity = "1";
     document.getElementById("rank").style.display = "none";

    // call the animate() function every 100ms until clearInterval(gameloop) is called
    gameloop = setInterval(animate,10);

    initbricks();

    // set initial position of ball
    ballX = 250;
    ballY = 250;
    
    paddleMove = 'NONE';

    // dectect keyboard
    $(document).keydown(function(evt) {
      if (evt.keyCode == 39) {  // right 
        paddleMove = 'RIGHT';
      } 
      else if (evt.keyCode == 37){  // left
        paddleMove = 'LEFT';
      }
    });
    $(document).keyup(function(evt) {
      if (evt.keyCode == 39) {
        paddleMove = 'NONE';
      } 
      else if (evt.keyCode == 37){
        paddleMove = 'NONE';
      }
    }); 
  }
 
  function endGame(){
    player_name = prompt("You get "+points+"point(s). Please input your name. (Can't not be empty)");

    while(player_name == " "){

      player_name = prompt("You get "+points+"point(s). Please input your name. (Can't not be empty)");
    }
    // if Players item is empty
    if(localStorage.getItem("Players") == null){
    // if player_name not null , then push data to array
      if(player_name != null){
        players.push(player_name);
        scores.push(points);
        // set array to the localStorage, use JSON 
        localStorage.setItem("Players",JSON.stringify(players));
        localStorage.setItem("Scores",JSON.stringify(scores));  
      }
    }
    else {
      // if Players item not emtpy, then get array iten from localStorage 
      Players = JSON.parse(localStorage.getItem("Players"));
      Scores = JSON.parse(localStorage.getItem("Scores"));

      if(player_name != null){
        // push new data in next position
        Players[Players.length] = player_name;
        Scores[Scores.length] = points;
        // set array item back 
        localStorage.setItem("Players",JSON.stringify(Players));
        localStorage.setItem("Scores",JSON.stringify(Scores));
      } 
    }
    // set mask opacity to make fadeout effect of background
    document.getElementById("mask").style.opacity = "0.3";

    // set restart and rank button visible
    document.getElementById("restart").style.display = "block";
    document.getElementById("rank").style.display = "block";

    clearInterval(gameloop);   
  }
   
  startGame();
}


/*-- localStorage function triggered by rank button --*/
function Rank(){

 
  Players = JSON.parse(localStorage.getItem("Players"));
  Scores = JSON.parse(localStorage.getItem("Scores"));

  // sorting ranking , higher scores on top, lower on bottom
  for(i=0; i<Players.length-1; i++){
    for(j=0; j<Players.length-i-1; j++){
      if(Scores[j] < Scores[j+1]){
        var a = Scores[j];
        Scores[j] = Scores[j+1];
        Scores[j+1] = a;

        var b = Players[j];
        Players[j] = Players[j+1];
        Players[j+1] = b;
      }
    }
  }

  // write html to spacific div, create rank data on it
  // retrieve the data from localStorage's array item
  var r = 1;
  for(i=0; i<10; i++){
      var n = Players[i];
      var s = Scores[i];
      if(n == null){
        n = "-----";
        s = "--";
      }
      if(n == " "){
        n = "*NULL*";
      }
      var board = document.getElementById("rankBoard");

      board.innerHTML = board.innerHTML + "<p><span class='ranking'>Rank "+ r +"</span><span class='name'>"+ n +"</span><span class='score'>"+ s +"</span></p>";
      
      r++;
  }
}
