import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute'; 

// Public Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import PublicSchedule from './pages/PublicSchedule';

// Doctor Pages
import DashboardDoctor from './pages/doctor/DashboardDoctor'; // Halaman Baru
import InputDiagnosis from './pages/doctor/InputDiagnosis';
import ManageSchedule from './pages/doctor/ManageSchedule';
import DoctorProfile from './pages/doctor/DoctorProfile';
import ApiKeyPage from './pages/doctor/ApiKeyPage'; // Halaman Baru

// Patient Pages
import DashboardPatient from './pages/patient/DashboardPatient'; // Halaman Baru
import Booking from './pages/patient/Booking';
import MedicalRecords from './pages/patient/MedicalRecords';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          {/* Navbar Global (Logikanya sudah diatur di dalam Navbar.js) */}
          <Navbar />
          
          <div style={{ flex: 1 }}>
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* HALAMAN JADWAL DOKTER UMUM (BARU) */}
              <Route path="/schedule" element={<PublicSchedule />} />

              {/* --- DOCTOR ROUTES --- */}
              <Route 
                path="/dashboard-doctor" 
                element={
                  <PrivateRoute role="DOCTOR">
                    <DashboardDoctor />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doctor/api-keys" 
                element={
                  <PrivateRoute role="DOCTOR">
                    <ApiKeyPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doctor/input-diagnosis" 
                element={
                  <PrivateRoute role="DOCTOR">
                    <InputDiagnosis />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doctor/manage-schedule" 
                element={
                  <PrivateRoute role="DOCTOR">
                    <ManageSchedule />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/doctor/profile" 
                element={
                  <PrivateRoute role="DOCTOR">
                    <DoctorProfile />
                  </PrivateRoute>
                } 
              />

              {/* --- PATIENT ROUTES --- */}
              <Route 
                path="/dashboard-patient" 
                element={
                  <PrivateRoute role="PATIENT">
                    <DashboardPatient />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/booking" 
                element={
                  <PrivateRoute role="PATIENT">
                    <Booking />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/medical-records" 
                element={
                  <PrivateRoute role="PATIENT">
                    <MedicalRecords />
                  </PrivateRoute>
                } 
              />

              {/* Fallback jika route salah */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;