import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"
import paddleHitSound from './sounds/paddleHit.m4a'
import paddleServeSound from './sounds/paddleServe.m4a'
import tableHitSound from './sounds/tableHit.m4a'
import ScoreBeepSound from './sounds/score.m4a'
let canvas = document.getElementById("gameBoard");
let CursorLock = undefined;
let ControllerSlots = new Array();

let ScalingFactorX = 1;
let ScalingFactorY = 1;
const canvasMarginLeft = "auto";
const canvasMarginRight = "auto";
const canvasStyleDisplay = "block";
const canvasStyleWidth = "800px";

const ctx = canvas.getContext("2d");
let previousTimeStamp = null;

let LeaderBoardTime = null;
const PaddleHeight = 100;
const PaddleWidth = 10;
const PaddleRad = 20;
const DefaultWidth = 800;
const DefaultHeight = 600;


const Red = '#7F0000';
const Green = '#007F00';
const Blue = '#00007F';
const Purple = '#814ED2';
const Black = '#00000';

const DimGray = '#767676';
const White = '#FFFFFF';

const ColorPalettes = [{PaletteName : 'RedPalette', BackgroundColor : Red,  SpriteColor : White}, { PaletteName : 'GreenPalette', BackgroundColor : Green,  SpriteColor : White}, { PaletteName : 'BluePalette', BackgroundColor : Blue,  SpriteColor : White }, { PaletteName : 'PurplePalette', BackgroundColor : Purple,  SpriteColor : White}, { PaletteName : 'BlackPalette', BackgroundColor : Black,  SpriteColor : DimGray }];
let selectedPalette = ColorPalettes.find(x => x.PaletteName === 'BlackPalette');

const BallRad = 10;
let BallMovSpeed = 0.45;
let CPUMovSpeed = 0.45;

let PlayerMovSpeedFull = 0.35;
let PlayerMovSpeedHalf = 0.175;
let PlayerMovSpeedQuater = 0.0875;
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

let Ball = { 'x' : 0, 'y' : 0, 'radius' : BallRad, 'velocityY' : BallMovSpeed, 'velocityX' : BallMovSpeed, 'divisor' : 2};
let PlayerPaddle = { 'x' : PaddleHeight, 'y' : ((DefaultHeight / 2) - PaddleHeight) };
let CPUPaddle = { 'x' : 0, 'y' : 0 };

let PlayerScore = 1;
let CPUScore = 1;

let gameFlags = { "StartGame" : false, "IdleMode": true, "DrawBall" : false, "Debug" : true, "AudioPlayable" : false, } //booleans

//Debug element array
let gameElements = [PlayerPaddle, CPUPaddle, Ball];
let SelectedElement = {"gameElement" : null, "Index" : 0 };
let BallSpawnDelay = 0;

let lastKey = "";
let lastController = null;
const GameboardBoundary = 30;

let paddleHit = new Audio(paddleHitSound);
let paddleServe = new Audio(paddleServeSound);
let tableHit = new Audio(tableHitSound);
let ScoreBeep = new Audio(ScoreBeepSound);
function App() {
  if (gameFlags.Debug)
  {
    gameFlags.StartGame = true;
    gameFlags.DrawBall = true;
    selectedPalette = ColorPalettes.find(x => x.PaletteName === 'GreenPalette');
    PlayerScore = 0;
    CPUScore = 0;
    Ball.x = (gameBoardWidth / 2);
    Ball.y = Math.floor(Math.random() * gameBoardHeight);
    SelectedElement = gameElements[0]; //Defaults to first element.
    LeaderBoardTime = Date.now();
  }
}
window.requestAnimationFrame(Draw);

