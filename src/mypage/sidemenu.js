import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, NavLink, Link } from "react-router-dom";

import styles from "../components/asset/css/mypage.module.css"

function Sidemenu(){
    const [id, setId] = useState("");
    const [auth, setAuth] = useState("");



    let history = useNavigate();
    // login 되어 있는지 검사
    useEffect (()=>{
        let local = localStorage.getItem("login");
        let login = JSON.parse(local);
        if(login !== undefined){
            setId(login.id);
            setAuth(login.auth);
            console.log("login.auth : " + login.auth);
        }else{
            alert('login해 주십시오');
            history('/');
        }
    },[history]);

    let local = localStorage.getItem("login");
    let login = JSON.parse(local);

    let [btnActive, setBtnActive] = useState(
        localStorage.getItem("mypageBtnActive") || ""
    );
    
    useEffect(() => {
        localStorage.setItem("mypageBtnActive", btnActive);
    }, [btnActive]);



    return(
        <div className={styles.mypageSideMenu}>
            <div className={styles.sideMenu}>
                <span><em>{login.name}</em>({login.id})</span>
            {login.auth === 'teacher' || login.auth === 'main' 
            ?   
            <>
                <Link to="changeme" className={btnActive === "changeme" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('changeme');}}>개인정보 변경</Link>
                <Link to="email" className={btnActive === "email" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('email');}}>쪽지 관리</Link>
                <Link to="AttendanceManageTeacher" className={btnActive === "AttendanceManageTeacher" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('AttendanceManageTeacher');}}>수강생 출석관리</Link>
                <Link to="grademanage" className={btnActive === "grademanage" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('grademanage');}}>수강생 성적관리</Link>
                <Link to="timetable" className={btnActive === "timetable" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('timetable');}}>수업일정</Link>
                <Link to="studentlist" className={btnActive === "studentlist" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('studentlist');}}>과목별 수강생 확인</Link>
                <Link to="DataAnalysisTeacher" className={btnActive === "DataAnalysisTeacher" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('DataAnalysisTeacher');}}>데이터 분석</Link>
                <Link to="breakaway" className={btnActive === "breakaway" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('breakaway');}}>회원 탈퇴</Link>
            </>
            :
            <>
                <Link to="changeme" className={btnActive === "changeme" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('changeme');}}>개인정보 변경</Link>
                <Link to="email" className={btnActive === "email" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('email');}}>쪽지 관리</Link>
                <Link to="AttendanceManage" className={btnActive === "AttendanceManage" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('AttendanceManage');}}>출석확인</Link>
                <Link to="grademypage" className={btnActive === "grademypage" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('grademypage');}}>성적표</Link>
                <Link to="learningmypage" className={btnActive === "learningmypage" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('learningmypage');}}>수강중인 학습</Link>
                <Link to="DataAnalysis" className={btnActive === "DataAnalysis" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('DataAnalysis');}}>데이터 분석</Link>
                <Link to="breakaway" className={btnActive === "breakaway" ? styles.mypageBtnActive : ""} onClick={() => {setBtnActive('breakaway');}}>회원 탈퇴</Link>
            </>
            }
            </div>
         
        </div>
        
    )

}

export default Sidemenu;
