import React, { useState, useEffect } from 'react';
import { getNidhanSahayogList } from '../../services/dataService';
import bannerImg from '../../assets/ngo1.jpg';

const NidhanSahayogAavedanList = () => {
  const [dataList, setDataList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination states
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNidhanSahayogList();
        setDataList(data);
      } catch (err) {
        console.error("Error fetching Nidhan Sahyog List:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFilteredData = () => {
    let result = [...dataList];
    if (filterDistrict) {
      const distQ = filterDistrict.toLowerCase().trim();
      result = result.filter(item => item.district && item.district.toLowerCase().includes(distQ));
    }
    if (filterBlock) {
      const blkQ = filterBlock.toLowerCase().trim();
      result = result.filter(item => item.block && item.block.toLowerCase().includes(blkQ));
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(item => 
        (item.applicantName && item.applicantName.toLowerCase().includes(q)) ||
        (item.uniqueId && item.uniqueId.toLowerCase().includes(q)) ||
        (item.deceasedName && item.deceasedName.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const finalFiltered = getFilteredData();

  // Pagination Logic
  const totalEntries = finalFiltered.length;
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = finalFiltered.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleApplyFilter = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterDistrict('');
    setFilterBlock('');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white font-sans pb-12">
      {/* HEADER BANNER */}
      <div 
        className="relative w-full h-[300px] bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${bannerImg})`, backgroundColor: '#333', backgroundBlendMode: 'overlay' }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white z-10 tracking-wider">
          Death Aavedan Suchi
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        
        {/* RED NOTES */}
        <div className="text-red-600 text-center font-medium text-[15px] space-y-3 mb-10">
          <p>नोट- 1. मृत्यु आवेदन सूची में वैधानिकता जांच आख्या भौतिक सत्यापन के अधीन है। भौतिक सत्यापन के उपरांत ही वैधानिकता पर अंतिम निर्णय लिया जाएगा।</p>
          <p>2. असामयिक निधन पर आर्थिक मदद योजना में ऑनलाइन आवेदन के उपरांत आवेदक अपने जिले के FRCT जिलाध्यक्ष को phone करके सामान्य सूचना जरूर दें</p>
        </div>

        {/* FILTERS SECTION */}
        <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto flex-1">
            
            {/* District Input */}
            <div className="w-full md:w-48">
              <input 
                type="text"
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                placeholder="जिला टाइप करें"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-700 font-semibold"
              />
            </div>

            {/* Block Input */}
            <div className="w-full md:w-48">
              <input 
                type="text"
                value={filterBlock}
                onChange={(e) => setFilterBlock(e.target.value)}
                placeholder="ब्लॉक टाइप करें"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500 text-gray-700 font-semibold"
              />
            </div>

            <button 
              onClick={handleApplyFilter}
              className="bg-[#0066ff] hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-bold transition-colors"
            >
              Filter
            </button>
            <button 
              onClick={handleResetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded text-sm font-bold border transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 font-bold">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 outline-none text-gray-700"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 font-bold">Search:</span>
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              placeholder="खोजें..."
              className="border border-gray-300 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full md:w-64 font-medium"
            />
          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          {loading ? (
            <div className="text-center py-20 font-bold text-[#087889] text-lg">
              डेटा लोड हो रहा है... कृपया प्रतीक्षा करें
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-150 text-gray-800 text-[13px] font-extrabold border-b-2 border-gray-200 uppercase">
                  <th className="p-4 border-r border-gray-150">S NO</th>
                  <th className="p-4 border-r border-gray-150 whitespace-nowrap">Unique ID</th>
                  <th className="p-4 border-r border-gray-150">नाम</th>
                  <th className="p-4 border-r border-gray-150">मृत्यु तिथि</th>
                  <th className="p-4 border-r border-gray-150 text-center">मृत्यु प्रमाण पत्र</th>
                  <th className="p-4 border-r border-gray-150">स्थाई निवासी जिला</th>
                  <th className="p-4 border-r border-gray-150">ब्लॉक</th>
                  <th className="p-4 border-r border-gray-150">Submission Date</th>
                  <th className="p-4 border-r border-gray-150">Registration Date</th>
                  <th className="p-4 border-r border-gray-150">Status</th>
                </tr>
              </thead>
              <tbody className="text-[13px] text-gray-700 font-semibold">
                {currentRecords.length > 0 ? (
                  currentRecords.map((item, index) => {
                    const dateObj = new Date(item.submittedAt || Date.now());
                    const yyyy = dateObj.getFullYear();
                    const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const dd = String(dateObj.getDate()).padStart(2, '0');
                    const time = dateObj.toTimeString().split(' ')[0];
                    const submissionDate = `${yyyy}-${mm}-${dd}\n${time}`;
                    const registrationDate = `${yyyy}-${mm}-${dd}`;
                    
                    const statusText = item.status === 'APPROVED' ? 'Approved' : item.status === 'REJECTED' ? 'Rejected' : 'Pending';
                    
                    return (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                        <td className="p-4 border-r border-gray-100 bg-gray-50/50 font-mono text-gray-400">{indexOfFirstRecord + index + 1}</td>
                        <td className="p-4 border-r border-gray-100 bg-gray-50/50 font-mono font-bold text-gray-900">{item.uniqueId?.replace('UID-', '697') || 'N/A'}</td>
                        <td className="p-4 border-r border-gray-100 font-bold text-gray-900">{item.applicantName}</td>
                        <td className="p-4 border-r border-gray-100 text-red-700 font-bold">{item.deathDate}</td>
                        <td className="p-4 border-r border-gray-100 text-center text-gray-300">
                          {item.documentImage ? (
                            <button 
                              onClick={() => setSelectedImage(item.documentImage)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                            >
                              👁️ कार्ड देखें
                            </button>
                          ) : (
                            <span className="text-gray-400 text-xs font-medium">उपलब्ध नहीं</span>
                          )}
                        </td>
                        <td className="p-4 border-r border-gray-100">{item.district || 'N/A'}</td>
                        <td className="p-4 border-r border-gray-100">{item.block || 'N/A'}</td>
                        <td className="p-4 border-r border-gray-100 whitespace-pre-wrap font-mono text-gray-500">{submissionDate}</td>
                        <td className="p-4 border-r border-gray-100 whitespace-pre-wrap font-mono text-gray-500">{registrationDate}</td>
                        <td className="p-4 border-r border-gray-100 text-center">
                          {item.status === 'APPROVED' ? (
                            <span className="px-2.5 py-1 bg-green-150 text-green-700 rounded-full font-bold text-xs border border-green-200"> स्वीकृत </span>
                          ) : item.status === 'REJECTED' ? (
                            <span className="px-2.5 py-1 bg-red-150 text-red-700 rounded-full font-bold text-xs border border-red-200"> अस्वीकृत </span>
                          ) : (
                            <span className="px-2.5 py-1 bg-amber-150 text-amber-700 rounded-full font-bold text-xs border border-amber-200"> पेंडिंग </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="p-8 text-center text-gray-500 text-base font-bold">No data available in table</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 text-sm text-gray-500 flex justify-between items-center font-semibold mt-4">
            <span>Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalEntries)} of {totalEntries} entries</span>
            <div className="flex gap-1">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => paginate(num)}
                  className={`px-3 py-1 rounded-md font-medium ${currentPage === num ? 'bg-[#0066ff] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
                >
                  {num}
                </button>
              ))}
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
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

export default NidhanSahayogAavedanList;
