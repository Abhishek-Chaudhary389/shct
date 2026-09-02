import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/shct.png';
import { MapPinIcon, PhoneIcon, MailIcon, GlobeIcon } from './common/Icons';

const Footer = () => {
  // क्लिक करते ही पेज ऊपर से खुलेगा
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-sans border-t-4 border-[#f08519]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Column 1: About NGO */}
          <div>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-md shrink-0 overflow-hidden p-1.5 border border-white/80">
                <img
                  src={logoImg}
                  alt="SHCT Logo"
                  className="w-full h-full object-contain"
                  style={{ transform: 'scale(1.44)' }}
                />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#f08519]">SHCT</h3>
                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Silent Help Charitable Trust</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              समाज के जरूरतमंद और असहाय लोगों की सहायता के लिए हम हमेशा तत्पर हैं। "बेहतर भविष्य के लिए समर्पित" हमारा मुख्य उद्देश्य है।
            </p>
            <div className="inline-block bg-[#087889] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
              रजिस्ट्रेशन न०: ( 57/2026 )
            </div>
          </div>

          {/* Column 2: Main Navigation Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 relative inline-block">
              मुख्य लिंक्स (Quick Links)
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#087889] rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-300">
              <li>
                <Link to="/" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Home
                </Link>
              </li>
              <li>
                <Link to="/about-shct" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> About
                </Link>
              </li>
              <li>
                <Link to="/member-list" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Member List
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Vivah Sahayog List
                </Link>
              </li>
              <li>
                <Link to="/annual-donation-list" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Annual Donation List
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Nidhan Sahayog
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Rules & Regulations
                </Link>
              </li>
              <li>
                <Link to="/beti-sahayog-form" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Sahayog Form
                </Link>
              </li>
              <li>
                <Link to="#" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Sahayata List
                </Link>
              </li>
              <li>
                <Link to="/admin-login" onClick={handleScrollTop} className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 relative inline-block">
              संपर्क करें
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#087889] rounded-full"></span>
            </h3>
            <div className="space-y-4 text-sm font-medium text-gray-300">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="w-5 h-5 text-[#f08519] shrink-0 mt-0.5" />
                <p className="leading-relaxed">Head office:- Khalilabad,<br />District- Sant Kabir Nagar (UP) - 272175</p>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-[#f08519] shrink-0" />
                <p>+91 9838385566</p>
              </div>
              <div className="flex items-center space-x-3">
                <MailIcon className="w-5 h-5 text-[#f08519] shrink-0" />
                <p>silenthelpct@gmail.com</p>
              </div>
              <div className="flex items-center space-x-3">
                <GlobeIcon className="w-5 h-5 text-[#f08519] shrink-0" />
                <a href="https://www.silenthelpct.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#f08519] transition-colors">
                  www.silenthelpct.com
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between text-xs text-gray-500 font-medium gap-3">
          <p className="text-left">&copy; {new Date().getFullYear()} Silent Help Charitable Trust. All Rights Reserved.</p>
          <p className="text-left md:text-right">
            Designed and Developed by <a href="https://www.snstudio.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 font-semibold transition-colors">SN Studio</a>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;