import React, { useState } from "react";

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
        {showIframe && <div><iframe src="./typingGame/index.html" width="1000" height="1200"></iframe></div>}

    </div>
  );
}

export default PlayGame2;