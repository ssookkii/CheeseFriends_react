import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css';

import PlayGame from './components/PlayGame';

function App() {

  return (
    <div className="App">
      <BrowserRouter>

        <main>
          <Routes>

            <Route path="/playgame" element={<PlayGame />} />

          </Routes>
        </main>

      </BrowserRouter>

    </div>
  );
}

export default App;