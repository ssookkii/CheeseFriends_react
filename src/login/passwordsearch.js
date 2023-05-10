import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./css/login.css";
import "./css/login2.css";

import logo from './img/cheesefriendslogo.png';

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
            alert("인증 번호를 확인해주세요")
            setPhone_publiccheck("인증 번호를 확인해주세요");
        }else{
            alert("인증 완료되었습니다");
            setPhone_publiccheck("인증 완료되었습니다");
            setPhone_publicch(false);
            passwordsearchbtn();
        }
    }

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(()=>{
        setPhone_publiccheck("");
    },[phone])

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
        }
        // else if(phone_publiccheck !== "인증 완료되었습니다" ){
        //     setPhone_publica(false);
        //     alert("인증번호를 입력해주세요");
        //     return;
        // }

        
    
        axios.post("http://localhost:3000/idcheck", null, { params:{ "id":id }})
        .then(function(resp){
            if(resp.data === "YES"){
                alert("없는 아이디입니다. 아이디 확인 또는 아이디 찾기를 진행해주세요");
                return;
            }else{
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

    // Login 세트 1
    const inputs = document.querySelectorAll(".input");

    function addcl(){
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
      console.log("addcl 작동");
    }
    
    function remcl(){
      let parent = this.parentNode.parentNode;
      if(this.value == ""){
        parent.classList.remove("focus");
      }
      console.log("remcl 작동");
    }
    
    inputs.forEach(input => {
        input.addEventListener("focus", addcl);
        input.addEventListener("blur", remcl);
    });


    return(
        <div>  {/*  Login css 세트 1 */}
        <div style={{textAlign:"center", alignItems:"center"}}>
            
            <div class="container2">

                <div class="login-content2">
              
                    <img src={logo} style={{width:"300px", height:"100px", marginLeft:"auto", marginRight:"auto"}}/>
                    <br/><br/><br/>
                
                    <div className="idsea">비밀번호찾기</div>
                    <br/><br/><br/>
                    
                        {findida === true
                        ?<div></div>
                        :<div>
   
                        {/* 아이디 입력칸 */}
                        <div class="input-div one">
                            <div class="i">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="div">
                                <h5>아이디</h5>
                                {ida === true 
                                    ? <input  type="text" class="input" style={{ width:"230px"}} value={id} onChange={(e)=>setId(e.target.value)}  />
                                    :  <input  type="text" class="input" style={{  width:"230px"}} value={id} onChange={(e)=>setId(e.target.value)} />}
                            </div>
                        </div>
                        {ida === true 
                            ?<div></div>
                            :<div>{ idc === "양식에 맞는 아이디입니다" 
                                ? <div><div class="inputtrue" >{idc}</div></div>
                                : <div><div class="inputfalse" >{idc}</div></div>} 
                        </div>}


                        {/* 휴대폰 번호 입력칸 */}
                        <div class="input-div pass">
                            <div class="i"> 
                                <i class="material-symbols-outlined">phone_iphone</i>
                            </div>
                            <div class="div">
                                <h5>휴대폰</h5>
                                {phonea === true 
                                    ?  <input type="text" class="input" style={{ width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)}/>
                                    :  <input type="text" class="input" style={{ borderColor:"red", width:"230px"}} value={phone} onChange={(e)=>setPhone(e.target.value)} />}
                            </div>
                        </div>
                        {phonea === true 
                            ?<div></div>
                            :<div>{ phonec === "올바르게 입력되었습니다" 
                                ? <div><div class="inputtrue" >{phonec}</div></div>
                                : <div><div class="inputfalse" >{phonec}</div></div>} 
                        </div>}

                        {/* 인증번호 입력칸 */}
                        <div>
                            <div class="input-div pass">
                                <div class="i"> 
                                    <i class="fas fa-lock"></i>
                                </div>
                                <div class="div">
                                    <h5>인증번호</h5>
                                    {phone_publica === true 
                                        ?  <input type="text" class="input" style={{ width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)} />
                                        :  <input type="text" class="input" style={{ borderColor:"red", width:"230px"}}  value={phone_public} onChange={(e)=>setPhone_public(e.target.value)}  />}
                                </div>
                            </div>
                        </div>
                        { phone_publiccheck === "인증 완료되었습니다" 
                            ? <div></div>
                            : <div><div class="inputfalse" >{phone_publiccheck}</div></div>} 
                       
                        {/* 버튼 칸 */}
                        {idc === "양식에 맞는 아이디입니다" 
                            ?<div> 
                                { phonec === "올바르게 입력되었습니다" 
                                ? <div>
                                     { findida === true
                                        ?<div></div>
                                        :<div><button  class="loginbtn2" onClick={sendPhone}>인증번호 발송</button></div>} </div>
                                : <div><button  class="loginbtnfalse" disabled="false" onClick={sendPhone}>휴대폰 번호를 입력해주세요</button></div>}</div>
                            :<div><button  class="loginbtnfalse" disabled="false" onClick={sendPhone}>아이디를 입력해주세요</button></div>}
                        {phone_publicch === true
                        ?<div><button class="loginbtn2" onClick={sendphonecheck} >인증하기</button></div>
                        :<div></div>}
                        </div>}
                     
                        {/* 인증 완료 후 비밀번호 새로 설정 */}
                        <br/>
                        { findida === true
                            ? <div>
                                <div class="idsea">
                                    <div>{findidtext}</div> 
                                </div>
                                <br/><br/>

                                {/* 새 비밀번호 입력칸 */}
                                <div>
                                    <div class="input-div pass">
                                        <div class="i"> 
                                            <i class="fas fa-lock"></i>
                                        </div>
                                        <div class="div">
                                            <h5>새 비밀번호</h5>
                                            {passworda === true 
                                                ?  <input type="password" class="input" style={{ width:"230px"}}  value={password} onChange={(e)=>setPassword(e.target.value)} />
                                                :  <input type="password" class="input" style={{ borderColor:"red", width:"230px"}}  value={password} onChange={(e)=>setPassword(e.target.value)}  />}
                                        </div>
                                    </div>
                                </div>
                                {passworda === true 
                                ?<div></div>
                                :<div>{ passwordc === "안전한 비밀번호 입니다" 
                                    ? <div><div class="inputtrue" >{passwordc}</div></div>
                                    : <div><div class="inputfalse" >{passwordc}</div></div>} 
                                </div>}

                                {/* 새 비밀번호 확인 입력칸 */}
                                <div>
                                    <div class="input-div pass">
                                        <div class="i"> 
                                            <i class="fas fa-lock"></i>
                                        </div>
                                        <div class="div">
                                            <h5>비밀번호 확인</h5>
                                            {passwordChecka === true 
                                                ?  <input type="password" class="input" style={{ width:"230px"}}  value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)} />
                                                :  <input type="password" class="input" style={{ borderColor:"red", width:"230px"}}  value={passwordcheck} onChange={(e)=>setPasswordcheck(e.target.value)}  />}
                                        </div>
                                    </div>
                                </div>
                                {passwordChecka === true 
                                ?<div></div>
                                :<div>{ passwordcheckc === "비밀번호가 동일합니다" 
                                    ? <div><div class="inputtrue" >{passwordcheckc}</div></div>
                                    : <div><div class="inputfalse" >{passwordcheckc}</div></div>} 
                                </div>}

                                <button class="loginbtn2" onClick={passwordchangebtn}>비밀번호 재설정</button>
                            </div>
                            :<div></div>
                        }
                    <br/><br/>
                 
                
                    <div>
                    <button class="btn2" onClick={login}>로그인 화면으로</button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button class="btn2" onClick={idsearch}>아이디찾기</button>
                    </div>
                    </div>
              </div>
        </div>

        </div>
    )

}

export default Passwordsearch;
