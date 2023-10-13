import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
let canvas = document.getElementById("gameBoard");
let CursorLock = undefined;
const canvasMarginLeft = "auto";
const canvasMarginRight = "auto";
const canvasStyleDisplay = "block";
const canvasStyleWidth = "800px";

const ctx = canvas.getContext("2d");
let previousTimeStamp = null;

const PaddleHeight = 100;
const PaddleWidth = 10;
const PaddleRad = 20;
let lastKey = "";
const DefaultWidth = 800;
const DefaultHeight = 600;
const Red = '#7F0000';
const Green = '#007F00';
const Blue = '#00007F';
const Purple = '#814ED2';
const Black = '#00000';

const DimGray = '#767676';
const White = '#FFFFFF';

const BallRad = 10;
const BallMovSpeed = 0.35;
const CPUMovSpeed = 0.35;

let BackgroundColor = '#00000';
let SpriteColor = '#767676';
let gameBoardWidth = DefaultWidth;
let gameBoardHeight = DefaultHeight;

canvas.style.paddingLeft = 0;
canvas.style.paddingRight = 0;
canvas.style.marginLeft = canvasMarginLeft;
canvas.style.marginRight = canvasMarginRight;
canvas.style.display = canvasStyleDisplay;
canvas.style.width = canvasStyleWidth;

let Ball = { 'x' : 0, 'y' : 0, 'radius' : BallRad, 'velocityY' : BallMovSpeed, 'velocityX' : BallMovSpeed }
let PlayerPaddle = { 'x' : PaddleHeight, 'y' : ((DefaultHeight / 2) - PaddleHeight) }
let CPUPaddle = { 'x' : 0, 'y' : 0 }

let PlayerScore = 1;
let CPUScore = 1;

let gameFlags = { "StartGame" : false, "DrawBall" : false, "Debug" : true } //booleans

//Debug element array
let gameElements = [PlayerPaddle, CPUPaddle, Ball];
let SelectedElement = {"gameElement" : null, "Index" : 0 };
let BallSpawnDelay = 0;
function App() {
  if (gameFlags.Debug)
  {
    gameFlags.StartGame = true;
    gameFlags.DrawBall = true;
    BackgroundColor = Green;
    SpriteColor = White;
    PlayerScore = 0;
    CPUScore = 0;
    Ball.x = (gameBoardWidth / 2);
    Ball.y = Math.floor(Math.random() * gameBoardHeight);
    SelectedElement = gameElements[0]; //Defaults to first element.
  }
}
window.requestAnimationFrame(Draw);

