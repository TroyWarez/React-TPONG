import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { Alert } from 'bootstrap';
const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");
let FPSTarget = 60;
let gameLoop;
const Debug = 1;


const Red = '#7F0000';
const Green = '#007F00';
const Blue = '#00007F';
const Purple = '#814ED2';
const Black = '#00000';

const DimGray = '#767676';
const White = '#FFFFFF';


let BackgroundColor = '#00000';
let SpriteColor = '#767676';

let Ball = { 'x' : 0, "y" : 0 }
let PlayerPaddle = { 'x' : 0, "y" : 0 }
let CPUPaddle = { 'x' : 0, "y" : 0 }

let PlayerScore = 1;
let CPUScore = 1;

let gameFlags = { "StartGame" : 0, "DrawBall" : 0 }

const MovSpeed = 6.00;


const BallRad = 20;

let BallSpeedY = MovSpeed;
let BallSpeedX = MovSpeed;

let BallSpawnDelay = 0;

window.onload = function() {
  gameLoop = setInterval(() => {
    Draw();
  }, 1000 / FPSTarget)
}
function getMovSpeed()
{
  return Math.floor(Math.random() * MovSpeed) ;
}
function App() {
  if (Debug)
  {
    gameFlags.StartGame = true;
    gameFlags.DrawBall = true;
    BackgroundColor = Green;
    SpriteColor = White;
    PlayerScore = 0;
    CPUScore = 0;
    Ball.x = (window.screen.width / 2);
    Ball.y = Math.floor(Math.random() * (window.screen.height - 50));
  }
}
function Draw()
{
  ctx.canvas.width  = window.screen.width;
  ctx.canvas.height = window.screen.height;
  if (Debug)
  {
  console.log("Width:" + ctx.canvas.width);
  console.log("Height:" + ctx.canvas.height);
  }
  //Game Logic
  if( BallSpawnDelay < Date.now()  && BallSpawnDelay !== 0){
    Ball.x = (window.screen.width / 2);
    Ball.y = Math.floor(Math.random() * window.screen.height);
    gameFlags.DrawBall = true;
    BallSpawnDelay = 0;
  }
  if (gameFlags.DrawBall === true){
    if ((Ball.x + 80) < 0)//CPU Scored
    {
      CPUScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
    }
    else if ((Ball.x - 80) > (window.screen.width))//Player Scored
    {
      PlayerScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
    }
}


  Ball.y += (BallSpeedY + 0.1);
  Ball.x += (BallSpeedX + 0.1);

  // Background
  ctx.fillStyle = BackgroundColor;
  ctx.fillRect(0, 0, window.screen.width, window.screen.height);
  ctx.stroke();

  ctx.font = `40px Verdana`;
  //Player Score
  ctx.fillStyle = SpriteColor;
  ctx.fillText(PlayerScore.toString(), ((window.screen.width - 500) / 2), 100);

  //CPU Score
  ctx.fillStyle = SpriteColor;
  ctx.fillText(CPUScore.toString(), ((window.screen.width + 500) / 2), 100);

  //Net
  ctx.fillStyle = SpriteColor;
  for (let y = 0; y < window.screen.height; y += 80)
  {
    ctx.fillRect((window.screen.width / 2), y, 20, 40);
  }
  //Paddles
  if(gameFlags.StartGame === true)
  {
    ctx.roundRect(100, PlayerPaddle.y, 10, 100, 20);
    ctx.fill();
    ctx.stroke();

    if (CPUPaddle.y >= 0 && CPUPaddle.y <= window.screen.height && Ball.x >= (window.screen.width / 2) && gameFlags.DrawBall === true)
    {
      CPUPaddle.y = (Ball.y - 20.0);
    }
    else if (CPUPaddle.y < 0 || CPUPaddle.y > window.screen.height)// Paddle out of bounds
    {
      CPUPaddle.y = (window.screen.height / 2);
    }
    ctx.roundRect(window.screen.width - 100, CPUPaddle.y, 10, 100, 20);
    ctx.fill();
    ctx.stroke();

    if(gameFlags.DrawBall === true){
    ctx.beginPath();
    ctx.arc(Ball.x, Ball.y, BallRad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    }
  }
}
document.addEventListener('keydown', function(event) {

  if(Debug === 1)
  {
    console.log(event.key);
  }
  switch(event.key) {
    case '1': //Red
        BackgroundColor = Red;
        SpriteColor = White;
        break;
    case '2': //Green
        BackgroundColor = Green;
        SpriteColor = White;
        break;
    case '3': // Blue
        BackgroundColor = Blue;
        SpriteColor = White;
        break;  
    case '4': // Purple
        BackgroundColor = Purple;
        SpriteColor = White;
        break;
    case '5': // Black
        BackgroundColor = Black;
        SpriteColor = DimGray;
        break;
    case 'Enter':
      gameFlags.StartGame = true;
      PlayerScore = 0;
      CPUScore = 0;
      break;
    default:
      return
  }
}, true);
function MouseHandler(event) {
  let movementY = event.movementY ||
  event.mozMovementY      ||
  event.webkitMovementY   ||
      0;

  let animation = requestAnimationFrame(MouseHandler);

  if(gameFlags.StartGame === true)
  {
    if ((PlayerPaddle.y + movementY) >= 0 && (PlayerPaddle.y + movementY) <= (window.screen.height - 100))
    {
      PlayerPaddle.y += movementY;
    }
    else if (PlayerPaddle.y < 0 || PlayerPaddle.y > window.screen.height)// Paddle out of bounds
    {
      PlayerPaddle.y = (window.screen.height / 2);
    }
  }
}

canvas.onclick = function() {
  canvas.requestPointerLock();
}
document.addEventListener('pointerlockchange', function(event) {
  if(document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", MouseHandler, false);
  }
  else{
    document.removeEventListener("mousemove", MouseHandler, false);
  }
}, true);
export default App;