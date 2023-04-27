import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import Pagination from 'react-js-pagination';
import styled from "styled-components";
import { useNavigate, Link } from 'react-router-dom';

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LearningList() {

    const [learninglist, setLearninglist] = useState([]);

    const movePage = useNavigate();

    function learnwrite() {
        movePage('/learning/LearningWrite');
    }

    function tasklist() {
        movePage('/learning/TaskList');
    }

    function moveleclist() {
        movePage('/lecture')
    }
    function movelearnlist() {
        movePage('/learning');
    }
    function movetasklist() {
        movePage('/learning/TaskList');
    }
    function qnalist() {
        movePage('/learning/QnALearningList');
    }
    


    function getLearnList() {
        axios.get("http://localhost:3000/learninglist")
        .then(function(resp){
            setLearninglist(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }

    const Btn = styled.button`
        border:none;
        cursor:pointer;
        background:none;
        font-size:18px;
        &:hover {
        color: #0d6efd;
      }
    `;

    useEffect(function(){
        getLearnList(0);
    },[]);
    
 
    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(10);

    function getSubList(choice, search, page){
        axios.get("http://localhost:3000/learninglist", { params:{"choice":choice, "search":search, "pageNumber":page } })
        .then(function(resp) {
          //  console.log(resp.data);
          //  alert(JSON.stringify(resp.data[8]));

          setSubList(resp.data.list);
          setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getSubList(choice, search, 0);
    }

    function pageChange(page) {
        setPage(page);
        getSubList(choice, search, page-1);
    }

    useEffect(function(){
        getSubList("","", 0);
    }, []);


    return(

            <div style={{display:"flex", marginTop:"116px"}} className="learninglist">

            <div className="d-flex flex-column flex-shrink-0 p-3 text-bg-dark" style={{width:"280px", height:"630px", borderRadius:"16px"}}>
                <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                    <svg className="bi pe-none me-2" style={{width:"40", height:"32" }} ><use xlinkHref="#bootstrap"></use></svg>
                    <span className="fs-4">학습용 자료실</span>
                </a>
                <hr />
                    <ul className="nav nav-pills flex-column mb-auto">

                        <li className="nav-item">
                            <a href="#" className="nav-link active" aria-current="page" >                                        
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;수업 자료실 
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link text-white" onClick={tasklist}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;과제 제출실
                            </a>
                        </li>
                        <li>
                            <a href="#" className="nav-link text-white" onClick={qnalist} >
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;수업 질문방
                            </a>
                        </li>
                    </ul>
                    <hr/>
                    <div className="dropdown">
                        <button type="button" className="btn btn-secondary" onClick={learnwrite} style={{width:"248px"}}>
                            글쓰기
                        </button>
                    </div>
            </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-100px"}}>
            <div style={{width:"310px", marginRight:"16px", cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"white", textAlign:"center"}} onClick={moveleclist}><h3>인강학습실</h3></div>
            <div style={{width:"310px", marginRight:"16px", cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"#0d6efd", color:"white", textAlign:"center"}} onClick={movelearnlist}><h3>학습용자료실</h3></div>
            <div style={{width:"310px", marginRight:"16px",cursor:"pointer", paddingTop:"19px", borderRadius:"14px", backgroundColor:"white", textAlign:"center"}} onClick={movetasklist}><h3>과제 제출실</h3></div>
            
            <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}
            style={{border:"none", borderBottom:"1px solid lightgray", height:"31px", marginTop:"14px", marginRight:"6px" }}>
                <option value="">검색</option>
                <option value="subject">과목</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
            </select>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} style={{marginTop:"14px", height:"31px"}} placeholder="검색어를 입력하세요"/>
            <button onClick={searchBtn} style={{marginTop:"14px"}}>검색</button>
        </div>
        <table className="table" style={{marginTop:"28px"}}>
            <thead>
                <tr>
                    <th scope="col">번호</th>
                    <th scope="col">과목</th>
                    <th scope="col">제목</th>
                    <th scope="col">작성일</th>
                    <th scope="col">작성자</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
            {
                subList.map(function(list, i){
                    return (
                        <tr key={i}>
                            <td>{list.seq}</td>
                            <td>{list.subject}</td>
                            <td>
                                <Link style={{textDecoration:"none"}} to={`/learning/LearningDetail/${list.seq}`}>{list.title}</Link>
                            </td>
                            <td>{list.regdate}</td>
                            <td>{list.writer}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
        <br/>
        <Pagination
                activePage={page}
                itemsCountPerPage={8}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={8}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={pageChange} />

        </div>
                
    </div>

    )
}

