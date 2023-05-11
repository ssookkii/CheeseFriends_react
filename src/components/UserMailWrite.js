import React, { useState, useRef, Fragment, useEffect } from "react";
import { useNavigate } from 'react-router';
import axios from 'axios';

import SearchReceiver from "./SearchReceiver";
import styles from './asset/css/adminWrite.module.css'

function UserMailWrite(){
    const searchParams = new URLSearchParams(window.location.search);
    const props = JSON.parse(searchParams.get('props'));

    useEffect(() => {
        console.log(props);
        const formattedReceiver = props.id.map(id => ({ id }));
        setReceiver(formattedReceiver);
    }, []);

    const history = useNavigate();
    const [isOpen, setOpen] = useState(false);

    const openSearchModalHandler = () => {
        setOpen(true);
    };

    const closeSearchModalHandler = () => {
        setOpen(false);
    };

    const [eduCode, setEduCode] = useState([]);
    const [receiver, setReceiver] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef(); 
    const [file, setFile] = useState(null);
    const [filename, setFilename] = useState("");
    const [newfilename, setNewfilename] = useState("");

    const id = JSON.parse(localStorage.getItem("login"));
    const sender = id.id;

    const titleChange = (e) => setTitle(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    function imageLoad(e){
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setImgFile(reader.result);

        setFile(e.target.files[0]);
        setFilename(e.target.files[0].name);

        if(filename.indexOf('.') >= 0) {	// 확장자명이 있음
			const fpost = filename.substring(filename.indexOf('.'));	// .txt
			setNewfilename(new Date().getTime() + fpost);		// 342456232 + .txt
		}else {		// 확장자명이 없음
			setNewfilename(new Date().getTime() + ".back");	// 342456232 + .back
		}


        }
    }

    function mailsend() {
        if (receiver.length === 0) {
            alert("쪽지 받을 사람을 추가해주세요");
            return;
            } else if (title.length === 0) {
            alert("제목을 입력해주세요");
            return;
            } else if (content.length === 0) {
            alert("내용을 입력해주세요");
            return;
            }
        
            // axios.post() 요청을 담을 Promise 배열
            const requests = [];
        
            // 보내자
            for (let i = 0; i < receiver.length; i++) {
            requests.push(
                axios
                .post("http://localhost:3000/mailsend", null, {
                    params: {
                    sender: sender,
                    receiver: receiver[i].id,
                    title: title,
                    content: content,
                    filename: filename,
                    newfilename: newfilename,
                    },
                })
            );
            }
        
            // 모든 axios.post() 요청이 완료될 때까지 기다립니다.
            Promise.all(requests)
            .then((responses) => {
                // 파일 저장
                if (filename !== null && filename !== "") {
                const formData = new FormData();
                formData.append("uploadFile", file, filename);
        
                fetch("http://localhost:3000/mailfile", {
                    method: "POST",
                    body: formData,
                })
                    .then((result) => console.log(result))
                    .catch((error) => console.error(error));
                }
        
                alert("쪽지를 보냈습니다");
                window.close();
            })
            .catch((error) => {
                alert(error);
                console.log(error);
            });
        }

    return (
        <div className={styles.wrap}> 
            <div className={styles.contentBox}>
                <span>수신인</span>
                <div className={styles.cBox}>
                    <div className={styles.senderList}>
                    { receiver.map(function(id, i){
                            return(
                            <Fragment>
                            <span key={i}>{id.id}, </span>
                            </Fragment>
                        );
                    })}
                    </div>
                </div>
                <SearchReceiver isOpen={isOpen} onClose={closeSearchModalHandler} setReceiver={setReceiver}/>
                <input type="hidden" value={sender}/>
            </div>
            <div className={styles.contentBox}>
                <span>제목</span>
                <input value={title} onChange={titleChange} placeholder='제목'/><br></br>
            </div>
            <div className={styles.contentBox}>
                <span>첨부파일</span>
                <div className={styles.cBox}>
                    <input class={styles.uploadName} value={filename} placeholder="첨부파일"></input>
                    <label for="file" className={`${styles.btn} ${styles.linkBtn}`}>파일찾기</label>
                    <input type="file" id="file" name="uploadFile" multiple="multiple" onChange={imageLoad} ref={imgRef} accept="*"/>
                </div>
            </div>
            <div className={styles.contentBox}>
                <span>내용</span>
                <textarea value={content} onChange={contentChange} placeholder='내용'></textarea>
            </div>
            <button className={`${styles.answerBtn} ${styles.btnCenter}`} onClick={mailsend}>쪽지전송</button>
        </div>
    );
}
export default UserMailWrite