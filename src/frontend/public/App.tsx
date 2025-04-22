import React from 'react';
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import WelcomePage from './welcome-page';
import GamePage from './game-page';
import Error from './error';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<WelcomePage/>} />
        <Route path="/bride" element={<GamePage variant="bride" />} />
        <Route path="/groom" element={<GamePage variant="groom" />} />
        <Route path="/playground" element={<GamePage variant="playground"/>} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

