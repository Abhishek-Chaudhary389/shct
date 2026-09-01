import React, { useState, useEffect } from 'react';
import { getNidhanSahyogReceipts, getApprovedMembers, getNidhanSahayogList } from '../../services/dataService';

const NidhanAccountHolderWiseList = () => {
  const [receipts, setReceipts] = useState([]);
  const [accountHolders, setAccountHolders] = useState([]);
  const [filteredHolders, setFilteredHolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drilldown Selected Account Holder
  const [selectedHolder, setSelectedHolder] = useState(null);
  const [holderDonors, setHolderDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);

  // Filter States for Main View
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedBlock, setSelectedBlock] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter States for Detail View
  const [detailDistrict, setDetailDistrict] = useState('');
  const [detailBlock, setDetailBlock] = useState('');
  const [detailSearch, setDetailSearch] = useState('');
  const [detailEntriesPerPage, setDetailEntriesPerPage] = useState(10);
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const approvedMembers = await getApprovedMembers();
        const rawReceipts = await getNidhanSahyogReceipts();
        const applications = await getNidhanSahayogList();

        // 1. Process Approved Receipts
        const approvedReceipts = rawReceipts
          .filter(r => r.status === 'APPROVED')
          .map(r => {
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
              donorBlock: blk || 'N/A',
              amount: Number(r.amount) || 0,
              beneficiaryName: (r.beneficiaryName || r.donationToMember || r.deceasedName || 'दिवंगत सदस्य परिवार').trim(),
              sahyogDate: r.sahyogDate || (r.submittedAt ? r.submittedAt.slice(0, 10) : '2025-04-10')
            };
          });

        setReceipts(approvedReceipts);

        // 2. Group by Account Holder (Deceased Member Family)
        const holderMap = {};

        // Populate from applications
        applications.forEach(app => {
          const name = (app.deceasedName || app.applicantName || app.name || '').trim();
          if (name) {
            holderMap[name] = {
              name: name,
              district: app.district || 'संत कबीर नगर',
              block: app.block || 'खलीलाबाद',
              nidhanDate: app.deathDate || app.date || '2025-04-10',
              perMemberAmount: Number(app.recommendedAmount) || 50,
              totalCollection: 0,
              donorsCount: 0
            };
          }
        });

        // Add from receipts
        approvedReceipts.forEach(r => {
          const bName = r.beneficiaryName;
          if (!holderMap[bName]) {
            holderMap[bName] = {
              name: bName,
              district: r.beneficiaryDistrict || r.donorDistrict || 'संत कबीर नगर',
              block: r.beneficiaryBlock || r.donorBlock || 'खलीलाबाद',
              nidhanDate: r.nidhanDate || r.deathDate || '2025-04-10',
              perMemberAmount: r.amount || 50,
              totalCollection: 0,
              donorsCount: 0
            };
          }
          holderMap[bName].totalCollection += r.amount;
          holderMap[bName].donorsCount += 1;
        });

        const list = Object.values(holderMap);
        setAccountHolders(list);
        setFilteredHolders(list);
      } catch (err) {
        console.error("Error loading nidhan account holder data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter Main List
  const handleApplyFilter = () => {
    let result = [...accountHolders];
    if (selectedDistrict) {
      const q = selectedDistrict.toLowerCase().trim();
      result = result.filter(h => h.district && h.district.toLowerCase().includes(q));
    }
    if (selectedBlock) {
      const q = selectedBlock.toLowerCase().trim();
      result = result.filter(h => h.block && h.block.toLowerCase().includes(q));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(h => h.name && h.name.toLowerCase().includes(q));
    }
    setFilteredHolders(result);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    let result = [...accountHolders];
    if (selectedDistrict) {
      const q = selectedDistrict.toLowerCase().trim();
      result = result.filter(h => h.district && h.district.toLowerCase().includes(q));
    }
    if (selectedBlock) {
      const q = selectedBlock.toLowerCase().trim();
      result = result.filter(h => h.block && h.block.toLowerCase().includes(q));
    }
    if (val) {
      const q = val.toLowerCase().trim();
      result = result.filter(h => h.name && h.name.toLowerCase().includes(q));
    }
    setFilteredHolders(result);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSelectedDistrict('');
    setSelectedBlock('');
    setSearchQuery('');
    setFilteredHolders(accountHolders);
    setCurrentPage(1);
  };

  // Open Detail View
  const handleViewDetails = (holder) => {
    setSelectedHolder(holder);
    const donors = receipts.filter(r => r.beneficiaryName.toLowerCase() === holder.name.toLowerCase());
    setHolderDonors(donors);
    setFilteredDonors(donors);
    setDetailDistrict('');
    setDetailBlock('');
    setDetailSearch('');
    setDetailCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter Detail List
  const handleApplyDetailFilter = () => {
    let result = [...holderDonors];
    if (detailDistrict) {
      const q = detailDistrict.toLowerCase().trim();
      result = result.filter(d => d.donorDistrict && d.donorDistrict.toLowerCase().includes(q));
    }
    if (detailBlock) {
      const q = detailBlock.toLowerCase().trim();
      result = result.filter(d => d.donorBlock && d.donorBlock.toLowerCase().includes(q));
    }
    if (detailSearch) {
      const q = detailSearch.toLowerCase().trim();
      result = result.filter(d => 
        (d.donorName && d.donorName.toLowerCase().includes(q)) ||
        (d.donorUniqueId && d.donorUniqueId.toLowerCase().includes(q))
      );
    }
    setFilteredDonors(result);
    setDetailCurrentPage(1);
  };

  const handleDetailSearchChange = (e) => {
    const val = e.target.value;
    setDetailSearch(val);
    let result = [...holderDonors];
    if (detailDistrict) {
      const q = detailDistrict.toLowerCase().trim();
      result = result.filter(d => d.donorDistrict && d.donorDistrict.toLowerCase().includes(q));
    }
    if (detailBlock) {
      const q = detailBlock.toLowerCase().trim();
      result = result.filter(d => d.donorBlock && d.donorBlock.toLowerCase().includes(q));
    }
    if (val) {
      const q = val.toLowerCase().trim();
      result = result.filter(d => 
        (d.donorName && d.donorName.toLowerCase().includes(q)) ||
        (d.donorUniqueId && d.donorUniqueId.toLowerCase().includes(q))
      );
    }
    setFilteredDonors(result);
    setDetailCurrentPage(1);
  };

  const handleResetDetailFilter = () => {
    setDetailDistrict('');
    setDetailBlock('');
    setDetailSearch('');
    setFilteredDonors(holderDonors);
    setDetailCurrentPage(1);
  };

  // Main list grand total
  const grandTotal = accountHolders.reduce((acc, h) => acc + h.totalCollection, 0);

  // Pagination for Main View
  const indexOfLastRecord = currentPage * entriesPerPage;
  const indexOfFirstRecord = indexOfLastRecord - entriesPerPage;
  const currentHolders = filteredHolders.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredHolders.length / entriesPerPage);

  // Pagination for Detail View
  const detailLastIdx = detailCurrentPage * detailEntriesPerPage;
  const detailFirstIdx = detailLastIdx - detailEntriesPerPage;
  const currentDetailDonors = filteredDonors.slice(detailFirstIdx, detailLastIdx);
  const detailTotalPages = Math.ceil(filteredDonors.length / detailEntriesPerPage);

  return (
    <div className="w-full bg-gray-50 pb-20 font-sans min-h-screen">
      
      {/* Banner Section */}
      <div 
        className="w-full bg-cover bg-center py-20 relative flex items-center justify-center shadow-md"
        style={{ 
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url("https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1374&auto=format&fit=crop")' 
        }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide uppercase">
            {selectedHolder ? `Nidhan Sahyog - ${selectedHolder.name}` : 'Nidhan Sahyog - Account Holder Wise'}
          </h1>
          <p className="text-[#f08519] font-bold mt-2 tracking-widest text-xs md:text-sm uppercase">
            Silent Help Charitable Trust
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-10">

        {/* ================= DETAIL VIEW (DRILLDOWN) ================= */}
        {selectedHolder ? (
          <div>
            {/* Top Navigation & Total Collection */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <button
                onClick={() => setSelectedHolder(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>←</span> वापस खाताधारक सूची पर जाएं (Back to List)
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-4 px-8 text-center">
                <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">
                  Total Collection for {selectedHolder.name}
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-emerald-600">
                  Rs. {selectedHolder.totalCollection.toLocaleString('en-IN')}.00
                </h2>
              </div>
            </div>

            {/* Detail Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 text-sm font-semibold text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Select District</label>
                  <input
                    type="text"
                    value={detailDistrict}
                    onChange={(e) => setDetailDistrict(e.target.value)}
                    placeholder="जिला टाइप करें..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Select Block</label>
                  <input
                    type="text"
                    value={detailBlock}
                    onChange={(e) => setDetailBlock(e.target.value)}
                    placeholder="ब्लॉक टाइप करें..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] outline-none"
                  />
                </div>
                <div className="flex gap-2.5 md:col-span-2">
                  <button
                    onClick={handleApplyDetailFilter}
                    className="flex-1 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Filter
                  </button>
                  <button
                    onClick={handleResetDetailFilter}
                    className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-extrabold rounded-xl transition-all border cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Donors Table for Selected Account Holder */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={detailEntriesPerPage}
                    onChange={(e) => { setDetailEntriesPerPage(Number(e.target.value)); setDetailCurrentPage(1); }}
                    className="px-3 py-1.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-[#087889] font-bold text-gray-700 outline-none"
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
                    value={detailSearch}
                    onChange={handleDetailSearchChange}
                    placeholder="डोनर नाम, यूनिक आईडी..."
                    className="w-full md:w-64 px-3.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] font-medium text-gray-700 outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-2xl">
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
                  <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                    {currentDetailDonors.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center py-10 text-gray-400 font-bold">
                          इस खाताधारक के लिए कोई सहयोग रिकॉर्ड उपलब्ध नहीं है।
                        </td>
                      </tr>
                    ) : (
                      currentDetailDonors.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-teal-50/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-gray-900">{detailFirstIdx + idx + 1}</td>
                          <td className="py-3.5 px-5 font-bold text-[#087889]">{item.donorName || 'N/A'}</td>
                          <td className="py-3.5 px-5 font-mono text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                          <td className="py-3.5 px-5 font-bold text-emerald-600">₹{item.amount}</td>
                          <td className="py-3.5 px-5 font-semibold text-gray-800">{item.beneficiaryName}</td>
                          <td className="py-3.5 px-5 text-gray-600">{item.donorDistrict}</td>
                          <td className="py-3.5 px-5 text-gray-600">{item.donorBlock}</td>
                          <td className="py-3.5 px-5 text-gray-500 font-semibold">{item.sahyogDate}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Detail Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-600">
                <p>Showing {filteredDonors.length === 0 ? 0 : detailFirstIdx + 1} to {Math.min(detailLastIdx, filteredDonors.length)} of {filteredDonors.length} entries</p>
                {detailTotalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setDetailCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={detailCurrentPage === 1}
                      className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-100 cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from({ length: detailTotalPages }, (_, i) => i + 1).slice(
                      Math.max(0, detailCurrentPage - 3),
                      Math.min(detailTotalPages, detailCurrentPage + 2)
                    ).map(p => (
                      <button
                        key={p}
                        onClick={() => setDetailCurrentPage(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          detailCurrentPage === p ? 'bg-[#087889] text-white' : 'border hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setDetailCurrentPage(p => Math.min(p + 1, detailTotalPages))}
                      disabled={detailCurrentPage === detailTotalPages}
                      className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-100 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        ) : (

          /* ================= MAIN ACCOUNT HOLDERS LIST ================= */
          <div>
            {/* Total Collection Header Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-6 text-center max-w-xl mx-auto mb-10 ring-1 ring-emerald-500/10">
              <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider mb-1">Total Collection: Rs.</span>
              <h2 className="text-3xl md:text-4xl font-black text-emerald-600">
                Rs. {grandTotal.toLocaleString('en-IN')}.00
              </h2>
            </div>

            {/* Filter Toolbar Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8 text-sm font-semibold text-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Select District</label>
                  <input
                    type="text"
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    placeholder="जिला टाइप करें (e.g. Basti)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1.5 font-bold">Select Block</label>
                  <input
                    type="text"
                    value={selectedBlock}
                    onChange={(e) => setSelectedBlock(e.target.value)}
                    placeholder="ब्लॉक टाइप करें (e.g. Khalilabad)"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] outline-none"
                  />
                </div>
                <div className="flex gap-2.5 md:col-span-2">
                  <button
                    onClick={handleApplyFilter}
                    className="flex-1 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    Filter
                  </button>
                  <button
                    onClick={handleResetFilter}
                    className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-extrabold rounded-xl transition-all border cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* List Table Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden p-6">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 text-sm font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span>Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => { setEntriesPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="px-3 py-1.5 bg-gray-50 border rounded-lg focus:ring-1 focus:ring-[#087889] font-bold text-gray-700 outline-none"
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
                    placeholder="दिवंगत सदस्य का नाम खोजें..."
                    className="w-full md:w-64 px-3.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] font-medium text-gray-700 outline-none"
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 font-bold text-[#087889] text-lg animate-pulse">
                  डेटा लोड हो रहा है... कृपया प्रतीक्षा करें
                </div>
              ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="w-full text-left border-collapse min-w-[900px] text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-extrabold uppercase text-[11px] tracking-wider">
                        <th className="py-4 px-5">S NO</th>
                        <th className="py-4 px-5">Name (दिवंगत सदस्य / परिवार)</th>
                        <th className="py-4 px-5">Amount</th>
                        <th className="py-4 px-5">District</th>
                        <th className="py-4 px-5">Block</th>
                        <th className="py-4 px-5">Nidhan Sahyog Date</th>
                        <th className="py-4 px-5 text-center">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                      {currentHolders.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-12 text-gray-400 font-bold">
                            कोई खाताधारक रिकॉर्ड उपलब्ध नहीं है।
                          </td>
                        </tr>
                      ) : (
                        currentHolders.map((holder, idx) => (
                          <tr key={idx} className="hover:bg-teal-50/40 transition-colors">
                            <td className="py-4 px-5 font-bold text-gray-900">{indexOfFirstRecord + idx + 1}</td>
                            <td className="py-4 px-5 font-bold text-gray-900 text-base">{holder.name}</td>
                            <td className="py-4 px-5 font-bold text-emerald-600">{holder.perMemberAmount}</td>
                            <td className="py-4 px-5 text-gray-600 font-semibold">{holder.district}</td>
                            <td className="py-4 px-5 text-gray-600 font-semibold">{holder.block}</td>
                            <td className="py-4 px-5 text-gray-500 font-semibold">{holder.nidhanDate}</td>
                            <td className="py-4 px-5 text-center">
                              <button
                                onClick={() => handleViewDetails(holder)}
                                className="px-4 py-2 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl transition-all shadow-sm text-xs cursor-pointer"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Main Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 text-sm text-gray-600">
                <p>Showing {filteredHolders.length === 0 ? 0 : indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, filteredHolders.length)} of {filteredHolders.length} entries</p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-100 cursor-pointer"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).slice(
                      Math.max(0, currentPage - 3),
                      Math.min(totalPages, currentPage + 2)
                    ).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          currentPage === p ? 'bg-[#087889] text-white' : 'border hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-100 cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default NidhanAccountHolderWiseList;
