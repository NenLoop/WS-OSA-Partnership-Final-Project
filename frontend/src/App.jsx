import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import PartnershipList from './pages/PartnershipList';
import PartnershipDetail from './pages/PartnershipDetail';
import PartnershipCreate from './pages/PartnershipCreate';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function Logout() {
  localStorage.clear()
  return <Navigate to="/" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register/>
}

function App() {
  // Simple state-based routing for demonstration
  // In a real app, you would use 'react-router-dom'

  // dear past self we are using 'react-router-dom now' - future you 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/partnerships" element={
          <ProtectedRoute>
            <PartnershipList />
          </ProtectedRoute>
        } />
        <Route path="/partnerships/:id" element={
          <ProtectedRoute>
            <PartnershipDetail />
          </ProtectedRoute>
        } />
        <Route path="/partnerships-create/" element={
          <ProtectedRoute>
            <PartnershipCreate />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;