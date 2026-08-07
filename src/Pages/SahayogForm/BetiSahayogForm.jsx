import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addBetiSahayog } from '../../services/dataService';
import { compressImage } from '../../utils/imageCompressor';

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
    district: '',
    block: '',
    address: '',
    documentImage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file);
        setFormData({ ...formData, documentImage: compressedBase64 });
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mockUniqueId = `UID-${Math.floor(10000 + Math.random() * 90000)}`;
    const submissionData = { ...formData, uniqueId: mockUniqueId };

    try {
      await addBetiSahayog(submissionData);
      console.log("Data sent to Admin Panel:", submissionData);
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
          district: '',
          block: '',
          address: '',
          documentImage: ''
        });
      }, 3000);
    } catch(e) {
      console.error(e);
      setIsSubmitting(false);
      alert('Error submitting form');
    }
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

                {/* District */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">स्थाई निवासी जिला (District) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    placeholder="अपने जिले का नाम लिखें"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Block */}
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">ब्लॉक (Block) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="block"
                    value={formData.block}
                    onChange={handleChange}
                    required
                    placeholder="अपने ब्लॉक का नाम लिखें"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
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
                    placeholder="ग्राम, पोस्ट, पिनकोड सहित पूरा पता लिखें"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#087889] focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                  ></textarea>
                </div>

                {/* Document Upload */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">विवाह कार्ड / प्रमाण (Marriage Card Image)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#087889] hover:text-[#06616e] focus-within:outline-none px-2 py-1">
                          <span>फाइल चुनें (Upload a file)</span>
                          <input name="documentImage" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,.pdf" />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">
                        {formData.documentImage ? (
                          <span className="text-green-600 font-bold">Image Selected (Preview Ready)</span>
                        ) : "PNG, JPG up to 5MB"}
                      </p>
                    </div>
                  </div>
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