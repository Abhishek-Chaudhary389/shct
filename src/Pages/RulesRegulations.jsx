import React, { useEffect } from 'react';
import { ShieldCheckIcon, RupeeIcon, SparklesIcon, ShieldIcon, WeddingIcon, FileTextIcon, ClockIcon } from '../components/common/Icons';

const RulesRegulations = () => {
  // पेज खुलते ही स्क्रीन ऊपर से शुरू हो
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-[#087889]">
        
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#087889] to-[#06616e] text-white py-8 px-6 sm:px-10 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide uppercase mb-2">
            SILENT HELP CHARITABLE TRUST (SHCT)
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-orange-200 mb-4">
            साइलेंट हेल्प चैरिटेबल ट्रस्ट
          </h2>
          <p className="text-sm sm:text-base italic text-gray-100 max-w-2xl mx-auto leading-relaxed bg-white/10 p-3 rounded-lg backdrop-blur-sm">
            SHCT आम लोगों का, आम लोगों द्वारा, आमजन के लिए बनाया गया एक ऐसा स्वयं सहायता समूह है जहाँ सब सदस्य मिलकर एक दूसरे के सुख दुख में आर्थिक मदद करते हैं।
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8 text-gray-800">
          
          {/* Main Points Intro */}
          <div className="space-y-4 border-b border-gray-200 pb-6">
            <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-xl border-l-4 border-[#087889]">
              <span className="text-[#087889] font-bold mt-0.5">▪</span>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                SHCT से जुड़े हुए वैधानिक सदस्य की असामयिक मृत्यु होने पर SHCT सदस्य मृतक परिवार को पारदर्शी तरीके से आर्थिक मदद करते हैं।
              </p>
            </div>

            <div className="flex items-start gap-3 bg-orange-50 p-4 rounded-xl border-l-4 border-[#f08519]">
              <span className="text-[#f08519] font-bold mt-0.5">▪</span>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                SHCT से जुड़े हुए वैधानिक सदस्यों को बेटियों की शादी में भी आर्थिक मदद की जाती है।
              </p>
            </div>

            <div className="flex items-start gap-3 bg-teal-50 p-4 rounded-xl border-l-4 border-[#087889]">
              <span className="text-[#087889] font-bold mt-0.5">▪</span>
              <p className="text-sm sm:text-base font-medium leading-relaxed">
                SHCT परिवार में न्यूनतम 18 वर्ष से लेकर अधिकतम 65 वर्ष तक के लोग जुड़ सकते हैं। 65 वर्ष के पश्चात सदस्यता स्वतः समाप्त हो जाएगी।
              </p>
            </div>
          </div>

          {/* Section: यह काम कैसे करता है? */}
          <div>
            <h3 className="text-xl font-bold text-[#087889] mb-4 flex items-center gap-2 border-b-2 border-[#087889] pb-2 inline-block">
              <ShieldCheckIcon className="w-5 h-5 text-[#087889]" /> यह काम कैसे करता है? (एक के लिए सब, सबके लिए एक):
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-[#f08519] font-bold">1.</span>
                <p>यदि किसी वैधानिक सदस्य की अचानक मृत्यु हो जाती है तो बाकी के सभी सदस्य अपने मोबाइल से सीधे उस पीड़ित परिवार के बैंक खाते में ₹100-₹100 भेजते हैं। इस तरह, सिर्फ ₹100 देने से पीड़ित परिवार के पास सीधे बड़ी आर्थिक मदद पहुँच जाती है। SHCT सदस्यों की संख्या के आधार पर यह मदद लाखों में पहुँच सकती है।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f08519] font-bold">2.</span>
                <p>उसी प्रकार SHCT परिवार के किसी सदस्य की कम से कम दो बेटियों की शादी के लिए सदस्यों द्वारा सीधे संबंधित के खाते में 100-100 रुपये की धनराशि भेजकर आर्थिक मदद की जाती है। इसका लाभ लेने के लिए बिटिया को भी 18 वर्ष के बाद संस्था का सदस्य होना अनिवार्य है।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f08519] font-bold">3.</span>
                <p>न्यूनतम 25 हजार से अधिकतम 3 लाख तक (संख्या पर आधारित) की मदद बेटी की शादी के लिए निर्धारित की गई है। जो बाद में बढ़कर 5 लाख तक की जाएगी।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f08519] font-bold">4.</span>
                <p>SHCT सदस्य की दुर्घटना होने पर या गंभीर बीमारी के लिए सभी SHCT सदस्यों द्वारा न्यूनतम 50-50 रुपये सीधे संबंधित सदस्य के खाते में भेज कर 25 हजार से 2 लाख रुपये तक आर्थिक मदद की जाएगी।</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#f08519] font-bold">5.</span>
                <p>SHCT किसी भी सदस्य से 100 रुपये से अधिक की धनराशि का सहयोग कभी नहीं कराएगा। बाद में संख्या बढ़ने पर इसे घटाया भी जा सकता है।</p>
              </div>
            </div>
          </div>

          {/* Section: इससे जुड़ने का खर्च क्या है? */}
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            <h3 className="text-xl font-bold text-[#087889] mb-3 flex items-center gap-2">
              <RupeeIcon className="w-5 h-5 text-[#087889]" /> इससे जुड़ने का खर्च क्या है?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              इसमें जुड़ने के लिए कोई बड़ा प्रीमियम या हजारों रुपये नहीं देने होते हैं। कोई भी आम व्यक्ति (प्राइवेट टीचर, किसान, मजदूर, दुकानदार, गृहणी, छात्राएं, प्राइवेट सेक्टर से जुड़े कर्मचारी) मात्र <strong className="text-[#f08519] text-lg">₹200 का वार्षिक दान (Yearly Donation)</strong> देकर SHCT का सदस्य बन सकते हैं।
            </p>
          </div>

          {/* Section: इससे क्या-क्या फायदे मिलते हैं? */}
          <div>
            <h3 className="text-xl font-bold text-[#087889] mb-4 flex items-center gap-2 border-b-2 border-[#087889] pb-2 inline-block">
              <SparklesIcon className="w-5 h-5 text-[#087889]" /> इससे क्या-क्या फायदे मिलते हैं?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 shadow-sm">
                <h4 className="font-bold text-[#087889] mb-2 flex items-center gap-2"><ShieldIcon className="w-4 h-4 text-[#087889]" /> परिवार की सुरक्षा</h4>
                <p className="text-xs sm:text-sm text-gray-600">सदस्य के न रहने पर उसके परिवार या बच्चों को लाखों रुपये की सीधी मदद मिलती है ताकि वे बेसहारा न हों।</p>
              </div>
              <div className="bg-orange-50/50 p-5 rounded-xl border border-orange-100 shadow-sm">
                <h4 className="font-bold text-[#f08519] mb-2 flex items-center gap-2"><WeddingIcon className="w-4 h-4 text-[#f08519]" /> बेटी की शादी</h4>
                <p className="text-xs sm:text-sm text-gray-600">सदस्य की बेटी के विवाह के समय सभी लोग मिलकर आर्थिक सहयोग (शगुन) भेजते हैं।</p>
              </div>
              <div className="bg-teal-50/50 p-5 rounded-xl border border-teal-100 shadow-sm">
                <h4 className="font-bold text-[#087889] mb-2 flex items-center gap-2"><FileTextIcon className="w-4 h-4 text-[#087889]" /> गरीब बच्चों की पढ़ाई</h4>
                <p className="text-xs sm:text-sm text-gray-600">संस्था के मुख्य फंड से अनाथ और गरीब बच्चों को किताबें और मुफ्त शिक्षा दी जाती है।</p>
              </div>
            </div>
          </div>

          {/* Special Quote Box */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-6 rounded-xl text-center shadow-lg">
            <p className="text-xs uppercase tracking-widest text-orange-200 mb-1 font-bold">एक लाइन में कहें तो :</p>
            <p className="text-lg sm:text-xl font-serif italic">
              "आज आप किसी अनजान सदस्य के दुख में ₹100 की मदद करेंगे, तो कल को लाखों लोग मिलकर आपके परिवार को संभाल लेंगे"
            </p>
          </div>

          {/* Section: SHCT की वैधानिकता (Lock-in Period) */}
          <div>
            <h3 className="text-xl font-bold text-[#087889] mb-4 flex items-center gap-2 border-b-2 border-[#087889] pb-2 inline-block">
              <span>⏳</span> SHCT की वैधानिकता (Lock-in Period)
            </h3>
            <ul className="space-y-3 text-sm sm:text-base text-gray-700 bg-gray-50 p-6 rounded-xl border border-gray-200">
              <li className="flex items-center gap-3">
                <span className="text-[#087889] font-bold">▪</span> 1 जुलाई 2026 से जुड़ने वाले सभी सदस्यों का लॉक इन पीरियड 6 माह का होगा।
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#087889] font-bold">▪</span> 1 अक्टूबर 2026 से जुड़ने वाले सभी सदस्यों का लॉकडन पीरियड 8 माह का होगा।
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#087889] font-bold">▪</span> 1 जनवरी 2027 से जुड़ने वाले सभी सदस्यों का लॉकडन पीरियड 10 माह का होगा।
              </li>
              <li className="flex items-center gap-3">
                <span className="text-[#087889] font-bold">▪</span> 1 मार्च 2027 से जुड़ने वाले सभी सदस्यों का लॉकडन पीरियड 1 साल का होगा।
              </li>
              <p className="text-xs text-gray-500 pt-2 italic border-t border-gray-200 mt-2">
                सुविधामानुसार इसे घटाया या बढ़ाया भी जा सकता है।
              </p>
            </ul>
          </div>

        </div>

        {/* Footer Banner Inside Card */}
        <div className="bg-gray-900 text-white p-6 text-center space-y-3">
          <p className="text-sm sm:text-base font-semibold text-orange-400">
            तो आज ही SHCT से जुड़िए और अपना और अपने परिवार का सुख दुख हमसे बांटिये<br />
            SHCT परिवार आपके साथ हमेशा खड़ा रहेगा आर्थिक संबल बन कर
          </p>
          <div className="bg-gray-800 text-xs sm:text-sm text-gray-300 py-3 px-4 rounded-lg font-medium border border-gray-700 max-w-2xl mx-auto">
            उपरोक्त सभी नियमों में से असामयिक मृत्यु एवं बिटिया की शादी सहयोग 1 जुलाई 2026 से लागू है बाकी की सहायता भविष्य की योजना के अंतर्गत है।
          </div>
        </div>

      </div>
    </div>
  );
};

export default RulesRegulations;