import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import './asset/css/AttendanceSystem.css';
import { Link } from "react-router-dom";



function Attendance() {

  const [userId, setUserId] = useState("");

  const [subCode, setSubCode] = useState("");
  const [selectedSubject, setSelectedSubject] = useState('');
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialEduCode = params.get("eduCode");
  const initialSubCode = params.get("subCode");
  const [attendanceStatus, setResponseMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [subjects, setSubjects] = useState([]);

  const teacherId = sessionStorage.getItem("userId");
  const [eduCode, setEduCode] = useState(sessionStorage.getItem("eduCode"));



  useEffect(() => {
    // 백엔드에서 과목 데이터를 가져오는 API 호출
    axios.get(`http://localhost:3000/attManage/subjects/${teacherId}`)
      .then((response) => {
        setSubjects(response.data);
        //console.log(response.data);

        //첫번째 항목을 기본 선택으로 설정
        if (response.data.length > 0) {
          setSelectedSubject(response.data[0].subCode);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);



  useEffect(() => {
    if (userId && eduCode && selectedSubject) {
      handleSubmit();
    }
  }, [userId, eduCode, selectedSubject]);

  useEffect(() => {
    if (userId) {
      fetch("http://localhost:3000/user/" + userId)
        .then(response => response.text())
        .then(name => setUserName(name))
        .catch(error => console.log(error));
    }
  }, [userId]);

  const handleSubmit = () => {
    console.log("실행");
    if (!userId || !eduCode || !selectedSubject) {
      console.log("모든 필드를 입력해주세요.");
      return;
    }
    const data = { userId, eduCode, subCode: selectedSubject, attendanceStatus };
    axios
      .post("http://localhost:3000/attendance", data)
      .then((response) => {
        //console.log(response);
        setResponseMessage(response.data);
      })
      .catch((error) => console.log(error));
    //console.log(data);
  };

  const handleCompareButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/compareFaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Error from server:", error);
        return;
      }

      let prevUserId = "";
      const intervalId = setInterval(() => {
        fetch("http://localhost:3000/api/userId")
          .then((res) => res.text())
          .then((res) => {
            if (res !== prevUserId) {
              console.log("???" + res);
              setUserId(res);
              prevUserId = res;
              axios
                .get(`http://localhost:3000/user/${res}`)
                .then((response) => {
                  const name = response.data;
                  //console.log(name);
                  setResponseMessage(`${name}님은 ${attendanceStatus} 했습니다.`);
                })
                .catch((error) => console.log(error));
            }
          })
          .catch((error) => {
            console.error("Error while fetching userId:", error);
            clearInterval(intervalId);
          });
      }, 5000);

      return () => clearInterval(intervalId);
    } catch (error) {
      console.error("Error from server:", error);
    }
  };

  return (
    <div>
      <div className="attendance-system" style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>치즈 프렌드 출석 시스템</h1>
        <nav className="subject_nav">
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

        <button className="att-sys-button" onClick={handleCompareButtonClick}
          style={{ width: '200px' }}>출석 시스템 실행</button>
        <br /> <br /> <br />


        {userId !== "" ? (
          <div>
            <h2>이름: {userName}</h2>

          </div>

        ) : (

          <div>Loading...<br /></div>

        )}
        <br />
      </div>

      <form>
        <label>
          UserID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
        <label>
          Educode:
          <input
            type="text"
            value={eduCode}
            onChange={(e) => setEduCode(e.target.value)}
          />
        </label>
        <label>
          SubCode:
          <input
            type="text"
            value={selectedSubject}
            onChange={(e) => setSubCode(e.target.value)}
          />
        </label>
      </form>

      {attendanceStatus !== "" && (
        <div>
          <p>{userName}님은 {attendanceStatus} 했습니다.</p>
        </div>
      )}
      <br /> <br /> <br /> <br /> <br />

    </div>
  );
}

export default Attendance;