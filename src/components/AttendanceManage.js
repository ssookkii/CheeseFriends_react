import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from "axios";
import 'react-calendar/dist/Calendar.css';
import './asset/css/AttendanceManage.css';


function AttendanceManage() {

  // 세션 스토리지
  const loginInfo = JSON.parse(localStorage.getItem("login"));
  const userId = loginInfo?.id;
  const userAuth = loginInfo?.auth;
  const eduCode = sessionStorage.getItem("eduCode");
  const apiKey = "2ea8b6684971e20330bd9d5078317e7d";



  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [weatherData, setWeatherData] = useState([]);

  useEffect(() => {
    if (userAuth === "student") {
      setCurrentUserId(userId);
      console.log(currentUserId);
    } else if (userAuth === "parents") {
      // 백엔드에서 학생 아이디를 가져오는 API 호출
      axios
        .get(`http://localhost:3000/attManage/getStudentId/${userId}`)
        .then((response) => {
          setCurrentUserId(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userAuth, userId]);

  const fetchWeatherData = async () => {
    const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const dateList = [];

    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      dateList.push(formatDate(new Date(date), "yyyy-MM-dd"));
    }

    const weatherDataList = await Promise.all(
      dateList.map(async (date) => {
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=seoul&appid=${apiKey}&units=metric&dt=${date}`
        );
        return {
          date,
          weather: response.data.weather[0].description,
        };
      })
    );

    setWeatherData(weatherDataList);
  };

  useEffect(() => {
    fetchWeatherData();
  }, [selectedDate]);



  function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return format.replace(/yyyy/, year).replace(/MM/, month).replace(/dd/, day);
  }

  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;
    // 백엔드에서 eduCode와 일치하는 과목 데이터를 가져오는 API 호출
    axios.get(`http://localhost:3000/attManage/subjects/${currentUserId}`)
      .then((response) => {
        // 현재 eduCode와 일치하는 과목 데이터만 필터링하여 setSubjects에 저장
        const filteredSubjects = response.data.filter(subject => subject.eduCode === eduCode);
        setSubjects(filteredSubjects);

        // 첫번째 항목을 기본 선택으로 설정
        if (filteredSubjects.length > 0) {
          setSelectedSubject(filteredSubjects[0].subCode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId, eduCode]);


  useEffect(() => {
    if (!currentUserId || !selectedSubject) return;
    // 선택한 과목에 대한 출결 데이터를 가져오는 API 호출 
    axios.get(`http://localhost:3000/attManage/${currentUserId}/${selectedSubject}/${eduCode}`)
      .then(response => {
        setAttendanceData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [selectedSubject, currentUserId]);



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

  const handleBeforeClassAlertChange = (event) => {
    setminCheck(event.target.checked);
    const { checked } = event.target;
    const url = `http://localhost:3000/attManage/${currentUserId}/AlarmTrue`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUserId,
        minCheck: checked // 체크되면 true, 체크해제하면 false
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [minCheck, setminCheck] = useState([]);

  useEffect(() => {
    if (!currentUserId) return;
    // DB에서 minCheck 값을 가져옴
    axios.get(`http://localhost:3000/attManage/${currentUserId}/GetAlarm`)
      .then((response) => {
        setminCheck(response.data[0].minCheck);

        // data.minCheck 값이 true이면 minCheck를 true로, 그 외의 경우는 false로 설정
      })
      .catch((error) => {
        console.error('Error:', error);
        setminCheck(false);
      });
  }, [currentUserId]);

  const handleAbsentAlertChange = (e) => {
    setabsentAlarm(e.target.checked);
    const { checked } = e.target;
    const url = `http://localhost:3000/attManage/${currentUserId}/AbsentAlarmTrue`;
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUserId,
        absentAlarm: checked // 체크되면 true, 체크해제하면 false
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [absentAlarm, setabsentAlarm] = useState([]);
  useEffect(() => {
    if (!currentUserId) return;
    axios.get(`http://localhost:3000/attManage/${currentUserId}/AbsentAlarm`)
      .then((response) => {
        setabsentAlarm(response.data[0].absentCheck);
      })
      .catch((error) => {
        console.error('Error:', error);
        setabsentAlarm(false);
      });
  }, [currentUserId]);

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
        <br />
        <div className='attcheck' style={{ display: 'flex', justifyContent: 'space-between' }}>
          <p style={{ color: '#A1c3B3', fontWeight: 'bold' }} > 출석: {attendanceStats.attend}회  </p>
          <p style={{ color: '#FFDC9D', fontWeight: 'bold' }}> 지각: {attendanceStats.late}회 </p>
          <p style={{ color: '#FFA1A1', fontWeight: 'bold' }}>결석: {attendanceStats.absent}회 </p>
        </div>

      </div>
      <div className="calendar-wrapper">
        <div className="checkbox-wrapper">
          <br /><br /><br /><br />
          <img src="/img/alarm.png" alt="알림 이미지" width="150px" height="auto" />
          <br /><br />
          <div className="checkboxes">
            <label>
              <span>수업 시작 30분 전 알림</span>
              <input
                type="checkbox"
                checked={minCheck}
                onChange={handleBeforeClassAlertChange}
              />
            </label>
            <br /><br />
            <label>
              <span>'결석' 처리 알림</span>
              <input
                type="checkbox"
                checked={absentAlarm}
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
              const statusData = attendanceData.find((data) => data.attendanceTime.startsWith(dateString));
              const weatherDataItem = weatherData.find((data) => data.date === dateString);

              return (
                <div>
                  {statusData ? <div>{statusData.status}</div> : null}
                  {weatherDataItem ? <div>{weatherDataItem.weather}</div> : null}
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
