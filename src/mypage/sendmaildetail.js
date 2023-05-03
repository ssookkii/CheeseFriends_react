import React, { useEffect, useState, } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link, useParams } from 'react-router-dom'

import axios from "axios";
import Deletemodal from "./deletemodal";


function Sendmaildetail(){
     // 모달 팝업
     const [modalOpen, setModalOpen] = useState(false);
     const [seq, setSeq] = useState();

     const openModal = () => {
         setModalOpen(true);
     };
 
     const closeModal = () => {
         setModalOpen(false);
     };
 
     const yescloseModal = () => {
        setModalOpen(false);
   
        axios.get("http://localhost:3000/senddeleteMail", { params:{ "seq":params.seq}})
        .then(function(resp){
            alert("발송취소 되었습니다");
            history('/testmain/sendemaillist');
        })
        .catch(function(err){
            alert('err');
        }) 
         
     
     };

     // 아이디
    let history = useNavigate();
    

    // login 되어 있는지 검사
    useEffect (()=>{
       let local = localStorage.getItem("login");
       let login = JSON.parse(local);
       if(login !== undefined){
           setId(login.id);
       }else{
           alert('login해 주십시오');
           history('/');
   }

   },[history]);

   let local = localStorage.getItem("login");
   let login = JSON.parse(local);

   
   const [id, setId] = useState(login.id);

   

    const [mail, setMail] = useState();
    // 파일 미리보기
    const [filereceive, setFilereceive] = useState("");

    const navigate = useNavigate();
        
    function sendemaillist(){
        window.location.href = "/testmain/sendemaillist";
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
        const response = await axios.get('http://localhost:3000/getsendmail', { params:{"seq":seq} });

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
                <th>받는사람</th>
                <td style={{ textAlign:"left" }}>{mail.receiver}</td>
            </tr>

            <tr>
                <th>보낸시간</th>
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

            <button onClick={sendemaillist}>이전으로</button>
            <React.Fragment>
            <button onClick={openModal}>발송취소</button>
            <Deletemodal open={modalOpen} close={closeModal} yesclose={yescloseModal} header="발송취소">
            <main>  
                발송취소 하시겠습니까?
            </main>        
            </Deletemodal>
            </React.Fragment>

        </div>
    )

}

export default Sendmaildetail;
