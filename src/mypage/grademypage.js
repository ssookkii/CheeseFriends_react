import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Session from "react-session-api";
import Pagination from "react-js-pagination";

import axios from "axios";
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

import styles from "../components/asset/css/mypage.module.css"

function Grademypage(){
   
    let history = useNavigate();
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    // login 되어 있는지 검사
    useEffect (()=>{
    let local = localStorage.getItem("login");
    let login = JSON.parse(local);
    if(login !== undefined){
        
        // 로그인 된 계정의 auth 점검하여 조건 분기
        if(login.auth === 'student'){
            console.log('login.auth : ' + login.auth)
            setId(login.id);
            fetchData(login.id, '', '', 0);

        }else if(login.auth === 'parents'){
            console.log('login.auth : ' + login.auth)
            axios.post("http://localhost:3000/parentsidmatching", null, { params:{ "parentsid":login.id}})
            .then(function(resp){    

                const studentplus = document.getElementById("studentplus");

                while (studentplus.firstChild) {
                    studentplus.removeChild(studentplus.firstChild);
                }

                let element = document.createElement("option");
                element.innerText = "자녀선택";
                element.setAttribute("value", "");
                studentplus.appendChild(element);

                for (let i = 0; i < resp.data.length; i++) {
                    let element = document.createElement("option");
                    element.innerHTML = resp.data[i].name;
                    element.setAttribute("value", resp.data[i].studentid);
                    studentplus.appendChild(element);
                }

                setId(resp.data[0].studentid);
                fetchData(resp.data[0].studentid, '', '', 0);
            })
            .catch(function(err){
                console.log(err);
                alert('err')
            })
        }
       
    }else{
        alert('login해 주십시오');
        history('/');
    }

    },[history]);

    const [parentsid, setParentsid] = useState(login.id);
    const [id, setId] = useState("");

    const [gradelist, setGradelist] = useState([]);

    const [choice, setChoice] = useState("");
    const [search, setSearch] = useState("");
    const [student, setStudent] = useState("");

    const choiceChange = (e) => setChoice(e.target.value);
    const searchChange = (e) => setSearch(e.target.value);

    // 자녀 선택
    function studentChange(e){
        console.log("studentid : " + e.target.value)
        setStudent(e.target.value);
        setId(e.target.value);
        if(e.target.value !== ''){
            fetchData(e.target.value, '', '', 0);
        }
    }

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
    
     
    // 검색
    let navigate = useNavigate();

    function searchBtn(){
        // choice, search 검사
        console.log("search작동")

        if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
            navigate('/testmain/grademypage/' + choice + "/" + search);
        }
        else{
            navigate('/testmain/grademypage/');
        }
        // 데이터를 다시 한번 갖고 온다
        setPage(1)
        fetchData(id, choice, search, 0);
    }

    // 페이지 설정
    function handlePageChange(page){
        setPage(page);
        fetchData(id, choice, search, page-1);
    }
 


    const fetchData = async (id, c, s, p) => {
        await axios.get('http://localhost:3000/gradecheck', { params:{ "receiver":id, "choice":c, "search":s, "pageNumber":p} })
        .then(function(res){
            setGradelist(res.data.list);
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
                <td>{props.grade.eduname}</td>
                <td>{props.grade.subname}</td>
                <td>{props.grade.studentgrade}</td>
                <td>{props.grade.studentranks} / {props.grade.subtotal}</td>
            </tr>
        );
    }

    // 엑셀 다운로드
    function ExcelDownload(){
        const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const excelFileExtension = '.xlsx';
        // 입력된 성적 유무로 엑셀 다운로드 데이터 변경
        const gradeData =  
            gradelist.map((g, i) => ({
                번호:i+1,
                교육기관: g.eduname,
                과목: g.subname,
                점수: g.studentgrade,
                석차: g.studentranks + "/" + g.subtotal
            }));
        const ws = XLSX.utils.json_to_sheet(gradeData);
        console.log(ws);

        const wb = { Sheets: { grade: ws }, SheetNames: ["grade"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: excelFileType });
        FileSaver.saveAs(data, `file${excelFileExtension}`, { autoBOM: true });
    }



    return(
        <div>
            <div className={styles.topContent}>
                {login.auth === 'parents' ?
                <div className={styles.subject}>
                    <select value={student} onChange={studentChange} className="studentplus" id="studentplus">
                        <option value=''>자녀선택</option>
                    </select>
                </div>
                :
                <div></div>
                }

                <div className={styles.search}>      
                    <select value={choice} onChange={choiceChange}>
                        <option value="">검색</option>
                        <option value="eduname">교육기관</option>
                        <option value="subject">과목</option>
                    </select>
                    <input value={search} onChange={searchChange} placeholder="검색어를 입력하세요"/>
                    <button onClick={searchBtn} className={styles.searchBtn}>검색</button>
                </div>
            </div>
            <div className={styles.btnRight}>
                <button onClick={ExcelDownload} className={`${styles.mypageBtn}`}>엑셀 다운로드</button>
            </div>

            <table className={`${styles.tableList} ${styles.studentGrade}`}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>교육기관</th>
                        <th>과목</th>
                        <th>성적</th>
                        <th>석차</th>
                    </tr>
                </thead>
                <tbody>
                {
                    gradelist.map(function(dto, i){
                        return (
                            <TableRow grade={dto} cnt={(page-1)*10+(i+1)} key={i} />
                        )
                    })
                }            
                </tbody>
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
    )
}

export default Grademypage;