import React, { useState, useEffect } from 'react';
import axios from "axios";
import './asset/css/AttendanceManageTeacher.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';


function AttendanceManageTeacher() {
      // 세션 스토리지
      const userId = sessionStorage.getItem("userId");
      const eduCode = sessionStorage.getItem("eduCode");
      const subCode = sessionStorage.getItem("subCode");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchText, setSearchText] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchMethod, setSearchMethod] = useState('date'); // 검색 방법 (기본값: 날짜별 검색)
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const [studentsPerPage] = useState(10); // 한번에 보여줄 항목 수
  const [maxPageNumbers] = useState(5); // 한 번에 표시할 최대 페이지 번호
  const [currentPageGroup, setCurrentPageGroup] = useState(1); // 현재 페이지 그룹
  const [sortColumn, setSortColumn] = useState(null); // 정렬할 열
const [sortOrder, setSortOrder] = useState(0); // 정렬 순서 (0: 기본, 1: 오름차순, -1: 내림차순)
const [renderCount, setRenderCount] = useState(0);


  function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return format.replace(/yyyy/, year)
                 .replace(/MM/, month)
                 .replace(/dd/, day)
                 .replace(/HH/, hour)
                 .replace(/mm/, minute);
  }

  useEffect(() => {
    // 백엔드에서 과목 데이터를 가져오는 API 호출
    axios.get(`http://localhost:3000/attManage/subjects/${userId}`)
        .then((response) => {
          setSubjects(response.data);
          //console.log(response.data);
  
          // 첫번째 항목을 기본 선택으로 설정
          if (response.data.length > 0) {
            setSelectedSubject(response.data[0].subCode);
          }
        })
        .catch((error) => {
          console.error(error);
        });
  }, []);


  useEffect(() => {
    if (!selectedSubject) return; // 선택된 과목이 없으면 함수 실행을 중지합니다.
    
    // 백엔드에서 출석 데이터를 가져오는 API 호출
    axios
      .get(`http://localhost:3000/attManage/${selectedSubject}`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [selectedSubject, selectedDate, searchText]);
  


// 정렬하기
const updateSortState = (column) => {
  if (sortColumn === column) {
    setSortOrder((sortOrder + 2) % 3 - 1);
  } else {
    setSortColumn(column);
    setSortOrder(1);
  }
};

//학생 정렬
const getSortedStudents = (studentsToSort, sortConfig) => {
  const filteredStudents = studentsToSort.filter((student) => {
    if (searchMethod === 'date') { // 날짜별 검색
      const attendanceDate = new Date(student.attendanceTime).toLocaleDateString();
      const selectedDateStr = selectedDate.toLocaleDateString();
      return attendanceDate === selectedDateStr;
    } else { // 이름별 검색
      return student.name.includes(searchText);
    }
  });
  
  if (sortOrder === 0) return filteredStudents;
  
  const compare = (a, b) => {
    if (sortColumn === "name") {
      return a.name.localeCompare(b.name) * sortOrder;
    } else if (sortColumn === "attendanceTime") {
      return (new Date(a.attendanceTime) - new Date(b.attendanceTime)) * sortOrder;
    } else if (sortColumn === "status") {
      return a.status.localeCompare(b.status) * sortOrder;
    }
    return 0;
  };
  
  return filteredStudents.slice().sort(compare);
};

const [sortConfig, setSortConfig] = useState({
  key: '',
  direction: '',
});

const filteredStudents = students.filter((student) => {
  if (searchMethod === 'date') { // 날짜별 검색
    const attendanceDate = new Date(student.attendanceTime).toLocaleDateString();
    const selectedDateStr = selectedDate.toLocaleDateString();
    return attendanceDate === selectedDateStr;
  } else { // 이름별 검색
    return student.name.includes(searchText);
  }
});

// 페이지네이션 처리
const indexOfLastStudent = currentPage * studentsPerPage;
const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
const currentStudents = getSortedStudents(filteredStudents, sortConfig).slice(
  indexOfFirstStudent,
  indexOfLastStudent
);

const paginate = (pageNumber) => setCurrentPage(pageNumber);

const pageNumbers = [];
for (let i = 1; i <= Math.ceil(filteredStudents.length / studentsPerPage); i++) {
  pageNumbers.push(i);
}
const numberOfPageGroups = Math.ceil(pageNumbers.length / maxPageNumbers);

const nextPageGroup = () => {
  if (currentPageGroup < numberOfPageGroups) {
    setCurrentPageGroup(currentPageGroup + 1);
  }
};

const prevPageGroup = () => {
  if (currentPageGroup > 1) {
    setCurrentPageGroup(currentPageGroup - 1);
  }
};
const nextPageInGroup = () => {
  if (currentPage < (currentPageGroup * maxPageNumbers)) {
    setCurrentPage(currentPage + 1);
  }
};

const prevPageInGroup = () => {
  if (currentPage > ((currentPageGroup - 1) * maxPageNumbers) + 1) {
    setCurrentPage(currentPage - 1);
  }
};
const totalAttendanceStats = students.reduce(
  (acc, student) => {
    if (student.status === "출석") {
      acc.attendanceCount++;
    } else if (student.status === "결석") {
      acc.absenceCount++;
    } else if (student.status === "지각") {
      acc.lateCount++;
    }
    return acc;
  },
  { attendanceCount: 0, absenceCount: 0, lateCount: 0 }
);



const attendanceStats = filteredStudents.reduce(
  (acc, student) => {
    if (student.status === "출석") {
      acc.attendanceCount++;
    } else if (student.status === "결석") {
      acc.absenceCount++;
    } else if (student.status === "지각") {
      acc.lateCount++;
    }
    return acc;
  },
  { attendanceCount: 0, absenceCount: 0, lateCount: 0 }
);


// 춝결 정보 수정
const handleAttendanceButtonClick = (attendanceID, status) => {
  axios.post(`http://localhost:3000/attManage/${attendanceID}/attendance`, { status })
    .then(response => {
      axios
      .get(`http://localhost:3000/attManage/${selectedSubject}`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch(error => {
      console.error(error);
    });
};


const handleCommentChange  = (attendanceID, comment) => {
  axios.post(`http://localhost:3000/attManage/${attendanceID}/comment`, { comment })
    .then(response => {
      axios
      .get(`http://localhost:3000/attManage/${selectedSubject}`)
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
    })
    .catch(error => {
      console.error(error);
    });
};

  return (
    <div className="attendance-manage-teacher-container">
      <br/>
      <nav style={{backgroundColor:'white'}}>
         <ul style={{ fontSize: '22px' }}>
        {subjects.map((subject) => (
      <li
        key={subject.subCode}
        className={selectedSubject === subject.subCode ? 'active' : ''}
        onClick={() => setSelectedSubject(subject.subCode)}
        style={{ backgroundColor: selectedSubject === subject.subCode ? '#FFDC9D' : 'transparent' }}
      >
        {subject.subName}
      </li>
    ))}
        </ul>
        

        <ul style={{marginTop: '12px', marginLeft: '170px' }}>
          <li
            className={searchMethod === 'date' ? 'active' : ''}
            onClick={() => setSearchMethod('date')}
            style={{ fontSize: '14px'}}
          >
            날짜별
          </li>
          <li
            className={searchMethod === 'name' ? 'active' : ''}
            onClick={() => setSearchMethod('name')}
            style={{ fontSize: '14px' }}
          >
            이름별
          </li>
        </ul>

        {searchMethod === 'date' && (
          <div className="date-picker-container">
            <input
              type="date"
              value={selectedDate.toISOString().substr(0, 10)}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
            />
          </div>
        )}

        {searchMethod === 'name' && (
          <div className="search-container">
            <input
              type="text"
              placeholder="학생 이름 입력"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100px' }}
            />
            <button style={{ fontSize: '13px', backgroundColor: '#FFDC9D' }}>검색</button>
          </div>
        )}
      </nav>
<div className='attcheck' style={{ display: 'flex', justifyContent: 'space-between' }}>
  <p style={{color:'#A1c3B3', fontWeight:'bold'}} >출석: {attendanceStats.attendanceCount}회 </p>       
  <p style={{color:'#FFDC9D',fontWeight:'bold'}}> 지각: {attendanceStats.absenceCount}회 </p>
  <p style={{color:'#FFA1A1',fontWeight:'bold'}}>결석:{attendanceStats.lateCount}회</p>
</div>

      <div className="table-container">
        <table>
        <thead>
  <tr style={{ fontSize: "17px" }}>
  <th
  style={{ width: "80px" }}
  onClick={() => updateSortState("name")}
>
  이름 {sortColumn === "name" && sortOrder !== 0 && (sortOrder === 1 ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
</th>
<th
  style={{ width: "160px" }}
  onClick={() => updateSortState("attendanceTime")}
>
  출석 시간 {sortColumn === "attendanceTime" && sortOrder !== 0 && (sortOrder === 1 ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
</th>
<th
  style={{ width: "100px" }}
  onClick={() => updateSortState("status")}
>
  출석 현황 {sortColumn === "status" && sortOrder !== 0 && (sortOrder === 1 ? <FontAwesomeIcon icon={faSortUp} /> : <FontAwesomeIcon icon={faSortDown} />)}
</th>

    <th style={{ width: "180px" }}>메모</th>
    <th style={{ width: "310px" }}>출석 처리</th>
  </tr>
</thead>
          <tbody>
          {currentStudents.filter((student) => {
    if (searchMethod === 'date') { // 날짜별 검색
      const attendanceDate = new Date(student.attendanceTime).toLocaleDateString();
      const selectedDateStr = selectedDate.toLocaleDateString();
      return attendanceDate === selectedDateStr;
    } else { // 이름별 검색
      return student.name.includes(searchText);
    }
  }).map((student) => (
    <tr key={student.id} style={{ height: '40px' }}>
      <td>{student.name}</td>
      <td>{formatDate(new Date(student.attendanceTime), "yyyy-MM-dd HH:mm ")}</td>
        <td
                  style={{
                    backgroundColor:
                    student.status === '외출'
                      ? '#e0e2ff'
                      : student.status === '조퇴'
                      ? '#e0e2ff'
                      :student.status === '출석'
                        ? '#d0e4da'
                        : student.status === '지각'
                        ? '#f1e2c9'
                        : student.status === '결석'
                        ? '#fccaca' : ''
                        ,
}}
>
{student.status}
</td>
<td style={{ textAlign: 'center' }}>
    <input
      type="text"
      value={student.comment}
      onChange={(e) => handleCommentChange(student.attendanceID, e.target.value)}
      style={{ textAlign: 'center' }}
    />
  </td>
        <td>
          <div className="attendance-buttons">
          <button
                className={student.status === '출석' ? 'active' : ''}
                onClick={() => handleAttendanceButtonClick(student.attendanceID, '출석')}
                style={{ backgroundColor: student.status === '출석' ? '#d0e4da' : '#fff' }}
              >
                출석
              </button>
              <button
                className={student.status === '결석' ? 'active' : ''}
                onClick={() => handleAttendanceButtonClick(student.attendanceID, '결석')}
                style={{ backgroundColor: student.status === '결석' ? '#fccaca' : '#fff' }}
              >
                결석
              </button>
              <button
                className={student.status === '지각' ? 'active' : ''}
                onClick={() => handleAttendanceButtonClick(student.attendanceID, '지각')}
                style={{ backgroundColor: student.status === '지각' ? '#f1e2c9' : '#fff' }}
              >
                지각
              </button>
              <button
                className={student.status === '외출' ? 'active' : ''}
                onClick={() => handleAttendanceButtonClick(student.attendanceID, '외출')}
                style={{ backgroundColor: student.status === '외출' ? '#e0e2ff' : '#fff' }}
              >
                외출
              </button>
              <button
                className={student.status === '조퇴' ? 'active' : ''}
                onClick={() => handleAttendanceButtonClick(student.attendanceID, '조퇴')}
                style={{ backgroundColor: student.status === '조퇴' ? '#e0e2ff' : '#fff' }}
              >
                조퇴
              </button>

          </div>
        </td>
      </tr>
    ))}
  </tbody>
  </table>
            </div>
            <div className="pagination">
  <ul>
    <li>
      <a onClick={prevPageGroup}>&laquo;</a>
    </li>
    <li>
      <a onClick={prevPageInGroup}>&lt;</a>
    </li>
    {pageNumbers
      .slice((currentPageGroup - 1) * maxPageNumbers, currentPageGroup * maxPageNumbers)
      .map((number) => (
        <li key={number} className={currentPage === number ? "active" : ""}>
          <a onClick={() => paginate(number)}>{number}</a>
        </li>
      ))}
    <li>
      <a onClick={nextPageInGroup}>&gt;</a>
    </li>
    <li>
      <a onClick={nextPageGroup}>&raquo;</a>
    </li>
  </ul>
</div>
        </div>
        
    );
}


export default AttendanceManageTeacher;