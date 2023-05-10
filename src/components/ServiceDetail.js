import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';


export default function ServiceDetail(){
    let history = useNavigate();

    const [bbs, setBbs] = useState();

    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    console.log(params);
    console.log(params.seq);

    const bbsData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getService', { params:{"seq":seq} });

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
    
    const servlist = () => {        
        history('/service/ServiceList');
    }


    return (
        <div style={{margin:"30px 150px 50px 150px", textAlign:"left", padding:"15px", fontSize:"17px"}}>
            <h2>수업 질문방</h2>
            <hr/>
            <table className="table table-striped table-sm">
            <tbody>
            <tr>
                <th>제목</th>
                <td style={{ textAlign:"left" }}>{bbs.title}</td>
            </tr>
            <tr>
                <th >카테고리</th>
                <td style={{ textAlign:"left" }}>{bbs.topic}</td>
            </tr>
            <tr>
                <th>작성자</th>
                <td style={{ textAlign:"left" }}>{bbs.writer}</td>
            </tr>
            <tr >
                <th >작성일</th>
                <td style={{ textAlign:"left" }}>{bbs.regdate}</td>
            </tr>
            <tr>	
                <th>내용</th>
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left" }}>{bbs.content}</pre>
                </td>
            </tr>
            </tbody>
            </table>
            <div style={{textAlign:"center"}}>
                <button style={{width:"100px", height:"42px", marginTop:"-5px"}} type="button" className="btn btn-primary">
                <Link to={`/cheesefriends/service/ServiceAnswer/${bbs.seq}`} style={{textDecoration:"none", color:"white"}}>답변하기</Link></button>
                <button style={{width:"100px", height:"42px"}} type="button" onClick={servlist}>목록으로</button>
            </div>
            
            {/* <UpdateButtonLoad /> */}
        
        </div>
    )
}


