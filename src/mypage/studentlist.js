import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Route, Link } from 'react-router-dom'

import axios from "axios";
import Pagination from "react-js-pagination";
import Deletemodal from "./deletemodal";
import Okmodal from "./okmodal";
import Quitmodal from "./quitmodal";
import styles from "../components/asset/css/mypage.module.css"

function Studentlist(){
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalOpen3, setModalOpen3] = useState(false);
    const [receivesubcode, setReceivesubcode] = useState("");
    const [studentid, setStudentid] = useState("");

    const [id, setId] = useState("");
    const [auth, setAuth] = useState("");

    let history = useNavigate();
    // login 되어 있는지 검사
    useEffect (()=>{
        let local = localStorage.getItem("login");
        let login = JSON.parse(local);
        if(login !== undefined){
            setId(login.id);
            setAuth(login.auth);

            // axios.post("http://localhost:3000/eduselect", null, { params:{ "id":login.id}})
            // .then(function(resp){   
            //     console.log(resp.data); 

            //     setEdu_code(resp.data.educode);

            //     axios.post("http://localhost:3000/subselect", null, { params:{ "id":login.id, "educode":resp.data.educode}})
            //     .then(function(resp){   
            //         console.log(resp.data); 

            //         const subselect = document.getElementById("subselect");

            //         while (subselect.firstChild) {
            //             subselect.removeChild(subselect.firstChild);
            //         }

            //         let element = document.createElement("option");
            //         element.innerText = "과목 선택";
            //         element.setAttribute("value", "");
            //         subselect.appendChild(element);

            //         for (let i = 0; i < resp.data.length; i++) {
            //             let element = document.createElement("option");
            //             element.innerHTML = resp.data[i].subname;
            //             element.setAttribute("value", resp.data[i].subcode);
            //             subselect.appendChild(element);
            //         }

            //         fetchData(resp.data[0].subcode, '', '', 0);
            //         setSub_code(resp.data[0].subcode);
            //     })
            //     .catch(function(err){
            //         console.log(err);
            //         alert('err')
            //     })
                
            // })
            // .catch(function(err){
            //     console.log(err);
            //     alert('err')
            // })

            
        
            

        }else{
            alert('login해 주십시오');
            history('/');
        }
    },[history]);

    useEffect (()=>{
       
        axios.post("http://localhost:3000/eduselect", null, { params:{ "id":login.id}})
        .then(function(resp){   
            console.log(resp.data); 

            setEdu_code(resp.data.educode);

            axios.post("http://localhost:3000/subselect", null, { params:{ "id":login.id, "educode":resp.data.educode}})
            .then(function(resp){   
                console.log(resp.data); 

                const subselect = document.getElementById("subselect");

                while (subselect.firstChild) {
                    subselect.removeChild(subselect.firstChild);
                }

                let element = document.createElement("option");
                element.innerText = "과목 선택";
                element.setAttribute("value", "");
                subselect.appendChild(element);

                for (let i = 0; i < resp.data.length; i++) {
                    let element = document.createElement("option");
                    element.innerHTML = resp.data[i].subname;
                    element.setAttribute("value", resp.data[i].subcode);
                    subselect.appendChild(element);
                }

                fetchData(resp.data[0].subcode, '', '', 0);
                setSub_code(resp.data[0].subcode);
            })
            .catch(function(err){
                console.log(err);
                alert('err')
            })
            
        })
        .catch(function(err){
            console.log(err);
            alert('err')
        })

    },[]);


    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    const [studentlist, setStudentlist] = useState([]);

    const [choice, setChoice] = useState("");
    const [search, setSearch] = useState("");
    const [edu_code, setEdu_code] = useState("");
    const [sub_code, setSub_code] = useState("");

    const choiceChange = (e) => setChoice(e.target.value);
    const searchChange = (e) => setSearch(e.target.value);


    function subcodechange(e){
        console.log("subcode : " + e.target.value);
        if(e.target.value !== ''){
            setSub_code(e.target.value);
            fetchData(e.target.value, choice, search, 0);
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
            navigate('/cheesefriends/testmain/studentlist/' + choice + "/" + search);
        }
        else{
            navigate('/cheesefriends/testmain/studentlist/');
        }
        // 데이터를 다시 한번 갖고 온다
        setPage(1)
        fetchData(sub_code, choice, search, 0);
    }

     // 페이지 설정
    function handlePageChange(page){
        setPage(page);
        fetchData(sub_code, choice, search, page-1);
    }



    const fetchData = async (subcode, c, s, p) => {
        await axios.get('http://localhost:3000/studentlist', { params:{ "subcode":subcode, "choice":c, "search":s, "pageNumber":p} })
        .then(function(res){
        setStudentlist(res.data.list);
        setTotalCnt(res.data.cnt);  // 글의 총수

        })
        .catch(function(err){
            console.log(err);    
        })
    }


    function TableRow(props){
        return (
            <tr>
            <td>{props.cnt}</td>
            <td>{props.student.name}</td>
            <td>{props.student.id}</td>
            <td>{props.student.parentsid}</td>
            <td>{props.student.subname}</td>
            <td>{props.student.startdate.substr(0, 11)} ~ {props.student.enddate.substr(0, 11)}</td>
            {props.student.state === "approving"
            ?<td><span>수강승인필요</span><span>{approved(props)}</span></td>
            :<td>
                {props.student.state === "quiting"
                ?<><span>탈퇴승인필요</span><span>{quited(props)}</span></>
                :<>
                    {props.student.state === "quited"
                    ?<span>탈퇴완료</span>
                    :<span>수강중</span>}
                </>}
        </td>}
        {props.student.state === "approving"
            ?<></>
            :<td>
                {props.student.state === "quiting"
                ?<span>{quitedtwo(props)}</span>
                :<>
                    {props.student.state === "quited"
                    ?<span>탈퇴 완료</span>
                    :<span>{quitedtwo(props)}</span>}
                </>}
        </td>}
        </tr>
        );
    }

    // 학습 신청 승인해주기
    function approved(props){

        // 모달 팝업
        const openModal = () => {
            console.log("subcode : " + props.student.subcode);
            setReceivesubcode(props.student.subcode);
            console.log("id : " +props.student.id);
            setStudentid(props.student.id);
            setModalOpen(true);
        };

        const closeModal = () => {
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("closeModal 작동");
            setModalOpen(false);
        };

        function yescloseModal (){
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("yescloseModal 작동");
            setModalOpen(false);

            axios.get("http://localhost:3000/makeapproved", { params:{ "id":studentid, "subcode":receivesubcode}})
            .then(function(resp){
                alert("학습 신청 승인 되었습니다");
                fetchData(sub_code, choice, search, 0);
            })
            .catch(function(err){
                alert('err');
                console.log(err);
            }) 

        };


        return(
            <React.Fragment>
                <button onClick={openModal} className={styles.confirmBtn}>수강 승인하기</button>
                <Deletemodal open={modalOpen} close={closeModal} yesclose={yescloseModal} header="수강 승인하기">
                <main>  
                    수강신청을 승인 하시겠습니까?
                </main>        
                </Deletemodal>
            </React.Fragment>
        )
    }

    // 학습 취소를 캔슬하기
    function quited(props){
    
            // 모달 팝업
        const openModal3 = () => {
            console.log("subcode : " + props.student.subcode);
            setReceivesubcode(props.student.subcode);
            console.log("id : " +props.student.id);
            setStudentid(props.student.id);
            setModalOpen3(true);
        };

        const closeModal3 = () => {
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("closeModal 작동");
            setModalOpen3(false);
        };

        function yescloseModal3 (){
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("yescloseModal 작동");
            setModalOpen3(false);

            axios.get("http://localhost:3000/deletestudent", { params:{ "id":studentid, "subcode":receivesubcode}})
            .then(function(resp){
                alert("탈퇴 신청이 승인 되었습니다");
                fetchData(sub_code, choice, search, 0);
            })
            .catch(function(err){
                alert('err');
            }) 

        };

        return(
            <React.Fragment>
                <button onClick={openModal3} className={styles.confirmBtn}>탈퇴 승인하기</button>
                <Okmodal open3={modalOpen3} close3={closeModal3} yesclose3={yescloseModal3} header="탈퇴 승인하기">
                <main>  
                    탈퇴 신청을 승인 하시겠습니까?
                </main>        
                </Okmodal>
            </React.Fragment>
        )
    }

    // 학습 취소를 캔슬하기
    function quitedtwo(props){
    
        // 모달 팝업
        const openModal2 = () => {
            console.log("subcode : " + props.student.subcode);
            setReceivesubcode(props.student.subcode);
            console.log("id : " +props.student.id);
            setStudentid(props.student.id);
            setModalOpen2(true);
        };

        const closeModal2 = () => {
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("closeModal 작동");
            setModalOpen2(false);
        };

        function yescloseModal2 (){
            console.log("subcode : " + receivesubcode);
            console.log("id : " + studentid);
            console.log("yescloseModal 작동");
            setModalOpen2(false);

            axios.get("http://localhost:3000/deletestudent", { params:{ "id":studentid, "subcode":receivesubcode}})
            .then(function(resp){
                alert("탈퇴 처리 되었습니다");
                fetchData(sub_code, choice, search, 0);
            })
            .catch(function(err){
                alert('err');
            }) 

        };

        return(
            <React.Fragment>
                <button onClick={openModal2} className={`${styles.confirmBtn} ${styles.delBtn}`}>탈퇴시키기</button>
                <Quitmodal open2={modalOpen2} close2={closeModal2} yesclose2={yescloseModal2} header="탈퇴시키기">
                <main>  
                    해당유저의 수강을 탈퇴 시키겠습니까?
                </main>        
                </Quitmodal>
            </React.Fragment>
        )
    }

    return(
        <div>
            <div className={styles.topContent}>
                <div className={styles.subject}>
                    <select className="subselect" id="subselect" value={sub_code} onChange={subcodechange}>
                        
                    </select>
                </div>

                <div className={styles.search}>      
                    <select value={choice} onChange={choiceChange}>
                        <option value="">검색</option>
                        <option value="name">이름</option>
                        <option value="id">아이디</option>
                    </select>
                    <input value={search} onChange={searchChange} placeholder="검색어를 입력하세요"/>
                    <button onClick={searchBtn} className={styles.searchBtn}>검색</button>
                </div>

            </div>
            <table className={`${styles.tableList} ${styles.studentlist}`}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>아이디</th>
                        <th>학부모</th>
                        <th>과목</th>
                        <th>수강날짜</th>
                        <th>상태</th>
                        <th>탈퇴처리</th>
                    </tr>
                </thead>
                <tbody>
                {
                    studentlist.map(function(dto, i){
                        return (
                            <TableRow student={dto} cnt={(page-1)*10+(i+1)} key={i} />
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

export default Studentlist;
