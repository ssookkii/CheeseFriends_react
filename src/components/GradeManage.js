import React, {useState, useEffect} from "react";
import axios from "axios";

import styles from './asset/css/gradeManage.module.css';

function GradeManage(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id;

    const [subject, setSubject] = useState([]);
    const [student, setStudent] = useState([]);
    const [grade , setGrade] = useState([]);

    const [insert, setInsert] = useState(false);

    let [btnActive, setBtnActive] = useState(0);

     // 담당하는 과목리스트 가져오기
    const getSubTeacherList = async(id) => {
        const response = await axios.get("http://localhost:3000/subTeacherList", {params:{"teacher":id}})
            // console.log(response.data);
            setSubject(response.data);
    }

     // 성적입력 전 과목학생리스트 가져오기
    const getSubStudentList = async(id, subcode) => {
        const response = await axios.get("http://localhost:3000/subStudentList", {params:{"educatorName":id, "subCode":subcode}})
            setStudent(response.data);
    }
    console.log(student);
    console.log(grade[1]);

    // 성적입력 후 석차포함 가져오기
    const getStudentGradeList = async(id, subcode) => {
        const response = await axios.get("http://localhost:3000/gradeRanks", {params:{"educatorName":id, "subCode":subcode}})
        console.log(response.data);
        setGrade(response.data);
    }
    // 타이틀 클릭하면 거기에 맞는 과목 가져오기
    const handleSubjectClick = (subCode, i) => {
            getStudentGradeList(id, subCode);
            getSubStudentList(id, subCode);
        setBtnActive(i);
    }

    useEffect(()=>{
        getSubTeacherList(id);
    }, [id]);

    useEffect(()=>{
        if (subject.length > 0) {
            getSubStudentList(id, subject[0].subCode);
            getStudentGradeList(id, subject[0].subCode);
        }
    }, [subject]);

    useEffect(() => {
        localStorage.setItem("btnActive", btnActive);
    }, [btnActive]);

    // 성적입력버튼 활성화
    function gradeHandler(){
        setInsert(true);
    }
    // 성적입력
    function insertHandler(){

        axios.post("http://localhost:3000/gradeAdd", null, {params: {data:JSON.stringify(student)}})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("성적이 입력되었습니다.");
                setInsert(false);
                console.log(resp.data);
                // window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "duplicate"){
                alert("성적이 이미 입력되었습니다.")
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }
    // 성적수정
    function updateHandler(){
        axios.post("http://localhost:3000/gradeUpdate", null, {params: {data:JSON.stringify(grade)}})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("성적이 수정되었습니다.");
                setInsert(false);
                console.log(resp.data);
                // window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    return(
        <div className={styles.wrap}>
            <div className={styles.subject}>
            {
                subject.map(function(sub, i){
                    return(
                            <button key={i} className={btnActive === i ? `${styles.btnActive} ${styles.sub} `: styles.sub} onClick={() => handleSubjectClick(sub.subCode, i)}>{sub.subName}</button>
                    )
                })
            }
            </div>
            <div className={styles.options}>
                <select className={styles.search}>
                    <option>이름</option>
                    <option>석차</option>
                </select>
                <div className={styles.excelBtn}>
                    <button>Excel 업로드</button>
                    <button>Excel 다운로드</button>
                </div>
            </div>
            <table className={styles.content}>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>이름</th>
                        <th>과목</th>
                        <th>학년</th>
                        <th>성적</th>
                        <th>석차</th>
                    </tr>
                </thead>
                <tbody>
                {/* 성적입력해서 grade에 데이터가 있다면 가져오기 */}
                { grade.length > 0 ? 
                (
                    grade.map(function(grade, i){
                        return(
                            <tr key={i}>
                        <td>{i+1}</td>
                        <td>{grade.name}</td>
                        <td>{grade.subName}</td>
                        <td>{grade.classGrade}</td>
                        <td>
                            {
                            insert ?
                                <input
                                    defaultValue={grade.studentGrade}
                                    className={`${styles.gradeInput} ${styles.border}`} 
                                    onChange={(e) => setGrade(prevState => {
                                        const newState = [...prevState];
                                        newState[i].studentGrade = e.target.value;
                                        return newState;
                                    })}/>
                                : <input value={grade.studentGrade} className={styles.gradeInput}/>
                            }
                            
                        </td>
                        <td>{grade.studentRanks}/{grade.subTotal}</td>
                    </tr>
                        )
                })
                )
                : 
                (
                    student.map(function(student, i){
                        return(
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>{student.name}</td>
                        <td>{student.subName}</td>
                        <td>{student.classGrade}</td>
                        <td>
                            {
                            insert ?
                                <input
                                    defaultValue={student.studentGrade}
                                    className={`${styles.gradeInput} ${styles.border}`} 
                                    onChange={(e) => setStudent(prevState => {
                                        const newState = [...prevState];
                                        newState[i].studentGrade = e.target.value;
                                        return newState;
                                    })}/>
                                : <input value={student.studentGrade} className={styles.gradeInput}/>
                            }
                            
                        </td>
                        <td>{student.studentRanks}/{student.subTotal}</td>
                    </tr>
                        )
                    })
                )
            }
                </tbody>
            </table>
            { grade.length > 0 ? 
            (<div>
                {!insert ? <button className={styles.updateBtn} onClick={gradeHandler}>성적수정</button> : <button className={styles.updateBtn} onClick={updateHandler}>수정완료</button>}
            </div>) :
            (
            <div>
                {!insert ? <button className={styles.updateBtn} onClick={gradeHandler}>성적입력</button> : <button className={styles.updateBtn} onClick={insertHandler}>입력완료</button>}
            </div>) 
            }
        </div>
    )
}
export default GradeManage