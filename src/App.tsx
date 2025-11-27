import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WitcherCommandCenter from './pages/Games/Witcher3';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/games/witcher-3" element={<WitcherCommandCenter />} />
            </Routes>
        </Router>
    );
}

export default App;
