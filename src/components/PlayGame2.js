import React, { useState } from "react";

import './asset/css/ShelterPage.css'

function PlayGame2() {
  const [showIframe, setShowIframe] = useState(false);
  const [showGameexp, setShowGameexp] = useState(true);


  const handlePlayGame = () => {
    setShowIframe(!showIframe);
    setShowGameexp(!showGameexp);
  };

  return (

    <div>
       <div>
            <h1>Speed Typing</h1>
       </div>
       <button type="button" onClick={handlePlayGame}>Play Game</button>
        {showIframe && <div><iframe src="../typingGame/index.html" width="800" height="800"></iframe></div>}

      {showGameexp && <div>
        <h1>게임 설명</h1><br/>
        <h2>1. 게임 시작!</h2>
        <p>Speed Typing Game은 말 그대로 제시어를 제한시간 안에 빠르게 입력하는 게임입니다.</p><br/>
        <img src="/img/SpeedTypingImg1.png" alt="게임 설명 이미지" width="500" height="auto" />
        <p>게임이 시작되면 제시어와 함께 좌측에는 제한시간, 우측에는 점수가 보여집니다.</p><br/><br/>

        <h2>2. 난이도를 선택할 수 있어요!</h2>
        <img src="/img/SpeedTypingImg2.png" alt="게임 설명 이미지" width="500" height="auto" />
        <p>화면 상단에서 'Easy', 'Medium', 'Hard' 총 세 단계의 난이도 선택이 가능합니다..</p><br/><br/>
      </div>}
    </div>
  );
}

export default PlayGame2;