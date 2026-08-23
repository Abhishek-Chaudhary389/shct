import React from 'react';
import { Link } from 'react-router-dom';

const RegistrationBanner = () => {
  const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=fastrelief@sbi%26pn=FAST%2520RELIEF%2520CHARITABLE%2520TRUST%26cu=INR";

  return (
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
  );
};

export default RegistrationBanner;
