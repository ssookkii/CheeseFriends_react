import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './asset/css/reset.css';
import manage from './asset/css/manageCommon.module.css';

function QnAManage(){
    const [teacherList, setTeacherList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getTeacherList(cho, sear, page){
        axios.get("http://localhost:3000/teacherlist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

            setTeacherList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getTeacherList(choice, search, 0);
    }

    function pageChange(page){
        setPage(page);
        getTeacherList(choice, search, page-1);
    }

    function deleteBtn(id){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/teacherDelete", null, {params: {"id":id}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.replace("/adminpage/teachermanage")
                }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                    alert("삭제를 실패하였습니다.")
                }
            })
            .catch(function(err){
                alert(err);
            })
        }else{
            alert("취소되었습니다.");
        }
        
    }

    useEffect(function(){
        getTeacherList("", "", 0);
    },[]);


    return(
        <div>
            <div className={manage.topContent}>
                <div className={manage.search}>       
                    <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                        <option value="">검색</option>
                        <option value="eduCode">학원코드</option>
                        <option value="eduName">학원이름</option>
                        <option value="id">아이디</option>
                    </select>
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="검색어를 입력하세요"/>
                    <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                </div>
            </div>

            <table className={`${manage.manageList} ${manage.qnalist}`}>
                <thead>
                    <tr>
                        <th><input type="checkbox"/></th>
                        <th>수신자</th>
                        <th>제목</th>
                        <th>문의일</th>
                        <th>상태</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        teacherList.map(function(t, i){
                            return (
                                <tr key={i}>
                                    <td><input type="checkbox"/></td>
                                    <td>{t.eduCode}</td>
                                    <td><Link></Link></td>
                                    <td>{t.id}</td>
                                    <td><span></span><span>답변대기</span></td>
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