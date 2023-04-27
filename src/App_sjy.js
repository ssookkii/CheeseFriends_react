import React, { useState, useEffect }  from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import './App.css';
import LectureList from './components/LectureList'
import AbLectureList from './components/AbLectureList'
import LectureWrite from './components/LectureWrite'
import LearningList from './components/LearningList'
import LearningDetail from './components/LearningDetail'
import LearningWrite from './components/LearningWrite'
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import TaskWrite from './components/TaskWrite';
import Youtube from './components/Youtube'
import Chatbot from './components/Chatbot';

function App_sjy() {

    return (
        <BrowserRouter>
            <main>
                <Routes>
                        <Route path="/lecture/LectureList" element={ <LectureList/>} />
                        <Route path="/lecture/AbLectureList" element={ <AbLectureList/>} />
                        <Route path="/lecture/LectureWrite" element={ <LectureWrite/>} />
                        <Route path="/lecture/Youtube" element={ <Youtube/>} />

                        <Route path="/learning/LearningList" element={ <LearningList/>} />
                        <Route path="/learning/LearningDetail" element={ <LearningDetail/>} />
                        <Route path="/learning/LearningWrite" element={ <LearningWrite/>} />
                       
                        <Route path="/learning/TaskList" element={ <TaskList/>} />
                        <Route path="/learning/TaskDetail" element={ <TaskDetail/>} />
                        <Route path="/learning/TaskWrite" element={ <TaskWrite/>} />
            {/*
                        <Route path="/learning/QnaList" element={ <QnaList/>} />
                        <Route path="/learning/QnaDetail" element={ <QnaDetail/>} />
                        <Route path="/learning/QnaWrite" element={ <QnaWrite/>} />
                        <Route path="/learning/QnaAnswer" element={ <QnaAnswer/>} />

                        <Route path="/eduinfo/EduInfoList" element={ <EduInfoList/>} />
                        <Route path="/eduinfo/EduInfoDetail" element={ <EduInfoDetail/>} />
                        <Route path="/eduinfo/EduInfoWrite" element={ <EduInfoWrite/>} />

                        <Route path="/service/ServiceList" element={ <ServiceList/>} />
                        <Route path="/service/ServiceDetail" element={ <ServiceDetail/>} />
                        <Route path="/service/ServiceWrite" element={ <ServiceWrite/>} />
                        <Route path="/service/ServiceAnswer" element={ <ServiceAnswer/>} /> */}

                        <Route path="/service/Chatbot" element={ <Chatbot/> } />
                </Routes>
            </main>
    </BrowserRouter>
    );
}

export default App_sjy;