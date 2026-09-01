import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addPendingRegistration } from '../../services/dataService';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToImageKit } from '../../utils/imageKitUploader';
import { UserIcon, MapPinIcon, ShieldIcon, CreditCardIcon, EyeIcon, EyeOffIcon, CheckIcon } from '../../components/common/Icons';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", 
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttarakhand", "Uttar Pradesh", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', aadhaar: '', fatherName: '', dob: '', password: '', mobile: '',
    gender: '', occupation: '', state: 'Uttar Pradesh', district: '', block: '', email: '', address: '',
    nomineeName: '', nomineeRelation: '', nomineeMobile: '', transactionId: '',
    referralCode: '', receiptUrl: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, receiptUrl: compressedBase64 });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalReceiptUrl = formData.receiptUrl;
      // If it is a base64 image data URL, upload to ImageKit
      if (formData.receiptUrl && formData.receiptUrl.startsWith('data:image')) {
        finalReceiptUrl = await uploadToImageKit(formData.receiptUrl, `reg_receipt_${formData.aadhaar}_${Date.now()}.jpg`);
      }

      await addPendingRegistration({
        ...formData,
        receiptUrl: finalReceiptUrl
      });

      setTimeout(() => {
        setIsSubmitting(false);
        alert('आपका पंजीकरण सफलतापुर्वक हो गया है। कृपया एडमिन अप्रूवल का इंतज़ार करें।');
        navigate('/');
      }, 1500);
    } catch (error) {
      setIsSubmitting(false);
      alert('पंजीकरण में त्रुटि आई: ' + (error.message || error));
      console.error(error);
    }
  };

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
            SHCT परिवार से जुड़ने के लिए कृपया नीचे दिया गया फॉर्म सही-सही भरें।
          </p>
        </div>

        <div className="p-6 md:p-10">
          
          {/* ================= PAYMENT & QR SECTION ================= */}
          <div className="flex flex-col md:flex-row gap-8 mb-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
            {/* QR Code */}
            <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-100 w-full md:w-1/3">
              <h3 className="font-bold text-gray-800 mb-2 tracking-widest uppercase text-sm">SCAN & PAY</h3>
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
                <p className="text-lg text-[#087889] font-bold bg-white inline-block px-3 py-1 rounded mt-1">ACCOUNT No - 45431328562</p>
                <p className="mt-2"><span className="text-gray-400">IFSC -</span> SBIN0011827</p>
                <p><span className="text-gray-400">BRANCH -</span> State Bank of India</p>
              </div>
            </div>
          </div>

          {/* ================= REGISTRATION FORM ================= */}
          <form className="space-y-10" onSubmit={handleSubmit}>
            
            {/* --- SECTION 1: व्यक्तिगत जानकारी --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                <UserIcon className="w-6 h-6" /> व्यक्तिगत जानकारी
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नाम (आधार कार्ड के अनुसार) <span className="text-red-500">*</span></label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="अपना नाम दर्ज करें" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">आधार कार्ड नंबर <span className="text-red-500">*</span></label>
                  <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="12 अंकों का आधार नंबर" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">पिता/पति का नाम <span className="text-red-500">*</span></label>
                  <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="पिता या पति का नाम" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">जन्म तिथि (आधार कार्ड के अनुसार) <span className="text-red-500">*</span></label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">पासवर्ड बनाएं <span className="text-red-500">*</span></label>
                  <div className="relative rounded-lg shadow-sm">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password} 
                      onChange={handleChange} 
                      required 
                      className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" 
                      placeholder="सुरक्षित पासवर्ड बनाएं" 
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#087889] transition-colors focus:outline-none"
                      title={showPassword ? "पासवर्ड छुपाएं" : "पासवर्ड देखें"}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">मोबाइल नंबर <span className="text-red-500">*</span></label>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="10 अंकों का नंबर" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">जेंडर <span className="text-red-500">*</span></label>
                    <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
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
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                <MapPinIcon className="w-6 h-6" /> व्यवसाय एवं पता
              </h3>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">व्यवसाय <span className="text-red-500">*</span></label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['Government Job', 'Private Job', 'Business', 'Agriculture', 'Housewife', 'Student', 'Contract Workers', 'Public Rep.'].map((job) => (
                    <label key={job} className="flex items-center space-x-2 text-sm text-gray-700 cursor-pointer p-2 border border-gray-200 rounded-md hover:bg-teal-50 transition-colors">
                      <input type="radio" name="occupation" value={job} checked={formData.occupation === job} onChange={handleChange} required className="text-[#087889] focus:ring-[#087889] h-4 w-4" />
                      <span>{job}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
                  <select name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors">
                    {indianStates.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई निवासी जिला <span className="text-red-500">*</span></label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="अपना जिला दर्ज करें" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई निवासी ब्लॉक <span className="text-red-500">*</span></label>
                  <input type="text" name="block" value={formData.block} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="Block Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ईमेल (वैकल्पिक)</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="अपना ईमेल दर्ज करें" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">स्थाई पता <span className="text-red-500">*</span></label>
                  <textarea rows="3" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors resize-none" placeholder="कृपया अपना स्थाई पता दर्ज करें"></textarea>
                </div>
              </div>
            </div>

            {/* --- SECTION 3: नॉमिनी विवरण --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                <ShieldIcon className="w-6 h-6" /> नॉमिनी विवरण
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी का नाम <span className="text-red-500">*</span></label>
                  <input type="text" name="nomineeName" value={formData.nomineeName} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="नॉमिनी का नाम" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी से संबंध <span className="text-red-500">*</span></label>
                  <input type="text" name="nomineeRelation" value={formData.nomineeRelation} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="जैसे- बेटा, पत्नी, भाई" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">नॉमिनी का मोबाइल नंबर <span className="text-red-500">*</span></label>
                  <input type="tel" name="nomineeMobile" value={formData.nomineeMobile} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" placeholder="नॉमिनी का मोबाइल नंबर" />
                </div>
              </div>
            </div>

            {/* --- SECTION 4: भुगतान विवरण --- */}
            <div>
              <h3 className="text-xl font-bold text-[#f08519] border-b-2 border-gray-100 pb-2 mb-6 flex items-center gap-2">
                <CreditCardIcon className="w-6 h-6" /> भुगतान विवरण
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Transaction ID <span className="text-red-500">*</span></label>
                  <input type="text" name="transactionId" value={formData.transactionId} onChange={handleChange} required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors font-mono" placeholder="Payment Transaction ID" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">ट्रस्ट को 200 रुपए दान (Payment Receipt) <span className="text-red-500">*</span></label>
                  <input type="file" onChange={handleFileChange} required accept="image/*" className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors cursor-pointer text-sm text-gray-600" />
                  {formData.receiptUrl && <p className="text-xs text-green-600 mt-1 font-bold flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> Image Selected</p>}
                </div>
              </div>
            </div>

            {/* --- DECLARATION & SUBMIT --- */}
            <div className="pt-6 border-t border-gray-200">
              
              {/* Rules Highlight Box */}
              <div className="mb-6 bg-orange-50/60 border border-orange-100 rounded-xl p-5 text-sm text-gray-700 font-semibold leading-relaxed space-y-3">
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-lg leading-none">•</span>
                  <p>SHCT से जुड़े हुए वैधानिक सदस्य की असामयिक मृत्यु होने पर SHCT सदस्य मृतक परिवार को पारदर्शी तरीके से आर्थिक मदद करते हैं।</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-lg leading-none">•</span>
                  <p>SHCT से जुड़े सदस्यों की कम से कम दो बेटियों की शादी के लिए सभी SHCT सदस्य सीधे संबंधित सदस्य के खाते में धनराशि भेजकर बेटी की शादी के लिए आर्थिक सहायता करते हैं।</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-orange-500 text-lg leading-none">•</span>
                  <p>SHCT परिवार में न्यूनतम 18 वर्ष से लेकर अधिकतम 65 वर्ष तक के लोग जुड़ सकते हैं। 65 वर्ष के पश्चात सदस्यता स्वतः समाप्त हो जाएगी।</p>
                </div>
              </div>

              <label className="flex items-start space-x-3 cursor-pointer group">
                <input type="checkbox" className="mt-1 w-5 h-5 text-[#087889] border-gray-300 rounded focus:ring-[#087889]" required />
                <span className="text-sm text-gray-600 leading-relaxed font-medium group-hover:text-gray-900 transition-colors">
                  I have read the rules and regulations of SILENT HELP CHARITABLE TRUST available on the website. I agree to all the terms and conditions. If I do not contribute regularly under the rules made by SHCT, then my nominee will not be able to claim the financial help. <span className="text-red-500">*</span>
                </span>
              </label>

              <div className="mt-8 text-center">
                <button type="submit" disabled={isSubmitting} className={`w-full md:w-auto px-16 py-4 bg-[#087889] hover:bg-[#06616e] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                  {isSubmitting ? 'SUBMITTING...' : 'REGISTER NOW'}
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