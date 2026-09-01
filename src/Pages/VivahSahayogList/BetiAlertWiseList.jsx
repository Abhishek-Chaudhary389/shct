import React, { useState, useEffect } from 'react';
import { getBetiSahyogReceipts, getApprovedMembers, getBetiSahayogList, getHomeAlerts } from '../../services/dataService';

const BetiAlertWiseList = () => {
  const [receipts, setReceipts] = useState([]);
  const [alertsList, setAlertsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected Alert for Drilldown
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [alertDonors, setAlertDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);

  // Filter States for Detail View
  const [detailDistrict, setDetailDistrict] = useState('');
  const [detailBlock, setDetailBlock] = useState('');
  const [detailSearch, setDetailSearch] = useState('');
  const [detailEntriesPerPage, setDetailEntriesPerPage] = useState(25);
  const [detailCurrentPage, setDetailCurrentPage] = useState(1);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const approvedMembers = await getApprovedMembers();
        const rawReceipts = await getBetiSahyogReceipts();
        const applications = await getBetiSahayogList();
        const homeAlerts = await getHomeAlerts();

        // 1. Process Approved Receipts
        const approvedReceipts = rawReceipts
          .filter(r => r.status === 'APPROVED')
          .map((r) => {
            let dist = r.donorDistrict;
            let blk = r.donorBlock;
            if (!dist || !blk) {
              const member = approvedMembers.find(m => m.uniqueId === r.donorUniqueId);
              if (member) {
                dist = dist || member.district;
                blk = blk || member.block;
              }
            }

            const alertNum = Number(r.alertNumber || r.alertNo || 1);

            return {
              ...r,
              alertNumber: alertNum,
              donorDistrict: dist || 'N/A',
              donorBlock: blk || 'N/A',
              amount: Number(r.amount) || 0,
              beneficiaryName: (r.beneficiaryName || r.donationToMember || '').trim(),
              sahyogDate: r.sahyogDate || (r.submittedAt ? r.submittedAt.slice(0, 10) : '2025-03-22')
            };
          });

        setReceipts(approvedReceipts);

        // 2. Build Real / Active Beti Alerts
        const alertMap = {};
        let deletedKeys = [];
        try {
          deletedKeys = JSON.parse(localStorage.getItem('shct_deleted_alert_keys') || '[]');
        } catch {}

        // Base Alert 1 and Alert 2 (if not deleted)
        if (!deletedKeys.includes('beti_1')) {
          alertMap[1] = {
            alertNumber: 1,
            title: 'Alert 1',
            beneficiaryName: applications[0]?.applicantName || 'सुरेश चंद्र',
            totalCollection: 0,
            donorsCount: 0
          };
        }

        if (!deletedKeys.includes('beti_2')) {
          alertMap[2] = {
            alertNumber: 2,
            title: 'Alert 2',
            beneficiaryName: applications[1]?.applicantName || 'संतोष कुमार',
            totalCollection: 0,
            donorsCount: 0
          };
        }

        // Populate / override from active home alerts specifically for Beti
        const betiHomeAlerts = homeAlerts.filter(a => !a.type || a.type === 'beti');
        betiHomeAlerts.forEach((a, idx) => {
          const num = Number(a.alertNumber || a.alertNo || idx + 1);
          if (num && !deletedKeys.includes(`beti_${num}`)) {
            alertMap[num] = {
              id: a.id,
              alertNumber: num,
              title: a.title || `Alert ${num}`,
              beneficiaryName: a.beneficiaryName || a.member || a.name || `अलर्ट ${num}`,
              totalCollection: 0,
              donorsCount: 0
            };
          }
        });

        // Add from actual receipts
        approvedReceipts.forEach(r => {
          const num = Number(r.alertNumber || 1);
          if (!deletedKeys.includes(`beti_${num}`)) {
            if (!alertMap[num]) {
              alertMap[num] = {
                alertNumber: num,
                title: `Alert ${num}`,
                beneficiaryName: r.beneficiaryName || `अलर्ट ${num}`,
                totalCollection: 0,
                donorsCount: 0
              };
            }
            alertMap[num].totalCollection += (Number(r.amount) || 0);
            alertMap[num].donorsCount += 1;
          }
        });

        // Convert to array and sort strictly by alert number
        const list = Object.values(alertMap).sort((a, b) => a.alertNumber - b.alertNumber);
        setAlertsList(list);
      } catch (err) {
        console.error("Error loading alert wise data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Open Alert Detail
  const handleViewAlertDetails = (alertItem) => {
    setSelectedAlert(alertItem);
    const donors = receipts.filter(r => r.alertNumber === alertItem.alertNumber);
    setAlertDonors(donors);
    setFilteredDonors(donors);
    setDetailDistrict('');
    setDetailBlock('');
    setDetailSearch('');
    setDetailCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Detail Filter
  const handleApplyDetailFilter = () => {
    let result = [...alertDonors];
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
    let result = [...alertDonors];
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
    setFilteredDonors(alertDonors);
    setDetailCurrentPage(1);
  };

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
          backgroundImage: 'linear-gradient(rgba(10, 25, 47, 0.75), rgba(10, 25, 47, 0.85)), url("https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1470&auto=format&fit=crop")' 
        }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-wide uppercase">
            {selectedAlert ? `Beti Vivah Sahyog List - ${selectedAlert.title}` : 'Alert Wise Sahyog'}
          </h1>
          <p className="text-[#f08519] font-bold mt-2 tracking-widest text-xs md:text-sm uppercase">
            Silent Help Charitable Trust
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8 mt-10">

        {/* ================= DETAIL VIEW (DRILLDOWN FOR SPECIFIC ALERT) ================= */}
        {selectedAlert ? (
          <div>
            {/* Top Navigation & Total Collection */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
              >
                <span>←</span> वापस अलर्ट सूची पर जाएं (Back to Alerts)
              </button>

              <div className="bg-white rounded-2xl shadow-sm border border-emerald-200 p-4 px-8 text-center">
                <span className="text-xs font-bold text-gray-500 block uppercase tracking-wider">
                  Total Collection: Rs.
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-emerald-600">
                  Rs. {selectedAlert.totalCollection.toLocaleString('en-IN')}.00
                </h2>
              </div>
            </div>

            {/* Filter Toolbar Card */}
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

            {/* Donors Table Card */}
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
                          इस अलर्ट के लिए कोई सहयोग रिकॉर्ड उपलब्ध नहीं है।
                        </td>
                      </tr>
                    ) : (
                      currentDetailDonors.map((item, idx) => (
                        <tr key={item.id || idx} className="hover:bg-teal-50/40 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-gray-900">{detailFirstIdx + idx + 1}</td>
                          <td className="py-3.5 px-5 font-bold text-gray-900">{item.donorName || 'N/A'}</td>
                          <td className="py-3.5 px-5 font-mono text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                          <td className="py-3.5 px-5 font-bold text-emerald-600">{item.amount}.00</td>
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

          /* ================= MAIN ALERTS GRID VIEW ================= */
          <div>
            {loading ? (
              <div className="text-center py-20 font-bold text-[#087889] text-lg animate-pulse">
                अलर्ट्स लोड हो रहे हैं... कृपया प्रतीक्षा करें
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {alertsList.map((alert) => (
                  <div 
                    key={alert.alertNumber}
                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center justify-between text-center group relative overflow-hidden"
                  >
                    {/* Top Accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#087889] to-[#f08519] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="my-2">
                      <h3 className="text-2xl font-black text-gray-800 tracking-tight mb-1">
                        {alert.title}
                      </h3>
                      {alert.beneficiaryName && (
                        <p className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md inline-block">
                          {alert.beneficiaryName}
                        </p>
                      )}
                    </div>

                    <div className="w-full pt-4 mt-2 border-t border-gray-100 flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-semibold text-gray-500">
                        <span>सहयोग राशि:</span>
                        <span className="font-bold text-emerald-600">₹{alert.totalCollection.toLocaleString('en-IN')}</span>
                      </div>

                      <button
                        onClick={() => handleViewAlertDetails(alert)}
                        className="w-full py-2.5 bg-gray-900 hover:bg-[#087889] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer mt-1"
                      >
                        View Details
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default BetiAlertWiseList;
