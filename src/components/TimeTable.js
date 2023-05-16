import React, {useState, useEffect} from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from './asset/css/timeTableDetail.module.css';

function TimeTable(){
    const login = JSON.parse(localStorage.getItem("login"));
    const id = login.id

    // 과목별 색상지정
    const colors = ['#6399fa', '#3FB6DC', '#fa7963', '#CDE990', '#25265E'];
    const colorMap = {};
    let count = 0;
    

    // 시간표 넣을 빈 테이블 준비
    const timeSlots = ["", "", "", "", "", "", "", "", "", "", "", "", ""];
    const days = ["", "", "", "", "", "", "", ""];
    const initialTable = Array(timeSlots.length).fill(null).map(() => Array(days.length).fill(""));
    // 앞이 시간 뒤가 요일
    initialTable[0][0] = "09:00";
    initialTable[1][0] = "10:00";
    initialTable[2][0] = "11:00";
    initialTable[3][0] = "12:00";
    initialTable[4][0] = "13:00";
    initialTable[5][0] = "14:00";
    initialTable[6][0] = "15:00";
    initialTable[7][0] = "16:00";
    initialTable[8][0] = "17:00";
    initialTable[9][0] = "18:00";
    initialTable[10][0] = "19:00";
    initialTable[11][0] = "20:00";
    initialTable[12][0] = "21:00";

    const [rowspansave, setRowspansave] = useState([]);
    const [emptyTable, setEmptyTable] = useState(initialTable);
    console.log(rowspansave);
    console.log(emptyTable);

    // 과목데이터 가져오기
    const getTimeList = async(id) => {
        const response = await axios.get("http://localhost:3000/subTimeList", {params:{"teacher":id}})
            console.log(response.data);
            setTimelist(response.data);
            // TimeTable(response.data);
            
    }
     // 과목데이터 저장
    const [timelist, setTimelist] = useState([]);


    useEffect(()=>{
        getTimeList(id);
    }, [id]);
    
    useEffect(()=>{
        if(timelist.length > 0){
                const newRowspansave = [];
        
                // 이전 emptyTable 배열 복사
                const newEmptyTable = [...emptyTable];
                for (let i = 0; i < timelist.length; i++) {
                    const day = timelist[i].subDay;
                    const start = timelist[i].subStartTime;
                    const end = timelist[i].subEndTime;
                    const dayNum = dayCheck(day);
                    const timeNum = timeCheck(start, end);
        
                    // rowspan으로 합쳐주기 위해 첫 칸만 입력
                    newEmptyTable[timeNum[0]][dayNum] = `${timelist[i].subName}(${timelist[i].classGrade})/${timelist[i].subStartTime}-${timelist[i].subEndTime}`;
                    
                    // rowspan 저장해두기
                    newRowspansave.push({
                        length: timeNum.length,
                        day: dayNum,
                        startEnd: timeNum[0],
                    });
                }
                    setRowspansave(newRowspansave);
                    setEmptyTable(newEmptyTable);
        
                // 요일확인함수
                function dayCheck(day){
                    if(day === "월요일"){
                        return 1;
                    }else if(day === "화요일") {
                        return 2;
                    }else if(day === "수요일") {
                        return 3;
                    }else if(day === "목요일") {
                        return 4;
                    }else if(day === "금요일") {
                        return 5;
                    }else if(day === "토요일") {
                        return 6;
                    }else if(day === "일요일") {
                        return 7;
                    }
                }
                // 시간 확인해서 배열에 넣을 숫자로 변경
                function timeCheck(start, end) {
                
                    const time = [];
                    let currentTime = start;
                    while (currentTime <= end) {
                        time.push(currentTime);
                        console.log("여기타임");
                        console.log(time);
                        currentTime = addTime(currentTime, 1); // 1시간을 더함
                    }
                    const timeNum = [];
                    for(let i=0; i<time.length; i++){
                        if((time[i]).substr(0, 2) === "09"){
                            timeNum.push(0);
                        }else if((time[i]).substr(0, 2) === "10"){
                            timeNum.push(1);
                        }else if((time[i]).substr(0, 2) === "11"){
                            timeNum.push(2);
                        }else if((time[i]).substr(0, 2) === "12"){
                            timeNum.push(3);
                        }else if((time[i]).substr(0, 2) === "13"){
                            timeNum.push(4);
                        }else if((time[i]).substr(0, 2) === "14"){
                            timeNum.push(5);
                        }else if((time[i]).substr(0, 2) === "15"){
                            timeNum.push(6);
                        }else if((time[i]).substr(0, 2) === "16"){
                            timeNum.push(7);
                        }else if((time[i]).substr(0, 2) === "17"){
                            timeNum.push(8);
                        }else if((time[i]).substr(0, 2) === "18"){
                            timeNum.push(9);
                        }else if((time[i]).substr(0, 2) === "19"){
                            timeNum.push(10);
                        }else if((time[i]).substr(0, 2) === "20"){
                            timeNum.push(11);
                        }else if((time[i]).substr(0, 2) === "21"){
                            timeNum.push(12);
                        }
                    }                
                    return timeNum;
                        // 시작시간 종료시간 입력되면 한시간간격으로 잘라주는 함수
                        function addTime(time, hoursToAdd) {
                            const [hours, minutes] = time.split(":");
                            const date = new Date();
                            date.setHours(parseInt(hours, 10));
                            date.setMinutes(parseInt(minutes, 10));
                            date.setHours(date.getHours() + hoursToAdd);
                            const newHours = String(date.getHours()).padStart(2, "0");
                            const newMinutes = String(date.getMinutes()).padStart(2, "0");
                            return `${newHours}:${newMinutes}`;
                        }
                    }
            }
            console.log("여기탐리");
            console.log(timelist);
    
    }, [timelist]);


    return (
        <div className={styles.wrap}>
            <div className={styles.btnWrap}>
                <Link to="/cheesefriends/testmain/subjectadd"><em><FontAwesomeIcon icon={faCirclePlus} /></em><span>과목추가</span></Link>
                <Link to="/cheesefriends/testmain/subtimemanage"><em><FontAwesomeIcon icon={faCirclePlus} /></em><span>강의시간추가</span></Link>
            </div>
        <table className={styles.timeTable}>
            <thead>
            <tr>
                <th></th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thu</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Sun</th>
            </tr>
            </thead>
            <tbody>
                {emptyTable.map(function (days, i) {

                    return (
                    <tr key={i}>
                        {days.map(function (time, j) {
                        for (let k = 0; k < rowspansave.length; k++) {
                            if (i === rowspansave[k].startEnd && j === rowspansave[k].day  ) {
                                // 순서대로 색상들어가지만 과목이 같으면 같은 색상이 들어감
                                if (!colorMap[time]) {
                                    colorMap[time] = colors[count];
                                    count++;
                                    console.log(count);
                                    if(count > colors.length){
                                        count = 0;
                                    }
                                }
                                // 시간 표시하기 위해 자르기
                                const index = time.indexOf('/');
                                
                                return (
                                    <td key={j}
                                        rowSpan={rowspansave[k].length}
                                        style={{ backgroundColor: `${colorMap[time]}30`, color:"#555", borderRadius:"5px", fontWeight:"600", borderLeft:`4px solid ${colorMap[time]}`}}
                                        >{time.substr(0, index)}<br/><span>{time.substr(index+1)}</span></td>
                                    );
                            } 
                        }
                            return (
                            <td key={j}>{time}</td>
                            );
                            
                        })}
                    </tr>
                    );
                })}
            </tbody>
        </table>
        </div>
    );
}

export default TimeTable