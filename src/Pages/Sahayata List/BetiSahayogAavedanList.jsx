import React, { useState, useEffect } from 'react';
import { getBetiSahayogList } from '../../services/dataService';
import bannerImg from '../../assets/ngo1.jpg';

const BetiSahayogAavedanList = () => {
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataList(await getBetiSahayogList());
    };
    fetchData();
  }, []);

  const filteredData = dataList.filter(item => 
    item.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.uniqueId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.daughterName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white font-sans pb-12">
      {/* HEADER BANNER */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundColor: '#333', backgroundBlendMode: 'overlay' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white z-10 tracking-wider">
          Beti Vivah Aavedan Suchi
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* RED NOTES */}
        <div className="text-red-600 text-center font-medium text-[15px] space-y-3 mb-10">
          <p>नोट- 1. बेटी विवाह आवेदन सूची में वैधानिकता जांच आख्या भौतिक सत्यापन के अधीन है। भौतिक सत्यापन के उपरांत ही वैधानिकता पर अंतिम निर्णय लिया जाएगा।</p>
          <p>2. बेटी विवाह शगुन योजना में ऑनलाइन आवेदन के उपरांत आवेदक अपने जिले के FRCT जिलाध्यक्ष को फोन करके सामान्य सूचना जरूर दें</p>
        </div>

        {/* FILTERS SECTION */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <select className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-48 outline-none focus:border-blue-500 text-gray-600">
              <option>Select District</option>
            </select>
            <select className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-48 outline-none focus:border-blue-500 text-gray-600">
              <option>Select Block</option>
            </select>
            <button className="bg-[#0066ff] hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium transition-colors">
              Filter
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>Show</span>
            <select className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Search:</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full md:w-64"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-200">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-white text-gray-800 text-[13px] font-bold border-b-2 border-gray-200">
                <th className="p-4 border-r border-gray-100">S<br/>NO</th>
                <th className="p-4 border-r border-gray-100 whitespace-nowrap">Unique ID</th>
                <th className="p-4 border-r border-gray-100">नाम</th>
                <th className="p-4 border-r border-gray-100">बेटी का नाम</th>
                <th className="p-4 border-r border-gray-100">विवाह<br/>तिथि</th>
                <th className="p-4 border-r border-gray-100 text-center">विवाह कार्ड</th>
                <th className="p-4 border-r border-gray-100">स्थाई निवासी<br/>जिला</th>
                <th className="p-4 border-r border-gray-100">ब्लॉक</th>
                <th className="p-4 border-r border-gray-100">Submission<br/>Date</th>
                <th className="p-4 border-r border-gray-100">Registration<br/>Date</th>
                <th className="p-4 border-r border-gray-100">Action</th>
                <th className="p-4 border-r border-gray-100">Reason</th>
                <th className="p-4">Aavedan<br/>Status</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-gray-700">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const dateObj = new Date(item.submittedAt || Date.now());
                  // Format: YYYY-MM-DD HH:MM:SS
                  const yyyy = dateObj.getFullYear();
                  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                  const dd = String(dateObj.getDate()).padStart(2, '0');
                  const time = dateObj.toTimeString().split(' ')[0];
                  const submissionDate = `${yyyy}-${mm}-${dd}\n${time}`;
                  const registrationDate = `${yyyy}-${mm}-${dd}`;
                  
                  const statusText = item.status === 'APPROVED' ? 'Approved' : item.status === 'REJECTED' ? 'Rejected' : 'Pending';
                  
                  return (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 border-r border-gray-100 bg-gray-50/50">{index + 1}</td>
                      <td className="p-4 border-r border-gray-100 bg-gray-50/50">{item.uniqueId?.replace('UID-', '090') || 'N/A'}</td>
                      <td className="p-4 border-r border-gray-100">{item.applicantName}</td>
                      <td className="p-4 border-r border-gray-100">{item.daughterName}</td>
                      <td className="p-4 border-r border-gray-100 whitespace-pre-wrap">{item.marriageDate}</td>
                      <td className="p-4 border-r border-gray-100 text-center text-gray-300">
                        {item.documentImage ? (
                          <button 
                            onClick={() => setSelectedImage(item.documentImage)}
                            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                          >
                            👁️ कार्ड देखें
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">उपलब्ध नहीं</span>
                        )}
                      </td>
                      <td className="p-4 border-r border-gray-100">{item.district || 'N/A'}</td>
                      <td className="p-4 border-r border-gray-100">{item.block || 'N/A'}</td>
                      <td className="p-4 border-r border-gray-100 whitespace-pre-wrap">{submissionDate}</td>
                      <td className="p-4 border-r border-gray-100 whitespace-pre-wrap">{registrationDate}</td>
                      <td className="p-4 border-r border-gray-100">{statusText}</td>
                      <td className="p-4 border-r border-gray-100"></td>
                      <td className="p-4"></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="13" className="p-8 text-center text-gray-500 text-base">No data available in table</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📄</span> दस्तावेज / कार्ड
              </h4>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="h-[400px] w-full bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 p-2">
              <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded-xl" />
            </div>
            <div className="mt-6 text-right">
              <button 
                onClick={() => setSelectedImage(null)}
                className="px-6 py-3 bg-[#0066ff] hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default BetiSahayogAavedanList;
