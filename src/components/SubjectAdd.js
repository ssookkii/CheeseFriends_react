import React, {useState, useEffect} from "react"
import axios from "axios";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from './asset/css/timeTable.module.css';


function SubjectAdd(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id

    const [subName, setSubName] = useState('');
    const [level, setLevel] = useState('');
    const [subData, setSubData] = useState([]);

    // const [updateSubName, setUpdateSubName] = useState('');
    // const [updateLevel, setUpdateLevel] = useState('');

    const [subUpdateBtn, setSubUpdateBtn] = useState(false);
    let [btnActive, setBtnActive] = useState('');

    // 과목데이터 가져오기
    const getSubData = async(id) => {
        const response = await axios.get("http://localhost:3000/getTSubList", {params:{"teacher":id}})
            console.log(response.data);
            setSubData(response.data);
    }
    useEffect(()=>{
        console.log(id);
        getSubData(id);
    }, [id]);

    // 수정버튼 클릭 시 수정완료로 버튼변경
    function updateBtnHandler(i){
        setSubUpdateBtn(true);
        setBtnActive(i);
    }
    // 과목수정
    function subUpdate(){
        let subUpdateData = null;
        if(subData[btnActive].subName === null || subData[btnActive].subName === ""){
            alert("과목명을 입력해주세요");
            return;
        }else if(subData[btnActive].classGrade === null || subData[btnActive].classGrade === ""){
            alert("대상학년을 입력해주세요");
            return;
        }else{
            subUpdateData = {
                subCode : subData[btnActive].subCode,
                subName : subData[btnActive].subName,
                classGrade : subData[btnActive].classGrade,
                educatorName : id,
            }
            
            // axios.post("http://localhost:3000/subUpdate", null, {params: {"subCode": subCode, "subName" : updateSubName, "classGrade":updateLevel, "educatorName":id}})
            axios.post("http://localhost:3000/subUpdate", null, {params: subUpdateData})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    console.log(resp.data);
                    alert("수정되었습니다");
                    window.location.reload();
                }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                    alert("입력칸을 확인해주십시오")
                }
            })
            .catch(function(err){
                alert(err);
            })
        }
    }
    // 과목생성
    function subAdd(){
        if(subName === null || subName === ""){
            alert("과목명을 입력해주세요");
            return;
        } else if(level === null || level === "") {
            alert("대상학년을 선택해주세요");
            return;
        }
        axios.post("http://localhost:3000/subAdd", null, {params: {"subName" : subName, "classGrade":level, "educatorName":id}})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("과목이 생성되었습니다.");
                console.log(resp.data);
                window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "duplicate"){
                alert("과목이 이미 생성되어있습니다.")
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }
    // 과목삭제
    function deleteBtn(subCode){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/subDelete", null, {params: {"subCode":subCode}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                    alert("삭제를 실패하였습니다.")
                }
            })
            .catch(function(err){
                alert("과목을 수강중인 학생이 있습니다.");
            })
        }else{
            alert("취소되었습니다.");
        }
        
    }




    return(
        <div className={styles.wrap}>
            <h2>과목관리</h2>
            <div className={styles.topContentWrap}>
                <div className={styles.subInputBox}>
                    <div className={styles.InputBox}>
                        <span>과목명*</span>
                        <input type="text" placeholder="과목명" defaultValue={subName} onChange={(e) => setSubName(e.target.value)}/>
                    </div>
                    <div className={`${styles.InputBox} ${styles.datalistAlign}`}>
                        <span>대상학년*</span>
                        <div className={styles.selectBox}>
                            <input type="text" list="list" id="level" defaultValue={level} onInput={(e) => setLevel(e.target.value)}  placeholder='대상학년'/>
                            <datalist id="list">
                                <option value="일반">일반</option>
                                <option value="고3">고3</option>
                                <option value="고2">고2</option>
                                <option value="고1">고1</option>
                                <option value="중3">중3</option>
                                <option value="중2">중2</option>
                                <option value="중1">중1</option>
                                <option value="초6">초6</option>
                                <option value="초5">초5</option>
                                <option value="초4">초4</option>
                                <option value="초3">초3</option>
                                <option value="초2">초2</option>
                                <option value="초1">초1</option>
                                <option value="유치부">유치부</option>
                            </datalist>
                        </div>
                    </div>
                </div>
                <div className={styles.btnWrap}>
                    <button className={styles.btn} onClick={subAdd}>과목생성</button>
                </div>
            </div>
            <table className={styles.subjectList}>
                <thead>
                    <tr>
                        <th>과목코드</th>
                        <th>과목명</th>
                        <th>대상학년</th>
                        <th>교육자</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        subData.map(function(subData, i){
                            return(
                                <tr key={i}>
                                    <td>{subData.subCode}</td>
                                    <td>
                                        {
                                            subUpdateBtn && btnActive === i ? 
                                            <input type="text" 
                                                className={styles.changeData} d
                                                efaultValue={subData.subName}
                                                onChange={(e) => setSubData(prevState => {
                                                    const newState = [...prevState];
                                                    newState[i].subName = e.target.value;
                                                    return newState;
                                                })}
                                            />
                                            : <input type="text" value={subData.subName}/>
                                        }
                                        
                                    </td>
                                    <td>
                                        {
                                            subUpdateBtn && btnActive === i ? 
                                            <div>
                                                <input type="text"
                                                    className={styles.changeData}
                                                    list="list"
                                                    id="level"
                                                    defaultValue={subData.classGrade}
                                                    onChange={(e) => setSubData(prevState => {
                                                        const newState = [...prevState];
                                                        newState[i].classGrade = e.target.value;
                                                        return newState;
                                                    })}
                                                />
                                                <datalist id="list">
                                                    <option value="일반">일반</option>
                                                    <option value="고3">고3</option>
                                                    <option value="고2">고2</option>
                                                    <option value="고1">고1</option>
                                                    <option value="중3">중3</option>
                                                    <option value="중2">중2</option>
                                                    <option value="중1">중1</option>
                                                    <option value="초6">초6</option>
                                                    <option value="초5">초5</option>
                                                    <option value="초4">초4</option>
                                                    <option value="초3">초3</option>
                                                    <option value="초2">초2</option>
                                                    <option value="초1">초1</option>
                                                    <option value="유치부">유치부</option>
                                                </datalist>
                                            </div>
                                            : <input type="text" value={subData.classGrade}/>
                                            
                                        }
                                        
                                        </td>
                                    <td>{subData.name}</td>
                                    <td>
                                        <div>
                                            {
                                                subUpdateBtn && btnActive === i ? 
                                                <button className={`${styles.ok}`} onClick={() => subUpdate(subData.subCode)}>완료</button>
                                                : <button className={styles.Edit} onClick={() => updateBtnHandler(i)}><FontAwesomeIcon icon={faPen} /></button>
                                            }
                                        </div>
                                        <div>
                                            {
                                                subUpdateBtn && btnActive === i ? 
                                                <button className={styles.no} onClick={() => setSubUpdateBtn(false)}>취소</button>
                                                : <button className={styles.Del} onClick={() => deleteBtn(subData.subCode)}><FontAwesomeIcon icon={faTrashCan} /></button>
                                            }
                                        </div>
                                            
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )

}
export default SubjectAdd