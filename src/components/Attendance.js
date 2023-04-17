import React, { useState } from "react";
import axios from "axios";

function Attendance() {
  const [userId, setUserId] = useState("");
  const [eduCode, setEduCode] = useState("");
  const [subCode, setSubCode] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = { userId, eduCode, subCode };
    axios.post("http://localhost:3000/attendance", data)
      .then(response => console.log(response))
      .catch(error => console.log(error));
      console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          UserID:
          <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
        </label>
        <label>
          Educode:
          <input type="text" value={eduCode} onChange={(e) => setEduCode(e.target.value)} />
        </label>
        <label>
          SubCode:
          <input type="text" value={subCode} onChange={(e) => setSubCode(e.target.value)} />
        </label>
        <button type="submit">Submit</button>

      </form>
    </div>
  );
}

export default Attendance;
