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

function TeacherManage(){
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
                <div className={manage.btnWrap}>
                    <button className={`${manage.eduAdd} ${manage.del}`}>쪽지삭제</button>
                    <Link to="/adminpage/mailwrite" className={manage.eduAdd}>쪽지쓰기</Link>
                </div>
            </div>

            <table className={`${manage.manageList} ${manage.maillist}`}>
                <thead>
                    <tr className={manage.mailTr}>
                        <th><input type="checkbox"/></th>
                        <th>수신자</th>
                        <th>제목</th>
                        <th>발송일</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        teacherList.map(function(t, i){
                            return (
                                <tr key={i} className={manage.mailTr}>
                                    <td><input type="checkbox"/></td>
                                    <td>abc123,ccc123,eee123,abc123,ccc123,eee123abc123,ccc123,eee123abc123,ccc123,eee123</td>
                                    <td><Link to="/adminmanage">안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. 안녕하세요. 반갑습니다. 관리자입니다. 공지사항 전달드립니다. </Link></td>
                                    <td>2023-04-21</td>
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
export default TeacherManage