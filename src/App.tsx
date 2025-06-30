import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navigation from './components/Navigation';
import LandingPage from './pages/LandingPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import PsychometricTest from './pages/PsychometricTest';
import JobApplication from './pages/JobApplication';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/recruiter" element={<RecruiterDashboard />} />
            <Route path="/candidate" element={<CandidateDashboard />} />
            <Route path="/apply/:jobId" element={<JobApplication />} />
            <Route path="/test/:jobId" element={<PsychometricTest />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;