import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';

import PlayGame from './components/PlayGame';
import PlayGame1 from './components/PlayGame1';
import PlayGame2 from './components/PlayGame2';
import ShelterPage from './components/ShelterPage';


function App() {

  return (
    <BrowserRouter>
        
      <main>

        <Routes>
          <Route path="/shelterpage" element={ <ShelterPage/>}>
            <Route path="/shelterpage/playgame" element={<PlayGame />} />
            <Route path="/shelterpage/playgame1" element={<PlayGame1 />} />
            <Route path="/shelterpage/playgame2" element={<PlayGame2 />} />
          </Route>
        </Routes>
      </main>

    </BrowserRouter>

    
  );
}

export default App;