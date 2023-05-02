import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import student from './img/student.jpg';
import parents from './img/parents.jpg';
import teacher from './img/teacher.jpg';
import './sociallogin.css';

function Socialloginselect(){
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
    }

    function login(){
        window.location.href = "/"
    }

    
    const CLIENT_ID = "f3613163848bb3a96a1dd490a0855f2c";
    const REDIRECT_URI =  "http://localhost:9100/kakaologin";

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;


    // 프런트엔드 리다이랙트 URI 예시
    // const REDIRECT_URI =  "http://localhost:3000/oauth/callback/kakao";

    // 백엔드 리다이랙트 URI 예시
    // const REDIRECT_URI =  "http://localhost:5000/kakao/code";


   

    return(
        <div>
            <h1>회원가입</h1>
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
                    </td>
                </tr>
                <tr>
                    {/* <td>
                        <button onClick={goKakao}>카카오연동</button>
                    </td> */}
                    <a href={KAKAO_AUTH_URL}>
                        <div className="kakao_btn">
                        </div>
                    </a>
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

export default Socialloginselect;

