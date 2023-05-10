import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import './asset/css/LectureDetail.css';

function QnaLearningDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLearningQna', { params:{"seq":seq} });

        console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }
    
    const qnalist = () => {        
        history('/cheesefriends/learning/QnALearningList');
    }

    const qnaAnswer = () => {
        history('/cheesefriends/learning/QnaLearningAnswer');
    }

    
    return (
        <div  className="lecdeMain">
            <h2 className="lech2">수업 질문방</h2>
            <table style={{marginBottom:"180px"}}>
            <tbody>
            <div>
            <tr style={{height:"32px"}}>
                <th style={{paddingRight:"103px"}} className="tableth">제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">과목</th>
                <td style={{ textAlign:"left" }}>{bbs.subject}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">작성자</th>
                <td style={{ textAlign:"left" }}>{bbs.writer}</td>
            </tr>
            <tr style={{height:"32px"}}>
                <th className="tableth">작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            <tr style={{height:"32px"}}>	
                <th>내용</th>
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left" }}>{bbs.content}</pre>
                </td>
            </tr>
            </div>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button className="leclistBtn" type="button" >
                <Link to={`/cheesefriends/learning/QnaLearningAnswer/${bbs.seq}`} style={{textDecoration:"none", fontWeight:"bold", color:"white", fontSize:"1em"}}>답변하기</Link></button>
                <button className="resetbtn" type="button" onClick={qnalist}>목록으로</button>
            </div>
                   
        </div>
    )
}

export default QnaLearningDetail;

