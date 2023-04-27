import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Session from "react-session-api";

import axios from 'axios';

function QnaLearningAnswer(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params.seq);

    const [seq] = useState(params.seq);
    const [writer, setWriter] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    
    const titleChange = (e) => setTitle(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} style={{marginLeft:"60px", width:"190px", border:"none", borderBottom:"2px solid lightgray"}}>
                <option key="kor" value="국어">국어</option>
                <option key="math" value="수학">수학</option>
                <option key="eng" value="영어">영어</option>
                <option key="social" value="사회">사회</option>
                <option key="sci" value="과학">과학</option>
            </select>
        );
    };

    const changeSelectOptionHandler = (e) => {
        setSubject(e.target.value);
    };

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLearningQna', { params:{"seq":seq} });

        // console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

     useEffect(()=>{
         bbsData(params.seq); 

    //     // setId(Session.get("login").id); 
    //     let str = localStorage.getItem('login')        
    //     if(str !== null){
    //         let login = JSON.parse(str);
    //         setWriter(login.id);
    //     }else{
    //         alert('login해 주십시오');
    //         history('/');
    //     }

     }, [params.seq, history])


    function answerBbs(){
        
        axios.post("http://localhost:3000/answerQna", null, 
                    { params:{ "seq":seq, "subject":bbs.subject, "writer":writer, "title":title, "content":content } })
             .then(res => {
                console.log(res.data);
                if(res.data === "YES"){
                    alert("추가 글이 성공적으로 등록되었습니다");
                    history('/learning/QnALearningList');    // bbslist로 이동
                }else{
                    alert("등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })   
    }


    if(loading === false){
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2>수업 질문방</h2>

            <table border="1" style={{width:"600px", fontSize:"19px", margin:"auto", textAlign:"left"}}>

            <tbody>
            <tr>
                <th>제목</th>
                <td>{bbs.title}</td>
            </tr>
            <tr>
                <th>과목</th>
                <td>{bbs.subject}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td>{bbs.writer}</td>
            </tr>
            <tr>
                <th>등록일</th>
                <td>{bbs.regdate}</td>
            </tr>
            <tr>
                <th>내용</th>
                <td>
                    <textarea rows="10" cols="50" value={bbs.content} readOnly></textarea>
                </td>
            </tr>
            </tbody>
            </table>

            <h2>답변하기</h2>
            
            <table border="1" style={{width:"600px", fontSize:"19px", margin:"auto", textAlign:"left"}}>
            <tbody>
            <tr>
                <th>제목</th>
                <td>
                    <input type="text" size="50" value={title} onChange={titleChange}/>
                </td>	
            </tr>
            <tr>
                <th>과목</th>
                <td>{bbs.subject}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td>
                    <input type="text" size="50" value={writer} readOnly/>
                </td>
            </tr>
            <tr>
                <th>내용</th>
                <td>
                    <textarea rows="10" cols="50" value={content} onChange={contentChange}></textarea>
                </td>
            </tr>
            </tbody>
            </table>            

            <button type="button" onClick={answerBbs} style={{color:"black"}} >작성완료</button>
        </div>
    );
}

export default QnaLearningAnswer;