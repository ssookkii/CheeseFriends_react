import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

import './App.css';
import Login from './login/login';
import Regi from './login/regi';

function App() {

  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <div>
     <p></p>
=======
=======
>>>>>>> d79a50edb2a998eb04709987d7af939ad8c70ddf
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
     
<<<<<<< HEAD
>>>>>>> b38a646e94896499dca6bba3309bac874473b85a
=======
>>>>>>> d79a50edb2a998eb04709987d7af939ad8c70ddf
    </div>
  );
}

export default App;