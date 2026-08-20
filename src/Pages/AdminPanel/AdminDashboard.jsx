import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/shct.png';
import { 
  getPendingRegistrations, 
  getAllRegistrationsHistory,
  getApprovedMembers, 
  getAnnualDonations, 
  approveRegistration, 
  rejectRegistration,
  getBetiSahyogList,
  getNidhanSahyogList,
  updateSahayogStatus,
  getHomeAlerts,
  addHomeAlert,
  updateHomeAlertStatus,
  deleteHomeAlert,
  getHomePageSettings,
  saveHomePageSettings,
  getBetiSahyogReceipts,
  updateBetiReceiptStatus,
  getNidhanSahyogReceipts,
  updateNidhanReceiptStatus
} from '../../services/dataService';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToImageKit } from '../../utils/imageKitUploader';
import { exportToCSV } from '../../utils/csvExporter';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics'); // Set landing tab to analytics
  
  const [pendingList, setPendingList] = useState([]);
  const [approvedList, setApprovedList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);

  const [betiList, setBetiList] = useState([]);
  const [nidhanList, setNidhanList] = useState([]);
  const [homeAlertsList, setHomeAlertsList] = useState([]);
  const [betiReceiptsList, setBetiReceiptsList] = useState([]);
  const [nidhanReceiptsList, setNidhanReceiptsList] = useState([]);

  const [homeSettings, setHomeSettings] = useState({
    headerTitle: '',
    alertTitle: '',
    alertPoints: '',
    instructionTitle: '',
    instructionText: '',
    instructionNote: ''
  });

  const [isSahayataMenuOpen, setIsSahayataMenuOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);

  const [notification, setNotification] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
  const [selectedGroups, setSelectedGroups] = useState({});

  const [betiFilter, setBetiFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [nidhanFilter, setNidhanFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [selectedReceiptForDetail, setSelectedReceiptForDetail] = useState(null);
  const [registrationFilter, setRegistrationFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [registrationAutoAssign, setRegistrationAutoAssign] = useState(false); // Auto assign rule toggle

  const [newHomeAlert, setNewHomeAlert] = useState({
    group: '', member: '', uniqueId: '', date: '', address: '', 
    daughter: '', marriageDate: '', accName: '', accNo: '', 
    ifsc: '', branch: '', bank: '', minSupport: '50 रुपए', qrCodeBase64: '',
    type: 'beti'
  });

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
    console.log("Starting loadData...");
    try {
      const pList = await getAllRegistrationsHistory();
      console.log("Loaded registrations history list:", pList.length);
      setPendingList(pList);
    } catch (e) {
      console.error("Error loading pending registrations:", e);
    }

    try {
      const aList = await getApprovedMembers();
      console.log("Loaded approved list:", aList.length);
      setApprovedList(aList);
    } catch (e) {
      console.error("Error loading approved members:", e);
    }

    try {
      const dList = await getAnnualDonations();
      console.log("Loaded donations list:", dList.length);
      setDonationsList(dList);
    } catch (e) {
      console.error("Error loading annual donations:", e);
    }

    try {
      const bList = await getBetiSahayogList();
      console.log("Loaded beti applications list:", bList.length);
      setBetiList(bList);
    } catch (e) {
      console.error("Error loading beti applications:", e);
    }

    try {
      const nList = await getNidhanSahyogList();
      console.log("Loaded nidhan applications list:", nList.length);
      setNidhanList(nList);
    } catch (e) {
      console.error("Error loading nidhan applications:", e);
    }

    try {
      const alerts = await getHomeAlerts();
      console.log("Loaded home alerts list:", alerts.length);
      setHomeAlertsList(alerts);
    } catch (e) {
      console.error("Error loading home alerts:", e);
    }

    try {
      const settings = await getHomePageSettings();
      console.log("Loaded home settings");
      setHomeSettings(settings);
    } catch (e) {
      console.error("Error loading home settings:", e);
    }

    try {
      const bReceipts = await getBetiSahyogReceipts();
      console.log("Loaded beti receipts list:", bReceipts.length, bReceipts);
      setBetiReceiptsList(bReceipts);
    } catch (e) {
      console.error("Error loading beti receipts:", e);
    }

    try {
      const nReceipts = await getNidhanSahyogReceipts();
      console.log("Loaded nidhan receipts list:", nReceipts.length, nReceipts);
      setNidhanReceiptsList(nReceipts);
    } catch (e) {
      console.error("Error loading nidhan receipts:", e);
    }
    console.log("loadData complete.");
  };

  const handleSaveHomeSettings = async (e) => {
    e.preventDefault();
    try {
      await saveHomePageSettings(homeSettings);
      setNotification('✅ होम पेज सेटिंग्स सफलतापूर्वक सहेज ली गई हैं!');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('❌ सेटिंग्स सहेजने में विफल।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleBetiReceiptAction = async (id, status) => {
    try {
      await updateBetiReceiptStatus(id, status);
      setNotification(`✅ रसीद स्थिति सफलतापूर्वक ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दी गई है!`);
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('❌ स्थिति अपडेट करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleNidhanReceiptAction = async (id, status) => {
    try {
      await updateNidhanReceiptStatus(id, status);
      setNotification(`✅ रसीद स्थिति सफलतापूर्वक ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दी गई है!`);
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('❌ स्थिति अपडेट करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleExportMembers = () => {
    const headersMap = {
      uniqueId: "यूनिक ID",
      name: "नाम",
      fatherName: "पिता/पति का नाम",
      dob: "जन्म तिथि",
      mobile: "मोबाइल नंबर",
      aadhaar: "आधार नंबर",
      gender: "जेंडर",
      occupation: "व्यवसाय",
      district: "जिला",
      block: "ब्लॉक",
      email: "ईमेल ID",
      address: "पता",
      nomineeName: "नॉमिनी का नाम",
      nomineeRelation: "नॉमिनी से संबंध",
      nomineeMobile: "नॉमिनी मोबाइल",
      group: "ग्रुप",
      registeredOn: "रजिस्ट्रेशन तिथि"
    };
    exportToCSV(approvedList, headersMap, `SHCT_Approved_Members_${Date.now()}.csv`);
  };

  const handleExportReceipts = (type) => {
    const list = type === 'beti' ? betiReceiptsList : nidhanReceiptsList;
    const filename = type === 'beti' ? `SHCT_Beti_Receipts_${Date.now()}.csv` : `SHCT_Nidhan_Receipts_${Date.now()}.csv`;
    const headersMap = {
      donorName: "सहयोगकर्ता का नाम",
      donorUniqueId: "सहयोगकर्ता ID",
      donorMobile: "मोबाइल नंबर",
      donorAadhaar: "आधार नंबर",
      donorDistrict: "जिला",
      donorBlock: "ब्लॉक",
      beneficiaryName: "लाभार्थी का नाम",
      beneficiaryUniqueId: "लाभार्थी ID",
      group: "ग्रुप",
      transactionId: "ट्रांजेक्शन ID",
      amount: "सहायता राशि (₹)",
      date: "सहयोग तिथि",
      status: "स्थिति (Status)"
    };
    exportToCSV(list, headersMap, filename);
  };

  const handleExportDonations = () => {
    const headersMap = {
      name: "दानदाता का नाम",
      uniqueId: "यूनिक ID",
      amount: "राशि (₹)",
      transactionId: "ट्रांजेक्शन ID",
      district: "जिला",
      sahyogDate: "सहयोग तिथि"
    };
    exportToCSV(donationsList, headersMap, `SHCT_Annual_Donations_${Date.now()}.csv`);
  };

  const getGroupSizes = () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 };
    approvedList.forEach(m => {
      const g = m.group ? String(m.group).trim().toUpperCase() : 'A';
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  };

  const getSmallestGroup = () => {
    const groupSizes = getGroupSizes();
    const targetGroups = ['A', 'B', 'C', 'D'];
    let smallestGroup = 'A';
    let minSize = Infinity;
    targetGroups.forEach(g => {
      const size = groupSizes[g] || 0;
      if (size < minSize) {
        minSize = size;
        smallestGroup = g;
      }
    });
    return smallestGroup;
  };

  const getThisMonthDonations = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let donationsMonthSum = 0;
    donationsList.forEach(d => {
      const dDate = d.sahyogDate ? new Date(d.sahyogDate) : d.date ? new Date(d.date) : null;
      if (dDate && dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear) {
        donationsMonthSum += Number(d.amount) || 0;
      }
    });

    return donationsMonthSum;
  };

  const getDistrictStats = () => {
    const districts = {};
    approvedList.forEach(m => {
      const dist = m.district ? String(m.district).trim() : 'अन्य (Other)';
      districts[dist] = (districts[dist] || 0) + 1;
    });
    return Object.keys(districts)
      .map(name => ({ name, count: districts[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const getAidDistributed = () => {
    const betiSum = betiReceiptsList
      .filter(r => r.status === 'APPROVED')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    const nidhanSum = nidhanReceiptsList
      .filter(r => r.status === 'APPROVED')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
    return { betiSum, nidhanSum };
  };

  const getMonthlyTrend = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const now = new Date();
    const trend = [];
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      trend.push({
        monthName: months[d.getMonth()] + " " + d.getFullYear().toString().slice(-2),
        monthIdx: d.getMonth(),
        year: d.getFullYear(),
        amount: 0
      });
    }

    donationsList.forEach(d => {
      const dDate = d.sahyogDate ? new Date(d.sahyogDate) : d.date ? new Date(d.date) : null;
      if (dDate) {
        trend.forEach(t => {
          if (dDate.getMonth() === t.monthIdx && dDate.getFullYear() === t.year) {
            t.amount += Number(d.amount) || 0;
          }
        });
      }
    });

    return trend;
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/admin-login');
  };

  const handleApprove = async (id, name, manualGroup) => {
    try {
      let groupToAssign = manualGroup;
      if (registrationAutoAssign) {
        groupToAssign = getSmallestGroup();
      }
      const res = await approveRegistration(id, groupToAssign);
      if (res) {
        setNotification(`✅ ${name} को सफलतापूर्वक अप्रूव कर दिया गया है (ग्रुप: ${groupToAssign})! डेटा Member List और Annual Donation List में जोड़ दिया गया है।`);
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

  const handleToggleHomeAlert = async (id, currentStatus) => {
    try {
      await updateHomeAlertStatus(id, !currentStatus);
      await loadData();
      setNotification(`होम पेज अलर्ट स्टेटस अपडेट कर दिया गया है।`);
      setTimeout(() => setNotification(''), 3000);
    } catch(e) {
      console.error(e);
    }
  };

  const handleDeleteHomeAlert = async (id) => {
    if(window.confirm('क्या आप सच में इस अलर्ट को डिलीट करना चाहते हैं?')) {
      try {
        await deleteHomeAlert(id);
        await loadData();
        setNotification('अलर्ट हटा दिया गया है।');
        setTimeout(() => setNotification(''), 3000);
      } catch(e) {
        console.error(e);
      }
    }
  };

  const handleCreateHomeAlert = async (e) => {
    e.preventDefault();
    try {
      let finalQrCode = newHomeAlert.qrCodeBase64;
      if (newHomeAlert.qrCodeBase64 && newHomeAlert.qrCodeBase64.startsWith('data:image')) {
        finalQrCode = await uploadToImageKit(newHomeAlert.qrCodeBase64, `alert_qr_${newHomeAlert.uniqueId || 'member'}_${Date.now()}.jpg`);
      }

      await addHomeAlert({
        ...newHomeAlert,
        qrCodeBase64: finalQrCode
      });
      setNewHomeAlert({ group: '', member: '', uniqueId: '', date: '', address: '', daughter: '', marriageDate: '', accName: '', accNo: '', ifsc: '', branch: '', bank: '', minSupport: '50 रुपए', qrCodeBase64: '', type: 'beti' });
      await loadData();
      setNotification('नया होम पेज अलर्ट सफलतापूर्वक जोड़ दिया गया है!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error(error);
      setNotification('अलर्ट जोड़ने में समस्या आई।');
      setTimeout(() => setNotification(''), 3000);
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if(file) {
      try {
        const base64 = await compressImage(file);
        setNewHomeAlert(prev => ({...prev, qrCodeBase64: base64}));
      } catch(err) {
        console.error("Image compression error", err);
      }
    }
  };

  const totalDonationSum = donationsList.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

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
                onClick={() => setActiveTab('analytics')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'analytics' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">📊</span> 
                <span className="text-left flex-1">मुख्य सांख्यिकी (Analytics)</span>
              </button>

              <button 
                onClick={() => setActiveTab('pending')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'pending' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">⏳</span> 
                <span className="text-left flex-1">पेंडिंग रजिस्ट्रेशन</span>
                {pendingList.filter(r => r.status === 'PENDING' || !r.status).length > 0 && (
                  <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                    {pendingList.filter(r => r.status === 'PENDING' || !r.status).length}
                  </span>
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
                onClick={() => setActiveTab('groups')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'groups' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">🛡️</span> 
                <span className="text-left flex-1">ग्रुप प्रबंधन (Groups)</span>
              </button>

              {/* HOME MANAGEMENT ACCORDION */}
              <div className="pt-2">
                <button 
                  onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-gray-300 hover:bg-gray-800 hover:text-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">🏠</span>
                    <span>Home Management</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isHomeMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                {isHomeMenuOpen && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-800 ml-4">
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'settings' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span>⚙️</span> <span className="text-left flex-1">Home Settings</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('home_alerts')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'home_alerts' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <span>📢</span> <span className="text-left flex-1">Home Alerts</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'donations' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">📜</span> 
                <span className="text-left flex-1 leading-tight">Annual Donation List</span>
              </button>

              <button 
                onClick={() => setActiveTab('beti_receipts')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'beti_receipts' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">🧾</span> 
                <span className="text-left flex-1">Beti Receipts</span>
                {betiReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                  <span className="bg-[#f08519] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                    {betiReceiptsList.filter(r => r.status === 'PENDING').length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActiveTab('nidhan_receipts')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'nidhan_receipts' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <span className="text-lg">🧾</span> 
                <span className="text-left flex-1">Nidhan Receipts</span>
                {nidhanReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                  <span className="bg-[#f08519] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                    {nidhanReceiptsList.filter(r => r.status === 'PENDING').length}
                  </span>
                )}
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
            {activeTab === 'beti_receipts' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pending Beti Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">लंबित बेटी रसीदें</p>
                    <h3 className="text-4xl font-black text-amber-600 mt-1">
                      {betiReceiptsList.filter(r => r.status === 'PENDING').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Pending Verification</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ⏳
                  </div>
                </div>

                {/* Approved Beti Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-emerald-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">स्वीकृत बेटी रसीदें</p>
                    <h3 className="text-4xl font-black text-emerald-600 mt-1">
                      {betiReceiptsList.filter(r => r.status === 'APPROVED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Approved Donations</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ✅
                  </div>
                </div>

                {/* Rejected Beti Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-red-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">अस्वीकृत बेटी रसीदें</p>
                    <h3 className="text-4xl font-black text-red-600 mt-1">
                      {betiReceiptsList.filter(r => r.status === 'REJECTED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Rejected Receipts</p>
                  </div>
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ✕
                  </div>
                </div>
              </div>
            ) : activeTab === 'nidhan_receipts' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pending Nidhan Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">लंबित मृत्यु रसीदें</p>
                    <h3 className="text-4xl font-black text-amber-600 mt-1">
                      {nidhanReceiptsList.filter(r => r.status === 'PENDING').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Pending Verification</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ⏳
                  </div>
                </div>

                {/* Approved Nidhan Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-emerald-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">स्वीकृत मृत्यु रसीदें</p>
                    <h3 className="text-4xl font-black text-emerald-600 mt-1">
                      {nidhanReceiptsList.filter(r => r.status === 'APPROVED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Approved Donations</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ✅
                  </div>
                </div>

                {/* Rejected Nidhan Receipts */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-red-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">अस्वीकृत मृत्यु रसीदें</p>
                    <h3 className="text-4xl font-black text-red-600 mt-1">
                      {nidhanReceiptsList.filter(r => r.status === 'REJECTED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Rejected Receipts</p>
                  </div>
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    ✕
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">पेंडिंग आवेदन</p>
                    <h3 className="text-4xl font-black text-amber-600 mt-1">
                      {pendingList.filter(r => r.status === 'PENDING' || !r.status).length}
                    </h3>
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
            )}

            {/* ================= TAB CONTENT ================= */}

            {/* TAB: ANALYTICS DASHBOARD */}
            {activeTab === 'analytics' && (
              <div className="space-y-8">
                {/* 1. Aid Distributed Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Beti Sahyog Aid */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-emerald-500 hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">कुल बेटी विवाह सहयोग वितरण</h4>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <h3 className="text-3xl font-black text-emerald-600">₹ {getAidDistributed().betiSum}</h3>
                        <p className="text-xs text-gray-400 mt-1">Disbursed for marriage help</p>
                      </div>
                      <span className="text-3xl">👰</span>
                    </div>
                  </div>

                  {/* Nidhan Sahyog Aid */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-red-500 hover:shadow-md transition-shadow">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">कुल मृत्यु सहयोग वितरण</h4>
                    <div className="flex justify-between items-end mt-2">
                      <div>
                        <h3 className="text-3xl font-black text-red-600">₹ {getAidDistributed().nidhanSum}</h3>
                        <p className="text-xs text-gray-400 mt-1">Disbursed for demise support</p>
                      </div>
                      <span className="text-3xl">🕊️</span>
                    </div>
                  </div>
                </div>

                {/* 2. Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Monthly Trend Chart */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-gray-800">मासिक दान एवं रजिस्ट्रेशन संग्रह (Monthly Collections)</h3>
                      <p className="text-xs text-gray-400 mt-0.5">पिछले 6 महीनों का कुल संग्रह (₹200 रजिस्ट्रेशन फीस + वार्षिक सहयोग)</p>
                    </div>

                    {/* SVG Bar Chart */}
                    <div className="flex justify-center">
                      <svg width="100%" height="220" viewBox="0 0 500 220" className="max-w-full">
                        {/* Grid lines */}
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                          const y = 20 + ratio * 140;
                          const val = Math.round((1 - ratio) * Math.max(...getMonthlyTrend().map(t => t.amount), 1000));
                          return (
                            <g key={idx}>
                              <line x1="50" y1={y} x2="480" y2={y} stroke="#e5e7eb" strokeDasharray="3,3" />
                              <text x="40" y={y + 4} textAnchor="end" className="text-[10px] fill-gray-400 font-bold font-mono">₹{val}</text>
                            </g>
                          );
                        })}

                        {/* Bars and labels */}
                        {getMonthlyTrend().map((t, idx) => {
                          const barWidth = 40;
                          const spacing = 30;
                          const x = 70 + idx * (barWidth + spacing);
                          const maxVal = Math.max(...getMonthlyTrend().map(item => item.amount), 1000);
                          const barHeight = maxVal > 0 ? (t.amount / maxVal) * 140 : 0;
                          const y = 160 - barHeight;

                          return (
                            <g key={idx} className="group">
                              {/* Hover tooltip background */}
                              <rect x={x - 10} y="10" width={barWidth + 20} height="180" fill="transparent" />
                              
                              {/* Actual Bar */}
                              <rect 
                                x={x} 
                                y={y} 
                                width={barWidth} 
                                height={barHeight} 
                                fill={t.amount > 0 ? "#087889" : "#d1d5db"} 
                                rx="4"
                                className="transition-all duration-300 hover:fill-[#f08519] cursor-pointer"
                              />

                              {/* Amount text on hover / static */}
                              {t.amount > 0 && (
                                <text 
                                  x={x + barWidth / 2} 
                                  y={y - 6} 
                                  textAnchor="middle" 
                                  className="text-[10px] font-bold fill-[#087889] font-mono"
                                >
                                  ₹{t.amount}
                                </text>
                              )}

                              {/* X Axis Label */}
                              <text 
                                x={x + barWidth / 2} 
                                y="180" 
                                textAnchor="middle" 
                                className="text-[11px] font-bold fill-gray-500"
                              >
                                {t.monthName}
                              </text>
                            </g>
                          );
                        })}
                        {/* Base line */}
                        <line x1="50" y1="160" x2="480" y2="160" stroke="#9ca3af" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* District Members distribution */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
                    <div className="border-b border-gray-100 pb-4 mb-6">
                      <h3 className="text-lg font-bold text-gray-800">शीर्ष 5 जिला भागीदारी (Top 5 Districts)</h3>
                      <p className="text-xs text-gray-400 mt-0.5">संस्था में जुड़े सदस्यों की जिलावार संख्या</p>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-4">
                      {getDistrictStats().length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-10 font-bold">कोई सदस्य डेटा उपलब्ध नहीं है</p>
                      ) : (
                        getDistrictStats().map((dist, idx) => {
                          const maxCount = Math.max(...getDistrictStats().map(d => d.count), 1);
                          const percentage = (dist.count / maxCount) * 100;
                          const colors = ["bg-[#087889]", "bg-[#f08519]", "bg-teal-600", "bg-orange-500", "bg-cyan-600"];
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                                <span className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500">{idx + 1}</span>
                                  {dist.name}
                                </span>
                                <span className="font-mono text-[#087889]">{dist.count} सदस्य</span>
                              </div>
                              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${colors[idx % colors.length]}`} 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Monthly Donors Summary Bar */}
                <div className="bg-[#087889] rounded-2xl p-6 text-white shadow flex flex-col md:flex-row justify-between items-center gap-6">
                  <div>
                    <h4 className="text-sm font-bold text-teal-100 uppercase tracking-wider">इस महीने का कुल शगुन/रजिस्ट्रेशन दान संग्रह</h4>
                    <p className="text-xs text-teal-200 mt-1">वर्तमान माह के दौरान प्राप्त सभी भुगतानों का योग</p>
                  </div>
                  <h3 className="text-4xl font-black font-mono">₹ {getThisMonthDonations()}</h3>
                </div>
              </div>
            )}

            {/* TAB: GROUP MANAGEMENT */}
            {activeTab === 'groups' && (
              <div className="space-y-8">
                {/* Auto Assign Toggle card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">ग्रुप ऑटो-असाइनमेंट सेटिंग्स (Auto-Assignment Rule)</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      यदि सक्षम है, तो नए यूज़र्स को अप्रूव करते समय सिस्टम स्वचालित रूप से उन्हें सबसे छोटे ग्रुप (सबसे कम सदस्य संख्या वाले ग्रुप) में डाल देगा।
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${registrationAutoAssign ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {registrationAutoAssign ? 'ऑटो-असाइनमेंट चालू है' : 'ऑटो-असाइनमेंट बंद है'}
                    </span>
                    <button 
                      onClick={() => setRegistrationAutoAssign(!registrationAutoAssign)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        registrationAutoAssign ? 'bg-emerald-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          registrationAutoAssign ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Group Sizes Grid */}
                <div>
                  <h3 className="text-xl font-extrabold text-gray-800 mb-6">सभी सक्रिय ग्रुप (Active Groups Sizes)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['A', 'B', 'C', 'D'].map((g) => {
                      const size = getGroupSizes()[g] || 0;
                      const maxCapacity = Math.max(...Object.values(getGroupSizes()), 10) + 5;
                      const percentage = (size / maxCapacity) * 100;
                      
                      const groupColors = {
                        A: { border: 'border-t-teal-500', text: 'text-teal-600', bg: 'bg-teal-500' },
                        B: { border: 'border-t-orange-500', text: 'text-orange-600', bg: 'bg-orange-500' },
                        C: { border: 'border-t-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-500' },
                        D: { border: 'border-t-rose-500', text: 'text-rose-600', bg: 'bg-rose-500' }
                      };
                      const color = groupColors[g] || groupColors.A;

                      return (
                        <div 
                          key={g} 
                          className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 ${color.border} flex flex-col justify-between hover:shadow-md transition-shadow`}
                        >
                          <div>
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-black text-gray-800">ग्रुप {g}</h4>
                              {getSmallestGroup() === g && registrationAutoAssign && (
                                <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2 py-0.5 rounded-full border border-emerald-100">
                                  ★ सबसे छोटा
                                </span>
                              )}
                            </div>
                            <h3 className={`text-4xl font-black mt-4 ${color.text}`}>{size} <span className="text-xs text-gray-400 font-bold">सदस्य</span></h3>
                          </div>
                          
                          <div className="mt-6 space-y-1.5">
                            <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                              <span>ग्रुप डेंसिटी</span>
                              <span>{Math.round(percentage)}%</span>
                            </div>
                            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${color.bg}`} style={{ width: `${percentage}%` }}></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Instructions card */}
                <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 text-sm text-gray-600 leading-relaxed font-semibold">
                  <h4 className="text-gray-800 font-bold mb-2 flex items-center gap-1.5">💡 ग्रुप ऑटो-असाइनमेंट कैसे काम करता है?</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>जब कोई नया सदस्य रजिस्ट्रेशन फॉर्म भरता है, तो वे पेंडिंग लिस्ट में आते हैं।</li>
                    <li>अगर ऑटो-असाइनमेंट चालू है, तो अप्रूव बटन दबाने पर सिस्टम ऑटोमैटिकली यह देखेगा कि ग्रुप A, B, C, D में से किस ग्रुप में सबसे कम सदस्य हैं।</li>
                    <li>सिस्टम उस सदस्य को सीधे उसी सबसे कम सदस्य वाले ग्रुप में असाइन कर देगा, जिससे सभी ग्रुप्स का साइज़ (Size) हमेशा संतुलित (Balanced) बना रहेगा।</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 1: PENDING REGISTRATIONS */}
            {activeTab === 'pending' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold">रजिस्ट्रेशन आवेदन प्रबंधन (Registration Queue)</h3>
                    <p className="text-xs text-amber-100 mt-1">यहाँ नए यूज़र्स द्वारा जमा किए गए रजिस्ट्रेशन की सूची है।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-white/10 backdrop-blur p-1 rounded-xl border border-white/20">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setRegistrationFilter(f)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          registrationFilter === f 
                            ? 'bg-white text-amber-800 shadow-sm' 
                            : 'text-white hover:bg-white/10'
                        }`}
                      >
                        {f === 'PENDING' ? `⏳ लंबित (${pendingList.filter(r => r.status === 'PENDING' || !r.status).length})` :
                         f === 'APPROVED' ? `✅ स्वीकृत (${pendingList.filter(r => r.status === 'APPROVED').length})` :
                         f === 'REJECTED' ? `❌ अस्वीकृत (${pendingList.filter(r => r.status === 'REJECTED').length})` :
                         `🔎 सभी (${pendingList.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {pendingList.filter(r => {
                  const status = r.status || 'PENDING';
                  return registrationFilter === 'ALL' ? true : status === registrationFilter;
                }).length === 0 ? (
                  <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                    <span className="text-5xl">🎉</span>
                    <h4 className="text-lg font-bold mt-4 text-gray-700">कोई आवेदन नहीं है!</h4>
                    <p className="text-sm text-gray-400 mt-1">इस फ़िल्टर के लिए कोई रिकॉर्ड उपलब्ध नहीं है।</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse border-b border-gray-200">
                      <thead>
                        <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                          <th className="py-4 px-5">आवेदन ID</th>
                          <th className="py-4 px-5">आवेदक का नाम / पिता</th>
                          <th className="py-4 px-5">मोबाइल / आधार</th>
                          <th className="py-4 px-5">जिला / ब्लॉक</th>
                          <th className="py-4 px-5">Txn ID / फीस</th>
                          <th className="py-4 px-5 text-center">पेमेंट रसीद</th>
                          <th className="py-4 px-5 text-center">ग्रुप चुनें</th>
                          <th className="py-4 px-5 text-center">स्थिति / कार्यवाही</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-sm font-medium">
                        {pendingList
                          .filter(r => {
                            const status = r.status || 'PENDING';
                            return registrationFilter === 'ALL' ? true : status === registrationFilter;
                          })
                          .map((item) => (
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
                                {(item.status === 'PENDING' || !item.status) ? (
                                  <select 
                                    className="border border-gray-300 rounded-lg p-1.5 text-xs font-bold text-gray-700 bg-gray-50 focus:ring-2 focus:ring-[#087889]"
                                    value={selectedGroups[item.id] || 'A'}
                                    onChange={(e) => setSelectedGroups({...selectedGroups, [item.id]: e.target.value})}
                                  >
                                    {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).map(char => (
                                      <option key={char} value={char}>Group {char}</option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-gray-400 font-bold">Group {item.group || 'A'}</span>
                                )}
                              </td>
                              <td className="py-4 px-5">
                                {(item.status === 'PENDING' || !item.status) ? (
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
                                ) : (
                                  <div className="text-center">
                                    <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${
                                      item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {item.status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'}
                                    </span>
                                  </div>
                                )}
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
                <div className="p-6 bg-[#087889] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold">स्वीकृत सदस्य (Approved Member List)</h3>
                    <p className="text-xs text-teal-100 mt-1">यह डेटा आपकी मुख्य वेबसाइट के /member-list पेज पर प्रदर्शित हो रहा है।</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleExportMembers} 
                      className="px-4 py-2 bg-white text-[#087889] hover:bg-teal-50 text-xs font-black rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      📥 Excel/CSV डाउनलोड
                    </button>
                    <span className="bg-teal-800 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-inner">
                      {approvedList.length} कुल सदस्य
                    </span>
                  </div>
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
                          <th className="py-4 px-5 text-center">विवरण (View)</th>
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
                            <td className="py-4 px-5 text-center">
                              <button 
                                onClick={() => setSelectedMemberForDetail(m)}
                                className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto"
                              >
                                👁️ View
                              </button>
                            </td>
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
                <div className="p-6 bg-[#f08519] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold">वार्षिक दान रिकॉर्ड (Annual Donations)</h3>
                    <p className="text-xs text-orange-100 mt-1">रजिस्ट्रेशन शुल्क एवं अन्य दान रिकॉर्ड।</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleExportDonations} 
                      className="px-4 py-2 bg-white text-[#f08519] hover:bg-orange-50 text-xs font-black rounded-xl shadow transition-colors flex items-center gap-1.5"
                    >
                      📥 Excel/CSV डाउनलोड
                    </button>
                    <span className="bg-orange-800 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-inner">
                      {donationsList.length} डोनेशन रिकॉर्ड्स
                    </span>
                  </div>
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



            {/* TAB: HOME ALERTS */}
            {activeTab === 'home_alerts' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-4">
                    <h3 className="text-xl font-extrabold text-gray-800">नया होम पेज अलर्ट बनाएँ</h3>
                  </div>
                  <form onSubmit={handleCreateHomeAlert} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">अलर्ट प्रकार (Alert Type)</label>
                      <select 
                        required
                        value={newHomeAlert.type || 'beti'} 
                        onChange={(e) => setNewHomeAlert({...newHomeAlert, type: e.target.value})} 
                        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-semibold text-gray-700"
                      >
                        <option value="beti">बेटी विवाह सहायता योजना</option>
                        <option value="nidhan">मृत्यु सहायता योजना</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">Group</label>
                      <select 
                        required 
                        value={newHomeAlert.group} 
                        onChange={(e) => setNewHomeAlert({...newHomeAlert, group: e.target.value})} 
                        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-semibold text-gray-700"
                      >
                        <option value="">ग्रुप चुनें (Select Group)</option>
                        {Array.from({length: 26}, (_, i) => String.fromCharCode(65 + i)).map(char => (
                          <option key={char} value={char}>Group {char}</option>
                        ))}
                      </select>
                    </div>
                    <div><label className="block text-gray-700 font-bold mb-1">सदस्य का नाम</label><input type="text" required value={newHomeAlert.member} onChange={(e) => setNewHomeAlert({...newHomeAlert, member: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div><label className="block text-gray-700 font-bold mb-1">यूनिक आईडी</label><input type="text" required value={newHomeAlert.uniqueId} onChange={(e) => setNewHomeAlert({...newHomeAlert, uniqueId: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    
                    <div><label className="block text-gray-700 font-bold mb-1">सदस्यता तिथि</label><input type="text" required value={newHomeAlert.date} onChange={(e) => setNewHomeAlert({...newHomeAlert, date: e.target.value})} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div><label className="block text-gray-700 font-bold mb-1">जिला, ब्लॉक</label><input type="text" required value={newHomeAlert.address} onChange={(e) => setNewHomeAlert({...newHomeAlert, address: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        {newHomeAlert.type === 'nidhan' ? "मृतक का नाम" : "बेटी का नाम"}
                      </label>
                      <input type="text" required value={newHomeAlert.daughter} onChange={(e) => setNewHomeAlert({...newHomeAlert, daughter: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        {newHomeAlert.type === 'nidhan' ? "निधन तिथि" : "विवाह तिथि"}
                      </label>
                      <input type="text" required value={newHomeAlert.marriageDate} onChange={(e) => setNewHomeAlert({...newHomeAlert, marriageDate: e.target.value})} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/>
                    </div>
                    <div><label className="block text-gray-700 font-bold mb-1">A/C Name</label><input type="text" required value={newHomeAlert.accName} onChange={(e) => setNewHomeAlert({...newHomeAlert, accName: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div><label className="block text-gray-700 font-bold mb-1">A/C Number</label><input type="text" required value={newHomeAlert.accNo} onChange={(e) => setNewHomeAlert({...newHomeAlert, accNo: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    
                    <div><label className="block text-gray-700 font-bold mb-1">IFSC</label><input type="text" required value={newHomeAlert.ifsc} onChange={(e) => setNewHomeAlert({...newHomeAlert, ifsc: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div><label className="block text-gray-700 font-bold mb-1">Branch</label><input type="text" required value={newHomeAlert.branch} onChange={(e) => setNewHomeAlert({...newHomeAlert, branch: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div><label className="block text-gray-700 font-bold mb-1">Bank Name</label><input type="text" required value={newHomeAlert.bank} onChange={(e) => setNewHomeAlert({...newHomeAlert, bank: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    
                    <div><label className="block text-gray-700 font-bold mb-1">Minimum Support</label><input type="text" required value={newHomeAlert.minSupport} onChange={(e) => setNewHomeAlert({...newHomeAlert, minSupport: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]"/></div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">QR Code Image</label>
                      <input type="file" accept="image/*" onChange={handleQrUpload} className="w-full px-3 py-1.5 border rounded-lg text-sm bg-gray-50"/>
                      {newHomeAlert.qrCodeBase64 && <span className="text-xs text-green-600 mt-1 block">✅ Image Attached</span>}
                    </div>

                    <div className="md:col-span-3 mt-4 text-right border-t border-gray-100 pt-4">
                      <button type="submit" className="px-6 py-2.5 bg-[#087889] text-white font-bold rounded-lg shadow hover:bg-[#06616e] transition-colors">
                        अलर्ट सेव करें
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 overflow-x-auto">
                  <h3 className="text-xl font-extrabold text-gray-800 mb-4">मौजूदा अलर्ट्स (Manage Alerts)</h3>
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-3 px-4">Group</th>
                        <th className="py-3 px-4">अलर्ट प्रकार (Type)</th>
                        <th className="py-3 px-4">सदस्य</th>
                        <th className="py-3 px-4">तिथि (Date)</th>
                        <th className="py-3 px-4 text-center">QR</th>
                        <th className="py-3 px-4 text-center">होम पेज स्टेटस</th>
                        <th className="py-3 px-4 text-center">एक्शन</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {homeAlertsList.map(alert => (
                        <tr key={alert.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-bold text-[#087889]">Group - {alert.group}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${alert.type === 'nidhan' ? 'bg-red-100 text-red-700' : 'bg-pink-100 text-pink-700'}`}>
                              {alert.type === 'nidhan' ? 'निधन सहायता' : 'बेटी विवाह'}
                            </span>
                          </td>
                          <td className="py-3 px-4">{alert.member} <br/><span className="text-xs text-gray-500">{alert.uniqueId}</span></td>
                          <td className="py-3 px-4">
                            {alert.marriageDate} <br/>
                            <span className="text-xs text-gray-400">
                              {alert.type === 'nidhan' ? 'निधन व्यक्ति: ' : 'बेटी: '} {alert.daughter}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {alert.qrCodeBase64 ? <button onClick={() => setSelectedReceipt(alert.qrCodeBase64)} className="text-blue-600 underline text-xs">View QR</button> : <span className="text-gray-400 text-xs">No QR</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button 
                              onClick={() => handleToggleHomeAlert(alert.id, alert.isActive)}
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors ${alert.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {alert.isActive ? '✅ Live (दिख रहा है)' : '❌ Hidden (छिपा है)'}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button onClick={() => handleDeleteHomeAlert(alert.id)} className="text-red-500 hover:text-red-700 p-2" title="Delete">🗑️</button>
                          </td>
                        </tr>
                      ))}
                      {homeAlertsList.length === 0 && <tr><td colSpan="7" className="text-center py-6 text-gray-500">कोई अलर्ट मौजूद नहीं है</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: BETI RECEIPTS VERIFICATION */}
            {activeTab === 'beti_receipts' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">बेटी विवाह सहयोग रसीदें (Beti Sahyog Receipts)</h3>
                      <button 
                        onClick={() => handleExportReceipts('beti')} 
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        📥 Excel/CSV
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा अपलोड की गई सहयोग भुगतान रसीदों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setBetiFilter(f)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          betiFilter === f 
                            ? 'bg-[#087889] text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        {f === 'PENDING' ? `⏳ लंबित (${betiReceiptsList.filter(r => r.status === 'PENDING').length})` :
                         f === 'APPROVED' ? `✅ स्वीकृत (${betiReceiptsList.filter(r => r.status === 'APPROVED').length})` :
                         f === 'REJECTED' ? `❌ अस्वीकृत (${betiReceiptsList.filter(r => r.status === 'REJECTED').length})` :
                         `🔎 सभी (${betiReceiptsList.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                        <th className="py-3 px-4">लाभार्थी (Beneficiary)</th>
                        <th className="py-3 px-4">ट्रांजेक्शन (Transaction Details)</th>
                        <th className="py-3 px-4 text-center">भुगतान रसीद</th>
                        <th className="py-3 px-4 text-center">स्थिति (Status)</th>
                        <th className="py-3 px-4 text-right">एक्शन</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {betiReceiptsList
                        .filter(r => betiFilter === 'ALL' ? true : r.status === betiFilter)
                        .map((receipt) => (
                          <tr key={receipt.id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-4">
                              <span className="font-bold text-gray-800">{receipt.donorName}</span>
                              <div className="text-xs text-gray-500 font-semibold mt-0.5">ID: {receipt.donorUniqueId} | Mob: {receipt.donorMobile}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-teal-700">{receipt.beneficiaryName}</span>
                              <div className="text-xs text-gray-500 font-semibold mt-0.5">ID: {receipt.beneficiaryUniqueId} | Group: {receipt.group}</div>
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-gray-600">
                              <div>Amt: <span className="text-teal-700 font-extrabold">₹ {receipt.amount}</span></div>
                              <div className="mt-1 font-mono text-[10px] break-all">Txn: {receipt.transactionId}</div>
                              <div className="text-gray-400 font-medium mt-0.5">Date: {receipt.date}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {receipt.receiptImage ? (
                                <button 
                                  onClick={() => setSelectedReceiptForDetail(receipt)}
                                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                                >
                                  👁️ विवरण एवं रसीद (Detail)
                                </button>
                              ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${
                                receipt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                receipt.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {receipt.status === 'APPROVED' ? 'स्वीकृत' :
                                 receipt.status === 'REJECTED' ? 'अस्वीकृत' :
                                 'लंबित'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {receipt.status !== 'APPROVED' && (
                                  <button 
                                    onClick={() => handleBetiReceiptAction(receipt.id, 'APPROVED')} 
                                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                                    title="Approve"
                                  >
                                    ✅
                                  </button>
                                )}
                                {receipt.status !== 'REJECTED' && (
                                  <button 
                                    onClick={() => handleBetiReceiptAction(receipt.id, 'REJECTED')} 
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                                    title="Reject"
                                  >
                                    ❌
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      {betiReceiptsList.filter(r => betiFilter === 'ALL' ? true : r.status === betiFilter).length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                            इस फिल्टर के लिए कोई रसीद नहीं है
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: NIDHAN RECEIPTS VERIFICATION */}
            {activeTab === 'nidhan_receipts' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">मृत्यु सहयोग रसीदें (Nidhan Sahyog Receipts)</h3>
                      <button 
                        onClick={() => handleExportReceipts('nidhan')} 
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1"
                      >
                        📥 Excel/CSV
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा अपलोड की गई सहयोग भुगतान रसीदों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setNidhanFilter(f)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                          nidhanFilter === f 
                            ? 'bg-[#087889] text-white shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                        }`}
                      >
                        {f === 'PENDING' ? `⏳ लंबित (${nidhanReceiptsList.filter(r => r.status === 'PENDING').length})` :
                         f === 'APPROVED' ? `✅ स्वीकृत (${nidhanReceiptsList.filter(r => r.status === 'APPROVED').length})` :
                         f === 'REJECTED' ? `❌ अस्वीकृत (${nidhanReceiptsList.filter(r => r.status === 'REJECTED').length})` :
                         `🔎 सभी (${nidhanReceiptsList.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                        <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                        <th className="py-3 px-4">लाभार्थी (Beneficiary)</th>
                        <th className="py-3 px-4">ट्रांजेक्शन (Transaction Details)</th>
                        <th className="py-3 px-4 text-center">भुगतान रसीद</th>
                        <th className="py-3 px-4 text-center">स्थिति (Status)</th>
                        <th className="py-3 px-4 text-right">एक्शन</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm font-medium">
                      {nidhanReceiptsList
                        .filter(r => nidhanFilter === 'ALL' ? true : r.status === nidhanFilter)
                        .map((receipt) => (
                          <tr key={receipt.id} className="hover:bg-gray-50/50">
                            <td className="py-3 px-4">
                              <span className="font-bold text-gray-800">{receipt.donorName}</span>
                              <div className="text-xs text-gray-500 font-semibold mt-0.5">ID: {receipt.donorUniqueId} | Mob: {receipt.donorMobile}</div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold text-teal-700">{receipt.beneficiaryName}</span>
                              <div className="text-xs text-gray-500 font-semibold mt-0.5">ID: {receipt.beneficiaryUniqueId} | Group: {receipt.group}</div>
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-gray-600">
                              <div>Amt: <span className="text-teal-700 font-extrabold">₹ {receipt.amount}</span></div>
                              <div className="mt-1 font-mono text-[10px] break-all">Txn: {receipt.transactionId}</div>
                              <div className="text-gray-400 font-medium mt-0.5">Date: {receipt.date}</div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              {receipt.receiptImage ? (
                                <button 
                                  onClick={() => setSelectedReceiptForDetail(receipt)}
                                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors"
                                >
                                  👁️ विवरण एवं रसीद (Detail)
                                </button>
                              ) : (
                                <span className="text-gray-400 text-xs">No Image</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${
                                receipt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                receipt.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {receipt.status === 'APPROVED' ? 'स्वीकृत' :
                                 receipt.status === 'REJECTED' ? 'अस्वीकृत' :
                                 'लंबित'}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex justify-end gap-2">
                                {receipt.status !== 'APPROVED' && (
                                  <button 
                                    onClick={() => handleNidhanReceiptAction(receipt.id, 'APPROVED')} 
                                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" 
                                    title="Approve"
                                  >
                                    ✅
                                  </button>
                                )}
                                {receipt.status !== 'REJECTED' && (
                                  <button 
                                    onClick={() => handleNidhanReceiptAction(receipt.id, 'REJECTED')} 
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" 
                                    title="Reject"
                                  >
                                    ❌
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      {nidhanReceiptsList.filter(r => nidhanFilter === 'ALL' ? true : r.status === nidhanFilter).length === 0 && (
                        <tr>
                          <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                            इस फिल्टर के लिए कोई रसीद नहीं है
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: HOME SETTINGS */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">होम पेज सेटिंग्स (Manage Home Settings)</h3>
                    <p className="text-xs text-gray-500 mt-1">यहाँ से आप मुख्य वेबसाइट के होम पेज शीर्षक, अलर्ट्स और निर्देशों को बदल सकते हैं।</p>
                  </div>
                </div>

                <form onSubmit={handleSaveHomeSettings} className="space-y-6 text-sm">
                  {/* 1. Header Banner Title */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <span>🏷️</span> मुख्य बैनर शीर्षक (Header Banner Title)
                    </h4>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">मुख्य शीर्षक (Main Banner Title)</label>
                      <select 
                        required 
                        value={homeSettings.headerTitle} 
                        onChange={(e) => setHomeSettings({...homeSettings, headerTitle: e.target.value})} 
                        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-bold text-gray-800"
                      >
                        <option value="बेटी विवाह सहायता योजना">👩 बेटी विवाह सहायता योजना (Beti Vivah Sahyog Yojna)</option>
                        <option value="निधन सहायता योजना">🕊️ निधन सहायता योजना (Nidhan Sahyog Yojna)</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Alert Box Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <span>🔔</span> सहयोग अलर्ट बॉक्स (Cooperation Alert Box)
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">अलर्ट बॉक्स शीर्षक (Alert Box Title)</label>
                        <input 
                          type="text" 
                          required 
                          value={homeSettings.alertTitle} 
                          onChange={(e) => setHomeSettings({...homeSettings, alertTitle: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                          placeholder="जैसे: सहयोग अलर्ट - 1"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">अलर्ट बिंदु / विवरण (Alert Points - एक लाइन में एक बिंदु लिखें)</label>
                        <textarea 
                          required 
                          rows={4}
                          value={homeSettings.alertPoints} 
                          onChange={(e) => setHomeSettings({...homeSettings, alertPoints: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                          placeholder="सहयोग की अंतिम तिथि: 10 जुलाई से 26 जुलाई 2026 तक&#10;नियम: 1 ट्रांजेक्शन = 1 रसीद अपलोड"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Instructions Box Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <span>💡</span> महत्वपूर्ण निर्देश बॉक्स (Instructions Box)
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">निर्देश शीर्षक (Instruction Title)</label>
                        <input 
                          type="text" 
                          required 
                          value={homeSettings.instructionTitle} 
                          onChange={(e) => setHomeSettings({...homeSettings, instructionTitle: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                          placeholder="जैसे: महत्वपूर्ण निर्देश"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">मुख्य निर्देश विवरण (Instruction Details)</label>
                        <textarea 
                          required 
                          rows={4}
                          value={homeSettings.instructionText} 
                          onChange={(e) => setHomeSettings({...homeSettings, instructionText: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                          placeholder="वेबसाइट पर अपना आधार कार्ड नंबर और पासवर्ड डालकर LOGIN करें..."
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">निर्देश नोट (Note - हाइलाइटेड संदेश)</label>
                        <textarea 
                          required 
                          rows={3}
                          value={homeSettings.instructionNote} 
                          onChange={(e) => setHomeSettings({...homeSettings, instructionNote: e.target.value})} 
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                          placeholder="नोट: किसी अन्य GROUP में भेजा गया सहयोग मान्य नहीं होगा..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right border-t border-gray-100 pt-4">
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-[#087889] text-white font-extrabold rounded-xl shadow-md hover:bg-[#06616e] transition-all transform hover:-translate-y-0.5"
                    >
                      💾 सेटिंग्स सहेजें (Save Settings)
                    </button>
                  </div>
                </form>
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

      {/* ================= MEMBER DETAIL MODAL ================= */}
      {selectedMemberForDetail && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative border border-gray-100 my-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <div>
                <h4 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">👤</span> सदस्य का पूरा विवरण (Member Profile Details)
                </h4>
                <p className="text-xs text-gray-500 mt-1">यूनिक ID: <span className="font-mono font-bold text-[#087889]">{selectedMemberForDetail.uniqueId}</span> | ग्रुप: {selectedMemberForDetail.group || 'A'}</p>
              </div>
              <button 
                onClick={() => setSelectedMemberForDetail(null)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            
            {/* Body - Grid Layout */}
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-left">
              
              {/* Personal Information */}
              <div>
                <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>ℹ️</span> व्यक्तिगत जानकारी (Personal Information)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium">नाम (Full Name)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">पिता/पति का नाम (Father/Husband Name)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.fatherName || selectedMemberForDetail.fatherOrHusbandName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">जन्म तिथि (Date of Birth)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.dob || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">लिंग (Gender)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.gender || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">मोबाइल नंबर (Mobile No.)</p>
                    <p className="font-bold text-[#087889] text-sm mt-0.5">📞 {selectedMemberForDetail.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">आधार नंबर (Aadhaar Number)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.aadhaar || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ईमेल (Email Address)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">व्यवसाय/पेशा (Occupation)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.occupation || selectedMemberForDetail.business || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">कार्यरत कार्यालय (Working Office)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.workingOffice || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div>
                <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>📍</span> पते का विवरण (Address Details)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium">राज्य (State)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.state || 'Uttar Pradesh'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">जिला (District)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.district || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ब्लॉक (Block)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.block || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-3">
                    <p className="text-gray-500 font-medium">पूरा पता (Full Address)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.address || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Nominee Details */}
              <div>
                <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>👥</span> नॉमिनी विवरण (Nominee Details)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium">नॉमिनी का नाम (Nominee Name)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.nomineeName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">सदस्य से संबंध (Relation)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.nomineeRelation || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">नॉमिनी मोबाइल नंबर (Nominee Mobile)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.nomineeMobile || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Registration & Payment Info */}
              <div>
                <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>💳</span> रजिस्ट्रेशन एवं भुगतान (Registration & Payment Info)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <p className="text-gray-500 font-medium">ट्रांजेक्शन ID (Transaction ID)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.transactionId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">जमा शुल्क (Amount Paid)</p>
                    <p className="font-bold text-emerald-600 text-sm mt-0.5">₹ {selectedMemberForDetail.amount || 200}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">रेफरल कोड (Referral Code)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.referralCode || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">आवेदन तिथि (Registration Date)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedMemberForDetail.submittedAt ? new Date(selectedMemberForDetail.submittedAt).toLocaleString() : (selectedMemberForDetail.joinedDate || 'N/A')}</p>
                  </div>
                  {selectedMemberForDetail.receiptUrl && (
                    <div className="md:col-span-2">
                      <p className="text-gray-500 font-medium mb-1">भुगतान रसीद (Payment Receipt)</p>
                      <a 
                        href={selectedMemberForDetail.receiptUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        🔗 रसीद नई टैब में खोलें (Open Receipt in New Tab)
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Receipt Image Preview if present */}
              {selectedMemberForDetail.receiptUrl && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                  <p className="text-xs text-gray-500 font-bold mb-2">पेमेंट रसीद प्रीव्यू (Receipt Preview)</p>
                  <div className="w-full max-h-48 flex items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <img 
                      src={selectedMemberForDetail.receiptUrl} 
                      alt="Receipt Preview" 
                      className="max-h-48 object-contain cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        setSelectedReceipt(selectedMemberForDetail.receiptUrl);
                        setSelectedMemberForDetail(null);
                      }}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Footer buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button 
                onClick={() => setSelectedMemberForDetail(null)}
                className="px-6 py-3 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DETAILED RECEIPT DIALOG MODAL ================= */}
      {selectedReceiptForDetail && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-gray-100 my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">🧾</span> सहयोग रसीद विवरण (Donation Receipt Details)
              </h4>
              <button 
                onClick={() => setSelectedReceiptForDetail(null)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
              {/* Donor Details */}
              <div>
                <h5 className="text-xs font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>👤</span> सहयोगकर्ता विवरण (Donor Details)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-gray-500 font-medium">सहयोगी का नाम (Name)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptForDetail.donorName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">यूनिक आईडी (Unique ID)</p>
                    <p className="font-bold text-[#f08519] text-sm mt-0.5 font-mono">{selectedReceiptForDetail.donorUniqueId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">मोबाइल नंबर (Mobile)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">📞 {selectedReceiptForDetail.donorMobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">आधार नंबर (Aadhaar)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedReceiptForDetail.donorAadhaar || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">जिला (District)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptForDetail.donorDistrict || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ब्लॉक (Block)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptForDetail.donorBlock || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div>
                <h5 className="text-xs font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>👥</span> लाभार्थी विवरण (Beneficiary Details)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-gray-500 font-medium">सहायता प्राप्तकर्ता (Name)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptForDetail.beneficiaryName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">यूनिक आईडी (Unique ID)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedReceiptForDetail.beneficiaryUniqueId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">ग्रुप (Group)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">Group {selectedReceiptForDetail.group}</p>
                  </div>
                </div>
              </div>

              {/* Transaction Details */}
              <div>
                <h5 className="text-xs font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <span>💳</span> ट्रांजेक्शन विवरण (Transaction Details)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold">
                  <div>
                    <p className="text-gray-500 font-medium">ट्रांजेक्शन ID (Transaction ID)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedReceiptForDetail.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">सहयोग राशि (Amount Paid)</p>
                    <p className="font-bold text-emerald-600 text-sm mt-0.5">₹ {selectedReceiptForDetail.amount}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">सहयोग तिथि (Donation Date)</p>
                    <p className="font-bold text-gray-900 text-sm mt-0.5">{selectedReceiptForDetail.date}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Screenshot Preview */}
              {selectedReceiptForDetail.receiptImage && (
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                  <p className="text-xs text-gray-500 font-bold mb-2">भुगतान स्क्रीनशॉट (Receipt Screenshot)</p>
                  <div className="w-full max-h-72 flex items-center justify-center overflow-y-auto rounded-xl border border-gray-200 bg-white p-2">
                    <img 
                      src={selectedReceiptForDetail.receiptImage} 
                      alt="Receipt Screenshot" 
                      className="max-h-64 object-contain rounded cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => window.open(selectedReceiptForDetail.receiptImage, '_blank')}
                    />
                  </div>
                  <a 
                    href={selectedReceiptForDetail.receiptImage} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 transition-colors mt-2"
                  >
                    🔗 रसीद नए टैब में फुल साइज में खोलें (View Full Size)
                  </a>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button 
                onClick={() => setSelectedReceiptForDetail(null)}
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
