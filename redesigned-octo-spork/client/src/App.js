import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Live from './pages/Live';
import StreamViewer from './pages/StreamViewer';
import Movies from './pages/Movies';
import MoviePlayer from './pages/MoviePlayer';
import Admin from './pages/Admin';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<Live />} />
            <Route path="/stream/:id" element={<StreamViewer />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movie/:id" element={<MoviePlayer />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;