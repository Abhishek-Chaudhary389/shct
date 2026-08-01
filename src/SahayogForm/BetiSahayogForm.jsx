 import React, { useState } from 'react';

const BetiSahayogForm = () => {
  // Theme Colors
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  // Form State (बिना Receipt File के)
  const [formData, setFormData] = useState({
    applicantName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    daughterName: '',
    marriageDate: '',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // यहाँ हम API कॉल (Backend) का नाटक (Simulate) कर रहे हैं
    setTimeout(() => {
      console.log("Data sent to Admin Panel:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // 3 सेकंड बाद फॉर्म को रीसेट कर देंगे
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          applicantName: '',
          mobileNumber: '',
          aadhaarNumber: '',
          daughterName: '',
          marriageDate: '',
          address: ''
        });
      }, 3000);
    }, 1500); // 1.5 सेकंड का लोडिंग इफ़ेक्ट
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER SECTION ================= */}
        <div className="bg-gradient-to-r from-[#087889] to-[#06616e] rounded-t-2xl text-center py-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide relative z-10">
            बेटी विवाह सहयोग आवेदन
          </h1>
          <p className="text-teal-100 mt-2 font-medium relative z-10">
            कृपया नीचे दी गई सभी जानकारी सही-सही भरें
          </p>
        </div>

        {/* ================= FORM SECTION ================= */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10 border-t-4" style={{ borderColor: logoOrange }}>
          
          {submitSuccess ? (
            // Success Message
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">आवेदन सफलतापूर्वक जमा हो गया!</h2>
              <p className="text-gray-600 font-medium">आपका डेटा एडमिन पैनल में सुरक्षित रूप से भेज दिया गया है।</p>
            </div>
          ) : (
            // The Form
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Applicant Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आवेदक का नाम (Applicant Name) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="applicantName"
                    value={formData.applicantName}
                    onChange={handleChange}
                    required
                    placeholder="पूरा नाम दर्ज करें"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">मोबाइल नंबर (Mobile No.) <span className="text-red-500">*</span></label>
                  <input 
                    type="tel" 
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    required
                    maxLength="10"
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Aadhaar Number */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आधार कार्ड नंबर (Aadhaar No.) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    required
                    maxLength="12"
                    placeholder="12 अंकों का आधार नंबर"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Daughter's Name */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">बेटी का नाम (Daughter's Name) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="daughterName"
                    value={formData.daughterName}
                    onChange={handleChange}
                    required
                    placeholder="बेटी का पूरा नाम"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Marriage Date */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">विवाह की तिथि (Marriage Date) <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    name="marriageDate"
                    value={formData.marriageDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white text-gray-600"
                  />
                </div>

                {/* Address (Full Width) */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">पूरा पता (Full Address) <span className="text-red-500">*</span></label>
                  <textarea 
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows="3"
                    placeholder="ग्राम, पोस्ट, जिला, पिनकोड सहित पूरा पता लिखें"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full md:w-auto px-8 md:px-12 py-3 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center"
                  style={{ backgroundColor: logoOrange }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      डेटा भेजा जा रहा है...
                    </span>
                  ) : "आवेदन सबमिट करें (Submit)"}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default BetiSahayogForm;