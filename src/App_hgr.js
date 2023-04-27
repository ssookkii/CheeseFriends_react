import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';

import PlayGame from './components/PlayGame';
import PlayGame1 from './components/PlayGame1';
import PlayGame2 from './components/PlayGame2';
import Sidebar from './components/ShelterSidebar';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

          <nav>
            <Link to="/playgame">게임 1</Link>
            <Link to="/playgame1">게임 2</Link>
            <Link to="/playgame2">게임 3</Link>
          </nav>
        
          <Routes>

            <Route path="/playgame" element={<PlayGame />} />
            <Route path="/playgame1" element={<PlayGame1 />} />
            <Route path="/playgame2" element={<PlayGame2 />} />

          </Routes>
      

      </BrowserRouter>

    </div>
  );
}

export default App;