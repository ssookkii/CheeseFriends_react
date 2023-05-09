import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './components/asset/css/reset.css';
import './components/asset/css/pagination.css';


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
import QnaAnswer from './components/QnaAnswer';
import GradeManage from './components/GradeManage';
import Attendance from "./components/Attendance";
import AttendanceQR from "./components/AttendanceQR";
import AttendanceManage from "./components/AttendanceManage";
import AttendanceManageTeacher from "./components/AttendanceManageTeacher";
import DataAnalysis from "./components/DataAnalysis";
import DataAnalysisTeacher from "./components/DataAnalysisTeacher";
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
import Maildetail from './mypage/maildetail';
import Sendemaillist from './mypage/sendemaillist';
import Sendmaildetail from './mypage/sendmaildetail';
import Grademypage from './mypage/grademypage';
import Learningmypage from './mypage/learningmypage';
import Breakaway from './mypage/breakaway';
import Studentlist from './mypage/studentlist';
import Socialloginselect from './login/socialregiselect';
import Kakao from './login/kakao';
import NaverLogin from './login/naverlogin';
import Socialregiselect from './login/socialregiselect';
import Common from './components/Common';
import Home from './components/Home';
import TimeTable from './components/TimeTable';
import SubjectAdd from './components/SubjectAdd';
import SubTimeManage from './components/SubTimeManage';
import Testlogin from './login/testlogin';




// import LectureList from './components/LectureList'
// import AbLectureList from './components/AbLectureList'
// import LectureWrite from './components/LectureWrite'
// import LectureDetail from './components/LectureDetail';
// import LearningList from './components/LearningList'
// import LearningDetail from './components/LearningDetail'
// import LearningWrite from './components/LearningWrite'
// import TaskList from './components/TaskList';
// import TaskDetail from './components/TaskDetail';
// import TaskWrite from './components/TaskWrite';
// import QnALearningList from './components/QnaLearningList';
// import QnaLearningDetail from './components/QnaLearningDetail';
// import QnaLearningWrite from './components/QnaLearningWrite';
// import QnaLearningAnswer from './components/QnaLearningAnswer';
// import EduInfoList from './components/EduInfoList';
// import EduInfoDetail from './components/EduInfoDetail';
// import EduInfoWrite from './components/EduInfoWrite';
// import Chatbot from './components/Chatbot';

// import PlayGame from './components/PlayGame';
// import PlayGame1 from './components/PlayGame1';
// import PlayGame2 from './components/PlayGame2';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <Routes>

            {/* <Route path="/playgame" element={<PlayGame />} />
            <Route path="/playgame1" element={<PlayGame1 />} />
            <Route path="/playgame2" element={<PlayGame2 />} />

            <Route path="/service/Chatbot" element={<Chatbot />} /> */}

            {/* <Route path="/lecture" element={<LectureList />} />
            <Route path="/lecture/AbLectureList" element={<AbLectureList />} />
            <Route path="/lecture/LectureWrite" element={<LectureWrite />} />
            <Route path="/lecture/LectureDetail/:seq" element={<LectureDetail />} />
            <Route path="/learning" element={<LearningList />} />
            <Route path="/learning/LearningDetail/:seq" element={<LearningDetail />} />
            <Route path="/learning/LearningWrite" element={<LearningWrite />} />
            <Route path="/learning/TaskList" element={<TaskList />} />
            <Route path="/learning/TaskDetail/:seq" element={<TaskDetail />} />
            <Route path="/learning/TaskWrite" element={<TaskWrite />} />
            <Route path="/learning/QnALearningList" element={<QnALearningList />} />
            <Route path="/learning/QnaLearningDetail/:seq" element={<QnaLearningDetail />} />
            <Route path="/learning/QnaLearningWrite" element={<QnaLearningWrite />} />
            <Route path="/learning/QnaLearningAnswer/:seq" element={<QnaLearningAnswer />} />
            <Route path="/learning/EduInfoList" element={<EduInfoList />} />
            <Route path="/learning/EduInfoWrite" element={<EduInfoWrite />} />
            <Route path="/learning/EduInfoDetail/:seq" element={<EduInfoDetail />} /> */}

            <Route path="/" element={<Login />} />
            <Route path="/socialregiselect" element={<Socialregiselect />} />
            <Route path="/kakaologin" element={<Kakao/>} />
            <Route path="/naverlogin" element={<NaverLogin/>} />
            <Route path="/regiselect" element={<Regiselect />} />
            <Route path="/regi" element={<Regi />} />
            <Route path="/regiparents" element={<RegiParents />} />
            <Route path="/regiteacher" element={<Regiteacher />} />
            <Route path="/idsearch" element={<Idsearch />} />
            <Route path="/passwordsearch" element={<Passwordsearch />} />
            <Route path="/testlogin" element={<Testlogin />} />
  

            <Route path="/cheesefriends/*" element={<Common />}>
              <Route path="home" element={<Home />} />
                <Route path="testmain" element={<Testmain />}>
                <Route path="changeme" element={<Changeme />} />
                <Route path="email" element={<Email />} />
                <Route path="tmain/email/:choice/:search" element={<Email />} />
                <Route path="sendemail" element={<Sendemail />} />
                <Route path="sendemail/:sender" element={<Sendemail />} />
                <Route path="maildetail/:seq" element={<Maildetail />} />
                <Route path="sendemaillist" element={<Sendemaillist />} />
                <Route path="sendemaillist/:choice/:search" element={<Sendemaillist />} />
                <Route path="sendmaildetail/:seq" element={<Sendmaildetail />} />
                <Route path="timetable" element={<TimeTable />} />
                <Route path="subjectadd" element={<SubjectAdd />} />
                <Route path="subtimemanage" element={<SubTimeManage />} />
                <Route path="grademanage" element={<GradeManage />} />
                <Route path="grademypage" element={<Grademypage />} />
                <Route path="grademypage/:choice/:search" element={<Grademypage />} />
                <Route path="learningmypage" element={<Learningmypage />} />
                <Route path="learningmypage/:choice/:search" element={<Learningmypage />} />
                <Route path="breakaway" element={<Breakaway />} />
                <Route path="studentlist" element={<Studentlist />} />
                <Route path="studentlist/:choice/:search" element={<Studentlist />} />
                <Route path="AttendanceManageTeacher" element={<AttendanceManageTeacher />} />
                <Route path="DataAnalysisTeacher" element={<DataAnalysisTeacher />} />
                <Route path="DataAnalysis" element={<DataAnalysis />} />
                <Route path="AttendanceManage" element={<AttendanceManage />} />
              </Route>
             
            </Route>

            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance/attendanceQR" element={<AttendanceQR />} />
            <Route path="/AttendanceManage" element={<AttendanceManage />} />
            <Route path="/AttendanceManageTeacher" element={<AttendanceManageTeacher />} />
            <Route path="/DataAnalysis" element={<DataAnalysis />} />
            <Route path="/DataAnalysisTeacher" element={<DataAnalysisTeacher />} />
            <Route path="/test" element={<Test />} />


            <Route path="/grademanage" element={<GradeManage />} />
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
                <Route path="/adminpage/qnaanswer/:seq" exact element={<QnaAnswer />} />

              </Route>
            </Route> 
          </Routes>
        </main>

      </BrowserRouter>

    </div>
  );
}

export default App;