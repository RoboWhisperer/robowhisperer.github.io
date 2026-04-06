import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Features from './pages/Features';
import Status from './pages/Status';
import Changelog from './pages/Changelog';
import FAQ from './pages/FAQ';
import Team from './pages/Team';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="App" data-testid="app-container">
          {/* Particles disabled for compatibility */}
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/status" element={<Status />} />
              <Route path="/changelog" element={<Changelog />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/team" element={<Team />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
