import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { faMicrophone, faVolumeUp, faCheese, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";


import "./asset/css/Chatbot.css";

function Chatbot() {
    const [umessage, setUmessage] = useState('');
    const scrollRef = useRef();

    function Papago() {
        axios.post("http://localhost:3000/papago", null, { params: { "msg": umessage } })
          .then((resp) => {
            const botMsgContainers = document.querySelectorAll('.botmsgContainer');

            const newMsgElem = document.createElement('div');
            newMsgElem.setAttribute('align', 'right');
            newMsgElem.className = 'botmsg';
            newMsgElem.textContent = JSON.stringify(resp.data);
            newMsgElem.style.backgroundColor = '#b4e4ff';
            newMsgElem.style.marginBottom = '20px';
            newMsgElem.style.marginLeft = '216px';
            newMsgElem.style.color = '#434343';

            // 두 번째 botMsgContainer 다음에 newMsgElem 추가
            botMsgContainers[2].insertAdjacentHTML('afterend', newMsgElem.outerHTML);

            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      
 
          });
      }
    function sendBtnClick() {
        let elementUser = document.createElement('div');
        elementUser.setAttribute('align', 'right');

        let element = document.createElement('div');
        element.innerHTML = umessage;
        element.setAttribute("class", "usermsg");

        const chatbox = document.getElementById("chatbox");
        elementUser.appendChild(element);
        chatbox.appendChild(elementUser);
        chatbox.appendChild(document.createElement('br'));

        const messageToSend = umessage; // 현재 umessage 값을 저장

        setUmessage('');

        axios.post("http://localhost:3000/chatBot", null, { params: { "msg": messageToSend } })
            .then(function (resp) {
                ChatbotAnswer(resp.data);
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }).catch(function (err) {
                alert(err);
            });
    }

    function ChatbotAnswer(respData) {
        let type = respData.bubbles[0].type;
        // 판별(문자열, 링크, 이미지, 버튼)
        if (type === "text") {
            const chatbox = document.getElementById("chatbox");
            const botMessageWithIcon = (
                <BotMessageWithIcon message={respData.bubbles[0].data.description} />
            );
            ReactDOM.render(botMessageWithIcon, chatbox.appendChild(document.createElement("div")));
            chatbox.appendChild(document.createElement("br"));
        } else if (type === "template") {
            // image
            if (respData.bubbles[0].data.cover.type === "image") {
                let element = document.createElement("img");
                element.setAttribute("src", respData.bubbles[0].data.cover.data.imageUrl);
                element.setAttribute("width", "200px");
                element.setAttribute("height", "140px");

                const chatbox = document.getElementById("chatbox");
                chatbox.appendChild(element);
                chatbox.appendChild(document.createElement("br"));
            }
            // a tag(link)
            else if (respData.bubbles[0].data.cover.type === "text") {
                let title = respData.bubbles[0].data.contentTable[0][0].data.title;
                let url = respData.bubbles[0].data.contentTable[0][0].data.data.action.data.url;

                let element = document.createElement("a");
                element.innerHTML = title;
                element.setAttribute("href", url);
                element.setAttribute("class", "botmsg");
                element.setAttribute("target", "_blank");

                const chatbox = document.getElementById("chatbox");
                chatbox.appendChild(element);
                chatbox.appendChild(document.createElement("br"));
            }
        } else if (type === "voice") {
            const msg = new SpeechSynthesisUtterance(respData.bubbles[0].data.description);
            window.speechSynthesis.speak(msg);
        }
    }

    function BotMessageWithIcon({ message }) {
        return (
            <div className="botmsgContainer">
                <div className="botmsg">{message}</div>
                <span
                    className="listenIcon"
                    onClick={() => {
                        playAudio(message);
                    }}
                >
                    <FontAwesomeIcon icon={faVolumeUp} />
                </span>
            </div>
        );
    }

    function playAudio(text) {
        const msg = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice = voices.find((voice) => voice.name === "Korean");
        msg.voice = selectedVoice;
        window.speechSynthesis.speak(msg);
    }

    useEffect(() => {
        axios.post("http://localhost:3000/chatBot", null, { params: { "msg": "시작" } })
            .then(function (resp) {
                ChatbotAnswer(resp.data);
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }).catch(function (err) {
                alert(err);
            })
    }, []);

    function handleVoiceInput() {
        window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new window.SpeechRecognition();
        recognition.lang = "ko-KR";

        recognition.addEventListener("result", (e) => {
            const transcript = Array.from(e.results)
                .map((result) => result[0])
                .map((result) => result.transcript)
                .join("");

            setUmessage(transcript);
        });

        recognition.start();
    }

    return (
        <div className="wrapper" style={{ position: "fixed", bottom: "70px", right: "30px" }}>
            <div className="menu">
                <p className="welcome">
                    <FontAwesomeIcon icon={faCheese} /> CHAT BOT   <FontAwesomeIcon icon={faCheese} />
                </p>
            </div>

            <div className="chatbox" id="chatbox" ref={scrollRef}>
                <div className="botmsgContainer"></div>
            </div>

            <div className="myform">
                <input type="text" className="usermsgwrite"
                    value={umessage} onChange={(e) => setUmessage(e.target.value)} placeholder="메시지 기입" />
                <button onClick={Papago} className="translate"><FontAwesomeIcon icon={faGlobe} /></button>

                <input type="button" className="submitmsg" onClick={sendBtnClick} value="↑" />
                <button className="voiceInput" onClick={handleVoiceInput}>
                    <FontAwesomeIcon icon={faMicrophone} />
                </button>
            </div>
        </div>
    )
}

export default Chatbot;