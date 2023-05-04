import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from 'react-js-pagination';
import './asset/css/LearningList.css';
import { useNavigate, Link } from 'react-router-dom';

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LearningList() {

    const [learninglist, setLearninglist] = useState([]);

    const movePage = useNavigate();

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;

    function writelink() {
        movePage('/cheesefriends/learning/LearningWrite')
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

        <div className="learninglist">
            <div style={{marginTop:"-627PX"}}>
                <h2 style={{marginLeft:"15px", color:"#434343", marginTop:"-50px"}}>인강학습실</h2>
                <div>
                    {userAuth === 'admin' && (
                        <button type="button" className="learnBtn" style={{width:"221px"}} onClick={writelink}>
                            글쓰기
                    </button>
                    )}
                </div>
            </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-208px", justifyContent:"flex-end"}}>
                    
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
                                <Link style={{textDecoration:"none"}} to={`/cheesefriends/learning/LearningDetail/${list.seq}`}>{list.title}</Link>
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

