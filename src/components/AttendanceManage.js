import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import './asset/css/AttendanceManage.css';

function AttendanceManage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSubject, setSelectedSubject] = useState('math');
    const [attendanceData, setAttendanceData] = useState([]);
    const [isBeforeClassAlertEnabled, setIsBeforeClassAlertEnabled] = useState(false);
    const [isAbsentAlertEnabled, setIsAbsentAlertEnabled] = useState(false);

    function formatDate(date, format) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return format.replace(/yyyy/, year).replace(/MM/, month).replace(/dd/, day);
      }
      
      useEffect(() => {
        axios.get(`http://localhost:3000/attManage/user01/SUB001/EDU001`)
          .then((response) => {
            setAttendanceData(response.data);
            console.log(response.data);
          })
          .catch((error) => {
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
      <nav>
        <ul>
          <li
            className={selectedSubject === 'math' ? 'active' : ''}
            onClick={() => setSelectedSubject('math')}
          >
            수학
          </li>
          <li
            className={selectedSubject === 'english' ? 'active' : ''}
            onClick={() => setSelectedSubject('english')}
          >
            영어
          </li>
          <li
            className={selectedSubject === 'korean' ? 'active' : ''}
            onClick={() => setSelectedSubject('korean')}
          >
            국어
          </li>
        </ul>
      </nav>

      <div className="attendance-stats">
      <h2>
          {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 출결 통계
        </h2>
        <p> 출석: {attendanceStats.attend}회       
         지각: {attendanceStats.late}회
        결석: {attendanceStats.absent}회</p>
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