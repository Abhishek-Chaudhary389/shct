import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../assets/shct.png'; // आपका लोगो इम्पोर्ट कर रहे हैं

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 font-sans border-t-4 border-[#f08519]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Section (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Column 1: About NGO */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center p-1 shadow-lg">
                <img src={logoImg} alt="SHCT Logo" className="h-full w-full object-contain" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#f08519]">SHCT</h3>
                <p className="text-xs text-gray-400 font-medium tracking-wider uppercase">Silent Help Charitable Team</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
              समाज के जरूरतमंद और असहाय लोगों की सहायता के लिए हम हमेशा तत्पर हैं। "Help For Helpless" हमारा मुख्य उद्देश्य है।
            </p>
            <div className="inline-block bg-[#087889] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
              रजिस्ट्रेशन न०: (आपका नंबर यहाँ डालें)
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 relative inline-block">
              महत्वपूर्ण लिंक्स
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#087889] rounded-full"></span>
            </h3>
            <ul className="space-y-3 text-sm font-medium text-gray-300">
              <li>
                <Link to="/" className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> मुख्य पृष्ठ (Home)
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> हमारी योजनाएं
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> सदस्य सूची (Member List)
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-[#f08519] transition-colors flex items-center group">
                  <span className="text-[#087889] group-hover:text-[#f08519] mr-2">▸</span> नियम एवं शर्तें
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
                <span className="text-[#f08519] text-lg mt-1">📍</span>
                <p className="leading-relaxed">Head office:- Khalilabad Post,<br/>District- Sant Kabir Nagar (UP) - 272175</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#f08519] text-lg">📞</span>
                <p>+999XXXXXX</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[#f08519] text-lg">✉️</span>
                <p>shct@gmail.com</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Section */}
        <div className="pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
          <p>&copy; {new Date().getFullYear()} Silent Help Charitable Trust. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0">
            Designed with <span className="text-red-500">♥</span> for a noble cause
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;