import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Login from './login/login';
import Regi from './login/regi';

function App() {

  return (
<<<<<<< HEAD
    <div>
     <p></p>
=======
    <div className="App">
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
     
>>>>>>> b38a646e94896499dca6bba3309bac874473b85a
    </div>
  );
}

export default App;
