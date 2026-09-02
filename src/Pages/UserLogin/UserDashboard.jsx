import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  getPendingRegistrations,
  getApprovedMembers,
  getHomeAlerts,
  getHomePageSettings,
  addBetiSahyogReceipt,
  getBetiSahyogReceipts,
  addNidhanSahyogReceipt,
  getNidhanSahyogReceipts,
  getAnnualDonations,
  addAnnualRenewalReceipt,
  updateUserPassword,
  getGroupsConfig,
} from '../../services/dataService';
import html2canvas from 'html2canvas-pro';
import { logoBase64 } from '../../utils/logoBase64';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToImageKit } from '../../utils/imageKitUploader';
import {
  UserIcon,
  HomeIcon,
  LogoutIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  SparklesIcon,
  LockIcon,
  CreditCardIcon,
  HandshakeIcon,
  DownloadIcon,
  CheckIcon,
  CheckCircleIcon,
  ReceiptIcon,
  ChartBarIcon,
  FileTextIcon,
  WeddingIcon,
  DoveIcon,
  KeyIcon,
  ShieldCheckIcon
} from '../../components/common/Icons';

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
  const [pageSettings, setPageSettings] = useState(null);
  const [donationsList, setDonationsList] = useState([]);
  const [isGroupsActive, setIsGroupsActive] = useState(false);
  const [isAavedanMenuOpen, setIsAavedanMenuOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [copiedField, setCopiedField] = useState('');

  const copyToClipboard = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(''), 2500);
  };

  // Shared States for Centralized Receipt Image Generation
  const [selectedDownloadReceipt, setSelectedDownloadReceipt] = useState(null);
  const [downloadType, setDownloadType] = useState(''); // 'beti' or 'nidhan'

  const triggerDownload = async (receipt, type) => {
    setSelectedDownloadReceipt(receipt);
    setDownloadType(type);

    // Wait for state to reflect in DOM
    setTimeout(async () => {
      let elementId = 'printable-donation-receipt';
      if (type === 'nidhan') {
        elementId = 'printable-donation-receipt-nidhan';
      } else if (type === 'varshik') {
        elementId = 'printable-donation-receipt-varshik';
      }
      const receiptCard = document.getElementById(elementId);
      if (!receiptCard) {
        console.error("Receipt card element not found: ", elementId);
        return;
      }

      try {
        const canvas = await html2canvas(receiptCard, {
          scale: 2,
          useCORS: false,
          allowTaint: true,
          backgroundColor: '#ffffff'
        });
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        let filenameType = 'Beti';
        if (type === 'nidhan') filenameType = 'Nidhan';
        else if (type === 'varshik') filenameType = 'Varshik_Dan';
        link.download = `Donation_Receipt_${filenameType}_${receipt.transactionId}.png`;
        link.click();
      } catch (error) {
        console.error("Error generating receipt:", error);
        alert("रसीद डाउनलोड करने में असमर्थ: " + (error.message || error));
      } finally {
        setSelectedDownloadReceipt(null);
        setDownloadType('');
      }
    }, 150);
  };


  const [user, setUser] = useState({
    dbId: '',
    isPendingUser: false,
    name: '',
    group: '',
    aadhaar: '',
    pan: '',
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
    nomineeAadhaar: '',
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
          if (foundUser) isPending = true;
        }

        if (foundUser) {
          // Fetch groups configuration
          const grpConfig = await getGroupsConfig();
          const groupsActive = grpConfig ? grpConfig.isActive : false;
          setIsGroupsActive(groupsActive);

          let displayGroup = '';
          if (isPending) {
            displayGroup = 'Pending';
          } else if (groupsActive) {
            displayGroup = foundUser.group ? `Group ${foundUser.group}` : 'Not Assigned (असाइन नहीं है)';
          } else {
            displayGroup = 'Closed (ग्रुप बंद है)';
          }

          setUser({
            dbId: foundUser.id || '',
            isPendingUser: isPending,
            name: foundUser.name || '',
            group: displayGroup,
            aadhaar: foundUser.aadhaar || '',
            pan: foundUser.pan || foundUser.panNumber || '',
            fatherName: foundUser.fatherName || foundUser.fatherOrHusbandName || '',
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
            nomineeAadhaar: foundUser.nomineeAadhaar || '',
            referralCode: foundUser.referralCode || '',
            transactionId: foundUser.transactionId || '',
            uniqueId: isPending ? 'Pending' : (foundUser.uniqueId || ''),
            registeredOn: foundUser.submittedAt ? new Date(foundUser.submittedAt).toLocaleString() : ''
          });

          // Fetch all alerts
          const allAlerts = await getHomeAlerts();

          // Fetch page settings to determine the active yojna type
          const settings = await getHomePageSettings();
          setPageSettings(settings);

          let activeType = 'beti';
          if (settings && settings.headerTitle === "निधन सहायता योजना") {
            activeType = 'nidhan';
          }

          // Filter active alerts for this user's group and matching active scheme type
          let myActiveAlerts = [];
          if (groupsActive && foundUser.group) {
            const userRawGroup = normalizeGroup(foundUser.group);
            myActiveAlerts = allAlerts.filter(alert =>
              alert.isActive &&
              alert.group &&
              normalizeGroup(alert.group) === userRawGroup &&
              (alert.type || 'beti') === activeType
            );
          }
          setActiveAlerts(myActiveAlerts);

          // Fetch all receipts
          const receipts = await getBetiSahyogReceipts();
          setSubmittedReceiptsList(receipts);

          const nidhanReceipts = await getNidhanSahyogReceipts();
          setSubmittedNidhanReceiptsList(nidhanReceipts);

          const donations = await getAnnualDonations();
          setDonationsList(donations);
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
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'profile', label: 'Profile' },
    { id: 'idcard', label: 'ID Card' },
    { id: 'upload_death', label: 'Upload Nidhan Receipt' },
    { id: 'view_sahyog', label: 'View All Nidhan / Sahyog List' },
    { id: 'upload_beti', label: 'Upload Beti Vivah Sahyog Receipt' },
    { id: 'view_beti', label: 'View All Beti Vivah Sahyog List' },
    { id: 'upload_varshik', label: 'Upload Varshik Dan' },
    { id: 'view_varshik', label: 'View All Varshik Dan Suchi' },
    { id: 'referral', label: 'Referral Points' },
    { id: 'password', label: 'Update Password' },
  ];

  // ================= VIEWS =================

  const DashboardView = () => (
    <div className="p-3 sm:p-6 space-y-6 sm:space-y-8">
      {/* Group Cooperation Alerts Section (ON TOP) */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <h3 className="text-base sm:text-xl font-extrabold text-gray-800 flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5 text-amber-500 shrink-0" />
            <span>सक्रिय सहयोग अलर्ट ({user.group || 'ग्रुप'})</span>
          </h3>
          <span className="text-xs font-bold text-[#087889] bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            {activeAlerts.length} अलर्ट
          </span>
        </div>

        {activeAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-gray-200 shadow-sm text-center">
            {isGroupsActive ? (
              <>
                <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <SparklesIcon className="w-8 h-8" />
                </div>
                <p className="text-gray-800 font-bold text-base sm:text-lg">आपके ग्रुप ({user.group}) में वर्तमान में कोई सक्रिय सहयोग अलर्ट नहीं है।</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">जब एडमिन आपके ग्रुप के लिए नया सहयोग अलर्ट लाइव करेगा, तो उसका विवरण यहाँ तुरंत दिखाई देगा।</p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
                  <LockIcon className="w-7 h-7" />
                </div>
                <p className="text-gray-800 font-bold text-base sm:text-lg">ग्रुप प्रबंधन वर्तमान में बंद है।</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-1">जब एडमिन द्वारा ग्रुप प्रबंधन सक्रिय किया जाएगा, तब आपके ग्रुप के अलर्ट यहाँ प्रदर्शित होंगे।</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {activeAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-teal-100 shadow-md overflow-hidden relative"
              >
                {/* Top Strip */}
                <div className="bg-gradient-to-r from-[#087889] to-[#0ab3cc] px-4 sm:px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/20 text-white text-xs font-black px-2.5 py-0.5 rounded-full uppercase">
                      Alert {alert.alertNumber || 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-black tracking-wide uppercase">
                      GROUP {alert.group} - {alert.type === 'nidhan' ? 'निधन सहयोग' : 'बेटी विवाह सहयोग'}
                    </h4>
                  </div>
                  <span className="bg-amber-400 text-amber-950 text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                <div className="p-4 sm:p-6 space-y-5">
                  {/* Beneficiary & Bank details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Beneficiary Info Card */}
                    <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 font-extrabold text-gray-800 border-b border-gray-200/60 pb-2">
                        <UserIcon className="w-4 h-4 text-[#087889]" />
                        <span>लाभार्थी विवरण (Beneficiary)</span>
                      </div>
                      <div className="space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">नाम:</span>
                          <span className="text-gray-900 font-extrabold text-right">{alert.member}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">यूनिक ID:</span>
                          <span className="text-[#087889] font-mono font-bold">{alert.uniqueId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">सदस्यता तिथि:</span>
                          <span className="text-gray-800">{alert.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">पता:</span>
                          <span className="text-gray-800 text-right">{alert.address}</span>
                        </div>
                        {alert.type === 'nidhan' ? (
                          <>
                            <div className="flex justify-between border-t border-gray-200/50 pt-1">
                              <span className="text-gray-500 font-bold">मृतक का नाम:</span>
                              <span className="text-gray-900 font-bold">{alert.daughter}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-bold">निधन तिथि:</span>
                              <span className="text-gray-900 font-bold">{alert.marriageDate}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between border-t border-gray-200/50 pt-1">
                              <span className="text-gray-500 font-bold">बेटी का नाम:</span>
                              <span className="text-gray-900 font-bold">{alert.daughter}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500 font-bold">विवाह तिथि:</span>
                              <span className="text-gray-900 font-bold">{alert.marriageDate}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Bank Info Card */}
                    <div className="bg-amber-50/40 p-4 rounded-xl border border-amber-100 space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                        <div className="flex items-center gap-1.5 font-extrabold text-amber-900">
                          <CreditCardIcon className="w-4 h-4 text-amber-600" />
                          <span>बैंक खाता विवरण (Bank Details)</span>
                        </div>
                        <span className="text-[11px] font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                          Min: {alert.minSupport || '₹50'}
                        </span>
                      </div>
                      <div className="space-y-1.5 font-medium">
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">Account Name:</span>
                          <span className="text-gray-900 font-bold text-right">{alert.accName}</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-1.5 rounded-lg border border-amber-200/50">
                          <span className="text-gray-500 font-bold">A/C No:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono font-bold">{alert.accNo}</span>
                            <button
                              onClick={() => copyToClipboard(alert.accNo, `acc_${idx}`)}
                              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                            >
                              {copiedField === `acc_${idx}` ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-white p-1.5 rounded-lg border border-amber-200/50">
                          <span className="text-gray-500 font-bold">IFSC:</span>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-mono font-bold">{alert.ifsc}</span>
                            <button
                              onClick={() => copyToClipboard(alert.ifsc, `ifsc_${idx}`)}
                              className="text-[10px] bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-0.5 rounded font-bold transition-colors cursor-pointer"
                            >
                              {copiedField === `ifsc_${idx}` ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">Branch:</span>
                          <span className="text-gray-800">{alert.branch}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 font-bold">Bank:</span>
                          <span className="text-gray-800">{alert.bank}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* QR Code & Direct Upload Button */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-xl">
                    {alert.qrCodeBase64 && (
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="w-20 h-20 bg-white p-1 rounded-xl border border-gray-200 shrink-0 shadow-xs">
                          <img src={alert.qrCodeBase64} alt="QR Code" className="w-full h-full object-contain" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-bold text-gray-800">Scan & Pay via UPI</p>
                          <p className="text-[11px] text-gray-500">PhonePe / GPay / Paytm</p>
                          <p className="text-[11px] font-bold text-emerald-600 mt-1">✓ न्यूनतम ₹{alert.minSupport || '50'}</p>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={() => handleHelpClick(alert)}
                      className="w-full sm:w-auto bg-[#087889] hover:bg-[#06616e] active:scale-95 text-white font-extrabold px-6 py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
                    >
                      <HandshakeIcon className="w-5 h-5" />
                      <span>सहयोग रसीद अपलोड करें (Upload Help Receipt)</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* QUICK ACTIONS GRID (ALL 12 DASHBOARD FEATURES) */}
      <div className="border-t border-gray-200/60 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-extrabold text-gray-800 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-[#f08519] shrink-0" />
            <span>त्वरित सेवाएं (All Quick Actions)</span>
          </h3>
          <span className="text-xs text-gray-400 font-bold">12 सेवाएं उपलब्ध</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5">
          {/* 1. Beti Receipt */}
          <button
            onClick={() => setActiveTab('upload_beti')}
            className="bg-white hover:bg-pink-50/70 p-3 sm:p-4 rounded-2xl border border-pink-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <WeddingIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">बेटी सहयोग</span>
            <span className="text-[10px] text-pink-600 font-bold mt-0.5">रसीद भेजें</span>
          </button>

          {/* 2. Nidhan Receipt */}
          <button
            onClick={() => setActiveTab('upload_death')}
            className="bg-white hover:bg-teal-50/70 p-3 sm:p-4 rounded-2xl border border-teal-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-teal-500/10 text-[#087889] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <DoveIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">निधन सहयोग</span>
            <span className="text-[10px] text-[#087889] font-bold mt-0.5">रसीद भेजें</span>
          </button>

          {/* 3. Varshik Dan */}
          <button
            onClick={() => setActiveTab('upload_varshik')}
            className="bg-white hover:bg-amber-50/70 p-3 sm:p-4 rounded-2xl border border-amber-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">वार्षिक दान</span>
            <span className="text-[10px] text-amber-600 font-bold mt-0.5">₹200 रसीद</span>
          </button>

          {/* 4. ID Card */}
          <button
            onClick={() => setActiveTab('idcard')}
            className="bg-white hover:bg-indigo-50/70 p-3 sm:p-4 rounded-2xl border border-indigo-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <CreditCardIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">मेरा ID कार्ड</span>
            <span className="text-[10px] text-indigo-600 font-bold mt-0.5">डाउनलोड करें</span>
          </button>

          {/* 5. Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className="bg-white hover:bg-sky-50/70 p-3 sm:p-4 rounded-2xl border border-sky-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <UserIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">मेरी प्रोफाइल</span>
            <span className="text-[10px] text-sky-600 font-bold mt-0.5">विवरण देखें</span>
          </button>

          {/* 6. Beti Form */}
          <Link
            to="/beti-sahayog-form"
            className="bg-white hover:bg-purple-50/70 p-3 sm:p-4 rounded-2xl border border-purple-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <FileTextIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">बेटी आवेदन</span>
            <span className="text-[10px] text-purple-600 font-bold mt-0.5">नया फॉर्म</span>
          </Link>

          {/* 7. Nidhan Form */}
          <Link
            to="/nidhan-sahayog-form"
            className="bg-white hover:bg-emerald-50/70 p-3 sm:p-4 rounded-2xl border border-emerald-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <DoveIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">निधन आवेदन</span>
            <span className="text-[10px] text-emerald-600 font-bold mt-0.5">नया फॉर्म</span>
          </Link>

          {/* 8. Beti List */}
          <button
            onClick={() => setActiveTab('view_beti')}
            className="bg-white hover:bg-rose-50/70 p-3 sm:p-4 rounded-2xl border border-rose-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">बेटी विवाह सूची</span>
            <span className="text-[10px] text-rose-600 font-bold mt-0.5">सहयोग रिकॉर्ड</span>
          </button>

          {/* 9. Nidhan List */}
          <button
            onClick={() => setActiveTab('view_sahyog')}
            className="bg-white hover:bg-cyan-50/70 p-3 sm:p-4 rounded-2xl border border-cyan-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 text-cyan-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">निधन सूची</span>
            <span className="text-[10px] text-cyan-700 font-bold mt-0.5">सहयोग रिकॉर्ड</span>
          </button>

          {/* 10. Varshik List */}
          <button
            onClick={() => setActiveTab('view_varshik')}
            className="bg-white hover:bg-orange-50/70 p-3 sm:p-4 rounded-2xl border border-orange-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-orange-500/10 text-orange-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ReceiptIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">वार्षिक दान सूची</span>
            <span className="text-[10px] text-orange-600 font-bold mt-0.5">मेरी रसीदें</span>
          </button>

          {/* 11. Referral */}
          <button
            onClick={() => setActiveTab('referral')}
            className="bg-white hover:bg-violet-50/70 p-3 sm:p-4 rounded-2xl border border-violet-100/80 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <HandshakeIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">रेफरल प्वाइंट्स</span>
            <span className="text-[10px] text-violet-600 font-bold mt-0.5">रिवार्ड्स</span>
          </button>

          {/* 12. Password */}
          <button
            onClick={() => setActiveTab('password')}
            className="bg-white hover:bg-slate-100 p-3 sm:p-4 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center group cursor-pointer active:scale-95"
          >
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-slate-500/10 text-slate-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <KeyIcon className="w-6 h-6" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-tight">पासवर्ड बदलें</span>
            <span className="text-[10px] text-slate-600 font-bold mt-0.5">अकाउंट सुरक्षा</span>
          </button>
        </div>
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
            <label className="block text-sm font-bold text-gray-700 mb-1">PAN Card Number</label>
            <input type="text" value={user.pan || 'N/A'} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed font-mono uppercase" />
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
            <label className="block text-sm font-bold text-gray-700 mb-1">Nominee Aadhaar</label>
            <input type="text" value={user.nomineeAadhaar} disabled className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-gray-700 cursor-not-allowed font-mono" />
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
          <DownloadIcon className="w-5 h-5" /> Download ID Card
        </button>
      </div>

      {/* Printable ID Card Element */}
      <div
        id="printable-id-card"
        className="w-[350px] bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative"
      >
        {/* Center Watermark Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none transform translate-y-12">
          <img src={logoBase64} alt="Watermark Logo" className="w-64 h-64 object-contain" />
        </div>

        {/* Header */}
        <div className="bg-[#077d8c] px-4 py-3 flex items-center gap-3 relative rounded-t-xl">
          <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center p-0.5 overflow-hidden shrink-0 shadow-md border border-white/80">
            <img src={logoBase64} alt="SHCT Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
          </div>
          <h2 className="text-base font-black text-white tracking-tight uppercase leading-tight text-left">
            SILENT HELP CHARITABLE TRUST
          </h2>
        </div>

        {/* Body */}
        <div className="p-5 relative z-10">
          <div className="text-center mb-5 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 uppercase">{user.name || 'Member Name'}</h3>
            <p className="text-[11px] font-bold text-gray-500 uppercase mt-0.5">S/O, D/O, W/O: {user.fatherName || 'N/A'}</p>
            <p className="text-sm font-bold text-[#f08519] mt-1">{user.uniqueId && user.uniqueId !== 'Pending' ? user.uniqueId : 'ID: Pending'}</p>
          </div>

          <div className="space-y-3">
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
        <div className="bg-gray-50 p-3 text-center border-t border-gray-100 relative z-10">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Valid Member Identity Card</p>
          <p className="text-[8px] text-gray-400 mt-0.5">www.silenthelpct.com</p>
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

  const ViewVarshikDanList = () => {
    const myDonations = donationsList.filter(d => d.uniqueId === user.uniqueId);

    return (
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-gray-200 pb-4">
          <div>
            <h3 className="text-2xl font-black text-[#8a3324] tracking-tight">View All Varshik Dan Suchi</h3>
            <p className="text-sm text-gray-500 font-medium">वार्षिक दान सूची - आपके द्वारा जमा किया गया वार्षिक सदस्यता/नवीनीकरण शुल्क</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#8a3324]/10 text-[#8a3324] font-bold px-3 py-1 rounded-full border border-[#8a3324]/20">
              Total Receipts: {myDonations.length}
            </span>
          </div>
        </div>

        {myDonations.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md mx-auto py-12">
            <ReceiptIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-800 font-bold mb-1">No Records Found</p>
            <p className="text-sm text-gray-500 font-medium">You have not submitted annual/renewal fee yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myDonations.map((d, idx) => {
              const isRenewal = d.isRenewal;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between relative group"
                >
                  {/* Decorative Header Accent */}
                  <div className="h-2 bg-gradient-to-r from-[#8a3324] via-amber-600 to-[#8a3324]" />

                  <div className="p-6 flex-1">
                    {/* Top Branding Section */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-white p-0.5 flex items-center justify-center border border-gray-200 overflow-hidden shrink-0">
                          <img src={logoBase64} alt="SHCT Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
                        </div>
                        <span className="text-[10px] font-black text-gray-800 tracking-wider uppercase leading-none">
                          SHCT NGO
                        </span>
                      </div>

                      {/* Premium Badge */}
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${isRenewal
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                        : 'bg-blue-50 text-blue-700 border-blue-200/50'
                        }`}>
                        {isRenewal ? "RENEWAL (नवीनीकरण)" : "REGISTRATION (पंजीकरण)"}
                      </span>
                    </div>

                    {/* Donor Info */}
                    <div className="mb-4">
                      <h4 className="text-lg font-black text-gray-800 leading-tight mb-0.5">{d.name}</h4>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        ID: <span className="text-gray-600 font-mono font-medium">{d.uniqueId}</span>
                      </p>
                    </div>

                    {/* Receipt Details Table */}
                    <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Date</span>
                        <span className="text-gray-800 font-semibold">{d.sahyogDate}</span>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-gray-400 font-bold uppercase tracking-wider shrink-0">Txn ID</span>
                        <span className="text-gray-800 font-mono break-all text-right font-medium">{d.transactionId}</span>
                      </div>
                      <div className="border-t border-dashed border-gray-200 my-1 pt-1.5 flex items-center justify-between">
                        <span className="text-gray-400 font-bold uppercase tracking-wider">Amount</span>
                        <span className="text-sm font-black text-emerald-600">₹ {d.amount || "200"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">Receipt verified <CheckIcon className="w-3.5 h-3.5 text-emerald-500 inline" /></span>
                    <button
                      onClick={() => triggerDownload(d, 'varshik')}
                      className="flex items-center gap-1.5 bg-[#8a3324] hover:bg-[#a6402f] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all duration-200 cursor-pointer active:scale-95"
                    >
                      <DownloadIcon className="w-3.5 h-3.5" />
                      Download Receipt
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const UploadVarshikDanView = () => {
    const [txnId, setTxnId] = useState('');
    const [txnDate, setTxnDate] = useState(new Date().toISOString().split('T')[0]);
    const [receiptImg, setReceiptImg] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

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

    const handleSubmitRenewal = async (e) => {
      e.preventDefault();
      if (!receiptImg) {
        alert("कृपया भुगतान स्क्रीनशॉट अपलोड करें।");
        return;
      }

      setIsUploading(true);

      try {
        let finalReceiptImage = receiptImg;
        if (receiptImg && receiptImg.startsWith('data:image')) {
          finalReceiptImage = await uploadToImageKit(receiptImg, `annual_renewal_receipt_${user.uniqueId}_${Date.now()}.jpg`);
        }

        const submissionData = {
          name: user.name,
          uniqueId: user.uniqueId,
          aadhaar: user.aadhaar,
          mobile: user.mobile,
          district: user.district || '',
          block: user.block || '',
          transactionId: txnId,
          date: txnDate,
          amount: "200",
          receiptImage: finalReceiptImage,
          isRenewal: true
        };

        await addAnnualRenewalReceipt(submissionData);
        setIsUploading(false);
        setUploadSuccess(true);

        // Refresh local data list
        const donations = await getAnnualDonations();
        setDonationsList(donations);

        setTimeout(() => {
          setUploadSuccess(false);
          setTxnId('');
          setReceiptImg('');
          setActiveTab('view_varshik');
        }, 3000);
      } catch (err) {
        console.error(err);
        setIsUploading(false);
        alert("रसीद सबमिट करने में विफल।");
      }
    };

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <h3 className="text-xl font-bold text-[#087889] mb-6 border-b border-gray-200 pb-2">Upload Varshik Dan (नवीनीकरण ₹200)</h3>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          {uploadSuccess ? (
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-md text-center py-16">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">नवीनीकरण रसीद सफलतापूर्वक अपलोड की गई!</h2>
              <p className="text-gray-600 font-medium">आपकी रसीद एडमिन के पास सत्यापन (Verification) के लिए भेज दी गई है।</p>
            </div>
          ) : (
            <form onSubmit={handleSubmitRenewal} className="space-y-6 text-sm font-semibold">

              {/* Payment Details Section */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full font-bold text-[#087889] border-b border-blue-200 pb-1.5">
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
                  <label className="block text-gray-700 mb-1">नवीनीकरण राशि (₹) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    disabled
                    value="200"
                    className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-500 cursor-not-allowed font-bold"
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors cursor-pointer text-sm text-gray-600"
                />
                {receiptImg && <span className="text-xs text-green-600 font-bold block mt-1 flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> रसीद संलग्न कर दी गई है</span>}
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

      try {
        let finalReceiptImage = receiptImg;
        if (receiptImg && receiptImg.startsWith('data:image')) {
          finalReceiptImage = await uploadToImageKit(receiptImg, `beti_sahyog_receipt_${user.uniqueId}_${Date.now()}.jpg`);
        }

        const submissionData = {
          donorName: user.name,
          donorUniqueId: user.uniqueId,
          donorAadhaar: user.aadhaar,
          donorMobile: user.mobile,
          donorEmail: user.email,
          donorDistrict: user.district || '',
          donorBlock: user.block || '',
          beneficiaryName: selectedAlert.member || selectedAlert.beneficiaryName || '',
          beneficiaryUniqueId: selectedAlert.uniqueId || selectedAlert.beneficiaryUniqueId || '',
          alertNumber: Number(selectedAlert.alertNumber || selectedAlert.alertNo || 1),
          alertTitle: selectedAlert.title || `Alert ${Number(selectedAlert.alertNumber || selectedAlert.alertNo || 1)}`,
          group: selectedAlert.group,
          transactionId: txnId,
          date: txnDate,
          amount: amount,
          receiptImage: finalReceiptImage
        };

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
            <ReceiptIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
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
                      value={`[${selectedAlert.title || `Alert ${selectedAlert.alertNumber || 1}`}] ${selectedAlert.member || selectedAlert.beneficiaryName} (${selectedAlert.uniqueId || ''})`}
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 font-bold cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={selectedAlert ? selectedAlert.id : ''}
                      onChange={handleSelectAlert}
                      className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#087889]"
                    >
                      {activeGroupAlerts.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.title || `Alert ${a.alertNumber || 1}`}] {a.member || a.beneficiaryName} ({a.uniqueId})
                        </option>
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors cursor-pointer text-sm text-gray-600"
                />
                {receiptImg && <span className="text-xs text-green-600 font-bold block mt-1 flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> रसीद संलग्न कर दी गई है</span>}
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
    const approvedReceipts = submittedReceiptsList.filter(r =>
      r.status === 'APPROVED' &&
      r.donorAadhaar === user.aadhaar
    );

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#8a3324] mb-6 border-b border-gray-200 pb-2">Running Sahyog</h3>

        {approvedReceipts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <ReceiptIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-extrabold text-lg">वर्तमान में कोई स्वीकृत सहयोग रसीद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white p-5 relative rounded shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ border: '2px dashed red', minHeight: '380px' }}
              >
                {/* Center Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
                  <img src={logoBase64} alt="Watermark Logo" className="w-48 h-48 object-contain" />
                </div>

                <div>
                  {/* Header */}
                  <div className="text-center pb-3 mb-3 border-b border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-1 p-0.5 border border-gray-200 shadow-sm">
                      <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
                    </div>
                    <h1 className="text-xs font-black uppercase text-red-600 tracking-tight leading-tight">
                      SILENT HELP CHARITABLE TRUST
                    </h1>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                      रजि0न0 ( 57/2026 )
                    </p>
                  </div>

                  {/* Body fields */}
                  <div className="space-y-2 text-[11px] font-bold leading-normal text-left text-gray-700">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Thank You For Donation To Sh./Smt./M/S :</span>
                      <span className="text-gray-900 text-right w-[45%] break-words">{receipt.beneficiaryName || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">From Sh./Smt./M/S :</span>
                      <span className="text-gray-900 text-right w-[45%] break-words">{receipt.donorName || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Email :</span>
                      <span className="text-gray-900 text-right w-[45%] break-all">{receipt.donorEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Donated Amount :</span>
                      <span className="text-gray-900 text-right w-[45%] text-red-600 font-black">₹ {parseFloat(receipt.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">On :</span>
                      <span className="text-gray-900 text-right w-[45%]">{receipt.date || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Transaction ID :</span>
                      <span className="text-gray-900 text-right w-[45%] font-mono break-all text-[10px]">{receipt.transactionId || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Cause For Donation :</span>
                      <span className="text-gray-900 text-right w-[45%]">Beti Sahyog</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2 relative z-10">
                  <div className="text-center font-bold text-red-600 text-xs tracking-wide">
                    Thank You For Your Donation
                  </div>
                  <button
                    onClick={() => triggerDownload(receipt, 'beti')}
                    className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full shadow-sm mt-1"
                  >
                    Download Donation Receipt
                  </button>
                </div>
              </div>
            ))}
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

      try {
        let finalReceiptImage = receiptImg;
        if (receiptImg && receiptImg.startsWith('data:image')) {
          finalReceiptImage = await uploadToImageKit(receiptImg, `nidhan_sahyog_receipt_${user.uniqueId}_${Date.now()}.jpg`);
        }

        const submissionData = {
          donorName: user.name,
          donorUniqueId: user.uniqueId,
          donorAadhaar: user.aadhaar,
          donorMobile: user.mobile,
          donorEmail: user.email,
          donorDistrict: user.district || '',
          donorBlock: user.block || '',
          beneficiaryName: selectedAlert.member || selectedAlert.beneficiaryName || '',
          beneficiaryUniqueId: selectedAlert.uniqueId || selectedAlert.beneficiaryUniqueId || '',
          alertNumber: Number(selectedAlert.alertNumber || selectedAlert.alertNo || 1),
          alertTitle: selectedAlert.title || `Alert ${Number(selectedAlert.alertNumber || selectedAlert.alertNo || 1)}`,
          group: selectedAlert.group,
          transactionId: txnId,
          date: txnDate,
          amount: amount,
          receiptImage: finalReceiptImage
        };

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
            <ReceiptIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
              <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
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
                      value={`[${selectedAlert.title || `Alert ${selectedAlert.alertNumber || 1}`}] ${selectedAlert.member || selectedAlert.beneficiaryName} (${selectedAlert.uniqueId || ''})`}
                      className="w-full px-3 py-2 bg-gray-100 border rounded-lg text-gray-700 font-bold cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={selectedAlert ? selectedAlert.id : ''}
                      onChange={handleSelectAlert}
                      className="w-full px-3 py-2 bg-white border rounded-lg text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#087889]"
                    >
                      {activeGroupAlerts.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.title || `Alert ${a.alertNumber || 1}`}] {a.member || a.beneficiaryName} ({a.uniqueId})
                        </option>
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
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors cursor-pointer text-sm text-gray-600"
                />
                {receiptImg && <span className="text-xs text-green-600 font-bold block mt-1 flex items-center gap-1"><CheckIcon className="w-3.5 h-3.5" /> रसीद संलग्न कर दी गई है</span>}
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
    const approvedReceipts = submittedNidhanReceiptsList.filter(r =>
      r.status === 'APPROVED' &&
      r.donorAadhaar === user.aadhaar
    );

    return (
      <div className="p-6">
        <h3 className="text-xl font-bold text-[#8a3324] mb-6 border-b border-gray-200 pb-2">Running Sahyog</h3>

        {approvedReceipts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
            <ReceiptIcon className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-extrabold text-lg">वर्तमान में कोई स्वीकृत सहयोग रसीद उपलब्ध नहीं है।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedReceipts.map((receipt) => (
              <div
                key={receipt.id}
                className="bg-white p-5 relative rounded shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                style={{ border: '2px dashed red', minHeight: '380px' }}
              >
                {/* Center Watermark Logo */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] pointer-events-none select-none">
                  <img src={logoBase64} alt="Watermark Logo" className="w-48 h-48 object-contain" />
                </div>

                <div>
                  {/* Header */}
                  <div className="text-center pb-3 mb-3 border-b border-gray-100">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-1 p-0.5 border border-gray-200 shadow-sm">
                      <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
                    </div>
                    <h1 className="text-xs font-black uppercase text-red-600 tracking-tight leading-tight">
                      SILENT HELP CHARITABLE TRUST
                    </h1>
                    <p className="text-[8px] text-gray-400 font-bold uppercase tracking-wider">
                      रजि0न0 ( 57/2026 )
                    </p>
                  </div>

                  {/* Body fields */}
                  <div className="space-y-2 text-[11px] font-bold leading-normal text-left text-gray-700">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Thank You For Donation To Sh./Smt./M/S :</span>
                      <span className="text-gray-900 text-right w-[45%] break-words">{receipt.beneficiaryName || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">From Sh./Smt./M/S :</span>
                      <span className="text-gray-900 text-right w-[45%] break-words">{receipt.donorName || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Email :</span>
                      <span className="text-gray-900 text-right w-[45%] break-all">{receipt.donorEmail || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Donated Amount :</span>
                      <span className="text-gray-900 text-right w-[45%] text-red-600 font-black">₹ {parseFloat(receipt.amount || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">On :</span>
                      <span className="text-gray-900 text-right w-[45%]">{receipt.date || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Transaction ID :</span>
                      <span className="text-gray-900 text-right w-[45%] font-mono break-all text-[10px]">{receipt.transactionId || 'N/A'}</span>
                    </div>
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-gray-400 w-[55%]">Cause For Donation :</span>
                      <span className="text-gray-900 text-right w-[45%]">Death Sahyog</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col gap-2 relative z-10">
                  <div className="text-center font-bold text-red-600 text-xs tracking-wide">
                    Thank You For Your Donation
                  </div>
                  <button
                    onClick={() => triggerDownload(receipt, 'nidhan')}
                    className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors w-full shadow-sm mt-1"
                  >
                    Download Donation Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const UpdatePasswordView = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePasswordUpdate = async (e) => {
      e.preventDefault();
      setSuccessMessage('');
      setErrorMessage('');

      if (!newPassword) {
        setErrorMessage('कृपया नया पासवर्ड दर्ज करें।');
        return;
      }

      if (newPassword.length < 6) {
        setErrorMessage('पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।');
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage('दोनों पासवर्ड मेल नहीं खाते हैं।');
        return;
      }

      setIsUpdating(true);
      try {
        await updateUserPassword(user.dbId, user.isPendingUser, newPassword);
        setSuccessMessage('आपका पासवर्ड सफलतापूर्वक अपडेट हो गया है!');
        setNewPassword('');
        setConfirmPassword('');
      } catch (error) {
        console.error("Password update error:", error);
        setErrorMessage('पासवर्ड अपडेट करने में विफलता। कृपया बाद में पुनः प्रयास करें।');
      } finally {
        setIsUpdating(false);
      }
    };

    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 relative overflow-hidden">
          {/* Background Decorative Circles */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#087889] opacity-5 rounded-bl-full -z-10"></div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-gray-700" /> पासवर्ड बदलें (Change Password)
          </h3>
          <p className="text-xs text-gray-400 font-medium mb-6">अपने लॉगिन अकाउंट की सुरक्षा के लिए एक मजबूत पासवर्ड बनाएं।</p>

          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm font-semibold rounded-r-lg flex items-center gap-2">
              <CheckCircleIcon className="w-4 h-4 text-green-500" /> {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-lg flex items-center gap-2">
              <AlertTriangleIcon className="w-4 h-4 text-red-500" /> {errorMessage}
            </div>
          )}

          <form onSubmit={handlePasswordUpdate} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                नया पासवर्ड (New Password) <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="कम से कम 6 अक्षरों का पासवर्ड डालें"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                नया पासवर्ड पुष्टि करें (Confirm New Password) <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="नया पासवर्ड दोबारा डालें"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className={`w-full py-3 px-4 rounded-xl text-white font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 ${isUpdating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#087889] hover:bg-[#06616e] active:scale-[0.98]'
                }`}
            >
              {isUpdating ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  अपडेट हो रहा है...
                </>
              ) : (
                'पासवर्ड अपडेट करें (Update Password)'
              )}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const PlaceholderView = ({ title }) => (
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{title}</h3>
      <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200 border-dashed">
        <AlertCircleIcon className="w-12 h-12 text-amber-500 mx-auto mb-4" />
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
      case 'upload_varshik': return <UploadVarshikDanView />;
      case 'referral': return <PlaceholderView title="Referral Points" />;
      case 'password': return <UpdatePasswordView />;
      default: return <DashboardView />;
    }
  };


  return (
    <div className="flex h-screen bg-[#f4f6f9] font-sans overflow-hidden relative">

      {/* MOBILE DRAWER (OFF-CANVAS SIDEBAR) */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex animate-fadeIn">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Drawer Menu */}
          <div className="relative w-[280px] max-w-[85vw] bg-[#25303a] text-gray-200 h-full flex flex-col shadow-2xl z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-700/60 bg-[#1e2730] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#087889] text-white font-black flex items-center justify-center text-sm shadow-md">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-white truncate max-w-[140px]">{user.name || 'Member'}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] text-amber-400 font-extrabold bg-amber-400/10 px-1.5 py-0.2 rounded">
                      {user.group || 'Group'}
                    </span>
                    {user.uniqueId && (
                      <span className="text-[10px] text-teal-300 font-mono">
                        {user.uniqueId}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-800/80 text-gray-300 hover:text-white flex items-center justify-center cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Navigation Menu Inside Mobile Drawer */}
            <nav className="flex-1 p-3 space-y-1">
              <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'dashboard' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <ChartBarIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">Dashboard (डैशबोर्ड)</span>
              </button>

              <button
                onClick={() => { setActiveTab('profile'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'profile' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <UserIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">Profile (प्रोफाइल)</span>
              </button>

              <button
                onClick={() => { setActiveTab('idcard'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'idcard' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <CreditCardIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">ID Card (पहचान पत्र)</span>
              </button>

              {/* Aavedan Form Accordion Mobile */}
              <div className="pt-1">
                <button
                  onClick={() => setIsAavedanMenuOpen(!isAavedanMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:bg-[#384857] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <FileTextIcon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>Aavedan Form (आवेदन फॉर्म)</span>
                  </div>
                  <svg className={`w-3.5 h-3.5 transition-transform ${isAavedanMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isAavedanMenuOpen && (
                  <div className="mt-1 space-y-1 pl-4 border-l-2 border-gray-600/50 ml-5">
                    <Link
                      to="/beti-sahayog-form"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-pink-300 hover:bg-[#1e2730] transition-all"
                    >
                      <WeddingIcon className="w-4 h-4 shrink-0" /> <span>Beti Aavedan Form</span>
                    </Link>
                    <Link
                      to="/nidhan-sahayog-form"
                      onClick={() => setIsMobileSidebarOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-teal-300 hover:bg-[#1e2730] transition-all"
                    >
                      <DoveIcon className="w-4 h-4 shrink-0" /> <span>Nidhan Aavedan Form</span>
                    </Link>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-700/50 my-1.5">
                <span className="px-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">सहयोग रसीदें (Receipts)</span>
              </div>

              <button
                onClick={() => { setActiveTab('upload_beti'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upload_beti' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <DownloadIcon className="w-4 h-4 shrink-0 rotate-180 text-pink-400" />
                <span className="text-left flex-1">Upload Beti Vivah Receipt</span>
              </button>

              <button
                onClick={() => { setActiveTab('upload_death'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upload_death' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <DownloadIcon className="w-4 h-4 shrink-0 rotate-180 text-teal-300" />
                <span className="text-left flex-1">Upload Nidhan Receipt</span>
              </button>

              <button
                onClick={() => { setActiveTab('upload_varshik'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'upload_varshik' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <DownloadIcon className="w-4 h-4 shrink-0 rotate-180 text-amber-400" />
                <span className="text-left flex-1">Upload Varshik Dan</span>
              </button>

              <div className="pt-2 border-t border-gray-700/50 my-1.5">
                <span className="px-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">सूचियां (Lists)</span>
              </div>

              <button
                onClick={() => { setActiveTab('view_beti'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'view_beti' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <ReceiptIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">View Beti Vivah List</span>
              </button>

              <button
                onClick={() => { setActiveTab('view_sahyog'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'view_sahyog' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <ReceiptIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">View Nidhan Sahyog List</span>
              </button>

              <button
                onClick={() => { setActiveTab('view_varshik'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'view_varshik' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <ReceiptIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">View Varshik Dan Suchi</span>
              </button>

              <div className="pt-2 border-t border-gray-700/50 my-1.5">
                <span className="px-4 text-[10px] font-black uppercase text-gray-400 tracking-wider">अकाउंट सेटिंग्स (Account)</span>
              </div>

              <button
                onClick={() => { setActiveTab('password'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'password' ? 'bg-[#087889] text-white shadow-md' : 'text-gray-300 hover:bg-[#384857]'
                }`}
              >
                <KeyIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">Update Password</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-all cursor-pointer mt-2"
              >
                <LogoutIcon className="w-4 h-4 shrink-0" />
                <span className="text-left flex-1">Logout (लॉगआउट)</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex w-64 bg-[#2f3d4a] text-gray-300 flex-col h-full shrink-0 shadow-xl z-20 overflow-y-auto">
        {/* Sidebar Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-600/50 bg-[#25303a]">
          <span className="text-2xl font-black tracking-widest text-white uppercase select-none">
            SHCT
          </span>
        </div>

        {/* Menu Section Label */}
        <div className="px-5 py-3 text-[10px] font-bold tracking-wider text-gray-500 mt-2">
          MAIN
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 pb-4">
          <ul className="space-y-0.5">
            {/* Dashboard */}
            <li>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'dashboard'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <ChartBarIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">Dashboard</span>
              </button>
            </li>

            {/* Profile */}
            <li>
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'profile'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <UserIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">Profile</span>
              </button>
            </li>

            {/* ID Card */}
            <li>
              <button
                onClick={() => setActiveTab('idcard')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'idcard'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <CreditCardIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">ID Card</span>
              </button>
            </li>

            {/* AAVEDAN FORM ACCORDION */}
            <li>
              <div>
                <button
                  onClick={() => setIsAavedanMenuOpen(!isAavedanMenuOpen)}
                  className="w-full flex items-center justify-between px-5 py-3 text-sm font-medium transition-colors hover:bg-[#384857] hover:text-white border-l-4 border-transparent cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileTextIcon className="w-5 h-5 opacity-85 shrink-0" />
                    <span>Aavedan Form</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isAavedanMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isAavedanMenuOpen && (
                  <div className="mt-0.5 space-y-0.5 pl-4 border-l-2 border-gray-600/50 ml-6">
                    <Link
                      to="/beti-sahayog-form"
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-[#1e2730] hover:text-white transition-all"
                    >
                      <WeddingIcon className="w-4 h-4 text-pink-400 shrink-0" /> <span className="text-left flex-1">Beti Aavedan Form</span>
                    </Link>
                    <Link
                      to="/nidhan-sahayog-form"
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-medium text-gray-400 hover:bg-[#1e2730] hover:text-white transition-all"
                    >
                      <DoveIcon className="w-4 h-4 text-teal-300 shrink-0" /> <span className="text-left flex-1">Nidhan Aavedan Form</span>
                    </Link>
                  </div>
                )}
              </div>
            </li>

            {/* Upload Nidhan Receipt */}
            <li>
              <button
                onClick={() => setActiveTab('upload_death')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'upload_death'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <DownloadIcon className="w-5 h-5 opacity-85 shrink-0 rotate-180" />
                <span className="text-left flex-1">Upload Nidhan Receipt</span>
              </button>
            </li>

            {/* View All Nidhan / Sahyog List */}
            <li>
              <button
                onClick={() => setActiveTab('view_sahyog')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'view_sahyog'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <ReceiptIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">View All Nidhan / Sahyog List</span>
              </button>
            </li>

            {/* Upload Beti Vivah Sahyog Receipt */}
            <li>
              <button
                onClick={() => setActiveTab('upload_beti')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'upload_beti'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <DownloadIcon className="w-5 h-5 opacity-85 shrink-0 rotate-180" />
                <span className="text-left flex-1">Upload Beti Vivah Sahyog Receipt</span>
              </button>
            </li>

            {/* View All Beti Vivah Sahyog List */}
            <li>
              <button
                onClick={() => setActiveTab('view_beti')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'view_beti'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <ReceiptIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">View All Beti Vivah Sahyog List</span>
              </button>
            </li>

            {/* Upload Varshik Dan */}
            <li>
              <button
                onClick={() => setActiveTab('upload_varshik')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'upload_varshik'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <DownloadIcon className="w-5 h-5 opacity-85 shrink-0 rotate-180" />
                <span className="text-left flex-1">Upload Varshik Dan</span>
              </button>
            </li>

            {/* View All Varshik Dan Suchi */}
            <li>
              <button
                onClick={() => setActiveTab('view_varshik')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'view_varshik'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <ReceiptIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">View All Varshik Dan Suchi</span>
              </button>
            </li>

            {/* Referral Points */}
            <li>
              <button
                onClick={() => setActiveTab('referral')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'referral'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <HandshakeIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">Referral Points</span>
              </button>
            </li>

            {/* Update Password */}
            <li>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${activeTab === 'password'
                  ? 'bg-[#1e2730] text-white border-l-4 border-white'
                  : 'hover:bg-[#384857] hover:text-white border-l-4 border-transparent'
                  }`}
              >
                <KeyIcon className="w-5 h-5 opacity-85 shrink-0" />
                <span className="text-left flex-1">Update Password</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* HEADER (MOBILE & DESKTOP RESPONSIVE) */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-6 shrink-0 z-10 shadow-xs">
          {/* Left: Mobile Drawer Trigger + User summary */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Open Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="text-sm sm:text-base font-extrabold text-gray-800 truncate max-w-[120px] sm:max-w-none">
                {user.name || 'सदस्य'}
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60 shrink-0">
                {user.group || 'ग्रुप'}
              </span>
              {user.uniqueId && user.uniqueId !== 'Pending' && (
                <span className="hidden sm:inline-block text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-xs border border-blue-200">
                  ID: {user.uniqueId}
                </span>
              )}
            </div>
          </div>

          {/* Right: Quick Home & Logout buttons */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#087889] hover:text-[#06616e] bg-teal-50 hover:bg-teal-100 px-2.5 sm:px-3 py-1.5 rounded-lg border border-teal-200 transition-all"
            >
              <HomeIcon className="w-4 h-4" /> <span className="hidden sm:inline">Home Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
            >
              <LogoutIcon className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC VIEW CONTENT WITH SAFE BOTTOM PADDING ON MOBILE */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9fa] pb-24 md:pb-8">
          {renderContent()}
        </main>

      </div>

      {/* STICKY MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'dashboard' ? 'text-[#087889] font-black scale-105' : 'text-gray-500 font-medium'
          }`}
        >
          <ChartBarIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">डैशबोर्ड</span>
        </button>

        <button
          onClick={() => setActiveTab('idcard')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'idcard' ? 'text-[#087889] font-black scale-105' : 'text-gray-500 font-medium'
          }`}
        >
          <CreditCardIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">ID कार्ड</span>
        </button>

        {/* Center Sahyog Action Button */}
        <button
          onClick={() => {
            if (activeAlerts.length > 0) {
              handleHelpClick(activeAlerts[0]);
            } else {
              setActiveTab('upload_beti');
            }
          }}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-[#087889] to-[#0ab3cc] text-white p-2.5 rounded-full shadow-lg border-2 border-white active:scale-95 transition-transform cursor-pointer"
        >
          <HandshakeIcon className="w-6 h-6 animate-pulse" />
          <span className="text-[9px] font-black mt-0.5">सहयोग</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile' ? 'text-[#087889] font-black scale-105' : 'text-gray-500 font-medium'
          }`}
        >
          <UserIcon className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">प्रोफाइल</span>
        </button>

        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex flex-col items-center py-1 px-2 rounded-xl text-gray-500 font-medium hover:text-[#087889] cursor-pointer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          <span className="text-[10px] mt-0.5">मेनू</span>
        </button>
      </nav>

      {/* Central hidden templates at root body layer */}
      <div
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '450px',
          overflow: 'hidden'
        }}
      >
        {/* Beti template */}
        <div
          id="printable-donation-receipt"
          className="w-[450px] bg-white p-6 font-sans text-gray-800 relative"
          style={{ border: '2px dashed red' }}
        >
          {/* Center Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
            <img src={logoBase64} alt="Watermark Logo" className="w-64 h-64 object-contain" />
          </div>

          {/* Header */}
          <div className="text-center pb-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-2 p-1 border border-gray-200 shadow-sm">
              <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
            </div>
            <h1 className="text-lg font-black uppercase text-red-600 tracking-tight leading-tight">
              SILENT HELP CHARITABLE TRUST
            </h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Silent Help, Loud Impact • रजि0न0 ( 57/2026 )
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Body fields (Left labels, Right values) */}
          <div className="space-y-3.5 text-xs font-bold leading-normal text-left">
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Thank You For Donation To Sh./Smt./M/S :</span>
              <span className="text-gray-900 text-right w-[45%] break-words">{(selectedDownloadReceipt && selectedDownloadReceipt.beneficiaryName) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">From Sh./Smt./M/S :</span>
              <span className="text-gray-900 text-right w-[45%] break-words">{(selectedDownloadReceipt && selectedDownloadReceipt.donorName) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Email :</span>
              <span className="text-gray-900 text-right w-[45%] break-all">{(selectedDownloadReceipt && selectedDownloadReceipt.donorEmail) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Donated Amount :</span>
              <span className="text-gray-900 text-right w-[45%]">₹ {parseFloat((selectedDownloadReceipt && selectedDownloadReceipt.amount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">On :</span>
              <span className="text-gray-900 text-right w-[45%]">{(selectedDownloadReceipt && selectedDownloadReceipt.date) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Transaction ID :</span>
              <span className="text-gray-900 text-right w-[45%] font-mono break-all">{(selectedDownloadReceipt && selectedDownloadReceipt.transactionId) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Cause For Donation :</span>
              <span className="text-gray-900 text-right w-[45%]">Beti Sahyog</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Thank You Note */}
          <div className="text-center font-bold text-red-600 text-sm tracking-wide">
            Thank You For Your Donation
          </div>
        </div>

        {/* Nidhan template */}
        <div
          id="printable-donation-receipt-nidhan"
          className="w-[450px] bg-white p-6 font-sans text-gray-800 relative"
          style={{ border: '2px dashed red' }}
        >
          {/* Center Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none select-none">
            <img src={logoBase64} alt="Watermark Logo" className="w-64 h-64 object-contain" />
          </div>

          {/* Header */}
          <div className="text-center pb-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-2 p-1 border border-gray-200 shadow-sm">
              <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
            </div>
            <h1 className="text-lg font-black uppercase text-red-600 tracking-tight leading-tight">
              SILENT HELP CHARITABLE TRUST
            </h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Silent Help, Loud Impact • रजि0न0 ( 57/2026 )
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-3"></div>

          {/* Body fields (Left labels, Right values) */}
          <div className="space-y-3.5 text-xs font-bold leading-normal text-left">
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Thank You For Donation To Sh./Smt./M/S :</span>
              <span className="text-gray-900 text-right w-[45%] break-words">{(selectedDownloadReceipt && selectedDownloadReceipt.beneficiaryName) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">From Sh./Smt./M/S :</span>
              <span className="text-gray-900 text-right w-[45%] break-words">{(selectedDownloadReceipt && selectedDownloadReceipt.donorName) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Email :</span>
              <span className="text-gray-900 text-right w-[45%] break-all">{(selectedDownloadReceipt && selectedDownloadReceipt.donorEmail) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Donated Amount :</span>
              <span className="text-gray-900 text-right w-[45%]">₹ {parseFloat((selectedDownloadReceipt && selectedDownloadReceipt.amount) || 0).toFixed(2)}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">On :</span>
              <span className="text-gray-900 text-right w-[45%]">{(selectedDownloadReceipt && selectedDownloadReceipt.date) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Transaction ID :</span>
              <span className="text-gray-900 text-right w-[45%] font-mono break-all">{(selectedDownloadReceipt && selectedDownloadReceipt.transactionId) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[55%]">Cause For Donation :</span>
              <span className="text-gray-900 text-right w-[45%] font-bold">Death Sahyog</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-4"></div>

          {/* Thank You Note */}
          <div className="text-center font-bold text-red-600 text-sm tracking-wide">
            Thank You For Your Donation
          </div>
        </div>

        {/* Varshik Template */}
        <div
          id="printable-donation-receipt-varshik"
          className="w-[450px] bg-white p-6 font-sans text-gray-800 relative"
          style={{ border: '2px dashed #8a3324' }}
        >
          {/* Center Watermark Logo */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] pointer-events-none select-none">
            <img src={logoBase64} alt="Watermark Logo" className="w-64 h-64 object-contain" />
          </div>

          {/* Header */}
          <div className="text-center pb-3 border-b border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center overflow-hidden mx-auto mb-2 p-1 border border-gray-200 shadow-sm">
              <img src={logoBase64} alt="Logo" className="w-full h-full object-contain" style={{ transform: 'scale(1.44)' }} />
            </div>
            <h1 className="text-lg font-black uppercase text-[#8a3324] tracking-tight leading-tight">
              SILENT HELP CHARITABLE TRUST
            </h1>
            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
              Silent Help, Loud Impact • रजि0न0 ( 57/2026 )
            </p>
          </div>

          {/* Receipt Title */}
          <div className="text-center my-3 bg-amber-50 border border-amber-100 py-1 rounded">
            <span className="text-xs font-black uppercase text-amber-800 tracking-wider">
              Annual Donation Receipt (वार्षिक दान रसीद)
            </span>
          </div>

          {/* Body fields (Left labels, Right values) */}
          <div className="space-y-3.5 text-xs font-bold leading-normal text-left my-4">
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Donor Name :</span>
              <span className="text-gray-900 text-right w-[50%] break-words">{(selectedDownloadReceipt && selectedDownloadReceipt.name) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Unique ID :</span>
              <span className="text-gray-900 text-right w-[50%] font-mono uppercase">{(selectedDownloadReceipt && selectedDownloadReceipt.uniqueId) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Purpose of Sahyog :</span>
              <span className="text-gray-900 text-right w-[50%]">
                {selectedDownloadReceipt && selectedDownloadReceipt.isRenewal
                  ? 'Annual Renewal (वार्षिक नवीनीकरण)'
                  : 'Membership Registration (सदस्यता पंजीकरण)'}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Amount Paid :</span>
              <span className="text-emerald-600 text-right w-[50%] font-black">₹ {parseFloat((selectedDownloadReceipt && selectedDownloadReceipt.amount) || 200).toFixed(2)}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Donation Date :</span>
              <span className="text-gray-900 text-right w-[50%]">{(selectedDownloadReceipt && selectedDownloadReceipt.sahyogDate) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Transaction ID :</span>
              <span className="text-gray-900 text-right w-[50%] font-mono break-all">{(selectedDownloadReceipt && selectedDownloadReceipt.transactionId) || 'N/A'}</span>
            </div>
            <div className="flex items-start justify-between gap-2">
              <span className="text-gray-500 w-[50%]">Payment Status :</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-black tracking-wide">SUCCESSFUL / VERIFIED</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-4"></div>

          {/* Thank You Note & Trust Stamp Placeholder */}
          <div className="flex items-center justify-between mt-6 pt-2">
            <div className="text-left">
              <p className="text-[10px] text-gray-400 font-bold uppercase">Issued By</p>
              <p className="text-xs font-black text-gray-700 mt-1">SHCT Administration</p>
            </div>
            <div className="text-center font-bold text-[#8a3324] text-xs tracking-wider border border-[#8a3324]/20 bg-red-50/50 px-3 py-1 rounded uppercase">
              Official Receipt
            </div>
          </div>

          <div className="text-center font-bold text-gray-400 text-[10px] tracking-wide mt-6 border-t border-gray-100 pt-3">
            Thank you for supporting Silent Help Charitable Trust.
          </div>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;
