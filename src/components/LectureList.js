import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './asset/css/LectureList.css';
import axios from "axios";
import Pagination from 'react-js-pagination';

import { faAngleRight, faAngleLeft, faCheese, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LectureList() {

    const [lecturelist, setLecturelist] = useState([]);
    const [id, setId] = useState("");
    const [userEdu, setUserEdu] = useState(
      localStorage.getItem("userEdu")
  );
    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userAuth = loginInfo?.auth;

    // console.log(userId);
    // console.log(userAuth);
    const [currentUserId, setCurrentUserId] = useState('');
    const [userSubjects, setUserSubjects] = useState([]);
    const [eduCode, setEduCode] = useState("");
    const [subCode, setSubCode] = useState("");
    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/lecture/LectureWrite')
    }


    const [subNames, setSubNames] = useState([]);

    useEffect(() => {
      if (userAuth === "teacher") {
        const userId = loginInfo?.id;
        if (userId) {
          setCurrentUserId(userId);
          console.log(userId);
        }
        axios
          .post("http://localhost:3000/eduselect", null, { params: { id: userId } })
          .then(function (resp) {
            console.log(resp.data);
            setEduCode(resp.data.educode);
    
            return axios.post("http://localhost:3000/subselect", null, {
              params: { id: userId, educode: resp.data.educode },
            });
          })
          .then(function (resp) {
            console.log(resp.data);
            setUserSubjects(resp.data);
          })
          .catch(function (err) {
            console.log(err);
            alert("err");
          });
      } else if (userAuth === "student") {
        const userId = loginInfo?.id;
        if (userId) {
          setCurrentUserId(userId);
           console.log(userId); // 사용자아이디
        }
        axios
          .get("http://localhost:3000/homeEduCode", { params: { id: userId } })
          .then(function (resp) {
             console.log(resp.data); // 사용자가 수강중인 학원 코드 EDU001
             
    
            axios
              .get("http://localhost:3000/subjectlist", { params: { edu_code: userEdu } })
              .then(function (resp) {
                // console.log(resp.data); // 사용자가 수강중인 학원의 전과목 정보
                const subCode = resp.data.map((item) => item?.subcode);
                console.log(subCode); // 현재 학원 전체 과목 코드
    
                axios.get("http://localhost:3000/approvedcheck", { params: { "id":currentUserId, "subcode":subCode } })
                  .then(function (resp) {
                    console.log(resp.data);
                  })
                  .catch(function (err) {
                    console.log(err);
                    alert("err");
                  });
              })
              .catch(function (err) {
                console.log(err);
                alert("err");
              });
          })
          .catch(function (err) {
            console.log(err);
            alert("err");
          });
      }
    }, []);

    //       axios.get("http://localhost:3000/getSub", { params: {"subcode":subCode } })
    //       .then(function (resp) {

    //         console.log("state : " + resp.data);

    //         // if(resp.data === 'approved'){
    //         //     alert("이미 수강중인 학습입니다")
    //         // }else if(resp.data === 'approving'){
    //         //     alert("수강 승인 대기중인 학습입니다")
    //         // }else if(resp.data === 'quiting'){
    //         //     alert("탈퇴 진행 중인 학습입니다")
    //         // }else{
    //         //     axios.get("http://localhost:3000/eduname", { params: { "edu_code": edu_code } })
    //      })
    //      .catch(function (err) {
    //       console.log(err);
    //       alert("err");
    //     });
    //   })
    //   .catch(function (err) {
    //     console.log(err);
    //     alert("err");
    //   });


      const getLecList = useCallback(() => {
        axios.get("http://localhost:3000/lecturelist")
          .then(function(resp) {
            setLecturelist(resp.data);  // 전체 강의 목록
            console.log(resp.data);
          })
          .catch(function(err){
            // alert(err);
          });
      }, [userSubjects]);

      useEffect(() => {
        getLecList();
      }, [getLecList]);
    
      const SelectBox = () => {
        if(userAuth === "teacher"){
          return (
            <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
               {Array.isArray(userSubjects) && userSubjects.map((subject) => (
                    <option key={subject.subCode} value={subject.subname}>{subject.subname}</option>
                ))}
            </select>
        );
        } else if(userAuth ==="student") {
          return (
            <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
              {Array.isArray(subNames) && subNames.map((subName) => (
                <option key={subName} value={subName}>{subName}</option>
              ))}
            </select>
          );
        }
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
  
    const getSubList = useCallback(async (c, s, p) => {
      await axios.get('http://localhost:3000/lecturelist', { params: { "choice": c, "search": s, "pageNumber": p } })
        .then(function (res) {
          let fetchedList = res.data.list;
    
          // 과목 필터링
          if (userAuth === "teacher") {
            fetchedList = fetchedList.filter(item => item.subject === subject);
          } else if (userAuth === "student") {
            fetchedList = fetchedList.filter(item => userSubjects.find(subject => subject.subname === item.subject));
          } 
    
          const fetchedListLength = fetchedList.length;
    
          if (fetchedListLength <= 10) {
            // 전체 데이터가 10개 이하일 경우, 나머지 빈 데이터를 추가하여 10개로 맞춥니다.
            const targetRowCount = 10; // 목표 행 개수
            const emptyRow = {}; // 빈 행 데이터 객체
    
            const emptyRowCount = targetRowCount - fetchedListLength;
            for (let i = 0; i < emptyRowCount; i++) {
              fetchedList.push(emptyRow);
            }
    
            setSubList(fetchedList);
            setTotalCnt(fetchedListLength);
          } else {
            // 전체 데이터가 10개보다 많을 경우, 페이지네이션을 적용하여 데이터를 나누어 보여줍니다.
            const targetRowCount = 10; // 목표 행 개수
            const emptyRow = {}; // 빈 행 데이터 객체
    
            // 작은 목록에 대한 행 개수 설정
            if (fetchedListLength < targetRowCount) {
              const emptyRowCount = targetRowCount - fetchedListLength;
              for (let i = 0; i < emptyRowCount; i++) {
                fetchedList.push(emptyRow);
              }
            }
    
            setSubList(fetchedList);
            setTotalCnt(res.data.cnt);
          }
    
          console.log(res.data);
        })
        .catch(function (err) {
          console.log(err);
        });
    }, [userAuth, subject, userSubjects]);

      // 페이지 설정
      const pageChange = (page) => {
        setPage(page);
        getSubList(choice, search, page - 1);
      };

      useEffect(() => {
        getSubList(choice, search, page - 1);
      }, [getSubList, choice, search, page]);


    return(
        <div className="lecmain">
            <div className='shelterPageWrap'>
              <div style={{width:"247.94px", textAlign:"center"}}>
                  <h2 className='maintitle' style={{marginTop:"-203px"}}>인강학습실</h2>
                      {(userAuth === 'teacher' &&
                        <button type="button" className="lecBtn" onClick={writelink}>
                              글쓰기
                        </button>
                      )} 
              </div>
        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px", fontSize:"1em", color:"#434343"}}>
            <div style={{display:"flex", marginTop:"-208px", justifyContent:"flex-end"}}>           
            
            <SelectBox />

        </div>
        <table className="lectable">
            <thead>
                <tr style={{backgroundColor:"#ffebb4", height:"35px"}}>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>번호</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>과목</th>
                    <th scope="col" style={{fontWeight:"bold", color:"#434343"}}>제목</th>
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
        {totalCnt > 10 && (
          <Pagination
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={totalCnt}
            pageRangeDisplayed={10}
            firstPageText={<FontAwesomeIcon icon={faAnglesLeft} />}
            lastPageText={<FontAwesomeIcon icon={faAnglesRight} />}
            prevPageText={<FontAwesomeIcon icon={faAngleLeft} />}
            nextPageText={<FontAwesomeIcon icon={faAngleRight} />}
            onChange={pageChange}
          />
        )}
        </div>
                
    </div>
  </div>
    )

  }
