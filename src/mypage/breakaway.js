import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";
import Okmodal from "./okmodal";


function Breakaway(){
    const [id, setId] = useState('');
    const [idc, setIdc] = useState("");
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");
    const [password, setPassword] = useState('');
    const [passwordcheck, setPasswordcheck] = useState("");
    const [passworda, setPassworda] = useState(true);
    const [passwordChecka, setPasswordchecka] = useState(true);
    const [modalOpen3, setModalOpen3] = useState(false);

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
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    

    function breakoutbtn(){

        // 유효검사
        setPhonea(true); 
        setPhone_publica(true);

        if(phonec !== "올바르게 입력되었습니다"){
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
                alert("본인 확인 되었습니다")
                openModal3();
            }
        })
        .catch(function(err){
            alert("err");
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

    // 모달 팝업
    const openModal3 = () => {
        setModalOpen3(true);
    };

    const closeModal3 = () => {
        setModalOpen3(false);
    };

    function yescloseModal3 (){
        setModalOpen3(false);

        axios.get("http://localhost:3000/breakoutuser", { params:{ "id":id, "auth":login.auth}})
        .then(function(resp){
            if(resp.data === "YES"){
                alert("회원 탈퇴 완료되었습니다");
                history('/');
            }else if(resp.data === "수강학습남음"){
                alert("수강중인 학습이 남아있습니다");
            }else if(resp.data === "수업학습남음"){
                alert("수업중인 학습이 남아있습니다");
            }
        })
        .catch(function(err){
            alert('err');
        }) 

    };

    return(
        <div>
           
            {/*  Login css 세트 1 */}
                <div style={{textAlign:"center", alignItems:"center"}}>
                    
                    <div class="container3">
                        <div class="login-content2">

                            <div className="idsea">회원탈퇴</div>
                            <br/><br/><br/>
                            
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
                                    { phonec === "올바르게 입력되었습니다" 
                                    ? <div><button  class="loginbtn2" onClick={sendPhone}>인증번호 발송</button></div>
                                    : <div><button  class="loginbtnfalse" disabled="false" onClick={sendPhone}>휴대폰 번호를 입력해주세요</button></div>}
                                    
                                    {phone_publicch === true
                                    ?<div><button class="loginbtn2" onClick={sendphonecheck} >인증하기</button></div>
                                    :<div></div>}

                                    <br/>
                                    {phone_publiccheck === "인증 완료되었습니다"
                                    ?<div>
                                        <button class="loginbtn2" onClick={breakoutbtn}>회원탈퇴</button>
                                    </div>
                                    :<div>
                                        <button class="loginbtnfalse" disabled="false" onClick={breakoutbtn}>회원탈퇴</button>
                                    </div>
                                    }

                                    <React.Fragment>
                                        <button onClick={openModal3} style={{display:"none"}} >회원탈퇴</button>
                                        <Okmodal open3={modalOpen3} close3={closeModal3} yesclose3={yescloseModal3} header3="회원탈퇴">
                                        <main>  
                                            정말로 회원 탈퇴하시겠습니까?
                                        </main>        
                                        </Okmodal>
                                    </React.Fragment>
                                    
                             
                            <br/><br/>
          
                        </div>
                    </div>
                </div>
                
            </div>
        
        
    )

}

export default Breakaway;
