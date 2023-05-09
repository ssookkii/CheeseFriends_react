import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import './asset/css/LectureDetail.css';

function LectureDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getLecture', { params:{"seq":seq} });

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
    
    const leclist = () => {        
        history('/cheesefriends/lecture');
    }


    const handleDelete = (seq) => {
        // 게시물 삭제 로직
        // 삭제할 게시물의 postId를 받아와서 삭제 로직을 구현합니다.
        const updatedPosts = bbs.filter(post => post.seq !== seq);
        setBbs(updatedPosts);
      }

  
    return (
        <div className="lecdeMain">
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
                    <pre id="content" style={{ fontSize:'18px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left", marginLeft:"138px" }}>{bbs.content}</pre>
                    
                    <video style={{width:"700px", marginLeft:"272px", border:"3px solid #eeeeee"}} controls >
                        <source src={require('./asset/css/sample2.mp4')} type="video/mp4" /> 
                    </video>
                </td>
            </tr>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button className="leclistBtn" type="button" onClick={leclist}>목록으로</button>
            </div>
                  
        </div>
    )
}

export default LectureDetail;

