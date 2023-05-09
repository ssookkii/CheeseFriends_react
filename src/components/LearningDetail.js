import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import './asset/css/LectureDetail.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheese } from "@fortawesome/free-solid-svg-icons";



function LearningDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLearning', { params:{"seq":seq} });

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
    
    const learnlist = () => {        
        history('/cheesefriends/learning');
    }

    const download = async () => {
        let filename = "file.txt";
    
        const url = "http://localhost:3000/fileDownload?filename=" + filename;
    
        window.location.href = url;
    }

   
    return (
        <div className="lecdeMain">
            <h2 className="lech2">수업 자료실</h2>
            <table style={{marginBottom:"180px"}} >
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
                <td colSpan="2" style={{ backgroundColor:'white', textAlign:"left" }}>

                <button onClick={download} style={{backgroundColor:'white', paddingTop:"10px", width:"133px", fontWeight:"bold", color:"#fbca73"}}><FontAwesomeIcon icon={faCheese} color="#fbca73" /> 첨부파일</button>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left", paddingTop:"7px" }}>{bbs.content}</pre>
                </td>
            </tr>
            </div>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button style={{width:"100px", height:"42px"}} type="button" onClick={learnlist} className="leclistBtn">목록으로</button>
            </div>
                    
        </div>
    )
}

export default LearningDetail;

