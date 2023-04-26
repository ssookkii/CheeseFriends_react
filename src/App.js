import React, {useEffect} from 'react';
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
import Email from './mypage/receivemail';
import Sendemail from './mypage/sendemail';
import Testmain from './mypage/testmain';

function App() {


  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <div className="py-4">
            <div className="container">
              <Routes>

                <Route path="/" element={<Login/>}></Route>

                <Route path="/regiselect" element={<Regiselect/>}></Route>
                <Route path="/regi" element={<Regi/>}></Route>
                <Route path="/regiparents" element={<RegiParents/>}></Route>
                <Route path="/regiteacher" element={<Regiteacher/>}></Route>
                <Route path="/idsearch" element={<Idsearch/>}></Route>
                <Route path="/passwordsearch" element={<Passwordsearch/>}></Route>
                
                <Route path="/testmain" element={<Testmain/>}>
                  <Route path="/testmain/changeme" element={<Changeme/>} />
                  <Route path="/testmain/email" element={<Email/>} />
                  <Route path="/testmain/sendemail" element={<Sendemail/>} />
                </Route>

              </Routes>
            </div>
          </div>
        </main>

      </BrowserRouter>
     
    </div>
  );
}

export default App;