import React, { useState } from "react";

import './asset/css/ShelterPage.css'

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

      <h1>게임 설명</h1><br/>
      <h2>1. 게임 시작 화면</h2>
      <img src="/img/GameStartImg.png" alt="게임 설명 이미지" width="200" height="auto" />
      <p>'Start' 버튼을 누르면 게임이 시작되며 캐릭터가 비행을시작합니다.</p>
      <video muted autoPlay loop width="200" height="auto">
        <source src="/img/game_1.mp4" type="video/mp4"/>
      </video>
      <p>마우스를 클릭하여 비행 방향을 '좌','우'로 바꿀 수 있습니다.</p><br/><br/>

      <h2>2. 장애물을 피하세요!</h2>
      <video muted autoPlay loop width="200" height="auto">
        <source src="/img/game_1.mp4" type="video/mp4"/>
      </video>
      <p>장애물에 부딪히면 캐릭터가 추락하며 게임이 종료됩니다.</p>
      <video muted autoPlay loop width="200" height="auto">
        <source src="/img/game_2.mp4" type="video/mp4"/>
      </video>
      <p>또한 게임 화면 좌측, 우측 경계에 부딪혀도 게임이 종료됩니다.</p><br/><br/>

      <h2>3. 더 높이 날기 위해 <img src="/img/battery.png" width="30" height="30" /> (배터리) 를 챙기세요!</h2>
      <video muted autoPlay loop width="200" height="auto">
        <source src="/img/game_3.mp4" type="video/mp4"/>
      </video>
      <p>프로펠러 헬멧의 에너지가 모두 소모되면 캐릭터가 추락합니다.</p>
      <p>배터리를 챙겨 에너지를 충전해주세요.</p><br/><br/>
    </div>
  );
}

export default PlayGame;
