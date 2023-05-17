import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheese } from "@fortawesome/free-solid-svg-icons";
import './asset/css/LectureDetail.css';

function LectureDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();
    const [filename, setFileName] = useState('');

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLecture', { params:{"seq":seq} });

        console.log("bbs:" + JSON.stringify(response.data));
        setBbs(response.data);
        // setFileName(bbs.filename);
        // alert(JSON.stringify(response.data));

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        bbsData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }
    
    const leclist = () => {        
        history('/cheesefriends/lecture');
    }


    // download
    const download = async () => {

        // alert(JSON.stringify(bbs));
  
          let filename = bbs.filename;
      
          const url = "http://localhost:3000/fileDownload?filename=" + filename;
      
          window.location.href = url;
    }
  

  
    return (
        <div className="lecdeMain" style={{marginTop:"15px"}}>
            <h2 className="lech2">강의 보기</h2>
            <table className="lectable">
            <tbody>
            <div style={{marginLeft:"140px"}}>
            <tr>
                <th style={{paddingRight:"103px", paddingBottom:"10px", fontWeight:"bold", color:"#434343"}}>제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr>
                <th style={{ paddingBottom:"10px",  fontWeight:"bold", color:"#434343"}}>과목</th>
                <td style={{ textAlign:"left" }}>{bbs.subject}</td>
            </tr>
            <tr>
                <th style={{ fontWeight:"bold", color:"#434343"}}>작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            </div>
            <tr>	
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ marginTop:"6px", marginBottom:"0px", fontSize:'18px', lineHeight:"1.5", fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left", marginLeft:"138px" }}>{bbs.content}</pre>
                    <button onClick={download} style={{backgroundColor:'white', marginLeft:"776px", width:"133px", fontWeight:"bold", color:"#fbca73"}}><FontAwesomeIcon icon={faCheese} color="#fbca73" /> 다운로드</button>
                    <video style={{width:"629px", height:"357px", marginLeft:"272px", border:"3px solid #eeeeee"}} controls >
                        <source src={require('./asset/css/sample2.mp4')} type="video/mp4" /> 
                    </video>

                </td>
            </tr>
            </tbody>
            </table>
            <div style={{textAlign:"center", marginTop:"4px"}}>
                <button className="leclistBtn" type="button" onClick={leclist}>목록으로</button>
            </div>
                  
        </div>
    )
}

export default LectureDetail;

