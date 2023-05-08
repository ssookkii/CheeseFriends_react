import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './asset/css/DataAnalysisTeacher.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const API_URL = 'http://localhost:3000/da';

const DataAnalysisTeacher = () => {

    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;

    const [gradesData, setGradesData] = useState([]);
    const [averageScoreChartData, setAverageScoreChartData] = useState([]);
    const [filteredAverageScoreChartData, setFilteredAverageScoreChartData] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [chartTitle, setChartTitle] = useState('학생 출결 현황');
    const [gradechartTitle, setgradeChartTitle] = useState('학생 과목 평균 점수');
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [chartData, setChartData] = useState([
        { name: '출석', value: 0 },
        { name: '결석', value: 0 },
        { name: '지각', value: 0 },
    ]);


    const exportToExcel = () => {
        const reportData = {
            subject: subjects.find((subject) => subject.subCode === selectedSubject)?.subName,
            month: currentMonth,
            searchName: searchText,
            attendanceData: chartData,
            chartData: searchText ? filteredAverageScoreChartData : averageScoreChartData,
            gradesData: gradesData,
        };

        const attendanceRows = reportData.attendanceData.map((row) => ({
            과목: reportData.subject,
            월: reportData.month,
            출결상태: row.name,
            출석현황: row.value,
        }));
        const wsAttendance = XLSX.utils.json_to_sheet(attendanceRows);

        const chartDataRows = reportData.chartData.map((row) => ({

            과목: reportData.subject,
            월: reportData.month,
            과목: row.name,
            점수: row.value,
        }
        ));
        const wsChartData = XLSX.utils.json_to_sheet(chartDataRows);

        // 월별로 데이터를 필터링합니다.
        const monthlyStudents = students.filter((student) => {
            const studentDate = new Date(student.attendanceTime);
            return studentDate.getMonth() + 1 === currentMonth;
        });

        // 중복되지 않은 학생 이름 목록을 생성합니다.
        const uniqueStudentNames = Array.from(new Set(monthlyStudents.map((student) => student.name)));

        // 학생 이름별로 데이터를 그룹화합니다.
        const groupedStudents = uniqueStudentNames.map((name) => {
            const studentsByName = monthlyStudents.filter((student) => student.name === name);

            // 출석 현황을 계산합니다.
            const attendanceCount = studentsByName.filter((student) => student.status === '출석').length;
            const absenceCount = studentsByName.filter((student) => student.status === '결석').length;
            const tardinessCount = studentsByName.filter((student) => student.status === '지각').length;

            // 학생의 성적 데이터를 찾습니다.
            const studentGradeData = gradesData.find((grade) => grade.studentName === name);

            return {
                name,
                attendanceCount,
                absenceCount,
                tardinessCount,
                studentGrade: studentGradeData ? studentGradeData.studentGrade : '미입력',
            };
        });

        // 그룹화된 데이터를 바탕으로 allStudentsRows를 생성합니다.
        const allStudentsRows = groupedStudents.map((student) => ({
            과목: reportData.subject,
            월: reportData.month,
            학생이름: student.name,
            점수: student.studentGrade,
            출석: student.attendanceCount,
            결석: student.absenceCount,
            지각: student.tardinessCount,
        }));



        const wsAllStudents = XLSX.utils.json_to_sheet(allStudentsRows);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsAttendance, "출결 데이터");
        XLSX.utils.book_append_sheet(wb, wsChartData, "평균 점수 차트");
        XLSX.utils.book_append_sheet(wb, wsAllStudents, "(" + currentMonth + "월) 전체 학생 데이터");

        XLSX.writeFile(wb, "치즈프렌드 리포트.xlsx");
    };


    const calculateAverageScoreChartData = () => {
        if (!gradesData.length) return [];

        const scoresBySubject = {};

        gradesData.forEach((grade) => {
            if (!scoresBySubject[grade.subName]) {
                scoresBySubject[grade.subName] = { total: 0, count: 0 };
            }

            scoresBySubject[grade.subName].total += grade.studentGrade;
            scoresBySubject[grade.subName].count++;
        });

        const chartData = Object.entries(scoresBySubject).map(([subName, { total, count }]) => ({
            name: subName,
            value: total / count,
        }));

        return chartData;
    };

    const changeMonth = (delta) => {
        setCurrentMonth((prevMonth) => {
            const newMonth = prevMonth + delta;
            if (newMonth < 1) return 12;
            if (newMonth > 12) return 1;
            return newMonth;
        });
    };
    const [attendanceRate, setAttendanceRate] = useState(0);
    const [absenceRate, setAbsenceRate] = useState(0);
    const [tardinessRate, setTardinessRate] = useState(0);

    useEffect(() => {
        setAverageScoreChartData(calculateAverageScoreChartData());
    }, [gradesData]);

    const calculateFilteredAverageScoreChartData = () => {
        if (!gradesData.length || !searchText) return [];

        const filteredGrades = gradesData.filter((grade) =>
            grade.studentName && grade.studentName.includes(searchText)
        );

        const scoresBySubject = {};

        filteredGrades.forEach((grade) => {
            if (!scoresBySubject[grade.subName]) {
                scoresBySubject[grade.subName] = { total: 0, count: 0 };
            }

            scoresBySubject[grade.subName].total += grade.studentGrade;
            scoresBySubject[grade.subName].count++;
        });

        const chartData = Object.entries(scoresBySubject).map(([subName, { total, count }]) => ({
            name: subName,
            value: total / count,
        }));

        return chartData;
    };

    useEffect(() => {
        setFilteredAverageScoreChartData(calculateFilteredAverageScoreChartData());
    }, [searchText, gradesData]);

    useEffect(() => {
        if (!selectedSubject) return;

        axios.get(`${API_URL}/grades/${selectedSubject}`)
            .then((response) => {
                setGradesData(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [selectedSubject]);

    useEffect(() => {
        if (!selectedSubject) return;

        // 이름이 일치하는 학생 데이터만 필터링
        const filtered = students.filter((student) => student.name.includes(searchText));

        // 출석, 결석, 지각 횟수 계산
        const attendanceCount = filtered.filter((student) => student.status === '출석').length;
        const absenceCount = filtered.filter((student) => student.status === '결석').length;
        const tardinessCount = filtered.filter((student) => student.status === '지각').length;


        // 차트 데이터 설정
        setChartData([
            { name: '출석', value: attendanceCount },
            { name: '결석', value: absenceCount },
            { name: '지각', value: tardinessCount },
        ]);

        // 차트 제목 설정
        setChartTitle(searchText ? `"${searchText}"의 출결 현황` : '학생 출결 현황');
    }, [selectedSubject, searchText, students]);

    useEffect(() => {
        // 백엔드에서 과목 데이터를 가져오는 API 호출
        axios.get(`http://localhost:3000/attManage/teacher/subjects/${userId}`)
            .then((response) => {
                setSubjects(response.data);
                console.log(response.data);

                // 첫번째 항목을 기본 선택으로 설정
                if (response.data.length > 0) {
                    setSelectedSubject(response.data[0].subCode);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (!selectedSubject) return; // 선택된 과목이 없으면 함수 실행을 중지합니다.

        // 백엔드에서 출결 데이터를 가져오는 API 호출
        axios
            .get(`http://localhost:3000/attManage/${selectedSubject}`)
            .then((response) => {
                setStudents(response.data);
                setFilteredStudents(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [selectedSubject, searchText]);

    useEffect(() => {
        if (!selectedSubject) return;
        // 월별로 데이터를 필터링
        const monthlyStudents = students.filter((student) => {
            const studentDate = new Date(student.attendanceTime);
            return studentDate.getMonth() + 1 === currentMonth;
        });

        // 아무것도 입력되지 않았을 경우 모든 학생 데이터를 반환하고, 그렇지 않으면 이름이 정확히 일치하는 학생 데이터만 필터링
        const filtered = searchText === '' ? monthlyStudents : monthlyStudents.filter((student) => student.name === searchText);

        // 출석, 결석, 지각 횟수 계산
        const attendanceCount = filtered.filter((student) => student.status === '출석').length;
        const absenceCount = filtered.filter((student) => student.status === '결석').length;
        const tardinessCount = filtered.filter((student) => student.status === '지각').length;
        // 출석률, 결석률, 지각률 계산
        const totalCount = attendanceCount + absenceCount + tardinessCount;
        setAttendanceRate((attendanceCount / totalCount) * 100);
        setAbsenceRate((absenceCount / totalCount) * 100);
        setTardinessRate((tardinessCount / totalCount) * 100);

        // 차트 데이터 설정
        setChartData([
            { name: '출석', value: attendanceCount },
            { name: '결석', value: absenceCount },
            { name: '지각', value: tardinessCount },
        ]);

        // 차트 제목 설정
        if (searchText && filtered.length > 0) {
            setChartTitle(`"${searchText}"의 출결 현황`);

        } else {
            setChartTitle('학생 출결 현황');
        }
    }, [selectedSubject, searchText, students, currentMonth]

    );



    // 검색 함수 정의
    const searchMethod = () => {
        console.log('searchText:', searchText);
        setFilteredStudents(students.filter((student) => student.name.includes(searchText)));
    };

    return (
        <div>
            <div className='datanav' >
                <nav style={{ backgroundColor: 'white' }}>
                    <nav className='att_manage'>
                        <ul>
                            {subjects.map((subject) => (
                                <li
                                    key={subject.subCode}
                                    className={selectedSubject === subject.subCode ? 'active' : ''}
                                    onClick={() => setSelectedSubject(subject.subCode)}
                                    style={{ minWidth: '80px', textAlign: 'center' }}
                                >
                                    {subject.subName}
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="학생 이름 입력"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ marginLeft: '300px', width: '100px' }}
                        />
                        <a
                            href="#"
                            className="DAreportButton"
                            onClick={exportToExcel}

                        >
                            <div>
                                <span style={{ alignItems: 'center' }}>리포트 출력</span>
                            </div>
                        </a>


                    </div>


                </nav>
            </div>
            <div className="DataContainer">
                <div className="chart-section">
                    <div className='AttendanceDate' >
                        <h2 style={{ fontSize: '16px', width: '33%' }} className="attendance-month">
                            과목별 평균 점수
                        </h2>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={searchText ? filteredAverageScoreChartData : averageScoreChartData}
                            margin={{ top: 20, right: 20, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="평균 점수" fill="#e7bd6d" />

                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-section">
                    <div className='AttendanceDate' >
                        <h2 style={{ fontSize: '16px' }} className="attendance-month">
                            {chartTitle}<span style={{ fontSize: '12px' }}> ( {currentMonth}월 )</span>
                        </h2>
                    </div>


                    <div className="month-controls">
                        <button onClick={() => changeMonth(-1)} style={{ width: '50px', fontSize: '11px', padding: '7px' }}>이전</button>

                        <button onClick={() => changeMonth(1)} style={{ width: '50px', fontSize: '11px', padding: '7px' }}>다음</button>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="학생 출결 현황" fill="#aa9a89">
                                <Cell fill="#a2b0f6" name="출석" />
                                <Cell fill="#ffc658" name="결석" />
                                <Cell fill="#f44336" name="지각" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <br></br>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ width: '20%', textAlign: 'center' }}>

                            <CircularProgressbar
                                value={attendanceRate}
                                text={`${isNaN(attendanceRate) ? 0 : attendanceRate.toFixed(2)}%`}
                                styles={buildStyles({
                                    textColor: '#a2b0f6',
                                    pathColor: '#a2b0f6',
                                })}
                            />  <h2 className='subName-title'>출석률</h2>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                            <CircularProgressbar
                                value={absenceRate}
                                text={`${isNaN(absenceRate) ? 0 : absenceRate.toFixed(2)}%`}
                                styles={buildStyles({
                                    textColor: '#ffc658',
                                    pathColor: '#ffc658',
                                })}
                            /> <h2 className='subName-title'>결석률</h2>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                            <CircularProgressbar
                                value={tardinessRate}
                                text={`${isNaN(tardinessRate) ? 0 : tardinessRate.toFixed(2)}%`}
                                styles={buildStyles({
                                    textColor: '#f44336',
                                    pathColor: '#f44336',
                                })}
                            />
                            <h2 className='subName-title'>지각률</h2>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
};

export default DataAnalysisTeacher;
