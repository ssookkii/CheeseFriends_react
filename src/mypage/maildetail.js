import React, { useEffect, useState, } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link, useParams } from 'react-router-dom'

import axios from "axios";


function Maildetail(){
    const [mail, setMail] = useState();
    // 파일 미리보기
    const [filereceive, setFilereceive] = useState("");

    const navigate = useNavigate();
        
    function receivemaillist(){
        window.location.href = "/testmain/email";
    }

    // 답장하기
    function answer(){
        // navigate("/testmain/sendemail", { state: { value: mail.sender } });
        window.location.href = `/testmain/sendemail/${mail.sender}`;
    }



    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    // console.log("seq : " + params.seq);

    const mailData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getmail', { params:{"seq":seq} });

        // console.log("mail:" + JSON.stringify(response.data));
        setMail(response.data);

        // console.log("filename : " + response.data.filename);
        setFilereceive("http://localhost:3000/mailfile/" + response.data.filename);

        setLoading(true);   // 여기서 rendering 해 준다
    }

    useEffect(()=>{
        mailData(params.seq);
    }, [params.seq])

    if(loading === false){
        return <div>Loading...</div>
    }



    // 파일 다운로드
    const download = async() => {
        let filename = mail.filename;

        // console.log(filename);
        const url = "http://localhost:3000/fileDownload?filename=" + filename;

        // a tag 를 생성 + 자동실행
        // const download = document.createElement('a'); // <a href=''>
        // download.setAttribute('href', url)
        // download.setAttribute('download', filename);
        // download.setAttribute('type', 'application/json');
        // download.click();


        // react에서는 window를 붙여줘야 한다.
        window.location.href = url;

    }

   
    


    return (
        <div>
            <h1>쪽지 상세보기</h1>
            <table className="table table-striped table-sm">
            <colgroup>
                <col style={{width: '150px'}}/>
                <col style={{width: '500px'}}/>
            </colgroup>
            <tbody>
            <tr>
                <th>보낸사람</th>
                <td style={{ textAlign:"left" }}>{mail.sender}</td>
            </tr>

            <tr>
                <th>받은시간</th>
                <td style={{ textAlign:"left" }}>{mail.wdate}</td>
            </tr>
            <tr>
                <th>파일</th>
                {mail.filename === null || mail.filename === ""
                ?<td style={{ textAlign:"left" }}>{mail.filename}</td>
                :<td style={{ textAlign:"left" }}>{mail.filename}<button onClick={download}>다운로드</button></td>
                }
            </tr>
            <tr>
                <th>파일미리보기</th>
                {mail.filename === null || mail.filename === ""
                ?<td></td>
                :<td align="left"><img src={filereceive} width="100" height="100"/></td>}
            </tr>
            <tr>	
                <td colSpan="2" style={{ fontSize:'22px', fontWeight: 'bold', textAlign:"left" }}>{mail.title}</td>
            </tr>
            <tr>	
                <td colSpan="2" style={{ backgroundColor:'white' }}>
                    <pre id="content" style={{ fontSize:'20px', fontFamily:'고딕, arial', backgroundColor:'white', textAlign:"left" }}>{mail.content}</pre>
                </td>

            </tr>
            </tbody>
            </table>

            <button onClick={receivemaillist}>이전으로</button>
            <button onClick={answer}>답장하기</button>

        </div>
    )

}

export default Maildetail;
