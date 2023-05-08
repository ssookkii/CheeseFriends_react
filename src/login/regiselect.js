import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import student from './img/student.jpg';
import parents from './img/parents.jpg';
import teacher from './img/teacher.jpg';

import "./css/login.css";
import "./css/login2.css";

import logo from './img/cheesefriendslogo.png';

function Regiselect(){

    function gostudentregi(){
        window.location.href = "/regi"
    }

    function goparentregi(){
        window.location.href = "/regiparents"
    }

    function goteacherregi(){
        window.location.href = "/regiteacher"
    }

    function login(){
        window.location.href = "/"
    }

    return(
        <div>  
            {/*  Login css 세트 1 */}
                <div style={{textAlign:"center", alignItems:"center"}}>
                    
                    <div class="container2">

                        <div class="login-content3">
                    
                            <img src={logo} style={{width:"300px", height:"100px", marginLeft:"auto", marginRight:"auto"}}/>
                            <br/><br/><br/>
                            <div className="snsdiv">
                                가입 유형을 선택해주세요
                            </div>
                            <br/><br/><br/>
                            <table align="center">
                                <colgroup>
                                    <col width="300" /><col width="300" /><col width="300" />
                                </colgroup>
                                
                                <tr>
                                    <td>
                                        <div className="snsdiv">학생</div>
                                        <button class="student" onClick={gostudentregi} ></button>
                                    </td>
                                    <td>
                                        <div className="snsdiv">학부모</div>
                                        <button class="parents" onClick={goparentregi} ></button>
                                    </td>
                                    <td>
                                        <div className="snsdiv">교사</div>
                                        <button class="teacher" onClick={goteacherregi} ></button>
                                    </td>

                                </tr>
                            </table>
                            <br/><br/><br/>
                        
                            <div>
                            <button class="btn2" onClick={login}>로그인 화면으로</button>
                            </div>
                            </div>
                    </div>
                </div>

        </div>
    )
}

export default Regiselect;