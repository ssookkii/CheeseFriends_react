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
    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userAuth = loginInfo?.auth;
    const userId = loginInfo?.id;

    const [userSubjects, setUserSubjects] = useState([]);
    const [eduCode, setEduCode] = useState([]);
    const [subCode, setSubCode] = useState("");

    const [subject, setSubject] = useState(
        localStorage.getItem("subject")
    );

    const movePage = useNavigate();

    function writelink() {
        movePage('/cheesefriends/lecture/LectureWrite')
    }

    const [subNames, setSubNames] = useState([]);
    const [userEdu, setUserEdu] = useState(
      localStorage.getItem("userEdu")
  );

    function getEduCode(){
      axios.get("http://localhost:3000/homeEduCode", { params:{ "id":userId }})
      .then(function(resp){
          console.log(resp.data);
          setEduCode(resp.data);
      })
      .catch(function(err){
          alert("err");
          console.log(err);
      })
    }
    useEffect(function(){
      getEduCode();
    },[id]);

    // 과목 받아오기
    function subcodereceive(){
      setSubCode("");
      axios.get("http://localhost:3000/subselect", { params:{ "id":userId, "eduCode":userEdu}})
      .then(function(resp){

        console.log(resp.data);
        setSubNames(resp.data);
          
      })
      .catch(function(err){
          console.log(err);
          alert('err');
      }) 
   }

   useEffect(()=>{
    if(eduCode !== ""){
        subcodereceive();
        return;
    }
     }, [eduCode]) 

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
        return (
          <select onChange={changeSelectOptionHandler} value={subject} className='inputsubject'>
            {Array.isArray(subNames) && subNames.map((sub) => (
              <option key={sub.seq} value={sub.subname}>{sub.subname}</option>
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
    
          // 한 페이지당 과목 10개 이하일 때 빈 데이터 넣어서 맞춰주는 코드
          // 과목 필터링

          fetchedList = fetchedList.filter(item => item.subject === subject);

          const fetchedListLength = fetchedList.length;
    
          if (fetchedListLength <= 10) {
            const targetRowCount = 10; // 목표 행 개수
            const emptyRow = {}; // 빈 행 데이터 객체
          
            const emptyRowCount = targetRowCount - fetchedListLength;
            for (let i = 0; i < emptyRowCount; i++) {
              fetchedList.push(emptyRow);
            }
          
            setSubList(fetchedList);
            setTotalCnt(fetchedListLength);
          } else {
           
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
            {subList.map(function(list, i) {
              const showLink = Boolean(list.subject);
              if (subject !== '' && list.subject !== subject) {
                return null; // 선택한 과목과 다른 경우 null을 반환하여 해당 항목을 건너뜁니다.
              }
              return (
                <tr key={i}>
                  <td>{list.seq}</td>
                  <td>{list.subject}</td>
                  <td>{list.title}</td>
                  <td>{list.regdate}</td>
                  <td style={{ paddingLeft: "34px" }}>
                    {showLink ? (
                      <Link style={{ textDecoration: "none" }} to={`/cheesefriends/lecture/LectureDetail/${list.seq}`}>
                        <FontAwesomeIcon icon={faCheese} />
                      </Link>
                    ) : null}
                  </td>
                </tr>
              );
            })}
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

