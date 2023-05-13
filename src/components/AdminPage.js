import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate  } from "react-router-dom";


import './asset/css/AdminPage.css'


function AdminPage() {
    const navigate = useNavigate();

    let [btnActive, setBtnActive] = useState(
        localStorage.getItem("btnActive") || "edumanage"
    );

    function logout(){
        localStorage.removeItem("login");
        sessionStorage.clear();
        alert("로그아웃되었습니다");
        navigate("/admin");
    }

    useEffect(() => {
        sessionStorage.setItem("btnActive", btnActive);
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
                    <li className={btnActive === "sendmailmanage" ? "btnActive" : ""}>
                        <Link to="/adminpage/sendmailmanage" onClick={() => {setBtnActive('sendmailmanage');}} >보낸쪽지함</Link>
                    </li>
                    <li className={btnActive === "qnamanage" ? "btnActive" : ""}>
                        <Link to="/adminpage/qnamanage" onClick={() => {setBtnActive('qnamanage');}} >고객문의함</Link>
                    </li>
                </ul>
                <button className="adminLogout" onClick={logout}>로그아웃</button>
            </nav>
            <main className="adminContentWrap">
                <Outlet/>
            </main>
        </div>

);
}

export default AdminPage;