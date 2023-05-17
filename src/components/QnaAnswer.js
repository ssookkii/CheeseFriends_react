import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams, Link } from 'react-router-dom';

import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from './asset/css/adminWrite.module.css'

function QnaAnswer(){
    const login = JSON.parse(localStorage.getItem("login"));

    const [qna, setQna] = useState({
        topic : "",
        writer : "",
        regdate : "",
        title : "",
        content : "",
    });
    const [answer, setAnswer] = useState({
        writer : "",
        regdate : "",
        title : "",
        content : "",
    });
    const [answerChange, setAnswerChange] = useState(false);

    const navigate = useNavigate();

    let params = useParams();
    console.log(params.subCode);

    // 문의글 뿌려주기
    const getQnaData = async(seq) => {
        const response = await axios.get("http://localhost:3000/getQna", {params:{"seq":seq}})
            console.log(response.data);
            setQna({
                topic : response.data.topic,
                writer : response.data.writer,
                regdate : response.data.regdate,
                title : response.data.title,
                content : response.data.content,
            });
    }
    // 답글 뿌려주기
    const getAnswerData = async(seq) => {
        const response = await axios.get("http://localhost:3000/getAnswer", {params:{"getQnaSeq":seq}})
            console.log(response.data);
            setAnswer({
                writer : response.data.writer,
                regdate : response.data.regdate,
                title : response.data.title,
                content : response.data.content,
            });
    }
    
    useEffect(()=>{
        getQnaData(params.seq);
        getAnswerData(params.seq);
        localStorage.setItem("btnActive", "qnamanage");
    }, [params.seq]);

    function handleButtonClick() {
        setAnswerChange(true);
    }
    function handleResetClick() {
        window.location.reload();
        setAnswerChange(false);
    }


    function sendAnswer(){
        let answerData = null;
        if(answer.title === null || answer.title === "") {
            alert("답변제목을 입력해주세요");
            return;
        } else if (answer.content === null || answer.content === "") {
            alert("답변내용을 입력해주세요");
            return;
        } else {
            answerData = {
                getQnaSeq :params.seq, 
                topic :qna.topic, 
                title :answer.title, 
                content :answer.content,
                writer: login.id,
            }
        }
        axios.post("http://localhost:3000/answerWrite", null, {params: answerData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                axios.post("http://localhost:3000/mailsend", null, 
                { params:{  "sender":login.id, 
                            "receiver":qna.writer, 
                            "title": answer.title, 
                            "content":answer.content,
                }})
                .then(function(resp){
                  //  alert("성공");
                })
                .catch(function(err){
                    alert("err");
                    console.log(err);
                })
                alert("답변이 등록되었습니다");
                console.log(resp.data);
                window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    function updateAnswer(){
        let answerData = null;
        if(answer.title === null || answer.title === "") {
            alert("답변제목을 입력해주세요");
            return;
        } else if (answer.content === null || answer.content === "") {
            alert("답변내용을 입력해주세요");
            return;
        }else{
            answerData = {
                getQnaSeq :params.seq,
                title :answer.title, 
                content :answer.content,
                writer: login.id,
            }
        }
        axios.post("http://localhost:3000/answerUpdate", null, {params: answerData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                axios.post("http://localhost:3000/mailsend", null, 
                { params:{  "sender":login.id, 
                            "receiver":qna.writer, 
                            "title": answer.title, 
                            "content":answer.content,
                }})
                .then(function(resp){
                  //  alert("성공");
                })
                .catch(function(err){
                    alert("err");
                    console.log(err);
                })
                alert("답변이 수정되었습니다");
                setAnswerChange(false);
                window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    return (
        <div className={styles.wrap}>
            <div className={styles.qnaWrap}>
                <h2 className={styles.title}>
                {answer.writer !== "admin" ?
                    <span className={`${styles.answerN} ${styles.answerProcess}`}>답변대기</span>
                    :
                    <span className={`${styles.answerProcess}`}>답변완료</span>
                }
                    <span className={styles.topic}>{qna.topic}</span>
                    <em><FontAwesomeIcon icon={faLock} /></em>
                </h2>
                <div className={`${styles.InputBox} ${styles.titleMargin}`}>
                    <span className={styles.question}>Q</span>
                    <span className={styles.mailTitle}>{qna.title}</span>
                </div>
                <div className={`${styles.answerContent} ${styles.answerMargin}`}>
                    <div className={`${styles.InputBox} ${styles.flex}`}>
                        <p>{qna.content}</p>
                    </div>
                    <div className={styles.answerWT}>
                        <span>{qna.writer}</span>
                        <span>{qna.regdate}</span>
                    </div>
                </div>
            </div>
            {answer.writer !== "admin" ? (
            <div>
                <input
                    type="text"
                    className={styles.titleInput}
                    onChange={(e) => setAnswer(prevState => ({...prevState, title: e.target.value}))}
                    placeholder='답변제목'/>
                <textarea
                    className={styles.textarea}
                    onChange={(e) => setAnswer(prevState => ({...prevState, content: e.target.value}))}
                    placeholder='답변내용'></textarea>
            </div>
            ) : 
            (
            !answerChange ? (
            <div className={styles.answerWrap}>
                <div className={`${styles.InputBox}`}>
                    <span className={styles.question}>A</span>
                    <span className={styles.mailTitle}>{answer.title}</span>
                </div>   
                <div className={`${styles.answerContent} ${styles.answerMargin}`}>
                    <div className={`${styles.InputBox} ${styles.flex}`}>
                        <p>{answer.content}</p>
                    </div>
                    <div className={styles.answerWT}>
                        <span>{answer.writer}</span>
                        <span>{answer.regdate}</span>
                    </div>
                </div>
            </div>
            ) : (<div>
                <input
                    type="text"
                    className={styles.titleInput}
                    defaultValue={answer.title}
                    onChange={(e) => setAnswer(prevState => ({...prevState, title: e.target.value}))}/>
                <textarea
                    className={styles.textarea}
                    onChange={(e) => setAnswer(prevState => ({...prevState, content: e.target.value}))}>{answer.content}</textarea>
            </div>)
            )}

            <div>
            {answer.writer !== "admin" ? (
                <button className={styles.answerBtn} onClick={sendAnswer}>답변하기</button>
            
            ) : (
                !answerChange ? (
                <button className={styles.answerBtn} onClick={handleButtonClick}>답변수정</button>
                ) : (
                    <>
                    <button className={styles.answerBtn} onClick={handleResetClick}>수정취소</button>
                    <button className={styles.answerBtn} onClick={updateAnswer}>수정완료</button>
                    </>

                ))
            }
            <Link to="/adminpage/qnamanage" className={`${styles.answerBtn} ${styles.linkBtn}`}>목록으로</Link>
            </div>
        </div>
    )
}
export default QnaAnswer