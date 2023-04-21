import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import './asset/css/reset.css';
import manage from './asset/css/manageCommon.module.css';
import './asset/css/pagination.css';

function EduManage(){
    const [eduList, setEduList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // let isLogin = JSON.parse(localStorage.getItem("login"));
    const navigate = useNavigate();

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getEduList(cho, sear, page){
        axios.get("http://localhost:3000/edulist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

            setEduList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getEduList(choice, search, 0);
    }

    function pageChange(page){
        setPage(page);
        getEduList(choice, search, page-1);
    }

    function deleteBtn(eduCode){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/eduDelete", null, {params: {"eduCode":eduCode}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.replace("/adminpage/edumanage")
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
        getEduList("", "", 0);
        // console.log(isLogin.auth);
    },[]);

    return(
        <div className='wrap'>
            <div className={manage.topContent}>
                <div className={manage.search}>      
                    <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                        <option value="">검색</option>
                        <option value="eduCode">학원코드</option>
                        <option value="eduName">학원이름</option>
                        <option value="eduAddress">학원주소</option>
                    </select>
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="검색어를 입력하세요"/>
                    <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                </div>
                <Link to="/adminpage/eduAdd" className={manage.eduAdd}>기관등록</Link>
                
            </div>
            <table className={`${manage.manageList} ${manage.edulist}`}>
                <thead>
                    <tr>
                        <th>학원코드</th>
                        <th>학원이름</th>
                        <th>학원주소</th>
                        <th>학원번호</th>
                        <th>학원계정</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        eduList.map(function(edu, i){
                            return (
                                <tr key={i}>
                                    <td>{edu.eduCode}</td>
                                    <td>{edu.eduName}</td>
                                    <td>{edu.eduAddress}</td>
                                    <td>{edu.eduPhone}</td>
                                    <td>{edu.id}</td>
                                    <td>
                                        <Link to={`/adminpage/eduupdate/${edu.eduCode}`} className={manage.Edit}>수정</Link>
                                        <button className={manage.Del} onClick={() => deleteBtn(edu.eduCode)}>삭제</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
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
export default EduManage