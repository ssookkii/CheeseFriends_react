import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import './asset/css/AttendanceSystem.css';
import { Link } from "react-router-dom";



function Attendance() {

  const [userId, setUserId] = useState("");

  const [subCode, setSubCode] = useState("");
  const [eduCode, seteduCode] = useState("");
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceStatus, setResponseMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [weatherData, setWeatherData] = useState([]);

  const [typingAnimationClassName, setTypingAnimationClassName] = useState("status");
  const [typingAnimationKey, setTypingAnimationKey] = useState(0);


  // userName 변경시 스타일 변경
  useEffect(() => {
    setTypingAnimationClassName("status");
    setTimeout(() => {
      setTypingAnimationClassName("status typing");
    }, 0);
  }, [userName]);

  useEffect(() => {
    setTypingAnimationKey((prevKey) => prevKey + 1);
  }, [userName, attendanceStatus, typingAnimationClassName]);


  const apiKey = "2ea8b6684971e20330bd9d5078317e7d";

  const loginInfo = JSON.parse(localStorage.getItem("login"));
  const teacherId = loginInfo?.id;

  useEffect(() => {
    if (!teacherId) return;
    axios.get(`http://localhost:3000/attManage/edu/${teacherId}`)
      .then((response) => {
        seteduCode(response.data[0].eduCode);

      })
      .catch((error) => {
        console.error(error);
      });
  }, [teacherId]);

  const fetchWeatherData = async () => {
    const today = new Date();
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=seoul&appid=${apiKey}&units=metric&dt=${today}`
    );
    const weatherDataList = [{
      date: formatDate(today, "yyyy-MM-dd"),
      weather: response.data.weather[0].description,
    }];
    return weatherDataList;
  };

  function formatDate(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return format.replace(/yyyy/, year).replace(/MM/, month).replace(/dd/, day);
  }

  useEffect(() => {
    // 백엔드에서 과목 데이터를 가져오는 API 호출
    axios.get(`http://localhost:3000/attManage/teacher/subjects/${teacherId}`)
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
    if (!userId) return;
    if (userId) {
      fetch("http://localhost:3000/user/" + userId)
        .then(response => response.text())
        .then(name => setUserName(name))
        .catch(error => console.log(error));
    }
  }, [userId]);

  const handleSubmit = () => {
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
              setUserId(res);
              prevUserId = res;
              axios
                .get(`http://localhost:3000/user/${res}`)
                .then((response) => {
                  const name = response.data;
                  //console.log(name);
                  setResponseMessage(`${attendanceStatus}`);
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
  useEffect(() => {
    fetchWeatherData().then((data) => {
      setWeatherData(data);
    });
  }, []);

  function getWeatherIconUrl(weather) {
    const iconMap = {
      'clear sky': '01d',
      'few clouds': '02d',
      'scattered clouds': '03d',
      'broken clouds': '04d',
      'shower rain': '09d',
      'rain': '10d',
      'thunderstorm': '11d',
      'snow': '13d',
      'mist': '50d',
    };

    const iconCode = iconMap[weather.toLowerCase()];
    return `https://openweathermap.org/img/wn/${iconCode}.png`;
  }

  return (
    <div className="attendance-system" style={{ backgroundImage: "url(/img/attendanceimg.png)", backgroundSize: "cover" }}>
      <div>
        <div className="attlogo-container">
          <img src="/img/logo100h.png" alt="Cheese Friends Logo" />
        </div>
        <h1 className="AttendanceH1">Attendance System</h1>
        {weatherData.length > 0 ? (
          <div className="weather">
            <img
              src={getWeatherIconUrl(weatherData[0].weather)}
              alt="날씨 아이콘"
              width="50"
              height="50"

            />



          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <nav className="subject_nav" style={{ width: '50%', opacity: '0.7' }}>
            <ul>
              {subjects.map((subject) => (
                <li
                  key={subject.subCode}
                  className={selectedSubject === subject.subCode ? 'active' : ''}
                  onClick={() => setSelectedSubject(subject.subCode)}
                  style={{ fontSize: '18px', alignItems: 'center' }}
                >
                  {subject.subName}
                </li>
              ))}
            </ul>
          </nav>

          <button className="attendancebtn btn-round btn-marquee" onClick={handleCompareButtonClick} style={{ width: '200px', height: '50px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span data-text="출석 시스템 실행하기" >
              출석 시스템 실행하기
            </span>
          </button>
        </div>


        <br /> <br /> <br />

        <div className="AttendanceInfo">
          {userName !== "" ? (
            <div>
              <span className="name">{userName}</span>
            </div>
          ) : (
            <div class="loading-container">
              <div class="loading"></div>
              <div id="loading-text">loading...</div>
            </div>
          )}
          <br />
        </div>
      </div>

      {/* 화면에 보이지 않는 부분 */}
      <div className="attendance-wrapper">
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
              onChange={(e) => seteduCode(e.target.value)}
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
      </div>

      {attendanceStatus !== "" && (
        <div className="AttendanceInfo">
          <div className="status typing" key={typingAnimationKey} style={{ marginTop: '30px' }}>
            <p style={{ fontWeight: 'bold', color: '#777' }}>{userName}님은 {attendanceStatus} 되었습니다.</p>
          </div>
        </div>
      )}


    </div>
  );
}

export default Attendance;