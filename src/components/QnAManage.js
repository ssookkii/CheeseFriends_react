import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import manage from './asset/css/manageCommon.module.css';

function QnAManage(){
    const [qnaList, setQnaList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getQnaList(cho, sear, page){
        axios.get("http://localhost:3000/qnalist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

            setQnaList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        console.log(choice);
        console.log(search);
        getQnaList(choice, search, 0);
    }
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            searchBtn()
        }
    }

    function pageChange(page){
        setPage(page);
        getQnaList(choice, search, page-1);
    }


    useEffect(function(){
        getQnaList("", "", 0);
    },[]);


    return(
        <div>
            <div className={manage.topContent}>
                <h2>고객문의함</h2>
                <div className={manage.search}>
                    <div> 
                        <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="id">작성자</option>
                            <option value="title">제목</option>
                            <option value="topic">문의주제</option>
                        </select>
                        <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                    </div>   
                    <input value={search} onChange={(e)=>setSearch(e.target.value)}  onKeyPress={(e) => activeEnter(e)} placeholder="검색어를 입력하세요"/>
                </div>
            </div>

            <table className={`${manage.manageList} ${manage.qnalist}`}>
                <thead>
                    <tr>
                        <th>작성자</th>
                        <th>문의주제</th>
                        <th>제목</th>
                        <th>문의일</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        qnaList.map(function(qna, i){
                            return (
                                <tr key={i}>
                                    <td>{qna.writer}</td>
                                    <td>{qna.topic}</td>
                                    <td><Link to={`/adminpage/qnaanswer/${qna.seq}`}>{qna.title}</Link></td>
                                    <td>{qna.regdate.substr(0, 11)}</td>
                                    
                                    {qna.reply === 0 ?
                                        (<td><span></span><span>답변대기</span></td>) :
                                        (<td><span className={manage.qnaReply}></span><span>답변완료</span></td>)
                                    }
                                    
                                </tr>
                            )
                        })
                    }
                </tbody>

            </table>

            <br/>
            <Pagination
                activePage={page}
                itemsCountPerPage={12}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={12}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={pageChange} />
        </div>
    )
}
export default QnAManage