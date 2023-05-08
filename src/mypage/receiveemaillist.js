import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Pagination from "react-js-pagination";
import Deletemodal from "./deletemodal";

import axios from "axios";
import styles from "../components/asset/css/mypage.module.css"


function Email(){

    // 모달 팝업
    const [modalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        if(deletecheckboxlist.length > 0){
            setModalOpen(true);
        }else{
            alert("삭제할 쪽지를 선택해주세요");
        }
    };

    const closeModal = () => {
        console.log("closeModal 작동");
        setModalOpen(false);
    };

    const yescloseModal = () => {
        console.log("yescloseModal 작동");
        setModalOpen(false);

        for (let i = 0; i < deletecheckboxlist.length; i++) {
            console.log("seq : " + deletecheckboxlist[i]);
            axios.get("http://localhost:3000/receivedeleteMail", { params:{ "seq":deletecheckboxlist[i]}})
            .then(function(resp){
                
            })
            .catch(function(err){
                alert('err');
            }) 
        }
        alert("삭제완료 되었습니다");
        fetchData(id, choice, search, 0);
        setDeletecheckboxlist([]);
        setPage(1);
    };


    // 아이디
    let history = useNavigate();
    

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

    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    
    const [id, setId] = useState(login.id);
    const [maillist, setMaillist] = useState([]);
    const [seqlist, setSeqlist] = useState([]);
    

    const [choice, setChoice] = useState("");
    const [search, setSearch] = useState("");

    // paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);


    const choiceChange = (e) => setChoice(e.target.value);
    const searchChange = (e) => setSearch(e.target.value);

    const fetchData = async (id, c, s, p) => {
        await axios.get('http://localhost:3000/receivemaillist', { params:{ "receiver":id, "choice":c, "search":s, "pageNumber":p} })
        .then(function(res){
            setMaillist(res.data.list);
            setTotalCnt(res.data.cnt);  // 글의 총수
            setSeqlist([]);
            setIscheck(false);
            for (let i = 0; i < res.data.list.length; i++) {
                // console.log("seq : " + JSON.stringify(res.data.list[i].seq));
                setSeqlist((seqlist) => [...seqlist, res.data.list[i].seq]);
            }
           
        })
        .catch(function(err){
            console.log(err);    
        })
    }

    useEffect(()=>{
        setPage(1);
        fetchData(id, '', '', 0);
    },[]);

    // 검색
    let navigate = useNavigate();

    function searchBtn(){
        // choice, search 검사
        console.log("search작동")
        setDeletecheckboxlist([]);
        setIscheck(false);

        if(choice.toString().trim() !== "" && search.toString().trim() !== ""){
            navigate('/testmain/email/' + choice + "/" + search);
        }
        else{
            navigate('/testmain/email/');
        }
        // 데이터를 다시 한번 갖고 온다
        setPage(1)
        fetchData(id, choice, search, 0);
    }

    // 페이지 설정
    function handlePageChange(page){
        setPage(page);
        fetchData(id, choice, search, page-1);
        setDeletecheckboxlist([]);
        setIscheck(false);
    }

        // 체크박스
    // 체크박스 관리 변수
    const [deletecheckboxlist, setDeletecheckboxlist] = useState([]);
    const [ischeck, setIscheck] = useState(false);

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
            for (let i = 0; i < seqlist.length; i++) {
                setDeletecheckboxlist((deletecheckboxlist) => [...deletecheckboxlist, seqlist[i]]);
            }
            console.log("setIscheck : " + ischeck);
        }
        else{
            setIscheck(false);
            setDeletecheckboxlist([]);
            console.log("setIscheck : " + ischeck);
        }
    }



    function TableRow(props){
        return (
            <tr>
                <td>
                    {/* <input type="checkbox" value={props.mail.seq} onChange={deletecheck}></input>                     */}
                    <input type="checkbox" id={props.mail.seq} onChange={(e)=>deletecheck(e.currentTarget.checked, props.mail.seq)} 
                        checked={deletecheckboxlist.includes(props.mail.seq)?true:false || ischeck?true:false}></input>                    
                </td>
    
                {/* <td style={{ textAlign:"left" }}>{getArrow(props.bbs.depth)}{props.bbs.title}</td> */}
                {/* {BbsTitleProc(props)} */}
                <td>{props.cnt}</td>
                <td>{props.mail.title}</td>
                <td>{props.mail.sender}</td>
                <td>{props.mail.wdate}</td>
                {Maildetail(props)}
                {/* <td><button onClick={Maildetail(props)}>보기</button></td> */}
            </tr>
        );
    }

    // 메일 상세보기로 가기
    function Maildetail(props){
        function maildetailgo(){
            window.location.href = `/cheesefriends/testmain/maildetail/${props.mail.seq}`;
        }
        return(
            <td>
                <button onClick={maildetailgo} className={styles.mypageBtn}>상세보기</button>
                {/* <Link to={`/testmain/maildetail/${props.mail.seq}`}>보기</Link>   */}
            </td> 
        )
    }




    return(
            <>
                <div className={styles.topContent}>
                    <div className={`${styles.mailTitle} ${styles.sendTitle}`}>
                        <Link>받은 쪽지함</Link>
                        <Link to="/cheesefriends/testmain/sendemaillist">보낸 쪽지함</Link>
                        <Link to="/cheesefriends/testmain/sendemail">쪽지 보내기</Link>
                    </div>
                    <div className={styles.search}>      
                        <select value={choice} onChange={choiceChange}>
                            <option value="">검색</option>
                            <option value="title">제목</option>
                                    <option value="content">내용</option>
                                    <option value="sender">보낸사람</option>
                        </select>
                        <input value={search} onChange={searchChange} placeholder="검색어를 입력하세요"/>
                        <button onClick={searchBtn} className={styles.searchBtn}>검색</button>
                    </div>
                </div>
                <div className={styles.btnRight}>
                    <button onClick={openModal} className={`${styles.mypageBtn} ${styles.btnRight} ${styles.delBtn}`}>쪽지삭제</button>
                    <Deletemodal open={modalOpen} close={closeModal} yesclose={yescloseModal} header="쪽지삭제">
                    <div>  
                        쪽지를 삭제하시겠습니까?
                    </div>        
                    </Deletemodal>
                </div>
                <table className={`${styles.tableList} ${styles.receiveMail}`}>
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" onChange={allcheck} checked={ischeck?true:false}></input>
                            </th>
                            <th>번호</th><th>제목</th><th>보낸사람</th><th>날짜</th><th>보기</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            maillist.map(function(dto, i){
                                return (
                                    <TableRow mail={dto} cnt={(page-1)*10+(i+1)} key={i} />
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
            </>
    )

}


export default Email;
