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

    const userId = sessionStorage.getItem('userId');
    const [gradesData, setGradesData] = useState([]);
    const [averageScoreChartData, setAverageScoreChartData] = useState([]);
    const [filteredAverageScoreChartData, setFilteredAverageScoreChartData] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [chartTitle, setChartTitle] = useState('전체 학생 출결 데이터');
    const [gradechartTitle, setgradeChartTitle] = useState('전체 학생 과목 평균 점수');
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
        console.log(attendanceRows);
        const wsAttendance = XLSX.utils.json_to_sheet(attendanceRows);

        const chartDataRows = reportData.chartData.map((row) => ({

            과목: reportData.subject,
            월: reportData.month,
            과목: row.name,
            점수: row.value,
        }
        ));
        const wsChartData = XLSX.utils.json_to_sheet(chartDataRows);

        const allStudentsRows = reportData.gradesData.map((gradeData) => {
            const attendanceData = reportData.attendanceData.reduce((result, row) => {
                result[row.name] = row.value;
                return result;
            }, {});

            return {
                과목: reportData.subject,
                월: reportData.month,
                학생이름: gradeData.studentName,
                점수: gradeData.studentGrade,
                출석: attendanceData['출석'] || 0,
                결석: attendanceData['결석'] || 0,
                지각: attendanceData['지각'] || 0,
            };
        });

        const wsAllStudents = XLSX.utils.json_to_sheet(allStudentsRows);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, wsAttendance, "출결 데이터");
        XLSX.utils.book_append_sheet(wb, wsChartData, "평균 점수 차트");
        XLSX.utils.book_append_sheet(wb, wsAllStudents, "전체 학생 데이터");

        XLSX.writeFile(wb, "report-data.xlsx");
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
        setChartTitle(searchText ? `"${searchText}"의 출결 데이터` : '전체 학생 출결 데이터');
    }, [selectedSubject, searchText, students]);

    useEffect(() => {
        // 백엔드에서 과목 데이터를 가져오는 API 호출
        axios.get(`http://localhost:3000/attManage/subjects/${userId}`)
            .then((response) => {
                setSubjects(response.data);
                //console.log(response.data);

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
            setChartTitle(`"${searchText}"의 출결 데이터`);

        } else {
            setChartTitle('전체 학생 출결 데이터');
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
                    <ul style={{ fontSize: '22px' }}>
                        {subjects.map((subject) => (
                            <li
                                key={subject.subCode}
                                className={selectedSubject === subject.subCode ? 'active' : ''}
                                onClick={() => setSelectedSubject(subject.subCode)}
                                style={{ backgroundColor: selectedSubject === subject.subCode ? '#FFDC9D' : 'transparent' }}
                            >
                                {subject.subName}
                            </li>
                        ))}
                    </ul>


                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="학생 이름 입력"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            style={{ width: '100px' }}
                        />
                        <button style={{ fontSize: '13px', backgroundColor: '#FFDC9D' }} onClick={searchMethod}>검색</button>
                        <button onClick={exportToExcel}>리포트 출력</button>
                    </div>


                </nav>
            </div>
            <div className="container">
                <div className="chart-section">
                    <h3>과목별 평균 점수 차트</h3>
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
                            <Bar dataKey="value" name="평균 점수" fill="#8884d8" />

                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-section">

                    <h3>{chartTitle}<span> ( {currentMonth}월 )</span></h3>
                    <div className="month-controls">
                        <button onClick={() => changeMonth(-1)}>이전</button>

                        <button onClick={() => changeMonth(1)}>다음</button>
                    </div>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" name="학생 출결 현황" fill="#8884d8">
                                <Cell fill="#82ca9d" name="출석" />
                                <Cell fill="#ffc658" name="결석" />
                                <Cell fill="#f44336" name="지각" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <div style={{ width: '20%', textAlign: 'center' }}>

                            <CircularProgressbar
                                value={attendanceRate}
                                text={`${isNaN(attendanceRate) ? 0 : attendanceRate.toFixed(2)}%`}
                                styles={buildStyles({
                                    textColor: '#82ca9d',
                                    pathColor: '#82ca9d',
                                })}
                            />  <p>출석률</p>
                        </div>
                        <div style={{ width: '20%', textAlign: 'center' }}>
                            <CircularProgressbar
                                value={absenceRate}
                                text={`${isNaN(absenceRate) ? 0 : absenceRate.toFixed(2)}%`}
                                styles={buildStyles({
                                    textColor: '#ffc658',
                                    pathColor: '#ffc658',
                                })}
                            /> <p>결석률</p>
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
                            <p>지각률</p>
                        </div>
                    </div>
                </div>
            </div >
        </div>
    );
};

export default DataAnalysisTeacher;
