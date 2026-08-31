import React from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/shct.png';
import arifBroadwayImg from '../../assets/ARIF BROADWAY.jpeg';
import tasadduqHusainImg from '../../assets/तसद्दुक हुसैन.jpeg';
import akhtarKhanImg from '../../assets/अख़्तर खान.jpeg';
import sahilAnsariImg from '../../assets/साहिल अंसारी.jpeg';
import basitAnsariImg from '../../assets/बासित अंसारी.jpeg';
import rajeshImg from '../../assets/राजेश.jpeg';
import alamgirAnsariImg from '../../assets/आलमगीर अंसारी.jpeg';

const AboutPreview = () => {
  const leaders = [
    {
      name: "आरिफ ब्रॉडवे",
      role: "संस्थापक/अध्यक्ष",
      desc: "Silent Help Charitable Trust के संस्थापक और अध्यक्ष।",
      img: arifBroadwayImg,
      bgGrad: "from-orange-100/20 to-amber-100/20",
      ringColor: "ring-orange-500/20 group-hover:ring-orange-500/50",
      textColor: "text-[#f08519]"
    },
    {
      name: "तसद्दुक हुसैन",
      role: "सह संस्थापक/सचिव",
      desc: "Silent Help Charitable Trust के सह-संस्थापक एवं सचिव।",
      img: tasadduqHusainImg,
      bgGrad: "from-teal-100/20 to-emerald-100/20",
      ringColor: "ring-teal-500/20 group-hover:ring-teal-500/50",
      textColor: "text-[#087889]"
    },
    {
      name: "अख़्तर खान",
      role: "सह संस्थापक/कोषाध्यक्ष",
      desc: "Silent Help Charitable Trust के सह-संस्थापक एवं कोषाध्यक्ष।",
      img: akhtarKhanImg,
      bgGrad: "from-indigo-100/20 to-purple-100/20",
      ringColor: "ring-indigo-500/20 group-hover:ring-indigo-500/50",
      textColor: "text-indigo-600"
    },
    {
      name: "साहिल अंसारी",
      role: "प्रवक्ता",
      desc: "Silent Help Charitable Trust के प्रवक्ता।",
      img: sahilAnsariImg,
      bgGrad: "from-rose-100/20 to-pink-100/20",
      ringColor: "ring-rose-500/20 group-hover:ring-rose-500/50",
      textColor: "text-rose-600"
    },
    {
      name: "बासित अंसारी",
      role: "पदाधिकारी/सदस्य",
      desc: "Silent Help Charitable Trust के समर्पित पदाधिकारी एवं सदस्य।",
      img: basitAnsariImg,
      bgGrad: "from-teal-100/20 to-emerald-100/20",
      ringColor: "ring-teal-500/20 group-hover:ring-teal-500/50",
      textColor: "text-[#087889]"
    }
  ];

  const members = [
    {
      name: "राजेश",
      role: "सदस्य",
      desc: "ट्रस्ट के समर्पित सदस्य के रूप में समाज सेवा गतिविधियों में सक्रिय भागीदार।",
      img: rajeshImg,
      bgGrad: "from-teal-100/20 to-emerald-100/20",
      ringColor: "ring-teal-500/20 group-hover:ring-teal-500/50",
      textColor: "text-[#087889]"
    },
    {
      name: "आलमगीर अंसारी",
      role: "नगर अध्यक्ष - SHCT मगहर इकाई",
      desc: "Silent Help Charitable Trust के मगहर इकाई के नगर अध्यक्ष।",
      img: alamgirAnsariImg,
      bgGrad: "from-teal-100/20 to-emerald-100/20",
      ringColor: "ring-teal-500/20 group-hover:ring-teal-500/50",
      textColor: "text-[#087889]"
    }
  ];

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

        {/* ================= LEADERS SECTION ================= */}
        <div className="mb-16 overflow-hidden relative py-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight relative inline-block">
               पदाधिकारी
              <div className="w-24 h-1 bg-gradient-to-r from-[#f08519] to-[#087889] mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के प्रमुख नेतृत्वकर्ता</p>
          </div>

          {/* Leaders Marquee Container */}
          <div className="w-full overflow-hidden relative mask-gradient">
            <style>{`
              @keyframes marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-marquee {
                display: flex;
                gap: 1.5rem;
                animation: marquee 30s linear infinite;
                width: max-content;
              }
              .animate-marquee:hover {
                animation-play-state: paused;
              }
              /* Fade effect on edges */
              .mask-gradient::before,
              .mask-gradient::after {
                content: "";
                position: absolute;
                top: 0;
                width: 80px;
                height: 100%;
                z-index: 10;
                pointer-events: none;
              }
              .mask-gradient::before {
                left: 0;
                background: linear-gradient(to right, rgb(249, 250, 251) 0%, rgba(249, 250, 251, 0) 100%);
              }
              .mask-gradient::after {
                right: 0;
                background: linear-gradient(to left, rgb(249, 250, 251) 0%, rgba(249, 250, 251, 0) 100%);
              }
            `}</style>

            <div className="animate-marquee py-4">
              {/* Original List */}
              {leaders.map((member, index) => (
                <div key={`orig-leader-${index}`} className="w-64 sm:w-80 bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group shrink-0">
                  <div className={`absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br ${member.bgGrad} rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110`}></div>
                  <div className={`w-28 h-36 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ${member.ringColor} group-hover:ring-offset-2 transition-all duration-500 mb-4 shrink-0 mx-auto`}>
                    <img src={member.img} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt={member.name} />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">{member.name}</h4>
                  <p className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${member.textColor} truncate w-full`}>{member.role}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2.5 font-medium leading-relaxed block w-full px-2">{member.desc}</p>
                </div>
              ))}

              {/* Duplicated List for Infinite Loop */}
              {leaders.map((member, index) => (
                <div key={`dup-leader-${index}`} className="w-64 sm:w-80 bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group shrink-0">
                  <div className={`absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br ${member.bgGrad} rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110`}></div>
                  <div className={`w-28 h-36 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ${member.ringColor} group-hover:ring-offset-2 transition-all duration-500 mb-4 shrink-0 mx-auto`}>
                    <img src={member.img} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt={member.name} />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">{member.name}</h4>
                  <p className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${member.textColor} truncate w-full`}>{member.role}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2.5 font-medium leading-relaxed block w-full px-2">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= MEMBERS SECTION ================= */}
        <div className="mb-16 overflow-hidden relative py-4">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight relative inline-block">
              सदस्यगण
              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mt-2 rounded-full"></div>
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के समर्पित सदस्य</p>
          </div>

          {/* Members Marquee Container */}
          <div className="w-full overflow-hidden relative mask-gradient">
            <div className="animate-marquee py-4">
              {/* List repeated 4 times for infinite loop and desktop width coverage */}
              {[...members, ...members, ...members, ...members].map((member, index) => (
                <div key={`member-${index}`} className="w-64 sm:w-80 bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group shrink-0">
                  <div className={`absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br ${member.bgGrad} rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110`}></div>
                  <div className={`w-28 h-36 sm:w-36 sm:h-44 rounded-xl md:rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-2 md:ring-4 ${member.ringColor} group-hover:ring-offset-2 transition-all duration-500 mb-4 shrink-0 mx-auto`}>
                    <img src={member.img} className="w-full h-full object-cover rounded-xl md:rounded-2xl group-hover:scale-105 transition-transform duration-500" alt={member.name} />
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-black text-gray-800 tracking-tight mt-1.5 md:mt-2 mb-0.5 truncate w-full">{member.name}</h4>
                  <p className={`text-[10px] sm:text-xs font-black uppercase tracking-wider ${member.textColor} truncate w-full`}>{member.role}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-2.5 font-medium leading-relaxed block w-full px-2">{member.desc}</p>
                </div>
              ))}
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
