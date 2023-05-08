import React, { useEffect, useState } from "react";

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import styles from './asset/css/adminLogin.module.css';

function Admin(){
    const history = useNavigate();

    const [id, setId] = useState('');
    const [password, setPassword] = useState('');

    const [cookies, setCookies] = useCookies('');

    // checkbox
    const [saveId, setSaveId] = useState(false);

    function logout(){
        localStorage.removeItem("login");
    }

    function CheckHandler(){
        //alert(saveId);
        setSaveId(!saveId);
        if(!saveId === true && id!== ""){
            setCookies("user_id", id);
        }else {
            setCookies("user_id", '');
        }
    }

    function login(){
        axios.post("http://localhost:3000/login", null, {params:{"id":id, "password":password}})
        .then(function(resp){
            //alert(resp.data);
            if(resp.data !== null && resp.data !== ""){
                localStorage.setItem("login", JSON.stringify(resp.data));
                console.log(JSON.stringify(resp.data));
                console.log(resp.data);
                localStorage.setItem("btnActive", "edumanage");
                history('/adminpage/edumanage')
            }else{
                alert("id나 password를 확인하십시오")
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
        console.log(localStorage.getItem("login"));
    },[cookies]);

    return(
        <div className={styles.loginWrap}>
            <h1 className={styles.h1Title}>Administrator</h1>
            <div className={styles.loginContent}>
            <input
                type="text"
                className={`${styles.idPwInput} ${styles.idInput}`}
                value={id}
                onChange={(e)=>setId(e.target.value)} placeholder="아이디" />
            <input
                type="password"
                className={`${styles.idPwInput} ${styles.pwInput}`} 
                value={password}
                onChange={(e)=>setPassword(e.target.value)} placeholder="비밀번호"/>
            <div>
            <input type="checkbox"
                name="SaveIdChk"
                id="SaveIdChk"
                checked={saveId}
                className={styles.rememberId}
                onChange={CheckHandler} />
            <label for="SaveIdChk" className={styles.label}>아이디 저장</label>
            </div>
            <button onClick={login} className={styles.loginBtn}>Login</button>
            </div>
        </div>
    )
}
export default Admin;