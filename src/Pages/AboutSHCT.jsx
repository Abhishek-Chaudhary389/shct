import React from 'react';
import logoImg from '../assets/shct.png';
import arifBroadwayImg from '../assets/ARIF BROADWAY.jpeg';
import tasadduqHusainImg from '../assets/तसद्दुक हुसैन.jpeg';
import akhtarKhanImg from '../assets/अख़्तर खान.jpeg';
import sahilAnsariImg from '../assets/साहिल अंसारी.jpeg';
import basitAnsariImg from '../assets/बासित अंसारी.jpeg';

const AboutSHCT = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ================= HERO / HEADER SECTION ================= */}
      <div className="bg-[#087889] py-20 px-4 text-center relative overflow-hidden">
        {/* Background Decorative Circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#f08519] opacity-20 rounded-full blur-2xl"></div>

        <h1 className="text-4xl md:text-5xl font-bold text-white relative z-10 mb-4 tracking-wide">
          हमारे बारे में (About SHCT)
        </h1>
        <p className="text-teal-100 text-lg md:text-xl max-w-2xl mx-auto relative z-10 font-medium">
          "बेहतर भविष्य के लिए समर्पित" - असहायों की मदद के लिए सदैव तत्पर
        </p>
      </div>

      {/* ================= MAIN CONTENT SECTION ================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Intro & Origin Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">

          {/* Logo Side (अब लोगो को बहुत बड़ा कर दिया गया है) */}
          <div className="flex justify-center order-2 md:order-1">
            <img
              src={logoImg}
              alt="SHCT Logo"
              className="w-72 h-72 md:w-[400px] md:h-[400px] object-contain transform hover:scale-105 transition-transform duration-500 drop-shadow-2xl"
            />
          </div>

          {/* Text Side */}
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-l-4 border-[#f08519] pl-4">
              हमारी शुरुआत और उद्देश्य
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
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight relative inline-block">
              हमारे मार्गदर्शक एवं पदाधिकारी
              <div className="w-24 h-1 bg-gradient-to-r from-[#f08519] to-[#087889] mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के प्रमुख नेतृत्वकर्ता</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
            
            {/* Profile 1: Founder & President */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100/30 to-amber-100/30 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              {/* Image Box Wrapper */}
              <div className="relative shrink-0">
                <div className="w-44 h-56 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-orange-500/20 ring-offset-4 ring-offset-white group-hover:ring-orange-500/50 transition-all duration-500">
                  <img src={arifBroadwayImg} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="ARIF BROADWAY" />
                </div>
              </div>

              {/* Text Area */}
              <div className="text-center sm:text-left flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#f08519] bg-orange-50 px-3 py-1 rounded-full">LEADERSHIP</span>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2 mb-1">आरिफ ब्रॉडवे</h3>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2 mb-1">आरिफ ब्रॉडवे</h3>
                <p className="text-sm font-extrabold text-[#f08519] flex items-center gap-1.5 justify-center sm:justify-start">
                  संस्थापक/अध्यक्ष
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Silent Help Charitable Trust and LocalShaadi.in  के संस्थापक और अध्यक्ष के रूप में मुख्य मार्गदर्शक।</p>
              </div>
            </div>

            {/* Profile 2: Co-Founder & Secretary */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-100/30 to-emerald-100/30 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              {/* Image Box Wrapper */}
              <div className="relative shrink-0">
                <div className="w-44 h-56 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-teal-500/20 ring-offset-4 ring-offset-white group-hover:ring-teal-500/50 transition-all duration-500">
                  <img src={tasadduqHusainImg} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="तसद्दुक हुसैन" />
                </div>
              </div>

              {/* Text Area */}
              <div className="text-center sm:text-left flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-3 py-1 rounded-full">LEADERSHIP</span>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2 mb-1">तसद्दुक हुसैन</h3>
                <p className="text-sm font-extrabold text-[#087889] flex items-center gap-1.5 justify-center sm:justify-start">
                  सह संस्थापक/सचिव
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Silent Help Charitable Trust के सह-संस्थापक एवं सचिव के रूप में मुख्य कार्यभार संभाल रहे हैं।</p>
              </div>
            </div>

            {/* Profile 3: Co-Founder & Treasurer */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              {/* Image Box Wrapper */}
              <div className="relative shrink-0">
                <div className="w-44 h-56 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-indigo-500/20 ring-offset-4 ring-offset-white group-hover:ring-indigo-500/50 transition-all duration-500">
                  <img src={akhtarKhanImg} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="अख़्तर खान" />
                </div>
              </div>

              {/* Text Area */}
              <div className="text-center sm:text-left flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">FINANCE</span>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2 mb-1">अख़्तर खान</h3>
                <p className="text-sm font-extrabold text-indigo-600 flex items-center gap-1.5 justify-center sm:justify-start">
                  सह संस्थापक/कोषाध्यक्ष
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Silent Help Charitable Trust के सह-संस्थापक एवं कोषाध्यक्ष के रूप में वित्तीय प्रबंधन संभाल रहे हैं।</p>
              </div>
            </div>

            {/* Profile 4: Spokesperson */}
            <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100/30 to-pink-100/30 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              {/* Image Box Wrapper */}
              <div className="relative shrink-0">
                <div className="w-44 h-56 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-rose-500/20 ring-offset-4 ring-offset-white group-hover:ring-rose-500/50 transition-all duration-500">
                  <img src={sahilAnsariImg} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="साहिल अंसारी" />
                </div>
              </div>

              {/* Text Area */}
              <div className="text-center sm:text-left flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full">MEDIA</span>
                <h3 className="text-2xl font-black text-gray-800 tracking-tight mt-2 mb-1">साहिल अंसारी</h3>
                <p className="text-sm font-extrabold text-rose-600 flex items-center gap-1.5 justify-center sm:justify-start">
                  प्रवक्ता
                </p>
                <p className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">Silent Help Charitable Trust के प्रवक्ता के रूप में सामाजिक संवाद और जनसंपर्क संभाल रहे हैं।</p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= MEMBERS SECTION ================= */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight relative inline-block">
              हमारे समर्पित सदस्य
              <div className="w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto mt-2 rounded-full"></div>
            </h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust के समर्पित सदस्य</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto px-4">
            
            {/* Member 1: बासित अंसारी */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-bl-full -z-10"></div>
              
              {/* Photo Box on Top */}
              <div className="w-36 h-44 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-teal-500/20 group-hover:ring-teal-500/50 transition-all duration-500 mb-4 shrink-0 mx-auto">
                <img src={basitAnsariImg} className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500" alt="बासित अंसारी" />
              </div>

              {/* Text Underneath */}
              <span className="text-[9px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-3 py-0.5 rounded-full">TRUST MEMBER</span>
              <h4 className="text-xl font-black text-gray-800 tracking-tight mt-2 mb-1">बासित अंसारी</h4>
              <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider text-[#087889]">सदस्य</p>
              <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">ट्रस्ट के समर्पित सदस्य के रूप में समाज सेवा गतिविधियों में सक्रिय भागीदार।</p>
            </div>

            {/* Member 2: राजेश */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group">
              {/* Background gradient hint */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-bl-full -z-10"></div>
              
              {/* Photo Box on Top */}
              <div className="w-36 h-44 rounded-2xl bg-gradient-to-tr from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden relative shadow-inner ring-4 ring-teal-500/20 group-hover:ring-teal-500/50 transition-all duration-500 mb-4 shrink-0 mx-auto">
                {/* 👤 PHOTO PLACEHOLDER: Replace this span with an img element when ready */}
                <span className="text-5xl text-gray-300 select-none group-hover:scale-110 transition-transform duration-500">👤</span>
              </div>

              {/* Text Underneath */}
              <span className="text-[9px] font-black uppercase tracking-widest text-[#087889] bg-teal-50 px-3 py-0.5 rounded-full">TRUST MEMBER</span>
              <h4 className="text-xl font-black text-gray-800 tracking-tight mt-2 mb-1">राजेश</h4>
              <p className="text-xs text-gray-400 mt-1 font-semibold uppercase tracking-wider text-[#087889]">सदस्य</p>
              <p className="text-xs text-gray-500 mt-2 font-medium leading-relaxed">ट्रस्ट के समर्पित सदस्य के रूप में समाज सेवा गतिविधियों में सक्रिय भागीदार।</p>
            </div>

          </div>
        </div>

        {/* ================= MISSION & VISION CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">

          {/* Mission Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-[6px] border-[#f08519] hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform"></div>
            <div className="text-5xl mb-6">Mission</div>
            <h3 className="text-2xl font-bold text-[#087889] mb-4">हमारा मिशन (Our Mission)</h3>
            <p className="text-gray-600 leading-relaxed font-medium text-justify">
              समाज के हर उस व्यक्ति तक पहुंचना जिसे मदद की जरूरत है। हम पारदर्शी और ईमानदार तरीके से दानकर्ताओं (Donors) और जरूरतमंदों के बीच एक मजबूत पुल बनाने का काम करते हैं, ताकि मदद की हर एक बूँद सही जगह पहुंचे।
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border-t-[6px] border-[#087889] hover:shadow-xl transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-10 group-hover:scale-125 transition-transform"></div>
            <div className="text-5xl mb-6"> Vision</div>
            <h3 className="text-2xl font-bold text-[#f08519] mb-4">हमारा विज़न (Our Vision)</h3>
            <p className="text-gray-600 leading-relaxed font-medium text-justify">
              एक ऐसे समाज की कल्पना जहां कोई भी परिवार आर्थिक तंगी के कारण अपनी बेटियों की शादी में परेशान न हो, और किसी भी मुखिया के जाने के बाद उसका परिवार खुद को अनाथ या बेसहारा महसूस न करे।
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AboutSHCT;