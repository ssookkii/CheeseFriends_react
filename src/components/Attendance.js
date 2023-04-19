import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";


function Attendance() {
  const [userId, setUserId] = useState("");
  const [eduCode, setEduCode] = useState("");
  const [subCode, setSubCode] = useState("");
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const initialEduCode = params.get("eduCode");
  const initialSubCode = params.get("subCode");
  const [attendanceStatus, setResponseMessage] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    setEduCode(initialEduCode);
    setSubCode(initialSubCode);
  }, [initialEduCode, initialSubCode]);

  useEffect(() => {
    if (userId && eduCode && subCode) {
      handleSubmit();
    }
  }, [userId, eduCode, subCode]);

  const handleSubmit = () => {
    if (!userId || !eduCode || !subCode) {
      console.log("모든 필드를 입력해주세요.");
      return;
    }
    const data = { userId, eduCode, subCode, attendanceStatus };
    axios
      .post("http://localhost:3000/attendance", data)
      .then((response) => {
        console.log(response);
        setResponseMessage(response.data);
      })
      .catch((error) => console.log(error));
    console.log(data);
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
              handleSubmit();
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
      <div>
        <h1>치즈 프렌드 출석 시스템</h1>
        <button onClick={handleCompareButtonClick}>출석 시스템 실행</button>
        {userId !== "" ? (
          <div>
            <h2>User ID: {userId}</h2>
          </div>
        ) : (
          <div>Loading...</div>
        )}
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
            value={subCode}
            onChange={(e) => setSubCode(e.target.value)}
          />
        </label>
      </form>

      {attendanceStatus !== "" && (
        <div>
          <p>{userId}님은 {attendanceStatus} 했습니다.</p>
        </div>
      )}
      
    </div>
  );
}

export default Attendance;