import logo from './ball.svg';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css"

let PlayerScore, CompScore;
let Canvas;
function App() {
  Canvas = document.getElementById('gameBoard');
  const { Width, Height } = Canvas.getBoundingClientRect();
  InitGame(Height, Width);
}

function InitGame(Height, Width)
{
  PlayerScore = 1;
  CompScore = 1;
}

export default App;
