import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from 'react-js-pagination';
import { useNavigate, Link } from 'react-router-dom';
import { faAngleRight, faAngleLeft,faAnglesLeft, faAnglesRight  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function QnaLearningList() {
    const [qnalist, setQnaList] = useState([]);
    const movePage = useNavigate();
    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userAuth = loginInfo?.auth;

    function writelink() {
        movePage('/cheesefriends/learning/QnaLearningWrite');
    }
    
    function movelearn() {
        movePage("/cheesefriends/learning");
    }

    function getQnaList() {
        axios.get("http://localhost:3000/qnalearninglist")
        .then(function(resp){
            setQnaList(resp.data);
            console.log(resp.data);
        })
        .catch(function(err){
            // alert(err);
        })
    }

    useEffect(function () {
        getQnaList();
        getSubList("", "", 0);
      }, []);
 
    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getSubList(choice, search, page){
        axios.get("http://localhost:3000/qnalearninglist", { params:{"choice":choice, "search":search, "pageNumber":page } })
        .then(function(resp) {
            setSubList(resp.data.list);
            setTotalCnt(resp.data.cnt);
        })
        .catch(function(err){
            alert(err);
        })
    }

    function searchBtn(){
        getSubList(choice, search, 0);
    }

    function pageChange(page) {
        setPage(page);
        getSubList(choice, search, page-1);
    }

    useEffect(function(){
        getSubList("", "", 0);
    }, []);

    const [depth, setDepth] = useState(0);
    const [subject, setSubject] = useState('');

    function handleClick() {
        setDepth(depth + 1);
    }

    function TableRow(props) {
        if (!props.bbs.title) {
          return (
            <tr className="empty-row">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          );
        }
        
        const isReply = props.bbs.depth > 0;

        return (
          <tr className={`empty-row ${isReply ? 'reply' : ''}`}>
            {props.cnt && <td >{props.cnt}</td>}
            <td>{props.bbs.subject}</td>
            <td style={{ textAlign: "left" }} onClick={handleClick} className={isReply ? 'replya' : ''}>
              <Link to={`/cheesefriends/learning/QnaLearningDetail/${props.bbs.seq}`}>
                {props.bbs.title}
              </Link>
            </td>
            <td>{props.bbs.regdate}</td>
            <td>{props.bbs.writer}</td>
          </tr>
        );
      }
      
      // 작은 목록에 대한 행 개수 설정
      const targetRowCount = 10; // 목표 행 개수
      
      // 작은 목록일 경우 빈 행 추가
      if (subList.length < targetRowCount) {
        const emptyRowCount = targetRowCount - subList.length;
        for (let i = 0; i < emptyRowCount; i++) {
          const emptyRow = { title: null };
          subList.push(emptyRow);
        }
      } else if (subList.length > targetRowCount) {
        subList.splice(targetRowCount);
      }

    return(

            <div className="learninglist">
                <div className='shelterPageWrap'>
                    <div style={{width:"247.94px", textAlign:"center", marginTop:"-352px"}}>
                    <h2 className="learnh2" style={{marginLeft:"-15px"}}>수업질문방</h2>
                    <button type="button" className="learnBtn"  onClick={writelink}>
                        글쓰기
                    </button>
                    <button type="button" className="learnBtn" onClick={movelearn}> 목록으로</button>
                    </div>
                </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-208px", justifyContent:"flex-end"}}>
                    
            <select vlaue={choice} onChange={(e)=>setChoice(e.target.value)}
           style={{border:"none", borderBottom:"1px solid lightgray", height:"31px", marginTop:"14px", marginRight:"6px" }}>
                <option value="">검색</option>
                <option value="subject">과목</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
            </select>
            <input value={search} onChange={(e)=>setSearch(e.target.value)} style={{marginTop:"14px", height:"31px"}} placeholder="검색어를 입력하세요"/>
            <button onClick={searchBtn} style={{marginTop:"14px"}} className='lecsearchbtn'>검색</button>
        </div>
        <table className="lectable" style={{marginTop:"28px"}}>
            <thead>
                <tr style={{backgroundColor:"#FFEBB4", height:"35px"}}>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>번호</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>과목</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>제목</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>작성일</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>작성자</th>
                </tr>
            </thead>
            <tbody className="table-group-divider">
                {subList.map(function (list, i) {
                    return <TableRow bbs={list} cnt={i + 1} key={i} style={{ backgroundColor: "yellow" }} />;
                })}
            </tbody>
        </table>
        <br/>
        <Pagination
                activePage={page}
                itemsCountPerPage={8}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={8}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={pageChange} />

        </div>
       
    </div>

    )
}