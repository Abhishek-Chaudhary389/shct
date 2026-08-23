import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedMembers } from '../../services/dataService';

const RegistrationBanner = () => {
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=fastrelief@sbi%26pn=FAST%2520RELIEF%2520CHARITABLE%2520TRUST%26cu=INR";

  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const members = await getApprovedMembers();
        setMemberCount(members.length);
      } catch (err) {
        console.error("Error fetching member count:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCount();
  }, []);

  return (
    <>
      <div className="bg-slate-900 text-white py-16 px-4 relative overflow-hidden">
        {/* Decorative Blur Backgrounds */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#087889] opacity-20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#f08519] opacity-10 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Large Header */}
          <h2 className="text-2xl md:text-4xl font-extrabold mb-8 tracking-wide leading-tight text-orange-400">
            SHCT सदस्यता प्राप्त करने हेतु ₹200 वार्षिक सहयोग राशि जमा करें।
          </h2>

          {/* Info Grid: Bank details on left, QR on right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-10 max-w-4xl mx-auto">

            {/* Bank Details Card */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 md:p-8 rounded-3xl flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">🏦</span>
                  <h3 className="text-xl font-bold text-gray-200">बैंक खाता विवरण (Bank Details)</h3>
                </div>
                <div className="space-y-3.5 text-left text-sm md:text-base font-semibold">
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-gray-400">NAME:</span>
                    <span className="text-white">Silent Help Charitable Trust (SHCT)</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-gray-400">ACCOUNT No:</span>
                    <span className="text-white font-mono tracking-wider">5++++++++++</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-700/50 pb-2">
                    <span className="text-gray-400">IFSC:</span>
                    <span className="text-white font-mono tracking-wider">SBI+++++++++</span>
                  </div>
                  <div className="flex justify-between pb-1">
                    <span className="text-gray-400">BRANCH:</span>
                    <span className="text-white">Khalilabad</span>
                  </div>
                </div>
              </div>

              {/* Note Area */}
              <div className="mt-6 pt-4 border-t border-slate-700/50 text-left text-xs md:text-sm text-orange-300/90 font-medium leading-relaxed">
                ⚠️ <span className="font-bold">निर्देश नोट:</span> सदस्य बनने के एक वर्ष बाद पुनः: ट्रस्ट को ₹200 रुपये वार्षिक दान करें एवं प्रोफाइल लॉगिन करके <span className="font-bold text-white underline">VARSHIK DAN</span> में रसीद अपलोड अवश्य करें।
              </div>
            </div>

            {/* QR Code Card */}
            <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700 p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center shadow-xl">
              <div className="bg-white p-4 rounded-2xl shadow-inner mb-4 flex flex-col items-center">
                <span className="text-[10px] font-black text-indigo-900 tracking-wider mb-2">SCAN & PAY</span>
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-40 h-40 object-contain"
                />
              </div>
              <div className="text-center font-bold text-sm text-gray-300">
                <p className="text-xs text-gray-400">UPI ID</p>
                <p className="font-mono text-emerald-400">shct@sbi</p>
              </div>
            </div>

          </div>

          {/* Dynamic Registered Members Counter Section */}
          <div className="mt-12 pt-10 border-t border-slate-800 flex flex-col items-center justify-center">
            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
              Member Register Till now
            </h3>
            <div className="flex items-center gap-4 mb-8 bg-slate-800/40 px-6 py-3 rounded-full border border-slate-700/50 group hover:border-[#087889]/50 transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-[#087889] text-white flex items-center justify-center text-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                ✋
              </div>
              <span className="text-3xl md:text-4xl font-black text-amber-400 tracking-wider font-mono">
                {loading ? "..." : memberCount}
              </span>
            </div>

            {/* Register Now Button */}
            <div>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-slate-900 font-extrabold text-lg rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 uppercase tracking-wider"
              >
                Register Now (अभी रजिस्टर करें) ➔
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ================= HOW TO BECOME A MEMBER SECTION (WHITE BACKGROUND) ================= */}
      <div className="bg-white text-gray-800 py-16 px-4 border-t border-gray-100">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              SHCT के सदस्य कैसे बनें?
              <div className="w-20 h-1 bg-gradient-to-r from-[#f08519] to-[#087889] mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust की सदस्यता प्राप्त करने की सरल प्रक्रिया</p>
          </div>

          {/* Points List */}
          <div className="space-y-6">
            
            {/* Point 1 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#087889]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#087889] font-black flex items-center justify-center shrink-0 border border-teal-100">
                1
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">वेबसाइट पर रजिस्ट्रेशन करें</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  सबसे पहले संस्था की आधिकारिक वेबसाइट पर आएं और <strong>Register Now (अभी रजिस्टर करें)</strong> बटन पर क्लिक करके अपनी सही व्यक्तिगत जानकारी दर्ज करें।
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#087889]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#087889] font-black flex items-center justify-center shrink-0 border border-teal-100">
                2
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">वार्षिक दान भेजें और रसीद सबमिट करें</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  रजिस्ट्रेशन करने के बाद दिए गए बैंक खाते या क्यूआर कोड (QR Code) पर <strong>₹200 वार्षिक सहयोग राशि</strong> दान स्वरूप भेजें और भुगतान रसीद (Receipt/Screenshot) अपलोड करके फॉर्म सबमिट कर दें।
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#087889]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#087889] font-black flex items-center justify-center shrink-0 border border-teal-100">
                3
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">सदस्यता के लिए आयु पात्रता</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  SHCT परिवार में सदस्यता ग्रहण करने के लिए सदस्य की आयु <strong>न्यूनतम 18 वर्ष से लेकर अधिकतम 65 वर्ष तक</strong> होनी आवश्यक है।
                </p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#087889]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#087889] font-black flex items-center justify-center shrink-0 border border-teal-100">
                4
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">सदस्यता स्वतः समाप्ति</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  SHCT परिवार के नियम के अनुसार, सदस्य की आयु <strong>65 वर्ष पूर्ण होने के पश्चात</strong> उनकी संस्था की सदस्यता स्वतः (automatically) समाप्त हो जाएगी।
                </p>
              </div>
            </div>

            {/* Point 5 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#087889]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-teal-50 text-[#087889] font-black flex items-center justify-center shrink-0 border border-teal-100">
                5
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">लॉगिन और कल्याणकारी योजनाएं</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  एडमिन टीम द्वारा आपका रजिस्ट्रेशन अप्रूव होने के बाद, आप वेबसाइट पर लॉगिन करके संस्था की सभी कल्याणकारी योजनाओं व आपसी वित्तीय सहयोग कार्यक्रमों का लाभ ले सकते हैं।
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= MEMBERSHIP ELIGIBILITY & RULES SECTION (LIGHT GRAY BACKGROUND) ================= */}
      <div className="bg-gray-50 text-gray-800 py-16 px-4 border-t border-gray-200">
        <div className="max-w-4xl mx-auto">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              सदस्यता लेने के नियम व पात्रता
              <div className="w-20 h-1 bg-gradient-to-r from-[#087889] to-[#f08519] mx-auto mt-3 rounded-full"></div>
            </h2>
            <p className="text-gray-500 text-sm mt-2 font-medium">Silent Help Charitable Trust में जुड़ने के लिए आवश्यक पात्रता शर्तें</p>
          </div>

          {/* Points List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Point 1 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">भारत के नागरिक</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  आवेदक अनिवार्य रूप से भारत का मूल नागरिक होना चाहिए।
                </p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">भारत में कार्यरत</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  आवेदक वर्तमान में भारत के भीतर ही किसी भी राज्य या शहर में कार्यरत/काम कर रहा होना चाहिए।
                </p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">सरकारी एवं प्राइवेट कर्मचारी</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  चाहे आप कोई भी सरकारी नौकरी (Government Job) कर रहे हों या प्राइवेट काम (Private Job), आप सदस्यता ले सकते हैं।
                </p>
              </div>
            </div>

            {/* Point 4 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">विद्यार्थी/छात्र पात्रता</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  सभी पढ़ने वाले विद्यार्थी/छात्र (Students) भी सदस्यता ले सकते हैं, बस उनकी आयु 18 वर्ष से अधिक होनी चाहिए।
                </p>
              </div>
            </div>

            {/* Point 5 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">किसान और मजदूर</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  भारत के समस्त किसान भाई, दैनिक मजदूर और अन्य सभी कामकाजी/आम लोग भी इस संस्था की सदस्यता ले सकते हैं।
                </p>
              </div>
            </div>

            {/* Point 6 */}
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#f08519]/30 hover:shadow-md transition-all duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-50 text-[#f08519] font-black flex items-center justify-center shrink-0 border border-orange-100">
                ✓
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-800">न्यूनतम 18 वर्ष आयु</h4>
                <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                  ट्रस्ट से जुड़ने के लिए आवेदनकर्ता की आयु 18 वर्ष से ऊपर (18+) होना आवश्यक है।
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default RegistrationBanner;
