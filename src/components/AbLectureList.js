import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { YouTubePlayer } from 'react-youtube';
import axios from "axios";
import Youtube from './Youtube';
import Pagination from 'react-js-pagination';
import { useEffect } from 'react';

function AbLectureList() {
    const [lecturelist, setLecturelist] = useState([]);

    function getLecList(seq) {
        axios.get("http://localhost:3000/lecturelist", {params:{"seq":seq}})
        .then(function(resp){
            setLecturelist(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }

    const Leclist = lecturelist.map((list, i)=>{
        return(
            <tr key={i}>
                <th scope='row'> {i + 1} </th>
                <td> {list.subject} </td>
                <td> {list.title} </td>
                <td> {list.regdate} </td>
                <td>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-caret-right-square-fill" viewBox="0 0 16 16" onClick={YouLink}>
                        <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm5.5 10a.5.5 0 0 0 .832.374l4.5-4a.5.5 0 0 0 0-.748l-4.5-4A.5.5 0 0 0 5.5 4v8z"/>
                    </svg>
                </td>
            </tr>
        )
    })

    useEffect(function(){
        getLecList(0);
    },[]);

    const LecList = () => {
        window.open('./LectureList', '_blank');
 
    }

    const YouLink = () => {
        window.open('./Youtube', '_blank');
 
    }

    return(
        
        <div style={{display:"flex"}}>
            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{width:"280px", height:"630px", borderRadius:"16px"}}>
                 <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="bi pe-none me-2" style={{width:"40", height:"32" }} ><use xlinkHref="#bootstrap"></use></svg>
                    <span className="fs-4">인강 학습실</span>
                </a>
                <hr />
                <ul className="nav nav-pills flex-column mb-auto">
                    <li>
                        <a href="./LectureList.js" className="nav-link text-white" onClick={LecList}>
                            <svg className="bi pe-none me-2" style={{width:"16", height:"16" }}><use xlinkHref="#home"></use></svg>
                            외부강의
                        </a>
                    </li>
                    <li className="nav-item">
                        <a href="" className="nav-link active" aria-current="page">
                        <svg className="bi pe-none me-2" style={{width:"16", height:"16" }}><use xlinkHref="#speedometer2"></use></svg>
                        결석 학생용
                        </a>
                    </li>
                </ul>
                <hr/>
                <div className="dropdown">
                    <button type="button" className="btn btn-secondary" style={{width:"248px"}}>글쓰기</button>
                </div>
            </div>

            {/* 목록 */}
            <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <h2>결석 학생용</h2>
            <table className="table" style={{marginTop:"28px"}}>
                <thead>
                    <tr>
                        <th scope="col">번호</th>
                        <th scope="col">과목</th>
                        <th scope="col">강의제목</th>
                        <th scope="col">작성일</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody className="table-group-divider">
                    {Leclist}
                </tbody>
            </table>
            </div>
        </div>
    )
    }

export default AbLectureList;