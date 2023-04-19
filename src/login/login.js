import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";


function Login(){

    const history = useNavigate();

    const [id, setId] = useState('');
    const [pwd, setPwd] = useState('');

    const [cookies, setCookies] = useCookies('');

    // checkbox
    const [saveId, setSaveId] = useState(false);

    function checkHandler(){
        alert(saveId);
        setSaveId(!saveId);

        if(!saveId === true && id !== ""){
            setCookies("user_id", id);
        }else{
            setCookies("user_id", '');
        }
    }

    function login(){
        axios.post("http://localhost:3000/login", null, { params: {"id": id, "pwd": pwd}})
        .then(function(resp){
            alert(resp.data);
            if(resp.data !== null && resp.data !== ""){
                alert(resp.data.name + "님 환영합니다");

                localStorage.setItem("login", JSON.stringify(resp.data));
                history("/bbslist");

            }else{
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

    return(
        <div>
            
            <table  align="center">
            <colgroup>
                <col width="100"/><col width="20"/><col width="100"/><col width="100" />
            </colgroup>
            <tbody>
            <tr>
                <td rowspan="2">
                    <h3>Login</h3>
                </td>
                <td align="left">ID</td> 
                <td>
                    <input value={id} onChange={(e)=>setId(e.target.value)} placeholder="아이디" />
                </td>
                <td rowspan="2">
                    <button onClick={login}>Login</button>
                </td>
            </tr>
            <tr>
                <td align="left">PW</td>
                <td>
                    <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)} placeholder="패스워드" />
                </td>
            </tr>
            <tr>
                <td></td>
                <td align="left" colspan="2">
                    <input type="checkbox" checked={saveId} onChange={checkHandler} />id 저장
                </td>
            </tr>

            </tbody>
            </table>

            <br/>
            처음이신가요?&nbsp;<a href="/regiselect">회원가입</a>
            <br/>
            <a href="/idsearch">ID/비밀번호 찾기</a>
        </div>
    )

}

export default Login;
