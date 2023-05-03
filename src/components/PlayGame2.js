import React, { useState } from "react";

import './asset/css/ShelterPage.css'

function PlayGame2() {
  const [showIframe, setShowIframe] = useState(false);


  const handlePlayGame = () => {
    setShowIframe(!showIframe); 
  };
  return (

    <div>
       <div>
            <h1>Speed Typing</h1>
       </div>
       <button type="button" onClick={handlePlayGame}>Play Game</button>
        {showIframe && <div><iframe src="../typingGame/index.html" width="800" height="800"></iframe></div>}

    </div>
  );
}

export default PlayGame2;