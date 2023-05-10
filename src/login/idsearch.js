import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import "./css/login.css";
import "./css/login2.css";

import logo from './img/cheesefriendslogo.png';

function Idsearch(){
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState("");
    const [phone_public, setPhone_public] = useState("");

    function passwordsearch(){
        window.location.href = "/passwordsearch"
    }

    function login(){
        window.location.href = "/";
    }
    

    // 이름 정규식
    const nameRegEx = /^[가-힣]{2,6}$/;
    const [namec, setNamec] = useState("");

    const namecheck = (name) => {
            if(name.match(nameRegEx)===null) {
                setNamec("이름을 입력해주세요");
            return;
            }else{
                setNamec("입력되었습니다");
            }
    }

    useEffect(()=>{
        namecheck(name);        
    }, [name]) 
    


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
        setPhone_public("");
        axios.post("http://localhost:3000/idsearch", null, { params:{ "name":name, "phone":phone }})
        .then(function(resp){
            console.log(resp.data);
            
            if(resp.data === null || resp.data === ""){
                alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
            }else{
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
        })
        .catch(function(err){
            alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
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
            idsearchbtn();
        }
    }

    // 휴대폰 번호 변경시 재인증 필요
    useEffect(()=>{
        setPhone_publiccheck("");
    },[phone])

    // 아이디 찾기 함수
    const [namea, setNamea] = useState(true);
    const [phonea, setPhonea] = useState(true);
    const [phone_publica, setPhone_publica] = useState(true);

    const [findid, setFindid] = useState("");
    const [regidate, setRegidate] = useState("");
    const [findida, setFindida] = useState(false);
    const [findidtext, setFindidtext] = useState("아이디를 찾지 못했습니다");

    function idsearchbtn(){

        // 유효검사
        setNamea(true);
        setPhonea(true); 
        setPhone_publica(true);

        if(namec !== "입력되었습니다"){
            setNamea(false);
            alert("이름을 입력해주세요");
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
    
        axios.post("http://localhost:3000/idsearch", null, { params:{ "name":name, "phone":phone }})
        .then(function(resp){
            console.log(resp.data);
            
            if(resp.data === null || resp.data === ""){
                alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
            }else{
                console.log("id : " + resp.data);
                setFindid(resp.data.id);
                setRegidate(resp.data.regidate);
                setFindida(true);
                setFindidtext(name + "님의 아이디가 확인되었습니다")
            }
        })
        .catch(function(err){
            alert("이름과 본인명의의 휴대폰 번호인지 확인해주세요");
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
        <div>
            {/*  Login css 세트 1 */}
            <div style={{textAlign:"center", alignItems:"center"}}>
                
                <div class="container2">

                    <div class="login-content2">
                  
                        <img src={logo} style={{width:"300px", height:"100px", marginLeft:"auto", marginRight:"auto"}}/>
                        <br/><br/><br/>
                    
                        <div className="idsea">아이디찾기</div>
                        <br/><br/><br/>
                        
                              
                          
                            {findida === true
                            ?<div></div>
                            :<div>
                            
                            {/* 이름 입력칸 */}
                            <div class="input-div one">
                                <div class="i">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="div">
                                    <h5>이름</h5>
                                    {namea === true 
                                        ? <input  type="text" class="input" style={{ width:"230px"}} value={name} onChange={(e)=>setName(e.target.value)}  />
                                        :  <input  type="text" class="input" style={{  width:"230px"}} value={name} onChange={(e)=>setName(e.target.value)} />}
                                </div>
                            </div>
                            {namea === true 
                                ?<div></div>
                                :<div>{ namec === "입력되었습니다" 
                                    ? <div><div class="inputtrue" >{namec}</div></div>
                                    : <div><div class="inputfalse" >{namec}</div></div>} 
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
                            {namec === "입력되었습니다" 
                            ?<div> 
                                { phonec === "올바르게 입력되었습니다" 
                                ? <div>
                                     { findida === true
                                        ?<div></div>
                                        :<div><button  class="loginbtn2" onClick={sendPhone}>인증번호 발송</button></div>} </div>
                                : <div><button  class="loginbtnfalse" disabled="false" onClick={sendPhone}>휴대폰 번호를 입력해주세요</button></div>}</div>
                            :<div><button  class="loginbtnfalse" disabled="false" onClick={sendPhone}>이름을 입력해주세요</button></div>}
                           
  
                            {phone_publicch === true
                            ?<div><button class="loginbtn2" onClick={sendphonecheck} >인증하기</button></div>
                            :<div></div>}
                            </div>}
                         
                            {/* 인증 완료 후 아이디 찾은 결과값 출력 */}
                            <br/>
                            { findida === true
                                ? <div>
                                    <div class="idsea">
                                        <input value= {findidtext}  style={{width:"400px", textAlign:"center"}}/>
                                    </div>
                                <br/><br/>
                                <div class="idsea">{findid}</div> 
                                <br/>
                                가입일: {regidate}
                                </div>
                                :<div></div>
                            }
                        
                        <br/><br/>
                     
                    
                        <div>
                        <button class="btn2" onClick={login}>로그인 화면으로</button>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <button class="btn2" onClick={passwordsearch}>비밀번호찾기</button>
                        </div>
                        </div>
                  </div>
            </div>
        </div>
    )

}

export default Idsearch;
