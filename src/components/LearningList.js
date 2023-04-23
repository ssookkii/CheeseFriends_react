import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from "axios";
import Pagination from 'react-js-pagination';
import styled from "styled-components";
import { useNavigate } from 'react-router';


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
        movePage('/lecture/LectureList')
    }
    function movelearnlist() {
        movePage('/learning/LearningList');
    }
    function movetasklist() {
        movePage('/learning/TaskList');
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

    const LearnList = learninglist.map((list, i)=>{
        return(
            <tr key={i}>
                <th scope='row'> {i + 1} </th>
                <td> {list.subject} </td>
                <td> {list.title} </td>
                <td> {list.regdate} </td>
                <td>
                    {list.writer}
                </td>
            </tr>
        )
    })

    useEffect(function(){
        getLearnList(0);
    },[]);
    
 
    const [bbslist, setBbslist] = useState([]);
    const [choice, setChoice] = useState('');

    //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getSubList(choice, page){
        axios.get("http://localhost:3000/sublist", { params:{"choice":choice, "pageNumber":page } })
        .then(function(resp) {
          //  console.log(resp.data);
          //  alert(JSON.stringify(resp.data[8]));

          setBbslist(resp.data.list);
          setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
                alert(err);
        })
    }

    function searchBtn(){
        if(choice.toString().trim() === "") return;

        getSubList(choice, 0);
    }


    function pageChange(page) {
        setPage(page);
        getSubList(choice, page-1);
    }

    useEffect(function(){
        getSubList("", 0);
    }, []);

    return(

            <div style={{display:"flex", marginTop:"116px"}} className="learnlist">

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
                            <a href="#" className="nav-link text-white" >
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
            <select value={choice} onChange={(e)=>setChoice(e.target.value)}
                style={{marginTop:"6px", border:"none", height:"36px", borderBottom:"2px solid gray"}}>
                <option value="">과목 선택하기</option>
                <option value="kor">국어</option>
                <option value="math">수학</option>
                <option value="eng">영어</option>
                <option value="social">사회</option>
                <option value="sci">과학</option>
            </select>
            <button onClick={searchBtn}
                style={{marginLeft:"8px", marginTop:"15px", height:"31px", borderRadius:"6px", width:"80px", background:"#0d6efd", color:"#fff", border:"none", cursor:"pointer"}}>
                선택
            </button>
            <div style={{marginLeft:"60px", marginTop:"6px"}}>
            <Pagination 
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={8}
                prevPageText={"이전"}
                nextPageText={"다음"}
                onChange={pageChange} />
            </div>
        
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
                {LearnList}
            </tbody>
        </table>
        </div>

        
    </div>

    )
    }

