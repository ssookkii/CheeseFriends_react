import React, { useEffect, useState, } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link, useParams } from 'react-router-dom'

import axios from "axios";

import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Deletemodal from "./deletemodal";
import styles from "../components/asset/css/adminWrite.module.css"
import detail from "../components/asset/css/mypage.module.css"

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
    const [extension, setExtension] = useState("");

    const navigate = useNavigate();
        
    function sendemaillist(){
        window.location.href = "/cheesefriends/testmain/sendemaillist";
    }

    // 답장하기
    function answer(){
        // navigate("/testmain/sendemail", { state: { value: mail.sender } });
        window.location.href = `/cheesefriends/testmain/sendemail/${mail.sender}`;
    }



    // 데이터를 모두 읽어 들일 때까지 rendering을 조절하는 변수
    const [loading, setLoading] = useState(false);

    let params = useParams();
    // console.log("seq : " + params.seq);

    const mailData = async(seq) => {
        const response = await axios.get('http://localhost:3000/getsendmail', { params:{"seq":seq} });

        // console.log("mail:" + JSON.stringify(response.data));
        setMail(response.data);
        setExtension(response.data.filename);

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
        <div className={detail.mailDetailWrap}>
            <button onClick={sendemaillist} className={detail.back}><em><FontAwesomeIcon icon={faAngleLeft} /></em>보낸쪽지함</button>
            <div>
                <div className={`${styles.InputBox} ${detail.maildetail} ${detail.maildetailTitle}`}>
                    <p className={detail.mailTitle}>{mail.title}</p>
                </div>
                <div className={`${styles.InputBox} ${detail.maildetail}`}>
                    <span>보낸사람</span>
                    <span>{mail.receiver}</span>
                </div>
                <div className={`${styles.InputBox} ${detail.maildetail}`}>
                    <span>수신일자</span>
                    <span>{mail.wdate}</span>
                </div>
            {mail.filename === null || mail.filename === "" ?
                <></>
                :
                <div className={`${styles.InputBox} ${detail.maildetail}`}>
                    <span>첨부파일</span>
                    {mail.filename === null || mail.filename === ""
                    ?<span>{mail.filename}</span>
                    :<span>{mail.filename}<button onClick={download}>다운로드</button></span>
                    }
                </div>
            }
            {
                mail.filename.substr(extension.indexOf('.')+1) === "jpg" || mail.filename.substr(extension.indexOf('.')+1) === "png" || mail.filename.substr(extension.indexOf('.')+1) === "jpeg"
                ? 
                <div className={`${styles.InputBox} ${detail.maildetail}`}>
                    <span>미리보기</span>
                    <span><img src={filereceive} width="100" height="100"/></span>
                </div>
                :
                <></>
            }
            <div className={`${styles.InputBox} ${styles.flex} ${detail.maildetail} ${detail.mailcontent}`}>
                    {/* <span>내용</span> */}
                    <p id="content">{mail.content}</p>
                </div>
            </div>

            <React.Fragment>
            <button onClick={openModal} className={styles.answerBtn}>발송취소</button>
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
