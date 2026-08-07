import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/shct.png';
import { 
  getPendingRegistrations, 
  getApprovedMembers, 
  getAnnualDonations, 
  approveRegistration, 
  rejectRegistration,
  getBetiSahayogList,
  getNidhanSahayogList,
  getGreenParyavaranList,
  updateSahayogStatus
} from '../../services/dataService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'donations' | 'beti' | 'nidhan' | 'green'
  
  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);

  const [betiList, setBetiList] = useState([]);
  const [nidhanList, setNidhanList] = useState([]);
  const [greenList, setGreenList] = useState([]);

  const [isSahayataMenuOpen, setIsSahayataMenuOpen] = useState(false);

  const [notification, setNotification] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState({});

  // Check Admin Login
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!isAdmin) {
      navigate('/admin-login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setPendingList(await getPendingRegistrations());
    setApprovedList(await getApprovedMembers());
    setDonationsList(await getAnnualDonations());
    setBetiList(await getBetiSahayogList());
    setNidhanList(await getNidhanSahayogList());
    setGreenList(await getGreenParyavaranList());
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin-login');
  };

  const handleApprove = async (id, name, group) => {
    try {
      const res = await approveRegistration(id, group);
      if (res) {
        setNotification(`✅ ${name} को सफलतापूर्वक अप्रूव कर दिया गया है! डेटा Member List और Annual Donation List में जोड़ दिया गया है।`);
        await loadData();
        setTimeout(() => setNotification(''), 5000);
      }
    } catch(e) {
      console.error(e);
      setNotification(`❌ Error approving ${name}`);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRegistration(id);
      await loadData();
      setNotification('रजिस्ट्रेशन आवेदन अस्वीकृत कर दिया गया है। (Application Rejected)');
      setTimeout(() => setNotification(''), 3000);
    } catch(e) {
      console.error(e);
    }
  };

  const handleSahayogAction = async (type, id, newStatus) => {
    try {
      await updateSahayogStatus(type, id, newStatus);
      await loadData();
      const typeName = type === 'beti' ? 'बेटी विवाह' : type === 'nidhan' ? 'निधन सहयोग' : 'ग्रीन पर्यावरण';
      setNotification(`${typeName} आवेदन ${newStatus === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दिया गया है।`);
      setTimeout(() => setNotification(''), 3000);
    } catch(e) {
      console.error(e);
    }
  };

  const totalDonationSum = donationsList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0) + (approvedList.length * 200);

  return (
    <div className="h-screen bg-gray-50 font-sans flex flex-col overflow-hidden">
      
      {/* ================= HEADER ================= */}
      <header className="bg-gray-900 text-white shadow-md z-40 shrink-0 border-b border-gray-800">
        <div className="px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-white rounded-full p-1 flex items-center justify-center shadow">
              <img src={logoImg} alt="SHCT Logo" className="h-full w-full object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#f08519] tracking-wider uppercase">SHCT ADMIN CONTROL PANEL</h1>
              <p className="text-xs text-teal-400 font-medium">Silent Help Charitable Trust</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/')} 
              className="text-xs font-semibold px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-colors shadow-sm"
            >
              🌐 Main Website
            </button>
            <button 
              onClick={handleLogout} 
              className="text-xs font-bold px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-md"
            >
              LOGOUT (लॉगआउट)
            </button>
          </div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0 overflow-y-auto shadow-xl z-30">
          <div className="p-6">
            <h2 className="text-[11px] font-black text-gray-500 uppercase tracking-widest mb-5">Admin Menu</h2>
            <nav className="space-y-3">
              <button 
                onClick={() => setActiveTab('pending')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'pending' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">⏳</span> 
                <span className="text-left flex-1">पेंडिंग रजिस्ट्रेशन</span>
                {pendingList.length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{pendingList.length}</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('approved')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'approved' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">👥</span> 
                <span className="text-left flex-1">Member List</span>
                {approvedList.length > 0 && (
                  <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{approvedList.length}</span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'donations' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">📜</span> 
                <span className="text-left flex-1 leading-tight">Annual Donation List</span>
              </button>

              {/* SAHAYATA LIST ACCORDION */}
              <div className="pt-2">
                <button 
                  onClick={() => setIsSahayataMenuOpen(!isSahayataMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-gray-300 hover:bg-gray-800 hover:text-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🤝</span>
                    <span>Sahayata List</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isSahayataMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                {isSahayataMenuOpen && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-800 ml-4">
                    <button 
                      onClick={() => setActiveTab('beti')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'beti' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span>👩</span> <span className="text-left flex-1">Beti Sahayog</span>
                      {betiList.length > 0 && <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{betiList.length}</span>}
                    </button>
                    <button 
                      onClick={() => setActiveTab('nidhan')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'nidhan' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span>🕊️</span> <span className="text-left flex-1">Nidhan Sahayog</span>
                      {nidhanList.length > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{nidhanList.length}</span>}
                    </button>
                    <button 
                      onClick={() => setActiveTab('green')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'green' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span>🌿</span> <span className="text-left flex-1">Green Paryavaran</span>
                      {greenList.length > 0 && <span className="bg-green-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{greenList.length}</span>}
                    </button>
                  </div>
                )}
              </div>

            </nav>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            
            {/* Toast Notification */}
            {notification && (
              <div className="mb-6 p-4 bg-emerald-700 text-white rounded-xl shadow-lg font-bold flex items-center justify-between animate-bounce">
                <span>{notification}</span>
                <button onClick={() => setNotification('')} className="text-white hover:text-gray-200 text-xl font-bold ml-4">✕</button>
              </div>
            )}

            {/* ================= METRICS CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">पेंडिंग आवेदन</p>
                  <h3 className="text-4xl font-black text-amber-600 mt-1">{pendingList.length}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Approval Queue</p>
                </div>
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                  ⏳
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-[#087889] flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">स्वीकृत सदस्य</p>
                  <h3 className="text-4xl font-black text-[#087889] mt-1">{approvedList.length}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Approved Members</p>
                </div>
                <div className="w-14 h-14 bg-teal-50 text-[#087889] rounded-2xl flex items-center justify-center text-2xl font-bold">
                  ✅
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-[#f08519] flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">कुल दान संग्रह</p>
                  <h3 className="text-3xl font-black text-[#f08519] mt-1">₹ {totalDonationSum}</h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium">Registration Fees</p>
                </div>
                <div className="w-14 h-14 bg-orange-50 text-[#f08519] rounded-2xl flex items-center justify-center text-2xl font-bold">
                  💰
                </div>
              </div>
            </div>

            {/* ================= TAB CONTENT ================= */}

            {/* TAB 1: PENDING REGISTRATIONS */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">पेंडिंग रजिस्ट्रेशन आवेदन (Approval Queue)</h3>
                    <p className="text-xs text-amber-100 mt-1">यहाँ नए यूज़र्स द्वारा जमा किए गए रजिस्ट्रेशन की सूची है। सत्यापन कर स्वीकृति दें।</p>
                  </div>
                  <span className="bg-white text-amber-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {pendingList.length} पेंडिंग
                  </span>
                </div>

                {pendingList.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                    <span className="text-5xl">🎉</span>
                    <h4 className="text-lg font-bold mt-4 text-gray-700">कोई पेंडिंग आवेदन नहीं है!</h4>
                    <p className="text-sm text-gray-400 mt-1">जब कोई नया यूज़र रजिस्ट्रेशन करेगा, तो उसका विवरण यहाँ दिखाई देगा।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                          <th className="py-4 px-5">आवेदन ID</th>
                          <th className="py-4 px-5">आवेदक का नाम / पिता</th>
                          <th className="py-4 px-5">मोबाइल / आधार</th>
                          <th className="py-4 px-5">जिला / ब्लॉक</th>
                          <th className="py-4 px-5">Txn ID / फीस</th>
                          <th className="py-4 px-5 text-center">पेमेंट रसीद</th>
                          <th className="py-4 px-5 text-center">ग्रुप चुनें</th>
                          <th className="py-4 px-5 text-center">एडमिन एक्शन</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-medium">
                        {pendingList.map((item) => (
                          <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="py-4 px-5 font-mono font-bold text-gray-900">{item.id}</td>
                            <td className="py-4 px-5">
                              <p className="font-bold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">पिता/पति: {item.fatherName || item.fatherOrHusbandName || 'N/A'}</p>
                            </td>
                            <td className="py-4 px-5">
                              <p className="font-semibold text-teal-800">📞 {item.mobile}</p>
                              <p className="text-xs font-mono text-gray-500 mt-1">💳 {item.aadhaar}</p>
                            </td>
                            <td className="py-4 px-5">
                              <p className="font-bold text-gray-800">{item.district}</p>
                              <p className="text-xs text-gray-500 mt-1">{item.block}</p>
                            </td>
                            <td className="py-4 px-5">
                              <span className="font-mono text-[11px] bg-gray-100 text-gray-800 px-2 py-1 rounded font-bold border border-gray-200">{item.transactionId}</span>
                              <p className="text-xs font-bold text-emerald-600 mt-2">₹ {item.amount || 200}</p>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <button 
                                onClick={() => setSelectedReceipt(item.receiptUrl)}
                                className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#087889] border border-teal-200 rounded-lg text-xs font-bold transition-colors"
                              >
                                👁️ रसीद देखें
                              </button>
                            </td>
                            <td className="py-4 px-5 text-center">
                              <select 
                                className="border border-gray-300 rounded-lg p-1.5 text-xs font-bold text-gray-700 bg-gray-50 focus:ring-2 focus:ring-[#087889]"
                                value={selectedGroups[item.id] || 'A'}
                                onChange={(e) => setSelectedGroups({...selectedGroups, [item.id]: e.target.value})}
                              >
                                {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).map(char => (
                                  <option key={char} value={char}>Group {char}</option>
                                ))}
                              </select>
                            </td>
                            <td className="py-4 px-5">
                              <div className="flex items-center justify-center space-x-2">
                                <button 
                                  onClick={() => handleApprove(item.id, item.name, selectedGroups[item.id] || 'A')}
                                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5"
                                >
                                  ✓ Approve
                                </button>
                                <button 
                                  onClick={() => handleReject(item.id, item.name)}
                                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5"
                                >
                                  ✕ Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: APPROVED MEMBERS */}
            {activeTab === 'approved' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-[#087889] text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">स्वीकृत सदस्य (Approved Member List)</h3>
                    <p className="text-xs text-teal-100 mt-1">यह डेटा आपकी मुख्य वेबसाइट के /member-list पेज पर प्रदर्शित हो रहा है।</p>
                  </div>
                  <span className="bg-white text-teal-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {approvedList.length} कुल सदस्य
                  </span>
                </div>

                {approvedList.length === 0 ? (
                  <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                    <p className="text-sm font-medium">अभी कोई नया अप्रूव्ड सदस्य डेटाबेस में उपलब्ध नहीं है।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                          <th className="py-4 px-5">क्र० सं०</th>
                          <th className="py-4 px-5">सदस्य का नाम</th>
                          <th className="py-4 px-5">यूनिक ID</th>
                          <th className="py-4 px-5">जिला</th>
                          <th className="py-4 px-5">ब्लॉक</th>
                          <th className="py-4 px-5">मोबाइल</th>
                          <th className="py-4 px-5">जुड़ने की तिथि</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-medium">
                        {approvedList.map((m, idx) => (
                          <tr key={m.id || idx} className="hover:bg-teal-50/30 transition-colors">
                            <td className="py-4 px-5 font-bold text-gray-500">{m.sno || idx + 1}</td>
                            <td className="py-4 px-5 font-bold text-gray-900">{m.name}</td>
                            <td className="py-4 px-5 font-mono font-bold text-[#087889] bg-teal-50/50 rounded inline-block mt-2 px-2 py-1">{m.uniqueId}</td>
                            <td className="py-4 px-5">{m.district}</td>
                            <td className="py-4 px-5">{m.block}</td>
                            <td className="py-4 px-5 font-semibold text-gray-700">{m.mobile}</td>
                            <td className="py-4 px-5 text-xs font-bold text-gray-500">{m.joinedDate || '2026-08-03'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: ANNUAL DONATIONS */}
            {activeTab === 'donations' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-[#f08519] text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">वार्षिक दान रिकॉर्ड (Annual Donations)</h3>
                    <p className="text-xs text-orange-100 mt-1">रजिस्ट्रेशन शुल्क एवं अन्य दान रिकॉर्ड।</p>
                  </div>
                  <span className="bg-white text-orange-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {donationsList.length} डोनेशन रिकॉर्ड्स
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-4 px-5">क्र० सं०</th>
                        <th className="py-4 px-5">दानदाता का नाम</th>
                        <th className="py-4 px-5">यूनिक ID</th>
                        <th className="py-4 px-5">राशि</th>
                        <th className="py-4 px-5">Txn ID</th>
                        <th className="py-4 px-5">जिला</th>
                        <th className="py-4 px-5">सहयोग तिथि</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {donationsList.map((d, idx) => (
                        <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                          <td className="py-4 px-5 font-bold text-gray-500">{d.sno || idx + 1}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">{d.name}</td>
                          <td className="py-4 px-5 font-mono text-gray-600">{d.uniqueId}</td>
                          <td className="py-4 px-5 font-bold text-emerald-600 bg-emerald-50/50 rounded inline-block mt-2 px-2 py-1">₹ {d.amount}</td>
                          <td className="py-4 px-5 font-mono text-[11px] text-gray-500">{d.transactionId}</td>
                          <td className="py-4 px-5">{d.district}</td>
                          <td className="py-4 px-5 text-xs font-bold text-gray-500">{d.sahyogDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: BETI SAHAYOG */}
            {activeTab === 'beti' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-emerald-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">बेटी विवाह सहयोग आवेदन</h3>
                    <p className="text-xs text-emerald-100 mt-1">बेटी विवाह के लिए प्राप्त हुए आवेदन।</p>
                  </div>
                  <span className="bg-white text-emerald-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {betiList.length} आवेदन
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-4 px-5">S.NO</th>
                        <th className="py-4 px-5">यूनिक ID</th>
                        <th className="py-4 px-5">आवेदक का नाम</th>
                        <th className="py-4 px-5">बेटी का नाम</th>
                        <th className="py-4 px-5">विवाह तिथि</th>
                        <th className="py-4 px-5">जिला</th>
                        <th className="py-4 px-5">ब्लॉक</th>
                        <th className="py-4 px-5 text-center">दस्तावेज</th>
                        <th className="py-4 px-5">रजिस्ट्रेशन तिथि</th>
                        <th className="py-4 px-5 text-right">स्थिति / कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {betiList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="py-4 px-5 font-bold text-gray-500">{index + 1}</td>
                          <td className="py-4 px-5 font-bold text-emerald-700">{item.uniqueId}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">{item.applicantName}</td>
                          <td className="py-4 px-5 font-bold">{item.daughterName}</td>
                          <td className="py-4 px-5 text-emerald-600 font-bold">{item.marriageDate}</td>
                          <td className="py-4 px-5 font-semibold text-gray-800">{item.district || 'N/A'}</td>
                          <td className="py-4 px-5 text-gray-600">{item.block || 'N/A'}</td>
                          <td className="py-4 px-5 text-center">
                            {item.documentImage ? (
                              <button 
                                onClick={() => setSelectedReceipt(item.documentImage)}
                                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                              >
                                👁️ कार्ड देखें
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">N/A</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-500">{new Date(item.submittedAt).toLocaleDateString()}</td>
                          <td className="py-4 px-5 text-right">
                            {item.status === 'PENDING' ? (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleSahayogAction('beti', item.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">✅</button>
                                <button onClick={() => handleSahayogAction('beti', item.id, 'REJECTED')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">❌</button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {betiList.length === 0 && (
                        <tr><td colSpan="7" className="py-8 text-center text-gray-500">कोई आवेदन नहीं है</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 5: NIDHAN SAHAYOG */}
            {activeTab === 'nidhan' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-red-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">निधन सहयोग आवेदन</h3>
                    <p className="text-xs text-red-100 mt-1">निधन सहयोग के लिए प्राप्त हुए आवेदन।</p>
                  </div>
                  <span className="bg-white text-red-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {nidhanList.length} आवेदन
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-4 px-5">S.NO</th>
                        <th className="py-4 px-5">यूनिक ID</th>
                        <th className="py-4 px-5">आवेदक का नाम</th>
                        <th className="py-4 px-5">मृतक का नाम</th>
                        <th className="py-4 px-5">निधन तिथि</th>
                        <th className="py-4 px-5">जिला</th>
                        <th className="py-4 px-5">ब्लॉक</th>
                        <th className="py-4 px-5 text-center">दस्तावेज</th>
                        <th className="py-4 px-5">रजिस्ट्रेशन तिथि</th>
                        <th className="py-4 px-5 text-right">स्थिति / कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {nidhanList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                          <td className="py-4 px-5 font-bold text-gray-500">{index + 1}</td>
                          <td className="py-4 px-5 font-bold text-red-700">{item.uniqueId}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">{item.applicantName}</td>
                          <td className="py-4 px-5 font-bold">{item.deceasedName}</td>
                          <td className="py-4 px-5 text-red-600 font-bold">{item.deathDate}</td>
                          <td className="py-4 px-5 font-semibold text-gray-800">{item.district || 'N/A'}</td>
                          <td className="py-4 px-5 text-gray-600">{item.block || 'N/A'}</td>
                          <td className="py-4 px-5 text-center">
                            {item.documentImage ? (
                              <button 
                                onClick={() => setSelectedReceipt(item.documentImage)}
                                className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                              >
                                👁️ कार्ड देखें
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">N/A</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-500">{new Date(item.submittedAt).toLocaleDateString()}</td>
                          <td className="py-4 px-5 text-right">
                            {item.status === 'PENDING' ? (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleSahayogAction('nidhan', item.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">✅</button>
                                <button onClick={() => handleSahayogAction('nidhan', item.id, 'REJECTED')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">❌</button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {nidhanList.length === 0 && (
                        <tr><td colSpan="7" className="py-8 text-center text-gray-500">कोई आवेदन नहीं है</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: GREEN PARYAVARAN */}
            {activeTab === 'green' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-green-600 text-white flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-extrabold">ग्रीन पर्यावरण अभियान आवेदन</h3>
                    <p className="text-xs text-green-100 mt-1">पौधारोपण के लिए प्राप्त हुए आवेदन।</p>
                  </div>
                  <span className="bg-white text-green-900 text-xs font-black px-3.5 py-1.5 rounded-full shadow">
                    {greenList.length} आवेदन
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-4 px-5">S.NO</th>
                        <th className="py-4 px-5">यूनिक ID</th>
                        <th className="py-4 px-5">आवेदक का नाम</th>
                        <th className="py-4 px-5">पौधों की संख्या</th>
                        <th className="py-4 px-5">रोपण तिथि</th>
                        <th className="py-4 px-5">जिला</th>
                        <th className="py-4 px-5">ब्लॉक</th>
                        <th className="py-4 px-5 text-center">फोटो</th>
                        <th className="py-4 px-5">रजिस्ट्रेशन तिथि</th>
                        <th className="py-4 px-5 text-right">स्थिति / कार्यवाही</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {greenList.map((item, index) => (
                        <tr key={item.id} className="hover:bg-green-50/30 transition-colors">
                          <td className="py-4 px-5 font-bold text-gray-500">{index + 1}</td>
                          <td className="py-4 px-5 font-bold text-green-700">{item.uniqueId}</td>
                          <td className="py-4 px-5 font-bold text-gray-900">{item.applicantName}</td>
                          <td className="py-4 px-5 font-bold text-xl">{item.treesPlanted} 🌳</td>
                          <td className="py-4 px-5 text-green-600 font-bold">{item.plantationDate}</td>
                          <td className="py-4 px-5 font-semibold text-gray-800">{item.district || 'N/A'}</td>
                          <td className="py-4 px-5 text-gray-600">{item.block || 'N/A'}</td>
                          <td className="py-4 px-5 text-center">
                            {item.documentImage ? (
                              <button 
                                onClick={() => setSelectedReceipt(item.documentImage)}
                                className="px-3.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                              >
                                👁️ फोटो देखें
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">N/A</span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-xs text-gray-500">{new Date(item.submittedAt).toLocaleDateString()}</td>
                          <td className="py-4 px-5 text-right">
                            {item.status === 'PENDING' ? (
                              <div className="flex justify-end gap-2">
                                <button onClick={() => handleSahayogAction('green', item.id, 'APPROVED')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Approve">✅</button>
                                <button onClick={() => handleSahayogAction('green', item.id, 'REJECTED')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">❌</button>
                              </div>
                            ) : (
                              <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {item.status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {greenList.length === 0 && (
                        <tr><td colSpan="7" className="py-8 text-center text-gray-500">कोई आवेदन नहीं है</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* ================= RECEIPT PREVIEW MODAL ================= */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📄</span> दस्तावेज / रसीद (Document Preview)
              </h4>
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="h-[400px] w-full bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 p-2">
              <img src={selectedReceipt} alt="Payment Receipt" className="h-full w-full object-contain rounded-xl" />
            </div>
            <div className="mt-6 text-right">
              <button 
                onClick={() => setSelectedReceipt(null)}
                className="px-6 py-3 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
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

export default AdminDashboard;
