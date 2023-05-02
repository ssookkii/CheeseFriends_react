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
            console.log(resp.data);
            alert(resp.data.name + "님 환영합니다");
                Session.set("login", resp.data);
                localStorage.setItem("login", JSON.stringify(resp.data));

                let login = localStorage.getItem("login");
                console.log(login);
                history("/testmain");
        })
        .catch(function(err){
            alert(err);
        })
    },[])


    return(
        <div>
            <div>
                <h1>카카오</h1>
            </div>
        </div>
    )

}

export default Kakao;
