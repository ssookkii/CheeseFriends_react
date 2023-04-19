import React from "react";
import { Link } from "react-router-dom";

function Test() {
  const educode = "EDU001";
  const subcode = "SUB003";

  return (
    <div>
      <h1>Test Page</h1>
      <p>Educode: {educode}</p>
      <p>Subcode: {subcode}</p>
      <Link to={`/attendance?eduCode=${educode}&subCode=${subcode}`}>출석하기</Link> <br/>
      <Link to={'/AttendanceManage'}> 출석 관리_학생 </Link>
    </div>
  );
}

export default Test;
