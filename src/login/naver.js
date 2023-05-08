import React, { Component } from "react";
import { useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";


import Session from "react-session-api";
import axios from "axios";


const Naver = ({ setGetToken, setUserInfo }) => {
  
    const naverRef = useRef()
	const { naver } = window
	const NAVER_CLIENT_ID = "vtgmTIPS5FcfFR8lAbG6"
	const NAVER_CALLBACK_URL = "http://localhost:9100/naverlogin"

    const history = useNavigate();

	const initializeNaverLogin = () => {
        localStorage.setItem("naverlogin", "false");
		const naverLogin = new naver.LoginWithNaverId({
			clientId: NAVER_CLIENT_ID,
			callbackUrl: NAVER_CALLBACK_URL,
          // 팝업창으로 로그인을 진행할 것인지?           
			isPopup: false,
          // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
			loginButton: { color: 'green', type: 1, height: 40},
			callbackHandle: true    
		})
		naverLogin.init() 
        naverLogin.logout(); // 네이버 로그인이 계속 유지되는 경우가 있다. 초기화시 로그아웃
   
	}
    
    const handleNaverLogin = () => {
		naverRef.current.children[0].click()
	}
    
	useEffect(() => {
		initializeNaverLogin()
	}, [])


   
	return (
		<div>
         {/* // 구현할 위치에 아래와 같이 코드를 입력해주어야 한다. 
         // 태그에 id="naverIdLogin" 를 해주지 않으면 오류가 발생한다! */}
			<div ref={naverRef} id="naverIdLogin" /> 
           
            <div className="naver_btn" onClick={handleNaverLogin}>
            </div>
           

            {/* <NaverLoginBtn onClick={handleNaverLogin}>
				<NaverIcon alt="navericon" />
				<NaverLoginTitle>네이버로 로그인</NaverLoginTitle>
			</NaverLoginBtn> */}
        </div>
	)
}
export default Naver;