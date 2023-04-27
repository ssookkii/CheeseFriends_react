import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";



// import "./LectureDetail.css";

function EduInfoDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getEduInfo', { params:{"seq":seq} });

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
    
    const edulist = () => {        
        history('/learning/EduInfoList');
    }

    const updateBbs = () => {
        history("/bbsupdate/" + bbs.seq);
    }


    const download = async () => {
        let filename = "file.txt";
    
        const url = "http://localhost:3000/fileDownload?filename=" + filename;
    
        // a tag 를 생성 + 자동실행
        /*
        const download = document.createElement('a');   // <a href='' 
        download.setAttribute('href', url);
        download.setAttribute('download', filename);
        download.setAttribute('type', 'application/json');
        download.click();
        */
    
        // react에서 window를 붙여줘야 한다
        window.location.href = url;
      }


    // const handleDelete = (seq) => {
    //     // 게시물 삭제 로직
    //     // 삭제할 게시물의 postId를 받아와서 삭제 로직을 구현합니다.
    //     const updatedPosts = bbs.filter(post => post.seq !== seq);
    //     setBbs(updatedPosts);
    //   }

    // // login한 id와 작성자 id와 같을 시에는 버튼을 보여준다
    // function UpdateButtonLoad(){
    //     let str = localStorage.getItem('login');
    //     let login = JSON.parse(str);

    //     if(login.writer !== bbs.writer){
    //         return ""
    //     }
    //     return (
    //         <span>
    //             &nbsp;<button type="button" onClick={() => handleDelete(bbs.seq)} className="btn btn-primary">삭제하기</button>
    //             &nbsp;<button type="button" onClick={updateBbs} className="btn btn-primary">글 수정</button>
    //         </span>
                        
    //     )
    // }

    return (
        <div style={{margin:"30px 150px 50px 150px", textAlign:"left", padding:"15px", fontSize:"17px"}}>
            <h2>교육 정보 상세 보기</h2>
            <hr/>
            <table className="table table-striped table-sm">
            <colgroup>
                <col style={{width: '150px'}}/>
                <col style={{width: '500px'}}/>
            </colgroup>
            <tbody>
            <tr>
                <th>제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr>
                <th>과목</th>
                <td style={{ textAlign:"left" }}>{bbs.subject}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td style={{ textAlign:"left" }}>{bbs.writer}</td>
            </tr>
            <tr>
                <th>작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            <tr>	
                <th>내용</th>
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <button onClick={download} ><FontAwesomeIcon icon="fa-regular fa-folder-open" /> 첨부파일</button>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left" }}>{bbs.content}</pre>
                </td>
            </tr>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button style={{width:"100px", height:"42px"}} type="button" onClick={edulist} className="btn btn-primary">목록으로</button>
            </div>
            
            {/* <UpdateButtonLoad /> */}
        
        </div>
    )
}

export default EduInfoDetail;

