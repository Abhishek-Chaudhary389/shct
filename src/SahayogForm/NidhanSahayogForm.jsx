import React, { useState } from 'react';

const NidhanSahayogForm = () => {
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [formData, setFormData] = useState({
    applicantName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    deceasedName: '', // मृतक का नाम
    deathDate: '', // निधन की तिथि
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Nidhan Sahayog Data sent:", formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          applicantName: '',
          mobileNumber: '',
          aadhaarNumber: '',
          deceasedName: '',
          deathDate: '',
          address: ''
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-[#087889] to-[#06616e] rounded-t-2xl text-center py-8 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide relative z-10">
            निधन सहयोग आवेदन
          </h1>
          <p className="text-teal-100 mt-2 font-medium relative z-10">
            शोक की इस घड़ी में संस्था आपके साथ है। कृपया सही जानकारी भरें।
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10 border-t-4" style={{ borderColor: logoOrange }}>
          
          {submitSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">आवेदन सफलतापूर्वक जमा हो गया!</h2>
              <p className="text-gray-600 font-medium">आपका डेटा एडमिन पैनल में सुरक्षित रूप से भेज दिया गया है।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आवेदक का नाम (Applicant Name) <span className="text-red-500">*</span></label>
                  <input type="text" name="applicantName" value={formData.applicantName} onChange={handleChange} required placeholder="पूरा नाम दर्ज करें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">मोबाइल नंबर (Mobile No.) <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required maxLength="10" placeholder="10 अंकों का मोबाइल नंबर" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आधार कार्ड नंबर (Aadhaar No.) <span className="text-red-500">*</span></label>
                  <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required maxLength="12" placeholder="12 अंकों का आधार नंबर" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">मृतक का नाम (Deceased Person's Name) <span className="text-red-500">*</span></label>
                  <input type="text" name="deceasedName" value={formData.deceasedName} onChange={handleChange} required placeholder="मृतक का पूरा नाम" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">निधन की तिथि (Date of Death) <span className="text-red-500">*</span></label>
                  <input type="date" name="deathDate" value={formData.deathDate} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white text-gray-600" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">पूरा पता (Full Address) <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" placeholder="ग्राम, पोस्ट, जिला, पिनकोड सहित पूरा पता लिखें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] outline-none transition-all bg-gray-50 focus:bg-white resize-none"></textarea>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 md:px-12 py-3 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center" style={{ backgroundColor: logoOrange }}>
                  {isSubmitting ? "डेटा भेजा जा रहा है..." : "आवेदन सबमिट करें (Submit)"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NidhanSahayogForm;