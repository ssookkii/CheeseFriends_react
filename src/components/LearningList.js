import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import Pagination from 'react-js-pagination';
import './asset/css/LearningList.css';
import { useNavigate, Link } from 'react-router-dom';
import { faAngleRight, faAngleLeft, faAnglesLeft, faAnglesRight  } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LearningList() {

  const [learnList, setLearnList] = useState([]);
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
    const [edu_code, setEdu_code] = useState("");
    const [subCode, setSubCode] = useState("");
    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/learning/LearningWrite')
    }
    function tasklink(){
        movePage('/cheesefriends/learning/TaskList');
    }
    function qnalink() {
        movePage('/cheesefriends/learning/QnaLearningList');
    }
   
    const [subNames, setSubNames] = useState([]);

    useEffect(() => {
      if (userAuth === "teacher") {
          const userId = loginInfo?.id;
          if(userId) {
          setCurrentUserId(userId);
          console.log(userId);
          }
          axios
            .post("http://localhost:3000/eduselect", null, { params: { id: userId } })
            .then(function (resp) {
              console.log(resp.data);
              setEdu_code(resp.data.educode);
      
              axios
                .post("http://localhost:3000/subselect", null, {
                  params: { id: userId, educode: resp.data.educode },
                })
                .then(function (resp) {
                  console.log(resp.data);
                  setUserSubjects(resp.data);
                })
                .catch(function (err) {
                  console.log(err);
                  alert("err");
                });
            })
            .catch(function (err) {
              console.log(err);
              alert("err");
            })

      } else if(userAuth === "student") {
          const userId = loginInfo?.id;
          if(userId) {
          setCurrentUserId(userId);
          console.log(userId);
      }


      axios.get("http://localhost:3000/sublist")
        .then(function (resp) {
          console.log(resp.data); // 현재 수강중인 과목 목록
          
          const subNames = resp.data.list.map(item => item.subName);
          console.log(subNames);
          setSubNames(subNames);

        })
        .catch(function (err) {
          console.log(err);
          alert("err");
        });
      }
    }, []);


    // const getSubList = useCallback(async (c, s, p) => {
    //   await axios.get('http://localhost:3000/learninglist', { params: { "choice": c, "search": s, "pageNumber": p } })
    //     .then(function (res) {
    //       // 데이터 처리 로직
    //     })
    //     .catch(function (err) {
    //       console.log(err);
    //     });
    // }, [userAuth, subject, userSubjects]);
 
    const getLearnList = useCallback(() => {
      axios.get("http://localhost:3000/learninglist")
        .then(function(resp) {
          setLearnList(resp.data);  // 전체 강의 목록
          console.log(resp.data);
        })
        .catch(function(err){
          // alert(err);
        });
    }, [userSubjects]);

    useEffect(() => {
      getLearnList();
    }, [getLearnList]);
  
    const SelectBox = () => {
      if(userAuth === "teacher"){
        return (
          <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject' style={{marginRight:"3px", marginBottom:"8px"}}>
             {Array.isArray(userSubjects) && userSubjects.map((subject) => (
                  <option key={subject.subCode} value={subject.subname}>{subject.subname}</option>
              ))}
          </select>
      );
      } else if(userAuth ==="student") {
        return (
          <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject' style={{marginRight:"3px", marginBottom:"8px"}}>
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

  function searchBtn(){
      // if(choice.toString().trim() === "" || search.toString().trim() === "") return;
      getSubList(choice, search, 0);
  }

  const getSubList = useCallback(async (c, s, p) => {
    await axios.get('http://localhost:3000/learninglist', { params: { "choice": c, "search": s, "pageNumber": p } })
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
        <div className="learninglist" style={{marginTop:"120px"}}>
            <div className='shelterPageWrap'>
              <div style={{width:"247.94px", textAlign:"center", marginTop:"-190px"}}>
                <h2 className='maintitle' style={{marginTop:"-175px"}}>학습자료실</h2>

                    {/* {userAuth === 'teacher' && ( */}
                        <button type="button" className="learnBtn"  onClick={writelink}>
                            글쓰기
                        </button>
                     {/* )}  */}
                    {/* {userAuth === 'student' && ( */}
                        <button type="button" className="taskBtn"  onClick={tasklink}>
                            과제제출하기
                        </button>
                     {/* )} */}
                    {/* {userAuth === 'student' && (  */}
                        <button type="button" className="qnabtn"  onClick={qnalink}>
                            수업질문하기
                        </button>
                     {/* )}  */}

                </div>
            </div>


        {/* 목록 */}
        <div style={{display:"block", width:"1000px", marginTop:"25px", marginLeft:"20px"}}>
            <div style={{display:"flex", marginTop:"-137px", justifyContent:"flex-end"}}>      
            <SelectBox />
        </div>
        <div>
        <table className="lectable" style={{ marginTop: "10px" }}>
      <thead>
        <tr style={{ backgroundColor: "#FFEBB4", height: "35px" }}>
          <th scope="col" style={{ fontWeight: "bold", color: "#434343" }}>번호</th>
          <th scope="col" style={{ fontWeight: "bold", color: "#434343" }}>과목</th>
          <th scope="col" style={{ fontWeight: "bold", color: "#434343" }}>제목</th>
          <th scope="col" style={{ fontWeight: "bold", color: "#434343" }}>작성일</th>
          <th scope="col" style={{ fontWeight: "bold", color: "#434343" }}>작성자</th>
        </tr>
      </thead>
      <tbody>
        {subList.map((list, i) => (
          <tr key={i} className='empty-row'>
            <td>{list.seq}</td>
            <td>{list.subject}</td>
            <td>
              <Link
                style={{
                  textDecoration: "none",
                  fontWeight: "bold",
                  color: "#fac463",
                }}
                to={`/cheesefriends/learning/LearningDetail/${list.seq}`}
              >
                {list.title}
              </Link>
            </td>
            <td>{list.regdate}</td>
            <td>{list.writer}</td>
          </tr>
        ))}
      </tbody>
    </table>
        </div>
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

