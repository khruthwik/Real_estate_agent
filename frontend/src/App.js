// src/App.jsx
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import LoginPage from './pages/Login';
import UltimateRealEstateRegister from './pages/Registration';
import LeasingDashboard from './pages/Dashboard';
import ChatInterface from './pages/Chat';
import PropertyPortfolioSection from './pages/Apartments';
import AddProperty from './pages/Addproperties'; // ✅ Make sure this path matches your file location
import BrokerDashboard from './pages/Brokercal';
import ScheduleEventForm from './pages/Schedule';

function App() {
  return (
    <Router>
      <Routes>
        {/* default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<UltimateRealEstateRegister />} />

        {/* main app routes */}
        <Route path="/dashboard" element={<LeasingDashboard />} />
        <Route path="/Chatpage" element={<ChatInterface />} />
        <Route path="/property-portfolio" element={<PropertyPortfolioSection />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/calendar" element={<BrokerDashboard />} />

         <Route path="/schedule" element={<ScheduleEventForm />} />

        {/* optional fallback route */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
