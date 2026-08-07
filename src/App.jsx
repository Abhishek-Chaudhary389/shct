 import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Home/Hero';
import Schemes from './components/Home/Schemes';
import Group from './components/Home/Group'; 

// UserLogin फोल्डर से
import Register from './Pages/UserLogin/Register'; 
import Login from './Pages/UserLogin/Login'; 
import UserDashboard from './Pages/UserLogin/UserDashborad'; // Add import for UserDashboard
import AdminLogin from './Pages/AdminPanel/AdminLogin';
import AdminDashboard from './Pages/AdminPanel/AdminDashboard'; 

// Pages फोल्डर से 
import AboutSHCT from './Pages/AboutSHCT'; 
import MemberList from './Pages/MemberList'; 
import AnnualDonationList from './Pages/AnnualDonationList'; 
import RulesRegulations from './Pages/RulesRegulations'; 

// SahayogForm फोल्डर से 
import BetiSahayogForm from './Pages/SahayogForm/BetiSahayogForm'; 
import NidhanSahayogForm from './Pages/SahayogForm/NidhanSahayogForm'; 
import GreenParyavaranForm from './Pages/SahayogForm/GreenParyavaranForm'; 
import BetiSahayogAavedanList from './Pages/Sahayata List/BetiSahayogAavedanList';
import NidhanSahayogAavedanList from './Pages/Sahayata List/NidhanSahayogAavedanList';
import GreenParyavaranList from './Pages/Sahayata List/GreenParyavaranList';
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminProtectedRoute from './components/AdminProtectedRoute';

const App = () => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <Routes>
        
        {/* ================= HOME PAGE ================= */}
        <Route 
          path="/" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Hero />
                <Schemes />
                <Group />
              </div>
              <Footer /> 
            </div>
          } 
        />

        {/* ================= ABOUT SHCT PAGE ================= */}
        <Route 
          path="/about-shct" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <AboutSHCT />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= MEMBER LIST PAGE ================= */}
        <Route 
          path="/member-list" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <MemberList />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= ANNUAL DONATION LIST PAGE ================= */}
        <Route 
          path="/annual-donation-list" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <AnnualDonationList />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= RULES & REGULATIONS PAGE ================= */}
        <Route 
          path="/rules-regulations" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <RulesRegulations />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= SAHAYOG FORM PAGE ================= */}
        <Route 
          path="/sahayog-form" 
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
                  <BetiSahayogForm />
                </div>
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ================= BETI SAHAYOG FORM PAGE ================= */}
        <Route 
          path="/beti-sahayog-form" 
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
                  <BetiSahayogForm />
                </div>
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ================= NIDHAN SAHAYOG FORM PAGE ================= */}
        <Route 
          path="/nidhan-sahayog-form" 
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
                  <NidhanSahayogForm />
                </div>
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ================= GREEN PARYAVARAN FORM PAGE ================= */}
        <Route 
          path="/green-paryavaran-form" 
          element={
            <ProtectedRoute>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-grow">
                  <GreenParyavaranForm />
                </div>
                <Footer />
              </div>
            </ProtectedRoute>
          } 
        />

        {/* ================= SAHAYATA LIST PUBLIC PAGES ================= */}
        <Route 
          path="/sahayata-list/beti" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <BetiSahayogAavedanList />
              </div>
              <Footer />
            </div>
          } 
        />
        <Route 
          path="/sahayata-list/nidhan" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <NidhanSahayogAavedanList />
              </div>
              <Footer />
            </div>
          } 
        />
        <Route 
          path="/sahayata-list/green" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <GreenParyavaranList />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= REGISTRATION PAGE ================= */}
        <Route 
          path="/register" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Register />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= LOGIN PAGE ================= */}
        <Route 
          path="/login" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <Login />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= USER DASHBOARD PAGE ================= */}
        <Route 
          path="/user-dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />

        {/* ================= ADMIN LOGIN PAGE ================= */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ================= ADMIN DASHBOARD PAGE ================= */}
        <Route 
          path="/admin-dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />

      </Routes>
    </div>
  );
};

export default App;