function Draw(timeStamp)
{

  const deltaTime = timeStamp - previousTimeStamp;
  ctx.canvas.width  = gameBoardWidth;
  ctx.canvas.height = gameBoardHeight;
  CPUPaddle.x = (gameBoardWidth - PaddleHeight);

  if (gameFlags.Debug)
  {
  //console.log("Width:" + ctx.canvas.width);
  //console.log("Height:" + ctx.canvas.height);
  }
  //Game Logic
  if( BallSpawnDelay < Date.now()  && BallSpawnDelay !== 0){
    Ball.x = (gameBoardWidth / 2);
    Ball.y = Math.floor(Math.random() * gameBoardHeight);
    gameFlags.DrawBall = true;
    BallSpawnDelay = 0;
  }
  if (gameFlags.DrawBall === true){
    if ((Ball.x + Ball.radius) < 0)//CPU Scored
    {
      CPUScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
    }
    else if ((Ball.x - Ball.radius) > (gameBoardWidth))//Player Scored
    {
      PlayerScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
    }
    else if ((Ball.y + Ball.radius) >= (gameBoardHeight))
    {
      Ball.velocityY = Ball.velocityY * -1;
      Ball.velocityX = Ball.velocityX * 1;
    }
    else if ((Ball.y - Ball.radius) <= 0)
    {
      Ball.velocityY = Ball.velocityY * -1;
      Ball.velocityX = Ball.velocityX * 1;
    }
    else if ((Ball.x + Ball.radius) >= CPUPaddle.x  && (Ball.x + Ball.radius) <= (CPUPaddle.x + PaddleWidth ) &&  Ball.y >= CPUPaddle.y &&  Ball.y <= (CPUPaddle.y + PaddleHeight))
    {
      console.log("CPU Paddle Hit");
      Ball.x = Ball.x - 1;
      Ball.velocityY = Ball.velocityY * 1;
      Ball.velocityX = Ball.velocityX * -1;
    }
    else if ((Ball.x - Ball.radius)  >= PlayerPaddle.x  && (Ball.x - Ball.radius)  <= (PlayerPaddle.x + PaddleWidth ) &&  Ball.y >= PlayerPaddle.y &&  Ball.y  <= (PlayerPaddle.y + PaddleHeight))
    {
      console.log("Player Paddle Hit");
      Ball.x = Ball.x + 1;
      Ball.velocityY = Ball.velocityY * 1;
      Ball.velocityX = Ball.velocityX * -1;
    }

    //y up and down x left to right
  Ball.x += Ball.velocityX * deltaTime;
  Ball.y += (Ball.velocityY / 8) * deltaTime;
  //Ball.x = 100;
  //Ball.y = 354;
}

  // Background
  ctx.fillStyle = BackgroundColor;
  ctx.fillRect(0, 0, gameBoardWidth, gameBoardHeight);
  ctx.stroke();

  ctx.font = `40px Verdana`;
  //Player Score
  ctx.fillStyle = SpriteColor;
  ctx.fillText(PlayerScore.toString(), ((gameBoardWidth - 500) / 2), 100);

  //CPU Score
  ctx.fillStyle = SpriteColor;
  ctx.fillText(CPUScore.toString(), ((gameBoardWidth + 500) / 2), 100);

  //Net
  ctx.fillStyle = SpriteColor;
  for (let y = 0; y < gameBoardHeight; y += 80)
  {
    ctx.fillRect((gameBoardWidth / 2), y, 20, 40);
  }
  //Paddles
  if(gameFlags.StartGame === true)
  {
    ctx.roundRect(PlayerPaddle.x, PlayerPaddle.y, PaddleWidth, PaddleHeight, PaddleRad);
    ctx.fill();
    ctx.stroke();

    if (gameFlags.DrawBall === true)
    {
      if (CPUPaddle.y <= (Ball.y - (PaddleHeight / 2)) && ((CPUPaddle.y + PaddleHeight) + CPUMovSpeed) <= gameBoardHeight )
      {
        CPUPaddle.y += CPUMovSpeed * deltaTime;
      }
      else if (CPUPaddle.y > 0)
      {
        CPUPaddle.y -= CPUMovSpeed * deltaTime;
      }
      else if (CPUPaddle.y >= gameBoardHeight)
      {
        CPUPaddle.y = (gameBoardHeight - PaddleHeight);
      }
    }
    else if (CPUPaddle.y > gameBoardHeight)
    {
      CPUPaddle.y = (gameBoardHeight - PaddleHeight);
    }
    else if (((CPUPaddle.y + PaddleHeight) + CPUMovSpeed) <= (gameBoardHeight / 2))
    {
      CPUPaddle.y += CPUMovSpeed * deltaTime;
    }
    else if(((CPUPaddle.y - PaddleHeight) - CPUMovSpeed) >= (gameBoardHeight / 2))
    {
      CPUPaddle.y -= CPUMovSpeed * deltaTime;
    }
    ctx.roundRect(CPUPaddle.x, CPUPaddle.y, PaddleWidth, PaddleHeight, PaddleRad);
    ctx.fill();
    ctx.stroke();

    if(gameFlags.DrawBall === true){
    ctx.beginPath();
    ctx.arc(Ball.x, Ball.y, BallRad, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    }
  }
  previousTimeStamp = timeStamp;

  window.requestAnimationFrame(Draw);
}

//window.addEventListener('resize', function(event){
//  gameBoardWidth = window.innerHeight;
//  gameBoardHeight = window.innerWidth;
//});
document.addEventListener('keyup', function(event) {
  if(event.key === lastKey)
  {
    lastKey = "";
  }
}, true);
document.addEventListener('keydown', function(event) {
  if(gameFlags.Debug === 1)
  {
    console.log(event.key);
  }
  if(event.repeat === false)
  {
  switch(event.key) {
    case '1': //Red
    {
        BackgroundColor = Red;
        SpriteColor = White;
        break;
    }
    case '2': //Green
    {
        BackgroundColor = Green;
        SpriteColor = White;
        break;
    }
    case '3': // Blue
    {
        BackgroundColor = Blue;
        SpriteColor = White;
        break;
    } 
    case '4': // Purple
    {
        BackgroundColor = Purple;
        SpriteColor = White;
        break;
    }
    case '5': // Black
    {
        BackgroundColor = Black;
        SpriteColor = DimGray;
        break;
    }
    case 'Enter':
    {
      gameFlags.StartGame = true;
      PlayerScore = 0;
      CPUScore = 0;
      break;
    }
    case '-':
      {
        if(gameFlags.Debug)
        {

        }
        break;
      }
    case '=':
        {
          if(gameFlags.Debug)
          {
            
          }
          break;
        }
    case 'F11':
      {
        event.preventDefault();
        if(lastKey !== event.key)
        {
          if(document.fullScreen || 
            document.mozFullScreen || 
            document.webkitIsFullScreen) {
            window.document.exitFullscreen().catch((err) => {
                console.log(err);
            });
        } else {
            window.document.documentElement.requestFullscreen().catch((err) => {
                console.log(err);
            });
        }
        }
        break;
      }
    default:
      return
  }
}
  lastKey = event.key;
}, true);
function GamepadHandler(event)
{
  console.log("Found something");
}
function MouseHandler(event) {
  let movementY = event.movementY ||
  event.mozMovementY      ||
  event.webkitMovementY   ||
      0;

  if(gameFlags.StartGame === true)
  {
    if ((PlayerPaddle.y + movementY) >= 0 && (PlayerPaddle.y + movementY) <= (gameBoardHeight - PaddleHeight))
    {
      PlayerPaddle.y += movementY;
    }
    else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
    {
      PlayerPaddle.y = (gameBoardHeight / 2);
    }
  }
  window.requestAnimationFrame(MouseHandler);
}

canvas.onclick = function() {
  if(CursorLock === undefined)
  {
    CursorLock = canvas.requestPointerLock();
  }
}
window.addEventListener('gamepadconnected', GamepadHandler, false);
window.addEventListener('gamepaddisconnected', GamepadHandler, false);

document.addEventListener("fullscreenchange", (event) => {
  if (document.fullScreen || 
      document.mozFullScreen || 
      document.webkitIsFullScreen) {
        if(gameFlags.Debug){
          console.log("Entered Full Screen");
          }
    gameBoardWidth = window.screen.width;
    gameBoardHeight = window.screen.height;
    canvas.style.paddingLeft = 0;
    canvas.style.paddingRight = 0;
    canvas.style.marginLeft = "";
    canvas.style.marginRight = "";
    canvas.style.display = "";
    canvas.style.width = "";
  } else {
    if(gameFlags.Debug){
    console.log("Exited Full Screen");
    }
    gameBoardWidth = DefaultWidth;
    gameBoardHeight = DefaultHeight;
    canvas.style.paddingLeft = 0;
    canvas.style.paddingRight = 0;
    canvas.style.marginLeft = canvasMarginLeft;
    canvas.style.marginRight = canvasMarginRight;
    canvas.style.display = canvasStyleDisplay;
    canvas.style.width = canvasStyleWidth;
  }
});
document.addEventListener('pointerlockchange', function(event) {
  if(document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", MouseHandler, false);
  }
  else if (CursorLock){
    document.removeEventListener("mousemove", MouseHandler, false);
    CursorLock = undefined;
  }
}, true);
export default App;