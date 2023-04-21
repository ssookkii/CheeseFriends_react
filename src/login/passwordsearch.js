import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";


function Passwordsearch(){

    function idsearch(){
        window.location.href = "/idsearch"
    }
    
    function login(){
        window.location.href = "/";
    }


    const [id, setId] = useState('');
    const [idc, setIdc] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState("");
    const [passworda, setPassworda] = useState(true);
    const [passwordChecka, setPasswordchecka] = useState(true);

    let history = useNavigate();
    
    // 아이디 정규식
    const idRegEx = /^[a-zA-z0-9]{6,12}$/

    const idregCheck = (id) => {
        if(id.match(idRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setIdc("아이디 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setIdc("양식에 맞는 아이디입니다");
            return;
        }
    }

    useEffect(()=>{
            idregCheck(id);        
    }, [id]) 
    


    // 핸드폰 번호 정규식
    const phoneRegEx = /^01(?:0|1|[6-9])-(?:\d{4}|\d{4})-\d{4}$/
    const [phonec, setPhonec] = useState("");

    const phoneCheck = (phone) => {
        if(phone.match(phoneRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPhonec("형식에 맞게 다시 입력해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPhonec("올바르게 입력되었습니다");
        }
    }

    useEffect(()=>{
        phoneCheck(phone);
        if (phone.length === 10) {
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
          }
          if (phone.length === 13) {
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
          }
    },[phone])

     // 휴대폰 인증번호 발송
     const [phone_publicc, setPhone_publicc] = useState("");
     const [phone_publicch, setPhone_publicch] = useState(false);
 
     function sendPhone(){
         axios.post("http://localhost:3000/phoneAuth", null, { params:{ "phone":phone }})
         .then(function(resp){
             setPhone_publicc("");
             setPhone_publiccheck("");
             alert("인증번호를 보냈습니다");
             setPhone_publicch(false);
             if(resp.data !== null){
                 setPhone_publicc(resp.data); 
                 setPhone_publicch(true);
             }else{
                 alert("휴대폰 번호를 확인해주세요");
             }
         })
         .catch(function(err){
             alert("err");
         })
     }

     // 휴대폰 인증번호 체크
    const [phone_publiccheck, setPhone_publiccheck] = useState("");

    function sendphonecheck(){
        if(phone_publicc.toString().trim() !== phone_public.toString().trim()){
            setPhone_publiccheck("인증 번호를 확인해주세요");
        }else{
            setPhone_publiccheck("인증 완료되었습니다");
            setPhone_publicch(false);
        }
    }

    // 비밀번호 정규식
    const passwordRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/
    const [passwordc, setPasswordc] = useState("");

    const passwordCheck = (password) => {
        if(password.match(passwordRegEx)===null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setPasswordc("비밀번호 형식을 확인해주세요");
            return;
        }else{ // 맞을 경우 출력
            setPasswordc("안전한 비밀번호 입니다");
        }
    }

    useEffect(()=>{
        passwordCheck(password);
    },[password])
    

    // 비밀번호 확인 체크
    const [passwordcheckc, setPasswordcheckc] = useState("");

    const passwordDoubleCheck = (password, passwordcheck) => {
            if(password !== passwordcheck){
                setPasswordcheckc("비밀번호가 다릅니다");
                return;
            }else{
                setPasswordcheckc("비밀번호가 동일합니다");
            }
    }

    useEffect(()=>{
        passwordDoubleCheck(password, passwordcheck);
    },[password, passwordcheck])

    // 비밀번호 찾기 함수
    const [ida, setIda] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);
    const [passwordchangeon, setPasswordchangeon] = useState(false);

    const [findid, setFindid] = useState("");
    const [regidate, setRegidate] = useState("");
    const [findida, setFindida] = useState(false);
    const [findidtext, setFindidtext] = useState("아이디를 찾지 못했습니다");

    function passwordsearchbtn(){

        // 유효검사
        setIda(true);
        setPhonea(true); 
        setPhone_publica(true);

        if(idc !== "양식에 맞는 아이디입니다"){
            setIda(false);
            alert("아이디를 입력해주세요");
            return;
        }else if(phonec !== "올바르게 입력되었습니다"){
            setPhonea(false);
            alert("휴대폰 번호를 입력해주세요");
            return;
        }else if(phone_publiccheck !== "인증 완료되었습니다" ){
            setPhone_publica(false);
            alert("인증번호를 입력해주세요");
            return;
        }
    
        axios.post("http://localhost:3000/idchecktwo", null, { params:{ "id":id, "phone":phone }})
        .then(function(resp){
            if(resp.data === "YES"){
                alert("본인 명의의 아이디와 휴대폰 번호인지 확인해주세요");
            }else{
                console.log("id : " + resp.data);
                alert("본인 확인 되었습니다. 비밀번호를 새로 설정해주세요")
                setFindidtext("비밀번호를 새로 설정해주세요")
                setFindida(true)
                setPasswordchangeon(true);
            }
        })
        .catch(function(err){
            alert("err");
        })
    }

    // 비밀번호 재설정
    function passwordchangebtn(){
        setPassworda(true);
        setPasswordchecka(true);

        if(passwordc !== "안전한 비밀번호 입니다" ){
            setPassworda(false);
            alert("비밀번호를 입력해주세요");
            return;
        }else if(passwordcheckc !== "비밀번호가 동일합니다"){
            setPasswordchecka(false);
            alert("동일한 비밀번호를 입력해주세요");
            return;
        }
        

        // 보내자
        axios.post("http://localhost:3000/updatepassword", null, 
        { params:{  "id":id, 
                    "password":password, 
                  }})
        .then(function(resp){
            if(resp.data === "YES"){
                alert("정상적으로 변경되었습니다");
                history("/");      // 이동(link)
            }else{
                alert("변경되지 않았습니다");
            }
            
        })
        .catch(function(err){
            alert("err");
            console.log(err);
        })

    }


    return(
        <div>

            <h1>비밀번호 찾기</h1>
            <br/><br/><br/>
            <table border="1" align="center">
                <colgroup>
                    <col width="150"/><col width="150"/>
                </colgroup>
                <tr>
                    <td >
                    <label for="idsearch">아이디찾기</label>
                    </td>
                    <td style={{backgroundColor:"grey"}}>
                        비밀번호찾기</td>
                </tr>
            </table>
            <br/><br/>
            {passwordchangeon === false
                ?<table border="1" align="center">
                    <colgroup>
                        <col width="120"/><col width="250"/><col width="150"/>
                    </colgroup>
                    <tr>
                        <td align="left">아이디</td> 
                        <td align="left">
                        {ida === true 
                                ? <input style={{ width:"230px"}} value={id} onChange={(e)=>setId(e.target.value)} placeholder="아이디를 입력해주세요" />
                                : <input style={{ borderColor:"red", width:"230px"}} value={id} onChange={(e)=>setId(e.target.value)} placeholder="아이디를 입력해주세요" />}
                        </td>
                        <td>
                            { idc === "양식에 맞는 아이디입니다" 
                                ? <div style={{ fontSize:"5px", color:'blue' }}>{idc}</div>
                                : <div style={{ fontSize:"5px", color:'red' }}>{idc}</div>} 
                        </td>
                    </tr>
                    <tr>
                        <td align="left">핸드폰</td>
                        <td align="left">
                        {phonea === true 
                                ?  <input style={{ width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />
                                :  <input style={{ borderColor:"red", width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="휴대폰 번호를 입력해주세요" />}
                    
                        </td>
                        <td>
                        { phonec === "올바르게 입력되었습니다" 
                            ? <div style={{ fontSize:"5px", color:'blue' }}>{phonec}<button onClick={sendPhone}>인증번호 발송</button></div>
                            
                            : <div style={{ fontSize:"5px", color:'red' }}>{phonec}<button disabled="false" onClick={sendPhone}>인증번호 발송</button></div>}
                        
                        </td>
                    </tr>
                    <tr>
                    <td align="left">인증번호</td> 
                    <td align="left">
                        {phone_publica === true 
                                ?  <input style={{ width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />
                                :  <input style={{ borderColor:"red", width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)} placeholder="인증번호를 입력해주세요" />}
                    </td>
                    <td>
                        { phone_publiccheck === "인증 완료되었습니다" 
                            ? <div style={{ fontSize:"5px", color:'blue' }}>{phone_publiccheck}</div>
                            
                            : <div style={{ fontSize:"5px", color:'red' }}>{phone_publiccheck}</div>}
                        { phone_publicch === true 
                            ? <div><button onClick={sendphonecheck}>인증하기</button></div>
                            
                            : <div><button disabled="false" onClick={sendphonecheck}>인증하기</button></div>}
                        
                    </td>
                    </tr>
                </table>
                :   <table border="1" align="center">
                        <colgroup>
                            <col width="120"/><col width="250"/>
                        </colgroup>
                        <tr>
                            <td align="left">아이디</td> 
                            <td align="left">
                            <input style={{ width:"230px"}} value={id} readOnly="readOnly"/>
                            </td>
                        </tr>
                        <tr>
                            <td align="left">핸드폰</td>
                            <td align="left">
                                <input style={{ width:"230px"}} value={phone} readOnly="readOnly"/>
                            </td>
                        </tr>
                    </table>
            }
            <br/><br/><br/>
            { findida === true
                ? <div><input value= {findidtext} style={{ width:"230px"}}  />
                <br/><br/>
                <table border="1" align="center">
                    <colgroup>
                        <col width="120"/><col width="250"/><col width="150"/>
                    </colgroup>
                    <tr>
                        <td align="left">새 비밀번호</td>
                        <td align="left">
                            {passworda === true 
                            ? <input style={{ width:"230px"}} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />
                            : <input style={{ borderColor:"red", width:"230px"}} value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="숫자,영문자,특수문자 포함 8자 이상" />}
                        </td>
                        <td align="left">
                            { passwordc === "안전한 비밀번호 입니다" 
                                ? <div style={{ fontSize:"5px", color:'blue' }}>{passwordc}</div>
                                : <div style={{ fontSize:"5px", color:'red' }}>{passwordc}</div>}
                        </td>
                    </tr>
                    <tr>
                        <td align="left">비밀번호 확인</td>
                        <td align="left">
                            {passwordChecka === true 
                                ?  <input style={{ width:"230px"}} value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />
                                :  <input style={{ borderColor:"red", width:"230px"}} value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} placeholder="위와 동일한 비밀번호 입력" />}
                        </td>
                        <td align="left">
                            { passwordcheckc === "비밀번호가 동일합니다" 
                                ? <div style={{ fontSize:"5px", color:'blue' }}>{passwordcheckc}</div>
                                : <div style={{ fontSize:"5px", color:'red' }}>{passwordcheckc}</div>}
                        </td>
                    </tr>
                </table>
                </div>
                :<table>
                <tr></tr>
                </table>
            }
            
            <br/><br/>
            <button id="idsearch" onClick={idsearch} style={{display:"none"}}></button>
            { findida === true
                ?<button onClick={passwordchangebtn}>비밀번호 재설정</button>
                :<button onClick={passwordsearchbtn}>비밀번호 찾기</button>}
                &nbsp;
            <button onClick={login}>로그인 화면으로</button>
            
        </div>
    )

}

export default Passwordsearch;
