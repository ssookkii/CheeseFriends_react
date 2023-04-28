import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Session from "react-session-api";
import Pagination from "react-js-pagination";

import axios from "axios";
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

function Learningmypage(){
    const [id, setId] = useState("");

    let history = useNavigate();
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    // login 되어 있는지 검사
    useEffect (()=>{
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);
    if(login !== undefined){
        setId(login.id);
    }else{
        alert('login해 주십시오');
        history('/');
    }

    },[history]);

    const [mysubjectlist, setMysubjectlist] = useState([]);

    const [choice, setChoice] = useState("");
    const [search, setSearch] = useState("");

    const choiceChange = (e) => setChoice(e.target.value);
    const searchChange = (e) => setSearch(e.target.value);

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    
     
    // 검색
    let navigate = useNavigate();

    function searchBtn(){
        // choice, search 검사
        console.log("search작동")

        if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
            navigate('/testmain/learningmypage/' + choice + "/" + search);
        }
        else{
            navigate('/testmain/learningmypage/');
        }
        // 데이터를 다시 한번 갖고 온다
        setPage(1)
        fetchData(id, choice, search, 0);
    }

    // 페이지 설정
    function handlePageChange(page){
        setPage(page);
        console.log("page : " + page);
        fetchData(id, choice, search, page-1);
    }
 


    const fetchData = async (id, c, s, p) => {
        console.log("id : " + id);
        await axios.get('http://localhost:3000/subjectcheck', { params:{ "receiver":id, "choice":c, "search":s, "pageNumber":p} })
        .then(function(res){
            console.log("성공");
            console.log("res.data.cnt : " + res.data.cnt);
            setMysubjectlist(res.data.list);
            setTotalCnt(res.data.cnt);  // 글의 총수

        })
        .catch(function(err){
            console.log(err);    
        })
    }

    useEffect(()=>{
        fetchData(login.id, '', '', 0);
    },[]);

    function TableRow(props){
        return (
            <tr>
                <td>{props.cnt}</td>
                <td>{props.subjectlist.eduname}</td>
                <td>{props.subjectlist.subname}</td>
                <td>{props.subjectlist.educatorname}</td>
                <td>{props.subjectlist.startdate} ~ {props.subjectlist.enddate}</td>
                <td>{props.subjectlist.state}</td>
            </tr>
        );
    }
  


    return(
        <div>
            <div>
                <h1>수강중인 학습</h1>

                <table align="center">
                    <colgroup>
                        <col width="100" /><col width="100" /><col width="100" />
                    </colgroup>
                    <tr>
                        <td>
                            <select value={choice} onChange={choiceChange}>
                                <option value=''>검색</option>
                                <option value="eduname">교육기관</option>
                                <option value="subject">과목</option>
                            </select>
                        </td>
                        <td>
                            <input value={search} onChange={searchChange} ></input>
                        </td>
                        <td>
                            <button onClick={searchBtn}>검색</button>
                        </td>
                    </tr>
                </table>

                <br/><br/>

                <table className="table" border="1" align="center">
                    <colgroup>
                        <col width="50" /><col width="100" /><col width="100" /><col width="100" /><col width="200" /><col width="100" />
                    </colgroup>
                    <tr>
                        <th>번호</th>
                        <th>교육기관</th>
                        <th>과목</th>
                        <th>선생님</th>
                        <th>수강기간</th>
                        <th>상태</th>
                    </tr>
                        {
                            mysubjectlist.map(function(dto, i){
                                return (
                                    <TableRow subjectlist={dto} cnt={(page-1)*10+(i+1)} key={i} />
                                )
                            })
                        }            
                </table>

                <Pagination
                    activePage={page}
                    itemsCountPerPage={10}
                    totalItemsCount={totalCnt}
                    pageRangeDisplayed={5}
                    prevPageText={"‹"}
                    nextPageText={"›"}
                    onChange={handlePageChange} />

            </div>
        </div>
    )
}

export default Learningmypage;