import React, { useState, useEffect } from 'react';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';

import styles from './asset/css/adminWrite.module.css'

function MailDetailAdmin(){
    let params = useParams();
    const [mailDetail, setMailDetail] = useState([]);
    console.log(mailDetail);

    function getMailDetail(wdate){
        axios.get("http://localhost:3000/getSendMailDetail", { params:{"wdate":wdate} })
        .then(function(resp){
            console.log(resp.data);
            setMailDetail(resp.data);
        })
        .catch(function(err){
            alert(err);
        })
        
    }
    useEffect(function(){
        getMailDetail(params.wdate);
    },[params.wdate]);

    const download = async() => {
        let filename = mailDetail.filename;

        // console.log(filename);
        const url = "http://localhost:3000/fileDownload?filename=" + filename;

        window.location.href = url;

    }


    return(
        <div className={styles.wrap}>
            <div className={styles.qnaWrap}>
                <h2 className={styles.title}>보낸쪽지</h2>
                <div className={styles.InputBox}>
                    <span>수신자</span>
                    <span>{mailDetail.receiver}</span>
                </div>
                <div className={styles.InputBox}>
                    <span>발신자</span>
                    <span>{mailDetail.sender}</span>
                </div>
                <div className={styles.InputBox}>
                    <span>작성시간</span>
                    <span>{mailDetail.wdate}</span>
                </div>
                {mailDetail.filename === null || mailDetail.filename === ""
                    ?<></>
                    :<div className={styles.InputBox}>
                        <span>첨부파일</span>
                        <span>{mailDetail.filename}<button onClick={download} className={styles.downBtn}>다운로드</button></span>
                    </div>
                }
                <div className={`${styles.InputBox} ${styles.bottmline}`}>
                    <span>제목</span>
                    <span>{mailDetail.title}</span>
                </div>
                <div className={`${styles.InputBox} ${styles.flex}`}>
                    <span>내용</span>
                    <p className={styles.width}>{mailDetail.content}</p>
                </div>
            </div>
            <Link to="/adminpage/sendmailmanage">목록으로</Link>
        </div>
    )
}
export default MailDetailAdmin