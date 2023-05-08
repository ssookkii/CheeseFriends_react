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

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedEdu, setSelectedEdu] = useState('');
  const [eduCode, seteduCode] = useState([]);

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

  useEffect(() => {
    if (!currentUserId) return;
    axios.get(`http://localhost:3000/attManage/edu/${currentUserId}`)
      .then((response) => {
        seteduCode(response.data);
        if (response.data.length > 0) {
          setSelectedEdu(response.data[0].eduCode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId]);






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
        const filteredSubjects = response.data.filter(subject => subject.eduCode === selectedEdu);
        setSubjects(filteredSubjects);

        // 첫번째 항목을 기본 선택으로 설정
        if (filteredSubjects.length > 0) {
          setSelectedSubject(filteredSubjects[0].subCode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId, eduCode, selectedEdu]);


  useEffect(() => {
    if (!currentUserId || !selectedSubject || !selectedEdu) return;
    // 선택한 과목에 대한 출결 데이터를 가져오는 API 호출 
    axios.get(`http://localhost:3000/attManage/${currentUserId}/${selectedSubject}/${selectedEdu}`)
      .then(response => {
        setAttendanceData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [selectedSubject, currentUserId, selectedEdu]);



  function getAttendanceStats(attendanceData, selectedDate) {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;

    const stats = {
      absent: 0,
      late: 0,
      attend: 0,
      out: 0,
      early: 0,
    };

    attendanceData.forEach((data) => {
      const date = new Date(data.attendanceTime);
      if (date.getFullYear() === year && date.getMonth() + 1 === month) {
        if (data.status === "결석") {
          stats.absent++;
        } else if (data.status === "지각") {
          stats.late++;
        } else if (data.status === "출석") {
          stats.attend++;
        } else if (data.status === "외출") {
          stats.out++;
        } else {
          stats.early++;
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
    <div className="attendance-manage-container" style={{ width: '80%', margin: '0 auto' }}>

      <nav className="edu_navstu" style={{ opacity: '0.9', margin: '0px', maxWidth: '100%' }}>
        <ul>
          {eduCode.map((edu) => (
            <li
              key={edu.eduCode}
              className={selectedEdu === edu.eduCode ? 'active' : ''}
              onClick={() => setSelectedEdu(edu.eduCode)}
              style={{ fontSize: '15px', minWidth: '100px', textAlign: 'center' }}
            >
              <img src="/img/cheese.png" alt="Attendance statistics" width="15px" />  {edu.eduName}
            </li>
          ))}
        </ul>
        <nav className='att_manage' style={{}}>
          <ul>
            {subjects.map((subject) => (
              <li
                key={subject.subCode}
                className={selectedSubject === subject.subCode ? 'active' : ''}
                onClick={() => setSelectedSubject(subject.subCode)}
                style={{ minWidth: '100px', textAlign: 'center' }}
              >
                {subject.subName}
              </li>
            ))}
          </ul>
        </nav>
      </nav>

      <div className="attendance-stats">

        <div className='AttendanceDate' >
          <h2 style={{ fontSize: '18px', width: "35%" }} className="attendance-month">
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 출결 통계
          </h2>
        </div>
        <br />
        <div className='attcheck' style={{ display: 'flex', justifyContent: 'center' }}>
          <p style={{ color: '#677bde', fontWeight: 'bold' }} > 출석: {attendanceStats.attend}회  </p>
          <p style={{ color: '#face5e', fontWeight: 'bold' }}> 지각: {attendanceStats.late}회 </p>
          <p style={{ color: '#f19c9c', fontWeight: 'bold' }}>결석: {attendanceStats.absent}회 </p>
          <p style={{ color: '#868686', fontWeight: 'bold' }}>외출: {attendanceStats.out}회 </p>
          <p style={{ color: '#b6d7b4', fontWeight: 'bold' }}>조퇴: {attendanceStats.early}회 </p>
        </div>
        <br></br>
      </div>

      <div className="calendar-wrapper">
        <div className="checkbox-wrapper">
          <br /><br /><br /><br />
          <img
            src="/img/alarm.png"
            alt="알림 이미지"
            width="100px"
            height="auto"
            className="swing-animation"
          />

          <br /><br />
          <div className="Attcheckboxes">
            <label className='AttLabel'>
              <span Att-tooltip="수업 시작 30분 전에 출석 알림을 문자로 받을 수 있습니다.">수업 시작 30분 전 알림</span>
              <input
                type="checkbox"
                checked={minCheck}
                onChange={handleBeforeClassAlertChange}
              />
            </label>
            <br /><br />
            <label >
              <span Abs-tooltip="결석 처리가 될 경우 알림을 문자로 받아볼 수 있습니다.">'결석' 처리 알림</span>
              <input
                type="checkbox"
                checked={absentAlarm}
                onChange={handleAbsentAlertChange}
              />
            </label>
          </div>
        </div>
        <div className="calendar-container" >
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
              } else if (statusData.status === "외출") {
                return "out";
              } else if (statusData.status === "조퇴") {
                return "early";
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
