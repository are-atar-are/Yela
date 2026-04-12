import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
import awsConfig, { validateConfig } from './config/aws-config';
import Login from './features/auth/components/Login';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import Dashboard from './features/dashboard/screens/Dashboard';
import Bookings from './features/bookings/screens/Bookings';
import Employees from './features/employees/screens/Employees';
import Vehicles from './features/vehicles/screens/Vehicles';
import './App.css';

// Configure Amplify on app load
const configureAmplify = () => {
  if (validateConfig()) {
    Amplify.configure(awsConfig);
    console.log('✅ AWS Amplify configured successfully');
  } else {
    console.warn('⚠️ AWS Amplify not configured. Set environment variables to enable authentication.');
  }
};

function App() {
  useEffect(() => {
    configureAmplify();
  }, []);

  return (
    <Routes>
      {/* Login - Landing Page */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes - Fleeto Admin */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/bookings" element={
        <ProtectedRoute>
          <Bookings />
        </ProtectedRoute>
      } />
      
      <Route path="/employees" element={
        <ProtectedRoute>
          <Employees />
        </ProtectedRoute>
      } />
      
      <Route path="/vehicles" element={
        <ProtectedRoute>
          <Vehicles />
        </ProtectedRoute>
      } />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Catch all - redirect to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
