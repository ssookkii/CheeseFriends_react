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

function TeacherManage(){
    const id = JSON.parse(localStorage.getItem("login"));
    const sender = id.id;

    const [sendMailList, setSendMailList] = useState([]);

    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    // 체크박스 관리 변수
    const [deletecheckboxlist, setDeletecheckboxlist] = useState([]);
    const [ischeck, setIscheck] = useState(false);

    // 보낸메일 리스트 받아오기
    function getSendMailList(cho, sear, page){
        axios.get("http://localhost:3000/sendMaillist", { params:{"choice":cho, "search":sear, "pageNumber":page, "sender":sender} })
        .then(function(resp){
            console.log(resp.data);
            // alert(JSON.stringify(resp.data));
            setSendMailList(resp.data.list);
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
            for (let i = 0; i < sendMailList.length; i++) {
                setDeletecheckboxlist((deletecheckboxlist) => [...deletecheckboxlist, sendMailList[i].wdate]);
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
        getSendMailList(choice, search, 0);
    }

    function pageChange(page){
        console.log(page);
        setPage(page);
        getSendMailList(choice, search, page-1);
    }

    function deleteBtn(){
        if(window.confirm("정말 삭제하시겠습니까?")){
            for (let i = 0; i < deletecheckboxlist.length; i++) {
                axios.post("http://localhost:3000/deleteMail", null, {params: { "wdate":deletecheckboxlist[i]}})
                .then(function(resp){
                    if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                        console.log(resp.data);
                    }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                        alert("삭제를 실패하였습니다.")
                    }
                })
                .catch(function(err){
                    alert(err);
                })
            }
            alert("삭제되었습니다.");
            setDeletecheckboxlist([]);
            window.location.replace("/adminpage/sendmailmanage")
        }else{
            alert("취소되었습니다.");
        }
        
    }

    useEffect(function(){
        getSendMailList("", "", 0);
    },[]);


    return(
        <div>
            <div className={manage.topContent}>
                <div className={manage.search}>       
                    <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}>
                        <option value="">검색</option>
                        <option value="title">제목</option>
                        <option value="content">내용</option>
                    </select>
                    <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="검색어를 입력하세요"/>
                    <button onClick={searchBtn} className={manage.searchBtn}>검색</button>
                </div>
                <div className={manage.btnWrap}>
                    <button className={`${manage.eduAdd} ${manage.del}`} onClick={deleteBtn}>쪽지삭제</button>
                    <Link to="/adminpage/mailwrite" className={manage.eduAdd}>쪽지쓰기</Link>
                </div>
            </div>

            <table className={`${manage.manageList} ${manage.maillist}`}>
                <thead>
                    <tr className={manage.mailTr}>
                        <th><input type="checkbox" onChange={allcheck} checked={ischeck?true:false}/></th>
                        <th>수신자</th>
                        <th>제목</th>
                        <th>발송일</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        sendMailList.map(function(mail, i){
                            return (
                                <tr key={i} className={manage.mailTr}>
                                    <td>
                                        <input type="checkbox" 
                                            id={mail.wdate}
                                            onChange={(e)=>deletecheck(e.currentTarget.checked, mail.wdate)} 
                                            checked={deletecheckboxlist.includes(mail.wdate)?true:false || ischeck?true:false}/>
                                    </td>
                                    <td>{mail.receiver}</td>
                                    <td><Link to={`/adminpage/maildetailadmin/${mail.wdate}`}>{mail.title}</Link></td>
                                    <td>{mail.wdate}</td>
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