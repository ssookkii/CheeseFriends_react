import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import MapSearch from './MapSearch';
import EduAdd from './EduAdd';
import EduManage from './EduManage'
import EduUpdate from './EduUpdate';
import SubjectManage from './SubjectManage';
import SubUpdate from './SubUpdate';

import './asset/css/reset.css';
import './asset/css/AdminPage.css'

function AdminPage() {
    return (
    <div className='wrap'>
    <BrowserRouter>
        <div className="contentWrap">
            <nav className="sideMenu">
                <ul>
                    <li className='logo'>
                        <img src="img/logo.png" alt="cheese friends"/>
                    </li>
                    <li>
                        <Link to="/edumanage">기관관리</Link>
                    </li>
                    <li>
                        <Link to="/submanage">과목관리</Link> 
                    </li>
                    <li>
                        <Link to="/submanage">회원관리</Link> 
                    </li>
                    <li>
                        <Link to="/submanage">보낸쪽지함</Link> 
                    </li>
                    <li>
                        <Link to="/submanage">고객문의함</Link>
                    </li>
                </ul>
            </nav>
            <div>
                <Routes>
                    <Route path="/MapSearch" element={ <MapSearch/>} />
                    <Route path="/eduAdd" element={ <EduAdd/>} />
                    <Route path="/edumanage" element={ <EduManage/>} />
                    <Route path="/eduupdate/:eduCode" exact element={<EduUpdate />} />
                    <Route path="/submanage" element={ <SubjectManage/>} />
                    <Route path="/subupdate/:subCode" exact element={<SubUpdate />} />
                </Routes>
            </div>
        </div>


    </BrowserRouter>
    </div>
);
}

export default AdminPage;