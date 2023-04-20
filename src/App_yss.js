import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Attendance from "./components/Attendance";
import AttendanceManage from "./components/AttendanceManage";
import AttendanceManageTeacher from "./components/AttendanceManageTeacher";
import Test from "./components/Test";
import './App.css';
import Login from './login/login';
import Regi from './login/regi';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <div className="py-4">
            <div className="container">
              <Routes>

                <Route path="/login" element={<Login/>}></Route>

                <Route path="/regi" element={<Regi/>}></Route>


                <Route path="/attendance" element={<Attendance />} />
                <Route path="/AttendanceManage" element={<AttendanceManage />} />
                <Route path="/AttendanceManageTeacher" element={<AttendanceManageTeacher />} />
                <Route path="/test" element={<Test />} />
              </Routes>
            </div>
          </div>
        </main>

      </BrowserRouter>
     
    </div>
  );
}

export default App;