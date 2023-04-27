import React, { useState } from "react";

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
        {showIframe && <div><iframe src="./WebGLTest/index.html" width="520" height="1090"></iframe></div>}

    </div>
  );
}

export default PlayGame1;