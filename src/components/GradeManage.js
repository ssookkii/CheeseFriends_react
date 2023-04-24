import React, {useState, useEffect} from "react";
import axios from "axios";

function GradeManage(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id;

    const [subject, setSubject] = useState([]);
    const [student, setStudent] = useState([]);

    let [btnActive, setBtnActive] = useState(
        localStorage.getItem("btnActive") || 0
    );

     // 담당하는 과목리스트 가져오기
    const getSubTeacherList = async(id) => {
        const response = await axios.get("http://localhost:3000/subTeacherList", {params:{"teacher":id}})
            console.log(response.data);
            setSubject(response.data);
    }

     // 과목학생리스트 가져오기
    const getSubStudentList = async(id, subcode) => {
        const response = await axios.get("http://localhost:3000/subStudentList", {params:{"educatorName":id, "subCode":subcode}})
            console.log(response.data);
            setStudent(response.data);
    }
    // 타이틀 클릭하면 거기에 맞는 과목 가져오기
    const handleSubjectClick = (subCode, i) => {
        getSubStudentList(id, subCode);
        console.log(i);
        setBtnActive(i);
    }

    useEffect(()=>{
        getSubTeacherList(id);
    }, [id]);

    useEffect(()=>{
        if (subject.length > 0) {
            getSubStudentList(id, subject[0].subCode);
        }
    }, [subject]);

    useEffect(() => {
        localStorage.setItem("btnActive", btnActive);
    }, [btnActive]);

    return(
        <div>
            <div className="subject">
            {
                subject.map(function(sub, i){
                    return(
                            <button key={i} onClick={() => handleSubjectClick(sub.subCode, i)}>{sub.subName}</button>
                    )
                })
            }
            </div>
            <div className="options">
                <select>
                    <option>이름</option>
                    <option>석차</option>
                </select>
                <div className="excelBtn">
                    <button>Excel 업로드</button>
                    <button>Excel 다운로드</button>
                </div>
            </div>
            <div className="content">
            {
                student.map(function(student, i){
                    return(
                        <div key={i}>
                            <span>{i+1}</span>
                            {/* <span>{student.userId}</span> */}
                            <span>{student.name}</span>
                            <span>{student.subName}</span>
                            <span>{student.classGrade}</span>
                            <input defaultValue={student.studentGrade}/>
                            <span>{student.studentRanks}/{student.subTotal}</span>
                        </div>
                    )
                })
            }
            </div>
            <button>수정</button>
        </div>
    )
}
export default GradeManage