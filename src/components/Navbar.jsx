 import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/shct.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isDesktopAboutOpen, setIsDesktopAboutOpen] = useState(false);
  
  // Sahayata List ड्रॉपडाउन के लिए स्टेट
  const [isDesktopSahayataOpen, setIsDesktopSahayataOpen] = useState(false);
  const [isMobileSahayataOpen, setIsMobileSahayataOpen] = useState(false);

  // Sahayog Form ड्रॉपडाउन के लिए नए स्टेट
  const [isDesktopSahayogFormOpen, setIsDesktopSahayogFormOpen] = useState(false);
  const [isMobileSahayogFormOpen, setIsMobileSahayogFormOpen] = useState(false);

  // Colors picked strictly from your new logo
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  return (
    <header className="w-full bg-white shadow-md font-sans relative z-50">
      
      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden lg:flex w-full max-w-[1600px] mx-auto h-[120px]">
        
        {/* LEFT COLUMN: Logo Container */}
        <div className="w-[200px] bg-white flex items-center justify-center border-r border-gray-100 shrink-0">
          <Link to="/" className="h-[100px] w-[140px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
             <img src={logoImg} alt="Silent Help Logo" className="h-full w-full object-contain scale-[1.3]" />
          </Link>
        </div>

        {/* RIGHT COLUMN: Top Info + Bottom Nav */}
        <div className="flex-1 flex flex-col">
          
          {/* TOP ROW: Info & Contacts */}
          <div className="h-[70px] bg-white flex justify-between items-center px-4 xl:px-6">
            
            {/* Top Info / Branding */}
            <div className="flex items-center space-x-3 cursor-pointer group shrink-0">
              <div className="p-2 rounded-full text-white transition-transform group-hover:scale-105" style={{ backgroundColor: logoOrange }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-xl xl:text-2xl font-serif italic text-gray-800 tracking-tight">Help For</span>
                <span className="text-xl xl:text-2xl font-serif italic text-gray-800 tracking-tight border-b-2 border-gray-400 ml-1">Helpless</span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex space-x-4 xl:space-x-6 items-center text-sm shrink-0">
              <div className="flex items-center space-x-2 xl:space-x-3">
                <svg className="w-6 h-6 xl:w-7 xl:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <div>
                  <p className="text-gray-500 text-xs">Helpline</p>
                  <p className="font-bold text-gray-900">+ 999XXXXXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 xl:space-x-3 border-l border-gray-300 pl-4 xl:pl-6">
                <svg className="w-6 h-6 xl:w-7 xl:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <div>
                  <p className="text-gray-500 text-xs">Send email</p>
                  <p className="font-bold text-gray-900">shct@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 xl:space-x-3 border-l border-gray-300 pl-4 xl:pl-6">
                <svg className="w-6 h-6 xl:w-7 xl:h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div>
                  <p className="font-bold text-gray-700 text-xs">Head office:- Khalilabad Post- </p>
                  <p className="font-bold text-gray-700 text-xs">Sant Kabir Nagar (UP) - 272175</p>
                </div>
              </div>
            </div>

          </div>

          {/* BOTTOM ROW: Navigation Links & Action Buttons */}
          <div className="h-[50px] flex justify-between items-center" style={{ backgroundColor: logoTeal }}>
            
            <div className="flex space-x-3 xl:space-x-5 pl-4 xl:pl-6 text-white font-semibold text-[13px] xl:text-sm items-center">
              
              {/* ================= ABOUT DROPDOWN ================= */}
              <div 
                className="relative flex items-center h-full py-2 cursor-pointer whitespace-nowrap"
                onClick={() => setIsDesktopAboutOpen(!isDesktopAboutOpen)}
                onMouseEnter={() => setIsDesktopAboutOpen(true)}
                onMouseLeave={() => setIsDesktopAboutOpen(false)}
              >
                <span className="hover:text-orange-200 transition-colors flex items-center gap-1">
                  About
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isDesktopAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-[40px] left-0 w-48 bg-white text-gray-800 shadow-xl rounded-md flex flex-col overflow-hidden border-t-4 z-50 transition-all duration-300 ${isDesktopAboutOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`} 
                  style={{ borderColor: logoOrange }}
                >
                  <Link to="/about-shct" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium">About SHCT</Link>
                  <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium">Gallery</Link>
                  <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] transition-colors font-medium">Video</Link>
                </div>
              </div>

              {/* General Links */}
              <Link to="/member-list" className="hover:text-orange-200 transition-colors whitespace-nowrap">Member List</Link>
              <Link to="#" className="hover:text-orange-200 transition-colors whitespace-nowrap">Vivah Sahayog List</Link>
              <Link to="/annual-donation-list" className="hover:text-orange-200 transition-colors whitespace-nowrap">Annual Donation List</Link>
              <Link to="#" className="hover:text-orange-200 transition-colors whitespace-nowrap">Nidhan Sahayog</Link>
              <Link to="#" className="hover:text-orange-200 transition-colors whitespace-nowrap">Rules & Regulations</Link>
              
              {/* ================= SAHAYOG FORM DROPDOWN ================= */}
              <div 
                className="relative flex items-center h-full py-2 cursor-pointer whitespace-nowrap"
                onClick={() => setIsDesktopSahayogFormOpen(!isDesktopSahayogFormOpen)}
                onMouseEnter={() => setIsDesktopSahayogFormOpen(true)}
                onMouseLeave={() => setIsDesktopSahayogFormOpen(false)}
              >
                <span className="hover:text-orange-200 transition-colors flex items-center gap-1">
                  Sahayog Form
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isDesktopSahayogFormOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-[40px] left-0 w-56 bg-white text-gray-800 shadow-xl rounded-md flex flex-col overflow-hidden border-t-4 z-50 transition-all duration-300 ${isDesktopSahayogFormOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`} 
                  style={{ borderColor: logoOrange }}
                >
                  <Link to="/beti-sahayog-form" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">Beti Sahayog Form</Link>
                  <Link to="/nidhan-sahayog-form" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">Nidhan Sahayog Form</Link>
                  <Link to="/green-paryavaran-form" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] transition-colors font-medium text-[13px]">Green Paryavaran Form</Link>
                </div>
              </div>

              {/* ================= SAHAYATA LIST DROPDOWN ================= */}
              <div 
                className="relative flex items-center h-full py-2 cursor-pointer whitespace-nowrap"
                onClick={() => setIsDesktopSahayataOpen(!isDesktopSahayataOpen)}
                onMouseEnter={() => setIsDesktopSahayataOpen(true)}
                onMouseLeave={() => setIsDesktopSahayataOpen(false)}
              >
                <span className="hover:text-orange-200 transition-colors flex items-center gap-1">
                  Sahayata List
                  <svg className={`w-4 h-4 transition-transform duration-300 ${isDesktopSahayataOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {/* Dropdown Menu */}
                <div 
                  className={`absolute top-[40px] left-0 w-64 bg-white text-gray-800 shadow-xl rounded-md flex flex-col overflow-hidden border-t-4 z-50 transition-all duration-300 ${isDesktopSahayataOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`} 
                  style={{ borderColor: logoOrange }}
                >
                  <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">Beti Sahayog Aavedan List</Link>
                  <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">Nidhan Sahayog Aavedan List</Link>
                  <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] transition-colors font-medium text-[13px]">Green Paryavaran List</Link>
                </div>
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex h-full shrink-0">
              <Link to="/register" className="h-full px-4 xl:px-6 flex items-center justify-center font-bold text-white text-[13px] xl:text-sm transition-colors hover:bg-orange-600 border-r border-orange-400 whitespace-nowrap" style={{ backgroundColor: logoOrange }}>
                NEW REGISTRATION
              </Link>
              <Link to="/login" className="h-full px-6 xl:px-8 flex items-center justify-center font-bold text-white text-[13px] xl:text-sm transition-colors hover:bg-orange-600 whitespace-nowrap" style={{ backgroundColor: logoOrange }}>
                LOGIN
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="lg:hidden w-full flex flex-col">
        {/* Mobile Top Bar */}
        <div className="flex justify-between items-center p-3 bg-white border-b">
          <Link to="/" className="h-20 w-24 flex items-center justify-center cursor-pointer">
             <img src={logoImg} alt="Logo" className="h-full w-full object-contain scale-[1.2]" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="flex flex-col text-white font-semibold shadow-inner" style={{ backgroundColor: logoTeal }}>
            
            {/* ABOUT DROPDOWN (MOBILE) */}
            <div>
              <button 
                onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)} 
                className="w-full text-left py-3 px-6 border-b border-white/20 flex justify-between items-center focus:outline-none"
              >
                About
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileAboutOpen && (
                <div className="bg-[#06616e] flex flex-col text-sm border-b border-white/20">
                  <Link to="/about-shct" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">About SHCT</Link>
                  <Link to="#" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Gallery</Link>
                  <Link to="#" className="py-3 px-10 hover:bg-white/10 transition-colors">Video</Link>
                </div>
              )}
            </div>

            {/* General Links Here */}
            <Link to="/member-list" className="py-3 px-6 border-b border-white/20">Member List</Link>
            <Link to="#" className="py-3 px-6 border-b border-white/20">Vivah Sahayog List</Link>
            <Link to="/annual-donation-list" className="py-3 px-6 border-b border-white/20">Annual Donation List</Link>
            <Link to="#" className="py-3 px-6 border-b border-white/20">Nidhan Sahayog</Link>
            <Link to="#" className="py-3 px-6 border-b border-white/20">Rules & Regulations</Link>
            
            {/* SAHAYOG FORM DROPDOWN (MOBILE) */}
            <div>
              <button 
                onClick={() => setIsMobileSahayogFormOpen(!isMobileSahayogFormOpen)} 
                className="w-full text-left py-3 px-6 border-b border-white/20 flex justify-between items-center focus:outline-none"
              >
                Sahayog Form
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileSahayogFormOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileSahayogFormOpen && (
                <div className="bg-[#06616e] flex flex-col text-sm border-b border-white/20">
                  <Link to="/beti-sahayog-form" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Beti Sahayog Form</Link>
                  <Link to="/nidhan-sahayog-form" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Nidhan Sahayog Form</Link>
                  <Link to="/green-paryavaran-form" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Green Paryavaran Form</Link>
                </div>
              )}
            </div>

            {/* SAHAYATA LIST DROPDOWN (MOBILE) */}
            <div>
              <button 
                onClick={() => setIsMobileSahayataOpen(!isMobileSahayataOpen)} 
                className="w-full text-left py-3 px-6 border-b border-white/20 flex justify-between items-center focus:outline-none"
              >
                Sahayata List
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileSahayataOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileSahayataOpen && (
                <div className="bg-[#06616e] flex flex-col text-sm border-b border-white/20">
                  <Link to="#" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Beti Sahayog Aavedan List</Link>
                  <Link to="#" className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Nidhan Sahayog Aavedan List</Link>
                  <Link to="#" className="py-3 px-10 hover:bg-white/10 transition-colors">Green Paryavaran List</Link>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white text-gray-800 text-sm space-y-3">
              <p><strong>Helpline:</strong> +999XXXXXX</p>
              <p><strong>Email:</strong> shct@gmail.com</p>
              
              <div className="flex space-x-3 mt-4">
                <Link to="/register" className="w-1/2 py-3 text-white font-bold rounded shadow-md text-center text-sm" style={{ backgroundColor: logoOrange }}>
                  REGISTER
                </Link>
                <Link to="/login" className="w-1/2 py-3 text-white font-bold rounded shadow-md text-center text-sm" style={{ backgroundColor: logoOrange }}>
                  LOGIN
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;