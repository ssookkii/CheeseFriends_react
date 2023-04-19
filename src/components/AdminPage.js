import React, { useState, useEffect } from 'react';
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
    let [btnActive, setBtnActive] = useState(
        localStorage.getItem("btnActive") || "edumanage"
    );

    useEffect(() => {
        localStorage.setItem("btnActive", btnActive);
    }, [btnActive]);

    return (
    <div className='wrap'>
    <BrowserRouter>
        <div className="contentWrap">
            <nav className="sideMenu">
                <ul>
                    <li className='logo'>
                        <img src="img/logo100h.png" alt="cheese friends"/>
                    </li>
                    <li className={btnActive === "edumanage" ? "btnActive" : ""} >
                        <Link to="/edumanage" onClick={() => {setBtnActive('edumanage');}}>기관관리</Link>
                    </li>
                    <li className={btnActive === "submanage" ? "btnActive" : ""}>
                        <Link to="/submanage" onClick={() => {setBtnActive('submanage');}} >과목관리</Link> 
                    </li>
                    <li className={btnActive === "" ? "btnActive" : ""}>
                        <Link to="/submanage" onClick={() => {setBtnActive('');}} >회원관리</Link> 
                    </li>
                    <li className={btnActive === "" ? "btnActive" : ""}>
                        <Link to="/submanage" onClick={() => {setBtnActive('');}} >보낸쪽지함</Link> 
                    </li>
                    <li className={btnActive === "" ? "btnActive" : ""}>
                        <Link to="/submanage" onClick={() => {setBtnActive('');}} >고객문의함</Link>
                    </li>
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/MapSearch" element={ <MapSearch/>} />
                    <Route path="/eduAdd" element={ <EduAdd/>} />
                    <Route path="/edumanage" element={ <EduManage/>} />
                    <Route path="/eduupdate/:eduCode" exact element={<EduUpdate />} />
                    <Route path="/submanage" element={ <SubjectManage/>} />
                    <Route path="/subupdate/:subCode" exact element={<SubUpdate />} />
                </Routes>
            </main>
        </div>


    </BrowserRouter>
    </div>
);
}

export default AdminPage;