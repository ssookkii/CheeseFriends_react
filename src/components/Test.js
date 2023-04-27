import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Test() {
  useEffect(() => {
    sessionStorage.setItem("userId", "user01");
    sessionStorage.setItem("eduCode", "EDU001");
    sessionStorage.setItem("subCode", "SUB001");
    sessionStorage.setItem("auth", "student");
  }, []);

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
      <Link to={`/attendance?eduCode=${eduCode}&subCode=${subCode}`}>출석하기</Link> <br />
      <Link to={"/AttendanceManage"}> 출석 관리_학생 </Link><br />
      <Link to={"/AttendanceManageTeacher"}> 출석 관리_선생님 </Link>
    </div>
  );
}

export default Test;
