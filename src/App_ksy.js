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


function App_ksy() {

    return (
        <BrowserRouter>
    
            <main>
                <Routes>
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
            </main>

    
    </BrowserRouter>
    );
}

export default App_ksy;