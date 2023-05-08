import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ComposedChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import './asset/css/DataAnalysis.css';

const API_URL = 'http://localhost:3000/da';

const calculateAttendanceRate = (attendance, absence) => {
    const total = attendance + absence;
    return total === 0 ? 0 : ((attendance / total) * 100).toFixed(2);
}



const countTotalAttendance = (attendanceData) => {
    const attendanceCount = {};

    attendanceData.forEach((attendance) => {
        const key = `${attendance.subName}`;

        if (!attendanceCount[key]) {
            attendanceCount[key] = {
                subName: attendance.subName,
                출석: 0,
                결석: 0,
                지각: 0,
            };
        }

        attendanceCount[key][attendance.status] = (attendanceCount[key][attendance.status] || 0) + 1;
    });

    return Object.values(attendanceCount);
};


const DataAnalysis = () => {
    const loginInfo = JSON.parse(localStorage.getItem("login"));
    const userId = loginInfo?.id;
    const userAuth = loginInfo?.auth;


    const [gradeData, setGradeData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const totalAttendanceChartData = countTotalAttendance(attendanceData);
    const [selectedRate, setSelectedRate] = useState('출석률');
    const [currentUserId, setCurrentUserId] = useState(null);
    const [selectedEdu, setSelectedEdu] = useState('');
    const [eduCode, seteduCode] = useState([]);

    useEffect(() => {
        if (userAuth === "student") {
            setCurrentUserId(userId);
        } else if (userAuth === "parents") {
            // 백엔드에서 학생 아이디를 가져오는 API 호출
            axios
                .get(`http://localhost:3000/attManage/getStudentId/${userId}`)
                .then((response) => {
                    setCurrentUserId(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [userAuth, userId]);

    useEffect(() => {
        if (!currentUserId) return;
        axios.get(`http://localhost:3000/attManage/edu/${currentUserId}`)
            .then((response) => {
                seteduCode(response.data);
                if (response.data.length > 0) {
                    setSelectedEdu(response.data[0].eduCode);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }, [currentUserId]);

    const handleRateChange = (newRate) => {
        setSelectedRate(newRate);
    }

    const renderAttendanceRateChart = (subName) => {
        const rateValue = calculateRate(subName, selectedRate);
        return (
            <div className="attendance-rate-chart">
                <h2 className='subName-title'>{subName}</h2>
                <div style={{ width: '100%', height: '100%' }}>
                    <CircularProgressbar
                        value={rateValue}
                        text={`${rateValue}%`}
                        strokeWidth={5}
                        styles={buildStyles({
                            strokeLinecap: 'butt',
                            pathColor: '#fac463',
                            textColor: '#8c816e',
                        })}
                    />
                </div>
            </div>
        );
    };
    const calculateRate = (subName, rateType) => {
        const data = totalAttendanceChartData.find((item) => item.subName === subName);
        if (rateType === '출석률') {
            return calculateAttendanceRate(data.출석, data.결석);
        } else if (rateType === '지각률') {
            const total = data.출석 + data.결석 + data.지각;
            return total === 0 ? 0 : ((data.지각 / total) * 100).toFixed(2);
        } else if (rateType === '결석률') {
            const total = data.출석 + data.결석;
            return total === 0 ? 0 : ((data.결석 / total) * 100).toFixed(2);
        }
    };
    const toggleRate = () => {
        if (selectedRate === '출석률') {
            setSelectedRate('지각률');
        } else if (selectedRate === '지각률') {
            setSelectedRate('결석률');
        } else if (selectedRate === '결석률') {
            setSelectedRate('출석률');
        }
    };


    const getAttendanceChartDataForMonth = (month) => {
        return attendanceChartData.filter((data) => data.month === month);
    };
    const incrementMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 12) {
                return 1;
            }
            return prevMonth + 1;
        });
    };

    const decrementMonth = () => {
        setCurrentMonth((prevMonth) => {
            if (prevMonth === 1) {
                return 12;
            }
            return prevMonth - 1;
        });
    };

    const countAttendanceByMonth = (attendanceData) => {
        const attendanceCountByMonth = {};

        attendanceData.forEach((attendance) => {
            const month = new Date(attendance.attendanceTime).getMonth() + 1;
            const key = `${attendance.subName}-${month}`;

            if (!attendanceCountByMonth[key]) {
                attendanceCountByMonth[key] = {
                    subName: attendance.subName,
                    month,
                    출석: 0,
                    결석: 0,
                    지각: 0,
                };
            }

            attendanceCountByMonth[key][attendance.status] = (attendanceCountByMonth[key][attendance.status] || 0) + 1;
        });

        return Object.values(attendanceCountByMonth);

    };
    const groupAttendanceDataByMonth = (attendanceData) => {
        const groupedData = {};

        attendanceData.forEach((data) => {
            const month = data.month;

            if (!groupedData[month]) {
                groupedData[month] = [data];
            } else {
                groupedData[month].push(data);
            }
        });

        return groupedData;
    };
    const exportToExcel = () => {
        const chartGradeData = gradeData.map((item) => {
            const { studentGrade, studentRanks, subTotal } = item;
            const rankRate = (subTotal - studentRanks) / subTotal * 100; // 석차율 계산
            return {
                subName: item.subName,
                studentGrade,
                studentRanks,
                rankRate,
            };
        });
        const attendanceChartData = countAttendanceByMonth(attendanceData);
        const groupedAttendanceData = groupAttendanceDataByMonth(attendanceChartData);
        const wb = XLSX.utils.book_new();

        const gradeHeaderMapping = {
            subName: '과목명',
            studentGrade: '점수',
            studentRanks: '등수',
            rankRate: '석차율',
        };

        const attendanceHeaderMapping = {
            subName: '과목명',
            month: '월',
            출석: '출석',
            결석: '결석',
            지각: '지각',
        };

        const ws1 = XLSX.utils.json_to_sheet([{}], { header: Object.keys(gradeHeaderMapping), skipHeader: true });
        XLSX.utils.sheet_add_aoa(ws1, [Object.values(gradeHeaderMapping)], { origin: 0 });
        XLSX.utils.sheet_add_json(ws1, chartGradeData, { origin: { r: 1, c: 0 }, skipHeader: true });

        XLSX.utils.book_append_sheet(wb, ws1, '성적 데이터');

        Object.keys(groupedAttendanceData).forEach((month) => {
            const monthData = groupedAttendanceData[month].map((data) => {
                return {
                    ...data,
                    출석: Number(data.출석),
                    결석: Number(data.결석),
                    지각: Number(data.지각),
                };
            });

            const ws2 = XLSX.utils.json_to_sheet([{}], { header: Object.keys(attendanceHeaderMapping), skipHeader: true });
            XLSX.utils.sheet_add_aoa(ws2, [Object.values(attendanceHeaderMapping)], { origin: 0 });
            XLSX.utils.sheet_add_json(ws2, monthData, { origin: { r: 1, c: 0 }, skipHeader: true });

            XLSX.utils.book_append_sheet(wb, ws2, `출결 데이터 ${month}월`);
        });

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        };

        saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), '치즈프렌드 리포트.xlsx');

    };


    const attendanceChartData = countAttendanceByMonth(attendanceData);


    useEffect(() => {
        if (!selectedEdu) return;
        const fetchData = async () => {
            try {
                const gradeResponse = await axios.get(`${API_URL}/${selectedEdu}/${currentUserId}/grades`);
                setGradeData(gradeResponse.data);

                const attendanceResponse = await axios.get(`${API_URL}/${selectedEdu}/${currentUserId}/attendance`);
                setAttendanceData(attendanceResponse.data);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };

        fetchData();
    }, [currentUserId, selectedEdu]);

    const getChartData = (data) => {
        return data.map((item) => {
            const { studentGrade, studentRanks, subTotal } = item;
            const rankRate = (subTotal - studentRanks) / subTotal * 100; // 석차율 계산
            return {
                subName: item.subName,
                studentGrade,
                rankRate,
            };
        });
    };
    // Calculate rank percentage
    const calculateRankPercentage = (rank, total) => {
        return ((total - rank + 1) / total * 100).toFixed(2);
    }



    return (
        <div>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <nav className="edu_navstu" style={{ opacity: '0.9', margin: '0px', maxWidth: '100%' }}>
                    <ul>
                        {eduCode.map((edu) => (
                            <li
                                key={edu.eduCode}
                                className={selectedEdu === edu.eduCode ? 'active' : ''}
                                onClick={() => setSelectedEdu(edu.eduCode)}
                                style={{ fontSize: '15px', minWidth: '100px', textAlign: 'center' }}
                            >
                                <img src="/img/cheese.png" alt="Attendance statistics" width="15px" />  {edu.eduName}
                            </li>
                        ))}
                    </ul>
                    <nav className='att_manage' style={{}}>
                        <a
                            href="#"
                            className="DAreportButton"
                            onClick={exportToExcel}

                        >
                            <div>
                                <span style={{ alignItems: 'center' }}>리포트 출력</span>
                            </div>
                        </a>
                    </nav>
                </nav>
            </div>




            <div className="charts-container">
                <div className="chart-section">
                    <div className='AttendanceDate' >
                        <h2 style={{ fontSize: '17px', width: '30%', marginBottom: '20px' }} className="attendance-month">성적 데이터</h2>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getChartData(gradeData)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subName" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar yAxisId="left" dataKey="studentGrade" name="점수" fill="#b89555" />
                            <Bar yAxisId="right" dataKey="rankRate" name="석차율" fill="#f1bb58" />
                        </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={gradeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="subTotal" name="전체인원" fill="#e4b668" />
                            <Line type="monotone" dataKey="studentRanks" name="등수" stroke="#e9760b" />
                        </ComposedChart>
                    </ResponsiveContainer>



                </div>
                <div className="chart-section">
                    <div className='AttendanceDate' >
                        <h2 style={{ fontSize: '17px', width: '35%', marginBottom: '20px' }} className="attendance-month">출결 데이터 ({currentMonth}월)</h2>
                    </div>
                    <div className="month-controls">
                        <button onClick={decrementMonth} style={{ width: '50px', fontSize: '11px', padding: '7px' }}>이전</button>
                        <button onClick={incrementMonth} style={{ width: '50px', fontSize: '11px', padding: '7px' }}>다음</button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={getAttendanceChartDataForMonth(currentMonth)}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subName" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="출석" name="출석" fill="#a2b0f6" />
                            <Bar dataKey="결석" name="결석" fill="#f44336" />
                            <Bar dataKey="지각" name="지각" fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
                    <br></br>
                    <div>
                        <div className='AttendanceDate' >
                            <h2 style={{ fontSize: '17px', width: '35%', marginBottom: '25px' }} className="attendance-month">과목별 {selectedRate}</h2>
                        </div>
                        <div className="rate-tabs">
                            <div className="selectedRate-controls">
                                <div className="attendance-buttons" style={{ marginBottom: '20px' }}>
                                    <a
                                        href="#"
                                        className={`Dabutton attend ${selectedRate === '출석률' ? 'active' : ''}`}
                                        onClick={() => handleRateChange('출석률')}
                                        style={{ backgroundColor: selectedRate === '출석률' ? '#80735e' : '#aaa191' }}
                                    >
                                        <div>
                                            <span>출석률</span>
                                        </div>
                                    </a>

                                    <a
                                        href="#"
                                        className={`Dabutton attend ${selectedRate === '결석률' ? 'active' : ''}`}
                                        onClick={() => handleRateChange('결석률')}
                                        style={{ backgroundColor: selectedRate === '결석률' ? '#80735e' : '#aaa191' }}
                                    >
                                        <div>
                                            <span>결석률</span>
                                        </div>
                                    </a>
                                    <a
                                        href="#"
                                        className={`Dabutton attend ${selectedRate === '지각률' ? 'active' : ''}`}
                                        onClick={() => handleRateChange('지각률')}
                                        style={{ backgroundColor: selectedRate === '지각률' ? '#80735e' : '#aaa191' }}
                                    >
                                        <div>
                                            <span>지각률</span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="attendance-rate-charts">
                            {totalAttendanceChartData.map((data) =>
                                renderAttendanceRateChart(data.subName)
                            )}
                        </div>
                    </div>
                </div>

            </div>

        </div>

    );
};

export default DataAnalysis;
