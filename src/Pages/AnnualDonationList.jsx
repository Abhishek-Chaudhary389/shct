import React, { useState, useEffect } from 'react';
import { getAnnualDonations } from '../services/dataService';

const AnnualDonationList = () => {
  const logoTeal = "#087889";

  const [dynamicDonations, setDynamicDonations] = useState([]);
  const [filteredDonations, setFilteredDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterBlock, setFilterBlock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const donations = await getAnnualDonations();
        setDynamicDonations(donations);
        setFilteredDonations(donations);
      } catch (err) {
        console.error("Error fetching annual donations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApplyFilter = () => {
    let result = [...dynamicDonations];

    if (filterDistrict) {
      const distQ = filterDistrict.toLowerCase().trim();
      result = result.filter(d => d.district && d.district.toLowerCase().includes(distQ));
    }
    if (filterBlock) {
      const blkQ = filterBlock.toLowerCase().trim();
      result = result.filter(d => d.block && d.block.toLowerCase().includes(blkQ));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.uniqueId && d.uniqueId.toLowerCase().includes(q))
      );
    }
    setFilteredDonations(result);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    let result = [...dynamicDonations];
    if (filterDistrict) {
      const distQ = filterDistrict.toLowerCase().trim();
      result = result.filter(d => d.district && d.district.toLowerCase().includes(distQ));
    }
    if (filterBlock) {
      const blkQ = filterBlock.toLowerCase().trim();
      result = result.filter(d => d.block && d.block.toLowerCase().includes(blkQ));
    }
    if (val) {
      const q = val.toLowerCase().trim();
      result = result.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.uniqueId && d.uniqueId.toLowerCase().includes(q))
      );
    }
    setFilteredDonations(result);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilterDistrict('');
    setFilterBlock('');
    setSearchQuery('');
    setFilteredDonations(dynamicDonations);
    setCurrentPage(1);
  };

  // Pagination Logic
  const totalEntries = filteredDonations.length;
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredDonations.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* BANNER SECTION */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-lg text-center px-4">
          Annual Donation List
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* FILTER SECTION */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
          
          {/* District Input */}
          <div className="w-full md:w-1/3">
            <input 
              type="text"
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              placeholder="जिला टाइप करें (e.g. Ballia)"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-700 font-semibold transition-colors"
            />
          </div>

          {/* Block Input */}
          <div className="w-full md:w-1/3">
            <input 
              type="text"
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              placeholder="ब्लॉक टाइप करें (e.g. Pahari)"
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

        {/* TABLE CONTROLS */}
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

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-20 font-bold text-[#087889] text-lg">
              डेटा लोड हो रहा है... कृपया प्रतीक्षा करें
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
                <thead>
                  <tr className="text-white text-[13px] tracking-wide uppercase" style={{ backgroundColor: logoTeal }}>
                    <th className="p-4 border-r border-teal-600 font-semibold">S NO</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Name</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Unique ID</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Amount</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Donation to trust</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">District</th>
                    <th className="p-4 border-r border-teal-600 font-semibold">Block</th>
                    <th className="p-4 font-semibold">Sahyog Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700 font-semibold">
                  {currentRecords.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-teal-50/50 transition-colors">
                      <td className="p-4 border-r border-gray-100 font-mono text-gray-400">{indexOfFirstRecord + index + 1}</td>
                      <td className="p-4 border-r border-gray-100 font-bold text-gray-900">{item.name}</td>
                      <td className="p-4 border-r border-gray-100 font-mono text-gray-900">{item.uniqueId}</td>
                      <td className="p-4 border-r border-gray-100 font-bold text-green-600">₹{item.amount}</td>
                      <td className="p-4 border-r border-gray-100 font-medium text-gray-800">{item.trustName}</td>
                      <td className="p-4 border-r border-gray-100">{item.district || 'N/A'}</td>
                      <td className="p-4 border-r border-gray-100 uppercase">{item.block || 'N/A'}</td>
                      <td className="p-4 text-gray-500 font-medium">{item.sahyogDate}</td>
                    </tr>
                  ))}
                  {currentRecords.length === 0 && (
                    <tr>
                      <td colSpan="8" className="text-center py-12 text-gray-500 font-bold">
                        कोई रिकॉर्ड नहीं मिला
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination Controls */}
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

export default AnnualDonationList;