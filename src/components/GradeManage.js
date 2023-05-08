import React, {useState, useEffect} from "react";
import axios from "axios";
import * as XLSX from 'xlsx'; 
import * as FileSaver from 'file-saver';

import styles from './asset/css/gradeManage.module.css';

function GradeManage(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id;

    const [subject, setSubject] = useState([]);
    const [student, setStudent] = useState([]);
    const [grade , setGrade] = useState([]);
    console.log(grade);

    const [choice, setChoice] = useState('name');
    console.log(choice);

    const [insert, setInsert] = useState(false);
    const [btnChange, setBtnChange] = useState(false);

    let [btnActive, setBtnActive] = useState(
        parseInt(localStorage.getItem("btnActive")) || 0 
    );

     // 담당하는 과목리스트 가져오기
    const getSubTeacherList = async(id) => {
        const response = await axios.get("http://localhost:3000/subTeacherList", {params:{"teacher":id}})
            // console.log(response.data);
            setSubject(response.data);
    }

     // 성적입력 전 과목학생리스트 가져오기
    const getSubStudentList = async(choice, id, subcode) => {
        const response = await axios.get("http://localhost:3000/subStudentList", {params:{"educatorName":id, "subCode":subcode, "choice":choice}})
            setStudent(response.data);
    }

    // 성적입력 후 석차포함 가져오기
    const getStudentGradeList = async(choice, id, subcode) => {
        const response = await axios.get("http://localhost:3000/gradeRanks", {params:{"educatorName":id, "subCode":subcode, "choice":choice}})
        console.log(response.data);
        setGrade(response.data);
    }
    
    // 타이틀 클릭하면 거기에 맞는 과목 가져오기
    const handleSubjectClick = (subCode, i) => {
            getStudentGradeList(choice, id, subCode);
            getSubStudentList(choice, id, subCode);
        setBtnActive(i);
    }

    useEffect(() => {
        localStorage.setItem("btnActive", btnActive);
    }, [btnActive]);

    useEffect(()=>{
        getSubTeacherList(id);
    }, [id]);

    useEffect(()=>{
        if (subject.length > 0) {
            getSubStudentList(choice, id, subject[parseInt(localStorage.getItem("btnActive"))].subCode);
            getStudentGradeList(choice, id, subject[parseInt(localStorage.getItem("btnActive"))].subCode);
        }
    }, [subject]);

    useEffect(() => {
        localStorage.setItem("btnActive", btnActive);
    }, [btnActive]);

    // 성적입력버튼 활성화
    function gradeHandler(){
        setInsert(true);
        setBtnChange(true);
    }
    // 성적입력
    function insertHandler(){

        axios.post("http://localhost:3000/gradeAdd", null, {params: {data:JSON.stringify(student)}})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("성적이 입력되었습니다.");
                setInsert(false);
                setBtnChange(true);
                console.log(resp.data);
                window.location.reload();
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
                setBtnChange(true);
                console.log(resp.data);
                window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }
    // 정렬
    function changeSort(e){
        const choice = e.target.value;
        setChoice(choice);
        getSubStudentList(choice, id, subject[parseInt(localStorage.getItem("btnActive"))].subCode);
        getStudentGradeList(choice, id, subject[parseInt(localStorage.getItem("btnActive"))].subCode);
    }
    // 엑셀 다운로드
    function ExcelDownload(){
        const excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        const excelFileExtension = '.xlsx';
        // 입력된 성적 유무로 엑셀 다운로드 데이터 변경
        const gradeData = grade.length > 0 ? 
            grade.map((g) => ({
                subCode: g.subCode,
                subName: g.subName,
                studentId: g.studentId,
                name: g.name,
                studentGrade: g.studentGrade,
                studentRanks: g.studentRanks,
                subTotal: g.subTotal
            })) : 
            student.map((s) => ({
                subCode: s.subCode,
                subName: s.subName,
                studentId: s.userId,
                name: s.name,
                studentGrade: s.studentGrade
            }));
        const ws = XLSX.utils.json_to_sheet(gradeData);
        console.log(ws);

        const wb = { Sheets: { grade: ws }, SheetNames: ["grade"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: excelFileType });
        FileSaver.saveAs(data, `file${excelFileExtension}`, { autoBOM: true });
    }
    // 엑셀 업로드
    function ExcelUpload(e){
        const file = e.target.files[0];
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            // 엑셀 파일의 내용을 이용한 작업 수행
            if(grade.length > 0){
                Promise.all(
                    grade.map((g, i) => {
                        return new Promise((resolve) => {
                        setGrade(prevState => {
                            const newState = [...prevState];
                            newState[i] = { ...g, studentGrade: jsonData[i+1][4] };
                            return newState;
                        });
                        resolve();
                        });
                    })
                    ).then(() => {
                        console.log('All grade updates are completed.');
                        setBtnChange(true);
                        alert("수정완료버튼을 눌러야 수정이 완료됩니다.");
                    }).catch((err) => {
                        console.error(err);
                    });

            }else {
                Promise.all(
                student.map((s, i) => {
                    return new Promise((resolve) => {
                    setStudent(prevState => {
                        const newState = [...prevState];
                        newState[i] = { ...s, studentGrade: jsonData[i+1][4] };
                        return newState;
                    });
                    resolve();
                    });
                })
                ).then(() => {
                    setBtnChange(true);
                    alert("입력완료버튼을 눌러야 입력이 완료됩니다.");
                }).catch((err) => {
                    console.error(err);
                });
            }
            
        };

    };

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
                <select className={styles.search} value={choice} onChange={changeSort}>
                    <option value="name">이름</option>
                    <option value="rank">석차</option>
                </select>
                <div className={styles.excelBtn}>
                    <label>
                        <input type="file" onChange={ExcelUpload}/>
                        <div>Excel 업로드</div>
                    </label>
                    <button onClick={ExcelDownload}>Excel 다운로드</button>
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
                {!btnChange ? <button className={styles.updateBtn} onClick={gradeHandler}>성적수정</button> : <button className={styles.updateBtn} onClick={updateHandler}>수정완료</button>}
            </div>) :
            (
            <div>
                {!btnChange ? <button className={styles.updateBtn} onClick={gradeHandler}>성적입력</button> : <button className={styles.updateBtn} onClick={insertHandler}>입력완료</button>}
            </div>) 
            }
        </div>
    )
}
export default GradeManage