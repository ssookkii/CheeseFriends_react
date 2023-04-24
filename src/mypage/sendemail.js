import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import axios from "axios";
//import teacher from './img/teacher.jpg';



function Sendemail(){

    const [receiver, setReceiver] = useState("");
    const [title, setTitle] = useState("");
    const [filename, setFilename] = useState("");
    const [content, setContent] = useState("");


    // 파일 미리보기
    const [resp, setResp] = useState();
    const [imgFile, setImgFile] = useState("");
    const imgRef = useRef();    // useRef.current

    function imageLoad(){
        const file = imgRef.current.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setImgFile(reader.result);
        }
    }

    // 이름으로 아이디 검색
    // const [educheck, setEducheck] = useState(false);
    // const [receivermatching, setReceivermatching] = useState([]);


    // function receivermatch(){
    //     setEducheck(false);

    //     setReceivermatching("");

    //     if(receiver.length > 5){
    //         axios.get("http://localhost:3000/receiversearch", { params:{ "edu_name":edu_name}})
    //         .then(function(resp){
    //             const data = resp.data;

    //             setEdulistmatching(data);

    //             const element = document.getElementById("edulist");

    //             while (element.firstChild) {
    //                 element.removeChild(element.firstChild);
    //             }

    //             for (let i = 0; i < resp.data.length; i++) {
    //                 console.log("resp.data[i].eduName : " + resp.data[i].eduName);
    //                 console.log("resp.data[i].eduCode : " + resp.data[i].eduCode);

    //                 let op = document.createElement("option");
    //                 op.innerText = resp.data[i].eduName;
    //                 op.setAttribute("id", resp.data[i].eduCode);
    //                 element.appendChild(op);
    //             }
    //         })
    //         .catch(function(err){
    //             alert(err);
    //         })
    //     }
    // } 

    // useEffect(()=>{
    //        educodecheck(edu_name);        
    // }, [edu_name]) 

    // const [edu_codes, setEdu_codes] = useState("");

    // function educodecheckbtn(){
    //     if(edulistmatching.length > 0){
    //         for (let i = 0; i < edulistmatching.length; i++) {
    //             if(edulistmatching[i].eduName === edu_name){
    //                 setEdu_codes(edulistmatching[i].eduCode)
    //             } 
    //         } 
    //     }else{
    //         setEdu_codes("");
    //     }
    // }

    // 쪽지 보내기

  

    return(
        <div>
            <div>
                <h1>쪽지 보내기</h1>
                <br/>
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/><col width="150"/><col width="150"/>
                    </colgroup>
                    <tr>
                        <td>
                            <Link to="/testmain/email">받은 쪽지함</Link>
                        </td>
                        <td>
                            <Link to="sendemaillist">보낸 쪽지함</Link>
                        </td>
                        <td style={{backgroundColor:"grey"}}>쪽지 보내기</td>
                    </tr>
                </table>
            

                <br/>
                <table border="1" align="center"> 
                    <colgroup>
                        <col width="100" /><col width="200" /><col width="100" />
                    </colgroup>
                    <tr>
                        <td>받는사람</td>
                        <td align="left" colSpan="2">
                            <input style={{ width:"230px"}} value={receiver} onChange={(e)=>setReceiver(e.target.value)} ></input>
                        </td>
                    </tr>
                    <tr>
                        <td>선택</td>
                        <td>
                            <table border="1" className="subplus" id="subplus">
                                <colgroup>
                                    <col width="50" /><col width="200" /><col width="150" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <th></th><th>아이디</th><th>이름</th>
                                    </tr>
                                </thead>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td>제목</td>
                        <td align="left" colSpan="2">
                            <input style={{ width:"230px"}} value={title} onChange={(e)=>setTitle(e.target.value)}></input>
                        </td>
                    </tr>
                    <tr>
                        <td>파일</td>
                        <td >
                            <input style={{ width:"230px"}} type="file" name="uploadFile" onChange={imageLoad} ref={imgRef}></input>
                        </td>
                        <td>
                            <button>첨부</button>
                        </td>
                    </tr>

                    <tr>
                        <td>미리보기</td>
                        <td colSpan="2">
                            <img style={{ width:"230px"}} src={imgFile} alt=""/>
                        </td>
                    </tr>

                    <tr>
                        <td>내용</td>
                        <td align="left" colSpan="2">
                            <textarea style={{ width:"230px", height:"200px"}} value={content} onChange={(e)=>setContent(e.target.value)} ></textarea>
                        </td>
                    </tr>

                </table>

                <br/><br/>
                <button>보내기</button>

            </div>
        </div>
    )

}

export default Sendemail;
