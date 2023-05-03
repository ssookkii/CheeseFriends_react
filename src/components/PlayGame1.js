import React, { useState } from "react";

import './asset/css/ShelterPage.css'

function PlayGame1() {
  const [showIframe, setShowIframe] = useState(false);


  const handlePlayGame = () => {
    setShowIframe(!showIframe); 
  };
  return (

    <div>
       <div>
            <h1>Hang Man</h1>
       </div>
       <button type="button" onClick={handlePlayGame}>Play Game</button>
        {showIframe && <div><iframe src="../hangmanGame/index.html" width="800" height="800"></iframe></div>}

    </div>
  );
}

export default PlayGame1;