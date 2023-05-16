import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Pagination from "react-js-pagination";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesLeft } from "@fortawesome/free-solid-svg-icons";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import manage from './asset/css/manageCommon.module.css';

function TeacherManage(){
    const [teacherList, setTeacherList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    const [deletecheckboxlist, setDeletecheckboxlist] = useState([]);
    const [ischeck, setIscheck] = useState(false);

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
    // 체크박스 확인
    const deletecheck = (checked, id) =>{    
        if(checked){
            setDeletecheckboxlist([...deletecheckboxlist, id]); 
        }else{
            setIscheck(false);
            setDeletecheckboxlist((deletecheckboxlist) => deletecheckboxlist.filter((item)=> item !== id)); 

        }
    }

    // 체크 배열 점검
    useEffect(()=>{
        console.log(deletecheckboxlist);
    }, [deletecheckboxlist]) 

    function allcheck(e){
        if(e.target.checked){
            setIscheck(true);
            for (let i = 0; i < teacherList.length; i++) {
                setDeletecheckboxlist((deletecheckboxlist) => [...deletecheckboxlist, teacherList[i].id]);
            }
            console.log("setIscheck : " + ischeck);
        }
        else{
            setIscheck(false);
            setDeletecheckboxlist([]);
            console.log("setIscheck : " + ischeck);
        }
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
    const activeEnter = (e) => {
        if(e.key === "Enter") {
            searchBtn()
        }
    }

    useEffect(function(){
        getTeacherList("", "", 0);
    },[]);

    function openMailWrite(){
        if(deletecheckboxlist.length > 0){
            const props = {
                id: deletecheckboxlist
                // 다른 props가 있다면 여기에 추가
            };
            const strProps = JSON.stringify(props); // 객체를 문자열로 변환합니다.
            window.open(`/usermailwrite?props=${strProps}`, '_blank', 'width=850px,height=700px,scrollbars=yes');
        }else{
            alert("회원을 선택해주세요");
        }
    }


    return(
        <div>
            <div className={manage.topContent}>
                <h2>회원관리</h2>
                <div className={manage.search}>  
                    <div>    
                        <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                            <option value="">검색</option>
                            <option value="eduCode">학원코드</option>
                            <option value="eduName">학원이름</option>
                            <option value="id">아이디</option>
                        </select>
                        <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                    </div>
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} onKeyPress={(e) => activeEnter(e)} placeholder="검색어를 입력하세요"/>
                </div>
                <button onClick={openMailWrite} className={manage.eduAdd}><em><FontAwesomeIcon icon={faCirclePlus} /></em><span>쪽지쓰기</span></button>
            </div>

            <table className={`${manage.manageList} ${manage.teacherlist}`}>
                <thead>
                    <tr>
                        <th><input type="checkbox" onChange={allcheck} checked={ischeck?true:false}/></th>
                        <th>학원코드</th>
                        <th>학원이름</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>이메일</th>
                        <th>전화번호</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        teacherList.map(function(t, i){
                            return (
                                <tr key={i}>
                                    <td>
                                    <input type="checkbox" 
                                            id={t.id}
                                            onChange={(e)=>deletecheck(e.currentTarget.checked, t.id)} 
                                            checked={deletecheckboxlist.includes(t.id)?true:false || ischeck?true:false}/>
                                    </td>
                                    <td>{t.eduCode}</td>
                                    <td>{t.eduName}</td>
                                    <td>{t.id}</td>
                                    <td>{t.name}</td>
                                    <td>{t.email}</td>
                                    <td>{t.phone}</td>
                                    <td>
                                        <Link to={`/adminpage/teaupdate/${t.id}`} className={manage.detail}><FontAwesomeIcon icon={faCircleInfo} /></Link>
                                        <button onClick={() => deleteBtn(t.id)} className={manage.Del}><FontAwesomeIcon icon={faTrashCan} /></button>
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
export default TeacherManage