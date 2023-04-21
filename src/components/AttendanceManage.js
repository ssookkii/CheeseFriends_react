import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import './asset/css/AttendanceManage.css';


function AttendanceManage() {

      // 세션 스토리지
  const userId = sessionStorage.getItem("userId");
  const eduCode = sessionStorage.getItem("eduCode");
  const subCode = sessionStorage.getItem("subCode");

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceData, setAttendanceData] = useState([]);
    const [isBeforeClassAlertEnabled, setIsBeforeClassAlertEnabled] = useState(false);
    const [isAbsentAlertEnabled, setIsAbsentAlertEnabled] = useState(false);

    function formatDate(date, format) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return format.replace(/yyyy/, year).replace(/MM/, month).replace(/dd/, day);
      }
      

      const [subjects, setSubjects] = useState([]);

      useEffect(() => {
        // 백엔드에서 과목 데이터를 가져오는 API 호출
        axios.get(`http://localhost:3000/attManage/subjects/${userId}`)
            .then((response) => {
              setSubjects(response.data);
              console.log(response.data);
      
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
        // 선택한 과목에 대한 출결 데이터를 가져오는 API 호출 
        // EDU코드 어떻게 할 것인지 판별.
        axios.get(`http://localhost:3000/attManage/${userId}/${selectedSubject}/${eduCode}`)
          .then(response => {
            setAttendanceData(response.data);
            console.log(response.data);
          })
          .catch(error => {
            console.error(error);
          });
      }, [selectedSubject]);

      function getAttendanceStats(attendanceData, selectedDate) {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth() + 1;
        
        const stats = {
          absent: 0,
          late: 0,
          attend: 0,
        };
      
        attendanceData.forEach((data) => {
          const date = new Date(data.attendanceTime);
          if (date.getFullYear() === year && date.getMonth() + 1 === month) {
            if (data.status === "결석") {
              stats.absent++;
            } else if (data.status === "지각") {
              stats.late++;
            } else {
              stats.attend++;
            }
          }
        });
      
        return stats;
      }
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
    };

    const handleBeforeClassAlertChange = (e) => {
        setIsBeforeClassAlertEnabled(e.target.checked);
    };

    const handleAbsentAlertChange = (e) => {
        setIsAbsentAlertEnabled(e.target.checked);
    };
    const handleActiveDateChange = ({ activeStartDate }) => {
        setSelectedDate(activeStartDate);
      };




    const attendanceStats = getAttendanceStats(attendanceData, selectedDate);

  return (
    <div className="attendance-manage-container">
<nav className='att_manage'>
  <ul>
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
</nav>

      <div className="attendance-stats">
      <h2 style={{ fontSize: '20px' }} className="attendance-month">
  {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 출결 통계
</h2>
<br/>
<div className='attcheck' style={{ display: 'flex', justifyContent: 'space-between' }}>
  <p style={{color:'#A1c3B3', fontWeight:'bold'}} > 출석: {attendanceStats.attend}회  </p>       
  <p style={{color:'#FFDC9D',fontWeight:'bold'}}> 지각: {attendanceStats.late}회 </p>
  <p style={{color:'#FFA1A1',fontWeight:'bold'}}>결석: {attendanceStats.absent}회 </p>
</div>

</div>
      <div className="calendar-wrapper">
        <div className="checkbox-wrapper">
          <br/><br/><br/><br/>
          <img src="/img/alarm.png" alt="알림 이미지" width="150px" height="auto"/>
          <br/><br/>
          <div className="checkboxes">
            <label>
              <span>수업 시작 5분 전 알림</span>
              <input
                type="checkbox"
                checked={isBeforeClassAlertEnabled}
                onChange={handleBeforeClassAlertChange}
              />
            </label>
            <br/><br/>
            <label>
              <span>'결석' 처리 알림</span>
              <input
                type="checkbox"
                checked={isAbsentAlertEnabled}
                onChange={handleAbsentAlertChange}
              />
            </label>
          </div>
        </div>
        <div className="calendar-container">
                        <Calendar
                onChange={handleDateChange}
                onActiveDateChange={handleActiveDateChange}
                value={selectedDate}
                tileContent={({ date, view }) => {
                    if (view !== "month") {
                    return null;
                    }

                    const dateString = formatDate(date, "yyyy-MM-dd");
                    const statusData = attendanceData.find(data => data.attendanceTime.startsWith(dateString));

                    return (
                    <div>
                        {statusData ? <div>{statusData.status}</div> : null}
                    </div>
                    );
                }}
                tileClassName={({ date, view }) => {
                    if (view !== "month") {
                    return null;
                    }

                    const dateString = formatDate(date, "yyyy-MM-dd");
                    const statusData = attendanceData.find(data => data.attendanceTime.startsWith(dateString));

                    if (!statusData) {
                    return null;
                    }

                    if (statusData.status === "결석") {
                    return "absent";
                    } else if (statusData.status === "지각") {
                    return "late";
                    } else {
                    return "attend";
                    }
                }}
                />
        </div>
      </div>



    </div>
  );
}

export default AttendanceManage;