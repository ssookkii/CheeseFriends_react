import React, { useState } from "react";

function PlayGame() {
  const [showIframe, setShowIframe] = useState(false);


  const handlePlayGame = () => {
    setShowIframe(!showIframe); 
  };
  return (

    <div>
      <div>
        <h1>Prop 2 Sky</h1>
      </div>
      <button type="button" onClick={handlePlayGame}>Play Game</button>
      {showIframe && <div><iframe src="../WebGLTest/index.html" width="520" height="1090"></iframe></div>}<br/><br/>

      <h3>게임 시작 화면</h3>
      <img src="/img/GameStartImg.png" alt="게임 설명 이미지" width="200" height="auto" />
      <p>'Start' 버튼을 누르면 게임이 시작되며 병아리가 위로 날아갑니다.</p>
    </div>
  );
}

export default PlayGame;
