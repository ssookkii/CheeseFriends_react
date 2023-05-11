
import {GoogleLogin} from "@react-oauth/google";
import {GoogleOAuthProvider} from "@react-oauth/google";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

import Session from "react-session-api";
import axios from "axios";

const GoogleLoginButton = () => {
    const history = useNavigate();

    const clientId = '567662946789-14jcm3so0ild3dt2qgn7v719ial9hqk4.apps.googleusercontent.com'
    return (
        <>
            <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={(res) => {
                        console.log(res);
                        console.log(jwtDecode(res.credential))
                        
                        const data = jwtDecode(res.credential);

                        console.log("sub : " + data.sub)

            
                            // 해당 social로 가입된 아이디가 있는지 체크해서 있으면 로그인 없으면 회원가입
                        // alert(resp.data.nickname + "님 환영합니다");
                        // Session.set("login", resp.data);
                        localStorage.setItem("social", JSON.stringify(data));
                        let soc = localStorage.getItem("social");
                        let social = JSON.parse(soc)
                        console.log("social.sub : " + social.sub)
            
                        localStorage.setItem("socialtype", "google");
                        let socialtype = localStorage.getItem("socialtype");
                        console.log("socialtype : " + socialtype)
            
                        axios.post("http://localhost:3000/socialLogincheck", null, { params: {"joinid": social.sub, "jointype": socialtype}})
                        .then(function(resp){
                            console.log("joinid : " + resp.data)
                            if(resp.data === null || resp.data === ""){
                                alert("해당 구글 계정으로 가입된 계정이 없습니다.\n회원가입 페이지로 이동합니다")
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
         
                        // alert("환영합니다");
                        // history("/testmain");

                    }}
                    onFailure={(err) => {
                        console.log(err);
                    }}
                    size="large"
                    width="300px"
                    type="icon"
                    theme="outline"
                 
                />
            </GoogleOAuthProvider>
        </>
    );
};

export default GoogleLoginButton
