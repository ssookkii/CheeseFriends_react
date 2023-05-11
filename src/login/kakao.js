import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Session from "react-session-api";
import axios from "axios";

function Kakao(){

    const history = useNavigate();

    // const dispatch = useDispatch();

    const href = window.location.href;
    let params = new URL(document.URL).searchParams;
    let code = params.get("code");

    console.log("code : " + code);

    useEffect(()=>{
        // fetch("http://localhost:3000/login")
        axios({
            method: "GET",
            url: `http://localhost:3000/kakaoLogin?code=${code}`,
          })
        .then(function(resp){
                // 해당 social로 가입된 아이디가 있는지 체크해서 있으면 로그인 없으면 회원가입
            // alert(resp.data.nickname + "님 환영합니다");
            // Session.set("login", resp.data);
            localStorage.setItem("social", JSON.stringify(resp.data));
            let soc = localStorage.getItem("social");
            console.log("soc : " + soc)
            let social = JSON.parse(soc)
            console.log("social.id : " + social.id)

            localStorage.setItem("socialtype", "kakao");
            let socialtype = localStorage.getItem("socialtype");
            console.log("socialtype : " + socialtype)

            axios.post("http://localhost:3000/socialLogincheck", null, { params: {"joinid": social.id, "jointype": socialtype}})
            .then(function(resp){
                console.log("joinid : " + resp.data)
                if(resp.data === null || resp.data === ""){
                    alert("해당 카카오 계정으로 가입된 계정이 없습니다.\n회원가입 페이지로 이동합니다")
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

            //     history("/testmain");
        })
        .catch(function(err){
            alert(err);
        })

    },[])


    return(
        <div>
            <div>
            </div>
        </div>
    )

}

export default Kakao;
