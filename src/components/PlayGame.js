import React, { useState } from "react";

function PlayGame() {
  const [showIframe, setShowIframe] = useState(false);


  const handlePlayGame = () => {
    setShowIframe(!showIframe); 
  };
  return (

    <div>
       <div>
            <h1>게임 플레이</h1>
       </div>
       <button type="button" onClick={handlePlayGame}>Play Game</button>
        {showIframe && <div><iframe src="./WebGLTest/index.html" width="520" height="1090"></iframe></div>}

    </div>
  );
}

export default PlayGame;
