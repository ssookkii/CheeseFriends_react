import React, { Component } from "react";
import { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

import Session from "react-session-api";
import axios from "axios";

const NaverLogin = ({ setGetToken, setUserInfo }) => {
  
	const { naver } = window
	const NAVER_CLIENT_ID = "vtgmTIPS5FcfFR8lAbG6"
	const NAVER_CALLBACK_URL = "http://localhost:9100/naverlogin"

    const history = useNavigate();

	const initializeNaverLogin = () => {
		const naverLogin = new naver.LoginWithNaverId({
			clientId: NAVER_CLIENT_ID,
			callbackUrl: NAVER_CALLBACK_URL,
          // 팝업창으로 로그인을 진행할 것인지?           
			isPopup: false,
          // 버튼 타입 ( 색상, 타입, 크기 변경 가능 )
			// loginButton: { color: 'green', type: 3, height: 58 },
			// callbackHandle: true,
		})
		naverLogin.init()

           // 선언된 naverLogin 을 이용하여 유저 (사용자) 정보를 불러오는데  
           // 함수 내부에서 naverLogin을 선언하였기에 지역변수처리가 되어  
           // userinfo 정보를 추출하는 것은 지역변수와 같은 함수에서 진행주어야한다.
		
           // 아래와 같이 로그인한 유저 ( 사용자 ) 정보를 직접 접근하여 추출가능하다.
           // 이때, 데이터는 첫 연동시 정보 동의한 데이터만 추출 가능하다.
    
           // 백엔드 개발자가 정보를 전달해준다면 아래 요기! 라고 작성된 부분까지는 
           // 코드 생략이 가능하다.  
      
      naverLogin.getLoginStatus(async function (status) {
			if (status) {
              // 아래처럼 선택하여 추출이 가능하고, 
                const user = JSON.stringify(naverLogin.user)

                localStorage.setItem("social", user);
                let soc = localStorage.getItem("social");
                console.log("soc : " + soc)
                let social = JSON.parse(soc)
                console.log("social.id : " + social.id)
    
                localStorage.setItem("socialtype", "naver");
                let socialtype = localStorage.getItem("socialtype");
                console.log("socialtype : " + socialtype)
        
                localStorage.setItem("naverlogin", "true");
    
                
                axios.post("http://localhost:3000/socialLogincheck", null, { params: {"joinid": social.id, "jointype": socialtype}})
                .then(function(resp){
                    console.log("joinid : " + resp.data)
                    if(resp.data === null || resp.data === ""){
                        alert("해당 네이버 계정으로 가입된 계정이 없습니다.\n회원가입 페이지로 이동합니다")
                        history("/regiselect");
                    }else{
                        alert(resp.data.name + "님 환영합니다");
                        Session.set("login", resp.data);
                        localStorage.setItem("login", JSON.stringify(resp.data));
    
                        let login = localStorage.getItem("login");
                        console.log(login);
                        window.location.href = "cheesefriends/home" ;
                    }
                })
                .catch(function(err){
                    alert(err);
                })

                // window.close();
    
                // history("/testmain");
            
             
			}
		})     
            // 요기!

        naverLogin.init();
        naverLogin.logout(); // 네이버 로그인이 계속 유지되는 경우가 있다. 초기화시 로그아웃
        // naverLogin.getLoginStatus((status) => {
        //     if (status) {
        //     console.log("Naver 로그인 상태", naverLogin.user);
        //     const { id, email, gender } = naverLogin.user;

        //     // 필수 제공 동의 조건
        //     if (gender == undefined) {
        //         alert("성별은 필수 동의 입니다. 정보제공을 동의해주세요.");
        //         naverLogin.reprompt();
        //         return;
        //     }
        //     } else {
        //     console.log("Naver 비 로그인 상태");
        //     }
        // });
	}
    
    
    
            // 네이버 소셜 로그인 (네아로) 는 URL 에 엑세스 토큰이 붙어서 전달된다.
            // 우선 아래와 같이 토큰을 추출 할 수 있으며,
            // 3부에 작성 될 Redirect 페이지를 통해 빠르고, 깨끗하게 처리가 가능하다.
   
    // const userAccessToken = () => {
    //     window.location.href.includes('access_token') && getToken()
    // }
    
    // const getToken = () => {
    //     const token = window.location.href.split('=')[1].split('&')[0]
    //     console.log("token : " + token)
    //         // console.log, alert 창을 통해 토큰이 잘 추출 되는지 확인하자! 
            
    //         // 이후 로컬 스토리지 또는 state에 저장하여 사용하자!   
    //         localStorage.setItem('access_token', token)
    //         setGetToken(token)
    // }

        
             // 화면 첫 렌더링이후 바로 실행하기 위해 useEffect 를 사용하였다.
	useEffect(() => {
		initializeNaverLogin()
		// userAccessToken()
        // getToken()
	}, [])


	return (
		<div>
         {/* // 구현할 위치에 아래와 같이 코드를 입력해주어야 한다. 
         // 태그에 id="naverIdLogin" 를 해주지 않으면 오류가 발생한다! */}
			<div id="naverIdLogin" /> 
        </div>
	)
}
export default NaverLogin;