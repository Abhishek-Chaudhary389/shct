import React, { useState, useEffect } from 'react';
import { getApprovedMembers } from '../services/dataService';

const MemberList = () => {
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [dynamicApproved, setDynamicApproved] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const approved = await getApprovedMembers();
        setDynamicApproved(approved);
        
        // Map members helper
        const mapped = approved.map((item, idx) => ({
          sno: item.sno || String(idx + 109051),
          uniqueId: item.uniqueId || 'N/A',
          name: item.name,
          guardian: item.fatherName || 'N/A',
          occupation: item.occupation || 'Member',
          workAddress: item.address || item.district || 'N/A',
          district: item.district || 'N/A',
          block: item.block || 'N/A',
          status: 'Activate',
          permanentAddress: item.address || 'N/A',
          submitDate: item.joinedDate || new Date().toISOString().split('T')[0]
        }));
        setFilteredMembers(mapped);
      } catch (err) {
        console.error("Error fetching approved members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getMappedMembers = () => {
    return dynamicApproved.map((item, idx) => ({
      sno: item.sno || String(idx + 109051),
      uniqueId: item.uniqueId || 'N/A',
      name: item.name,
      guardian: item.fatherName || 'N/A',
      occupation: item.occupation || 'Member',
      workAddress: item.address || item.district || 'N/A',
      district: item.district || 'N/A',
      block: item.block || 'N/A',
      status: 'Activate',
      permanentAddress: item.address || 'N/A',
      submitDate: item.joinedDate || new Date().toISOString().split('T')[0]
    }));
  };

  const handleApplyFilter = () => {
    let result = getMappedMembers();

    if (filterDistrict) {
      const distQ = filterDistrict.toLowerCase().trim();
      result = result.filter(m => m.district && m.district.toLowerCase().includes(distQ));
    }
    if (filterBlock) {
      const blkQ = filterBlock.toLowerCase().trim();
      result = result.filter(m => m.block && m.block.toLowerCase().includes(blkQ));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.uniqueId && m.uniqueId.toLowerCase().includes(q)) ||
        (m.guardian && m.guardian.toLowerCase().includes(q))
      );
    }
    setFilteredMembers(result);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    let result = getMappedMembers();
    if (filterDistrict) {
      const distQ = filterDistrict.toLowerCase().trim();
      result = result.filter(m => m.district && m.district.toLowerCase().includes(distQ));
    }
    if (filterBlock) {
      const blkQ = filterBlock.toLowerCase().trim();
      result = result.filter(m => m.block && m.block.toLowerCase().includes(blkQ));
    }
    if (val) {
      const q = val.toLowerCase().trim();
      result = result.filter(m => 
        (m.name && m.name.toLowerCase().includes(q)) ||
        (m.uniqueId && m.uniqueId.toLowerCase().includes(q)) ||
        (m.guardian && m.guardian.toLowerCase().includes(q))
      );
    }
    setFilteredMembers(result);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterDistrict('');
    setFilterBlock('');
    setSearchQuery('');
    setFilteredMembers(getMappedMembers());
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalEntries = filteredMembers.length;
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredMembers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* ================= HERO / BANNER SECTION ================= */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Happy Children" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wider drop-shadow-lg">
          Member List
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ================= FILTER SECTION ================= */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
          
          {/* District Input */}
          <div className="w-full md:w-1/3">
            <input 
              type="text"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              placeholder="जिला टाइप करें (e.g. Khalilabad)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-700 font-semibold transition-colors"
            />
          </div>

          {/* Block Input */}
          <div className="w-full md:w-1/3">
            <input 
              type="text"
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              placeholder="ब्लॉक टाइप करें (e.g. Sant Kabir Nagar)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-700 font-semibold transition-colors"
            />
          </div>

          {/* Filter & Reset Buttons */}
          <div className="w-full md:w-auto flex gap-2 w-full md:w-auto">
            <button 
              onClick={handleApplyFilter}
              className="flex-1 md:flex-initial px-8 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-lg shadow transition-colors"
            >
              Filter
            </button>
            <button 
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-lg border transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {/* ================= TABLE CONTROLS (Show Entries & Search) ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          
          {/* Show Entries */}
          <div className="flex items-center text-sm font-medium text-gray-600">
            <span>Show</span>
            <select 
              value={entriesPerPage}
              onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="mx-2 px-2 py-1 border border-gray-300 rounded-md focus:ring-[#087889] outline-none bg-white font-bold"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>entries</span>
          </div>

          {/* Search Box */}
          <div className="flex items-center text-sm font-medium text-gray-600 w-full sm:w-auto">
            <span className="mr-2">Search:</span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="नाम, यूनीक आईडी खोजें..."
              className="w-full sm:w-64 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#087889] outline-none transition-colors"
            />
          </div>

        </div>

        {/* ================= DATA TABLE ================= */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 font-bold text-[#087889] text-lg">
              डेटा लोड हो रहा है... कृपया प्रतीक्षा करें
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
                <thead>
                  <tr className="text-white text-[13px] tracking-wide uppercase" style={{ backgroundColor: logoTeal }}>
                    <th className="p-4 border-r border-teal-600 font-semibold">S NO</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Unique ID</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">नाम</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">पिता/पति का नाम</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">व्यवसाय</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">कार्यरत कार्यालय नाम व पता</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">स्थाई निवासी जिला</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">ब्लॉक</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Status</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">स्थाई पता</th>
                    <th className="p-4 font-semibold">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 font-semibold">
                  {currentRecords.map((member, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-teal-50/50 transition-colors">
                      <td className="p-4 border-r border-gray-100 font-mono text-gray-400">{indexOfFirstRecord + index + 1}</td>
                      <td className="p-4 border-r border-gray-100 font-mono font-bold text-gray-900">{member.uniqueId}</td>
                      <td className="p-4 border-r border-gray-100 font-bold text-gray-900">{member.name}</td>
                      <td className="p-4 border-r border-gray-100">{member.guardian}</td>
                      <td className="p-4 border-r border-gray-100">{member.occupation}</td>
                      <td className="p-4 border-r border-gray-100 whitespace-normal min-w-[200px]">{member.workAddress}</td>
                      <td className="p-4 border-r border-gray-100">{member.district}</td>
                      <td className="p-4 border-r border-gray-100 uppercase">{member.block}</td>
                      <td className="p-4 border-r border-gray-100 font-bold text-green-600">{member.status}</td>
                      <td className="p-4 border-r border-gray-100 whitespace-normal min-w-[250px]">{member.permanentAddress}</td>
                      <td className="p-4 whitespace-normal w-[100px] text-gray-500 font-medium">{member.submitDate}</td>
                    </tr>
                  ))}
                  {currentRecords.length === 0 && (
                    <tr>
                      <td colSpan="11" className="text-center py-12 text-gray-500 font-bold">
                        कोई सदस्य नहीं मिला
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Info */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center font-semibold">
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
                    className={`px-3 py-1 rounded-md font-medium ${currentPage === num ? 'bg-[#087889] text-white' : 'border border-gray-300 hover:bg-gray-50'}`}
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

      </div>
    </div>
  );
};

export default MemberList;