import React, { useState, useEffect } from 'react';
import { getNidhanSahyogReceipts, getApprovedMembers } from '../../services/dataService';

const AllNidhanSahyogList = () => {
  const [receipts, setReceipts] = useState([]);
  const [filteredReceipts, setFilteredReceipts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const approvedMembers = await getApprovedMembers();
        const data = await getNidhanSahyogReceipts();
        
        // Filter only approved ones and backfill district/block if missing
        const approved = data.filter(r => r.status === 'APPROVED').map(r => {
          let dist = r.donorDistrict;
          let blk = r.donorBlock;
          
          if (!dist || !blk) {
            const member = approvedMembers.find(m => m.uniqueId === r.donorUniqueId);
            if (member) {
              dist = dist || member.district;
              blk = blk || member.block;
            }
          }
          
          return {
            ...r,
            donorDistrict: dist || 'N/A',
            donorBlock: blk || 'N/A'
          };
        });

        setReceipts(approved);
        setFilteredReceipts(approved);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Filter Action
  const handleApplyFilter = () => {
    let result = [...receipts];

    if (selectedDistrict) {
      const distQuery = selectedDistrict.toLowerCase().trim();
      result = result.filter(r => r.donorDistrict && r.donorDistrict.toLowerCase().includes(distQuery));
    }
    if (selectedBlock) {
      const blkQuery = selectedBlock.toLowerCase().trim();
      result = result.filter(r => r.donorBlock && r.donorBlock.toLowerCase().includes(blkQuery));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(r => 
        (r.donorName && r.donorName.toLowerCase().includes(q)) ||
        (r.donorUniqueId && r.donorUniqueId.toLowerCase().includes(q)) ||
        (r.beneficiaryName && r.beneficiaryName.toLowerCase().includes(q))
      );
    }

    setFilteredReceipts(result);
    setCurrentPage(1);
  };

  // Quick live search handler
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    
    let result = [...receipts];
    if (selectedDistrict) {
      const distQuery = selectedDistrict.toLowerCase().trim();
      result = result.filter(r => r.donorDistrict && r.donorDistrict.toLowerCase().includes(distQuery));
    }
    if (selectedBlock) {
      const blkQuery = selectedBlock.toLowerCase().trim();
      result = result.filter(r => r.donorBlock && r.donorBlock.toLowerCase().includes(blkQuery));
    }
    if (val) {
      const q = val.toLowerCase().trim();
      result = result.filter(r => 
        (r.donorName && r.donorName.toLowerCase().includes(q)) ||
        (r.donorUniqueId && r.donorUniqueId.toLowerCase().includes(q)) ||
        (r.beneficiaryName && r.beneficiaryName.toLowerCase().includes(q))
      );
    }
    setFilteredReceipts(result);
    setCurrentPage(1);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedDistrict('');
    setSelectedBlock('');
    setSearchQuery('');
    setFilteredReceipts(receipts);
    setCurrentPage(1);
  };

  // Compute stats
  const totalDonationSum = receipts.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalCollection = totalDonationSum;

  // Pagination Logic
  const totalEntries = filteredReceipts.length;
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentRecords = filteredReceipts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(totalEntries / entriesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="w-full bg-gray-50 pb-16 font-sans">
      
      {/* Banner Section */}
      <div 
        className="w-full bg-cover bg-center py-20 relative flex items-center justify-center"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop")' 
        }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide uppercase">
            All Nidhan Sahyog List
          </h1>
          <p className="text-orange-400 font-bold mt-2 tracking-widest text-xs md:text-sm uppercase">
            Silent Help Charitable Trust
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-10">
        
        {/* Total Collection Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-1">Total Collection (कुल सहयोग राशि)</span>
          <h2 className="text-3xl md:text-4xl font-black text-green-600">
            Rs. {totalCollection.toLocaleString('en-IN')}
          </h2>
        </div>

        {/* Filter Toolbar Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-150 p-6 mb-8 text-sm font-semibold text-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* District Input */}
            <div>
              <label className="block text-gray-600 mb-1.5 font-bold">Select District</label>
              <input
                type="text"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                placeholder="ज़िला टाइप करें (e.g. Mathura)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087889] text-gray-700 font-semibold"
              />
            </div>

            {/* Block Input */}
            <div>
              <label className="block text-gray-600 mb-1.5 font-bold">Select Block</label>
              <input
                type="text"
                value={selectedBlock}
                onChange={(e) => setSelectedBlock(e.target.value)}
                placeholder="ब्लॉक टाइप करें (e.g. GOVERDHAN)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#087889] text-gray-700 font-semibold"
              />
            </div>

            {/* Filter and Reset Buttons */}
            <div className="flex gap-2.5 md:col-span-2">
              <button
                onClick={handleApplyFilter}
                className="flex-1 py-3 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl transition-all shadow-sm"
              >
                Filter
              </button>
              <button
                onClick={handleResetFilters}
                className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-extrabold rounded-xl transition-all border"
              >
                Reset
              </button>
            </div>

          </div>
        </div>

        {/* List Table Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6">
          
          {/* Table Header controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-sm font-semibold text-gray-600">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="px-2 py-1.5 bg-gray-50 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#087889] font-bold text-gray-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <span>Search:</span>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="नाम, यूनीक आईडी खोजें..."
                className="w-full md:w-64 px-3.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium text-gray-700"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20 font-bold text-[#087889] text-lg">
              डेटा लोड हो रहा है... कृपया प्रतीक्षा करें
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-150 rounded-2xl">
              <table className="w-full text-left border-collapse min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-extrabold uppercase text-[11px] tracking-wider">
                    <th className="py-4 px-5">S NO</th>
                    <th className="py-4 px-5">Name</th>
                    <th className="py-4 px-5">Unique ID</th>
                    <th className="py-4 px-5">Amount</th>
                    <th className="py-4 px-5">Donation To Member</th>
                    <th className="py-4 px-5">District</th>
                    <th className="py-4 px-5">Block</th>
                    <th className="py-4 px-5">Sahyog Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 font-semibold">
                  {currentRecords.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="py-3.5 px-5 text-gray-400 font-mono">
                        {indexOfFirstRecord + idx + 1}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-gray-900">
                        {item.donorName}
                      </td>
                      <td className="py-3.5 px-5 font-mono text-gray-500">
                        {item.donorUniqueId}
                      </td>
                      <td className="py-3.5 px-5 text-green-700 font-black">
                        ₹ {item.amount}
                      </td>
                      <td className="py-3.5 px-5 font-bold text-[#087889]">
                        {item.beneficiaryName}
                      </td>
                      <td className="py-3.5 px-5">
                        {item.donorDistrict}
                      </td>
                      <td className="py-3.5 px-5">
                        {item.donorBlock}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-gray-500">
                        {item.sahyogDate || item.date || (item.submittedAt ? item.submittedAt.slice(0, 10) : '2025-04-10')}
                      </td>
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
            <div className="flex justify-between items-center mt-6 text-sm font-semibold text-gray-500">
              <div>
                Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalEntries)} of {totalEntries} entries
              </div>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => paginate(currentPage - 1)}
                  className="px-3.5 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => paginate(num)}
                    className={`px-3 py-1.5 border rounded-lg ${currentPage === num ? 'bg-[#087889] text-white border-[#087889]' : 'hover:bg-gray-100'}`}
                  >
                    {num}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => paginate(currentPage + 1)}
                  className="px-3.5 py-1.5 border rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
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

export default AllNidhanSahyogList;
