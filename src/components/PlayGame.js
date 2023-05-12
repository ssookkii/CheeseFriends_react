import React, { useState } from "react";
import Slider from "react-slick";

import './asset/css/ShelterPage.css'
import "./asset/css/slick.css";
import "./asset/css/slick-theme.css";

function PlayGame() {
  const [showIframe, setShowIframe] = useState(false);
  const [showGameexp, setShowGameexp] = useState(true);


  const handlePlayGame = () => {
    setShowIframe(!showIframe);
    setShowGameexp(!showGameexp);
  };

  const playSettings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: true
    };

  return (

    <div style={{width:800, height:1300}}>
      <div className="divCenter" style={{marginTop:40}}>
        <h1><img src={`${process.env.PUBLIC_URL}/img/playgame1.png`}  style={{width:'30%'}} alt="prop 2 sky"/></h1>
      </div>

      <div className="divCenter">
      {showGameexp && <button className="playbtn" type="button" onClick={handlePlayGame}>Play Game</button>}
      </div>
      <div className="divCenter">
      {showIframe && <button className="playbtn" type="button" onClick={handlePlayGame}>게임 설명</button>}
      </div>
      {showIframe && <div className="divCenter"><iframe src="../../WebGLTest/index.html" width="520" height="1090"></iframe></div>}

    <div className="playInfoWrap">
      {showGameexp && 
        <Slider {...playSettings}>
        <div className="playInfo">
          <video muted autoPlay loop width="300" height="550">
            <source src="/img/game_1.mp4" type="video/mp4"/>
          </video>
          <div className="InfoTxt">
            <h2>게임 시작!</h2>
            <p>'Start' 버튼을 누르면 캐릭터가 비행을시작합니다.</p>
            <p>마우스를 클릭하여 비행 방향을 '좌','우'로 바꿀 수 있습니다.</p>
          </div>
        </div>
          <div className="playInfo" style={{width:800}}>
              <video muted autoPlay loop width="300" height="550">
                <source src="/img/game_1.mp4" type="video/mp4"/>
              </video>
            <div className="InfoTxt">
              <h2>장애물을 통과하세요!</h2>
              <p>장애물에 부딪히면 캐릭터가 추락하며 게임이 종료됩니다.</p>
            </div>
          </div>
          <div className="playInfo" style={{width:800}}>
            <video muted autoPlay loop width="300" height="550">
              <source src="/img/game_2.mp4" type="video/mp4"/>
            </video>
          <div className="InfoTxt">
            <h2>좌측, 우측도 조심하세요!</h2>
            <p>게임 화면 좌측, 우측 경계에 부딪혀도 게임이 종료됩니다.</p>
          </div>
        </div>
        <div className="playInfo" style={{width:800}}>
          <video muted autoPlay loop width="300" height="550">
            <source src="/img/game_3.mp4" type="video/mp4"/>
          </video>
          <div className="InfoTxt">
            <h2><img src="/img/battery.png" width="40" height="40" style={{display:"inline-block"}}/>(배터리)를 챙기세요!</h2>
            <p>프로펠러 헬멧의 에너지가 모두 소모되면 캐릭터가 추락합니다.</p>
            <p>화면 상단의 에너지를 확인하고 배터리를 챙겨주세요.</p>
          </div>
        </div>
      </Slider>
      }
      </div>
    </div>
  );
}

export default PlayGame;
