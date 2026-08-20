import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../assets/shct.png';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isDesktopAboutOpen, setIsDesktopAboutOpen] = useState(false);
  
  const [isDesktopSahayataOpen, setIsDesktopSahayataOpen] = useState(false);
  const [isMobileSahayataOpen, setIsMobileSahayataOpen] = useState(false);

  const [isDesktopVivahOpen, setIsDesktopVivahOpen] = useState(false);
  const [isMobileVivahOpen, setIsMobileVivahOpen] = useState(false);

  const [isDesktopNidhanOpen, setIsDesktopNidhanOpen] = useState(false);
  const [isMobileNidhanOpen, setIsMobileNidhanOpen] = useState(false);

  const [isDesktopSahayogFormOpen, setIsDesktopSahayogFormOpen] = useState(false);
  const [isMobileSahayogFormOpen, setIsMobileSahayogFormOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleSahayogFormClick = (e) => {
    if (!isLoggedIn) {
      if (e) e.preventDefault();
      setIsDesktopSahayogFormOpen(false);
      setIsMobileSahayogFormOpen(false);
      setIsMobileMenuOpen(false);
      navigate('/login', { 
        state: { message: 'Sahayog Form का उपयोग करने के लिए कृपया पहले लॉगिन करें।' } 
      });
    } else {
      setIsDesktopSahayogFormOpen(!isDesktopSahayogFormOpen);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  return (
    <header className="w-full bg-white shadow-md font-sans relative z-50">
      
      {/* ================= DESKTOP LAYOUT ================= */}
      <div className="hidden lg:flex w-full max-w-[1700px] mx-auto h-[120px]">
        
        {/* LEFT COLUMN: Logo Container */}
        <div className="w-[195px] bg-white flex items-center justify-center border-r border-gray-100 shrink-0">
          <Link to="/" className="h-[110px] w-[160px] flex items-center justify-center cursor-pointer transition-transform hover:scale-105">
             <img src={logoImg} alt="Silent Help Logo" className="h-full w-full object-contain scale-[1.15]" />
          </Link>
        </div>

        {/* RIGHT COLUMN: Top Info + Bottom Nav */}
        <div className="flex-1 flex flex-col">
          
          {/* TOP ROW: Info & Contacts */}
          <div className="h-[70px] bg-white flex justify-between items-center px-3 xl:px-4">
            <div className="flex items-center space-x-2 cursor-pointer group shrink-0">
              <div className="p-2 rounded-full text-white transition-transform group-hover:scale-105" style={{ backgroundColor: logoOrange }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
              </div>
              <div className="flex items-baseline whitespace-nowrap">
                <span className="text-lg xl:text-xl font-serif italic text-gray-800 tracking-tight">Hope, Care & </span>
                <span className="text-lg xl:text-xl font-serif italic text-gray-800 tracking-tight border-b-2 border-gray-400 ml-1"> Support </span>
              </div>
            </div>

            <div className="flex space-x-2 xl:space-x-4 items-center text-xs xl:text-sm shrink-0">
              <div className="flex items-center space-x-1.5">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                <div>
                  <p className="text-gray-500 text-[10px]">Helpline</p>
                  <p className="font-bold text-gray-900">+ 9838385566</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 border-l border-gray-300 pl-2.5 xl:pl-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                <div>
                  <p className="text-gray-500 text-[10px]">Send email</p>
                  <p className="font-bold text-gray-900">silenthelpct@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 border-l border-gray-300 pl-2.5 xl:pl-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div>
                  <p className="font-bold text-gray-700 text-[11px]">Head office:- Khalilabad Post- </p>
                  <p className="font-bold text-gray-700 text-[11px]">Sant Kabir Nagar (UP) - 272175</p>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: Navigation Links & Action Buttons */}
          <div className="h-[50px] flex justify-between items-center px-1 xl:px-3 relative" style={{ backgroundColor: logoTeal }}>
            
            <div className="flex space-x-0.5 xl:space-x-1.5 text-white font-semibold text-[11px] xl:text-[13px] items-center h-full">
              
              {/* ABOUT DROPDOWN */}
              <div 
                className={`relative flex items-center h-full px-2 cursor-pointer whitespace-nowrap transition-colors ${isActive('/about-shct') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}
                onMouseEnter={() => setIsDesktopAboutOpen(true)}
                onMouseLeave={() => setIsDesktopAboutOpen(false)}
                onClick={() => setIsDesktopAboutOpen(!isDesktopAboutOpen)}
              >
                <span className="flex items-center gap-0.5">
                  About
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopAboutOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {isDesktopAboutOpen && (
                  <div 
                    className="absolute top-[50px] left-0 w-48 bg-white text-gray-800 shadow-2xl rounded-md flex flex-col overflow-hidden border-t-4 z-[9999]" 
                    style={{ borderColor: logoOrange }}
                  >
                    <Link to="/about-shct" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium">About SHCT</Link>
                    <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium">Gallery</Link>
                    <Link to="#" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] transition-colors font-medium">Video</Link>
                  </div>
                )}
              </div>

              {/* General Links */}
              <Link to="/member-list" className={`h-full px-2 flex items-center transition-colors whitespace-nowrap ${isActive('/member-list') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}>Member List</Link>

              {/* VIVAH SAHYOG LIST DROPDOWN */}
              <div 
                className={`relative flex items-center h-full px-2 cursor-pointer whitespace-nowrap transition-colors ${isActive('/vivah-sahayog-list') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}
                onMouseEnter={() => setIsDesktopVivahOpen(true)}
                onMouseLeave={() => setIsDesktopVivahOpen(false)}
                onClick={() => setIsDesktopVivahOpen(!isDesktopVivahOpen)}
              >
                <span className="flex items-center gap-0.5">
                  Vivah Sahyog List
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopVivahOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {isDesktopVivahOpen && (
                  <div 
                    className="absolute top-[50px] left-0 w-52 bg-white text-gray-800 shadow-2xl rounded-md flex flex-col overflow-hidden border-t-4 z-[9999]" 
                    style={{ borderColor: logoOrange }}
                  >
                    <Link to="/vivah-sahayog-list" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">All Sahyog List</Link>
                  </div>
                )}
              </div>

              <Link to="/annual-donation-list" className={`h-full px-2 flex items-center transition-colors whitespace-nowrap ${isActive('/annual-donation-list') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}>Annual Donation List</Link>
              {/* NIDHAN SAHYOG LIST DROPDOWN */}
              <div 
                className={`relative flex items-center h-full px-2 cursor-pointer whitespace-nowrap transition-colors ${isActive('/nidhan-sahayog-list') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}
                onMouseEnter={() => setIsDesktopNidhanOpen(true)}
                onMouseLeave={() => setIsDesktopNidhanOpen(false)}
                onClick={() => setIsDesktopNidhanOpen(!isDesktopNidhanOpen)}
              >
                <span className="flex items-center gap-0.5">
                  Nidhan Sahyog List
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopNidhanOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {isDesktopNidhanOpen && (
                  <div 
                    className="absolute top-[50px] left-0 w-52 bg-white text-gray-800 shadow-2xl rounded-md flex flex-col overflow-hidden border-t-4 z-[9999]" 
                    style={{ borderColor: logoOrange }}
                  >
                    <Link to="/nidhan-sahayog-list" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">All Nidhan Sahyog List</Link>
                  </div>
                )}
              </div>
              
              {/* Rules & Regulations Link */}
              <Link to="/rules-regulations" className={`h-full px-2 flex items-center transition-colors whitespace-nowrap ${isActive('/rules-regulations') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}>Rules & Regulations</Link>
              
              {/* SAHAYOG FORM */}
              {!isLoggedIn ? (
                <Link 
                  to="/login" 
                  state={{ message: 'Sahayog Form का उपयोग करने के लिए कृपया पहले लॉगिन करें।' }}
                  className={`h-full px-2 flex items-center transition-colors whitespace-nowrap ${isActive('/login') ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}
                >
                  Sahayog Form
                </Link>
              ) : (
                <div 
                  className={`relative flex items-center h-full px-2 cursor-pointer whitespace-nowrap transition-colors ${(isActive('/beti-sahayog-form') || isActive('/nidhan-sahayog-form')) ? 'bg-[#06616e] text-orange-200 border-b-2 border-orange-400' : 'hover:bg-[#06616e]'}`}
                  onMouseEnter={() => setIsDesktopSahayogFormOpen(true)}
                  onMouseLeave={() => setIsDesktopSahayogFormOpen(false)}
                  onClick={() => setIsDesktopSahayogFormOpen(!isDesktopSahayogFormOpen)}
                >
                  <span className="flex items-center gap-0.5">
                    Sahayog Form
                    <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopSahayogFormOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </span>
                  
                  {isDesktopSahayogFormOpen && (
                    <div 
                      className="absolute top-[50px] left-0 w-56 bg-white text-gray-800 shadow-2xl rounded-md flex flex-col overflow-hidden border-t-4 z-[9999]" 
                      style={{ borderColor: logoOrange }}
                    >
                      <Link to="/beti-sahayog-form" className={`px-4 py-3 border-b border-gray-100 font-medium text-[13px] ${isActive('/beti-sahayog-form') ? 'text-[#f08519] bg-orange-50 font-bold' : 'hover:bg-gray-50 hover:text-[#f08519]'}`}>Beti Sahayog Form</Link>
                      <Link to="/nidhan-sahayog-form" className={`px-4 py-3 font-medium text-[13px] ${isActive('/nidhan-sahayog-form') ? 'text-[#f08519] bg-orange-50 font-bold' : 'hover:bg-gray-50 hover:text-[#f08519]'}`}>Nidhan Sahayog Form</Link>
                    </div>
                  )}
                </div>
              )}

              {/* SAHAYATA LIST DROPDOWN */}
              <div 
                className="relative flex items-center h-full px-2 cursor-pointer whitespace-nowrap hover:bg-[#06616e] transition-colors"
                onMouseEnter={() => setIsDesktopSahayataOpen(true)}
                onMouseLeave={() => setIsDesktopSahayataOpen(false)}
                onClick={() => setIsDesktopSahayataOpen(!isDesktopSahayataOpen)}
              >
                <span className="flex items-center gap-0.5">
                  Sahayata List
                  <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isDesktopSahayataOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </span>
                
                {isDesktopSahayataOpen && (
                  <div 
                    className="absolute top-[50px] left-0 w-64 bg-white text-gray-800 shadow-2xl rounded-md flex flex-col overflow-hidden border-t-4 z-[9999]" 
                    style={{ borderColor: logoOrange }}
                  >
                    <Link to="/sahayata-list/beti" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] border-b border-gray-100 transition-colors font-medium text-[13px]">Beti Sahayog Aavedan List</Link>
                    <Link to="/sahayata-list/nidhan" className="px-4 py-3 hover:bg-gray-50 hover:text-[#f08519] transition-colors font-medium text-[13px]">Nidhan Sahayog Aavedan List</Link>
                  </div>
                )}
              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex h-full shrink-0 items-center">
              <Link to="/register" className={`h-full px-3 xl:px-4 flex items-center justify-center font-bold text-white text-[11px] xl:text-[12px] transition-colors whitespace-nowrap border-r border-[#d97314] ${isActive('/register') ? 'bg-orange-700 shadow-inner' : 'hover:bg-orange-600'}`} style={{ backgroundColor: logoOrange }}>
                REGISTRATION
              </Link>
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout} 
                  className="h-full px-3 xl:px-5 flex items-center justify-center font-bold text-white text-[11px] xl:text-[12px] transition-colors whitespace-nowrap bg-red-600 hover:bg-red-700"
                >
                  LOGOUT
                </button>
              ) : (
                <Link to="/login" className={`h-full px-3 xl:px-5 flex items-center justify-center font-bold text-white text-[11px] xl:text-[12px] transition-colors whitespace-nowrap ${isActive('/login') ? 'bg-orange-700 shadow-inner' : 'hover:bg-orange-600'}`} style={{ backgroundColor: logoOrange }}>
                  LOGIN
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* ================= MOBILE LAYOUT ================= */}
      <div className="lg:hidden w-full flex flex-col">
        <div className="flex justify-between items-center p-3 bg-white border-b">
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="h-20 w-28 flex items-center justify-center cursor-pointer">
             <img src={logoImg} alt="Logo" className="h-full w-full object-contain scale-[1.10]" />
          </Link>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path></svg>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="flex flex-col text-white font-semibold shadow-inner" style={{ backgroundColor: logoTeal }}>
            
            {/* ABOUT ACCORDION */}
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
                  <Link to="/about-shct" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-10 border-b border-white/10 transition-colors ${isActive('/about-shct') ? 'bg-black/30 text-orange-200 font-bold' : 'hover:bg-white/10'}`}>About SHCT</Link>
                  <Link to="#" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Gallery</Link>
                  <Link to="#" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-10 hover:bg-white/10 transition-colors">Video</Link>
                </div>
              )}
            </div>

            {/* GENERAL LINKS */}
            <Link to="/member-list" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-6 border-b border-white/20 transition-colors ${isActive('/member-list') ? 'bg-[#06616e] text-orange-200 font-bold border-l-4 border-orange-400' : 'hover:bg-[#06616e]'}`}>Member List</Link>

            {/* VIVAH SAHYOG LIST ACCORDION */}
            <div>
              <button 
                onClick={() => setIsMobileVivahOpen(!isMobileVivahOpen)} 
                className="w-full text-left py-3 px-6 border-b border-white/20 flex justify-between items-center focus:outline-none"
              >
                Vivah Sahyog List
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileVivahOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileVivahOpen && (
                <div className="bg-[#06616e] flex flex-col text-sm border-b border-white/20">
                  <Link to="/vivah-sahayog-list" onClick={() => { setIsMobileMenuOpen(false); setIsMobileVivahOpen(false); }} className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors font-medium">All Sahyog List</Link>
                </div>
              )}
            </div>

            <Link to="/annual-donation-list" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-6 border-b border-white/20 transition-colors ${isActive('/annual-donation-list') ? 'bg-[#06616e] text-orange-200 font-bold border-l-4 border-orange-400' : 'hover:bg-[#06616e]'}`}>Annual Donation List</Link>
            {/* NIDHAN SAHYOG LIST ACCORDION */}
            <div>
              <button 
                onClick={() => setIsMobileNidhanOpen(!isMobileNidhanOpen)} 
                className="w-full text-left py-3 px-6 border-b border-white/20 flex justify-between items-center focus:outline-none text-white font-semibold"
              >
                Nidhan Sahyog List
                <svg className={`w-5 h-5 transition-transform duration-300 ${isMobileNidhanOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              {isMobileNidhanOpen && (
                <div className="bg-[#06616e] flex flex-col text-sm border-b border-white/20">
                  <Link to="/nidhan-sahayog-list" onClick={() => { setIsMobileMenuOpen(false); setIsMobileNidhanOpen(false); }} className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors font-medium">All Nidhan Sahyog List</Link>
                </div>
              )}
            </div>
            <Link to="/rules-regulations" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-6 border-b border-white/20 transition-colors ${isActive('/rules-regulations') ? 'bg-[#06616e] text-orange-200 font-bold border-l-4 border-orange-400' : 'hover:bg-[#06616e]'}`}>Rules & Regulations</Link>
            
            {/* SAHAYOG FORM ACCORDION */}
            {!isLoggedIn ? (
              <Link 
                to="/login" 
                state={{ message: 'Sahayog Form का उपयोग करने के लिए कृपया पहले लॉगिन करें।' }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3 px-6 border-b border-white/20 hover:bg-[#06616e] transition-colors block text-white font-semibold"
              >
                Sahayog Form
              </Link>
            ) : (
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
                    <Link to="/beti-sahayog-form" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-10 border-b border-white/10 transition-colors ${isActive('/beti-sahayog-form') ? 'bg-black/30 text-orange-200 font-bold' : 'hover:bg-white/10'}`}>Beti Sahayog Form</Link>
                    <Link to="/nidhan-sahayog-form" onClick={() => setIsMobileMenuOpen(false)} className={`py-3 px-10 transition-colors ${isActive('/nidhan-sahayog-form') ? 'bg-black/30 text-orange-200 font-bold' : 'hover:bg-white/10'}`}>Nidhan Sahayog Form</Link>
                  </div>
                )}
              </div>
            )}

            {/* SAHAYATA LIST ACCORDION */}
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
                  <Link to="/sahayata-list/beti" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-10 border-b border-white/10 hover:bg-white/10 transition-colors">Beti Sahayog Aavedan List</Link>
                  <Link to="/sahayata-list/nidhan" onClick={() => setIsMobileMenuOpen(false)} className="py-3 px-10 hover:bg-white/10 transition-colors">Nidhan Sahayog Aavedan List</Link>
                </div>
              )}
            </div>
            
            <div className="p-6 bg-white text-gray-800 text-sm space-y-3">
              <p><strong>Helpline:</strong> +9838385566</p>
              <p><strong>Email:</strong> silenthelpct@gmail.com</p>
              
              <div className="flex space-x-3 mt-4">
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className={`w-1/2 py-3 text-white font-bold rounded shadow-md text-center text-sm ${isActive('/register') ? 'bg-orange-700' : ''}`} style={{ backgroundColor: logoOrange }}>
                  REGISTRATION
                </Link>
                {isLoggedIn ? (
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="w-1/2 py-3 text-white font-bold rounded shadow-md text-center text-sm bg-red-600 hover:bg-red-700"
                  >
                    LOGOUT
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className={`w-1/2 py-3 text-white font-bold rounded shadow-md text-center text-sm ${isActive('/login') ? 'bg-orange-700' : ''}`} style={{ backgroundColor: logoOrange }}>
                    LOGIN
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

    </header>
  );
};

export default Navbar;