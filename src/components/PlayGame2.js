import React, { useState } from "react";
import Slider from "react-slick";

import './asset/css/ShelterPage.css'

function PlayGame2() {
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
       <div className="divCenter" style={{margin:40}}>
        <h1><img src={`${process.env.PUBLIC_URL}/img/speed typing img123.png`}  style={{width:'30%'}} alt="speed typing"/></h1>
       </div>

       <div className="divCenter">
       {showGameexp && <button className="playbtn" type="button" onClick={handlePlayGame}>Play Game</button>}
       </div>
       <div className="divCenter">
        {showIframe && <button className="playbtn" type="button" onClick={handlePlayGame}>게임 설명</button>}
       </div>
        {showIframe && <div style={{marginTop:80}}><iframe src="../../typingGame/index.html" width="800" height="800"></iframe></div>}

      <div className="playInfoWrap">
        {showGameexp &&
        <Slider {...playSettings}>
          <div className="playInfo" style={{height:500}}>
          <img src="/img/SpeedTypingImg1.png" alt="게임 설명 이미지" width="500" height="auto" />
              
            <div className="InfoTxt">
              <h2>게임 시작!</h2>
              <p><b>Speed Typing</b> 은 제한시간 안에 <br/>제시어를 빠르게 입력하는 게임입니다.</p><br/>
              <p>게임이 시작되면 제시어와 함께 <br/>좌측에는 제한시간, <br/>우측에는 점수가 보여집니다.</p>
            </div>
          </div>
          <div className="playInfo">
          <img src="/img/SpeedTypingImg2.png" alt="게임 설명 이미지" width="500" height="auto" />
              
            <div className="InfoTxt">
              <h2>난이도를 선택!</h2>
              <p>화면 상단에서 'Easy', 'Medium', 'Hard' 총 세 단계의 난이도 선택이 가능합니다.</p>
              <p>자신에게 적당한 난이도를 선택하여 게임을 즐겨보세요.</p>
            </div>
          </div>
        </Slider>
        }
      </div>
    </div>
  );
}

export default PlayGame2;