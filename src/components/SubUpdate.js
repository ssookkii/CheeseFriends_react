import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams } from 'react-router';

import styles from './asset/css/addEdit.module.css'

function SubUpdate(){
    const [subject, setSubject] = useState({
        eduCode : "",
        eduName : "",
        subCode : "",
        subName : "",
        educatorName : "",
    });
    const [id, setId] = useState([]);

    const navigate = useNavigate();

    let params = useParams();
    console.log(params.subCode);
    console.log(subject.subName);

    // 과목데이터 뿌려주기
    const getSubData = async(subCode) => {
        const response = await axios.get("http://localhost:3000/getSub", {params:{"subCode":subCode}})
            console.log(response.data);
            setSubject({
                eduCode : response.data.eduCode,
                eduName : response.data.eduName,
                subCode : response.data.subCode,
                subName : response.data.subName,
                educatorName : response.data.educatorName,
            });
    }
    // 아이디데이터 가져오기
    const teacher = "teacher";
    const getIdList = async(teacher) => {
        const response = await axios.get("http://localhost:3000/getIdList", {params:{"auth":teacher}})
            console.log(response.data);
            setId(response.data);
    }
    useEffect(()=>{
        getSubData(params.subCode);
        getIdList(teacher);
    }, [params.subCode]);
    
    function subUpdate(){
        let subData = null;
        if(subject.subName === null || subject.subName === ""){
            alert("과목명을 입력해주세요");
            return;
        } else if(subject.educatorName === null || subject.educatorName === ""){
            alert("담당교사 아이디를 입력해주세요");
            return;
        } else {
            subData = {
                eduCode : params.eduCode,
                eduName : params.eduName,
                subCode : params.subCode,
                subName : subject.subName,
                educatorName : subject.educatorName,
            }
        }

        axios.post("http://localhost:3000/subUpdate", null, {params: subData})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("수정되었습니다");
                console.log(resp.data);
                navigate("/submanage");
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
            <h2 className={styles.title}>과목수정</h2>
            <div className={styles.InputBox}>
                <span>학원코드</span>
                <input type="text"  className={`${styles.Input} ${styles.nonChange}`} value={subject.eduCode}/>
            </div>
            <div className={styles.InputBox}>
                <span>학원명</span>
                <input type="text" className={`${styles.Input} ${styles.nonChange}`} value={subject.eduName}/>
            </div>
            <div className={styles.InputBox}>
                <span>과목코드</span>
                <input type="text" className={`${styles.Input} ${styles.nonChange}`} value={subject.subCode}/>
            </div>
            <div className={styles.InputBox}>
                <span>과목명</span>
                <input
                type="text"
                className={styles.Input}
                defaultValue={subject.subName}
                onInput={(e) => setSubject(prevState => ({...prevState, subName: e.target.value}))}
                />
            </div>
            <div className={`${styles.InputBox} ${styles.datalistAlign}`}>
                <span>담당교사아이디</span> 
                <div>
                    <input type="text" className={styles.Input} list="list" id="ids" defaultValue={subject.educatorName} onInput={(e) => setSubject(prevState => ({...prevState, educatorName: e.target.value}))}/>
                    <datalist id="list">
                        {
                            id.map(function(id, i){
                                return(
                                    <option key={i} value={id.id}/>
                                )
                            })
                        }
                    </datalist>
                </div>
            </div>
            <button className={`${styles.btn} ${styles.btnCenter}`} onClick={subUpdate}>수정완료</button>
        </div>
    )
}
export default SubUpdate