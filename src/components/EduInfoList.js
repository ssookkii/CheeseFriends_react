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
            setSubList(resp.data.list);
            setTotalCnt(resp.data.cnt);
            
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

    function getSubList(choice, search, page) {
        axios.get("http://localhost:3000/eduInfoList", {  params: { choice, search, pageNumber: page }, })
          .then(function(resp) {
            console.log(resp.data.list);
            setTotalCnt(resp.data.cnt);
            setSubList(resp.data.list);

          })
          .catch(function(err) {
            alert(err);
          });
      }
         
      useEffect(function() {
        // 페이지가 로드될 때 초기 목록을 가져오기 위해 한 번 호출합니다.
        getSubList(choice, search, page-1);
      }, [choice, search, page]);
      
         
      function searchBtn() {
        getSubList(choice, search, 0);
      }
      
      function handlePageChange(page) {
        setPage(page);
        getSubList(choice, search, page-1);
      }

    return (

    <div className='eduinfolist'>
        <div className='shelterPageWrap'>
        <div style={{width:"247.94px", textAlign:"center", marginTop:"-204px"}}>
                <h2 className='maintitle' style={{marginTop:"-160px"}}>교육정보</h2>
                <p style={{marginTop:"8px"}}>최신 교육 정보를 제공합니다.</p>
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
                    
                    <select value={choice} onChange={(e)=>setChoice(e.target.value)}
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
                        style={{display:"inline-block", padding:"6px", paddingBottom:"0px", border:"2px solid #fbca73", textAlign:"left", width:"300px", height:"200px"}}>
                        <p style={{fontWeight:"bold", marginTop:"8px"}}>{list.title}</p>
                        <p style={{marginTop:"8px"}}>{list.subject}</p>
                        <p style={{marginTop:"8px"}}> {list.regdate}</p>

                        <button type="button" className='cardbtn'>
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
