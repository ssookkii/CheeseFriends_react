import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


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
        getEduList(choice, search, page);
    }

    function deleteBtn(eduCode){
        if(window.confirm("삭제하면 학원에 등록된 회원정보도 삭제됩니다. 정말 삭제하시겠습니까?")){
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
                alert("등록된 과목이 있어 삭제가 불가능합니다. 과목을 먼저 삭제해주세요.");
            })
        }else{
            alert("취소되었습니다.");
        }
        
    }
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            searchBtn()
        }
    }

    useEffect(function(){
        getEduList("", "", 0);
        // console.log(isLogin.auth);
    },[]);

    return(
        <div className='wrap'>
            <div className={manage.topContent}>
                <h2>기관관리</h2>
                <div className={manage.search}>
                    <div>
                        <select value={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="eduCode">학원코드</option>
                            <option value="eduName">학원이름</option>
                            <option value="eduAddress">학원주소</option>
                        </select>
                        <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                    </div> 
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} onKeyPress={(e) => activeEnter(e)} placeholder="검색어를 입력하세요"/>
                </div>
                <Link to="/adminpage/eduAdd" className={manage.eduAdd}><em><FontAwesomeIcon icon={faCirclePlus} /></em><span>기관등록</span></Link>
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
                                        <Link to={`/adminpage/eduupdate/${edu.eduCode}`} className={manage.Edit}><FontAwesomeIcon icon={faPen} /></Link>
                                        <button className={manage.Del} onClick={() => deleteBtn(edu.eduCode)}><FontAwesomeIcon icon={faTrashCan} /></button>
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