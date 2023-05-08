import React, { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import Session from "react-session-api";
import Pagination from "react-js-pagination";
import Deletemodal from "./deletemodal";
import Searchmodal from "./searchmodal";

import axios from "axios";
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';
import Cancelmodal from "./cancelmodal";

import styles from "../components/asset/css/mypage.module.css"

function Learningmypage(){
    const [id, setId] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [receivesubcode, setReceivesubcode] = useState("");

    const [edu_code, setEdu_code] = useState("");
    const [sub_code, setSub_code] = useState("");
    const [edu_name, setEdu_name] = useState("");
    const [edu_codecheckstart, setEdu_codecheckstart] = useState(false);

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

    // 모달 팝업2
    const openModal2 = () => {
        setModalOpen2(true);
        setEdu_codecheckstart(true);
        setEdu_code("");
        setSub_codechecked([]);
        setSub_codecheck([]);
        setCount(1);
    };

    const closeModal2 = () => {
        console.log("closeModal2 작동");
        setModalOpen2(false);
    };

    const yescloseModal2 = () => {
        console.log("yescloseModal2 작동");
        setModalOpen2(false);
        // receiveraddbtn();

        for (let i = 0; i < sub_codechecked.length; i++) {
            console.log("sub_codechecked : " + sub_codechecked)
            axios.get("http://localhost:3000/approvedcheck", { params: { "id":id, "subcode":sub_codechecked[i] } })
            .then(function (resp) {
                console.log("state : " + resp.data)
                if(resp.data === 'quiting'){
                    alert("이미 수강중인 학습입니다")
                }else if(resp.data === 'approving'){
                    alert("수강 승인 대기중인 학습입니다")
                }else if(resp.data === 'quiting'){
                    alert("탈퇴 진행 중인 학습입니다")
                }else if(resp.data === 'quited'){
                    axios.get("http://localhost:3000/changeapproving", { params: { "id":id, "subcode":sub_codechecked[i] } })
                    .then(function (resp) {
    
                    })
                    .catch(function (err) {
                        console.log(err);
                        alert('err')
                    })
                }else{
                    axios.get("http://localhost:3000/approving", { params: { "id":id, "subcode":sub_codechecked[i] } })
                    .then(function (resp) {

                    })
                    .catch(function (err) {
                        console.log(err);
                        alert('err')
                    })
                }
            })
            .catch(function (err) {
                console.log(err);
                alert('err')
            })
        }

        alert("학습 추가 신청 완료되었습니다");
        fetchData(login.id, '', '', 0);

    };
    

    const [mysubjectlist, setMysubjectlist] = useState([]);

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
                {props.subjectlist.state === "approving"
                ?<td>수강중인 수업이 아닙니다</td>
                :<td>{props.subjectlist.startdate.substr(0, 11)} ~ {props.subjectlist.enddate.substr(0, 11)}</td>
                }
                {props.subjectlist.state === "approving"
                ?<td>수강 승인중</td>
                :<td>
                    {props.subjectlist.state === "quiting"
                    ?<span>{Quitcancel(props)}</span>
                    :<>
                        {props.subjectlist.state === "quited"
                        ?<span>탈퇴 완료</span>
                        :<span>{Quitsubject(props)}</span>}
                    </>}
                </td>}
                
            </tr>
        );
    }

   // 학습 취소하기
   function Quitsubject(props){

            // 모달 팝업
        const openModal = () => {
            console.log(props.subjectlist.subcode);
            setReceivesubcode(props.subjectlist.subcode);
            setModalOpen(true);
        };

        const closeModal = () => {
            console.log("subcode : " + receivesubcode);
            console.log("closeModal 작동");
            setModalOpen(false);
        };

        function yescloseModal (){
            console.log("subcode : " + receivesubcode);
            console.log("yescloseModal 작동");
            setModalOpen(false);
    
            axios.get("http://localhost:3000/quitsubject", { params:{ "id":id, "subcode":receivesubcode}})
            .then(function(resp){
                alert("학습 탈퇴 신청 되었습니다");
                fetchData(id, choice, search, 0);
            })
            .catch(function(err){
                alert('err');
            }) 
        
        };


        return(
            <React.Fragment>
                <button onClick={openModal} className={`${styles.confirmBtn} ${styles.delBtn}`}>탈퇴 신청</button>
                <Deletemodal open={modalOpen} close={closeModal} yesclose={yescloseModal} header="탈퇴 신청">
                <main>  
                    탈퇴신청 하시겠습니까?
                </main>        
                </Deletemodal>
            </React.Fragment>
        )
    }

    // 학습 취소를 캔슬하기
    function Quitcancel(props){
    
            // 모달 팝업
        const openModal3 = () => {
            console.log(props.subjectlist.subcode);
            setReceivesubcode(props.subjectlist.subcode);
            setModalOpen3(true);
        };

        const closeModal3 = () => {
            console.log("subcode : " + receivesubcode);
            console.log("closeModal 작동");
            setModalOpen3(false);
        };

        function yescloseModal3 (){
            console.log("subcode : " + receivesubcode);
            console.log("yescloseModal 작동");
            setModalOpen3(false);

            axios.get("http://localhost:3000/quitcancel", { params:{ "id":id, "subcode":receivesubcode}})
            .then(function(resp){
                alert("학습 탈퇴 신청이 취소 되었습니다");
                fetchData(id, choice, search, 0);
            })
            .catch(function(err){
                alert('err');
            }) 

        };

        return(
            <React.Fragment>
                <button onClick={openModal3} className={`${styles.confirmBtn} ${styles.delBtn}`}>탈퇴 신청 취소하기</button>
                <Cancelmodal open3={modalOpen3} close3={closeModal3} yesclose3={yescloseModal3} header="탈퇴 신청 취소하기">
                <main>  
                    탈퇴신청 취소하기 하시겠습니까?
                </main>        
                </Cancelmodal>
            </React.Fragment>
        )
    }


    // 교육기관 코드 체크
    function educodecheck() {
        // setEducheck(false);
        if(edu_codecheckstart){
            axios.get("http://localhost:3000/subjectlist", { params: { "edu_code": edu_code } })
            .then(function (resp) {
                const subplus = document.getElementById("subplus");

                while (subplus.firstChild) {
                    subplus.removeChild(subplus.firstChild);
                }

                let element = document.createElement("option");
                element.innerText = "과목을 선택해주세요";
                element.setAttribute("value", "");
                subplus.appendChild(element);

                for (let i = 0; i < resp.data.length; i++) {
                    let element = document.createElement("option");
                    element.innerHTML = resp.data[i].subname;
                    element.setAttribute("value", resp.data[i].subcode);
                    subplus.appendChild(element);
                }

            })

            .catch(function (err) {
                console.log(err);
                alert('err')
            })

            axios.get("http://localhost:3000/eduname", { params: { "edu_code": edu_code } })
            .then(function (resp) {
                setEdu_name(resp.data);
            })
            .catch(function (err) {
                console.log(err);
                alert('err')

            })
        }
    }

    
    useEffect(() => {
        educodecheck(edu_code);
    }, [edu_code])


    function subcodecheck(e) {
        setSub_code(e.target.value);
    }

    

    // 체크박스 관리 변수
    const [sub_codechecked, setSub_codechecked] = useState([]);

    // 체크박스 관리 함수
    const subcodeadd = (e) => {
        console.log("e.target.checked : " + e.target.checked);
        console.log("e.target.value : " + e.target.value);

        if (e.target.checked) {
            //   alert("과목 체크 추가");
            setSub_codechecked((sub_codechecked) => [...sub_codechecked, e.target.value])

            return;
        } else {
            //   alert("과목 체크 제거");
            setSub_codechecked((sub_codechecked) => sub_codechecked.filter((item) => item !== e.target.value));

            return;
        }
    }

    // 체크 배열 점검
    useEffect(() => {
        console.log(sub_codechecked);
    }, [sub_codechecked])


    // 추가된 과목 리스트 관리
    const [count, setCount] = useState(1);
    const [sub_codecheck, setSub_codecheck] = useState([]);

    function subjectadd() {
        // 과목 중복추가 체크
        if (sub_code === "" || sub_code === null) {
            alert("교육기관 코드 입력 후 과목을 선택해주세요")
            return;
        }

        for (let i = 0; i < sub_codecheck.length; i++) {
            if (sub_codecheck[i] === sub_code) {
                alert("이미 추가된 과목입니다")
                return;
            }
        }

        axios.get("http://localhost:3000/approvedcheck", { params: { "id":id, "subcode":sub_code } })
        .then(function (resp) {
            console.log("state : " + resp.data)
            if(resp.data === 'approved'){
                alert("이미 수강중인 학습입니다")
            }else if(resp.data === 'approving'){
                alert("수강 승인 대기중인 학습입니다")
            }else if(resp.data === 'quiting'){
                alert("탈퇴 진행 중인 학습입니다")
            }else{
                axios.get("http://localhost:3000/eduname", { params: { "edu_code": edu_code } })
                .then(function (resp) {
                    const newItem = sub_code;
                    setSub_codecheck([...sub_codecheck, newItem]);
    
                    const table = document.getElementById("subplus2");
                    const subplus = document.createElement("tr");
    
                    // 체크박스
                    let td = document.createElement("td");
                    let element0 = document.createElement("input");
    
                    element0.setAttribute("type", "checkbox");
                    element0.setAttribute("name", "subject");
                    element0.setAttribute("value", sub_code);
                    element0.setAttribute("checked", "checked");
                    //    element0.setAttribute("onchange", function(){alert('subcodeadd');});
                    element0.onchange = subcodeadd; //function(){alert('subcodeadd');};
    
                    td.append(element0)
                    subplus.appendChild(td);
    
                    setSub_codechecked((sub_codechecked) => [...sub_codechecked, sub_code])
    
                    // 번호
                    let element = document.createElement("td");
                    element.innerText = count;
                    setCount(count + 1);
                    subplus.appendChild(element);
    
                    // 교육기관
                    let element2 = document.createElement("td");
                    element2.innerText = resp.data;
                    subplus.appendChild(element2);
    
                    // 과목
                    axios.get("http://localhost:3000/subname", { params: { "sub_code": sub_code } })
                        .then(function (resp) {
                            let element3 = document.createElement("td");
                            element3.innerText = resp.data;
                            element3.setAttribute("value", "");
                            subplus.appendChild(element3);
                        })
                        .catch(function (err) {
                            console.log(err);
                            alert('err')
                        })
    
                    table.appendChild(subplus);
                })
                .catch(function (err) {
                    console.log(err);
                    alert('err')
                })
            }
                
           
        })
        .catch(function (err) {
            console.log(err);
            alert('err')
        })

       
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
            <React.Fragment>
                <div className={styles.btnRight}>
                    <button onClick={openModal2} className={`${styles.mypageBtn}`}>학습 추가 신청</button>
                </div>
                <Searchmodal open2={modalOpen2} close2={closeModal2} yesclose2={yescloseModal2} header2="학습 추가 신청">
                <main>
                    <table border="1" align="center">
                        <colgroup>
                            <col width="100" /><col width="200" /><col width="50" />
                        </colgroup>
                        <tr>
                            <th>코드</th>
                            <td align="left" colSpan="2">
                                <div>
                                    <input style={{ width:"150px"}} value={edu_code} onChange={(e) => setEdu_code(e.target.value)} placeholder="코드를 입력해주세요" ></input>
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th align="left">
                                <div >교육기관명</div>
                            </th>
                            <td align="left" colSpan="2">
                                {edu_name === ""
                                    ? <div style={{ fontSize: "10px" }}>올바른 코드를 입력해주세요</div>
                                    : <div style={{ fontSize: "10px", color: 'blue' }}>{edu_name}</div>}

                            </td>
                        </tr>
                        <tr>
                            <th>과목</th>
                            <td align="left">
                                <select className="subplus" id="subplus" onChange={subcodecheck}>

                                </select>&nbsp;&nbsp;
                                <button onClick={subjectadd}>추가</button>
                            </td>   
                        </tr>
                    </table>
                    <br/>

                    <table border="1" className="subplus2" id="subplus2">
                        <colgroup>
                            <col width="50" /><col width="50" /><col width="200" /><col width="100" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>선택</th><th>번호</th><th>교육기관</th><th>과목</th>
                            </tr>
                        </thead>
                    </table>
                    
                </main>        
                </Searchmodal>
            </React.Fragment>
            <table className={`${styles.tableList} ${styles.studentSub}`}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>교육기관</th>
                        <th>과목</th>
                        <th>선생님</th>
                        <th>수강기간</th>
                        <th>상태</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {
                        mysubjectlist.map(function(dto, i){
                            return (
                                <TableRow subjectlist={dto} cnt={(page-1)*10+(i+1)} key={i} />
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

export default Learningmypage;