import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/styles.css';

// Pages
import VotingPage from './pages/VotingPage.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Container className="py-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<VotingPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;