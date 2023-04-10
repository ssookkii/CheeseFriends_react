import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Login from './login/login';
import Regi from './login/regi';

function App() {

  return (    <div className="App">
  <BrowserRouter>

    <main>
      <div className="py-4">
        <div className="container">
          <Routes>

            <Route path="/" element={<Login/>}></Route>

            <Route path="/regi" element={<Regi/>}></Route>

          </Routes>
        </div>
      </div>
    </main>

  </BrowserRouter>
</div>
  );
}

export default App;
