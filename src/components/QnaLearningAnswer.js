import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faCheese } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './asset/css/QnaLearningAnswer.css';
import axios from 'axios';

function QnaLearningAnswer(){
    let navigate = useNavigate();

    const login = JSON.parse(localStorage.getItem("login"));
    const userName = login.name;
    
    const [bbs, setBbs] = useState();
    const [loading, setLoading] = useState(false);

    let params = useParams();

    const [seq] = useState(params.seq);
    const [writer, setWriter] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [subject, setSubject] = useState('');
    
    const titleChange = (e) => setTitle(e.target.value);
    const writerChange = (e) => setWriter(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLearningQna', { params:{"seq":seq} });

        setBbs(response.data);
        setLoading(true);
    }

     useEffect(()=>{
         bbsData(params.seq); 
     }, [params.seq, navigate])

    function answerBbs(){
        axios.post('http://localhost:3000/answerQna', null, { params: {
            seq:bbs.seq,
            title,
            subject:bbs.subject,
            writer:userName,
            content
        }})
        .then( resp => {
            console.log(resp);
 
            if(resp.data === "YES"){
                alert("답글이 성공적으로 등록되었습니다");

                navigate(`/cheesefriends/learning/QnaLearningList`);
            }else{
                alert("답글이 등록되지 않았습니다");
            }
        })
        .catch(err => console.log(err));   
    }

    function resetBtn() {
        navigate('/cheesefriends/learning/QnaLearningList');
    }

    if(loading === false){
        return <div>Loading...</div>
    }

    return (
        <div className="answer">
        <h2 className='ph2'>
            <FontAwesomeIcon icon={faCheese} />&nbsp;&nbsp;수업질문하기</h2>
            <div className="answertable">
                <div style={{backgroundColor:"#f0f0f0", width:"727px", height:"55px", margin:"auto"}}>
                    <p style={{marginBottom:"8px"}}> [ {bbs.title} ]</p>
                    <h3 style={{fontWeight:"bold", fontSize:"24px"}}>{bbs.subject}</h3>
                    <div style={{background:"#f0f0f0"}}>
                        작성자 {bbs.writer} | {bbs.regdate}
                    </div>
                </div>
                <textarea style={{width:"725px", fontSize:"1.0em", height:"135px", margin:"auto", marginTop:"33px", marginLeft:"87px"}} value={bbs.content} readOnly></textarea>
            </div>

            <div className="tablewrapper">
                <h2 className="ph2a">
                    <FontAwesomeIcon icon={faCheese} />&nbsp;&nbsp;답변하기</h2>
                
                <table border="1" className="answertablet">
                    <tbody>
                    <tr >
                        <th style={{width:"360px"}}>제목</th>
                        <td>
                            <input type="text"  className="servinput" size="50" value={title} onChange={titleChange}/>
                        </td>	
                    </tr>
                    <tr>
                        <th>과목</th>
                        <td>{bbs.subject}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>
                            <input type="text" className="servinput" size="50" value={userName} onChange={writerChange} readOnly />
                        </td>
                    </tr>
                    <tr>
                        <th>내용</th>
                        <td style={{width:"804px"}}>
                            <textarea  className='servtext' value={content} onChange={contentChange}></textarea>
                        </td>
                    </tr>
                    </tbody>
                </table>            
            </div>
            <div className="btwrapper">
            <button type="button" onClick={resetBtn} className="resetbtn">취소</button>
            <button type="submit" onClick={answerBbs} className="submitbtn" >작성완료</button>
            </div>
        </div>
    );
}

export default QnaLearningAnswer;