function Draw(timeStamp)
{
  const deltaTime = timeStamp - previousTimeStamp;
  ctx.canvas.width  = gameBoardWidth;
  ctx.canvas.height = gameBoardHeight;
  CPUPaddle.x = (gameBoardWidth - PaddleHeight);
  ScalingFactorX = (gameBoardWidth / DefaultWidth);
  ScalingFactorY = (gameBoardWidth / DefaultWidth);
  BallMovSpeed = (0.45 * ScalingFactorX);
  CPUMovSpeed = (0.45 * ScalingFactorY);
  
  PlayerMovSpeedFull = (0.45 * ScalingFactorY);
  PlayerMovSpeedHalf = (0.45 * ScalingFactorY);
  PlayerMovSpeedQuater = (0.45 * ScalingFactorY);

  let Gamepads = navigator.getGamepads 
    ? navigator.getGamepads() 
    : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : [0])
    
  let firstController = ControllerSlots.find(x => typeof x !== 'undefined');
  //
  if( firstController !== null && typeof firstController !== 'undefined' && 'buttons' in firstController && 'connected' in firstController && firstController.connected === true)
  {
    firstController = Gamepads[firstController.index];
    if (firstController.buttons[4].value === 1 && lastController !== null && lastController.buttons[4].value !== 1) {
      let PattleIndex = ColorPalettes.findIndex(x => x.PaletteName === selectedPalette.PaletteName);
      if(PattleIndex !== -1 && (PattleIndex - 1) >= 0)
      {
        selectedPalette = ColorPalettes[(PattleIndex - 1)];
      }
    }
    else if (firstController.buttons[5].value === 1 && lastController !== null && lastController.buttons[5].value !== 1) {
      let PattleIndex = ColorPalettes.findIndex(x => x.PaletteName === selectedPalette.PaletteName);
      if(PattleIndex !== -1 && (PattleIndex + 1) < ColorPalettes.length)
      {
        selectedPalette = ColorPalettes[(PattleIndex + 1)];
      }
    }
    else if (firstController.buttons[8].value === 1 && lastController !== null && lastController.buttons[8].value !== 1) {
      if(gameFlags.StartGame === true)
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
    }
    else if (firstController.buttons[9].value === 1 && lastController !== null && lastController.buttons[9].value !== 1) {
      if(gameFlags.StartGame === true)
      {
        gameFlags.StartGame = false;
        gameFlags.DrawBall = false;
        PlayerScore = 0;
        CPUScore = 0;
        Ball.x = 0;
        Ball.y = 0;
        PlayerPaddle = { 'x' : PaddleHeight, 'y' : ((gameBoardHeight / 2) - PaddleHeight) };
        CPUPaddle = { 'x' : 0, 'y' : 0 };
      }
      else
      {
        gameFlags.StartGame = true;
        gameFlags.DrawBall = true;
        PlayerScore = 0;
        CPUScore = 0;
        Ball.x = (gameBoardWidth / 2);
        Ball.y = Math.floor(Math.random() * gameBoardHeight);
      }
    }
    if (firstController.buttons[12].value === 1) {// Up
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y - (CPUMovSpeed * deltaTime)) >= GameboardBoundary)
        {
          PlayerPaddle.y -= (CPUMovSpeed * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if (firstController.buttons[13].value === 1) {// Down
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y + (CPUMovSpeed * deltaTime)) <= ((gameBoardHeight - GameboardBoundary) - PaddleHeight))
        {
          PlayerPaddle.y += (CPUMovSpeed * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }

    if(firstController.axes[1] <= -0.75)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y - (PlayerMovSpeedFull * deltaTime)) >= GameboardBoundary)
        {
          PlayerPaddle.y -= (PlayerMovSpeedFull * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if(firstController.axes[1] <= -0.5)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y - (PlayerMovSpeedHalf * deltaTime)) >= GameboardBoundary)
        {
          PlayerPaddle.y -= (PlayerMovSpeedHalf * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if(firstController.axes[1] <= -0.35)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y - (PlayerMovSpeedQuater * deltaTime)) >= GameboardBoundary)
        {
          PlayerPaddle.y -= (PlayerMovSpeedQuater * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if(firstController.axes[1] >= 0.75)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y + (PlayerMovSpeedFull * deltaTime)) <= ((gameBoardHeight - GameboardBoundary) - PaddleHeight))
        {
          PlayerPaddle.y += (PlayerMovSpeedFull * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if(firstController.axes[1] >= 0.5)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y + (PlayerMovSpeedHalf * deltaTime)) <= ((gameBoardHeight - GameboardBoundary) - PaddleHeight))
        {
          PlayerPaddle.y += (PlayerMovSpeedHalf * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    else if(firstController.axes[1] >= 0.35)//Left analog
    {
      if(gameFlags.StartGame === true)
      {
        if ((PlayerPaddle.y + (PlayerMovSpeedQuater * deltaTime)) <= ((gameBoardHeight - GameboardBoundary) - PaddleHeight))
        {
          PlayerPaddle.y += (PlayerMovSpeedQuater * deltaTime);
        }
        else if (PlayerPaddle.y < 0 || PlayerPaddle.y > gameBoardHeight)// Paddle out of bounds
        {
          PlayerPaddle.y = (gameBoardHeight / 2);
        }
      }
    }
    lastController = firstController;
  }

  BackgroundColor = selectedPalette.BackgroundColor;
  SpriteColor = selectedPalette.SpriteColor;

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
      if( firstController !== null && typeof firstController !== 'undefined' && 'vibrationActuator' in firstController && 'connected' in firstController && firstController.connected === true)
      {
        firstController = Gamepads[firstController.index];
        firstController.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 1000,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });
      }
      Ball.divisor = 1;
      CPUScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
      if(gameFlags.AudioPlayable === true)
      {
        ScoreBeep.play();
      }
    }
    else if ((Ball.x - Ball.radius) > (gameBoardWidth))//Player Scored
    {
      if( firstController !== null && typeof firstController !== 'undefined' && 'vibrationActuator' in firstController && 'connected' in firstController && firstController.connected === true)
      {
        firstController = Gamepads[firstController.index];
        firstController.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 1000,
          weakMagnitude: 1.0,
          strongMagnitude: 1.0,
        });
      }
      Ball.divisor = 1;
      PlayerScore++;
      BallSpawnDelay = Date.now() + 4000;
      gameFlags.DrawBall = false;
      if(gameFlags.AudioPlayable === true)
      {
        ScoreBeep.play();
      }
    }
    else if ((Ball.y + Ball.radius) >= (gameBoardHeight))
    {
      if(gameFlags.AudioPlayable === true){
      tableHit.play();
      }
      Ball.velocityY = Ball.velocityY * -1;
      Ball.velocityX = Ball.velocityX * 1;
      Ball.y = Ball.y - 1;
    }
    else if ((Ball.y - Ball.radius) <= 0)
    {
      if(gameFlags.AudioPlayable === true){
      tableHit.play();
      }
      Ball.velocityY = Ball.velocityY * -1;
      Ball.velocityX = Ball.velocityX * 1;
      Ball.y = Ball.y + 1;
    }
    else if ((Ball.x + Ball.radius) >= CPUPaddle.x  && (Ball.x + Ball.radius) <= (CPUPaddle.x + PaddleWidth ) &&  Ball.y >= CPUPaddle.y &&  (Ball.y + Ball.radius)  <= (CPUPaddle.y + PaddleHeight))
    {
      console.log("CPU Paddle Hit");
      if(gameFlags.AudioPlayable === true){
        if((Math.floor(Math.random() * 2) === 0))
        {
          paddleServe.play();
        }
        else
        {
          paddleHit.play();
        }
      }
      Ball.divisor = Math.floor(Math.random() * 12);
      Ball.x = Ball.x - 1;
      Ball.velocityY = Ball.velocityY * 1;
      Ball.velocityX = Ball.velocityX * -1;
    }
    else if ((Ball.x - Ball.radius)  >= PlayerPaddle.x  && (Ball.x - Ball.radius)  <= (PlayerPaddle.x + PaddleWidth ) &&  Ball.y >= PlayerPaddle.y &&  (Ball.y - Ball.radius)   <= (PlayerPaddle.y + PaddleHeight))
    {
      console.log("Player Paddle Hit");
      if(gameFlags.AudioPlayable === true){
        if((Math.floor(Math.random() * 2) === 0))
        {
          paddleServe.play();
        }
        else
        {
          paddleHit.play();
        }
      }
      if( firstController !== null && typeof firstController !== 'undefined' && 'vibrationActuator' in firstController && 'connected' in firstController && firstController.connected === true)
      {
        firstController = Gamepads[firstController.index];
        firstController.vibrationActuator.playEffect("dual-rumble", {
          startDelay: 0,
          duration: 50,
          weakMagnitude: 0.75,
          strongMagnitude: 0.75,
        });
      }
      Ball.divisor = Math.floor(Math.random() * 12);
      Ball.x = Ball.x + 1;
      Ball.velocityY = Ball.velocityY * 1;
      Ball.velocityX = Ball.velocityX * -1;
    }

    //y up and down x left to right
  Ball.x += Ball.velocityX * deltaTime;
  Ball.y += (Ball.velocityY / 2) * deltaTime;
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
      if ((CPUPaddle.y + (CPUMovSpeed * deltaTime)) <= (Ball.y - (PaddleHeight / 2)) && ((CPUPaddle.y + PaddleHeight) + CPUMovSpeed) <= (gameBoardHeight - GameboardBoundary) )
      {
        CPUPaddle.y += CPUMovSpeed * deltaTime;
      }
      else if ((CPUPaddle.y - (CPUMovSpeed * deltaTime)) >= GameboardBoundary)
      {
        CPUPaddle.y -= CPUMovSpeed * deltaTime;
      }
      else if ((CPUPaddle.y + (CPUMovSpeed * deltaTime)) >= gameBoardHeight)
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

