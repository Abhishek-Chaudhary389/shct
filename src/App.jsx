 import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './Home/Hero';
import Schemes from './Home/Schemes';
import Group from './Home/Group'; 

// UserLogin फोल्डर से
import Register from './UserLogin/Register'; 
import Login from './UserLogin/Login'; 

// Pages फोल्डर से 
import AboutSHCT from './Pages/AboutSHCT'; 
import MemberList from './Pages/MemberList'; 
import AnnualDonationList from './Pages/AnnualDonationList'; 

// SahayogForm फोल्डर से 
import BetiSahayogForm from './SahayogForm/BetiSahayogForm'; 
import NidhanSahayogForm from './SahayogForm/NidhanSahayogForm'; 
import GreenParyavaranForm from './SahayogForm/GreenParyavaranForm'; 

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

        {/* ================= BETI SAHAYOG FORM PAGE ================= */}
        <Route 
          path="/beti-sahayog-form" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <BetiSahayogForm />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= NIDHAN SAHAYOG FORM PAGE ================= */}
        <Route 
          path="/nidhan-sahayog-form" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <NidhanSahayogForm />
              </div>
              <Footer />
            </div>
          } 
        />

        {/* ================= GREEN PARYAVARAN FORM PAGE ================= */}
        <Route 
          path="/green-paryavaran-form" 
          element={
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <div className="flex-grow">
                <GreenParyavaranForm />
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

      </Routes>
    </div>
  );
};

export default App;