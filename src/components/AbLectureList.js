import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './asset/css/LectureList.css';
import axios from "axios";
import Pagination from 'react-js-pagination';
import { useEffect } from 'react';

import { faCheese, faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AbLectureList() {
    const [lecturelist, setLecturelist] = useState([]);

    const login = JSON.parse(localStorage.getItem("login"));
    const userAuth = login.auth;

    const attendanceID = JSON.parse(localStorage.getItem("attendanceID"));
    const absent = attendanceID.state;
    const [userSubjects, setUserSubjects] = useState([]);
    const [edu_code, setEdu_code] = useState("");

    
    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    
    const abStudent = login.absent;

    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/lecture/LectureWrite')
    }

    function getLecList() {
        axios.get("http://localhost:3000/lecturelist")
        .then(function(resp){
            setLecturelist(resp.data);
            console.log(resp.data);
            
        })
        .catch(function(err){
            console.log(err);
        })

    }
    useEffect(function(){
        getLecList(0);
    },[]);
    
  
    useEffect (()=>{
       
        axios.post("http://localhost:3000/eduselect", null, { params:{ "id":login.id}})
        .then(function(resp){   
            console.log(resp.data); 

            setEdu_code(resp.data.educode);

            axios.post("http://localhost:3000/subselect", null, { params:{ "id":login.id, "educode":resp.data.educode}})
            .then(function(resp){   
                console.log(resp.data); 
                setUserSubjects(resp.data);
                
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

    const SelectBox = () => {
        return (
            <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
                {userSubjects.map((subject)=> (
                    <option key={subject.subCode} value={subject.subname}>{subject.subname}</option>
                ))}
            </select>
        );
    };

    const changeSelectOptionHandler = (e) => {
        const selectedSubject = e.target.value;
        setSubject(selectedSubject);
    };

    useEffect(() => {
        // 기존의 선택된 과목 값을 가져온다
        const selectedSubject = localStorage.getItem("subject");
        if (selectedSubject) {
          setSubject(selectedSubject);
        }
      }, []);
      
      useEffect(() => {
        // subject 값이 변경될 때마다 로컬 스토리지에 저장한다
        localStorage.setItem("subject", subject);
      }, [subject]);
  
    const [subList, setSubList] = useState([]);
    const [choice, setChoice] = useState('');
    const [search, setSearch] = useState('');

    
     // paging
     const [page, setPage] = useState(1);
     const [totalCnt, setTotalCnt] = useState(0);
 
      // 검색
     let navigate = useNavigate();
 
    function searchBtn(){
        // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
        getSubList(choice, search, 0);
    }
 
      // 페이지 설정
      function pageChange(page) {
            setPage(page);
            getSubList(choice, search, page-1);
        }

        useEffect(() => {
            getSubList(choice, search, page - 1);
        }, [choice, search, page]);
  
     const getSubList = async (c, s, p) => {
         await axios.get('http://localhost:3000/lecturelist', { params:{ "choice":c, "search":s, "pageNumber":p} })
         .then(function(res){
            let fetchedList = res.data.list;
            const fetchedListLength = fetchedList.length;

            // 작은 목록에 대한 행 개수 설정
            const targetRowCount = 10; // 목표 행 개수
            const emptyRow = {}; // 빈 행 데이터 객체

            // 작은 목록일 경우 빈 행 추가
            if (fetchedListLength < targetRowCount) {
                const emptyRowCount = targetRowCount - fetchedListLength;
                for (let i = 0; i < emptyRowCount; i++) {
                fetchedList.push(emptyRow);
                }
            }

            setSubList(fetchedList);
            setTotalCnt(res.data.cnt); // 글의 총수
            console.log(res.data);
            })
            .catch(function (err) {
            console.log(err);
            });
        };
        // 작은 목록에 대한 행 개수 설정
        const targetRowCount = 10; // 목표 행 개수
        const emptyRow = {}; // 빈 행 데이터 객체

        // 작은 목록일 경우 빈 행 추가
        if (subList.length < targetRowCount) {
        const emptyRowCount = targetRowCount - subList.length;
        for (let i = 0; i < emptyRowCount; i++) {
            subList.push(emptyRow);
        }

    }

    if(abStudent === 'absent') {
    return(
        
        <div className="lecmain">
            <div style={{marginTop:"-627PX"}}>
                <h2 style={{marginLeft:"15px", color:"#434343", marginTop:"-63px", fontSize:"2em"}}>결석학생용</h2>
                <div>
                    {userAuth === 'teacher' && (
                        <button type="button" className="lecBtn" style={{width:"221px"}} onClick={writelink}>
                              글쓰기
                      </button>
                    )}
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
                <button onClick={searchBtn} style={{marginTop:"14px"}}>검색</button>
            </div>
            <table className="lectable" style={{marginTop:"28px"}}>
                <thead>
                    <tr style={{backgroundColor:"#FFEBB4", height:"35px"}}>
                        <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>번호</th>
                        <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>과목</th>
                        <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>강의제목</th>
                        <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>작성일</th>
                        <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>재생하기</th>
                    </tr>
                </thead>
            <tbody className="table-group-divider">
            {
                subList.map(function(list, i){
                    return (
                        <tr key={i}>
                            <td>{list.seq}</td>
                            <td>{list.subject}</td>
                            <td>
                                 {list.title}
                            </td>
                            <td>{list.regdate}</td>
                            <td style={{paddingLeft:"34px"}}>
                            <Link style={{textDecoration:"none"}} to={`/cheesefriends/lecture/LectureDetail/${list.seq}`}><FontAwesomeIcon icon={faCheese} /></Link>
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
            </table>
            <br/>
            <Pagination
                    activePage={page}
                    itemsCountPerPage={10}
                    totalItemsCount={totalCnt}
                    pageRangeDisplayed={10}
                    firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                    lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                    prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                    nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                    onChange={pageChange} />
            </div>
        </div>
       )
    }

        return (
            <div className="lecmain">
            <div style={{marginTop:"-627PX"}}>
                <h2 style={{marginLeft:"21px", color:"#434343", marginTop:"-63px", fontSize:"2em", fontWeight:"bold"}}>인강학습실</h2>
                <div>
                      {(userAuth === 'teacher' &&
                        <button type="button" className="lecBtn" onClick={writelink}>
                              글쓰기
                      </button>
                      )} 
                </div>
            </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-208px", justifyContent:"flex-end"}}>           
            
            <SelectBox />

        </div>
        <table className="lectable" style={{marginTop:"28px"}}>
            <thead>
                <tr style={{backgroundColor:"#FFEBB4", height:"35px"}}>
                    <th scope="col" style={{fonWeight:"bold", color:"#434343"}}>번호</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>과목</th>
                    <th scope="col" style={{fontWetight:"bold", color:"#434343"}}>강의제목</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>작성일</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>재생하기</th>
                </tr>
            </thead>
            <tbody>
            {
                subList.map(function(list, i){
                    const showLink = Boolean(list.subject);
                    if (subject !== '' && list.subject !== subject) {
                        if (Object.keys(list).length === 0) {
                          return (
                            <tr key={i} className='empty-row'>
                              <td></td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          );
                        } else {
                          return null; // 선택한 과목과 다른 경우 null을 반환하여 해당 항목을 건너뜁니다.
                        }
                      }
                    
                    return (
                        <tr key={i} className='empty-row'>
                            <td>{list.seq}</td>
                            <td>{list.subject}</td>
                            <td>
                                 {list.title}
                            </td>
                            <td>{list.regdate}</td>
                            <td style={{paddingLeft:"34px"}}>
                                {showLink? (
                                <Link style={{textDecoration:"none"}} to={`/cheesefriends/lecture/LectureDetail/${list.seq}`}><FontAwesomeIcon icon={faCheese} /></Link>
                                ) : null}
                            </td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
        <br/>
        <Pagination
                activePage={page}
                itemsCountPerPage={10}
                totalItemsCount={totalCnt}
                pageRangeDisplayed={10}
                firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
                lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
                prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
                nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
                onChange={pageChange} />
        </div>
                
    </div>

    );
}

