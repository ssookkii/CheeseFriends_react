import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import manage from './asset/css/manageCommon.module.css';


function SubjectManage(){
    const [subList, setSubList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getSubList(cho, sear, page){
        axios.get("http://localhost:3000/sublist", { params:{"choice":cho, "search":sear, "pageNumber":page} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));

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

    function pageChange(page){
        setPage(page);
        getSubList(choice, search, page-1);
    }

    function deleteBtn(subCode){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/subDelete", null, {params: {"subCode":subCode}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.replace("/adminpage/submanage")
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
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            searchBtn()
        }
    }

    useEffect(function(){
        getSubList("", "", 0);
    },[]);


    return(
        <div>
            <div className={manage.topContent}>
                <h2>과목관리</h2>
                <div className={manage.search}>
                    <div>   
                        <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="eduCode">학원코드</option>
                            <option value="eduName">학원이름</option>
                            <option value="subCode">과목코드</option>
                            <option value="subName">과목이름</option>
                            <option value="id">아이디</option>
                        </select>
                        <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                    </div>  
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} onKeyPress={(e) => activeEnter(e)} placeholder="검색어를 입력하세요"/>
                </div>
            </div>

            <table className={`${manage.manageList} ${manage.sublist}`}>
                <thead>
                    <tr>
                        <th>학원코드</th>
                        <th>학원이름</th>
                        <th>과목코드</th>
                        <th>과목이름</th>
                        <th>대상학년</th>
                        <th>담당교사아이디</th>
                        <th>담당교사이름</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subList.map(function(sub, i){
                            return (
                                <tr key={i}>
                                    <td>{sub.eduCode}</td>
                                    <td>{sub.eduName}</td>
                                    <td>{sub.subCode}</td>
                                    <td>{sub.subName}</td>
                                    <td>{sub.classGrade}</td>
                                    <td>{sub.educatorName}</td>
                                    <td>{sub.name}</td>
                                    <td>
                                        <Link to={`/adminpage/subupdate/${sub.subCode}`} className={manage.Edit}><FontAwesomeIcon icon={faPen} /></Link>
                                        <button onClick={() => deleteBtn(sub.subCode)} className={manage.Del}><FontAwesomeIcon icon={faTrashCan} /></button>
                                    </td>
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
export default SubjectManage