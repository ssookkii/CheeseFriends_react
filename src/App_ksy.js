import React, { useState, useEffect }  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

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
import QnaAnswer from './components/QnaAnswer';
import GradeManage from './components/GradeManage';
import SubjectAdd from './components/SubjectAdd';
import SubTimeManage from './components/SubTimeManage';
import Login from './login/login';


function App_ksy() {

    return (
        <BrowserRouter>
       
            <main>
                <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/subjectadd" element={<SubjectAdd />} />
                <Route path="/subtimemanage" element={<SubTimeManage />} />
                <Route path="/grademanage" element={<GradeManage />} />
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
                                    <Route path="/adminpage/sendmailmanage" exact element={<SendMailManage />} />
                                    <Route path="/adminpage/mailwrite" exact element={<MailWrite />} />
                                    <Route path="/adminpage/qnamanage" exact element={<QnAManage />} />
                                    <Route path="/adminpage/qnaanswer/:seq" exact element={<QnaAnswer />} />
                                </Route>
                        
                        </Route>
                </Routes>
            </main>

    
    </BrowserRouter>
    );
}

export default App_ksy;