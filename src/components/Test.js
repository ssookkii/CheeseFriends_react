import React, { useState } from "react";
import { Link } from "react-router-dom";
import Chatbot from "./Chatbot";

function Test() {
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const handleClick = () => {
    setIsChatbotVisible(!isChatbotVisible);
  };

  // 세션 스토리지
  const userId = sessionStorage.getItem("userId");
  const eduCode = sessionStorage.getItem("eduCode");
  const subCode = sessionStorage.getItem("subCode");

  return (
    <div>
      <h1>Test Page</h1>
      <p>User ID: {userId}</p>
      <p>Educode: {eduCode}</p>
      <p>Subcode: {subCode}</p>
      <Link to={`/attendance?eduCode=${eduCode}&subCode=${subCode}`}>
        출석하기
      </Link>{" "}
      <br />
      <Link to={"/AttendanceManage"}> 출석 관리_학생 </Link>
      <br />
      <Link to={"/AttendanceManageTeacher"}> 출석 관리_선생님 </Link>

      <div
        style={{ position: "fixed", bottom: "20px", right: "20px" }}
        onClick={handleClick}
      >
        <button className="chat-button">
          <img src="/img/chatbot-icon.png" alt="채팅 버튼" />
        </button>
      </div>

      {isChatbotVisible && <Chatbot />}
    </div>
  );
}

export default Test;