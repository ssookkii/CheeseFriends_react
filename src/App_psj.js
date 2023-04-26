import React, { useEffect } from 'react';
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
import SendMailManage from './components/SendMailManage';
import MailWrite from './components/MailWrite';
import QnAManage from './components/QnAManage';

import Attendance from "./components/Attendance";
import AttendanceQR from "./components/AttendanceQR";
import AttendanceManage from "./components/AttendanceManage";
import AttendanceManageTeacher from "./components/AttendanceManageTeacher";
import Test from "./components/Test";

import Idsearch from './login/idsearch';
import Login from './login/login';
import Passwordsearch from './login/passwordsearch';
import Regi from './login/regi';
import RegiParents from './login/regiparents';
import Regiselect from './login/regiselect';
import Regiteacher from './login/regiteacher';
import Changeme from './mypage/changeme';
import Email from './mypage/receiveemaillist';
import Sendemail from './mypage/sendemail';
import Testmain from './mypage/testmain';

import LectureList from './components/LectureList'
import AbLectureList from './components/AbLectureList'
import LectureWrite from './components/LectureWrite'
import LearningList from './components/LearningList'
import LearningDetail from './components/LearningDetail'
import LearningWrite from './components/LearningWrite'
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import TaskWrite from './components/TaskWrite';
import Maildetail from './mypage/maildetail';
import Sendemaillist from './mypage/sendemaillist';
import Sendmaildetail from './mypage/sendmaildetail';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <Routes>

            <Route path="/lecture" element={<LectureList />} />
            <Route path="/lecture/AbLectureList" element={<AbLectureList />} />
            <Route path="/lecture/LectureWrite" element={<LectureWrite />} />
            <Route path="/learning" element={<LearningList />} />
            <Route path="/learning/LearningDetail" element={<LearningDetail />} />
            <Route path="/learning/LearningWrite" element={<LearningWrite />} />
            <Route path="/learning/TaskList" element={<TaskList />} />
            <Route path="/learning/TaskDetail" element={<TaskDetail />} />
            <Route path="/learning/TaskWrite" element={<TaskWrite />} />

            <Route path="/" element={<Login />} />
            <Route path="/regiselect" element={<Regiselect />} />
            <Route path="/regi" element={<Regi />} />
            <Route path="/regiparents" element={<RegiParents />} />
            <Route path="/regiteacher" element={<Regiteacher />} />
            <Route path="/idsearch" element={<Idsearch />} />
            <Route path="/passwordsearch" element={<Passwordsearch />} />
            <Route path="/testmain" element={<Testmain />}>
              <Route path="/testmain/changeme" element={<Changeme />} />
              <Route path="/testmain/email" element={<Email />} />
              <Route path="/testmain/email/:choice/:search" element={<Email />} />
              <Route path="/testmain/sendemail" element={<Sendemail />} />
              <Route path="/testmain/sendemail/:sender" element={<Sendemail />} />
              <Route path="/testmain/maildetail/:seq" element={<Maildetail />} />
              <Route path="/testmain/sendemaillist" element={<Sendemaillist />} />
              <Route path="/testmain/sendemaillist/:choice/:search" element={<Sendemaillist />} />
              <Route path="/testmain/sendmaildetail/:seq" element={<Sendmaildetail />} />
            </Route>


            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance/attendanceQR" element={<AttendanceQR />} />
            <Route path="/AttendanceManage" element={<AttendanceManage />} />
            <Route path="/AttendanceManageTeacher" element={<AttendanceManageTeacher />} />
            <Route path="/test" element={<Test />} />


            <Route path="/admin" element={<Admin />} />
            <Route exact path="/adminpage" element={<PrivateRoutes />}>
              <Route path="/adminpage" element={<AdminPage />} >
                <Route path="/adminpage/MapSearch" element={<MapSearch />} />
                <Route path="/adminpage/eduAdd" element={<EduAdd />} />
                <Route path="/adminpage/edumanage" element={<EduManage />} />
                <Route path="/adminpage/eduupdate/:eduCode" exact element={<EduUpdate />} />
                <Route path="/adminpage/submanage" element={<SubjectManage />} />
                <Route path="/adminpage/subupdate/:subCode" exact element={<SubUpdate />} />
                <Route path="/adminpage/teachermanage" element={<TeacherManage />} />
                <Route path="/adminpage/teaupdate/:id" exact element={<TeaUpdate />} />
                <Route path="/adminpage/sendmailmanage" exact element={<SendMailManage />} />
                <Route path="/adminpage/mailwrite" exact element={<MailWrite />} />
                <Route path="/adminpage/qnamanage" exact element={<QnAManage />} />
              </Route>
            </Route>
          </Routes>
        </main>

      </BrowserRouter>

    </div>
  );
}

export default App;