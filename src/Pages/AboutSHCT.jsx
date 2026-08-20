 import React from 'react';
import logoImg from '../assets/shct.png'; // अपना लोगो इम्पोर्ट करें

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