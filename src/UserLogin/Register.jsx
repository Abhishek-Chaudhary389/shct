import React from 'react';

const Register = () => {
  // Theme Colors
  const themeTeal = "#087889";
  const themeOrange = "#f08519";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="bg-[#087889] px-8 py-6 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
          <h2 className="text-3xl font-bold text-white relative z-10 tracking-wide">
            नया पंजीकरण (New Registration)
          </h2>
          <p className="text-teal-100 mt-2 text-sm relative z-10">
            SHCT परिवार से जुड़ने के लिए कृपया नीचे दिया गया फॉर्म सही-सही भरें।
          </p>
        </div>

        <div className="p-6 md:p-10">
          
          {/* ================= PAYMENT & QR SECTION ================= */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full md:w-1/3">
              <h3 className="font-bold text-gray-800 mb-2 tracking-widest uppercase text-sm">SCAN & PAY</h3>
              {/* Dummy QR Code */}
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=shct@sbi&pn=SHCT" 
                alt="QR Code" 
                className="w-40 h-40 object-contain mb-2"
              />
              <p className="text-xs font-bold text-gray-500">UPI ID: shct@sbi</p>
            </div>

            {/* Bank Details Card */}
            <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 shadow-md text-white flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#f08519] opacity-20 rounded-bl-full"></div>
              <h3 className="text-xl md:text-2xl font-bold text-[#f08519] mb-4">
                SILENT HELP CHARITABLE TRUST
              </h3>
              <div className="space-y-2 text-sm md:text-base font-medium text-gray-200">
                <p><span className="text-gray-400">A/C HOLDER NAME-</span> SHCT</p>
                <p className="text-lg text-[#087889] font-bold bg-white inline-block px-3 py-1 rounded mt-1">ACCOUNT No - 44404849629</p>
                <p className="mt-2"><span className="text-gray-400">IFSC -</span> SBIN0001147</p>
                <p><span className="text-gray-400">BRANCH -</span> MAHARAJGANJ</p>
              </div>
            </div>
          </div>

          {/* ================= REGISTRATION FORM ================= */}
          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            
            {/* --- SECTION 1: व्यक्तिगत जानकारी --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center">
                <span className="mr-2">👤</span> व्यक्तिगत जानकारी
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नाम (आधार कार्ड के अनुसार) <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="अपना नाम दर्ज करें" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">आधार कार्ड नंबर <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="12 अंकों का आधार नंबर" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">पिता/पति का नाम <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="पिता या पति का नाम" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">जन्म तिथि (आधार कार्ड के अनुसार) <span className="text-red-500">*</span></label>
                  <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">पासवर्ड बनाएं <span className="text-red-500">*</span></label>
                  <input type="password" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="सुरक्षित पासवर्ड बनाएं" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">मोबाइल नंबर <span className="text-red-500">*</span></label>
                    <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="10 अंकों का नंबर" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">जेंडर <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
                      <option value="">Choose...</option>
                      <option value="male">Male (पुरुष)</option>
                      <option value="female">Female (महिला)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* --- SECTION 2: व्यवसाय एवं पता --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center">
                <span className="mr-2">🏢</span> व्यवसाय एवं पता
              </h3>
              
              {/* Radio Buttons for Occupation */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">व्यवसाय <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Government Job', 'Private Job', 'Business', 'Agriculture', 'Housewife', 'Student', 'Contract Workers', 'Public Rep.'].map((job) => (
                    <label key={job} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer p-2 border border-gray-200 rounded-md hover:bg-teal-50 transition-colors">
                      <input type="radio" name="occupation" className="text-[#087889] focus:ring-[#087889] h-4 w-4" />
                      <span>{job}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
                    <option>Uttar Pradesh</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई निवासी जिला <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
                    <option value="">Select District</option>
                    <option value="gorakhpur">Gorakhpur</option>
                    <option value="maharajganj">Maharajganj</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई निवासी ब्लॉक <span className="text-red-500">*</span></label>
                  <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
                    <option value="">Select Block</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ईमेल (वैकल्पिक)</label>
                  <input type="email" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="अपना ईमेल दर्ज करें" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई पता <span className="text-red-500">*</span></label>
                  <textarea rows="3" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors resize-none" placeholder="कृपया अपना स्थाई पता दर्ज करें"></textarea>
                </div>
              </div>
            </div>

            {/* --- SECTION 3: नॉमिनी एवं पेमेंट --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center">
                <span className="mr-2">🛡️</span> नॉमिनी एवं भुगतान विवरण
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी का नाम <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="नॉमिनी का नाम" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी से संबंध <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="जैसे- बेटा, पत्नी, भाई" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी का मोबाइल नंबर <span className="text-red-500">*</span></label>
                  <input type="tel" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="नॉमिनी का मोबाइल नंबर" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction ID <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors font-mono" placeholder="Payment Transaction ID" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">रेफर कोड (वैकल्पिक)</label>
                  <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="रेफर करने वाले का यूनिक ID (10 अंक)" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ट्रस्ट को 50 रुपए दान (Payment Receipt) <span className="text-red-500">*</span></label>
                  <input type="file" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors" />
                </div>
              </div>
            </div>

            {/* --- DECLARATION & SUBMIT --- */}
            <div className="pt-6 border-t border-gray-200">
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-5 h-5 text-[#087889] border-gray-300 rounded focus:ring-[#087889]" required />
                <span className="text-sm text-gray-600 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                  I have read the rules and regulations of SILENT HELP CHARITABLE TRUST available on the website. I agree to all the terms and conditions. If I do not contribute regularly under the rules made by SHCT, then my nominee will not be able to claim the financial help. <span className="text-red-500">*</span>
                </span>
              </label>

              <div className="mt-8 text-center">
                <button type="submit" className="w-full md:w-auto px-16 py-4 bg-[#087889] hover:bg-[#06616e] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  REGISTER NOW
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;