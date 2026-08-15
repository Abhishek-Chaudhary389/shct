 import React, { useState, useEffect } from 'react';
import { getHomeAlerts, getHomePageSettings } from '../../services/dataService';

const Group = () => {
  // Theme Colors
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [groupDetails, setGroupDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    headerTitle: "बेटी विवाह सहायता योजना",
    alertTitle: "सहयोग अलर्ट - 1",
    alertPoints: "सहयोग की अंतिम तिथि: 10 जुलाई से 26 जुलाई 2026 तक\nनियम: 1 ट्रांजेक्शन = 1 रसीद अपलोड",
    instructionTitle: "महत्वपूर्ण निर्देश",
    instructionText: "वेबसाइट पर अपना आधार कार्ड नंबर और पासवर्ड डालकर LOGIN करें और अपना GROUP देख लें। आप जिस GROUP में हैं, सिर्फ उसी GROUP में दिखने वाले परिवार के खाते में न्यूनतम राशि (50 रुपए) ऑनलाइन (UPI/Net Banking) भेजें।",
    instructionNote: "नोट: किसी अन्य GROUP में भेजा गया सहयोग मान्य नहीं होगा। सहयोग भेजने के बाद ट्रांजेक्शन स्क्रीनशॉट और ID अपलोड करना अनिवार्य है।"
  });

  useEffect(() => {
    const fetchAlertsAndSettings = async () => {
      try {
        const allAlerts = await getHomeAlerts();
        // Filter only those which are set to active by Admin
        const activeAlerts = allAlerts.filter(alert => alert.isActive);
        setGroupDetails(activeAlerts);

        const pageSettings = await getHomePageSettings();
        if (pageSettings) {
          setSettings(pageSettings);
        }
      } catch (error) {
        console.error("Failed to load alerts or settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlertsAndSettings();
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="bg-gradient-to-r from-[#087889] to-[#06616e] rounded-2xl text-center py-10 shadow-lg mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#f08519] opacity-20 rounded-full blur-2xl"></div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-wide relative z-10">
            {settings.headerTitle}
          </h1>
          <div className="w-24 h-1.5 mx-auto mt-5 rounded-full relative z-10" style={{ backgroundColor: logoOrange }}></div>
        </div>

        {/* ================= ALERTS & INSTRUCTIONS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          
          {/* Alert Box */}
          <div className="bg-white border-l-[6px] border-[#f08519] rounded-xl shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="bg-orange-100 text-[#f08519] p-3 rounded-full mr-4 text-xl">🔔</span>
              <h2 className="text-2xl font-bold text-gray-800">{settings.alertTitle}</h2>
            </div>
            <ul className="space-y-3 text-gray-700 font-medium text-base">
              {settings.alertPoints.split('\n').filter(p => p.trim() !== '').map((point, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-[#f08519] mr-2 mt-0.5">▸</span> 
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions Box */}
          <div className="bg-white border-l-[6px] border-[#087889] rounded-xl shadow-md p-6 lg:p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <span className="bg-teal-100 text-[#087889] p-3 rounded-full mr-4 text-xl">💡</span>
              <h2 className="text-2xl font-bold text-gray-800">{settings.instructionTitle}</h2>
            </div>
            <p className="text-gray-600 font-medium text-sm leading-relaxed text-justify mb-3 whitespace-pre-line">
              {settings.instructionText}
            </p>
            {settings.instructionNote && (
              <p className="text-[#087889] font-bold text-sm bg-teal-50 p-3 rounded-lg border border-teal-100 whitespace-pre-line">
                {settings.instructionNote}
              </p>
            )}
          </div>
        </div>

        {/* ================= GROUP DIRECTORY ================= */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b-2 border-gray-200 pb-2">
            <span className="text-[#f08519] mr-3">📋</span> ग्रुप सूची (Group Directory)
          </h2>
          
          <div className="bg-white rounded-2xl shadow-md border-t-[6px] p-6 md:p-8" style={{ borderColor: logoTeal }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {loading ? (
                <div className="col-span-full text-center text-gray-500 py-4">Loading active groups...</div>
              ) : groupDetails.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-4">वर्तमान में कोई ग्रुप सूची उपलब्ध नहीं है।</div>
              ) : groupDetails.map((item, index) => (
                <div key={index} className="flex items-center p-3 rounded-lg hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-100">
                  <div className="text-white px-4 py-2 rounded-md font-bold text-sm whitespace-nowrap shadow-sm" style={{ backgroundColor: logoTeal }}>
                    GROUP - {item.group}
                  </div>
                  <span className="text-xl mx-3" style={{ color: logoOrange }}>👉</span>
                  <div className="font-bold text-gray-700 text-sm md:text-base">
                    {item.member} {item.address ? `(${item.address.split(',')[0].replace('जिला-','').trim()})` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= GROUP DETAILS CARDS (NEW PHOTO DESIGN) ================= */}
        <div className="space-y-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center border-b-2 border-gray-200 pb-2">
            <span className="text-[#087889] mr-3">💳</span> ग्रुप अनुसार खाता विवरण
          </h2>
          
          {groupDetails.map((detail, index) => (
            <div 
              key={index} 
              className="bg-[#f2fafe] border-l-[8px] rounded-r-2xl p-6 md:p-10 shadow-sm hover:shadow-md transition-shadow"
              style={{ borderColor: logoTeal }}
            >
              
              {/* Group Name (Like POOL- A in photo) */}
              <h3 className="text-2xl md:text-3xl font-bold mb-5 tracking-wide" style={{ color: logoTeal }}>
                GROUP- {detail.group}
              </h3>
              
              {/* Beneficiary Details (Vertical text like photo) */}
              <div className="space-y-2.5 text-gray-800 font-medium text-base md:text-lg mb-8">
                <p>{detail.member}</p>
                <p>यूनिक आईडी- {detail.uniqueId}</p>
                <p>सदस्यता तिथि- {detail.date}</p>
                <p>{detail.address}</p>
                {detail.type === 'nidhan' ? (
                  <>
                    <p>मृतक का नाम- {detail.daughter}</p>
                    <p>निधन तिथि- {detail.marriageDate}</p>
                  </>
                ) : (
                  <>
                    <p>बेटी का नाम- {detail.daughter}</p>
                    <p>विवाह तिथि- {detail.marriageDate}</p>
                  </>
                )}
              </div>

              {/* Bank Details Heading (Like green heading in photo) */}
              <h4 className="text-xl md:text-2xl font-bold mb-4" style={{ color: logoOrange }}>
                सहयोग हेतु खाता विवरण
              </h4>
              
              {/* Bank Details (Vertical uppercase text like photo) */}
              <div className="space-y-2.5 text-gray-800 font-medium text-base md:text-lg mb-8 uppercase">
                <p>NAME- {detail.accName}</p>
                <p>A/C- {detail.accNo}</p>
                <p>IFSC- {detail.ifsc}</p>
                <p>BRANCH- {detail.branch}</p>
                <p>BANK- {detail.bank}</p>
                <p className="normal-case mt-4 text-gray-900 font-bold">न्यूनतम सहयोग- {detail.minSupport}</p>
              </div>

              {/* QR Code (If available) */}
              {detail.qrCodeBase64 && (
                <div className="mt-8 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-100 shadow-sm max-w-sm">
                  <div className="text-lg font-bold text-gray-800 mb-2">{detail.accName}</div>
                  <div className="text-sm font-semibold text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Scan & Pay</div>
                  <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-50 flex items-center justify-center p-2 rounded-lg border-2 border-dashed border-gray-200">
                     <img src={detail.qrCodeBase64} alt="QR Code" className="h-full w-full object-contain" />
                  </div>
                  <div className="text-sm font-medium text-gray-500 mt-4 text-center px-4">
                    किसी भी UPI ऐप (Google Pay, PhonePe, Paytm) से स्कैन करें
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Group;