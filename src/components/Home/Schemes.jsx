import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getHomePageSettings } from '../../services/dataService';
import { ArrowRightIcon } from '../common/Icons';

const Schemes = () => {
  // Logo colors
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [settings, setSettings] = useState({
    scheme1Title: "आकस्मिक निधन सहायता योजना",
    scheme1Text: "SHCT अपने सदस्यों एवं उनके परिवारों के साथ हर परिस्थिति में खड़ा रहने के उद्देश्य से आकस्मिक निधन सहायता योजना संचालित करता है। यदि किसी सदस्य का असामयिक निधन हो जाता है, तो संस्था निर्धारित नियमों के अनुसार उसके परिवार को आर्थिक सहायता प्रदान करती है, ताकि कठिन समय में उन्हें आवश्यक सहयोग मिल सके। इस योजना से संबंधित पात्रता, नियम एवं सहायता प्रक्रिया की विस्तृत जानकारी नीचे दिए गए बटन के माध्यम से देखी जा सकती है।",
    scheme1BtnText: "दिवंगत सहायता विवरण",
    scheme2Title: "बेटी विवाह सहायता योजना",
    scheme2Text: "SHCT समाज के जरूरतमंद सदस्य परिवारों की सहायता के उद्देश्य से बेटी विवाह सहायता योजना संचालित करता है। इस योजना के अंतर्गत पात्र सदस्यों की बेटियों के विवाह के अवसर पर संस्था द्वारा निर्धारित प्रक्रिया एवं नियमों के अनुसार आर्थिक सहयोग प्रदान किया जाता है। योजना की पात्रता, आवश्यक दस्तावेज़ एवं आवेदन प्रक्रिया की पूरी जानकारी नीचे दिए गए बटन पर उपलब्ध है।",
    scheme2BtnText: "बेटी विवाह सहायता विवरण"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getHomePageSettings();
        if (data) {
          setSettings(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (error) {
        console.error("Error fetching homepage settings in Schemes component:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="w-full bg-gray-50 py-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= MAIN HEADING ================= */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold" style={{ color: logoTeal }}>
            हमारी प्रमुख योजनाएं
          </h2>
          <div className="w-24 h-1.5 mx-auto mt-4 rounded-full" style={{ backgroundColor: logoOrange }}></div>
        </div>

        {/* ================= SCHEMES GRID (Parallel Boxes) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* ---------------- BOX 1: आकस्मिक निधन सहायता योजना ---------------- */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col border-t-[5px] relative group" style={{ borderColor: logoOrange }}>
            
            {/* Icon / Badge */}
            <div className="absolute -top-7 left-8 bg-white p-3 rounded-xl shadow-md transition-transform group-hover:-translate-y-1" style={{ color: logoOrange }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
            </div>

            <h3 className="text-2xl font-bold mb-4 mt-5" style={{ color: logoOrange }}>
              {settings.scheme1Title}
            </h3>
            
            <p className="text-base leading-relaxed mb-8 font-medium flex-grow text-justify" style={{ color: logoTeal }}>
              {settings.scheme1Text}
            </p>
            
            <Link 
              to="/sahayata-list/nidhan"
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95 text-lg block text-center"
              style={{ backgroundColor: logoOrange }}
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowRightIcon className="w-5 h-5" /> {settings.scheme1BtnText}
              </span>
            </Link>
          </div>


          {/* ---------------- BOX 2: बेटी विवाह सहायता योजना ---------------- */}
          <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 flex flex-col border-t-[5px] relative group" style={{ borderColor: logoTeal }}>
            
            {/* Icon / Badge */}
            <div className="absolute -top-7 left-8 bg-white p-3 rounded-xl shadow-md transition-transform group-hover:-translate-y-1" style={{ color: logoTeal }}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>

            <h3 className="text-2xl font-bold mb-4 mt-5" style={{ color: logoTeal }}>
              {settings.scheme2Title}
            </h3>
            
            <p className="text-base leading-relaxed mb-8 font-medium flex-grow text-justify" style={{ color: logoTeal }}>
              {settings.scheme2Text}
            </p>
            
            <Link 
              to="/sahayata-list/beti"
              className="w-full py-3.5 rounded-xl font-bold text-white shadow-md transition-transform hover:scale-[1.02] active:scale-95 text-lg block text-center"
              style={{ backgroundColor: logoTeal }}
            >
              <span className="flex items-center justify-center gap-2">
                <ArrowRightIcon className="w-5 h-5" /> {settings.scheme2BtnText}
              </span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Schemes;