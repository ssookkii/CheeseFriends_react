import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import Session from "react-session-api";

import axios from "axios";
import "./css/login.css";
import './css/sociallogin.css';
import GoogleLoginButton from "./google";
import Naver from "./naver";

import logo from './img/cheesefriendslogo.png';
import background from './img/background2.png';


function Login(){

    const history = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const [cookies, setCookies] = useCookies('');

    // 카카오 로그인
    const CLIENT_ID = "f3613163848bb3a96a1dd490a0855f2c";
    const REDIRECT_URI =  "http://localhost:9100/kakaologin";

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;


    // checkbox
    const [saveId, setSaveId] = useState(false);

    function checkHandler(){
        setSaveId(!saveId);

        if(!saveId === true && id !== ""){
            setCookies("user_id", id);
        }else{
            setCookies("user_id", '');
        }
    }

    function login(){
        axios.post("http://localhost:3000/login", null, { params: {"id": id, "password": password}})
        .then(function(resp){
            if(resp.data !== null && resp.data !== ""){
                alert(resp.data.name + "님 환영합니다");
                Session.set("login", resp.data);
                localStorage.setItem("login", JSON.stringify(resp.data));

                let login = localStorage.getItem("login");
                console.log(login);
                window.location.href = "cheesefriends/home" ;
            }
            else{
                alert("id나 password를 확인하십시오");
            }
        })
        .catch(function(err){
            alert(err);
        })
    }


    useEffect(function(){
        let user_id = cookies.user_id;
        if(user_id !== undefined && user_id !== ""){
            setId(user_id);
            setSaveId(true);
        }else{
            setId('');
            setSaveId(false);
        }
    }, [cookies]);

  
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

    // focus 작동용 code 아래 내용은 전혀 상관없음
    const [a, setA] = useState("");
    const [ac, setAc] = useState("");

    const aCheck = (a) => {
        if(a !== null) { //형식에 맞지 않을 경우 아래 콘솔 출력
            setAc("test");
            return;
        }
    }

    useEffect(()=>{
        aCheck(a);
    },[a])
    





    return(
        // Login css 세트 1
        <div>
            
            {/* <img class="wave" src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/wave.png" /> */}
               
                <div class="container">
                    <div class="img">
                    {/* <img src="https://raw.githubusercontent.com/sefyudem/Responsive-Login-Form/master/img/bg.svg" /> */}
                        <div>
                            <div class="jb-wrap">
                                {/* <div className="jb-text">cheesefriends에 어서오세요</div> */}
                                <img className="jb-image" src={background} style={{width:"600px", height:"700px"}}/>
                                {/* <div class="jb-image"><img src={background} alt="" /></div>
                                <div class="jb-text">
                                    <p>HELLO</p>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div class="login-content">
                     <form>
                        <br/><br/><br/>
                    
                        <img src={logo} style={{width:"300px", height:"100px"}}/>
                        
                        <br/><br/><br/><br/>
                            <div class="input-div one">
                                <div class="i">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="div">
                                    <h5>ID</h5>
                                    <input type="text" class="input" value={id} onChange={(e)=>setId(e.target.value)}  />
                                </div>
                            </div>
                            <div class="input-div pass">
                                <div class="i"> 
                                    <i class="fas fa-lock"></i>
                                </div>
                                <div class="div">
                                    <h5>PASSWORD</h5>
                                    <input type="password" class="input" value={password} onChange={(e)=>setPassword(e.target.value)}  />
                                </div>
                            </div>
                            <div style={{textAlign:"right"}}> 
                                <a class="logina" href="/socialregiselect">처음이신가요?&nbsp;회원가입</a>
                            </div>
                           
                            <div style={{textAlign:"right"}}>
                                <a class="logina" href="/idsearch">ID/비밀번호 찾기</a>
                            </div>
                            <br/><br/>
                            <button class="loginbtn" onClick={login}>Login</button>
                            
                            <br/>

                            {/* SNS 로그인 구역 */}
                            <div className="snsdiv">
                                기존의 계정으로 Cheesefriends에 로그인 해봐요
                            </div>

                            <br/>
                            
                            <table align="center" className="snstable">
                                <tr>
                                    <td>
                                        <GoogleLoginButton />
                                    </td>
                                    <td style={{paddingTop:"2px", paddingLeft:"10px"}}>
                                        <Naver />
                                    </td>
                                    <td style={{paddingTop:"4px", paddingLeft:"8px"}}>
                                        <a href={KAKAO_AUTH_URL}>
                                            <div className="kakao_btn">
                                            </div>
                                        </a>
                                    </td>
                                </tr>
                            </table>
                           
                            <br/>
                            </form>
                    </div>
                </div>
        </div>
    )

}

export default Login;
