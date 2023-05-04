import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


import './sociallogin.css';
import GoogleLoginButton from "./google";

import Naver from "./naver";

function Socialregiselect(){
    // const REST_API_KEY = "f3613163848bb3a96a1dd490a0855f2c";
    // const REDIRECT_URI =  "http://localhost:9100/kakaologin";

    // const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;
    
    function goNaver(){

    }

    function goGoogle(){

    }

    function goKakao(){
        window.location.href = "/kakaologin"
    }

    function goRegiselect(){
        window.location.href = "/regiselect"
        localStorage.setItem("socialtype", "cheesefriends");
        
    }

    function login(){
        window.location.href = "/"
    }

    
    const CLIENT_ID = "f3613163848bb3a96a1dd490a0855f2c";
    const REDIRECT_URI =  "http://localhost:9100/kakaologin";

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;



   

    return(
        <div>
            <h1>회원가입</h1>
            <br/><br/><br/>
            <button style={{width:"300px", height:"40px"}}onClick={goRegiselect}>Cheesefriends 회원가입</button>
            <br/><br/><br/>

            <table align="center">
                <tr align="left">
                    <h3>SNS 회원가입</h3>
                </tr>
                <tr>
                    <div>기존의 계정으로 Cheesefriends에 가입하세요</div>
                </tr>
            </table>
            <br/>
            <table align="center">
                <tr>
                    <td>
                        <GoogleLoginButton />
                    </td>
                    <td style={{paddingTop:"7px", paddingLeft:"5px"}}>
                        <Naver />
                    </td>
                    <td style={{paddingTop:"4px"}}>
                        <a href={KAKAO_AUTH_URL}>
                            <div className="kakao_btn">
                            </div>
                        </a>
                    </td>
                </tr>
            </table>
            {/* <table align="center">
                <tr>
                    <td>
                        <button onClick={goNaver}>naver연동</button>
                    </td>
                </tr>
            
                <tr>
                    <td>
                       
                    </td>
                </tr>
            </table> */}
            <br/><br/><br/>

            <button onClick={login}>로그인 화면으로</button>
        </div>
    )
}

export default Socialregiselect;

