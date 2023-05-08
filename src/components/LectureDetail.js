import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import './asset/css/LectureDetail.css';

function LectureDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;


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

    const updateBbs = () => {
        history("/bbsupdate/" + bbs.seq);
    }


    const handleDelete = (seq) => {
        // 게시물 삭제 로직
        // 삭제할 게시물의 postId를 받아와서 삭제 로직을 구현합니다.
        const updatedPosts = bbs.filter(post => post.seq !== seq);
        setBbs(updatedPosts);
      }

    // login한 id와 작성자 id와 같을 시에는 버튼을 보여준다
    function UpdateButtonLoad(){
        let str = localStorage.getItem('login');
        let login = JSON.parse(str);

        if(login.writer !== bbs.writer){
            return ""
        }
        return (
            <span>
                &nbsp;<button type="button" onClick={() => handleDelete(bbs.seq)} className="btn btn-primary">삭제하기</button>
                &nbsp;<button type="button" onClick={updateBbs} className="btn btn-primary">글 수정</button>
            </span>
                        
        )
    }

    return (
        <div className="lecdeMain">
            <h2 style={{marginLeft:"140px"}}>강의 보기</h2>
            <table>
            <tbody>
            <div style={{marginLeft:"140px"}}>
            <tr>
                <th style={{paddingRight:"103px"}}>제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr>
                <th>과목</th>
                <td style={{ textAlign:"left" }}>{bbs.subject}</td>
            </tr>
            <tr>
                <th>작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            </div>
            <tr>	
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left", marginLeft:"138px" }}>{bbs.content}</pre>
                    
                    <video style={{width:"700px", marginLeft:"234px", border:"3px solid #eeeeee"}} controls >
                        <source src={require('./asset/css/sample2.mp4')} type="video/mp4" /> 
                    </video>
                </td>
            </tr>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button className="leclistBtn" style={{width:"100px", height:"42px"}} type="button" onClick={leclist}>목록으로</button>
            </div>
            
            <UpdateButtonLoad />
        
        </div>
    )
}

export default LectureDetail;

