import React, { useState, useEffect } from 'react';
import { Link, Outlet, Routes, Route  } from "react-router-dom";

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
        <div className="adminPageWrap">
            <nav className="sideMenu">
                <ul>
                    <li className={btnActive === "edumanage" ? "btnActive" : ""} >
                        <Link to="/adminpage/edumanage" onClick={() => {setBtnActive('edumanage');}}>기관관리</Link>
                    </li>
                    <li className={btnActive === "submanage" ? "btnActive" : ""}>
                        <Link to="/adminpage/submanage" onClick={() => {setBtnActive('submanage');}} >과목관리</Link>
                    </li>
                    <li className={btnActive === "teachermanage" ? "btnActive" : ""}>
                        <Link to="/adminpage/teachermanage" onClick={() => {setBtnActive('teachermanage');}} >회원관리</Link>
                    </li>
                    <li className={btnActive === "" ? "btnActive" : ""}>
                        <Link to="/adminpage/submanage" onClick={() => {setBtnActive('');}} >보낸쪽지함</Link>
                    </li>
                    <li className={btnActive === "" ? "btnActive" : ""}>
                        <Link to="/adminpage/submanage" onClick={() => {setBtnActive('');}} >고객문의함</Link>
                    </li>
                </ul>
            </nav>
            <main className="adminContentWrap">
                <Outlet/>
            </main>
        </div>

);
}

export default AdminPage;