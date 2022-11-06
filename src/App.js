import logo from './ball.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

let PlayerScore, CompScore;
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
  
}

export default App;
