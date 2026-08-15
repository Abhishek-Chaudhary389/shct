import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getPendingRegistrations, 
  getApprovedMembers, 
  getHomeAlerts, 
  addBetiSahyogReceipt, 
  getBetiSahyogReceipts,
  addNidhanSahyogReceipt,
  getNidhanSahyogReceipts
} from '../../services/dataService';
import html2canvas from 'html2canvas';
import { compressImage } from '../../utils/imageCompressor';

const normalizeGroup = (groupStr) => {
  if (!groupStr) return '';
  let cleaned = String(groupStr).trim().toUpperCase();
  if (cleaned.startsWith('GROUP')) {
    cleaned = cleaned.replace(/^GROUP\s*[-_]?\s*/, '');
  }
  return cleaned;
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [submittedReceiptsList, setSubmittedReceiptsList] = useState([]);
  const [submittedNidhanReceiptsList, setSubmittedNidhanReceiptsList] = useState([]);
  const [selectedAlertForReceipt, setSelectedAlertForReceipt] = useState(null);

  const [user, setUser] = useState({
    name: '',
    group: '',
    aadhaar: '',
    fatherName: '',
    dob: '',
    mobile: '',
    email: '',
    gender: '',
    business: '',
    workingOffice: '',
    state: '',
    district: '',
    block: '',
    address: '',
    nomineeName: '',
    nomineeRelation: '',
    nomineeMobile: '',
    referralCode: '',
    transactionId: '',
    uniqueId: '',
    registeredOn: ''
  });

  useEffect(() => {
    const fetchUserAndAlerts = async () => {
      const savedAadhaar = localStorage.getItem('userAadhaar');
      if (savedAadhaar) {
        const pendingList = await getPendingRegistrations();
        const approvedList = await getApprovedMembers();
        
        // Check in approved first, then pending
        let foundUser = approvedList.find(u => u.aadhaar === savedAadhaar);
        let isPending = false;
        
        if (!foundUser) {
          foundUser = pendingList.find(u => u.aadhaar === savedAadhaar);
          if(foundUser) isPending = true;
        }

        if (foundUser) {
          setUser({
            name: foundUser.name || '',
            group: isPending ? 'Pending' : (foundUser.group ? `Group ${foundUser.group}` : 'Group A'),
            aadhaar: foundUser.aadhaar || '',
            fatherName: foundUser.fatherName || '',
            dob: foundUser.dob || '',
            mobile: foundUser.mobile || '',
            email: foundUser.email || '',
            gender: foundUser.gender || '',
            business: foundUser.occupation || foundUser.business || '',
            workingOffice: foundUser.workingOffice || '',
            state: foundUser.state || 'Uttar Pradesh',
            district: foundUser.district || '',
            block: foundUser.block || '',
            address: foundUser.address || '',
            nomineeName: foundUser.nomineeName || '',
            nomineeRelation: foundUser.nomineeRelation || '',
            nomineeMobile: foundUser.nomineeMobile || '',
            referralCode: foundUser.referralCode || '',
            transactionId: foundUser.transactionId || '',
            uniqueId: isPending ? 'Pending' : (foundUser.uniqueId || ''),
            registeredOn: foundUser.submittedAt ? new Date(foundUser.submittedAt).toLocaleString() : ''
          });

          // Fetch all alerts
          const allAlerts = await getHomeAlerts();
          // Filter active alerts for this user's group
          const userRawGroup = normalizeGroup(foundUser.group || 'A');
          const myActiveAlerts = allAlerts.filter(alert => 
            alert.isActive && 
            alert.group && 
            normalizeGroup(alert.group) === userRawGroup
          );
          setActiveAlerts(myActiveAlerts);

          // Fetch all receipts
          const receipts = await getBetiSahyogReceipts();
          setSubmittedReceiptsList(receipts);

          const nidhanReceipts = await getNidhanSahyogReceipts();
          setSubmittedNidhanReceiptsList(nidhanReceipts);
        }
      }
    };
    
    fetchUserAndAlerts();
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleHelpClick = (alert) => {
    setSelectedAlertForReceipt(alert);
    if (alert.type === 'nidhan') {
      setActiveTab('upload_death');
    } else {
      setActiveTab('upload_beti');
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'idcard', label: 'ID Card', icon: '🪪' },
    { id: 'upload_death', label: 'Upload Nidhan Receipt', icon: '☁️' },
    { id: 'view_sahyog', label: 'View All Nidhan / Sahyog List', icon: '📚' },
    { id: 'upload_beti', label: 'Upload Beti Vivah Sahyog Receipt', icon: '☁️' },
    { id: 'view_beti', label: 'View All Beti Vivah Sahyog List', icon: '📚' },
    { id: 'upload_varshik', label: 'Upload Varshik Dan', icon: '☁️' },
    { id: 'view_varshik', label: 'View All Varshik Dan Suchi', icon: '📑' },
    { id: 'referral', label: 'Referral Points', icon: '👥' },
    { id: 'password', label: 'Update Password', icon: '👁️' },
  ];

  // ================= VIEWS =================

  const DashboardView = () => (
    <div className="p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#7c69c9] rounded-lg p-8 flex items-center justify-between text-white shadow-sm relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-wide relative z-10">WELCOME TO FAST RELIEF CHARITABLE TRUST</h2>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center relative z-10">
          <span className="text-3xl text-white">📦</span>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent transform -skew-x-12 translate-x-8"></div>
      </div>

      {/* Group Cooperation Alerts Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span>🔔</span> आपके ग्रुप के सक्रिय सहयोग अलर्ट (Active Alerts for {user.group})
        </h3>

        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <span className="text-4xl mb-3 block">🎉</span>
            <p className="text-gray-600 font-bold text-lg">आपके ग्रुप ({user.group}) में वर्तमान में कोई सक्रिय सहयोग अलर्ट नहीं है।</p>
            <p className="text-gray-400 text-sm mt-1">जब एडमिन आपके ग्रुप के लिए नया सहयोग अलर्ट लाइव करेगा, तो उसका विवरण यहाँ दिखाई देगा।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {activeAlerts.map((alert, idx) => (
              <div 
                key={idx} 
                className="bg-[#f2fafe] border-l-[8px] border-[#087889] rounded-r-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-4 mb-6">
                  <h4 className="text-xl md:text-2xl font-black text-[#087889] uppercase">
                    GROUP - {alert.group} (सहयोग अलर्ट)
                  </h4>
                  <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    Active (सक्रिय)
                  </span>
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Beneficiary Details */}
                  <div className="space-y-3 bg-white p-5 rounded-xl border border-blue-50/60 shadow-sm">
                    <h5 className="font-extrabold text-gray-800 border-b border-gray-100 pb-2 text-base flex items-center gap-2">
                      <span>👤</span> लाभार्थी का विवरण (Beneficiary Info)
                    </h5>
                    <div className="space-y-2 text-gray-700 text-sm font-semibold">
                      <p><span className="text-gray-400 font-bold">नाम:</span> {alert.member}</p>
                      <p><span className="text-gray-400 font-bold">यूनिक आईडी:</span> {alert.uniqueId}</p>
                      <p><span className="text-gray-400 font-bold">सदस्यता तिथि:</span> {alert.date}</p>
                      <p><span className="text-gray-400 font-bold">पता:</span> {alert.address}</p>
                      {alert.type === 'nidhan' ? (
                        <>
                          <p><span className="text-gray-400 font-bold">मृतक का नाम:</span> {alert.daughter}</p>
                          <p><span className="text-gray-400 font-bold">निधन तिथि:</span> {alert.marriageDate}</p>
                        </>
                      ) : (
                        <>
                          <p><span className="text-gray-400 font-bold">बेटी का नाम:</span> {alert.daughter}</p>
                          <p><span className="text-gray-400 font-bold">विवाह तिथि:</span> {alert.marriageDate}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bank Details */}
                  <div className="space-y-3 bg-white p-5 rounded-xl border border-blue-50/60 shadow-sm">
                    <h5 className="font-extrabold text-[#f08519] border-b border-gray-100 pb-2 text-base flex items-center gap-2">
                      <span>💳</span> सहयोग बैंक खाता विवरण (Bank Details)
                    </h5>
                    <div className="space-y-2 text-gray-700 text-sm font-semibold uppercase">
                      <p><span className="text-gray-400 font-bold normal-case">Account Name:</span> {alert.accName}</p>
                      <p><span className="text-gray-400 font-bold normal-case">Account No:</span> {alert.accNo}</p>
                      <p><span className="text-gray-400 font-bold normal-case">IFSC:</span> {alert.ifsc}</p>
                      <p><span className="text-gray-400 font-bold normal-case">Branch:</span> {alert.branch}</p>
                      <p><span className="text-gray-400 font-bold normal-case">Bank:</span> {alert.bank}</p>
                      <p className="text-[#f08519] font-black text-sm mt-3 normal-case">न्यूनतम सहयोग राशि: {alert.minSupport || '50 रुपए'}</p>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                {alert.qrCodeBase64 && (
                  <div className="mt-8 flex flex-col items-center justify-center p-6 bg-white rounded-xl border border-gray-200/50 shadow-sm max-w-sm mx-auto">
                    <div className="text-base font-extrabold text-gray-800 mb-1">{alert.accName}</div>
                    <div className="text-xs font-bold text-gray-500 mb-4 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">Scan & Pay (UPI)</div>
                    <div className="w-44 h-44 bg-gray-50 flex items-center justify-center p-2 rounded-lg border-2 border-dashed border-gray-200">
                      <img src={alert.qrCodeBase64} alt="QR Code" className="h-full w-full object-contain" />
                    </div>
                    <div className="text-xs font-semibold text-gray-400 mt-4 text-center px-2">
                      स्कैन करने के लिए किसी भी UPI ऐप (Paytm, GPay, PhonePe) का उपयोग करें
                    </div>
                  </div>
                )}

                {/* Help Button */}
                <div className="mt-8 text-center border-t border-blue-100 pt-6">
                  <button 
                    onClick={() => handleHelpClick(alert)}
                    className="bg-[#f08519] hover:bg-orange-600 text-white font-extrabold px-8 py-3 rounded-xl shadow-md transition-all transform hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                    🤝 सहयोग रसीद अपलोड करें (Upload Help Receipt)
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ProfileView = () => (
    <div className="p-6">
      <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
        <span>User</span> <span>›</span> <span className="font-medium text-gray-700">Edit User</span>
      </div>
      
      <div className="bg-[#fff8e6] text-[#b8860b] p-4 rounded-md text-sm font-medium mb-6">
        Restricted fields can only be edited within the first 7 days after registration. This period has expired.
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
            <input type="text" value={user.name} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Aadhar Card Number</label>
            <input type="text" value={user.aadhaar} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Father Name</label>
            <input type="text" value={user.fatherName} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">DOB</label>
            <input type="text" value={user.dob} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Number</label>
            <input type="text" value={user.mobile} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Gender</label>
            <select disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed">
              <option>{user.gender}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Business</label>
            <select disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed">
              <option>{user.business}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Working Office</label>
            <input type="text" value={user.workingOffice} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">State</label>
            <select disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed">
              <option>{user.state}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">District</label>
            <select disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed">
              <option>{user.district}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Block</label>
            <select disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed">
              <option>{user.block}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Permanent Address</label>
            <input type="text" value={user.address} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nominee Name</label>
            <input type="text" value={user.nomineeName} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nominee Relationship</label>
            <input type="text" value={user.nomineeRelation} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
            <input type="text" value={user.email} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nominee Mobile</label>
            <input type="text" value={user.nomineeMobile} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Referral Code</label>
            <input type="text" value={user.referralCode} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Transaction ID</label>
            <input type="text" value={user.transactionId} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed" />
          </div>
        </div>
      </div>
    </div>
  );

  const downloadIDCard = async () => {
    const cardElement = document.getElementById('printable-id-card');
    if (!cardElement) return;
    
    try {
      // Temporarily remove shadow for cleaner print if desired, but scale 2 gives good quality
      const canvas = await html2canvas(cardElement, {
        scale: 3, 
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `SHCT_ID_${user.uniqueId || 'Pending'}.png`;
      link.click();
    } catch (error) {
      console.error("Error generating ID card:", error);
      alert("ID Card डाउनलोड करने में त्रुटि आई।");
    }
  };

  const IDCardView = () => (
    <div className="p-6 flex flex-col items-center">
      <div className="w-full flex justify-end mb-6 max-w-[350px]">
        <button 
          onClick={downloadIDCard}
          className="bg-[#087889] hover:bg-[#06616e] text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-colors flex items-center gap-2"
        >
          <span>📥</span> Download ID Card
        </button>
      </div>

      {/* Printable ID Card Element */}
      <div 
        id="printable-id-card" 
        className="w-[350px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative"
      >
        {/* Header */}
        <div className="bg-[#087889] p-4 text-center text-white relative">
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mt-4 -mr-4 blur-sm"></div>
          <h2 className="text-lg font-black tracking-tight leading-tight uppercase">Fast Relief</h2>
          <p className="text-[10px] font-bold tracking-widest text-teal-100 mt-0.5 uppercase">Charitable Trust</p>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="text-center mb-5 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 uppercase">{user.name || 'Member Name'}</h3>
            <p className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">S/O, D/O, W/O: {user.fatherName || 'N/A'}</p>
            <p className="text-sm font-bold text-[#f08519] mt-1">{user.uniqueId && user.uniqueId !== 'Pending' ? user.uniqueId : 'ID: Pending'}</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-500">Group:</span>
              <span className="font-black text-gray-800 bg-gray-100 px-2 py-0.5 rounded">{user.group || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-500">Mobile:</span>
              <span className="font-bold text-gray-800">{user.mobile || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-500">District:</span>
              <span className="font-bold text-gray-800">{user.district || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-bold text-gray-500">Joined:</span>
              <span className="font-bold text-gray-800">{user.registeredOn ? user.registeredOn.split(',')[0] : 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Valid Member Identity Card</p>
          <p className="text-[8px] text-gray-400 mt-0.5">www.silenthelp.org</p>
        </div>
      </div>
    </div>
  );
        


  const ViewSahyogList = () => (
    <div className="p-6">
      <h3 className="text-xl font-bold text-[#8a3324] mb-6 border-b border-gray-200 pb-2">Running Sahyog</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Card 1 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h4 className="text-lg font-medium text-[#8a3324] mb-1">Pradumana Vishwakarma | Unique ID : 5332058491</h4>
          <span className="inline-block bg-[#e65c71] text-white text-xs px-2 py-0.5 rounded mb-4">ALERT 4</span>
          <hr className="border-t-2 border-pink-200 mb-4" />
          <div className="space-y-2 text-sm text-gray-700 font-medium mb-6">
            <p>Donated On : 2026-01-13</p>
            <p>Transaction ID : T2601131207378410553575</p>
            <p>Amount : 50</p>
          </div>
          <button className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded text-sm font-medium transition-colors w-max">
            Download Donation Receipt
          </button>
        </div>

        {/* Sample Card 2 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          <h4 className="text-lg font-medium text-[#8a3324] mb-1">RAJESH PANDEY | Unique ID : 2730462085</h4>
          <span className="inline-block bg-[#e65c71] text-white text-xs px-2 py-0.5 rounded mb-4">ALERT 5</span>
          <hr className="border-t-2 border-pink-200 mb-4" />
          <div className="space-y-2 text-sm text-gray-700 font-medium mb-6">
            <p>Donated On : 2026-06-13</p>
            <p>Transaction ID : T2606132303078560304345</p>
            <p>Amount : 50</p>
          </div>
          <button className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded text-sm font-medium transition-colors w-max">
            Download Donation Receipt
          </button>
        </div>
      </div>
    </div>
  );

  const ViewVarshikDanList = () => (
    <div className="p-6">
      <h3 className="text-xl font-bold text-[#8a3324] mb-6">View All Varshik Dan Suchi</h3>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 inline-block">
        <p className="text-lg text-gray-800 font-medium">You had not submitted Vyawastha shulk till now.</p>
      </div>
      <div className="mt-8 text-center text-xs text-gray-400">
        Copyright © 2024 Fast Relief Charitable Trust | All Rights Reserved
      </div>
    </div>
  );

  const UploadBetiReceiptView = () => {
    const activeGroupAlerts = activeAlerts;
    const [selectedAlert, setSelectedAlert] = useState(selectedAlertForReceipt || (activeGroupAlerts.length > 0 ? activeGroupAlerts[0] : null));
    
    const [txnId, setTxnId] = useState('');
    const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('50');
    const [receiptImg, setReceiptImg] = useState('');
    
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
      if (selectedAlertForReceipt) {
        setSelectedAlert(selectedAlertForReceipt);
        const minVal = selectedAlertForReceipt.minSupport ? parseInt(selectedAlertForReceipt.minSupport.replace(/[^0-9]/g, '')) : 50;
        setAmount(isNaN(minVal) ? '50' : String(minVal));
      }
    }, [selectedAlertForReceipt]);

    const handleSelectAlert = (e) => {
      const selectedId = e.target.value;
      const alertItem = activeGroupAlerts.find(a => a.id === selectedId);
      if (alertItem) {
        setSelectedAlert(alertItem);
        const minVal = alertItem.minSupport ? parseInt(alertItem.minSupport.replace(/[^0-9]/g, '')) : 50;
        setAmount(isNaN(minVal) ? '50' : String(minVal));
      }
    };

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const base64 = await compressImage(file);
          setReceiptImg(base64);
        } catch (error) {
          console.error("Error compressing image:", error);
          alert("रसीद कंप्रेस करने में त्रुटि आई।");
        }
      }
    };

    const handleSubmitReceipt = async (e) => {
      e.preventDefault();
      if (!selectedAlert) {
        alert("कृपया एक सक्रिय सहयोग अलर्ट का चयन करें।");
        return;
      }
      if (!receiptImg) {
        alert("कृपया भुगतान स्क्रीनशॉट अपलोड करें।");
        return;
      }

      setIsUploading(true);
      const submissionData = {
        donorName: user.name,
        donorUniqueId: user.uniqueId,
        donorAadhaar: user.aadhaar,
        donorMobile: user.mobile,
        donorDistrict: user.district || '',
        donorBlock: user.block || '',
        beneficiaryName: selectedAlert.member,
        beneficiaryUniqueId: selectedAlert.uniqueId,
        group: selectedAlert.group,
        transactionId: txnId,
        date: txnDate,
        amount: amount,
        receiptImage: receiptImg
      };

      try {
        await addBetiSahyogReceipt(submissionData);
        setIsUploading(false);
        setUploadSuccess(true);
        
        // Refresh local data list
        const receipts = await getBetiSahyogReceipts();
        setSubmittedReceiptsList(receipts);

        setTimeout(() => {
          setUploadSuccess(false);
          setSelectedAlertForReceipt(null); 
          setTxnId('');
          setReceiptImg('');
          setActiveTab('dashboard'); 
        }, 3000);
      } catch (err) {
        console.error(err);
        setIsUploading(false);
        alert("रसीद सबमिट करने में विफल।");
      }
    };

    if (activeGroupAlerts.length === 0) {
      return (
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Running Sahyog</h3>
          <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200 border-dashed">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-gray-500 font-extrabold text-lg">Not Any Sahyog Receipt</p>
            <p className="text-gray-400 text-sm mt-1">वर्तमान में आपके ग्रुप ({user.group}) के लिए कोई सहयोग अलर्ट सक्रिय नहीं है।</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-6 bg-[#087889] text-white px-6 py-2 rounded shadow hover:bg-[#06616e] transition-colors font-bold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-[#087889] mb-6 border-b border-gray-200 pb-2">Upload Beti Vivah Sahyog Receipt</h3>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          {uploadSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">रसीद सफलतापूर्वक अपलोड की गई!</h2>
              <p className="text-gray-600 font-medium">आपकी सहयोग रसीद एडमिन के पास सत्यापन (Verification) के लिए भेज दी गई है।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReceipt} className="space-y-6 text-sm font-semibold">
              
              {/* Beneficiary Details Section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full font-bold text-[#087889] border-b border-blue-200 pb-1.5">
                  लाभार्थी का विवरण (Selected Beneficiary)
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">सहयोग प्राप्तकर्ता</label>
                  {selectedAlertForReceipt ? (
                    <input 
                      type="text" 
                      disabled 
                      value={`${selectedAlert.member} (${selectedAlert.uniqueId})`} 
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <select 
                      value={selectedAlert ? selectedAlert.id : ''} 
                      onChange={handleSelectAlert}
                      className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                    >
                      {activeGroupAlerts.map(a => (
                        <option key={a.id} value={a.id}>{a.member} ({a.uniqueId})</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">ग्रुप (Group)</label>
                  <input type="text" disabled value={selectedAlert ? selectedAlert.group : ''} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              {/* Donor Details Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full font-bold text-gray-700 border-b border-gray-300 pb-1.5">
                  सहयोगकर्ता का विवरण (Your Info)
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">आपका नाम</label>
                  <input type="text" disabled value={user.name} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">यूनिक आईडी</label>
                  <input type="text" disabled value={user.uniqueId} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">ट्रांजेक्शन आईडी (Txn ID) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={txnId} 
                    onChange={(e) => setTxnId(e.target.value)} 
                    placeholder="UPI Txn ID / Ref ID"
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">सहयोग तिथि <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required 
                    value={txnDate} 
                    onChange={(e) => setTxnDate(e.target.value)} 
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">सहयोग राशि (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-gray-700 mb-1">भुगतान रसीद / स्क्रीनशॉट अपलोड करें <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={handleFileChange} 
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none"
                />
                {receiptImg && <span className="text-xs text-green-600 font-bold block mt-1">✅ रसीद संलग्न कर दी गई है</span>}
              </div>

              {/* Submit Button */}
              <div className="text-right border-t border-gray-100 pt-4">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-8 py-3 rounded-lg text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{ backgroundColor: '#f08519' }}
                >
                  {isUploading ? "अपलोड हो रहा है..." : "रसीद जमा करें (Submit)"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const ViewAllBetiSahyogList = () => {
    const approvedReceipts = submittedReceiptsList.filter(r => r.status === 'APPROVED');
    const [selectedDownloadReceipt, setSelectedDownloadReceipt] = useState(null);

    const handleDownloadReceipt = async (receipt) => {
      setSelectedDownloadReceipt(receipt);
      setTimeout(async () => {
        const receiptCard = document.getElementById('printable-donation-receipt');
        if (!receiptCard) return;
        
        try {
          const canvas = await html2canvas(receiptCard, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = `Donation_Receipt_${receipt.transactionId}.png`;
          link.click();
          setSelectedDownloadReceipt(null);
        } catch (error) {
          console.error("Error generating receipt:", error);
          alert("रसीद डाउनलोड करने में असमर्थ।");
          setSelectedDownloadReceipt(null);
        }
      }, 500);
    };

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#8a3324] mb-6 border-b border-gray-200 pb-2">Running Sahyog</h3>
        
        {approvedReceipts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <span className="text-4xl mb-3 block">📑</span>
            <p className="text-gray-500 font-extrabold text-lg">वर्तमान में कोई स्वीकृत सहयोग रसीद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReceipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-[#8a3324] mb-1">{receipt.donorName}</h4>
                <p className="text-xs text-gray-500 font-mono">Unique ID : {receipt.donorUniqueId}</p>
                <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded w-max mt-2">APPROVED</div>
                <hr className="border-t border-gray-100 my-4" />
                <div className="space-y-2 text-sm text-gray-700 font-semibold mb-6">
                  <p><span className="text-gray-400">Donated On:</span> {receipt.date}</p>
                  <p><span className="text-gray-400">Transaction ID:</span> <span className="font-mono text-xs break-all">{receipt.transactionId}</span></p>
                  <p><span className="text-gray-400">Amount:</span> ₹ {receipt.amount}</p>
                  <p><span className="text-gray-400">For:</span> {receipt.beneficiaryName}</p>
                </div>
                <button 
                  onClick={() => handleDownloadReceipt(receipt)}
                  className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto shadow-sm"
                >
                  Download Donation Receipt
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= HIDDEN PRINTABLE RECEIPT TEMPLATE ================= */}
        {selectedDownloadReceipt && (
          <div className="fixed -left-[9999px] top-0">
            <div 
              id="printable-donation-receipt"
              className="w-[450px] bg-white border-[10px] border-double border-teal-800 p-6 font-sans text-gray-800 relative"
            >
              {/* Header */}
              <div className="text-center border-b-2 border-teal-800 pb-4 mb-4">
                <h1 className="text-2xl font-black uppercase text-teal-800 tracking-tight leading-tight">Silent Help Charitable Trust</h1>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Silent Help, Loud Impact</p>
                <p className="text-[9px] text-gray-500 mt-1">Registration No: SHCT/NGO/2024</p>
              </div>

              {/* Receipt Title */}
              <div className="text-center mb-6">
                <span className="bg-teal-50 text-teal-800 border border-teal-800/20 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wide">
                  DONATION RECEIPT (सहयोग रसीद)
                </span>
              </div>

              {/* Body */}
              <div className="space-y-4 text-sm font-semibold mb-6">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Donor Name (सहयोगी का नाम):</span>
                  <span className="text-gray-900 font-bold">{selectedDownloadReceipt.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Donor ID (यूनिक आईडी):</span>
                  <span className="text-gray-900 font-mono font-bold">{selectedDownloadReceipt.donorUniqueId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Beneficiary Name (सहायता प्राप्तकर्ता):</span>
                  <span className="text-gray-900 font-bold">{selectedDownloadReceipt.beneficiaryName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Group (ग्रुप):</span>
                  <span className="text-gray-900 font-bold">Group {selectedDownloadReceipt.group}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Transaction ID (Txn ID):</span>
                  <span className="text-gray-900 font-mono font-bold text-xs">{selectedDownloadReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Date of Donation (सहयोग तिथि):</span>
                  <span className="text-gray-900">{selectedDownloadReceipt.date}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Scheme (योजना):</span>
                  <span className="text-gray-900 text-xs font-bold text-teal-800">बेटी विवाह सहायता योजना</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center mb-6">
                <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Amount Paid (सहयोग राशि)</span>
                <span className="text-3xl font-black text-teal-800 mt-1 block">₹ {selectedDownloadReceipt.amount}/-</span>
              </div>

              {/* Footer Stamp / Seal */}
              <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                <div className="text-[10px] text-gray-400">
                  *This is a computer generated receipt.<br/>No signature is required.
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-orange-500 rounded-full flex items-center justify-center text-[10px] text-orange-600 font-bold uppercase rotate-12 mx-auto">
                    SHCT SEAL
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 mt-1 block uppercase">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const UploadNidhanReceiptView = () => {
    const activeGroupAlerts = activeAlerts;
    const [selectedAlert, setSelectedAlert] = useState(selectedAlertForReceipt || (activeGroupAlerts.length > 0 ? activeGroupAlerts[0] : null));
    
    const [txnId, setTxnId] = useState('');
    const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('50');
    const [receiptImg, setReceiptImg] = useState('');
    
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    useEffect(() => {
      if (selectedAlertForReceipt) {
        setSelectedAlert(selectedAlertForReceipt);
        const minVal = selectedAlertForReceipt.minSupport ? parseInt(selectedAlertForReceipt.minSupport.replace(/[^0-9]/g, '')) : 50;
        setAmount(isNaN(minVal) ? '50' : String(minVal));
      }
    }, [selectedAlertForReceipt]);

    const handleSelectAlert = (e) => {
      const selectedId = e.target.value;
      const alertItem = activeGroupAlerts.find(a => a.id === selectedId);
      if (alertItem) {
        setSelectedAlert(alertItem);
        const minVal = alertItem.minSupport ? parseInt(alertItem.minSupport.replace(/[^0-9]/g, '')) : 50;
        setAmount(isNaN(minVal) ? '50' : String(minVal));
      }
    };

    const handleFileChange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          const base64 = await compressImage(file);
          setReceiptImg(base64);
        } catch (error) {
          console.error("Error compressing image:", error);
          alert("रसीद कंप्रेस करने में त्रुटि आई।");
        }
      }
    };

    const handleSubmitReceipt = async (e) => {
      e.preventDefault();
      if (!selectedAlert) {
        alert("कृपया एक सक्रिय सहयोग अलर्ट का चयन करें।");
        return;
      }
      if (!receiptImg) {
        alert("कृपया भुगतान स्क्रीनशॉट अपलोड करें।");
        return;
      }

      setIsUploading(true);
      const submissionData = {
        donorName: user.name,
        donorUniqueId: user.uniqueId,
        donorAadhaar: user.aadhaar,
        donorMobile: user.mobile,
        donorDistrict: user.district || '',
        donorBlock: user.block || '',
        beneficiaryName: selectedAlert.member,
        beneficiaryUniqueId: selectedAlert.uniqueId,
        group: selectedAlert.group,
        transactionId: txnId,
        date: txnDate,
        amount: amount,
        receiptImage: receiptImg
      };

      try {
        await addNidhanSahyogReceipt(submissionData);
        setIsUploading(false);
        setUploadSuccess(true);
        
        // Refresh local data list
        const receipts = await getNidhanSahyogReceipts();
        setSubmittedNidhanReceiptsList(receipts);

        setTimeout(() => {
          setUploadSuccess(false);
          setSelectedAlertForReceipt(null); 
          setTxnId('');
          setReceiptImg('');
          setActiveTab('dashboard'); 
        }, 3000);
      } catch (err) {
        console.error(err);
        setIsUploading(false);
        alert("रसीद सबमिट करने में विफल।");
      }
    };

    if (activeGroupAlerts.length === 0) {
      return (
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Running Sahyog</h3>
          <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200 border-dashed">
            <span className="text-4xl mb-4 block">📭</span>
            <p className="text-gray-500 font-extrabold text-lg">Not Any Sahyog Receipt</p>
            <p className="text-gray-400 text-sm mt-1">वर्तमान में आपके ग्रुप ({user.group}) के लिए कोई सहयोग अलर्ट सक्रिय नहीं है।</p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="mt-6 bg-[#087889] text-white px-6 py-2 rounded shadow hover:bg-[#06616e] transition-colors font-bold"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-[#087889] mb-6 border-b border-gray-200 pb-2">Upload Nidhan Receipt</h3>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          {uploadSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">रसीद सफलतापूर्वक अपलोड की गई!</h2>
              <p className="text-gray-600 font-medium">आपकी सहयोग रसीद एडमिन के पास सत्यापन (Verification) के लिए भेज दी गई है।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitReceipt} className="space-y-6 text-sm font-semibold">
              
              {/* Beneficiary Details Section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full font-bold text-[#087889] border-b border-blue-200 pb-1.5">
                  लाभार्थी का विवरण (Selected Beneficiary)
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">सहयोग प्राप्तकर्ता</label>
                  {selectedAlertForReceipt ? (
                    <input 
                      type="text" 
                      disabled 
                      value={`${selectedAlert.member} (${selectedAlert.uniqueId})`} 
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <select 
                      value={selectedAlert ? selectedAlert.id : ''} 
                      onChange={handleSelectAlert}
                      className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                    >
                      {activeGroupAlerts.map(a => (
                        <option key={a.id} value={a.id}>{a.member} ({a.uniqueId})</option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">ग्रुप (Group)</label>
                  <input type="text" disabled value={selectedAlert ? selectedAlert.group : ''} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              {/* Donor Details Section */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full font-bold text-gray-700 border-b border-gray-300 pb-1.5">
                  सहयोगकर्ता का विवरण (Your Info)
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">आपका नाम</label>
                  <input type="text" disabled value={user.name} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
                <div>
                  <label className="block text-gray-600 mb-1">यूनिक आईडी</label>
                  <input type="text" disabled value={user.uniqueId} className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed" />
                </div>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 mb-1">ट्रांजेक्शन आईडी (Txn ID) <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    required 
                    value={txnId} 
                    onChange={(e) => setTxnId(e.target.value)} 
                    placeholder="UPI Txn ID / Ref ID"
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">सहयोग तिथि <span className="text-red-500">*</span></label>
                  <input 
                    type="date" 
                    required 
                    value={txnDate} 
                    onChange={(e) => setTxnDate(e.target.value)} 
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-1">सहयोग राशि (₹) <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)} 
                    className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889]"
                  />
                </div>
              </div>

              {/* Upload Screenshot */}
              <div>
                <label className="block text-gray-700 mb-1">भुगतान रसीद / स्क्रीनशॉट अपलोड करें <span className="text-red-500">*</span></label>
                <input 
                  type="file" 
                  accept="image/*" 
                  required 
                  onChange={handleFileChange} 
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none"
                />
                {receiptImg && <span className="text-xs text-green-600 font-bold block mt-1">✅ रसीद संलग्न कर दी गई है</span>}
              </div>

              {/* Submit Button */}
              <div className="text-right border-t border-gray-100 pt-4">
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="px-8 py-3 rounded-lg text-white font-bold text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                  style={{ backgroundColor: '#f08519' }}
                >
                  {isUploading ? "अपलोड हो रहा है..." : "रसीद जमा करें (Submit)"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  };

  const ViewAllNidhanSahyogList = () => {
    const approvedReceipts = submittedNidhanReceiptsList.filter(r => r.status === 'APPROVED');
    const [selectedDownloadReceipt, setSelectedDownloadReceipt] = useState(null);

    const handleDownloadReceipt = async (receipt) => {
      setSelectedDownloadReceipt(receipt);
      setTimeout(async () => {
        const receiptCard = document.getElementById('printable-donation-receipt-nidhan');
        if (!receiptCard) return;
        
        try {
          const canvas = await html2canvas(receiptCard, {
            scale: 3, 
            useCORS: true,
            backgroundColor: '#ffffff'
          });
          const image = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = image;
          link.download = `Donation_Receipt_Nidhan_${receipt.transactionId}.png`;
          link.click();
          setSelectedDownloadReceipt(null);
        } catch (error) {
          console.error("Error generating receipt:", error);
          alert("रसीद डाउनलोड करने में असमर्थ।");
          setSelectedDownloadReceipt(null);
        }
      }, 500);
    };

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#8a3324] mb-6 border-b border-gray-200 pb-2">Running Sahyog</h3>
        
        {approvedReceipts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <span className="text-4xl mb-3 block">📑</span>
            <p className="text-gray-500 font-extrabold text-lg">वर्तमान में कोई स्वीकृत सहयोग रसीद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReceipts.map((receipt) => (
              <div key={receipt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                <h4 className="text-lg font-bold text-[#8a3324] mb-1">{receipt.donorName}</h4>
                <p className="text-xs text-gray-500 font-mono">Unique ID : {receipt.donorUniqueId}</p>
                <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded w-max mt-2">APPROVED</div>
                <hr className="border-t border-gray-100 my-4" />
                <div className="space-y-2 text-sm text-gray-700 font-semibold mb-6">
                  <p><span className="text-gray-400">Donated On:</span> {receipt.date}</p>
                  <p><span className="text-gray-400">Transaction ID:</span> <span className="font-mono text-xs break-all">{receipt.transactionId}</span></p>
                  <p><span className="text-gray-400">Amount:</span> ₹ {receipt.amount}</p>
                  <p><span className="text-gray-400">For:</span> {receipt.beneficiaryName}</p>
                </div>
                <button 
                  onClick={() => handleDownloadReceipt(receipt)}
                  className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors w-full sm:w-auto shadow-sm"
                >
                  Download Donation Receipt
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ================= HIDDEN PRINTABLE RECEIPT TEMPLATE ================= */}
        {selectedDownloadReceipt && (
          <div className="fixed -left-[9999px] top-0">
            <div 
              id="printable-donation-receipt-nidhan"
              className="w-[450px] bg-white border-[10px] border-double border-teal-800 p-6 font-sans text-gray-800 relative"
            >
              {/* Header */}
              <div className="text-center border-b-2 border-teal-800 pb-4 mb-4">
                <h1 className="text-2xl font-black uppercase text-teal-800 tracking-tight leading-tight">Silent Help Charitable Trust</h1>
                <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-0.5">Silent Help, Loud Impact</p>
                <p className="text-[9px] text-gray-500 mt-1">Registration No: SHCT/NGO/2024</p>
              </div>

              {/* Receipt Title */}
              <div className="text-center mb-6">
                <span className="bg-teal-50 text-teal-800 border border-teal-800/20 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-wide">
                  DONATION RECEIPT (सहयोग रसीद)
                </span>
              </div>

              {/* Body */}
              <div className="space-y-4 text-sm font-semibold mb-6">
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Donor Name (सहयोगी का नाम):</span>
                  <span className="text-gray-900 font-bold">{selectedDownloadReceipt.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Donor ID (यूनिक आईडी):</span>
                  <span className="text-gray-900 font-mono font-bold">{selectedDownloadReceipt.donorUniqueId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Beneficiary Name (सहायता प्राप्तकर्ता):</span>
                  <span className="text-gray-900 font-bold">{selectedDownloadReceipt.beneficiaryName}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Group (ग्रुप):</span>
                  <span className="text-gray-900 font-bold">Group {selectedDownloadReceipt.group}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Transaction ID (Txn ID):</span>
                  <span className="text-gray-900 font-mono font-bold text-xs">{selectedDownloadReceipt.transactionId}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Date of Donation (सहयोग तिथि):</span>
                  <span className="text-gray-900">{selectedDownloadReceipt.date}</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-1">
                  <span className="text-gray-500">Scheme (योजना):</span>
                  <span className="text-gray-900 text-xs font-bold text-teal-800">मृत्यु सहायता योजना</span>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center mb-6">
                <span className="text-xs text-gray-500 block uppercase font-bold tracking-wider">Amount Paid (सहयोग राशि)</span>
                <span className="text-3xl font-black text-teal-800 mt-1 block">₹ {selectedDownloadReceipt.amount}/-</span>
              </div>

              {/* Footer Stamp / Seal */}
              <div className="flex justify-between items-end pt-4 border-t border-gray-100 mt-4">
                <div className="text-[10px] text-gray-400">
                  *This is a computer generated receipt.<br/>No signature is required.
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 border-2 border-dashed border-orange-500 rounded-full flex items-center justify-center text-[10px] text-orange-600 font-bold uppercase rotate-12 mx-auto">
                    SHCT SEAL
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 mt-1 block uppercase">Authorized Signatory</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const PlaceholderView = ({ title }) => (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200 border-dashed">
        <span className="text-4xl mb-4 block">🚧</span>
        <p className="text-gray-500 font-medium">This section is currently under development.</p>
        <button 
          onClick={() => setActiveTab('dashboard')}
          className="mt-6 bg-[#2c3e50] text-white px-6 py-2 rounded shadow hover:bg-[#1a252f] transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );


  // Render Content Dynamically
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'profile': return <ProfileView />;
      case 'idcard': return <IDCardView />;
      case 'view_sahyog': return <ViewAllNidhanSahyogList />;
      case 'view_varshik': return <ViewVarshikDanList />;
      case 'upload_death': return <UploadNidhanReceiptView />;
      case 'upload_beti': return <UploadBetiReceiptView />;
      case 'view_beti': return <ViewAllBetiSahyogList />;
      case 'upload_varshik': return <PlaceholderView title="Upload Varshik Dan" />;
      case 'referral': return <PlaceholderView title="Referral Points" />;
      case 'password': return <PlaceholderView title="Update Password" />;
      default: return <DashboardView />;
    }
  };


  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-[#2f3d4a] text-gray-300 flex flex-col h-full shrink-0 shadow-xl z-20 overflow-y-auto">
        {/* Sidebar Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-600/50 bg-[#25303a]">
          {/* Circular logo placeholder since actual logo path is not imported */}
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1">
             <div className="w-full h-full border-2 border-red-500 rounded-full flex items-center justify-center text-[10px] font-bold text-blue-900 leading-tight text-center">SHCT</div>
          </div>
        </div>
        
        {/* Menu Section Label */}
        <div className="px-5 py-3 text-[10px] font-bold tracking-wider text-gray-500 mt-2">
          MAIN
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 pb-4">
          <ul className="space-y-0.5">
            {menuItems.map(item => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    activeTab === item.id 
                      ? 'bg-[#1e2730] text-white border-l-4 border-white' 
                      : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
                >
                  <span className="text-lg opacity-80">{item.icon}</span>
                  <span className="text-left">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* HEADER */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-3 text-lg font-medium text-gray-600">
            <span className="cursor-pointer hover:text-gray-900 transition-colors">≡</span>
            <span className="text-gray-800">{user.name}</span>
            <span className="text-green-600 font-bold">[{user.group}]</span>
            {user.uniqueId && user.uniqueId !== 'Pending' && (
              <span className="text-blue-600 font-bold bg-blue-50 px-2.5 py-0.5 rounded text-sm border border-blue-200">
                ID: {user.uniqueId}
              </span>
            )}
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            <span>⏻</span> Logout
          </button>
        </header>

        {/* DYNAMIC VIEW CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          {renderContent()}
        </main>

      </div>

    </div>
  );
};

export default UserDashboard;
