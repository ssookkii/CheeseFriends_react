import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import student from './img/student.jpg';
import parents from './img/parents.jpg';
import teacher from './img/teacher.jpg';

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

    return(
        <div>
            <h1>회원가입</h1>
            <h2>가입 유형을 선택해주세요</h2>
            <br/><br/><br/>
            <table align="center">
                <colgroup>
                    <col width="300" /><col width="300" /><col width="300" />
                </colgroup>
                <tr>
                    <td>
                        <img src={student} width="100" height="100"/>
                    </td>
                    <td>
                        <img src={parents} width="100" height="100"/>
                    </td>
                    <td>
                        <img src={teacher} width="100" height="100"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <button onClick={gostudentregi}>학생</button>
                    </td>
                    <td>
                        <button onClick={goparentregi}>학부모</button>
                    </td>
                    <td>
                        <button onClick={goteacherregi}>교사</button>
                    </td>

                </tr>
            </table>
        </div>
    )
}

export default Regiselect;