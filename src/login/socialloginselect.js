import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import './sociallogin.css';
import Google from "./google";

function Loginselect(){

    function goNaver(){

    }

    function goGoogle(){

    }

    function goKakao(){
        window.location.href = "/kakaologin"
    }

    function goRegiselect(){
        window.location.href = "/regiselect"
    }

    function login(){
        window.location.href = "/"
    }

    // 카카오 계정연동
    const CLIENT_ID = "f3613163848bb3a96a1dd490a0855f2c";
    const REDIRECT_URI =  "http://localhost:9100/kakaologin";

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;



    return(
        <div>
            <h1>로그인</h1>
            <br/><br/><br/>
            <table align="center">
                <tr>
                    <td>
                        <button onClick={goNaver}>naver연동</button>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={goGoogle}>google연동</button>
                        <GoogleLoginButton/>
                    </td>
                
                    <td>
                    <a href={KAKAO_AUTH_URL}>
                        <div className="kakao_btn">
                        </div>
                    </a>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={goRegiselect}>새로만들기</button>
                    </td>
                </tr>
            </table>
            <br/><br/><br/>

            <button onClick={login}>로그인 화면으로</button>
        </div>
    )
}

export default Loginselect;

