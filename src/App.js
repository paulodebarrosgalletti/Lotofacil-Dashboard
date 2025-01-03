import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import AllDraws from './components/AllDraws';
import BetGenerator from './components/BetGenerator';
import CheckResults from './components/CheckResults';
import SavedResults from './components/SavedResults';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/all-draws" element={<AllDraws />} />
            <Route path="/bet-generator" element={<BetGenerator />} />
            <Route path="/check-results" element={<CheckResults />} />
            <Route path="/saved-results" element={<SavedResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
