import  { ReactComponent as DarkModeIcon } from './dark_mode.svg';
import  { ReactComponent as LightModeIcon } from './light_mode.svg';
import './App.css';
import React, { useState } from "react";
let isDark = false;
function App() {
    const [style, setStyle] = useState("button"); 

    function clickHandler(){
        if (!isDark) {
            document.body.classList.add('dark');
            isDark = true;
          } else {
            document.body.classList.remove('dark');
            isDark = false;
          }
        }
  return (    <>
      <div className="App"><button className='buttonDarkModeToggle' onClick= {clickHandler}> <LightModeIcon fill='white'></LightModeIcon></button></div>
  
  </>);
}

export default App;
