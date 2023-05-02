import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";


function Sidemenu(){
    const [id, setId] = useState("");
    const [auth, setAuth] = useState("");

    let history = useNavigate();
    // login 되어 있는지 검사
    useEffect (()=>{
        let local = localStorage.getItem("login");
        let login = JSON.parse(local);
        if(login !== undefined){
            setId(login.id);
            setAuth(login.auth);
            console.log("login.auth : " + login.auth);
        }else{
            alert('login해 주십시오');
            history('/');
        }
    },[history]);

    let local = localStorage.getItem("login");
    let login = JSON.parse(local);


    return(
        <div>
            <div>
                {login.auth === 'teacher'
                ?   
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/>
                    </colgroup>
                    <tr>
                        <td  style={{backgroundColor:"grey"}}>
                            <div>MyPage</div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="changeme">개인정보 변경</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="email">쪽지 관리</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="AttendanceManageTeacher">수강생 출석관리</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <label for="">수강생 성적관리</label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <label for="">수업 일정</label>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="studentlist">과목별 수강생 확인</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="DataAnalysisTeacher">데이터 분석</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="breakaway">회원 탈퇴</Link>
                        </td>
                    </tr>
                </table>
                :
                <table border="1" align="center">
                    <colgroup>
                        <col width="150"/>
                    </colgroup>
                    <tr>
                        <td  style={{backgroundColor:"grey"}}>
                            <div>MyPage</div>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="changeme">개인정보 변경</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="email">쪽지 관리</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="AttendanceManage">출석확인</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="grademypage">성적표</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="learningmypage">수강중인 학습</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="DataAnalysis">데이터 분석</Link>
                        </td>
                    </tr>
                    <tr>
                        <td align="left">
                            <Link to="breakaway">회원 탈퇴</Link>
                        </td>
                    </tr>
                </table>
                
                }
                
            </div>
        </div>
        
    )

}

export default Sidemenu;
