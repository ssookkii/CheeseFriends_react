import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { faCheese } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './asset/css/ServiceAnswer.css';
import axios from 'axios';

export default function ServiceAnswer(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params.seq);

    const [seq] = useState(params.seq);
    const [writer, setWriter] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    
    const titleChange = (e) => setTitle(e.target.value);
    const writerChange = (e) => setWriter(e.target.value);
    const contentChange = (e) => setContent(e.target.value);

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={topic} style={{marginLeft:"60px", width:"190px", border:"none", borderBottom:"2px solid lightgray"}}>
                <option key="frequently" value="자주묻는질문">자주묻는질문</option>
                <option key="userInfo" value="개인정보">개인정보</option>
                <option key="useLect" value="강의이용">강의이용</option>
                <option key="player" value="학습플레이어">학습플레이어</option>
                <option key="mobile" value="모바일/기타">모바일/기타</option>
            </select>
        );
    };

    const changeSelectOptionHandler = (e) => {
        setTopic(e.target.value);
    };

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getService', { params:{"seq":seq} });

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
        
        axios.post("http://localhost:3000/answerService", null, 
                    { params:{ "seq":seq, "topic":bbs.topic, "writer":writer, "title":title, "content":content } })
             .then(res => {
                console.log(res.data);
                if(res.data === "YES"){
                    alert("답글이 성공적으로 등록되었습니다");
                    history('/service/ServiceList');    // bbslist로 이동
                }else{
                    alert("답글이 등록되지 않았습니다");
                }
             })
             .catch(function(err){
                alert(err);
             })   
    }

    function resetBtn() {
        history('/service/ServiceList');
    }

    if(loading === false){
        return <div>Loading...</div>
    }

    return (
        <div>
            <h2 className='ph2'>
                <FontAwesomeIcon icon={faCheese} />&nbsp;&nbsp;고객센터 문의내용</h2>
            <div className="answertable">
                <div style={{backgroundColor:"#f0f0f0", width:"727px", height:"90px", margin:"auto"}}>
                    <p style={{marginBottom:"8px"}}> [ {bbs.topic} ]</p>
                    <h3 style={{fontWeight:"bold", fontSize:"24px"}}>{bbs.title}</h3>
                    <div>
                        작성자 {bbs.writer} | {bbs.regdate}
                    </div>
                </div>
                <textarea style={{width:"630px", height:"200px", margin:"auto", marginTop:"30px", marginLeft:"84px"}} value={bbs.content} readOnly></textarea>
            </div>

            <div className="tablewrapper">
                <h2 className="ph2a">
                    <FontAwesomeIcon icon={faCheese} />&nbsp;&nbsp;고객센터 답변 등록</h2>
                
                <table border="1" className="answertablet">
                    <tbody>
                    <tr>
                        <th>제목</th>
                        <td>
                            <input type="text"  className="servinput" size="50" value={title} onChange={titleChange}/>
                        </td>	
                    </tr>
                    <tr>
                        <th>카테고리</th>
                        <td>{bbs.topic}</td>
                    </tr>
                    <tr>
                        <th>작성자</th>
                        <td>
                            <input type="text" className="servinput" size="50" value={writer} onChange={writerChange} />
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
            <button type="button" onClick={resetBtn}>취소</button>
            <button type="button" onClick={answerBbs} style={{color:"black", background:"#fbca73"}} >작성완료</button>
            </div>
        </div>
    );
}