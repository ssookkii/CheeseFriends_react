import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';
import PrivateRoutes from './components/PrivateRoutes';
import Admin from './components/Admin';
import AdminPage from './components/AdminPage';
import MapSearch from './components/MapSearch';
import EduAdd from './components/EduAdd';
import EduManage from './components/EduManage'
import EduUpdate from './components/EduUpdate';
import SubjectManage from './components/SubjectManage';
import SubUpdate from './components/SubUpdate';
import TeacherManage from './components/TeacherManage';
import TeaUpdate from './components/TeaUpdate';

import Attendance from "./components/Attendance";
import AttendanceQR from "./components/AttendanceQR";
import AttendanceManage from "./components/AttendanceManage";
import AttendanceManageTeacher from "./components/AttendanceManageTeacher";
import Test from "./components/Test";

import Idsearch from './login/idsearch';
import Login from './login/login';
import Regi from './login/regi';
import RegiParents from './login/regiparents';
import Regiselect from './login/regiselect';
import Regiteacher from './login/regiteacher';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <div className="py-4">
            <div className="container">
              <Routes>

              <Route path="/" element={<Login/>}></Route>
              <Route path="/regiselect" element={<Regiselect/>}></Route>
              <Route path="/regi" element={<Regi/>}></Route>
              <Route path="/regiparents" element={<RegiParents/>}></Route>
              <Route path="/regiteacher" element={<Regiteacher/>}></Route>
              <Route path="/idsearch" element={<Idsearch/>}></Route>



                
              <Route path="/attendance" element={<Attendance />} >
              
              </Route>
              <Route path="/attendance/attendanceQR" element={<AttendanceQR />} />
              
                <Route path="/AttendanceManage" element={<AttendanceManage />} />
                <Route path="/AttendanceManageTeacher" element={<AttendanceManageTeacher />} />
                <Route path="/test" element={<Test />} />
               

                <Route path="/admin" element={ <Admin/>} />
                        <Route exact path="/adminpage" element={<PrivateRoutes/>}>
                                <Route path="/adminpage" element={ <AdminPage/>} >
                                    <Route path="/adminpage/MapSearch" element={ <MapSearch/>} />
                                    <Route path="/adminpage/eduAdd" element={ <EduAdd/>} />
                                    <Route path="/adminpage/edumanage" element={ <EduManage/>} />
                                    <Route path="/adminpage/eduupdate/:eduCode" exact element={<EduUpdate />} />
                                    <Route path="/adminpage/submanage" element={ <SubjectManage/>} />
                                    <Route path="/adminpage/subupdate/:subCode" exact element={<SubUpdate />} />
                                    <Route path="/adminpage/teachermanage" element={<TeacherManage />} />
                                    <Route path="/adminpage/teaupdate/:id" exact element={<TeaUpdate />} />
                  </Route>
                </Route>
              </Routes>
            </div>
          </div>
        </main>

      </BrowserRouter>
     
    </div>
  );
}

export default App;