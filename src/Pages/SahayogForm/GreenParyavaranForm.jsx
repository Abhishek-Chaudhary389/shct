import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addGreenParyavaran } from '../../services/dataService';
import { compressImage } from '../../utils/imageCompressor';
import { LeafIcon, CheckCircleIcon } from '../../components/common/Icons';

const GreenParyavaranForm = () => {
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [formData, setFormData] = useState({
    applicantName: '',
    mobileNumber: '',
    aadhaarNumber: '',
    treesPlanted: '', // लगाए गए पौधों की संख्या
    plantationDate: '', // पौधारोपण की तिथि
    district: '',
    block: '',
    address: '',
    documentImage: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const mockUniqueId = `UID-${Math.floor(10000 + Math.random() * 90000)}`;
    const submissionData = { ...formData, uniqueId: mockUniqueId };

    try {
      await addGreenParyavaran(submissionData);
      console.log("Green Paryavaran Data sent:", submissionData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({
          applicantName: '',
          mobileNumber: '',
          aadhaarNumber: '',
          treesPlanted: '',
          plantationDate: '',
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
        
        {/* HEADER SECTION */}
        <div className="bg-gradient-to-r from-[#22c55e] to-[#15803d] rounded-t-2xl text-center py-8 shadow-md relative overflow-hidden">
          {/* Note: I used Green gradient here for environment theme, but kept buttons in your brand colors */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide relative z-10">
            ग्रीन पर्यावरण अभियान
          </h1>
          <p className="text-green-100 mt-2 font-medium relative z-10 flex items-center justify-center gap-1.5">
            प्रकृति को बचाने की आपकी पहल का हम स्वागत करते हैं। <LeafIcon className="w-4 h-4 text-green-200 inline" />
          </p>
        </div>

        {/* FORM SECTION */}
        <div className="bg-white rounded-b-2xl shadow-xl p-6 md:p-10 border-t-4 border-[#22c55e]">
          
          {submitSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <div className="flex justify-center mb-4">
                <CheckCircleIcon className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">आवेदन सफलतापूर्वक जमा हो गया!</h2>
              <p className="text-gray-600 font-medium">आपका डेटा एडमिन पैनल में सुरक्षित रूप से भेज दिया गया है।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आवेदक का नाम (Applicant Name) <span className="text-red-500">*</span></label>
                  <input type="text" name="applicantName" value={formData.applicantName} onChange={handleChange} required placeholder="पूरा नाम दर्ज करें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">मोबाइल नंबर (Mobile No.) <span className="text-red-500">*</span></label>
                  <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required maxLength="10" placeholder="10 अंकों का मोबाइल नंबर" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">आधार कार्ड नंबर (Aadhaar No.) <span className="text-red-500">*</span></label>
                  <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} required maxLength="12" placeholder="12 अंकों का आधार नंबर" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">पौधों की संख्या (No. of Trees) <span className="text-red-500">*</span></label>
                  <input type="number" name="treesPlanted" value={formData.treesPlanted} onChange={handleChange} required placeholder="लगाए गए पौधों की संख्या" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">पौधारोपण की तिथि (Plantation Date) <span className="text-red-500">*</span></label>
                  <input type="date" name="plantationDate" value={formData.plantationDate} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white text-gray-600" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">स्थाई निवासी जिला (District) <span className="text-red-500">*</span></label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required placeholder="अपने जिले का नाम लिखें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">ब्लॉक (Block) <span className="text-red-500">*</span></label>
                  <input type="text" name="block" value={formData.block} onChange={handleChange} required placeholder="अपने ब्लॉक का नाम लिखें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white" />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">स्थान / पूरा पता (Location/Address) <span className="text-red-500">*</span></label>
                  <textarea name="address" value={formData.address} onChange={handleChange} required rows="3" placeholder="पौधारोपण का स्थान और पूरा पता लिखें" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#22c55e] outline-none transition-all bg-gray-50 focus:bg-white resize-none"></textarea>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">पौधारोपण की फोटो (Plantation Photo)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-white rounded-md font-medium text-[#22c55e] hover:text-[#15803d] focus-within:outline-none px-2 py-1">
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

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="w-full md:w-auto px-8 md:px-12 py-3 rounded-lg text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center" style={{ backgroundColor: logoTeal }}>
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

export default GreenParyavaranForm;