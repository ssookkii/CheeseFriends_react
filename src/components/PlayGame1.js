import React, { useState } from "react";
import Slider from "react-slick";

import './asset/css/ShelterPage.css'

function PlayGame1() {
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
            <h1><img src={`${process.env.PUBLIC_URL}/img/hangmanimg.png`}  style={{width:'30%'}} alt="hang man"/></h1>
       </div>

        <div className="divCenter">
         {showGameexp &&<button className="playbtn" type="button" onClick={handlePlayGame}>Play Game</button>}
        </div>
        <div className="divCenter">
         {showIframe && <button className="playbtn" type="button" onClick={handlePlayGame}>게임 설명</button>}
        </div>
        {showIframe && <div><iframe src="../../hangmanGame/index.html" width="800" height="800"></iframe></div>}


      <div className="playInfoWrap">
        {showGameexp &&
          <Slider {...playSettings}>
            <div className="playInfo">
              <img src="/img/HangmanStartImg.png" alt="게임 설명 이미지" width="500" height="auto" />
              
              <div className="InfoTxt">
                <h2>게임 시작!</h2>
                <p><b>Hang Man</b> 은 글자수를 힌트로 <br/>영어 단어를 맞히는 게임입니다.</p><br/>
                <p>게임이 시작되면 맞혀야 할 단어의<br/>글자 수만큼 밑줄이 보입니다.</p>
              </div>
            </div>
            <div className="playInfo" style={{width:800}}>
              <img src="/img/HangmanImg1.png" alt="게임 설명 이미지" width="500" height="auto" />
              
              <div className="InfoTxt">
                <h2>알파벳을 골라요!</h2>
                <p>맞혀야할 단어에 선택한 알파벳이<br/>포함되면 알파벳이 자리에 생겨납니다.</p>
              </div>
            </div>
            <div className="playInfo" style={{width:800}}>
            <img src="/img/HangmanImg2.png" alt="게임 설명 이미지" width="500" height="auto" />
              
              <div className="InfoTxt">
                <h2>신중히 고르세요!</h2>
                <p>선택한 알파벳이 오답이라면 <br/>'Wrong' 리스트에 알파벳이 표시되며</p>
                <p>교수대에 스틱맨 그림이 <br/>한 부위씩 그려집니다.</p>
              </div>
            </div>
            <div className="playInfo" style={{width:800}}>
            <img src="/img/HangmanImg3.png" alt="게임 설명 이미지" width="500" height="auto" />
              
              <div className="InfoTxt">
                <h2>Game Over!</h2>
                <p>스틱맨이 다 그려질때까지 <br/>정답을 맞히지 못할 경우 <br/>Game Over 되며 정답을 알려줍니다.</p>
              </div>
            </div>
            <div className="playInfo" style={{width:800}}>
            <img src="/img/HangmanImg4.png" alt="게임 설명 이미지" width="500" height="auto" />
              
              <div className="InfoTxt">
                <h2>축하드려요!</h2>
                <p>알파벳을 신중하게 선택하여 <br/>스틱맨을 교수형에 처하지 않도록 <br/>정답을 맞혀보세요!</p>
              </div>
            </div>

          </Slider>
          }
      </div>
    </div>
  );
}

export default PlayGame1;