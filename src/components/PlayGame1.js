import React, { useState } from "react";

import './asset/css/ShelterPage.css'

function PlayGame1() {
  const [showIframe, setShowIframe] = useState(false);
  const [showGameexp, setShowGameexp] = useState(true);


  const handlePlayGame = () => {
    setShowIframe(!showIframe);
    setShowGameexp(!showGameexp);
  };
  
  return (

    <div>
       <div className="divCenter" style={{marginTop:40}}>
            <h1><b>Hang Man</b></h1>
       </div><br/><br/>

        <div className="divCenter">
         {showGameexp &&<button className="playbtn" type="button" onClick={handlePlayGame}>Play Game</button>}
        </div>
        <div className="divCenter">
         {showIframe && <button className="playbtn" type="button" onClick={handlePlayGame}>게임 설명</button>}<br/><br/>
        </div>
        {showIframe && <div style={{marginTop:80}}><iframe src="../hangmanGame/index.html" width="800" height="800"></iframe></div>}<br/><br/>

        {showGameexp && <div className="divCenter">
        <h1 style={{marginBottom:100}}><b>게임 설명</b></h1><br/>
        <h2>1. 게임 시작!</h2><br/>
        <img src="/img/HangmanStartImg.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p><b>Hang Man</b> 은 밑줄로 표시된 글자수를 힌트로 영어 단어를 맞히는 게임입니다.</p>
        <p>게임을 시작하면 교수대와 함께 맞혀야할 단어의 글자 수만큼 밑줄이 보여집니다.</p><br/><br/>

        <h2>2. 26개의 알파벳중 한 개의 알파벳를 선택하세요!</h2><br/>
        <img src="/img/HangmanImg1.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>만약 맞혀야할 단어에 선택한 알파벳이 존재한다면 그 알파벳이 있는 자리에 표시됩니다.</p><br/><br/>
        <img src="/img/HangmanImg2.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>반대로 맞혀야할 단어에 선택한 알파벳이 없을 경우 'Wrong' 리스트에 알파벳이 표시되며</p>
        <p>교수대에 스틱맨 그림이 한 부위씩 그려집니다.</p><br/><br/>

        <h2>3. 스틱맨이 교수형에 처해지면 Game Over!</h2><br/>
        <img src="/img/HangmanImg3.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>스틱맨이 다 그려질때까지 정답을 맞히지 못할 경우 Game Over 되며 정답을 알려줍니다.</p><br/><br/>
        <img src="/img/HangmanImg4.png" alt="게임 설명 이미지" width="500" height="auto" /><br/><br/>
        <p>알파벳을 신중하게 선택하여 스틱맨을 교수형에 처하지 않도록 정답을 맞혀보세요!</p>
      </div>}
     </div>
  );
}

export default PlayGame1;