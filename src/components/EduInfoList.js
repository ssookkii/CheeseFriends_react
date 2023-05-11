import React, { useEffect, useState } from 'react';
import { faAngleRight, faAngleLeft, faAnglesLeft, faAnglesRight  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from 'react-js-pagination';
import axios from "axios";
import { useNavigate, Link } from 'react-router-dom';
import './asset/css/eduInfoList.css';

export default function EduInfoList() {

    const [eduInfoList, setEduInfoList] = useState([]);

    const movePage = useNavigate();

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;

    function eduwrite() {
        movePage('/cheesefriends/learning/EduInfoWrite');
    }

    function getEduInfoList() {
        axios.get("http://localhost:3000/eduInfoList")
        .then(function(resp){
            setEduInfoList(resp.data.list);

            console.log(resp.data);
            console.log(resp.data.list);
            
        })
        .catch(function(err){
            // alert(err);
        })

    }

    useEffect(function(){
        getEduInfoList();
    },[]);

    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

        //paging
    const [page, setPage] = useState(1);
    const [totalCnt, setTotalCnt] = useState(0);
 
    function getSubList(choice, search, page){
    //    const pageNumber = parseInt(page, 10);

        axios.get("http://localhost:3000/eduInfoList", { params:{"choice":choice, "search":search, "pageNumber":page } })
        .then(function(res) {
            setSubList(res.data.list);
            setTotalCnt(res.data.cnt);
            console.log(res.data.list);

        })
        .catch(function(err){
            alert(err);
        })
    }

    function getTotalCount() {
        axios
          .get("http://localhost:3000/eduInfoList")
          .then(function (res) {
            setTotalCnt(res.data.cnt); // 데이터의 총 개수를 할당
            getSubList(choice, search, page );
          })
          .catch(function (err) {
            alert(err);
          });
      }
      
      useEffect(function () {
        getEduInfoList();
        getTotalCount(); // 데이터의 총 개수를 가져오는 요청
      }, []);


    function pageChange(page) {
        const pageNumber = parseInt(page, 10);

        setPage(pageNumber);
        getSubList(choice, search, pageNumber);
    }

    function searchBtn(){
        getSubList(choice, search, 0);
    }
    
    function handlePageChange(pageNumber) {
        // 페이지 번호 변경 이벤트 처리
        setPage(pageNumber);
        getSubList(choice, search, pageNumber );
      }
      
    return (

    <div className='eduinfolist'>
        <div style={{marginTop:"-627PX"}}>
                <h2 style={{marginLeft:"34px", color:"#434343", marginTop:"-15px", fontSize:"2em", fontWeight:"bold"}}>교육정보</h2>
                <p>최신 교육 정보를 제공합니다.</p>
                <div style={{width:"250px"}}>
                      {userAuth === 'admin' && (  
                        <button type="button" className="learnBtn"  onClick={eduwrite}>
                            글쓰기
                        </button>
                    )}  
                </div>
            </div>  

        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"40px"}}>
            <div style={{display:"flex", marginTop:"-140px", justifyContent:"flex-end"}}>
                    
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

            <div className='educontentwrapper'>
                {
                    subList && subList.map(function(list, i){
                        const isSpecialItem = i % 3 === 0;
                        const isAnotherSpecialItem = i % 3 === 1;
                        const isYetAnotherSpecialItem = i % 3 === 2;
                        const itemClassName = `item-${i} eduwrapper ${isSpecialItem ? 'specialItem' : ''} ${isAnotherSpecialItem ? 'anotherSpecialItem' : ''} ${isYetAnotherSpecialItem ? 'yetAnotherSpecialItem' : ''}`;

                    return (

                    <div key={i}  className={itemClassName}
                        style={{display:"inline-block", padding:"6px", border:"2px solid lightgray", textAlign:"left", width:"280px", height:"150px"}}>
                        <p style={{fontWeight:"bold", marginTop:"8px"}}>{list.title}</p>
                        <p style={{marginTop:"8px"}}>{list.subject}</p>
                        <p style={{marginTop:"8px"}}> {list.regdate}</p>
                        <button type="button" className='edubtn'>
                            <Link style={{textDecoration:"none"}} to={`/cheesefriends/learning/EduInfoDetail/${list.seq}`}>확인하기</Link></button>
                    </div>
                )
            })
        }
        </div>
        <Pagination
            activePage={page}
            itemsCountPerPage={6}
            totalItemsCount={totalCnt}
            pageRangeDisplayed={6}
            firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
            lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
            prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
            nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
            onChange={handlePageChange} />
     
       </div>
       </div>
    )
};
