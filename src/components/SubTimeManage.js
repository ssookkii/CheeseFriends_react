import React, {useState, useEffect} from "react"
import axios from "axios";
import DatePicker from "react-datepicker";
import moment from "moment";
import { ko } from 'date-fns/esm/locale';
import { format } from "date-fns";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from './asset/css/timeTable.module.css';
import './asset/css/reactDatePickerCustom.css';
import "react-datepicker/dist/react-datepicker.css";

function SubTimeManage(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id

    const [insertDateTime, setInsertDateTime] = useState({
        subCode : "",
        classGrade : "",
        subStart : "",
        subDay : "",
        subStartTime : "",
        subEndTime : "",
        educatorName : id,
    });
    const [subDateTime, setSubDateTime] = useState([]);
    const [sub, setSub] = useState([]);
    const [startDate, setStartDate] = useState("");
    console.log(subDateTime);

    const [subUpdateBtn, setSubUpdateBtn] = useState(false);
    let [btnActive, setBtnActive] = useState('');

    // 과목데이터 가져오기
    const getSubDateTime = async(id) => {
        const response = await axios.get("http://localhost:3000/subTimeList", {params:{"teacher":id}})
            console.log(response.data);
            setSubDateTime(response.data);
    }
    // 과목데이터 가져오기
    const getTSubList = async(id) => {
        const response = await axios.get("http://localhost:3000/getTSubList", {params:{"teacher":id}})
            // console.log(response.data);
            setSub(response.data);
    }

    useEffect(()=>{
        getSubDateTime(id);
        getTSubList(id);
    }, [id]);

    // 수정버튼 클릭 시 수정완료로 버튼변경
    function updateBtnHandler(i){
        setSubUpdateBtn(true);
        setBtnActive(i);
    }
    // 날짜입력
    const dateChange = (date) => {
        setStartDate(date);
    }
    useEffect(() => {
        // 날짜 형식변경(date를 직접 바꾸면 invalid error나기때문)
        let formattedDate = changeFormat(startDate, "yyyy-MM-DD");
        console.log(formattedDate);
        setInsertDateTime(prevState => ({...prevState, subStart: formattedDate}));
        console.log(insertDateTime);
    }, [startDate]);

    // 날짜형식변경함수
    function changeFormat(date, format){
        if(moment(date).isValid()){
            return moment(date).format(format);
        }else {
            return null;
        }
    }

    // 과목 선택 시 대상학년 자동 업데이트
    const subChangeHandler = (e) => {
        setInsertDateTime(prevState => ({...prevState, subCode: e.target.value}))
        const subCode = e.target.value;
        const index = sub.findIndex((item) => item.subCode === subCode);
        if (index !== -1) {
            setInsertDateTime(prevState => ({
                ...prevState,
                classGrade: sub[index].classGrade // 대상학년 값으로 업데이트
            }));
        }
    }
    
    // 과목생성
    function timeTableAdd(){


        if(insertDateTime.subCode === null || insertDateTime.subCode === ""){
            alert("과목을 선택해주세요");
            return;
        } else if(insertDateTime.subDay === null || insertDateTime.subDay === "") {
            alert("강의요일을 선택해주세요");
            return;
        } else if(insertDateTime.subStartTime === null || insertDateTime.subStartTime === "") {
            alert("강의시작시간을 선택해주세요");
            return;
        } else if(insertDateTime.subEndTime === null || insertDateTime.subEndTime === "") {
            alert("강의종료시간을 선택해주세요");
            return;
        }
        
        axios.post("http://localhost:3000/timeTableAdd", null, {params: insertDateTime})
        .then(function(resp){
            if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                alert("강의시간이 입력되었습니다.");
                console.log(resp.data);
                window.location.reload();
            }else if(resp.data !== null && resp.data !== "" && resp.data === "duplicate"){
                alert("강의시간이 이미 생성되어있습니다.")
            }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                alert("입력칸을 확인해주십시오")
            }
        })
        .catch(function(err){
            alert(err);
        })
    }

    // 과목수정
    function timeUpdate(){

        let timeUpdateData = null;
        // 날짜정규식확인
        let regex = RegExp(/^\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/);
        if(subDateTime[btnActive].subDay === null || subDateTime[btnActive].subDay === ""){
            alert("요일을 선택해주세요");
            return;
        }else if(subDateTime[btnActive].subStartTime === null || subDateTime[btnActive].subStartTime === ""){
            alert("강의시작시간을 입력해주세요");
            return;
        }else if(subDateTime[btnActive].subEndTime === null || subDateTime[btnActive].subEndTime === ""){
            alert("강의종료시간을 입력해주세요");
            return;
        }else if(subDateTime[btnActive].subStart.match(regex) === null ){
            alert("날짜를 형식에 맞게 입력해주세요");
            return;
        }else{
            timeUpdateData = {
                seq : subDateTime[btnActive].seq,
                subDay : subDateTime[btnActive].subDay,
                subStart : subDateTime[btnActive].subStart,
                subStartTime : subDateTime[btnActive].subStartTime,
                subEndTime : subDateTime[btnActive].subEndTime,
                educatorName : id,
            }
            axios.post("http://localhost:3000/timeTableUpdate", null, {params: timeUpdateData})
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
    // 과목삭제
    function deleteBtn(seq){
        if(window.confirm("정말 삭제하시겠습니까?")){
            axios.post("http://localhost:3000/timeTableDelete", null, {params: {"seq":seq}})
            .then(function(resp){
                if(resp.data !== null && resp.data !== "" && resp.data === "success"){
                    alert("삭제되었습니다.");
                    console.log(resp.data);
                    window.location.reload();
                }else if(resp.data !== null && resp.data !== "" && resp.data === "fail"){
                    alert("삭제를 실패하였습니다.")
                }
            })
            .catch(function(err){
                alert(err);
            })
        }else{
            alert("취소되었습니다.");
        }
        
    }
    
    return(
        <div className={styles.wrap}>
        <h2>강의시간관리</h2>
        <div className={styles.subInputBox}>
            <div className={styles.InputBox}>
                <span>과목명</span>
                <div className={styles.selectCustom}>
                    <select value={insertDateTime.subCode} onChange={subChangeHandler}>
                        <option value="">과목선택</option>
                        {
                            sub.map(function(sub, i){

                                return(
                                    <option key={i} value={sub.subCode}>({sub.subCode}){sub.subName}</option>
                                )
                            })

                        }
                    </select>
                </div>
            </div>
            <div className={styles.InputBox}>
                <span>대상학년</span>
                <p>{insertDateTime.classGrade}</p>
            </div>
            <div className={`${styles.InputBox}`}>
                <span>개강일</span>
                <div>
                    <DatePicker
                        selected={startDate}
                        onChange={dateChange}
                        dateFormat="yyyy/MM/dd" 
                        locale={ko}
                        isClearable
                        placeholderText="YYYY/MM/DD"
                    />
                </div>
            </div>
            <div className={`${styles.InputBox}`}>
                <span>강의요일</span>
                <div className={styles.selectCustom}>
                    <select value={insertDateTime.subDay} onChange={(e) => setInsertDateTime(prevState => ({...prevState, subDay: e.target.value}))}>
                        <option value="">강의요일선택</option>
                        <option value="월요일">월요일</option>
                        <option value="화요일">화요일</option>
                        <option value="수요일">수요일</option>
                        <option value="목요일">목요일</option>
                        <option value="금요일">금요일</option>
                        <option value="토요일">토요일</option>
                        <option value="일요일">일요일</option>
                    </select>
                </div>
            </div>
            <div className={`${styles.InputBox}`}>
                <span>시작시간</span>
                <input type="time" className={styles.dayTime} defaultValue={insertDateTime.subStartTime} onChange={(e) => setInsertDateTime(prevState => ({...prevState, subStartTime: e.target.value}))}/>
            </div>
            <div className={` ${styles.InputBox}`}>
                <span>종료시간</span>
                <input type="time" className={styles.dayTime} defaultValue={insertDateTime.subEndTime} onChange={(e) => setInsertDateTime(prevState => ({...prevState, subEndTime: e.target.value}))}/>
            </div>
        </div>
        <div className={styles.btnWrap}>
            <button className={styles.btn} onClick={timeTableAdd}>시간추가</button>
        </div>
        <table className={styles.subjectList}>
            <thead>
                <tr>
                    <th>과목코드</th>
                    <th>과목명</th>
                    <th>대상학년</th>
                    <th>개강일</th>
                    <th>요일</th>
                    <th>시간</th>
                    <th>교육자</th>
                    <th>관리</th>
                </tr>
            </thead>
            <tbody>
            {
                    subDateTime.map(function(dateTime, i){
                        return(
                            <tr key={i}>
                                <td>{dateTime.subCode}</td>
                                <td>{dateTime.subName}</td>
                                <td>{dateTime.classGrade}</td>
                                <td>
                                    {subUpdateBtn && btnActive === i ? 
                                    <input type="text" defaultValue={dateTime.subStart} onChange={(e) => setSubDateTime(prevState => {
                                        const newState = [...prevState];
                                        newState[i].subStart = e.target.value;
                                        return newState;
                                        })}
                                        style={{border:"1px solid #777", borderRadius:"5px", height:"30px"}}/>
                                    : <>{dateTime.subStart}</>
                                    }
                                </td>
                                <td>
                                    {
                                        subUpdateBtn && btnActive === i ? 
                                        <div>
                                            <select defaultValue={dateTime.subDay} onChange={(e) => setSubDateTime(prevState => {
                                                    const newState = [...prevState];
                                                    newState[i].subDay = e.target.value;
                                                    return newState;
                                                })}
                                                style={{border:"1px solid #777", borderRadius:"5px", padding:"5px"}}>
                                                <option value="월요일">월요일</option>
                                                <option value="화요일">화요일</option>
                                                <option value="수요일">수요일</option>
                                                <option value="목요일">목요일</option>
                                                <option value="금요일">금요일</option>
                                                <option value="토요일">토요일</option>
                                                <option value="일요일">일요일</option>
                                            </select>
                                        </div>
                                        : <input type="text" value={dateTime.subDay}/>
                                    }
                                    
                                </td>
                                <td>
                                    {
                                        subUpdateBtn && btnActive === i ? 
                                        <div className={styles.dateTimeBox}>
                                            <div className={`${styles.dayTime}`}>
                                                    <input
                                                        type="time" 
                                                        className={styles.teTime}
                                                        defaultValue={dateTime.subStartTime} 
                                                        onChange={(e) => setSubDateTime(prevState => {
                                                            const newState = [...prevState];
                                                            newState[i].subStartTime = e.target.value;
                                                            return newState;
                                                        })}
                                                    />
                                            </div>
                                            ~
                                            <div className={`${styles.dayTime}`}>
                                                    <input
                                                        type="time" 
                                                        className={styles.teTime}
                                                        defaultValue={dateTime.subEndTime} 
                                                        onChange={(e) => setSubDateTime(prevState => {
                                                            const newState = [...prevState];
                                                            newState[i].subEndTime = e.target.value;
                                                            return newState;
                                                        })}
                                                    />
                                            </div>
                                        </div>
                                        : <input type="text" value={`${dateTime.subStartTime} ~ ${dateTime.subEndTime}`}/>
                                        
                                    }
                                    
                                    </td>
                                <td>{dateTime.name}</td>
                                <td>
                                    <div>
                                        {
                                            subUpdateBtn && btnActive === i ? 
                                            <button className={`${styles.ok}`} onClick={() => timeUpdate()}>완료</button>
                                            : <button className={styles.Edit} onClick={() => updateBtnHandler(i)}><FontAwesomeIcon icon={faPen} /></button>
                                        }
                                    </div>
                                    <div>
                                        {
                                            subUpdateBtn && btnActive === i ? 
                                            <button className={styles.no} onClick={() => setSubUpdateBtn(false)}>취소</button>
                                            : <button className={styles.Del} onClick={() => deleteBtn(dateTime.seq)}><FontAwesomeIcon icon={faTrashCan} /></button>
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
export default SubTimeManage