import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Session from "react-session-api";

import axios from "axios";
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

function Grademypage(){
    const [id, setId] = useState("");

    let history = useNavigate();
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    // login 되어 있는지 검사
    useEffect (()=>{
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);
    if(login !== undefined){
        setId(login.id);
    }else{
        alert('login해 주십시오');
        history('/');
    }

    },[history]);


    const fetchData = async (id) => {
        await axios.get('http://localhost:3000/gradecheck', { params:{ "id":id} })
        .then(function(res){
            console.log("성공");
        })
        .catch(function(err){
            console.log(err);    
        })
    }

    useEffect(()=>{
        fetchData(id);
    },[]);


    return(
        <div>
            <div>
                <h1>성적표</h1>
                <table className="table" border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="100" /><col width="100" /><col width="100" /><col width="100" />
                    </colgroup>
                    <tr>
                        <th>번호</th>
                        <th>교육기관</th>
                        <th>과목</th>
                        <th>성적</th>
                        <th>석차</th>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Grademypage;