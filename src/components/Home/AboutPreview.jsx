import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/shct.png';
import arifBroadwayImg from '../../assets/ARIF BROADWAY.jpeg';
import tasadduqHusainImg from '../../assets/तसद्दुक हुसैन.jpeg';
import akhtarKhanImg from '../../assets/अख़्तर खान.jpeg';
import sahilAnsariImg from '../../assets/साहिल अंसारी.jpeg';
import basitAnsariImg from '../../assets/बासित अंसारी.jpeg';

const AboutPreview = () => {
  return (
    <div className="bg-gray-50 py-16 border-t border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Intro & Origin Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Logo Side */}
          <div className="flex justify-center order-2 md:order-1">
            <img
              src={logoImg}
              alt="SHCT Logo"
              className="w-64 h-64 md:w-[350px] md:h-[350px] object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
            />
          </div>

          {/* Text Side */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-[#f08519] pl-4">
              हमारी शुरुआत और उद्देश्य (About SHCT)
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6 font-medium text-justify">
              <span className="font-bold text-[#087889]">Silent Help Charitable Trust (SHCT)</span> की स्थापना वर्ष <span className="font-bold text-[#f08519] bg-orange-100 px-2 rounded">2026</span> में की गई थी। इस संस्था का एकमात्र और सबसे बड़ा उद्देश्य समाज के उन जरूरतमंद और असहाय लोगों की मदद करना है, जिनका कठिन समय में कोई सहारा नहीं होता।
            </p>
            <p className="text-gray-600 text-lg leading-relaxed font-medium text-justify">
              हमारा मानना है कि एक-दूसरे का साथ देकर ही हम एक मजबूत और खुशहाल समाज का निर्माण कर सकते हैं। संस्था अपने सदस्यों को आकस्मिक निधन और बेटी विवाह जैसी महत्वपूर्ण परिस्थितियों में आर्थिक और सामाजिक सहायता प्रदान करती है।
            </p>
          </div>
        </div>

        {/* ================= FOUNDERS & MEMBERS SECTION ================= */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight relative inline-block">
              हमारे मार्गदर्शक एवं पदाधिकारी
              <div className="w-24 h-1 bg-gradient-to-r from-[#f08519] to-[#087889] mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के प्रमुख नेतृत्वकर्ता</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto px-2 md:px-4 justify-center">
            
            {/* Profile 1: Founder & President */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-100/20 to-amber-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-orange-500/20 group-hover:ring-orange-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <img src={arifBroadwayImg} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="आरिफ ब्रॉडवे" />
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#f08519] bg-orange-50 px-2 py-0.5 rounded-full">LEADERSHIP</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">आरिफ ब्रॉडवे</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#f08519] truncate w-full">संस्थापक/अध्यक्ष</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">Silent Help Charitable Trust के संस्थापक और अध्यक्ष।</p>
            </div>

            {/* Profile 2: Co-Founder & Secretary */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-teal-500/20 group-hover:ring-teal-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <img src={tasadduqHusainImg} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="तसद्दुक हुसैन" />
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-2 py-0.5 rounded-full">LEADERSHIP</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">तसद्दुक हुसैन</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#087889] truncate w-full">सह संस्थापक/सचिव</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">Silent Help Charitable Trust के सह-संस्थापक एवं सचिव।</p>
            </div>

            {/* Profile 3: Co-Founder & Treasurer */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-indigo-100/20 to-purple-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-indigo-500/20 group-hover:ring-indigo-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <img src={akhtarKhanImg} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="अख़्तर खान" />
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">FINANCE</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">अख़्तर खान</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-indigo-600 truncate w-full">सह संस्थापक/कोषाध्यक्ष</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">Silent Help Charitable Trust के सह-संस्थापक एवं कोषाध्यक्ष।</p>
            </div>

            {/* Profile 4: Spokesperson */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-rose-100/20 to-pink-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-rose-500/20 group-hover:ring-rose-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <img src={sahilAnsariImg} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="साहिल अंसारी" />
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">MEDIA</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">साहिल अंसारी</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-rose-600 truncate w-full">प्रवक्ता</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">Silent Help Charitable Trust के प्रवक्ता।</p>
            </div>

          </div>
        </div>

        {/* ================= MEMBERS SECTION ================= */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight relative inline-block">
              हमारे समर्पित सदस्य
              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mt-2 rounded-full"></div>
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के समर्पित सदस्य</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-5xl mx-auto px-2 md:px-4 justify-center">
            
            {/* Member 1: बासित अंसारी */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-teal-500/20 group-hover:ring-teal-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <img src={basitAnsariImg} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="बासित अंसारी" />
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-2 py-0.5 rounded-full">TRUST MEMBER</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">बासित अंसारी</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#087889] truncate w-full">सदस्य</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">ट्रस्ट के समर्पित सदस्य के रूप में समाज सेवा गतिविधियों में सक्रिय भागीदार।</p>
            </div>

            {/* Member 2: राजेश */}
            <div className="bg-white rounded-2xl md:rounded-3xl p-3 md:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="w-24 h-32 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ring-teal-500/20 group-hover:ring-teal-500/50 transition-all duration-500 mb-3 md:mb-4 shrink-0 mx-auto">
                <span className="text-4xl sm:text-5xl text-gray-300 select-none group-hover:scale-110 transition-transform duration-500">👤</span>
              </div>

              <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-2 py-0.5 rounded-full">TRUST MEMBER</span>
              <h4 className="text-xs sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">राजेश</h4>
              <p className="text-[9px] md:text-[11px] font-black uppercase tracking-wider text-[#087889] truncate w-full">सदस्य</p>
              <p className="text-[10px] md:text-xs text-gray-500 mt-2 font-medium leading-relaxed hidden sm:block">ट्रस्ट के समर्पित सदस्य के रूप में समाज सेवा गतिविधियों में सक्रिय भागीदार।</p>
            </div>

          </div>
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <Link 
            to="/about-shct" 
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-gradient-to-r from-[#087889] to-[#0b90a4] text-white font-extrabold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
          >
            और जानें (More View) ➔
          </Link>
        </div>

      </div>
    </div>
  );
};

export default AboutPreview;
