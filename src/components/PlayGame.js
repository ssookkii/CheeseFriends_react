import React, { useState } from "react";

import './asset/css/ShelterPage.css'

function PlayGame() {
  const [showIframe, setShowIframe] = useState(false);
  const [showGameexp, setShowGameexp] = useState(true);


  const handlePlayGame = () => {
    setShowIframe(!showIframe);
    setShowGameexp(!showGameexp);
  };

  return (

    <div style={{width:1000}}>
      <div className="divCenter" style={{marginTop:40}}>
        <h1><b>Prop 2 Sky</b></h1>
      </div><br/><br/>

      <div className="divCenter">
      {showGameexp && <button className="btn" type="button" onClick={handlePlayGame}>Play Game</button>}
      </div>
      <div className="divCenter">
      {showIframe && <button className="btn" type="button" onClick={handlePlayGame}>게임 설명</button>}<br/><br/>
      </div>
      {showIframe && <div className="divCenter"><iframe src="../WebGLTest/index.html" width="520" height="1090"></iframe></div>}<br/><br/>

      {showGameexp && <div className="divCenter">
        <h1 style={{marginBottom:100}}><b>게임 설명</b></h1><br/><br/>
        <h2>1. 게임 시작!</h2><br/>
        <video muted autoPlay loop width="200" height="auto">
          <source src="/img/game_1.mp4" type="video/mp4"/>
        </video>
        <p style={{marginTop : 20}}>'Start' 버튼을 누르면 게임이 시작되며 캐릭터가 비행을시작합니다.</p>
        <p style={{marginTop : 20}}>마우스를 클릭하여 비행 방향을 '좌','우'로 바꿀 수 있습니다.</p><br/><br/>

        <h2>2. 장애물을 통과하여 점수를 획득하세요!</h2><br/><br/>
        <div style={{float:"left", width:500}}>
          <video muted autoPlay loop width="200" height="auto">
            <source src="/img/game_1.mp4" type="video/mp4"/>
          </video>
        <p style={{marginTop : 20}}>장애물에 부딪히면 캐릭터가 추락하며 게임이 종료됩니다.</p><br/>
        </div>
        <div style={{float:"right", width:500}}>
        <video muted autoPlay loop width="200" height="auto">
          <source src="/img/game_2.mp4" type="video/mp4"/>
        </video>
        <p style={{marginTop : 26}}>게임 화면 좌측, 우측 경계에 부딪혀도 게임이 종료됩니다.</p><br/><br/>
        </div><br/>
        <div style={{float:"left", width:1000}}>
        <h2>3. 더 높이 날기 위해 <img src="/img/battery.png" width="30" height="30" /> (배터리) 를 챙기세요!</h2><br/><br/>
        <video muted autoPlay loop width="200" height="auto">
          <source src="/img/game_3.mp4" type="video/mp4"/>
        </video>
        <p style={{marginTop : 20}}>프로펠러 헬멧의 에너지가 모두 소모되면 캐릭터가 추락합니다.</p>
        <p>화면 상단의 에너지를 확인하고 배터리를 챙겨주세요.</p><br/><br/>
        </div>
      </div>}
    </div>
  );
}

export default PlayGame;
