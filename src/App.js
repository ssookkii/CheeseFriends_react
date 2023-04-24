import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';
import Idsearch from './login/idsearch';
import Login from './login/login';
import Passwordsearch from './login/passwordsearch';
import Regi from './login/regi';
import RegiParents from './login/regiparents';
import Regiselect from './login/regiselect';
import Regiteacher from './login/regiteacher';
import Changeme from './mypage/changeme';
import Email from './mypage/email';
import Sendemail from './mypage/sendemail';
import Testmain from './mypage/testmain';

import LectureList from './components/LectureList'
import AbLectureList from './components/AbLectureList'
import LectureWrite from './components/LectureWrite'
import LearningList from './components/LearningList'
import LearningDetail from './components/LearningDetail'
import LearningWrite from './components/LearningWrite'
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import TaskWrite from './components/TaskWrite';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <Routes>

            <Route path="/lecture" element={<LectureList />} />
            <Route path="/lecture/AbLectureList" element={<AbLectureList />} />
            <Route path="/lecture/LectureWrite" element={<LectureWrite />} />
            <Route path="/learning" element={<LearningList />} />
            <Route path="/learning/LearningDetail" element={<LearningDetail />} />
            <Route path="/learning/LearningWrite" element={<LearningWrite />} />
            <Route path="/learning/TaskList" element={<TaskList />} />
            <Route path="/learning/TaskDetail" element={<TaskDetail />} />
            <Route path="/learning/TaskWrite" element={<TaskWrite />} />

            <Route path="/" element={<Login />} />
            <Route path="/regiselect" element={<Regiselect />} />
            <Route path="/regi" element={<Regi />} />
            <Route path="/regiparents" element={<RegiParents />} />
            <Route path="/regiteacher" element={<Regiteacher />} />
            <Route path="/idsearch" element={<Idsearch />} />
            <Route path="/passwordsearch" element={<Passwordsearch />} />
            <Route path="/testmain" element={<Testmain />}>
              <Route path="/testmain/changeme" element={<Changeme />} />
              <Route path="/testmain/email" element={<Email />} />
              <Route path="/testmain/sendemail" element={<Sendemail />} />
            </Route>

          </Routes>
        </div>
    </div>
        </main >

      </BrowserRouter >

    </div >
  );
}

export default App;