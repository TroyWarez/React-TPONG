import logo from './ball.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

let PlayerScore, CompScore, GameBoard;
const Canvas = document.getElementById('gameBoard');
const Context2d = Canvas.getContext("2d");
const Height = Canvas.getBoundingClientRect().height;
const Width = Canvas.getBoundingClientRect().width;

function App() {
  return InitGame(Height, Width);
}

function InitGame(Height, Width)
{
  PlayerScore = 1;
  CompScore = 1;
  GameBoard = new Image();
  GameBoard.src = "Board.png";
}

export default App;
