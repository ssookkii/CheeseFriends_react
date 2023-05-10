import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from 'react-js-pagination';
import styled from "styled-components";
import { useNavigate, Link } from 'react-router-dom';
import arrow from './asset/css/arrow.png';

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

    useEffect(function(){
        getQnaList(0);
    },[]);
    
 
    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);

    function getSubList(choice, search, page){
        axios.get("http://localhost:3000/qnalearninglist", { params:{"choice":choice, "search":search, "pageNumber":page } })
        .then(function(resp) {
          //  console.log(resp.data);
          //  alert(JSON.stringify(resp.data[8]));

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

    function pageChange(page) {
        setPage(page);
        getSubList(choice, search, page-1);
    }

    useEffect(function(){
        getSubList("", "", 0);
    }, []);

    return(

            <div className="learninglist">
                <div style={{marginTop:"-660px"}}>
                <h2 className="learnh2">수업질문방</h2>
                <div style={{width:"250px"}}>
                    {/* {userAuth === 'student' && ( */}
                        <button type="button" className="learnBtn"  onClick={writelink}>
                            글쓰기
                        </button>
                    {/* )}  */}
                    
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
            {
                subList.map(function(list, i){
                    return (
                        <TableRow bbs={list} cnt={i + 1} key={i} />
                    )
                })
            }
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

function TableRow(props){
    return (
        <tr>
            <td>{props.cnt}</td>
            <td>{props.bbs.subject}</td>
            <td style={{ textAlign:"left" }}>{getArrow(props.depth)}
            <Link to={`/cheesefriends/learning/QnaLearningDetail/${props.bbs.seq}`}>{props.bbs.title}</Link>
            </td>
            <td>{props.bbs.regdate}</td>
            <td>{props.bbs.writer}</td>
        </tr>
    );
}

// // 제목에 대한 링크 및 삭제된 글의 처리
// function BbsTitleProc(props){
//     if(props.bbs.del === 0){
//         return (
//             <td style={{ textAlign:"left" }}>
//                 {getArrow(props.bbs.depth)}                
//                 <Link to={`/learning/QnALearningList/${props.bbs.seq}`}>{props.bbs.title}</Link>                
//             </td>
//         );
//     }else{
//         return (
//             <td>*** 이 글은 작성자에 의해서 삭제되었습니다 ***</td>
//         );
//     }
// }

function getArrow( depth ) {
	let nbsp = "&nbsp;&nbsp;&nbsp;&nbsp;";
	
	let ts = "";
	for(var i = 0;i < depth; i++){
		ts += nbsp;
	}

    // String -> Html
    let space = <span dangerouslySetInnerHTML={{ __html: ts }}></span>    
    if(depth === 0){
        return "";
    }
	return (<>{space}<img src={arrow} alt="arrow.png" width='20px' height='20px'/>&nbsp;</>);
}

