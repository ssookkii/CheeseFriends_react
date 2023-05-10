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
       <div className="divCenter" style={{margin:40}}>
            <h1><b>Speed Typing</b></h1>
       </div><br/><br/>

       <div className="divCenter">
       {showGameexp && <button className="playbtn" type="button" onClick={handlePlayGame}>Play Game</button>}
       </div>
       <div className="divCenter">
        {showIframe && <button className="playbtn" type="button" onClick={handlePlayGame}>게임 설명</button>}<br/><br/>
       </div>
        {showIframe && <div style={{marginTop:80}}><iframe src="../typingGame/index.html" width="800" height="800"></iframe></div>}<br/><br/>

      {showGameexp && <div className="divCenter">
        <h1 style={{marginBottom:100}}><b>게임 설명</b></h1><br/>
        <h2>1. 게임 시작!</h2><br/>
        <p><b>Speed Typing</b> 은 제시어를 제한시간 안에 빠르게 입력하는 게임입니다.</p><br/>
        <img src="/img/SpeedTypingImg1.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>게임이 시작되면 제시어와 함께 좌측에는 제한시간, 우측에는 점수가 보여집니다.</p><br/><br/>

        <h2>2. 난이도를 선택할 수 있어요!</h2><br/>
        <img src="/img/SpeedTypingImg2.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>화면 상단에서 'Easy', 'Medium', 'Hard' 총 세 단계의 난이도 선택이 가능합니다.</p>
        <p>자신에게 적당한 난이도를 선택하여 게임을 즐겨보세요.</p><br/><br/>
      </div>}
    </div>
  );
}

export default PlayGame2;