document.addEventListener('keyup', (event)  => {
  if(event.key === lastKey)
  {
    lastKey = "";
  }
}, true);
document.addEventListener('keydown', (event) => {
  if(gameFlags.Debug === 1)
  {
    console.log(event.key);
  }
  if(event.repeat === false)
  {
  switch(event.key) {
    case '1': //Red
    {
        selectedPalette = ColorPalettes.find(x => x.PaletteName === 'RedPalette');
        break;
    }
    case '2': //Green
    {
        selectedPalette = ColorPalettes.find(x => x.PaletteName === 'GreenPalette');
        break;
    }
    case '3': // Blue
    {
        selectedPalette = ColorPalettes.find(x => x.PaletteName === 'BluePalette');
        break;
    } 
    case '4': // Purple
    {
        selectedPalette = ColorPalettes.find(x => x.PaletteName === 'PurplePalette');
        break;
    }
    case '5': // Black
    {
        selectedPalette = ColorPalettes.find(x => x.PaletteName === 'BlackPalette');
        break;
    }
    case 'Enter':
    {
      gameFlags.StartGame = true;
      gameFlags.DrawBall = true;
      selectedPalette = ColorPalettes.find(x => x.PaletteName === 'GreenPalette');
      PlayerScore = 0;
      CPUScore = 0;
      Ball.x = (gameBoardWidth / 2);
      Ball.y = Math.floor(Math.random() * gameBoardHeight);
      LeaderBoardTime = Date.now();
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
  switch(event.type)
  {
    case 'gamepadconnected':
      {
      console.log("Gamepad connected");
      if(event.gamepad.mapping !== '')
      {
        ControllerSlots[event.gamepad.index] = event.gamepad;
      }
      break;
      }
      case 'gamepaddisconnected':
      {
      delete ControllerSlots[event.gamepad.index];
      console.log("Gamepad disconnected");
      break;
      }
  }
}
function MouseHandler(event) {
  let movementY = event.movementY ||
  event.mozMovementY      ||
  event.webkitMovementY   ||
      0;

  if(gameFlags.StartGame === true)
  {
    if (((PlayerPaddle.y - GameboardBoundary) + movementY) >= 0 && (PlayerPaddle.y + movementY) <= ((gameBoardHeight - GameboardBoundary) - PaddleHeight))
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

function FullScreenHandler() {
  if (document.fullScreen || 
      document.mozFullScreen || 
      document.webkitIsFullScreen) {
      if(gameFlags.Debug){
        console.log("Entered Full Screen");
      }
    PlayerPaddle = { 'x' : PaddleHeight, 'y' : ((gameBoardHeight / 2) - PaddleHeight) };
    CPUPaddle = { 'x' : 0, 'y' : 0 };
    gameBoardWidth = window.screen.width;
    gameBoardHeight = window.screen.height;
    Ball = { 'x' : 0, 'y' : 0, 'radius' : BallRad, 'velocityY' : BallMovSpeed, 'velocityX' : BallMovSpeed, 'divisor' : 2};
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
    PlayerPaddle = { 'x' : PaddleHeight, 'y' : ((gameBoardHeight / 2) - PaddleHeight) };
    CPUPaddle = { 'x' : 0, 'y' : 0 };
    Ball = { 'x' : ((gameBoardWidth / 2) - PaddleHeight), 'y' : ((gameBoardHeight / 2) - PaddleHeight), 'radius' : BallRad, 'velocityY' : BallMovSpeed, 'velocityX' : BallMovSpeed, 'divisor' : 2};
    canvas.style.paddingLeft = 0;
    canvas.style.paddingRight = 0;
    canvas.style.marginLeft = canvasMarginLeft;
    canvas.style.marginRight = canvasMarginRight;
    canvas.style.display = canvasStyleDisplay;
    canvas.style.width = canvasStyleWidth;
  }
}
document.addEventListener("click", () => {
  gameFlags.AudioPlayable = true;
  /* the audio is now playable; play it if permissions allow */
  if(gameFlags.Debug){
  console.log("The audio is now playable. ");
}
});
document.addEventListener("fullscreenchange", FullScreenHandler);
document.addEventListener('pointerlockchange', () => {
  if(document.pointerLockElement === canvas) {
    document.addEventListener("mousemove", MouseHandler, false);
  }
  else if (CursorLock){
    document.removeEventListener("mousemove", MouseHandler, false);
    CursorLock = undefined;
  }
}, true);
export default App;