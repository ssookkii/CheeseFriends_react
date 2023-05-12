import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router';

import styles from './asset/css/addEdit.module.css'

function TeaUpdate(){
    const [teacher, setTeacher] = useState({
        eduCode : "",
        eduName : "",
        id : "",
        name : "",
        email : "",
        phone : "",
        auth : "",
    });
    const [subject, setSubject] = useState([]);

    const navigate = useNavigate();

    let params = useParams();

    // 아이디데이터 가져오기
    const getIdData = async(id) => {
        const response = await axios.get("http://localhost:3000/getTeacher", {params:{"id":id}})
            console.log(response.data);
            setTeacher({
                eduCode : response.data.eduCode,
                eduName : response.data.eduName,
                id : response.data.id,
                name : response.data.name,
                email : response.data.email,
                phone : response.data.phone,
                auth : response.data.auth,
            });
    }
    // 담당하는 과목리스트 가져오기
    const getTeacherSubList = async(id) => {
        const response = await axios.get("http://localhost:3000/getTeacherSubList", {params:{"id":id}})
            console.log(response.data);
            setSubject(response.data)
    }
    useEffect(()=>{
        getIdData(params.id);
        getTeacherSubList(params.id);
    }, [params.id]);

    function teacherUpdate(){
        let teacherData = null;
        if(teacher.name === null || teacher.name === ""){
            alert("담당교사 이름을 입력해주세요");
            return;
        } else {
            teacherData = {
                id : teacher.id,
                name : teacher.name,
                email : teacher.email,
                phone : teacher.phone,
            }
        }

        axios.post("http://localhost:3000/teacherUpdate", null, {params: teacherData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("수정되었습니다");
                console.log(resp.data);
                navigate("/adminpage/teachermanage");
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    return (

        <div className={styles.addEditWrap}>
            <h2 className={styles.title}>교사정보수정</h2>
            <div className={styles.InputBox}>
                <span>학원코드</span>
                <input type="text"  className={`${styles.Input} ${styles.nonChange}`} value={`(${teacher.eduCode}) ${teacher.eduName}`}/>
            </div>
            <div className={styles.InputBox}>
                <span>아이디</span>
                <input type="text" className={`${styles.Input} ${styles.nonChange}`} value={teacher.id}/>
            </div>
            {
                subject.map(function(sub, i){
                    return(
                        <div className={styles.InputBox}>
                            <span key={i}>담당과목{i+1}</span>
                            <input type="text" className={`${styles.Input} ${styles.nonChange}`} value={`(${sub.subCode}) ${sub.subName}`}/>
                        </div>
                    )
                })
            }
            <div className={styles.InputBox}>
                <span>이름</span>
                <input
                type="text"
                className={styles.Input}
                defaultValue={teacher.name}
                onInput={(e) => setTeacher(prevState => ({...prevState, name: e.target.value}))}
                />
            </div>
            <div className={styles.InputBox}>
                <span>이메일</span>
                <input
                type="text"
                className={styles.Input}
                defaultValue={teacher.email}
                onInput={(e) => setTeacher(prevState => ({...prevState, email: e.target.value}))}
                />
            </div>
            <div className={styles.InputBox}>
                <span>전화번호</span>
                <input
                type="text"
                className={styles.Input}
                defaultValue={teacher.phone}
                onInput={(e) => setTeacher(prevState => ({...prevState, phone: e.target.value}))}
                />
            </div>
            <button className={`${styles.btn} ${styles.btnCenter}`} onClick={teacherUpdate}>수정완료</button>
        </div>
    )
}
export default TeaUpdate