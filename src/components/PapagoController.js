import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import { faMicrophone, faVolumeUp, faCheese } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactDOM from "react-dom";

function PapagoController() {
    const [umessage, setUmessage] = useState('');
    const scrollRef = useRef();

    function sendBtnClick() {
        let elementUser = document.createElement('div');
        elementUser.setAttribute('align', 'right');

        let element = document.createElement('div');
        element.innerHTML = umessage;
        element.setAttribute("class", "usermsg");

        const papago = document.getElementById("papago");
        elementUser.appendChild(element);
        papago.appendChild(elementUser);
        papago.appendChild(document.createElement('br'));

        setUmessage('');

        axios.post("http://localhost:3000/papago", null, { params: { "msg": umessage } })
        .then(function (resp) {
            PapagoAnswer(resp.data);
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }).catch(function (err) {
            alert(err);
        });
    }

    function PapagoAnswer(respData) {
        let type = respData.bubbles[0].type;
        // 판별(문자열, 링크, 이미지, 버튼)
        if (type === "text") {
            const papago = document.getElementById("papago");
            const papagoMsgWithIcon = (
                <PapagoMsgWithIcon message={respData.bubbles[0].data.description} />
            );
            ReactDOM.render(papagoMsgWithIcon, papago.appendChild(document.createElement("div")));
            papago.appendChild(document.createElement("br"));
        } else if (type === "template") {
            // image
            if (respData.bubbles[0].data.cover.type === "image") {
                let element = document.createElement("img");
                element.setAttribute("src", respData.bubbles[0].data.cover.data.imageUrl);
                element.setAttribute("width", "200px");
                element.setAttribute("height", "140px");

                const papago = document.getElementById("papago");
                papago.appendChild(element);
                papago.appendChild(document.createElement("br"));
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

                const papago = document.getElementById("papago");
                papago.appendChild(element);
                papago.appendChild(document.createElement("br"));
            }
        } else if (type === "voice") {
            const msg = new SpeechSynthesisUtterance(respData.bubbles[0].data.description);
            window.speechSynthesis.speak(msg);
        }
    }
        function PapagoMsgWithIcon({ message }) {
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
            axios.post("http://localhost:3000/papago", null, { params: { "msg": "시작" } })
                .then(function (resp) {
                    PapagoAnswer(resp.data);
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
                        <FontAwesomeIcon icon={faCheese} /> PAPAGO   <FontAwesomeIcon icon={faCheese} />
                    </p>
                </div>
    
                <div className="papago" id="papago" ref={scrollRef}>
    
                </div>
    
                <div className="myform">
                    <input type="text" className="usermsgwrite"
                        value={umessage} onChange={(e) => setUmessage(e.target.value)} placeholder="메시지 기입" />
    
                    <input type="button" className="submitmsg" onClick={sendBtnClick} value="↑" />
                    <button className="voiceInput" onClick={handleVoiceInput}>
                        <FontAwesomeIcon icon={faMicrophone} />
                    </button>
                </div>
            </div>
        )
    }

export default PapagoController;