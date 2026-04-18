import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SiteConfigProvider } from './context/SiteConfigContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import Features from './pages/Features';
import Status from './pages/Status';
import Changelog from './pages/Changelog';
import FAQ from './pages/FAQ';
import Team from './pages/Team';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <SiteConfigProvider>
        <Router>
          <div className="App" data-testid="app-container">
            <Routes>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route
                path="*"
                element={
                  <>
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
                  </>
                }
              />
            </Routes>
          </div>
        </Router>
      </SiteConfigProvider>
    </ThemeProvider>
  );
}

export default App;
