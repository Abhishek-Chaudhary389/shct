import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  signOut, 
  onAuthStateChanged, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from 'firebase/auth';
import { auth } from '../../firebase';
import logoImg from '../../assets/shct.png';
import {
  getPendingRegistrations,
  getAllRegistrationsHistory,
  getApprovedMembers,
  getAnnualDonations,
  approveRegistration,
  rejectRegistration,
  getBetiSahayogList,
  getBetiSahyogList,
  addBetiSahayog,
  updateBetiSahayog,
  deleteBetiSahayog,
  getNidhanSahayogList,
  getNidhanSahyogList,
  addNidhanSahayog,
  updateNidhanSahayog,
  deleteNidhanSahayog,
  updateSahayogStatus,
  getHomeAlerts,
  addHomeAlert,
  updateHomeAlert,
  updateHomeAlertStatus,
  deleteHomeAlert,
  getHomePageSettings,
  saveHomePageSettings,
  getBetiSahyogReceipts,
  updateBetiReceiptStatus,
  getNidhanSahyogReceipts,
  updateNidhanReceiptStatus,
  getAnnualRenewalReceipts,
  updateAnnualRenewalStatus,
  getGroupsConfig,
  saveGroupsConfig,
  updateMemberGroup,
  updateApprovedMember,
  updatePendingRegistration
} from '../../services/dataService';
import { compressImage } from '../../utils/imageCompressor';
import { uploadToImageKit } from '../../utils/imageKitUploader';
import { exportToCSV } from '../../utils/csvExporter';
import {
  UserIcon,
  UsersIcon,
  HomeIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  LogoutIcon,
  EyeIcon,
  EyeOffIcon,
  EditIcon,
  SaveIcon,
  CloseIcon,
  DownloadIcon,
  CheckIcon,
  CheckCircleIcon,
  TrashIcon,
  PlusIcon,
  RefreshIcon,
  ClockIcon,
  CalendarIcon,
  FileTextIcon,
  ReceiptIcon,
  CreditCardIcon,
  AlertCircleIcon,
  AlertTriangleIcon,
  InfoIcon,
  LightbulbIcon,
  HandshakeIcon,
  HeartIcon,
  ShieldIcon,
  ShieldCheckIcon,
  SearchIcon,
  ChartBarIcon,
  SettingsIcon,
  LockIcon,
  KeyIcon,
  LinkIcon,
  WeddingIcon,
  DoveIcon,
  SparklesIcon,
  LeafIcon,
  RupeeIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '../../components/common/Icons';

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
  const [renewalsList, setRenewalsList] = useState([]);
  const [renewalsFilter, setRenewalsFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'

  const [homeSettings, setHomeSettings] = useState({
    headerTitle: '',
    alertTitle: '',
    alertPoints: '',
    instructionTitle: '',
    instructionText: '',
    instructionNote: '',
    autoApproveBeti: false,
    autoApproveNidhan: false,
    scheme1Title: '',
    scheme1Text: '',
    scheme1BtnText: '',
    scheme2Title: '',
    scheme2Text: '',
    scheme2BtnText: ''
  });

  const [isSahayataMenuOpen, setIsSahayataMenuOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isBetiMenuOpen, setIsBetiMenuOpen] = useState(false);
  const [isNidhanMenuOpen, setIsNidhanMenuOpen] = useState(false);

  // Admin Drilldown States for Sahyog
  const [selectedAdminBetiHolder, setSelectedAdminBetiHolder] = useState(null);
  const [selectedAdminBetiAlert, setSelectedAdminBetiAlert] = useState(null);
  const [selectedAdminNidhanHolder, setSelectedAdminNidhanHolder] = useState(null);
  const [selectedAdminNidhanAlert, setSelectedAdminNidhanAlert] = useState(null);

  // CRUD Maintain States for Account Holders & Alerts
  const [accountHolderModal, setAccountHolderModal] = useState({ isOpen: false, type: 'beti', isNew: false, data: {} });
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: 'beti', isNew: false, data: {} });
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [isSavingCrud, setIsSavingCrud] = useState(false);
  const [deletedAlertKeys, setDeletedAlertKeys] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shct_deleted_alert_keys') || '[]');
    } catch {
      return [];
    }
  });
  const [deletedAccountHolders, setDeletedAccountHolders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shct_deleted_account_holders') || '[]');
    } catch {
      return [];
    }
  });

  const [notification, setNotification] = useState('');
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [isSavingHomeSettings, setIsSavingHomeSettings] = useState(false);
  const [isSavingSchemesSettings, setIsSavingSchemesSettings] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isSavingAlert, setIsSavingAlert] = useState(false);
  const [selectedMemberForDetail, setSelectedMemberForDetail] = useState(null);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [isSavingMember, setIsSavingMember] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState({});

  // Change Password Modal State
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordStatus, setChangePasswordStatus] = useState({ type: '', message: '' });

  const [betiFilter, setBetiFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [nidhanFilter, setNidhanFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [betiAppFilter, setBetiAppFilter] = useState('ALL');
  const [nidhanAppFilter, setNidhanAppFilter] = useState('ALL');
  const [selectedReceiptForDetail, setSelectedReceiptForDetail] = useState(null);
  const [registrationFilter, setRegistrationFilter] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'
  const [registrationAutoAssign, setRegistrationAutoAssign] = useState(false); // Auto assign rule toggle
  const [groupsConfig, setGroupsConfig] = useState({ activeGroups: ['A', 'B'], isActive: false });
  const [isSavingGroups, setIsSavingGroups] = useState(false);

  const [newHomeAlert, setNewHomeAlert] = useState({
    group: '', member: '', uniqueId: '', date: '', address: '',
    daughter: '', marriageDate: '', accName: '', accNo: '',
    ifsc: '', branch: '', bank: '', minSupport: '50 रुपए', qrCodeBase64: '',
    type: 'beti'
  });

  // --- PAGINATION & SEARCH STATES FOR ALL ADMIN TABLES ---
  const [tablePages, setTablePages] = useState({
    pending: 1,
    approved: 1,
    donations: 1,
    beti_receipts: 1,
    nidhan_receipts: 1,
    renewals: 1,
    beti: 1,
    nidhan: 1,
    groups: 1,
    beti_account_holder: 1,
    beti_alert_wise: 1,
    nidhan_account_holder: 1,
    nidhan_alert_wise: 1
  });

  const [tableEntries, setTableEntries] = useState({
    pending: 10,
    approved: 10,
    donations: 10,
    beti_receipts: 10,
    nidhan_receipts: 10,
    renewals: 10,
    beti: 10,
    nidhan: 10,
    groups: 10,
    beti_account_holder: 10,
    beti_alert_wise: 10,
    nidhan_account_holder: 10,
    nidhan_alert_wise: 10
  });

  const [tableSearches, setTableSearches] = useState({
    pending: '',
    approved: '',
    donations: '',
    beti_receipts: '',
    nidhan_receipts: '',
    renewals: '',
    beti: '',
    nidhan: '',
    groups: '',
    beti_account_holder: '',
    beti_alert_wise: '',
    nidhan_account_holder: '',
    nidhan_alert_wise: ''
  });

  const setPageFor = (tab, page) => {
    setTablePages(prev => ({ ...prev, [tab]: page }));
  };

  const setEntriesFor = (tab, entries) => {
    setTableEntries(prev => ({ ...prev, [tab]: entries }));
    setTablePages(prev => ({ ...prev, [tab]: 1 }));
  };

  const setSearchFor = (tab, search) => {
    setTableSearches(prev => ({ ...prev, [tab]: search }));
    setTablePages(prev => ({ ...prev, [tab]: 1 }));
  };

  const ShowEntriesDropdown = ({ tab }) => (
    <div className="flex items-center text-xs font-medium text-gray-600 gap-1.5">
      <span>Show</span>
      <select
        value={tableEntries[tab] || 10}
        onChange={(e) => setEntriesFor(tab, Number(e.target.value))}
        className="px-2.5 py-1.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold text-gray-700 shadow-sm cursor-pointer"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
      <span>entries</span>
    </div>
  );

  const TablePagination = ({ tab, totalEntries }) => {
    const page = tablePages[tab] || 1;
    const limit = tableEntries[tab] || 10;
    const totalPages = Math.ceil(totalEntries / limit) || 1;
    const indexOfLastRecord = page * limit;
    const indexOfFirstRecord = indexOfLastRecord - limit;
    const start = totalEntries > 0 ? indexOfFirstRecord + 1 : 0;
    const end = Math.min(indexOfLastRecord, totalEntries);

    const getPageNumbers = () => {
      const pages = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (page <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (page >= totalPages - 3) {
          pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
        }
      }
      return pages;
    };

    return (
      <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-semibold text-gray-600 bg-gray-50/50">
        <div>
          Showing <span className="font-bold text-gray-900">{start}</span> to <span className="font-bold text-gray-900">{end}</span> of <span className="font-bold text-gray-900">{totalEntries}</span> entries
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <button
            onClick={() => setPageFor(tab, page - 1)}
            disabled={page === 1}
            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold bg-white text-gray-700 shadow-sm cursor-pointer"
          >
            Previous
          </button>

          {getPageNumbers().map((num, i) => (
            num === '...' ? (
              <span key={`dots-${i}`} className="px-2 py-1 text-gray-400 font-bold">...</span>
            ) : (
              <button
                key={num}
                onClick={() => setPageFor(tab, num)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${page === num
                    ? 'bg-[#087889] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {num}
              </button>
            )
          ))}

          <button
            onClick={() => setPageFor(tab, page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-all font-bold bg-white text-gray-700 shadow-sm cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

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

    try {
      const rReceipts = await getAnnualRenewalReceipts();
      console.log("Loaded renewals list:", rReceipts.length);
      setRenewalsList(rReceipts);
    } catch (e) {
      console.error("Error loading renewals receipts:", e);
    }

    try {
      const gConfig = await getGroupsConfig();
      console.log("Loaded groups config in AdminDashboard:", gConfig);
      setGroupsConfig(gConfig || { activeGroups: ['A', 'B'], isActive: false });
    } catch (e) {
      console.error("Error loading groups config:", e);
    }
    console.log("loadData complete.");
  };

  const handleToggleBetiAutoApprove = async () => {
    try {
      const updated = {
        ...homeSettings,
        autoApproveBeti: !homeSettings.autoApproveBeti
      };
      await saveHomePageSettings(updated);
      setHomeSettings(updated);
      setNotification(`बेटी सहयोग ऑटो-वेरिफिकेशन ${updated.autoApproveBeti ? 'चालू (AUTO)' : 'बंद (MANUAL)'} कर दिया गया है!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('ऑटो-वेरिफिकेशन स्थिति बदलने में विफल।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleToggleNidhanAutoApprove = async () => {
    try {
      const updated = {
        ...homeSettings,
        autoApproveNidhan: !homeSettings.autoApproveNidhan
      };
      await saveHomePageSettings(updated);
      setHomeSettings(updated);
      setNotification(`मृत्यु सहयोग ऑटो-वेरिफिकेशन ${updated.autoApproveNidhan ? 'चालू (AUTO)' : 'बंद (MANUAL)'} कर दिया गया है!`);
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('ऑटो-वेरिफिकेशन स्थिति बदलने में विफल।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleBetiReceiptAction = async (id, status) => {
    try {
      await updateBetiReceiptStatus(id, status);
      setNotification(`रसीद स्थिति सफलतापूर्वक ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दी गई है!`);
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('स्थिति अपडेट करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleNidhanReceiptAction = async (id, status) => {
    try {
      await updateNidhanReceiptStatus(id, status);
      setNotification(`रसीद स्थिति सफलतापूर्वक ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दी गई है!`);
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('स्थिति अपडेट करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    }
  };

  const handleRenewalReceiptAction = async (id, status) => {
    try {
      await updateAnnualRenewalStatus(id, status);
      setNotification(`नवीनीकरण रसीद स्थिति सफलतापूर्वक ${status === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत'} कर दी गई है!`);
      await loadData();
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('स्थिति अपडेट करने में त्रुटि आई।');
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
      pan: "पैन नंबर",
      gender: "जेंडर",
      occupation: "व्यवसाय",
      district: "जिला",
      block: "ब्लॉक",
      email: "ईमेल ID",
      address: "पता",
      nomineeName: "नॉमिनी का नाम",
      nomineeRelation: "नॉमिनी से संबंध",
      nomineeMobile: "नॉमिनी मोबाइल",
      nomineeAadhaar: "नॉमिनी आधार नंबर",
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

  // --- ACCOUNT HOLDER CRUD HANDLERS ---
  const handleOpenAddAccountHolder = (type) => {
    setAccountHolderModal({
      isOpen: true,
      type: type,
      isNew: true,
      data: {
        applicantName: '',
        daughterName: '',
        deceasedName: '',
        uniqueId: '',
        mobile: '',
        district: 'संत कबीर नगर',
        block: 'खलीलाबाद',
        date: new Date().toISOString().split('T')[0],
        recommendedAmount: 50,
        accName: '',
        accNo: '',
        ifsc: '',
        branch: '',
        bank: '',
        status: 'APPROVED'
      }
    });
  };

  const handleOpenEditAccountHolder = (type, holder) => {
    const original = (type === 'beti' ? betiList : nidhanList).find(
      app => (app.applicantName || app.deceasedName || app.name || '').trim().toLowerCase() === holder.name.toLowerCase()
    ) || {};

    setAccountHolderModal({
      isOpen: true,
      type: type,
      isNew: false,
      docId: original.id || holder.id,
      data: {
        applicantName: original.applicantName || holder.name || '',
        daughterName: original.daughterName || '',
        deceasedName: original.deceasedName || holder.name || '',
        uniqueId: original.uniqueId || holder.uniqueId || '',
        mobile: original.mobile || holder.mobile || '',
        district: original.district || holder.district || 'संत कबीर नगर',
        block: original.block || holder.block || 'खलीलाबाद',
        date: original.marriageDate || original.deathDate || original.date || holder.marriageDate || holder.nidhanDate || '2025-04-10',
        recommendedAmount: Number(original.recommendedAmount) || holder.perMemberAmount || 50,
        accName: original.accName || '',
        accNo: original.accNo || '',
        ifsc: original.ifsc || '',
        branch: original.branch || '',
        bank: original.bank || '',
        status: original.status || 'APPROVED'
      }
    });
  };

  const handleSaveAccountHolder = async (e) => {
    e.preventDefault();
    setIsSavingCrud(true);
    const { type, isNew, docId, data } = accountHolderModal;
    try {
      const nameKey = `${type}_${(data.applicantName || data.deceasedName || '').trim().toLowerCase()}`;
      // Clear from deleted list if re-added/edited
      const updatedDeletedHolders = deletedAccountHolders.filter(k => k !== nameKey);
      setDeletedAccountHolders(updatedDeletedHolders);
      localStorage.setItem('shct_deleted_account_holders', JSON.stringify(updatedDeletedHolders));

      if (type === 'beti') {
        const payload = {
          applicantName: data.applicantName,
          name: data.applicantName,
          daughterName: data.daughterName || data.applicantName,
          uniqueId: data.uniqueId || `SHCT-${Math.floor(10000 + Math.random() * 90000)}`,
          mobile: data.mobile || '',
          district: data.district,
          block: data.block,
          marriageDate: data.date,
          date: data.date,
          recommendedAmount: Number(data.recommendedAmount) || 50,
          status: 'APPROVED',
          accName: data.accName || '',
          accNo: data.accNo || '',
          ifsc: data.ifsc || '',
          branch: data.branch || '',
          bank: data.bank || ''
        };

        if (isNew || !docId) {
          const res = await addBetiSahayog(payload);
          setBetiList(prev => [res, ...prev]);
        } else {
          await updateBetiSahayog(docId, payload);
          setBetiList(prev => prev.map(item => item.id === docId ? { ...item, ...payload } : item));
        }
      } else {
        const payload = {
          applicantName: data.applicantName,
          deceasedName: data.deceasedName || data.applicantName,
          name: data.deceasedName || data.applicantName,
          uniqueId: data.uniqueId || `SHCT-${Math.floor(10000 + Math.random() * 90000)}`,
          mobile: data.mobile || '',
          district: data.district,
          block: data.block,
          deathDate: data.date,
          date: data.date,
          recommendedAmount: Number(data.recommendedAmount) || 50,
          status: 'APPROVED',
          accName: data.accName || '',
          accNo: data.accNo || '',
          ifsc: data.ifsc || '',
          branch: data.branch || '',
          bank: data.bank || ''
        };

        if (isNew || !docId) {
          const res = await addNidhanSahayog(payload);
          setNidhanList(prev => [res, ...prev]);
        } else {
          await updateNidhanSahayog(docId, payload);
          setNidhanList(prev => prev.map(item => item.id === docId ? { ...item, ...payload } : item));
        }
      }

      setAccountHolderModal({ isOpen: false, type: 'beti', isNew: false, data: {} });
      setSuccessModal({
        isOpen: true,
        title: isNew ? 'खाताधारक सफलतापूर्वक जोड़ा गया!' : 'खाताधारक विवरण अपडेट हो गया!',
        message: `${data.applicantName || data.deceasedName} का विवरण सफलतापूर्वक सेव कर दिया गया है।`
      });
    } catch (err) {
      console.error(err);
      alert('सेव करने में त्रुटि आई: ' + err.message);
    } finally {
      setIsSavingCrud(false);
    }
  };

  const handleDeleteAccountHolder = (type, holder) => {
    const holderName = (holder.name || '').trim().toLowerCase();
    const holderKey = `${type}_${holderName}`;
    const original = (type === 'beti' ? betiList : nidhanList).find(
      app => (app.applicantName || app.deceasedName || app.name || '').trim().toLowerCase() === holderName
    );

    setDeleteConfirmModal({
      isOpen: true,
      title: 'खाताधारक को हटाएं?',
      message: `क्या आप वाकई ${holder.name} को लिस्ट से हटाना चाहते हैं?`,
      onConfirm: async () => {
        try {
          if (original?.id) {
            if (type === 'beti') {
              await deleteBetiSahayog(original.id);
              setBetiList(prev => prev.filter(item => item.id !== original.id));
            } else {
              await deleteNidhanSahayog(original.id);
              setNidhanList(prev => prev.filter(item => item.id !== original.id));
            }
          }

          const updatedHolders = [...new Set([...deletedAccountHolders, holderKey])];
          setDeletedAccountHolders(updatedHolders);
          localStorage.setItem('shct_deleted_account_holders', JSON.stringify(updatedHolders));

          if (type === 'beti') {
            setBetiList(prev => prev.filter(item => (item.applicantName || item.name || '').trim().toLowerCase() !== holderName));
          } else {
            setNidhanList(prev => prev.filter(item => (item.deceasedName || item.applicantName || item.name || '').trim().toLowerCase() !== holderName));
          }

          setDeleteConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
          setNotification(`${holder.name} को सफलतापूर्वक हटा दिया गया!`);
          setTimeout(() => setNotification(''), 4000);
        } catch (err) {
          alert('हटाने में त्रुटि आई: ' + err.message);
        }
      }
    });
  };

  // --- ALERT CRUD HANDLERS ---
  const handleOpenAddAlert = (type) => {
    const existingAlerts = homeAlertsList.filter(a => (a.type || 'beti') === type);
    const nextNo = existingAlerts.length + 1;
    setAlertModal({
      isOpen: true,
      type: type,
      isNew: true,
      data: {
        alertNumber: nextNo,
        type: type,
        title: `Alert ${nextNo}`,
        member: '',
        beneficiaryName: '',
        daughter: '',
        marriageDate: new Date().toISOString().split('T')[0],
        date: new Date().toISOString().split('T')[0],
        minSupport: '50 रुपए',
        accName: '',
        accNo: '',
        ifsc: '',
        branch: '',
        bank: '',
        qrCodeBase64: '',
        isActive: true
      }
    });
  };

  const handleOpenEditAlert = (alert) => {
    const original = homeAlertsList.find(a => a.id === alert.id || Number(a.alertNumber || a.alertNo) === alert.alertNumber) || {};
    setAlertModal({
      isOpen: true,
      type: alert.type || 'beti',
      isNew: false,
      docId: original.id || alert.id,
      data: {
        alertNumber: alert.alertNumber || original.alertNumber || 1,
        type: original.type || alert.type || 'beti',
        title: alert.title || original.title || `Alert ${alert.alertNumber}`,
        member: original.member || alert.beneficiaryName || '',
        beneficiaryName: original.beneficiaryName || alert.beneficiaryName || '',
        daughter: original.daughter || '',
        marriageDate: original.marriageDate || original.date || '2025-04-10',
        date: original.date || original.marriageDate || '2025-04-10',
        minSupport: original.minSupport || '50 रुपए',
        accName: original.accName || '',
        accNo: original.accNo || '',
        ifsc: original.ifsc || '',
        branch: original.branch || '',
        bank: original.bank || '',
        qrCodeBase64: original.qrCodeBase64 || '',
        isActive: original.isActive !== undefined ? original.isActive : true
      }
    });
  };

  const handleSaveAlert = async (e) => {
    e.preventDefault();
    setIsSavingCrud(true);
    const { isNew, docId, data } = alertModal;
    try {
      const alertNum = Number(data.alertNumber) || 1;
      const alertType = data.type || 'beti';
      const alertKey = `${alertType}_${alertNum}`;

      // Clear from deleted alert keys
      const updatedDeletedAlerts = deletedAlertKeys.filter(k => k !== alertKey);
      setDeletedAlertKeys(updatedDeletedAlerts);
      localStorage.setItem('shct_deleted_alert_keys', JSON.stringify(updatedDeletedAlerts));

      const payload = {
        ...data,
        alertNumber: alertNum,
        beneficiaryName: data.beneficiaryName || data.member,
        member: data.member || data.beneficiaryName,
        title: data.title || `Alert ${alertNum}`,
        type: alertType,
        isActive: data.isActive !== undefined ? data.isActive : true
      };

      if (isNew || !docId) {
        const res = await addHomeAlert(payload);
        setHomeAlertsList(prev => [res, ...prev]);
      } else {
        await updateHomeAlert(docId, payload);
        setHomeAlertsList(prev => prev.map(a => a.id === docId ? { ...a, ...payload } : a));
      }

      setAlertModal({ isOpen: false, type: 'beti', isNew: false, data: {} });
      setSuccessModal({
        isOpen: true,
        title: isNew ? 'अलर्ट सफलतापूर्वक बनाया गया!' : 'अलर्ट विवरण अपडेट हो गया!',
        message: `${payload.title} (${payload.beneficiaryName}) का विवरण सफलतापूर्वक सेव कर दिया गया है।`
      });
    } catch (err) {
      console.error(err);
      alert('अलर्ट सेव करने में त्रुटि: ' + err.message);
    } finally {
      setIsSavingCrud(false);
    }
  };

  const handleDeleteAlert = (alert) => {
    const alertType = alert.type || 'beti';
    const alertNum = alert.alertNumber;
    const alertKey = `${alertType}_${alertNum}`;
    const original = homeAlertsList.find(a => a.id === alert.id || (Number(a.alertNumber || a.alertNo) === alertNum && (a.type || 'beti') === alertType));

    setDeleteConfirmModal({
      isOpen: true,
      title: 'अलर्ट हटाएं?',
      message: `क्या आप वाकई ${alert.title} (${alert.beneficiaryName}) को हटाना चाहते हैं?`,
      onConfirm: async () => {
        try {
          if (original?.id) {
            await deleteHomeAlert(original.id);
            setHomeAlertsList(prev => prev.filter(a => a.id !== original.id));
          }

          const updatedDeleted = [...new Set([...deletedAlertKeys, alertKey])];
          setDeletedAlertKeys(updatedDeleted);
          localStorage.setItem('shct_deleted_alert_keys', JSON.stringify(updatedDeleted));

          setHomeAlertsList(prev => prev.filter(a => !(Number(a.alertNumber || a.alertNo) === alertNum && (a.type || 'beti') === alertType)));

          setDeleteConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null });
          setNotification(`${alert.title} को सफलतापूर्वक हटा दिया गया!`);
          setTimeout(() => setNotification(''), 4000);
        } catch (err) {
          alert('हटाने में त्रुटि आई: ' + err.message);
        }
      }
    });
  };

  const getGroupSizes = () => {
    const counts = {};
    for (let i = 0; i < 26; i++) {
      counts[String.fromCharCode(65 + i)] = 0;
    }
    approvedList.forEach(m => {
      const g = m.group ? String(m.group).trim().toUpperCase() : 'A';
      if (counts[g] !== undefined) {
        counts[g] = (counts[g] || 0) + 1;
      }
    });
    return counts;
  };

  const getSmallestGroup = () => {
    const groupSizes = getGroupSizes();
    const targetGroups = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
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
      .sort((a, b) => b.count - a.count);
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

  const handleApprove = async (id, name) => {
    try {
      const res = await approveRegistration(id, '');
      if (res) {
        setNotification(`${name} को सफलतापूर्वक अप्रूव कर दिया गया है! डेटा Member List और Annual Donation List में जोड़ दिया गया है।`);
        await loadData();
        setTimeout(() => setNotification(''), 5000);
      }
    } catch (e) {
      console.error(e);
      setNotification(`Error approving ${name}`);
      setTimeout(() => setNotification(''), 5000);
    }
  };

  const handleOpenMemberDetail = (member, isPending = false) => {
    setSelectedMemberForDetail({ ...member, isPendingRecord: isPending });
    setEditFormData({ ...member, isPendingRecord: isPending });
    setIsEditingMember(false);
  };

  const handleSaveMemberEdit = async (e) => {
    e.preventDefault();
    setIsSavingMember(true);
    try {
      const isPending = editFormData.isPendingRecord;
      const { id, isPendingRecord, ...dataToSave } = editFormData;

      if (isPending) {
        await updatePendingRegistration(id, dataToSave);
      } else {
        await updateApprovedMember(id, dataToSave);
      }

      await loadData();
      setSelectedMemberForDetail({ ...editFormData });
      setIsEditingMember(false);
      setNotification('सदस्य विवरण सफलतापूर्वक अपडेट कर दिया गया है!');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error("Error updating member:", err);
      alert('अपडेट करने में त्रुटि आई: ' + (err.message || err));
    } finally {
      setIsSavingMember(false);
    }
  };

  const handleToggleGroupsConfig = async (status) => {
    try {
      setIsSavingGroups(true);
      const updatedConfig = { ...groupsConfig, isActive: status };
      await saveGroupsConfig(updatedConfig);
      setGroupsConfig(updatedConfig);
      setNotification(`ग्रुप प्रबंधन सफलतापूर्वक ${status ? 'सक्रिय' : 'बंद'} कर दिया गया है!`);

      // If turned OFF, clear all group assignments in approved_members!
      if (!status) {
        setNotification('सभी सदस्यों के ग्रुप को रीसेट किया जा रहा है...');
        for (const member of approvedList) {
          if (member.group) {
            await updateMemberGroup(member.id, '');
          }
        }
        await loadData();
        setNotification('ग्रुप प्रबंधन बंद हो गया है और सभी सदस्यों के ग्रुप रीसेट कर दिए गए हैं।');
      }
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error("Failed to toggle groups config:", err);
      setNotification('ग्रुप सेटिंग्स अपडेट करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    } finally {
      setIsSavingGroups(false);
    }
  };

  const handleAddGroup = async () => {
    const lastGroup = groupsConfig.activeGroups[groupsConfig.activeGroups.length - 1] || '@';
    const nextGroupCode = String.fromCharCode(lastGroup.charCodeAt(0) + 1);
    if (nextGroupCode > 'Z') {
      alert("Z से अधिक ग्रुप नहीं बनाए जा सकते!");
      return;
    }

    try {
      setIsSavingGroups(true);
      const updatedGroups = [...groupsConfig.activeGroups, nextGroupCode];
      const updatedConfig = { ...groupsConfig, activeGroups: updatedGroups };
      await saveGroupsConfig(updatedConfig);
      setGroupsConfig(updatedConfig);
      setNotification(`नया ग्रुप ${nextGroupCode} सफलतापूर्वक जोड़ा गया!`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
      setNotification('ग्रुप जोड़ने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setIsSavingGroups(false);
    }
  };

  const handleRemoveGroup = async () => {
    if (groupsConfig.activeGroups.length <= 1) {
      alert("कम से कम एक ग्रुप सक्रिय होना अनिवार्य है!");
      return;
    }

    const removedGroup = groupsConfig.activeGroups[groupsConfig.activeGroups.length - 1];
    try {
      setIsSavingGroups(true);
      const updatedGroups = groupsConfig.activeGroups.slice(0, -1);
      const updatedConfig = { ...groupsConfig, activeGroups: updatedGroups };
      await saveGroupsConfig(updatedConfig);
      setGroupsConfig(updatedConfig);

      setNotification(`ग्रुप ${removedGroup} के सदस्यों को रीसेट किया जा रहा है...`);
      for (const member of approvedList) {
        if (member.group === removedGroup) {
          await updateMemberGroup(member.id, '');
        }
      }
      await loadData();
      setNotification(`ग्रुप ${removedGroup} को हटा दिया गया है।`);
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
      setNotification('ग्रुप हटाने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setIsSavingGroups(false);
    }
  };

  const handleAutoDistribute = async () => {
    if (groupsConfig.activeGroups.length === 0) {
      alert("कृपया पहले कम से कम एक ग्रुप सक्रिय करें!");
      return;
    }

    if (approvedList.length === 0) {
      alert("वितरण के लिए कोई अप्रूव्ड सदस्य नहीं है!");
      return;
    }

    try {
      setIsSavingGroups(true);
      setNotification('सभी सदस्यों को ग्रुप्स में समान रूप से विभाजित किया जा रहा है...');

      // Sort approvedList by uniqueId to make distribution stable
      const sortedMembers = [...approvedList].sort((a, b) => {
        const idA = a.uniqueId || '';
        const idB = b.uniqueId || '';
        return idA.localeCompare(idB);
      });

      const activeGroups = groupsConfig.activeGroups;

      for (let i = 0; i < sortedMembers.length; i++) {
        const member = sortedMembers[i];
        const assignedGroup = activeGroups[i % activeGroups.length];
        if (member.group !== assignedGroup) {
          await updateMemberGroup(member.id, assignedGroup);
        }
      }

      await loadData();
      setNotification('सभी सदस्यों को ग्रुप्स में समान रूप से सफलतापूर्वक वितरित कर दिया गया है!');
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error(err);
      setNotification('ऑटो-वितरण करने में त्रुटि आई।');
      setTimeout(() => setNotification(''), 4000);
    } finally {
      setIsSavingGroups(false);
    }
  };

  const handleManualTransfer = async (memberId, groupCode) => {
    try {
      setIsSavingGroups(true);
      await updateMemberGroup(memberId, groupCode);
      await loadData();
      setNotification('सदस्य का ग्रुप सफलतापूर्वक परिवर्तित कर दिया गया है!');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      console.error(err);
      setNotification('मैन्युअल ट्रांसफर में त्रुटि आई।');
      setTimeout(() => setNotification(''), 3000);
    } finally {
      setIsSavingGroups(false);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectRegistration(id);
      await loadData();
      setNotification('रजिस्ट्रेशन आवेदन अस्वीकृत कर दिया गया है। (Application Rejected)');
      setTimeout(() => setNotification(''), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSahayogAction = async (type, id, newStatus) => {
    try {
      await updateSahayogStatus(type, id, newStatus);
      await loadData();
      const statusHindi = newStatus === 'APPROVED' ? 'स्वीकृत' : 'अस्वीकृत';
      setNotification(`आवेदन स्थिति को "${statusHindi}" कर दिया गया है!`);
      setSuccessModal({
        isOpen: true,
        title: 'आवेदन स्थिति अपडेट हो गई!',
        message: `आवेदन को सफलतापूर्वक "${statusHindi} (${newStatus})" कर दिया गया है।`
      });
      setTimeout(() => setNotification(''), 4000);
    } catch (e) {
      console.error(e);
      alert('स्थिति बदलने में समस्या आई: ' + (e.message || e));
    }
  };

  const handleToggleHomeAlert = async (id, currentStatus) => {
    try {
      await updateHomeAlertStatus(id, !currentStatus);
      await loadData();
      const newStatusText = !currentStatus ? 'Live (दिख रहा है)' : 'Hidden (छिपा दिया गया है)';
      setNotification(`होम पेज अलर्ट स्टेटस अपडेट कर दिया गया है।`);
      setSuccessModal({
        isOpen: true,
        title: 'अलर्ट स्थिति अपडेट हो गई!',
        message: `होम पेज अलर्ट की स्थिति को सफलतापूर्वक बदलकर "${newStatusText}" कर दिया गया है।`
      });
      setTimeout(() => setNotification(''), 4000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteHomeAlert = async (id) => {
    if (window.confirm('क्या आप सच में इस अलर्ट को डिलीट करना चाहते हैं?')) {
      try {
        await deleteHomeAlert(id);
        await loadData();
        setNotification('अलर्ट हटा दिया गया है।');
        setSuccessModal({
          isOpen: true,
          title: 'अलर्ट हटा दिया गया!',
          message: 'होम पेज अलर्ट को सफलतापूर्वक हटा दिया गया है।'
        });
        setTimeout(() => setNotification(''), 4000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleCreateHomeAlert = async (e) => {
    e.preventDefault();
    setIsSavingAlert(true);
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

      const fileInput = document.getElementById('qr-code-file-input');
      if (fileInput) fileInput.value = '';

      await loadData();
      setIsSavingAlert(false);
      setNotification('नया होम पेज अलर्ट सफलतापूर्वक जोड़ दिया गया है!');
      setSuccessModal({
        isOpen: true,
        title: 'होम अलर्ट सफलतापूर्वक जोड़ा गया!',
        message: 'नया होम पेज अलर्ट सफलतापूर्वक सेव हो चुका है और यह मुख्य वेबसाइट के होम पेज पर लाइव हो चुका है।'
      });
      setTimeout(() => setNotification(''), 4000);
    } catch (error) {
      console.error(error);
      setIsSavingAlert(false);
      alert('अलर्ट जोड़ने में समस्या आई: ' + (error.message || error));
    }
  };

  const handleQrUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const base64 = await compressImage(file);
        setNewHomeAlert(prev => ({ ...prev, qrCodeBase64: base64 }));
      } catch (err) {
        console.error("Image compression error", err);
      }
    }
  };

  const handleSaveHomeSettings = async (e) => {
    e.preventDefault();
    setIsSavingHomeSettings(true);
    try {
      await saveHomePageSettings(homeSettings);
      await loadData();
      setNotification('होम पेज सेटिंग्स सफलतापूर्वक सहेजी गई!');
      setSuccessModal({
        isOpen: true,
        title: 'होम पेज सेटिंग्स सफलतापूर्वक सहेज ली गई!',
        message: 'मुख्य बैनर शीर्षक, सहयोग अलर्ट बॉक्स और महत्वपूर्ण निर्देश सफलतापूर्वक अपडेट हो गए हैं और मुख्य वेबसाइट के होम पेज पर लागू हो चुके हैं।'
      });
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error("Error saving home settings:", err);
      alert('सेटिंग्स सहेजने में समस्या आई: ' + (err.message || err));
    } finally {
      setIsSavingHomeSettings(false);
    }
  };

  const handleSaveSchemesSettings = async (e) => {
    e.preventDefault();
    setIsSavingSchemesSettings(true);
    try {
      await saveHomePageSettings(homeSettings);
      await loadData();
      setNotification('योजनाएं सेटिंग्स सफलतापूर्वक सहेजी गई!');
      setSuccessModal({
        isOpen: true,
        title: 'योजनाएं सेटिंग्स सफलतापूर्वक सहेज ली गई!',
        message: 'प्रमुख योजनाएं (आकस्मिक निधन सहायता योजना एवं बेटी विवाह सहायता योजना) की जानकारी सफलतापूर्वक अपडेट हो गई है और मुख्य वेबसाइट के होम पेज पर लागू हो चुकी है।'
      });
      setTimeout(() => setNotification(''), 4000);
    } catch (err) {
      console.error("Error saving schemes settings:", err);
      alert('योजनाएं सेटिंग्स सहेजने में समस्या आई: ' + (err.message || err));
    } finally {
      setIsSavingSchemesSettings(false);
    }
  };

  const handleExportSahayog = (type) => {
    const list = type === 'beti' ? betiList : nidhanList;
    if (!list || list.length === 0) {
      alert('एक्सपोर्ट करने के लिए कोई डेटा नहीं है');
      return;
    }
    const data = list.map((item, idx) => ({
      'S.NO': idx + 1,
      'Unique ID': item.uniqueId || '',
      'Applicant Name': item.applicantName || '',
      [type === 'nidhan' ? 'Deceased Name' : 'Daughter Name']: type === 'nidhan' ? (item.deceasedName || '') : (item.daughterName || ''),
      [type === 'nidhan' ? 'Death Date' : 'Marriage Date']: type === 'nidhan' ? (item.deathDate || '') : (item.marriageDate || ''),
      'District': item.district || '',
      'Block': item.block || '',
      'Mobile': item.mobile || '',
      'Status': item.status || 'PENDING',
      'Submitted Date': item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : ''
    }));
    exportToCSV(data, `${type}_sahayog_applications_${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = changePasswordForm;

    if (!currentPassword) {
      setChangePasswordStatus({ type: 'error', message: 'कृपया वर्तमान पासवर्ड दर्ज करें।' });
      return;
    }
    if (newPassword.length < 6) {
      setChangePasswordStatus({ type: 'error', message: 'नया पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordStatus({ type: 'error', message: 'नया पासवर्ड और पुष्टि पासवर्ड मेल नहीं खा रहे हैं।' });
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setChangePasswordStatus({ type: 'error', message: 'सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।' });
      return;
    }

    setIsChangingPassword(true);
    setChangePasswordStatus({ type: '', message: '' });

    try {
      // Re-authenticate user for security
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setChangePasswordStatus({ 
        type: 'success', 
        message: 'पासवर्ड सफलतापूर्वक बदल दिया गया है!' 
      });
      setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => {
        setIsChangePasswordModalOpen(false);
        setChangePasswordStatus({ type: '', message: '' });
      }, 2500);
    } catch (err) {
      console.error("Change password error:", err);
      let msg = 'पासवर्ड बदलने में समस्या आई।';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'वर्तमान पासवर्ड गलत है। कृपया सही पासवर्ड दर्ज करें।';
      } else if (err.code === 'auth/weak-password') {
        msg = 'नया पासवर्ड बहुत कमजोर है। कृपया 6 या अधिक अक्षरों का मजबूत पासवर्ड दर्ज करें।';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'सुरक्षा कारणों से अस्थायी रूप से ब्लॉक है। कृपया कुछ देर बाद प्रयास करें।';
      }
      setChangePasswordStatus({ type: 'error', message: msg });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("SignOut error:", err);
    }
    localStorage.removeItem('isAdminLoggedIn');
    localStorage.removeItem('adminEmail');
    navigate('/admin-login');
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
            {(auth.currentUser?.email || localStorage.getItem('adminEmail')) && (
              <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-gray-800/90 border border-teal-500/30 rounded-xl text-xs font-semibold shadow-inner">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-teal-300 font-bold">{auth.currentUser?.email || localStorage.getItem('adminEmail')}</span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">Super Admin</span>
              </div>
            )}
            <button
              onClick={() => {
                setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setChangePasswordStatus({ type: '', message: '' });
                setIsChangePasswordModalOpen(true);
              }}
              className="text-xs font-semibold px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-teal-300 border border-teal-500/30 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <KeyIcon className="w-4 h-4 text-amber-400" /> पासवर्ड बदलें
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-xs font-semibold px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <HomeIcon className="w-4 h-4" /> Main Website
            </button>
            <button
              onClick={handleLogout}
              className="text-xs font-bold px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <LogoutIcon className="w-4 h-4" /> LOGOUT (लॉगआउट)
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
                <ChartBarIcon className="w-5 h-5 opacity-90 shrink-0" />
                <span className="text-left flex-1">मुख्य सांख्यिकी (Analytics)</span>
              </button>

              <button
                onClick={() => setActiveTab('pending')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'pending' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <ClockIcon className="w-5 h-5 opacity-90 shrink-0 text-amber-400" />
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
                <UserIcon className="w-5 h-5 opacity-90 shrink-0 text-teal-400" />
                <span className="text-left flex-1">Member List</span>
                {approvedList.length > 0 && (
                  <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">{approvedList.length}</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('groups')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'groups' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <ShieldCheckIcon className="w-5 h-5 opacity-90 shrink-0" />
                <span className="text-left flex-1">ग्रुप प्रबंधन (Groups)</span>
              </button>

              {/* HOME MANAGEMENT ACCORDION */}
              <div className="pt-2">
                <button
                  onClick={() => setIsHomeMenuOpen(!isHomeMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all text-gray-300 hover:bg-gray-800 hover:text-white shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <HomeIcon className="w-5 h-5 opacity-90 shrink-0" />
                    <span>Home Management</span>
                  </div>
                  <svg className={`w-4 h-4 transition-transform ${isHomeMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isHomeMenuOpen && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-800 ml-4">
                    <button
                      onClick={() => setActiveTab('schemes_settings')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'schemes_settings' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <FileTextIcon className="w-4 h-4 opacity-80 shrink-0" /> <span className="text-left flex-1">Yojna Settings (योजनाएं)</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('settings')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'settings' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <SettingsIcon className="w-4 h-4 opacity-80 shrink-0" /> <span className="text-left flex-1">Home Settings</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('home_alerts')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'home_alerts' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <AlertCircleIcon className="w-4 h-4 opacity-80 shrink-0" /> <span className="text-left flex-1">Home Alerts</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('donations')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'donations' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <ReceiptIcon className="w-5 h-5 opacity-90 shrink-0" />
                <span className="text-left flex-1 leading-tight">Annual Donation List</span>
              </button>

              {/* BETI SAHYOG LIST ACCORDION */}
              <div className="pt-2">
                <button
                  onClick={() => setIsBetiMenuOpen(!isBetiMenuOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${['beti_receipts', 'beti_account_holder', 'beti_alert_wise'].includes(activeTab)
                      ? 'bg-[#087889] text-white border border-teal-500/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <WeddingIcon className="w-5 h-5 opacity-90 shrink-0 text-pink-400" />
                    <span className="text-left flex-1">Beti Sahyog List</span>
                  </div>
                  {betiReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                    <span className="bg-[#f08519] text-white text-[10px] px-2 py-0.5 rounded-full font-black mr-1">
                      {betiReceiptsList.filter(r => r.status === 'PENDING').length}
                    </span>
                  )}
                  <svg className={`w-4 h-4 transition-transform ${isBetiMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isBetiMenuOpen && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-800 ml-4">
                    <button
                      onClick={() => setActiveTab('beti_receipts')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'beti_receipts' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <ReceiptIcon className="w-4 h-4 opacity-80 shrink-0 text-pink-400" />
                      <span className="text-left flex-1">Beti Receipts (रसीदें)</span>
                      {betiReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                        <span className="bg-[#f08519] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                          {betiReceiptsList.filter(r => r.status === 'PENDING').length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('beti_account_holder')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'beti_account_holder' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <UserIcon className="w-4 h-4 opacity-80 shrink-0 text-amber-300" />
                      <span className="text-left flex-1">Account Holder Wise</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('beti_alert_wise')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'beti_alert_wise' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <AlertCircleIcon className="w-4 h-4 opacity-80 shrink-0 text-teal-300" />
                      <span className="text-left flex-1">Alert Wise</span>
                    </button>
                  </div>
                )}
              </div>

              {/* NIDHAN SAHYOG LIST ACCORDION */}
              <div className="pt-2">
                <button
                  onClick={() => setIsNidhanMenuOpen(!isNidhanMenuOpen)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${['nidhan_receipts', 'nidhan_account_holder', 'nidhan_alert_wise'].includes(activeTab)
                      ? 'bg-[#087889] text-white border border-teal-500/30'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <DoveIcon className="w-5 h-5 opacity-90 shrink-0 text-teal-300" />
                    <span className="text-left flex-1">Nidhan Sahyog List</span>
                  </div>
                  {nidhanReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                    <span className="bg-[#f08519] text-white text-[10px] px-2 py-0.5 rounded-full font-black mr-1">
                      {nidhanReceiptsList.filter(r => r.status === 'PENDING').length}
                    </span>
                  )}
                  <svg className={`w-4 h-4 transition-transform ${isNidhanMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isNidhanMenuOpen && (
                  <div className="mt-2 space-y-2 pl-4 border-l-2 border-gray-800 ml-4">
                    <button
                      onClick={() => setActiveTab('nidhan_receipts')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'nidhan_receipts' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <ReceiptIcon className="w-4 h-4 opacity-80 shrink-0 text-teal-300" />
                      <span className="text-left flex-1">Nidhan Receipts (रसीदें)</span>
                      {nidhanReceiptsList.filter(r => r.status === 'PENDING').length > 0 && (
                        <span className="bg-[#f08519] text-white text-[9px] px-1.5 py-0.5 rounded-full font-black">
                          {nidhanReceiptsList.filter(r => r.status === 'PENDING').length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab('nidhan_account_holder')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'nidhan_account_holder' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <UserIcon className="w-4 h-4 opacity-80 shrink-0 text-amber-300" />
                      <span className="text-left flex-1">Account Holder Wise</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('nidhan_alert_wise')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'nidhan_alert_wise' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <AlertCircleIcon className="w-4 h-4 opacity-80 shrink-0 text-teal-300" />
                      <span className="text-left flex-1">Alert Wise</span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveTab('renewals')}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${activeTab === 'renewals' ? 'bg-[#087889] text-white border border-teal-500/30' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
              >
                <RefreshIcon className="w-5 h-5 opacity-90 shrink-0" />
                <span className="text-left flex-1">Renewals (नवीनीकरण)</span>
                {renewalsList.filter(r => r.status === 'PENDING').length > 0 && (
                  <span className="bg-[#f08519] text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                    {renewalsList.filter(r => r.status === 'PENDING').length}
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
                    <HandshakeIcon className="w-5 h-5 opacity-90 shrink-0" />
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
                      <WeddingIcon className="w-4 h-4 opacity-80 shrink-0 text-pink-400" /> <span className="text-left flex-1">Beti Sahayog</span>
                      {betiList.length > 0 && <span className="bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{betiList.length}</span>}
                    </button>
                    <button
                      onClick={() => setActiveTab('nidhan')}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all ${activeTab === 'nidhan' ? 'bg-[#087889] text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    >
                      <DoveIcon className="w-4 h-4 opacity-80 shrink-0 text-teal-300" /> <span className="text-left flex-1">Nidhan Sahayog</span>
                      {nidhanList.length > 0 && <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{nidhanList.length}</span>}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-800">
                <button
                  onClick={() => {
                    setChangePasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setChangePasswordStatus({ type: '', message: '' });
                    setIsChangePasswordModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition-all text-amber-300 hover:bg-gray-800 hover:text-amber-200 border border-amber-500/20 bg-amber-500/5 cursor-pointer"
                >
                  <KeyIcon className="w-4 h-4 opacity-90 shrink-0 text-amber-400" />
                  <span className="text-left flex-1">पासवर्ड बदलें (Password)</span>
                </button>
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
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="w-5 h-5 text-emerald-200" />
                  <span>{notification}</span>
                </div>
                <button onClick={() => setNotification('')} className="text-white hover:text-gray-200 p-1 rounded-lg hover:bg-white/10 transition-colors ml-4">
                  <CloseIcon className="w-5 h-5" />
                </button>
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
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                    <ClockIcon className="w-7 h-7" />
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
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <CheckCircleIcon className="w-7 h-7" />
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
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
                    <CloseIcon className="w-7 h-7" />
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
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                    <ClockIcon className="w-7 h-7" />
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
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <CheckCircleIcon className="w-7 h-7" />
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
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
                    <CloseIcon className="w-7 h-7" />
                  </div>
                </div>
              </div>
            ) : activeTab === 'renewals' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Pending Renewals */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">लंबित नवीनीकरण रसीदें</p>
                    <h3 className="text-4xl font-black text-amber-600 mt-1">
                      {renewalsList.filter(r => r.status === 'PENDING').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Pending Verification</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                    <ClockIcon className="w-7 h-7" />
                  </div>
                </div>

                {/* Approved Renewals */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-emerald-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">स्वीकृत नवीनीकरण रसीदें</p>
                    <h3 className="text-4xl font-black text-emerald-600 mt-1">
                      {renewalsList.filter(r => r.status === 'APPROVED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Approved Renewals</p>
                  </div>
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    <CheckCircleIcon className="w-7 h-7" />
                  </div>
                </div>

                {/* Rejected Renewals */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-red-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">अस्वीकृत नवीनीकरण रसीदें</p>
                    <h3 className="text-4xl font-black text-red-600 mt-1">
                      {renewalsList.filter(r => r.status === 'REJECTED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Rejected Renewals</p>
                  </div>
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center font-bold">
                    <CloseIcon className="w-7 h-7" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-amber-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">पेंडिंग आवेदन</p>
                    <h3 className="text-4xl font-black text-amber-600 mt-1">
                      {pendingList.filter(r => r.status === 'PENDING' || !r.status).length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Approval Queue</p>
                  </div>
                  <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold">
                    <ClockIcon className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-[#087889] flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">स्वीकृत सदस्य</p>
                    <h3 className="text-4xl font-black text-[#087889] mt-1">{approvedList.length}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Approved Members</p>
                  </div>
                  <div className="w-14 h-14 bg-teal-50 text-[#087889] rounded-2xl flex items-center justify-center font-bold">
                    <CheckCircleIcon className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-purple-500 flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">कुल नवीनीकरण</p>
                    <h3 className="text-4xl font-black text-purple-600 mt-1">
                      {renewalsList.filter(r => r.status === 'APPROVED').length}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Renewals Count</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center font-bold">
                    <RefreshIcon className="w-7 h-7" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 border-t-4 border-t-[#f08519] flex items-center justify-between hover:shadow-md transition-shadow">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">कुल दान संग्रह</p>
                    <h3 className="text-3xl font-black text-[#f08519] mt-1">₹ {totalDonationSum}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-medium">Registration & Renewals</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-50 text-[#f08519] rounded-2xl flex items-center justify-center font-bold">
                    <ReceiptIcon className="w-7 h-7" />
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
                      <WeddingIcon className="w-10 h-10 text-pink-500 opacity-90" />
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
                      <DoveIcon className="w-10 h-10 text-teal-600 opacity-90" />
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col h-[280px]">
                    <div className="border-b border-gray-100 pb-3 mb-4 shrink-0">
                      <h3 className="text-lg font-bold text-gray-800">जिला भागीदारी (District Participation)</h3>
                      <p className="text-xs text-gray-400 mt-0.5">संस्था में जुड़े सदस्यों की जिलावार संख्या (सभी जिले)</p>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                      {(() => {
                        const distStats = getDistrictStats();
                        if (distStats.length === 0) {
                          return <p className="text-sm text-gray-400 text-center py-10 font-bold">कोई सदस्य डेटा उपलब्ध नहीं है</p>;
                        }
                        const maxCount = Math.max(...distStats.map(d => d.count), 1);
                        const colors = ["bg-[#087889]", "bg-[#f08519]", "bg-teal-600", "bg-orange-500", "bg-cyan-600"];
                        return distStats.map((dist, idx) => {
                          const percentage = (dist.count / maxCount) * 100;
                          return (
                            <div key={idx} className="space-y-1.5">
                              <div className="flex justify-between items-center text-xs font-bold text-gray-700">
                                <span className="flex items-center gap-2">
                                  <span className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-500 font-bold">{idx + 1}</span>
                                  <span className="capitalize">{dist.name}</span>
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
                        });
                      })()}
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

                {/* 1. Group Management Master Toggle */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">ग्रुप प्रबंधन नियंत्रण (Group Management Master Toggle)</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      यहाँ से ग्रुप सिस्टम को चालू या बंद किया जा सकता है। बंद करने पर यूज़र डैशबोर्ड से मदद (Cooperation Alerts) हट जाएगी।
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${groupsConfig.isActive ? 'text-emerald-600' : 'text-gray-400'}`}>
                      {groupsConfig.isActive ? 'ग्रुप प्रबंधन सक्रिय है' : 'ग्रुप प्रबंधन बंद है'}
                    </span>
                    <button
                      onClick={() => handleToggleGroupsConfig(!groupsConfig.isActive)}
                      disabled={isSavingGroups}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${groupsConfig.isActive ? 'bg-emerald-600' : 'bg-gray-200'
                        }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${groupsConfig.isActive ? 'translate-x-5' : 'translate-x-0'
                          }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 2. Active Groups Config & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Active Groups List Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 lg:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">सक्रिय ग्रुप्स सूची (Active Groups)</h3>
                      <p className="text-xs text-gray-500 mt-1">वर्तमान में सक्रिय ग्रुप्स की सूची। आप यहाँ नया ग्रुप जोड़ सकते हैं या हटा सकते हैं।</p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {groupsConfig.activeGroups.map((g) => {
                        const count = approvedList.filter(m => m.group === g).length;
                        return (
                          <div key={g} className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-24 shadow-sm relative group">
                            <span className="text-xs font-extrabold text-teal-800 leading-none">Group {g}</span>
                            <span className="text-xl font-black text-[#087889] mt-2">{count} <span className="text-[10px] text-teal-600 font-bold">सदस्य</span></span>
                          </div>
                        );
                      })}
                    </div>

                    {groupsConfig.isActive && (
                      <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
                        <button
                          onClick={handleAddGroup}
                          disabled={isSavingGroups}
                          className="bg-[#087889] hover:bg-[#06616e] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow hover:shadow-md disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <PlusIcon className="w-4 h-4" /> नया ग्रुप जोड़ें (Add Group)
                        </button>
                        <button
                          onClick={handleRemoveGroup}
                          disabled={isSavingGroups}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 font-bold px-5 py-2.5 rounded-lg text-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
                        >
                          <TrashIcon className="w-4 h-4" /> ग्रुप हटाएं (Remove Last Group)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Distribution Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">ग्रुप समान वितरण (Auto-Distribution)</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        सभी अप्रूव्ड सदस्यों को वर्तमान में सक्रिय ग्रुप्स में बराबर-बराबर बांटने के लिए नीचे दिए गए बटन का उपयोग करें।
                      </p>
                    </div>

                    <div className="space-y-4 mt-6">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-center">
                        <span className="text-xs text-gray-400 font-bold block">कुल अप्रूव्ड सदस्य</span>
                        <span className="text-3xl font-black text-gray-800 mt-1 block">{approvedList.length}</span>
                      </div>

                      {groupsConfig.isActive && (
                        <button
                          onClick={handleAutoDistribute}
                          disabled={isSavingGroups || approvedList.length === 0}
                          className="w-full bg-[#f08519] hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg text-sm shadow hover:shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <RefreshIcon className="w-4 h-4" /> सदस्यों को बराबर बांटें (Auto-Distribute)
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Approved Members Group Transfer list */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-teal-600 to-[#087889] text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-bold">सदस्य ग्रुप आवंटन एवं स्थानांतरण (Group Allocations & Manual Transfer)</h3>
                      <p className="text-xs text-teal-100 mt-1">यहाँ से आप किसी भी सदस्य को किसी भी ग्रुप में मैन्युअल रूप से ट्रांसफर कर सकते हैं।</p>
                    </div>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/10 shrink-0">
                      Approved List ({approvedList.length})
                    </span>
                  </div>

                  {/* Table Top Controls */}
                  <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                    <ShowEntriesDropdown tab="groups" />
                    <div className="relative w-full sm:w-64">
                      <input
                        type="text"
                        placeholder="सदस्य का नाम, ID या मोबाइल खोजें..."
                        value={tableSearches.groups}
                        onChange={(e) => setSearchFor('groups', e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                      />
                      <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                    </div>
                  </div>

                  {(() => {
                    const filteredGroupsList = approvedList.filter(m => {
                      if (!tableSearches.groups.trim()) return true;
                      const q = tableSearches.groups.toLowerCase();
                      return (m.name || '').toLowerCase().includes(q) ||
                        (m.uniqueId || '').toLowerCase().includes(q) ||
                        (m.mobile || '').toLowerCase().includes(q) ||
                        (m.group || '').toLowerCase().includes(q);
                    });
                    const totalEntries = filteredGroupsList.length;
                    const page = tablePages.groups || 1;
                    const limit = tableEntries.groups || 10;
                    const startIdx = (page - 1) * limit;
                    const currentRecords = filteredGroupsList.slice(startIdx, startIdx + limit);

                    return (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 text-xs font-extrabold uppercase tracking-wider">
                                <th className="py-4 px-6">क्र.सं.</th>
                                <th className="py-4 px-6">सदस्य का नाम (Name)</th>
                                <th className="py-4 px-6">यूनिक आईडी (ID)</th>
                                <th className="py-4 px-6">मोबाइल (Mobile)</th>
                                <th className="py-4 px-6">वर्तमान ग्रुप (Group)</th>
                                <th className="py-4 px-6 text-right">मैन्युअल ट्रांसफर (Transfer)</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm font-semibold text-gray-700">
                              {currentRecords.length === 0 ? (
                                <tr>
                                  <td colSpan="6" className="py-8 text-center text-gray-400 font-bold">
                                    कोई सदस्य रिकॉर्ड उपलब्ध नहीं है।
                                  </td>
                                </tr>
                              ) : (
                                currentRecords.map((member, idx) => (
                                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-6 font-bold text-gray-400 font-mono text-xs">{startIdx + idx + 1}</td>
                                    <td className="py-4 px-6">
                                      <div className="font-extrabold text-gray-800">{member.name}</div>
                                      <div className="text-[10px] text-gray-400 font-medium">{member.fatherName || 'पिता का नाम अनुपलब्ध'}</div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs text-[#087889] font-bold">{member.uniqueId}</td>
                                    <td className="py-4 px-6 text-gray-500 font-mono">{member.mobile}</td>
                                    <td className="py-4 px-6">
                                      {member.group ? (
                                        <span className="bg-teal-50 text-teal-700 text-xs font-extrabold px-2.5 py-1 rounded-full border border-teal-100 uppercase">
                                          Group {member.group}
                                        </span>
                                      ) : (
                                        <span className="bg-gray-100 text-gray-500 text-xs font-extrabold px-2.5 py-1 rounded-full border border-gray-200">
                                          None (असाइन नहीं)
                                        </span>
                                      )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                      {groupsConfig.isActive ? (
                                        <select
                                          value={member.group || ''}
                                          onChange={(e) => handleManualTransfer(member.id, e.target.value)}
                                          disabled={isSavingGroups}
                                          className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#087889] transition-all cursor-pointer inline-block"
                                        >
                                          <option value="">None (असाइन नहीं करें)</option>
                                          {groupsConfig.activeGroups.map(g => (
                                            <option key={g} value={g}>Group {g}</option>
                                          ))}
                                        </select>
                                      ) : (
                                        <span className="text-xs text-gray-400 italic">ग्रुप प्रबंधन बंद है</span>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <TablePagination tab="groups" totalEntries={totalEntries} />
                      </>
                    );
                  })()}
                </div>

                {/* Instructions card */}
                <div className="bg-gray-100 rounded-2xl p-6 border border-gray-200 text-sm text-gray-600 leading-relaxed font-semibold">
                  <h4 className="text-gray-800 font-bold mb-2 flex items-center gap-1.5"><LightbulbIcon className="w-4 h-4 text-amber-500 inline" /> ग्रुप प्रबंधन कैसे काम करता है?</h4>
                  <ul className="list-disc pl-5 space-y-1.5">
                    <li><strong>ग्रुप प्रबंधन बंद (OFF)</strong> करने पर सभी सदस्यों के ग्रुप्स हट जाते हैं और उनके डैशबोर्ड से सहयोग अलर्ट (Cooperation Alerts) बंद हो जाता है।</li>
                    <li><strong>ग्रुप प्रबंधन चालू (ON)</strong> करने पर आप जितने चाहें उतने ग्रुप्स (जैसे A, B, C...) बना सकते हैं।</li>
                    <li><strong>"ऑटो-वितरण (Auto-Distribute)"</strong> करने पर सिस्टम वर्णमाला क्रम (alphabetical order) में सभी सदस्यों को एक्टिव ग्रुप्स में बराबर बांट देता है (उदाहरण: 100 सदस्यों को A और B में 50-50 बांट देगा)।</li>
                    <li>आप तालिका में से किसी भी विशिष्ट सदस्य का ग्रुप मैन्युअल रूप से बदल भी सकते हैं।</li>
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
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${registrationFilter === f
                          ? 'bg-white text-amber-800 shadow-sm'
                          : 'text-white hover:bg-white/10'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({pendingList.filter(r => r.status === 'PENDING' || !r.status).length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({pendingList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({pendingList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({pendingList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="pending" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="नाम, मोबाइल, Txn ID खोजें..."
                      value={tableSearches.pending}
                      onChange={(e) => setSearchFor('pending', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredPendingList = pendingList.filter(r => {
                    const status = r.status || 'PENDING';
                    const matchesFilter = registrationFilter === 'ALL' ? true : status === registrationFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.pending.trim()) return true;
                    const q = tableSearches.pending.toLowerCase();
                    return (r.name || '').toLowerCase().includes(q) ||
                      (r.mobile || '').toLowerCase().includes(q) ||
                      (r.transactionId || '').toLowerCase().includes(q) ||
                      (r.district || '').toLowerCase().includes(q) ||
                      (r.fatherName || '').toLowerCase().includes(q) ||
                      (r.id || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredPendingList.length;
                  const page = tablePages.pending || 1;
                  const limit = tableEntries.pending || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredPendingList.slice(startIdx, startIdx + limit);

                  if (totalEntries === 0) {
                    return (
                      <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                        <SparklesIcon className="w-12 h-12 text-amber-500 mx-auto" />
                        <h4 className="text-lg font-bold mt-4 text-gray-700">कोई आवेदन नहीं है!</h4>
                        <p className="text-sm text-gray-400 mt-1">इस फ़िल्टर या खोज के लिए कोई रिकॉर्ड उपलब्ध नहीं है।</p>
                      </div>
                    );
                  }

                  return (
                    <>
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
                              <th className="py-4 px-5 text-center">विवरण (View)</th>
                              <th className="py-4 px-5 text-center">स्थिति / कार्यवाही</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-medium">
                            {currentRecords.map((item) => (
                              <tr key={item.id} className="hover:bg-amber-50/40 transition-colors">
                                <td className="py-4 px-5 font-mono font-bold text-gray-900">{item.id}</td>
                                <td className="py-4 px-5">
                                  <p className="font-bold text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">पिता/पति: {item.fatherName || item.fatherOrHusbandName || 'N/A'}</p>
                                </td>
                                <td className="py-4 px-5">
                                  <p className="font-semibold text-teal-800 flex items-center gap-1"><PhoneIcon className="w-3.5 h-3.5 text-teal-600" /> {item.mobile}</p>
                                  <p className="text-xs font-mono text-gray-500 mt-1 flex items-center gap-1"><CreditCardIcon className="w-3.5 h-3.5 text-gray-400" /> {item.aadhaar}</p>
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
                                    className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-[#087889] border border-teal-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <EyeIcon className="w-3.5 h-3.5" /> रसीद देखें
                                  </button>
                                </td>
                                <td className="py-4 px-5 text-center">
                                  <button
                                    onClick={() => handleOpenMemberDetail(item, true)}
                                    className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <EyeIcon className="w-3.5 h-3.5" /> View
                                  </button>
                                </td>
                                <td className="py-4 px-5 text-center">
                                  {(item.status === 'PENDING' || !item.status) ? (
                                    <div className="flex items-center justify-center space-x-2">
                                      <button
                                        onClick={() => handleApprove(item.id, item.name)}
                                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5 inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <CheckIcon className="w-3.5 h-3.5" /> Approve
                                      </button>
                                      <button
                                        onClick={() => handleReject(item.id, item.name)}
                                        className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-sm transition-transform hover:-translate-y-0.5 inline-flex items-center gap-1 cursor-pointer"
                                      >
                                        <CloseIcon className="w-3.5 h-3.5" /> Reject
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="text-center">
                                      <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
                      <TablePagination tab="pending" totalEntries={totalEntries} />
                    </>
                  );
                })()}
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
                      <DownloadIcon className="w-4 h-4" /> Excel/CSV डाउनलोड
                    </button>
                    <span className="bg-teal-800 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-inner">
                      {approvedList.length} कुल सदस्य
                    </span>
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="approved" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="नाम, ID, मोबाइल, जिला खोजें..."
                      value={tableSearches.approved}
                      onChange={(e) => setSearchFor('approved', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredApprovedList = approvedList.filter(m => {
                    if (!tableSearches.approved.trim()) return true;
                    const q = tableSearches.approved.toLowerCase();
                    return (m.name || '').toLowerCase().includes(q) ||
                      (m.uniqueId || '').toLowerCase().includes(q) ||
                      (m.mobile || '').toLowerCase().includes(q) ||
                      (m.district || '').toLowerCase().includes(q) ||
                      (m.block || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredApprovedList.length;
                  const page = tablePages.approved || 1;
                  const limit = tableEntries.approved || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredApprovedList.slice(startIdx, startIdx + limit);

                  if (totalEntries === 0) {
                    return (
                      <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                        <p className="text-sm font-medium">कोई अप्रूव्ड सदस्य रिकॉर्ड उपलब्ध नहीं है।</p>
                      </div>
                    );
                  }

                  return (
                    <>
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
                            {currentRecords.map((m, idx) => (
                              <tr key={m.id || idx} className="hover:bg-teal-50/30 transition-colors">
                                <td className="py-4 px-5 font-bold text-gray-500 font-mono text-xs">{startIdx + idx + 1}</td>
                                <td className="py-4 px-5 font-bold text-gray-900">{m.name}</td>
                                <td className="py-4 px-5 font-mono font-bold text-[#087889] bg-teal-50/50 rounded inline-block mt-2 px-2 py-1">{m.uniqueId}</td>
                                <td className="py-4 px-5">{m.district}</td>
                                <td className="py-4 px-5">{m.block}</td>
                                <td className="py-4 px-5 font-semibold text-gray-700">{m.mobile}</td>
                                <td className="py-4 px-5 text-xs font-bold text-gray-500">{m.joinedDate || '2026-08-03'}</td>
                                <td className="py-4 px-5 text-center">
                                  <button
                                    onClick={() => handleOpenMemberDetail(m, false)}
                                    className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1 mx-auto cursor-pointer"
                                  >
                                    <EyeIcon className="w-3.5 h-3.5" /> View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="approved" totalEntries={totalEntries} />
                    </>
                  );
                })()}
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
                      <DownloadIcon className="w-4 h-4" /> Excel/CSV डाउनलोड
                    </button>
                    <span className="bg-orange-800 text-white text-xs font-black px-3.5 py-2 rounded-xl shadow-inner">
                      {donationsList.length} डोनेशन रिकॉर्ड्स
                    </span>
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="donations" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="नाम, ID, Txn ID, जिला खोजें..."
                      value={tableSearches.donations}
                      onChange={(e) => setSearchFor('donations', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredDonationsList = donationsList.filter(d => {
                    if (!tableSearches.donations.trim()) return true;
                    const q = tableSearches.donations.toLowerCase();
                    return (d.name || '').toLowerCase().includes(q) ||
                      (d.uniqueId || '').toLowerCase().includes(q) ||
                      (d.transactionId || '').toLowerCase().includes(q) ||
                      (d.district || '').toLowerCase().includes(q) ||
                      (d.amount ? String(d.amount) : '').includes(q);
                  });

                  const totalEntries = filteredDonationsList.length;
                  const page = tablePages.donations || 1;
                  const limit = tableEntries.donations || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredDonationsList.slice(startIdx, startIdx + limit);

                  if (totalEntries === 0) {
                    return (
                      <div className="p-16 text-center text-gray-500 bg-gray-50/50">
                        <p className="text-sm font-medium">कोई दान रिकॉर्ड उपलब्ध नहीं है।</p>
                      </div>
                    );
                  }

                  return (
                    <>
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
                            {currentRecords.map((d, idx) => (
                              <tr key={idx} className="hover:bg-orange-50/30 transition-colors">
                                <td className="py-4 px-5 font-bold text-gray-500 font-mono text-xs">{startIdx + idx + 1}</td>
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
                      <TablePagination tab="donations" totalEntries={totalEntries} />
                    </>
                  );
                })()}
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
                        onChange={(e) => setNewHomeAlert({ ...newHomeAlert, type: e.target.value })}
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
                        onChange={(e) => setNewHomeAlert({ ...newHomeAlert, group: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-semibold text-gray-700"
                      >
                        <option value="">ग्रुप चुनें (Select Group)</option>
                        {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map(char => (
                          <option key={char} value={char}>Group {char}</option>
                        ))}
                      </select>
                    </div>
                    <div><label className="block text-gray-700 font-bold mb-1">सदस्य का नाम</label><input type="text" required value={newHomeAlert.member} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, member: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div><label className="block text-gray-700 font-bold mb-1">यूनिक आईडी</label><input type="text" required value={newHomeAlert.uniqueId} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, uniqueId: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>

                    <div><label className="block text-gray-700 font-bold mb-1">सदस्यता तिथि</label><input type="text" required value={newHomeAlert.date} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, date: e.target.value })} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div><label className="block text-gray-700 font-bold mb-1">जिला, ब्लॉक</label><input type="text" required value={newHomeAlert.address} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, address: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        {newHomeAlert.type === 'nidhan' ? "मृतक का नाम" : "बेटी का नाम"}
                      </label>
                      <input type="text" required value={newHomeAlert.daughter} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, daughter: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold mb-1">
                        {newHomeAlert.type === 'nidhan' ? "निधन तिथि" : "विवाह तिथि"}
                      </label>
                      <input type="text" required value={newHomeAlert.marriageDate} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, marriageDate: e.target.value })} placeholder="DD/MM/YYYY" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" />
                    </div>
                    <div><label className="block text-gray-700 font-bold mb-1">A/C Name</label><input type="text" required value={newHomeAlert.accName} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, accName: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div><label className="block text-gray-700 font-bold mb-1">A/C Number</label><input type="text" required value={newHomeAlert.accNo} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, accNo: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>

                    <div><label className="block text-gray-700 font-bold mb-1">IFSC</label><input type="text" required value={newHomeAlert.ifsc} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, ifsc: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div><label className="block text-gray-700 font-bold mb-1">Branch</label><input type="text" required value={newHomeAlert.branch} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, branch: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div><label className="block text-gray-700 font-bold mb-1">Bank Name</label><input type="text" required value={newHomeAlert.bank} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, bank: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>

                    <div><label className="block text-gray-700 font-bold mb-1">Minimum Support</label><input type="text" required value={newHomeAlert.minSupport} onChange={(e) => setNewHomeAlert({ ...newHomeAlert, minSupport: e.target.value })} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#087889]" /></div>
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-bold mb-1">QR Code Image</label>
                      <input
                        id="qr-code-file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleQrUpload}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-[#087889] hover:file:bg-teal-100 transition-colors cursor-pointer text-sm text-gray-600"
                      />
                      {newHomeAlert.qrCodeBase64 && <span className="text-xs text-green-600 mt-1 flex items-center gap-1 font-bold"><CheckCircleIcon className="w-3.5 h-3.5" /> Image Attached</span>}
                    </div>

                    <div className="md:col-span-3 mt-4 text-right border-t border-gray-100 pt-4">
                      <button
                        type="submit"
                        disabled={isSavingAlert}
                        className={`px-6 py-2.5 text-white font-bold rounded-lg shadow transition-colors flex items-center gap-2 ml-auto cursor-pointer ${isSavingAlert
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-[#087889] hover:bg-[#06616e]'
                          }`}
                      >
                        {isSavingAlert ? (
                          <>
                            <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                            अपलोड हो रहा है...
                          </>
                        ) : (
                          'अलर्ट सेव करें'
                        )}
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
                          <td className="py-3 px-4">{alert.member} <br /><span className="text-xs text-gray-500">{alert.uniqueId}</span></td>
                          <td className="py-3 px-4">
                            {alert.marriageDate} <br />
                            <span className="text-xs text-gray-400">
                              {alert.type === 'nidhan' ? 'निधन व्यक्ति: ' : 'बेटी: '} {alert.daughter}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {alert.qrCodeBase64 ? <button onClick={() => setSelectedReceipt(alert.qrCodeBase64)} className="text-blue-600 underline text-xs cursor-pointer">View QR</button> : <span className="text-gray-400 text-xs">No QR</span>}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleHomeAlert(alert.id, alert.isActive)}
                              className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors inline-flex items-center gap-1 cursor-pointer ${alert.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            >
                              {alert.isActive ? <><CheckCircleIcon className="w-3.5 h-3.5" /> Live (दिख रहा है)</> : <><CloseIcon className="w-3.5 h-3.5" /> Hidden (छिपा है)</>}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button onClick={() => handleDeleteHomeAlert(alert.id)} className="text-red-500 hover:text-red-700 p-2 cursor-pointer" title="Delete"><TrashIcon className="w-4 h-4" /></button>
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">बेटी विवाह सहयोग रसीदें (Beti Sahyog Receipts)</h3>
                      <button
                        onClick={() => handleExportReceipts('beti')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" /> Excel/CSV
                      </button>
                      <button
                        onClick={handleToggleBetiAutoApprove}
                        className={`px-3 py-1 border text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${homeSettings.autoApproveBeti
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200'
                          }`}
                      >
                        <RefreshIcon className="w-3.5 h-3.5" /> ऑटो-वेरिफिकेशन: {homeSettings.autoApproveBeti ? 'चालू (AUTO)' : 'बंद (MANUAL)'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा अपलोड की गई सहयोग भुगतान रसीदों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setBetiFilter(f); setPageFor('beti_receipts', 1); }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${betiFilter === f
                          ? 'bg-[#087889] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({betiReceiptsList.filter(r => r.status === 'PENDING').length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({betiReceiptsList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({betiReceiptsList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({betiReceiptsList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="beti_receipts" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="सहयोगकर्ता, लाभार्थी, Txn ID खोजें..."
                      value={tableSearches.beti_receipts}
                      onChange={(e) => setSearchFor('beti_receipts', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredBetiReceipts = betiReceiptsList.filter(r => {
                    const matchesFilter = betiFilter === 'ALL' ? true : r.status === betiFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.beti_receipts.trim()) return true;
                    const q = tableSearches.beti_receipts.toLowerCase();
                    return (r.donorName || '').toLowerCase().includes(q) ||
                      (r.donorUniqueId || '').toLowerCase().includes(q) ||
                      (r.donorMobile || '').toLowerCase().includes(q) ||
                      (r.beneficiaryName || '').toLowerCase().includes(q) ||
                      (r.beneficiaryUniqueId || '').toLowerCase().includes(q) ||
                      (r.transactionId || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredBetiReceipts.length;
                  const page = tablePages.beti_receipts || 1;
                  const limit = tableEntries.beti_receipts || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredBetiReceipts.slice(startIdx, startIdx + limit);

                  return (
                    <>
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
                            {currentRecords.map((receipt) => (
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
                                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <EyeIcon className="w-3.5 h-3.5" /> विवरण एवं रसीद (Detail)
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${receipt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
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
                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                        title="Approve"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                    {receipt.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleBetiReceiptAction(receipt.id, 'REJECTED')}
                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <CloseIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {totalEntries === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                                  इस फिल्टर या खोज के लिए कोई रसीद नहीं है
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="beti_receipts" totalEntries={totalEntries} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB: BETI ACCOUNT HOLDER WISE */}
            {activeTab === 'beti_account_holder' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {selectedAdminBetiHolder ? (
                  /* Drilldown View for Specific Account Holder */
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <button
                          onClick={() => setSelectedAdminBetiHolder(null)}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer mb-2"
                        >
                          ← वापस खाताधारक सूची (Back to List)
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-800">
                          खाताधारक: {selectedAdminBetiHolder.name} - दानदाता विवरण
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          जिला: {selectedAdminBetiHolder.district} | ब्लॉक: {selectedAdminBetiHolder.block} | विवाह तिथि: {selectedAdminBetiHolder.marriageDate}
                        </p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">कुल सहयोग राशि (Total Collection)</span>
                        <span className="text-2xl font-black text-emerald-600">₹ {selectedAdminBetiHolder.totalCollection.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>

                    {/* Donors Table for Selected Holder */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="beti_account_holder" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="डोनर नाम, ID खोजें..."
                          value={tableSearches.beti_account_holder}
                          onChange={(e) => setSearchFor('beti_account_holder', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      const allHolderDonors = betiReceiptsList
                        .filter(r => r.status === 'APPROVED' && (r.beneficiaryName || r.donationToMember || '').trim().toLowerCase() === selectedAdminBetiHolder.name.toLowerCase());

                      const filteredDonors = allHolderDonors.filter(d => {
                        if (!tableSearches.beti_account_holder.trim()) return true;
                        const q = tableSearches.beti_account_holder.toLowerCase();
                        return (d.donorName || '').toLowerCase().includes(q) ||
                          (d.donorUniqueId || '').toLowerCase().includes(q) ||
                          (d.donorMobile || '').toLowerCase().includes(q) ||
                          (d.transactionId || '').toLowerCase().includes(q);
                      });

                      const totalEntries = filteredDonors.length;
                      const page = tablePages.beti_account_holder || 1;
                      const limit = tableEntries.beti_account_holder || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredDonors.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                                  <th className="py-3 px-4">यूनिक आईडी (Unique ID)</th>
                                  <th className="py-3 px-4">राशि (Amount)</th>
                                  <th className="py-3 px-4">ट्रांजेक्शन विवरण</th>
                                  <th className="py-3 px-4 text-center">रसीद</th>
                                  <th className="py-3 px-4">तिथि (Date)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-gray-50/50">
                                    <td className="py-3 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3 px-4 font-bold text-gray-800">{item.donorName || 'N/A'}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹ {item.amount}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{item.transactionId || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">
                                      {item.receiptImage ? (
                                        <button
                                          onClick={() => setSelectedReceiptForDetail(item)}
                                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <EyeIcon className="w-3 h-3" /> देखें
                                        </button>
                                      ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500 font-semibold">{item.sahyogDate || item.date || '2025-04-10'}</td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      इस खाताधारक के लिए कोई सहयोग रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="beti_account_holder" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  /* Main Account Holders Summary View */
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-extrabold text-gray-800">बेटी विवाह - खाताधारक अनुसार सूची (Account Holder Wise)</h3>
                          <button
                            onClick={() => handleOpenAddAccountHolder('beti')}
                            className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" /> नया खाताधारक जोड़ें (Add Account Holder)
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">प्रत्येक लाभार्थी (खाताधारक) को प्राप्त कुल सहयोग व दानदाताओं का विवरण।</p>
                      </div>
                    </div>

                    {/* Table Top Controls */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="beti_account_holder" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="खाताधारक का नाम खोजें..."
                          value={tableSearches.beti_account_holder}
                          onChange={(e) => setSearchFor('beti_account_holder', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      // Group approved receipts & applications
                      const holderMap = {};
                      betiList.forEach(app => {
                        const name = (app.applicantName || app.name || '').trim();
                        const key = `beti_${name.toLowerCase()}`;
                        if (name && !deletedAccountHolders.includes(key)) {
                          holderMap[name] = {
                            id: app.id,
                            name: name,
                            district: app.district || 'संत कबीर नगर',
                            block: app.block || 'खलीलाबाद',
                            marriageDate: app.marriageDate || app.date || '2025-04-10',
                            perMemberAmount: Number(app.recommendedAmount) || 50,
                            totalCollection: 0,
                            donorsCount: 0
                          };
                        }
                      });

                      betiReceiptsList.filter(r => r.status === 'APPROVED').forEach(r => {
                        const bName = (r.beneficiaryName || r.donationToMember || 'सुरेश चंद्र').trim();
                        const key = `beti_${bName.toLowerCase()}`;
                        if (!deletedAccountHolders.includes(key)) {
                          if (!holderMap[bName]) {
                            holderMap[bName] = {
                              name: bName,
                              district: r.donorDistrict || 'संत कबीर नगर',
                              block: r.donorBlock || 'खलीलाबाद',
                              marriageDate: r.marriageDate || '2025-04-10',
                              perMemberAmount: r.amount || 50,
                              totalCollection: 0,
                              donorsCount: 0
                            };
                          }
                          holderMap[bName].totalCollection += (Number(r.amount) || 0);
                          holderMap[bName].donorsCount += 1;
                        }
                      });

                      const allHolders = Object.values(holderMap);
                      const filteredHolders = allHolders.filter(h => {
                        if (!tableSearches.beti_account_holder.trim()) return true;
                        const q = tableSearches.beti_account_holder.toLowerCase();
                        return h.name.toLowerCase().includes(q) ||
                          h.district.toLowerCase().includes(q) ||
                          h.block.toLowerCase().includes(q);
                      });

                      const totalEntries = filteredHolders.length;
                      const page = tablePages.beti_account_holder || 1;
                      const limit = tableEntries.beti_account_holder || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredHolders.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[950px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">खाताधारक / लाभार्थी (Name)</th>
                                  <th className="py-3 px-4">जिला / ब्लॉक</th>
                                  <th className="py-3 px-4">विवाह तिथि (Date)</th>
                                  <th className="py-3 px-4">कुल सहयोग राशि</th>
                                  <th className="py-3 px-4 text-center">दानदाता संख्या</th>
                                  <th className="py-3 px-4 text-center">कार्यवाही (Actions)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((holder, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="py-3.5 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3.5 px-4 font-bold text-gray-900">{holder.name}</td>
                                    <td className="py-3.5 px-4 text-gray-600 text-xs">{holder.district} / {holder.block}</td>
                                    <td className="py-3.5 px-4 text-gray-500 text-xs font-semibold">{holder.marriageDate}</td>
                                    <td className="py-3.5 px-4 font-bold text-emerald-600">₹ {holder.totalCollection.toLocaleString('en-IN')}.00</td>
                                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">{holder.donorsCount}</td>
                                    <td className="py-3.5 px-4 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => setSelectedAdminBetiHolder(holder)}
                                          className="px-2.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="डोनर लिस्ट देखें"
                                        >
                                          <EyeIcon className="w-3.5 h-3.5" /> डोनर्स
                                        </button>
                                        <button
                                          onClick={() => handleOpenEditAccountHolder('beti', holder)}
                                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="एडिट करें"
                                        >
                                          <EditIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteAccountHolder('beti', holder)}
                                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="हटाएं"
                                        >
                                          <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      कोई खाताधारक रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="beti_account_holder" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB: BETI ALERT WISE */}
            {activeTab === 'beti_alert_wise' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {selectedAdminBetiAlert ? (
                  /* Drilldown for Specific Alert */
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <button
                          onClick={() => setSelectedAdminBetiAlert(null)}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer mb-2"
                        >
                          ← वापस अलर्ट सूची (Back to Alerts)
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-800">
                          {selectedAdminBetiAlert.title} - दानदाता विवरण ({selectedAdminBetiAlert.beneficiaryName})
                        </h3>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">कुल सहयोग राशि (Total Collection)</span>
                        <span className="text-2xl font-black text-emerald-600">₹ {selectedAdminBetiAlert.totalCollection.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>

                    {/* Donors Table for Selected Alert */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="beti_alert_wise" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="डोनर नाम, ID खोजें..."
                          value={tableSearches.beti_alert_wise}
                          onChange={(e) => setSearchFor('beti_alert_wise', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      const allAlertDonors = betiReceiptsList
                        .filter(r => r.status === 'APPROVED' && Number(r.alertNumber || 1) === selectedAdminBetiAlert.alertNumber);

                      const filteredDonors = allAlertDonors.filter(d => {
                        if (!tableSearches.beti_alert_wise.trim()) return true;
                        const q = tableSearches.beti_alert_wise.toLowerCase();
                        return (d.donorName || '').toLowerCase().includes(q) ||
                          (d.donorUniqueId || '').toLowerCase().includes(q) ||
                          (d.donorMobile || '').toLowerCase().includes(q) ||
                          (d.transactionId || '').toLowerCase().includes(q);
                      });

                      const totalEntries = filteredDonors.length;
                      const page = tablePages.beti_alert_wise || 1;
                      const limit = tableEntries.beti_alert_wise || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredDonors.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                                  <th className="py-3 px-4">यूनिक आईडी (Unique ID)</th>
                                  <th className="py-3 px-4">राशि (Amount)</th>
                                  <th className="py-3 px-4">ट्रांजेक्शन ID</th>
                                  <th className="py-3 px-4 text-center">रसीद</th>
                                  <th className="py-3 px-4">तिथि (Date)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-gray-50/50">
                                    <td className="py-3 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3 px-4 font-bold text-gray-800">{item.donorName || 'N/A'}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹ {item.amount}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{item.transactionId || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">
                                      {item.receiptImage ? (
                                        <button
                                          onClick={() => setSelectedReceiptForDetail(item)}
                                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <EyeIcon className="w-3 h-3" /> देखें
                                        </button>
                                      ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500 font-semibold">{item.sahyogDate || item.date || '2025-04-10'}</td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      इस अलर्ट के लिए कोई सहयोग रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="beti_alert_wise" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  /* Main Alerts Grid View */
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-extrabold text-gray-800">बेटी विवाह - अलर्ट अनुसार सूची (Alert Wise Sahyog)</h3>
                          <button
                            onClick={() => handleOpenAddAlert('beti')}
                            className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" /> नया अलर्ट बनाएं (Create Alert)
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">प्रत्येक सक्रिय अलर्ट का कुल कलेक्शन और डोनर विवरण।</p>
                      </div>
                    </div>

                    {(() => {
                      const alertMap = {};

                      // Base alerts 1 & 2 if not deleted
                      if (!deletedAlertKeys.includes('beti_1')) {
                        alertMap[1] = {
                          alertNumber: 1,
                          type: 'beti',
                          title: 'Alert 1',
                          beneficiaryName: betiList[0]?.applicantName || 'सुरेश चंद्र',
                          totalCollection: 0,
                          donorsCount: 0
                        };
                      }
                      if (!deletedAlertKeys.includes('beti_2')) {
                        alertMap[2] = {
                          alertNumber: 2,
                          type: 'beti',
                          title: 'Alert 2',
                          beneficiaryName: betiList[1]?.applicantName || 'संतोष कुमार',
                          totalCollection: 0,
                          donorsCount: 0
                        };
                      }

                      homeAlertsList.filter(a => !a.type || a.type === 'beti').forEach((a, idx) => {
                        const num = Number(a.alertNumber || a.alertNo || idx + 1);
                        if (num && !deletedAlertKeys.includes(`beti_${num}`)) {
                          alertMap[num] = {
                            id: a.id,
                            alertNumber: num,
                            type: 'beti',
                            title: a.title || `Alert ${num}`,
                            beneficiaryName: a.beneficiaryName || a.member || `अलर्ट ${num}`,
                            totalCollection: 0,
                            donorsCount: 0
                          };
                        }
                      });

                      betiReceiptsList.filter(r => r.status === 'APPROVED').forEach(r => {
                        const num = Number(r.alertNumber || 1);
                        if (!deletedAlertKeys.includes(`beti_${num}`)) {
                          if (!alertMap[num]) {
                            alertMap[num] = {
                              alertNumber: num,
                              type: 'beti',
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

                      const alertsArray = Object.values(alertMap).sort((a, b) => a.alertNumber - b.alertNumber);

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {alertsArray.map(alert => (
                            <div key={alert.alertNumber} className="bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-center">
                              <div>
                                <h4 className="text-lg font-black text-gray-800">{alert.title}</h4>
                                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">
                                  {alert.beneficiaryName}
                                </span>
                              </div>

                              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-gray-500">कलेक्शन:</span>
                                  <span className="text-emerald-600 font-extrabold text-sm">₹ {alert.totalCollection.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-gray-500">डोनर्स:</span>
                                  <span className="text-gray-800 font-extrabold">{alert.donorsCount}</span>
                                </div>

                                <button
                                  onClick={() => setSelectedAdminBetiAlert(alert)}
                                  className="w-full py-2 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer mt-1"
                                >
                                  डोनर लिस्ट देखें (View Details)
                                </button>

                                <div className="flex gap-2 mt-1">
                                  <button
                                    onClick={() => handleOpenEditAlert(alert)}
                                    className="flex-1 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <EditIcon className="w-3.5 h-3.5" /> एडिट
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAlert(alert)}
                                    className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5" /> हटाएं
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NIDHAN RECEIPTS VERIFICATION */}
            {activeTab === 'nidhan_receipts' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">मृत्यु सहयोग रसीदें (Nidhan Sahyog Receipts)</h3>
                      <button
                        onClick={() => handleExportReceipts('nidhan')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" /> Excel/CSV
                      </button>
                      <button
                        onClick={handleToggleNidhanAutoApprove}
                        className={`px-3 py-1 border text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer ${homeSettings.autoApproveNidhan
                          ? 'bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200'
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border-gray-200'
                          }`}
                      >
                        <RefreshIcon className="w-3.5 h-3.5" /> ऑटो-वेरिफिकेशन: {homeSettings.autoApproveNidhan ? 'चालू (AUTO)' : 'बंद (MANUAL)'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा अपलोड की गई सहयोग भुगतान रसीदों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setNidhanFilter(f); setPageFor('nidhan_receipts', 1); }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${nidhanFilter === f
                          ? 'bg-[#087889] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({nidhanReceiptsList.filter(r => r.status === 'PENDING').length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({nidhanReceiptsList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({nidhanReceiptsList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({nidhanReceiptsList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="nidhan_receipts" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="सहयोगकर्ता, लाभार्थी, Txn ID खोजें..."
                      value={tableSearches.nidhan_receipts}
                      onChange={(e) => setSearchFor('nidhan_receipts', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredNidhanReceipts = nidhanReceiptsList.filter(r => {
                    const matchesFilter = nidhanFilter === 'ALL' ? true : r.status === nidhanFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.nidhan_receipts.trim()) return true;
                    const q = tableSearches.nidhan_receipts.toLowerCase();
                    return (r.donorName || '').toLowerCase().includes(q) ||
                      (r.donorUniqueId || '').toLowerCase().includes(q) ||
                      (r.donorMobile || '').toLowerCase().includes(q) ||
                      (r.beneficiaryName || '').toLowerCase().includes(q) ||
                      (r.beneficiaryUniqueId || '').toLowerCase().includes(q) ||
                      (r.transactionId || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredNidhanReceipts.length;
                  const page = tablePages.nidhan_receipts || 1;
                  const limit = tableEntries.nidhan_receipts || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredNidhanReceipts.slice(startIdx, startIdx + limit);

                  return (
                    <>
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
                            {currentRecords.map((receipt) => (
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
                                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <EyeIcon className="w-3.5 h-3.5" /> विवरण एवं रसीद (Detail)
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${receipt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
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
                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                        title="Approve"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                    {receipt.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleNidhanReceiptAction(receipt.id, 'REJECTED')}
                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <CloseIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {totalEntries === 0 && (
                              <tr>
                                <td colSpan="6" className="text-center py-8 text-gray-500 font-bold">
                                  इस फिल्टर या खोज के लिए कोई रसीद नहीं है
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="nidhan_receipts" totalEntries={totalEntries} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB: NIDHAN ACCOUNT HOLDER WISE */}
            {activeTab === 'nidhan_account_holder' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {selectedAdminNidhanHolder ? (
                  /* Drilldown View for Specific Deceased Family */
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <button
                          onClick={() => setSelectedAdminNidhanHolder(null)}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer mb-2"
                        >
                          ← वापस खाताधारक सूची (Back to List)
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-800">
                          खाताधारक (परिवार): {selectedAdminNidhanHolder.name} - दानदाता विवरण
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          जिला: {selectedAdminNidhanHolder.district} | ब्लॉक: {selectedAdminNidhanHolder.block} | निधन तिथि: {selectedAdminNidhanHolder.nidhanDate}
                        </p>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">कुल सहयोग राशि (Total Collection)</span>
                        <span className="text-2xl font-black text-emerald-600">₹ {selectedAdminNidhanHolder.totalCollection.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>

                    {/* Donors Table for Selected Holder */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="nidhan_account_holder" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="डोनर नाम, ID खोजें..."
                          value={tableSearches.nidhan_account_holder}
                          onChange={(e) => setSearchFor('nidhan_account_holder', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      const allHolderDonors = nidhanReceiptsList
                        .filter(r => r.status === 'APPROVED' && (r.beneficiaryName || r.donationToMember || r.deceasedName || '').trim().toLowerCase() === selectedAdminNidhanHolder.name.toLowerCase());

                      const filteredDonors = allHolderDonors.filter(d => {
                        if (!tableSearches.nidhan_account_holder.trim()) return true;
                        const q = tableSearches.nidhan_account_holder.toLowerCase();
                        return (d.donorName || '').toLowerCase().includes(q) ||
                          (d.donorUniqueId || '').toLowerCase().includes(q) ||
                          (d.donorMobile || '').toLowerCase().includes(q) ||
                          (d.transactionId || '').toLowerCase().includes(q);
                      });

                      const totalEntries = filteredDonors.length;
                      const page = tablePages.nidhan_account_holder || 1;
                      const limit = tableEntries.nidhan_account_holder || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredDonors.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                                  <th className="py-3 px-4">यूनिक आईडी (Unique ID)</th>
                                  <th className="py-3 px-4">राशि (Amount)</th>
                                  <th className="py-3 px-4">ट्रांजेक्शन विवरण</th>
                                  <th className="py-3 px-4 text-center">रसीद</th>
                                  <th className="py-3 px-4">तिथि (Date)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-gray-50/50">
                                    <td className="py-3 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3 px-4 font-bold text-gray-800">{item.donorName || 'N/A'}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹ {item.amount}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{item.transactionId || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">
                                      {item.receiptImage ? (
                                        <button
                                          onClick={() => setSelectedReceiptForDetail(item)}
                                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <EyeIcon className="w-3 h-3" /> देखें
                                        </button>
                                      ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500 font-semibold">{item.sahyogDate || item.date || '2025-04-10'}</td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      इस खाताधारक के लिए कोई सहयोग रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="nidhan_account_holder" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  /* Main Account Holders Summary View */
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-extrabold text-gray-800">निधन सहयोग - खाताधारक अनुसार सूची (Account Holder Wise)</h3>
                          <button
                            onClick={() => handleOpenAddAccountHolder('nidhan')}
                            className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" /> नया खाताधारक जोड़ें (Add Account Holder)
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">प्रत्येक दिवंगत सदस्य परिवार को प्राप्त कुल सहयोग व दानदाताओं का विवरण।</p>
                      </div>
                    </div>

                    {/* Table Top Controls */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="nidhan_account_holder" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="दिवंगत सदस्य/परिवार का नाम खोजें..."
                          value={tableSearches.nidhan_account_holder}
                          onChange={(e) => setSearchFor('nidhan_account_holder', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      const holderMap = {};
                      nidhanList.forEach(app => {
                        const name = (app.deceasedName || app.applicantName || app.name || '').trim();
                        const key = `nidhan_${name.toLowerCase()}`;
                        if (name && !deletedAccountHolders.includes(key)) {
                          holderMap[name] = {
                            id: app.id,
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

                      nidhanReceiptsList.filter(r => r.status === 'APPROVED').forEach(r => {
                        const bName = (r.beneficiaryName || r.donationToMember || r.deceasedName || 'राम प्रसाद').trim();
                        const key = `nidhan_${bName.toLowerCase()}`;
                        if (!deletedAccountHolders.includes(key)) {
                          if (!holderMap[bName]) {
                            holderMap[bName] = {
                              name: bName,
                              district: r.donorDistrict || 'संत कबीर नगर',
                              block: r.donorBlock || 'खलीलाबाद',
                              nidhanDate: r.nidhanDate || r.deathDate || '2025-04-10',
                              perMemberAmount: r.amount || 50,
                              totalCollection: 0,
                              donorsCount: 0
                            };
                          }
                          holderMap[bName].totalCollection += (Number(r.amount) || 0);
                          holderMap[bName].donorsCount += 1;
                        }
                      });

                      const allHolders = Object.values(holderMap);
                      const filteredHolders = allHolders.filter(h => {
                        if (!tableSearches.nidhan_account_holder.trim()) return true;
                        const q = tableSearches.nidhan_account_holder.toLowerCase();
                        return h.name.toLowerCase().includes(q) ||
                          h.district.toLowerCase().includes(q) ||
                          h.block.toLowerCase().includes(q);
                      });

                      const totalEntries = filteredHolders.length;
                      const page = tablePages.nidhan_account_holder || 1;
                      const limit = tableEntries.nidhan_account_holder || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredHolders.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[950px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">दिवंगत सदस्य / परिवार (Name)</th>
                                  <th className="py-3 px-4">जिला / ब्लॉक</th>
                                  <th className="py-3 px-4">निधन तिथि (Date)</th>
                                  <th className="py-3 px-4">कुल सहयोग राशि</th>
                                  <th className="py-3 px-4 text-center">दानदाता संख्या</th>
                                  <th className="py-3 px-4 text-center">कार्यवाही (Actions)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((holder, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="py-3.5 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3.5 px-4 font-bold text-gray-900">{holder.name}</td>
                                    <td className="py-3.5 px-4 text-gray-600 text-xs">{holder.district} / {holder.block}</td>
                                    <td className="py-3.5 px-4 text-gray-500 text-xs font-semibold">{holder.nidhanDate}</td>
                                    <td className="py-3.5 px-4 font-bold text-emerald-600">₹ {holder.totalCollection.toLocaleString('en-IN')}.00</td>
                                    <td className="py-3.5 px-4 text-center font-bold text-gray-700">{holder.donorsCount}</td>
                                    <td className="py-3.5 px-4 text-center">
                                      <div className="flex items-center justify-center gap-1.5">
                                        <button
                                          onClick={() => setSelectedAdminNidhanHolder(holder)}
                                          className="px-2.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="डोनर लिस्ट देखें"
                                        >
                                          <EyeIcon className="w-3.5 h-3.5" /> डोनर्स
                                        </button>
                                        <button
                                          onClick={() => handleOpenEditAccountHolder('nidhan', holder)}
                                          className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="एडिट करें"
                                        >
                                          <EditIcon className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteAccountHolder('nidhan', holder)}
                                          className="px-2.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition-colors shadow-sm cursor-pointer inline-flex items-center gap-1"
                                          title="हटाएं"
                                        >
                                          <TrashIcon className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      कोई खाताधारक रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="nidhan_account_holder" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NIDHAN ALERT WISE */}
            {activeTab === 'nidhan_alert_wise' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                {selectedAdminNidhanAlert ? (
                  /* Drilldown for Specific Alert */
                  <div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <button
                          onClick={() => setSelectedAdminNidhanAlert(null)}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer mb-2"
                        >
                          ← वापस अलर्ट सूची (Back to Alerts)
                        </button>
                        <h3 className="text-xl font-extrabold text-gray-800">
                          {selectedAdminNidhanAlert.title} - दानदाता विवरण ({selectedAdminNidhanAlert.beneficiaryName})
                        </h3>
                      </div>

                      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                        <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">कुल सहयोग राशि (Total Collection)</span>
                        <span className="text-2xl font-black text-emerald-600">₹ {selectedAdminNidhanAlert.totalCollection.toLocaleString('en-IN')}.00</span>
                      </div>
                    </div>

                    {/* Donors Table for Selected Alert */}
                    <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                      <ShowEntriesDropdown tab="nidhan_alert_wise" />
                      <div className="relative w-full sm:w-64">
                        <input
                          type="text"
                          placeholder="डोनर नाम, ID खोजें..."
                          value={tableSearches.nidhan_alert_wise}
                          onChange={(e) => setSearchFor('nidhan_alert_wise', e.target.value)}
                          className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                        />
                        <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                      </div>
                    </div>

                    {(() => {
                      const allAlertDonors = nidhanReceiptsList
                        .filter(r => r.status === 'APPROVED' && Number(r.alertNumber || 1) === selectedAdminNidhanAlert.alertNumber);

                      const filteredDonors = allAlertDonors.filter(d => {
                        if (!tableSearches.nidhan_alert_wise.trim()) return true;
                        const q = tableSearches.nidhan_alert_wise.toLowerCase();
                        return (d.donorName || '').toLowerCase().includes(q) ||
                          (d.donorUniqueId || '').toLowerCase().includes(q) ||
                          (d.donorMobile || '').toLowerCase().includes(q) ||
                          (d.transactionId || '').toLowerCase().includes(q);
                      });

                      const totalEntries = filteredDonors.length;
                      const page = tablePages.nidhan_alert_wise || 1;
                      const limit = tableEntries.nidhan_alert_wise || 10;
                      const startIdx = (page - 1) * limit;
                      const currentRecords = filteredDonors.slice(startIdx, startIdx + limit);

                      return (
                        <>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                              <thead>
                                <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                                  <th className="py-3 px-4">S NO</th>
                                  <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                                  <th className="py-3 px-4">यूनिक आईडी (Unique ID)</th>
                                  <th className="py-3 px-4">राशि (Amount)</th>
                                  <th className="py-3 px-4">ट्रांजेक्शन ID</th>
                                  <th className="py-3 px-4 text-center">रसीद</th>
                                  <th className="py-3 px-4">तिथि (Date)</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                                {currentRecords.map((item, idx) => (
                                  <tr key={item.id || idx} className="hover:bg-gray-50/50">
                                    <td className="py-3 px-4 font-bold text-gray-500">{startIdx + idx + 1}</td>
                                    <td className="py-3 px-4 font-bold text-gray-800">{item.donorName || 'N/A'}</td>
                                    <td className="py-3 px-4 font-mono text-xs text-gray-600">{item.donorUniqueId || 'N/A'}</td>
                                    <td className="py-3 px-4 font-bold text-emerald-600">₹ {item.amount}</td>
                                    <td className="py-3 px-4 text-xs font-mono text-gray-500">{item.transactionId || 'N/A'}</td>
                                    <td className="py-3 px-4 text-center">
                                      {item.receiptImage ? (
                                        <button
                                          onClick={() => setSelectedReceiptForDetail(item)}
                                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                        >
                                          <EyeIcon className="w-3 h-3" /> देखें
                                        </button>
                                      ) : <span className="text-gray-400 text-xs">-</span>}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500 font-semibold">{item.sahyogDate || item.date || '2025-04-10'}</td>
                                  </tr>
                                ))}
                                {totalEntries === 0 && (
                                  <tr>
                                    <td colSpan="7" className="text-center py-8 text-gray-500 font-bold">
                                      इस अलर्ट के लिए कोई सहयोग रिकॉर्ड नहीं मिला।
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <TablePagination tab="nidhan_alert_wise" totalEntries={totalEntries} />
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  /* Main Alerts Grid View */
                  <div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-6 gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-extrabold text-gray-800">निधन सहयोग - अलर्ट अनुसार सूची (Alert Wise Sahyog)</h3>
                          <button
                            onClick={() => handleOpenAddAlert('nidhan')}
                            className="px-3.5 py-1.5 bg-[#087889] hover:bg-[#06616e] text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <PlusIcon className="w-4 h-4" /> नया अलर्ट बनाएं (Create Alert)
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">प्रत्येक सक्रिय अलर्ट का कुल कलेक्शन और डोनर विवरण।</p>
                      </div>
                    </div>

                    {(() => {
                      const alertMap = {};

                      // Base alerts 1 & 2 if not deleted
                      if (!deletedAlertKeys.includes('nidhan_1')) {
                        alertMap[1] = {
                          alertNumber: 1,
                          type: 'nidhan',
                          title: 'Alert 1',
                          beneficiaryName: nidhanList[0]?.deceasedName || nidhanList[0]?.applicantName || 'राम प्रसाद',
                          totalCollection: 0,
                          donorsCount: 0
                        };
                      }
                      if (!deletedAlertKeys.includes('nidhan_2')) {
                        alertMap[2] = {
                          alertNumber: 2,
                          type: 'nidhan',
                          title: 'Alert 2',
                          beneficiaryName: nidhanList[1]?.deceasedName || nidhanList[1]?.applicantName || 'राजेश वर्मा',
                          totalCollection: 0,
                          donorsCount: 0
                        };
                      }

                      homeAlertsList.filter(a => a.type === 'nidhan').forEach((a, idx) => {
                        const num = Number(a.alertNumber || a.alertNo || idx + 1);
                        if (num && !deletedAlertKeys.includes(`nidhan_${num}`)) {
                          alertMap[num] = {
                            id: a.id,
                            alertNumber: num,
                            type: 'nidhan',
                            title: a.title || `Alert ${num}`,
                            beneficiaryName: a.beneficiaryName || a.member || `अलर्ट ${num}`,
                            totalCollection: 0,
                            donorsCount: 0
                          };
                        }
                      });

                      nidhanReceiptsList.filter(r => r.status === 'APPROVED').forEach(r => {
                        const num = Number(r.alertNumber || 1);
                        if (!deletedAlertKeys.includes(`nidhan_${num}`)) {
                          if (!alertMap[num]) {
                            alertMap[num] = {
                              alertNumber: num,
                              type: 'nidhan',
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

                      const alertsArray = Object.values(alertMap).sort((a, b) => a.alertNumber - b.alertNumber);

                      return (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                          {alertsArray.map(alert => (
                            <div key={alert.alertNumber} className="bg-gray-50 hover:bg-white rounded-2xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between text-center">
                              <div>
                                <h4 className="text-lg font-black text-gray-800">{alert.title}</h4>
                                <span className="text-xs font-bold text-slate-700 bg-slate-200 px-2 py-0.5 rounded-md inline-block mt-1">
                                  {alert.beneficiaryName}
                                </span>
                              </div>

                              <div className="pt-4 mt-4 border-t border-gray-200 flex flex-col gap-2">
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-gray-500">कलेक्शन:</span>
                                  <span className="text-emerald-600 font-extrabold text-sm">₹ {alert.totalCollection.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold">
                                  <span className="text-gray-500">डोनर्स:</span>
                                  <span className="text-gray-800 font-extrabold">{alert.donorsCount}</span>
                                </div>

                                <button
                                  onClick={() => setSelectedAdminNidhanAlert(alert)}
                                  className="w-full py-2 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl text-xs transition-colors shadow-sm cursor-pointer mt-1"
                                >
                                  डोनर लिस्ट देखें (View Details)
                                </button>

                                <div className="flex gap-2 mt-1">
                                  <button
                                    onClick={() => handleOpenEditAlert(alert)}
                                    className="flex-1 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <EditIcon className="w-3.5 h-3.5" /> एडिट
                                  </button>
                                  <button
                                    onClick={() => handleDeleteAlert(alert)}
                                    className="flex-1 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 font-bold rounded-lg text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                                  >
                                    <TrashIcon className="w-3.5 h-3.5" /> हटाएं
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            )}

            {/* TAB: RENEWALS VERIFICATION */}
            {activeTab === 'renewals' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">वार्षिक नवीनीकरण रसीदें (Annual Renewals)</h3>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा अपलोड की गई नवीनीकरण भुगतान रसीदों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setRenewalsFilter(f); setPageFor('renewals', 1); }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${renewalsFilter === f
                          ? 'bg-[#087889] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({renewalsList.filter(r => r.status === 'PENDING').length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({renewalsList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({renewalsList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({renewalsList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="renewals" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="सदस्य का नाम, ID, Txn ID खोजें..."
                      value={tableSearches.renewals}
                      onChange={(e) => setSearchFor('renewals', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredRenewals = renewalsList.filter(r => {
                    const matchesFilter = renewalsFilter === 'ALL' ? true : r.status === renewalsFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.renewals.trim()) return true;
                    const q = tableSearches.renewals.toLowerCase();
                    return (r.name || r.donorName || '').toLowerCase().includes(q) ||
                      (r.uniqueId || r.donorUniqueId || '').toLowerCase().includes(q) ||
                      (r.mobile || r.donorMobile || '').toLowerCase().includes(q) ||
                      (r.transactionId || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredRenewals.length;
                  const page = tablePages.renewals || 1;
                  const limit = tableEntries.renewals || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredRenewals.slice(startIdx, startIdx + limit);

                  return (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead>
                            <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                              <th className="py-3 px-4">सहयोगकर्ता (Donor)</th>
                              <th className="py-3 px-4">ट्रांजेक्शन (Transaction Details)</th>
                              <th className="py-3 px-4 text-center">भुगतान रसीद</th>
                              <th className="py-3 px-4 text-center">स्थिति (Status)</th>
                              <th className="py-3 px-4 text-right">एक्शन</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-medium">
                            {currentRecords.map((receipt) => (
                              <tr key={receipt.id} className="hover:bg-gray-50/50">
                                <td className="py-3 px-4">
                                  <span className="font-bold text-gray-800">{receipt.name || receipt.donorName}</span>
                                  <div className="text-xs text-gray-500 font-semibold mt-0.5">ID: {receipt.uniqueId || receipt.donorUniqueId} | Mob: {receipt.mobile || receipt.donorMobile}</div>
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
                                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <EyeIcon className="w-3.5 h-3.5" /> विवरण एवं रसीद (Detail)
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-xs">No Image</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${receipt.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
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
                                        onClick={() => handleRenewalReceiptAction(receipt.id, 'APPROVED')}
                                        className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                        title="Approve"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                    {receipt.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleRenewalReceiptAction(receipt.id, 'REJECTED')}
                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <CloseIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {totalEntries === 0 && (
                              <tr>
                                <td colSpan="5" className="text-center py-8 text-gray-500 font-bold">
                                  इस फिल्टर या खोज के लिए कोई रसीद नहीं है
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="renewals" totalEntries={totalEntries} />
                    </>
                  );
                })()}
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
                      <FileTextIcon className="w-5 h-5 text-[#087889]" /> मुख्य बैनर शीर्षक (Header Banner Title)
                    </h4>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">मुख्य शीर्षक (Main Banner Title)</label>
                      <select
                        required
                        value={homeSettings.headerTitle}
                        onChange={(e) => setHomeSettings({ ...homeSettings, headerTitle: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-bold text-gray-800"
                      >
                        <option value="बेटी विवाह सहायता योजना">बेटी विवाह सहायता योजना (Beti Vivah Sahyog Yojna)</option>
                        <option value="निधन सहायता योजना">निधन सहायता योजना (Nidhan Sahyog Yojna)</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. Alert Box Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <AlertCircleIcon className="w-5 h-5 text-[#087889]" /> सहयोग अलर्ट बॉक्स (Cooperation Alert Box)
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">अलर्ट बॉक्स शीर्षक (Alert Box Title)</label>
                        <input
                          type="text"
                          required
                          value={homeSettings.alertTitle}
                          onChange={(e) => setHomeSettings({ ...homeSettings, alertTitle: e.target.value })}
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
                          onChange={(e) => setHomeSettings({ ...homeSettings, alertPoints: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                          placeholder="सहयोग की अंतिम तिथि: 10 जुलाई से 26 जुलाई 2026 तक&#10;नियम: 1 ट्रांजेक्शन = 1 रसीद अपलोड"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Instructions Box Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <h4 className="font-bold text-gray-800 mb-3 text-base flex items-center gap-2">
                      <LightbulbIcon className="w-5 h-5 text-[#087889]" /> महत्वपूर्ण निर्देश बॉक्स (Instructions Box)
                    </h4>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-gray-700 font-bold mb-1">निर्देश शीर्षक (Instruction Title)</label>
                        <input
                          type="text"
                          required
                          value={homeSettings.instructionTitle}
                          onChange={(e) => setHomeSettings({ ...homeSettings, instructionTitle: e.target.value })}
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
                          onChange={(e) => setHomeSettings({ ...homeSettings, instructionText: e.target.value })}
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
                          onChange={(e) => setHomeSettings({ ...homeSettings, instructionNote: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                          placeholder="नोट: किसी अन्य GROUP में भेजा गया सहयोग मान्य नहीं होगा..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-right border-t border-gray-100 pt-4">
                    <button
                      type="submit"
                      disabled={isSavingHomeSettings}
                      className="px-8 py-3 bg-[#087889] hover:bg-[#06616e] disabled:bg-gray-400 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSavingHomeSettings ? (
                        <>
                          <RefreshIcon className="w-4 h-4 animate-spin" /> सहेजा जा रहा है...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="w-4 h-4" /> होम पेज सेटिंग्स सहेजें (Save Settings)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: SCHEMES SETTINGS */}
            {activeTab === 'schemes_settings' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-800">प्रमुख योजनाएं प्रबंधन (Manage Schemes Settings)</h3>
                    <p className="text-xs text-gray-500 mt-1">यहाँ से आप मुख्य वेबसाइट के होम पेज पर प्रदर्शित दोनों योजनाओं की जानकारी बदल सकते हैं।</p>
                  </div>
                </div>

                <form onSubmit={handleSaveSchemesSettings} className="space-y-6 text-sm">
                  {/* Schemes Box Config */}
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="space-y-6">

                      {/* Scheme 1: Accidental Death Relief */}
                      <div className="border-b border-gray-200 pb-4">
                        <h5 className="font-bold text-gray-700 mb-2 text-sm">योजना 1 (Scheme 1: आकस्मिक निधन सहायता)</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">योजना शीर्षक (Scheme Title)</label>
                            <input
                              type="text"
                              required
                              value={homeSettings.scheme1Title || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme1Title: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                              placeholder="जैसे: आकस्मिक निधन सहायता योजना"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">योजना का विवरण (Scheme Description)</label>
                            <textarea
                              required
                              rows={4}
                              value={homeSettings.scheme1Text || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme1Text: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                              placeholder="योजना के बारे में विस्तार से लिखें..."
                            />
                          </div>
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">बटन का नाम (Button Text)</label>
                            <input
                              type="text"
                              required
                              value={homeSettings.scheme1BtnText || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme1BtnText: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                              placeholder="जैसे: दिवंगत सहायता विवरण"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Scheme 2: Beti Vivah Sahyog */}
                      <div>
                        <h5 className="font-bold text-gray-700 mb-2 text-sm">योजना 2 (Scheme 2: बेटी विवाह सहायता)</h5>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">योजना शीर्षक (Scheme Title)</label>
                            <input
                              type="text"
                              required
                              value={homeSettings.scheme2Title || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme2Title: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                              placeholder="जैसे: बेटी विवाह सहायता योजना"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">योजना का विवरण (Scheme Description)</label>
                            <textarea
                              required
                              rows={4}
                              value={homeSettings.scheme2Text || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme2Text: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889] font-medium"
                              placeholder="योजना के बारे में विस्तार से लिखें..."
                            />
                          </div>
                          <div>
                            <label className="block text-gray-600 font-bold mb-1">बटन का नाम (Button Text)</label>
                            <input
                              type="text"
                              required
                              value={homeSettings.scheme2BtnText || ''}
                              onChange={(e) => setHomeSettings({ ...homeSettings, scheme2BtnText: e.target.value })}
                              className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#087889]"
                              placeholder="जैसे: बेटी विवाह सहायता विवरण"
                            />
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="text-right border-t border-gray-100 pt-4">
                    <button
                      type="submit"
                      disabled={isSavingSchemesSettings}
                      className="px-8 py-3 bg-[#087889] hover:bg-[#06616e] disabled:bg-gray-400 text-white font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSavingSchemesSettings ? (
                        <>
                          <RefreshIcon className="w-4 h-4 animate-spin" /> सहेजा जा रहा है...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="w-4 h-4" /> योजनाएं सेटिंग्स सहेजें (Save Schemes Settings)
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: BETI SAHAYOG APPLICATIONS */}
            {activeTab === 'beti' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">बेटी विवाह सहायता आवेदन (Beti Sahayog Applications)</h3>
                      <button
                        onClick={() => handleExportSahayog('beti')}
                        className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" /> Excel/CSV
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा बेटी विवाह सहायता हेतु भेजे गए आवेदनों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setBetiAppFilter(f); setPageFor('beti', 1); }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${betiAppFilter === f
                          ? 'bg-[#087889] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({betiList.filter(r => r.status === 'PENDING' || !r.status).length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({betiList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({betiList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({betiList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="beti" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="आवेदक, बेटी का नाम, ID खोजें..."
                      value={tableSearches.beti}
                      onChange={(e) => setSearchFor('beti', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredBetiApps = betiList.filter(item => {
                    const status = item.status || 'PENDING';
                    const matchesFilter = betiAppFilter === 'ALL' ? true : status === betiAppFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.beti.trim()) return true;
                    const q = tableSearches.beti.toLowerCase();
                    return (item.applicantName || '').toLowerCase().includes(q) ||
                      (item.daughterName || '').toLowerCase().includes(q) ||
                      (item.uniqueId || '').toLowerCase().includes(q) ||
                      (item.district || '').toLowerCase().includes(q) ||
                      (item.block || '').toLowerCase().includes(q) ||
                      (item.mobile || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredBetiApps.length;
                  const page = tablePages.beti || 1;
                  const limit = tableEntries.beti || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredBetiApps.slice(startIdx, startIdx + limit);

                  return (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead>
                            <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                              <th className="py-3 px-4">क्र० सं०</th>
                              <th className="py-3 px-4">यूनिक ID</th>
                              <th className="py-3 px-4">आवेदक का नाम</th>
                              <th className="py-3 px-4">बेटी का नाम</th>
                              <th className="py-3 px-4">विवाह तिथि</th>
                              <th className="py-3 px-4">जिला / ब्लॉक</th>
                              <th className="py-3 px-4 text-center">दस्तावेज</th>
                              <th className="py-3 px-4">आवेदन तिथि</th>
                              <th className="py-3 px-4 text-center">स्थिति</th>
                              <th className="py-3 px-4 text-right">कार्यवाही</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-medium">
                            {currentRecords.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-emerald-50/30 transition-colors">
                                <td className="py-3 px-4 font-bold text-gray-500 font-mono text-xs">{startIdx + idx + 1}</td>
                                <td className="py-3 px-4 font-bold text-emerald-700 font-mono">{item.uniqueId}</td>
                                <td className="py-3 px-4 font-bold text-gray-900">{item.applicantName}</td>
                                <td className="py-3 px-4 font-bold text-pink-700">{item.daughterName}</td>
                                <td className="py-3 px-4 text-emerald-600 font-bold">{item.marriageDate}</td>
                                <td className="py-3 px-4 text-gray-700">{item.district || 'N/A'}{item.block ? ` / ${item.block}` : ''}</td>
                                <td className="py-3 px-4 text-center">
                                  {item.documentImage ? (
                                    <button
                                      onClick={() => setSelectedReceipt(item.documentImage)}
                                      className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <EyeIcon className="w-3.5 h-3.5" /> कार्ड देखें
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-xs">N/A</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-xs text-gray-500">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                    {item.status === 'APPROVED' ? 'स्वीकृत' :
                                      item.status === 'REJECTED' ? 'अस्वीकृत' :
                                        'लंबित'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {item.status !== 'APPROVED' && (
                                      <button
                                        onClick={() => handleSahayogAction('beti', item.id, 'APPROVED')}
                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                        title="Approve"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                    {item.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleSahayogAction('beti', item.id, 'REJECTED')}
                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <CloseIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {totalEntries === 0 && (
                              <tr>
                                <td colSpan="10" className="py-8 text-center text-gray-500 font-bold">
                                  कोई बेटी विवाह सहायता आवेदन उपलब्ध नहीं है
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="beti" totalEntries={totalEntries} />
                    </>
                  );
                })()}
              </div>
            )}

            {/* TAB: NIDHAN SAHAYOG APPLICATIONS */}
            {activeTab === 'nidhan' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-extrabold text-gray-800">निधन सहायता आवेदन (Nidhan Sahayog Applications)</h3>
                      <button
                        onClick={() => handleExportSahayog('nidhan')}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[11px] font-black rounded-lg shadow-sm transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <DownloadIcon className="w-3.5 h-3.5" /> Excel/CSV
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">सदस्यों द्वारा आकस्मिक निधन सहायता हेतु भेजे गए आवेदनों का सत्यापन करें।</p>
                  </div>
                  {/* Filter Tabs */}
                  <div className="flex flex-wrap bg-gray-100 p-1 rounded-xl border border-gray-200">
                    {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((f) => (
                      <button
                        key={f}
                        onClick={() => { setNidhanAppFilter(f); setPageFor('nidhan', 1); }}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer ${nidhanAppFilter === f
                          ? 'bg-[#087889] text-white shadow-sm'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                          }`}
                      >
                        {f === 'PENDING' ? <><ClockIcon className="w-3.5 h-3.5" /> लंबित ({nidhanList.filter(r => r.status === 'PENDING' || !r.status).length})</> :
                          f === 'APPROVED' ? <><CheckCircleIcon className="w-3.5 h-3.5" /> स्वीकृत ({nidhanList.filter(r => r.status === 'APPROVED').length})</> :
                            f === 'REJECTED' ? <><CloseIcon className="w-3.5 h-3.5" /> अस्वीकृत ({nidhanList.filter(r => r.status === 'REJECTED').length})</> :
                              <><SearchIcon className="w-3.5 h-3.5" /> सभी ({nidhanList.length})</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Top Controls */}
                <div className="p-3 mb-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 bg-gray-50/50">
                  <ShowEntriesDropdown tab="nidhan" />
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="आवेदक, मृतक का नाम, ID खोजें..."
                      value={tableSearches.nidhan}
                      onChange={(e) => setSearchFor('nidhan', e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-xl text-xs bg-white focus:ring-2 focus:ring-[#087889] outline-none"
                    />
                    <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                  </div>
                </div>

                {(() => {
                  const filteredNidhanApps = nidhanList.filter(item => {
                    const status = item.status || 'PENDING';
                    const matchesFilter = nidhanAppFilter === 'ALL' ? true : status === nidhanAppFilter;
                    if (!matchesFilter) return false;
                    if (!tableSearches.nidhan.trim()) return true;
                    const q = tableSearches.nidhan.toLowerCase();
                    return (item.applicantName || '').toLowerCase().includes(q) ||
                      (item.deceasedName || '').toLowerCase().includes(q) ||
                      (item.uniqueId || '').toLowerCase().includes(q) ||
                      (item.district || '').toLowerCase().includes(q) ||
                      (item.block || '').toLowerCase().includes(q) ||
                      (item.mobile || '').toLowerCase().includes(q);
                  });

                  const totalEntries = filteredNidhanApps.length;
                  const page = tablePages.nidhan || 1;
                  const limit = tableEntries.nidhan || 10;
                  const startIdx = (page - 1) * limit;
                  const currentRecords = filteredNidhanApps.slice(startIdx, startIdx + limit);

                  return (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                          <thead>
                            <tr className="bg-gray-50 text-gray-700 text-xs font-extrabold uppercase border-b border-gray-200">
                              <th className="py-3 px-4">क्र० सं०</th>
                              <th className="py-3 px-4">यूनिक ID</th>
                              <th className="py-3 px-4">आवेदक का नाम</th>
                              <th className="py-3 px-4">मृतक का नाम</th>
                              <th className="py-3 px-4">निधन तिथि</th>
                              <th className="py-3 px-4">जिला / ब्लॉक</th>
                              <th className="py-3 px-4 text-center">दस्तावेज</th>
                              <th className="py-3 px-4">आवेदन तिथि</th>
                              <th className="py-3 px-4 text-center">स्थिति</th>
                              <th className="py-3 px-4 text-right">कार्यवाही</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm font-medium">
                            {currentRecords.map((item, idx) => (
                              <tr key={item.id || idx} className="hover:bg-red-50/30 transition-colors">
                                <td className="py-3 px-4 font-bold text-gray-500 font-mono text-xs">{startIdx + idx + 1}</td>
                                <td className="py-3 px-4 font-bold text-red-700 font-mono">{item.uniqueId}</td>
                                <td className="py-3 px-4 font-bold text-gray-900">{item.applicantName}</td>
                                <td className="py-3 px-4 font-bold text-gray-800">{item.deceasedName}</td>
                                <td className="py-3 px-4 text-red-600 font-bold">{item.deathDate}</td>
                                <td className="py-3 px-4 text-gray-700">{item.district || 'N/A'}{item.block ? ` / ${item.block}` : ''}</td>
                                <td className="py-3 px-4 text-center">
                                  {item.documentImage ? (
                                    <button
                                      onClick={() => setSelectedReceipt(item.documentImage)}
                                      className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <EyeIcon className="w-3.5 h-3.5" /> कार्ड देखें
                                    </button>
                                  ) : (
                                    <span className="text-gray-400 text-xs">N/A</span>
                                  )}
                                </td>
                                <td className="py-3 px-4 text-xs text-gray-500">{item.submittedAt ? new Date(item.submittedAt).toLocaleDateString() : 'N/A'}</td>
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-1 text-[11px] font-black rounded-full shadow-sm ${item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                    item.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                      'bg-amber-100 text-amber-700'
                                    }`}>
                                    {item.status === 'APPROVED' ? 'स्वीकृत' :
                                      item.status === 'REJECTED' ? 'अस्वीकृत' :
                                        'लंबित'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {item.status !== 'APPROVED' && (
                                      <button
                                        onClick={() => handleSahayogAction('nidhan', item.id, 'APPROVED')}
                                        className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors cursor-pointer"
                                        title="Approve"
                                      >
                                        <CheckIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                    {item.status !== 'REJECTED' && (
                                      <button
                                        onClick={() => handleSahayogAction('nidhan', item.id, 'REJECTED')}
                                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                                        title="Reject"
                                      >
                                        <CloseIcon className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {totalEntries === 0 && (
                              <tr>
                                <td colSpan="10" className="py-8 text-center text-gray-500 font-bold">
                                  कोई निधन सहायता आवेदन उपलब्ध नहीं है
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <TablePagination tab="nidhan" totalEntries={totalEntries} />
                    </>
                  );
                })()}
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
                <FileTextIcon className="w-6 h-6 text-[#087889]" /> दस्तावेज / रसीद (Document Preview)
              </h4>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
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

      {/* ================= MEMBER DETAIL & EDIT MODAL ================= */}
      {selectedMemberForDetail && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative border border-gray-100 my-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <div>
                <h4 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                  {isEditingMember ? <EditIcon className="w-6 h-6 text-[#f08519]" /> : <UserIcon className="w-6 h-6 text-[#087889]" />}
                  {isEditingMember ? 'सदस्य विवरण संपादन (Edit Member Details)' : 'सदस्य का पूरा विवरण (Member Profile Details)'}
                </h4>
                <p className="text-xs text-gray-500 mt-1">
                  {selectedMemberForDetail.isPendingRecord ? (
                    <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">लंबित रजिस्ट्रेशन (Pending Registration)</span>
                  ) : (
                    <>यूनिक ID: <span className="font-mono font-bold text-[#087889]">{selectedMemberForDetail.uniqueId || 'N/A'}</span> | ग्रुप: {selectedMemberForDetail.group || 'A'}</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {!isEditingMember && (
                  <button
                    onClick={() => {
                      setIsEditingMember(true);
                      setEditFormData({ ...selectedMemberForDetail });
                    }}
                    className="px-3.5 py-1.5 bg-[#f08519] hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
                  >
                    <EditIcon className="w-3.5 h-3.5" /> एडिट करें (Edit)
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedMemberForDetail(null);
                    setIsEditingMember(false);
                  }}
                  className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  <CloseIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            {isEditingMember ? (
              <form onSubmit={handleSaveMemberEdit} className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 text-left">
                {/* Personal Information Edit */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <InfoIcon className="w-4 h-4 text-[#087889]" /> व्यक्तिगत जानकारी (Personal Information)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">पूरा नाम (Full Name) *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.name || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">पिता/पति का नाम (Father/Husband Name)</label>
                      <input
                        type="text"
                        value={editFormData.fatherName || editFormData.fatherOrHusbandName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, fatherName: e.target.value, fatherOrHusbandName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">जन्म तिथि (Date of Birth)</label>
                      <input
                        type="date"
                        value={editFormData.dob || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">लिंग (Gender)</label>
                      <select
                        value={editFormData.gender || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      >
                        <option value="">Choose...</option>
                        <option value="male">Male (पुरुष)</option>
                        <option value="female">Female (महिला)</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">मोबाइल नंबर (Mobile No.) *</label>
                      <input
                        type="tel"
                        required
                        value={editFormData.mobile || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, mobile: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">आधार नंबर (Aadhaar Number) *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.aadhaar || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, aadhaar: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">पैन नंबर (PAN Number)</label>
                      <input
                        type="text"
                        value={editFormData.pan || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, pan: e.target.value.toUpperCase() })}
                        maxLength="10"
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono uppercase"
                        placeholder="10 अंकों का पैन"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">ईमेल (Email Address)</label>
                      <input
                        type="email"
                        value={editFormData.email || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">व्यवसाय/पेशा (Occupation)</label>
                      <input
                        type="text"
                        value={editFormData.occupation || editFormData.business || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, occupation: e.target.value, business: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">कार्यरत कार्यालय (Working Office)</label>
                      <input
                        type="text"
                        value={editFormData.workingOffice || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, workingOffice: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">पासवर्ड (Login Password)</label>
                      <input
                        type="text"
                        value={editFormData.password || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                        placeholder="लॉगिन पासवर्ड"
                      />
                    </div>
                    {!editFormData.isPendingRecord && (
                      <>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">यूनिक आईडी (Unique ID)</label>
                          <input
                            type="text"
                            value={editFormData.uniqueId || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, uniqueId: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-bold mb-1">ग्रुप (Group)</label>
                          <input
                            type="text"
                            value={editFormData.group || ''}
                            onChange={(e) => setEditFormData({ ...editFormData, group: e.target.value.toUpperCase() })}
                            className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium uppercase font-mono"
                            placeholder="जैसे: A, B, C"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Address Information Edit */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4 text-[#087889]" /> पते का विवरण (Address Details)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">राज्य (State)</label>
                      <input
                        type="text"
                        value={editFormData.state || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, state: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">जिला (District) *</label>
                      <input
                        type="text"
                        required
                        value={editFormData.district || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, district: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">ब्लॉक (Block)</label>
                      <input
                        type="text"
                        value={editFormData.block || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, block: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-gray-700 font-bold mb-1">पूरा स्थायी पता (Full Permanent Address)</label>
                      <textarea
                        rows={2}
                        value={editFormData.address || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Nominee Details Edit */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <HandshakeIcon className="w-4 h-4 text-[#087889]" /> नॉमिनी विवरण (Nominee Details)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">नॉमिनी का नाम (Nominee Name)</label>
                      <input
                        type="text"
                        value={editFormData.nomineeName || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, nomineeName: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">संबंध (Relation)</label>
                      <input
                        type="text"
                        value={editFormData.nomineeRelation || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, nomineeRelation: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">नॉमिनी मोबाइल नंबर (Nominee Mobile)</label>
                      <input
                        type="tel"
                        value={editFormData.nomineeMobile || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, nomineeMobile: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">नॉमिनी आधार नंबर (Nominee Aadhaar)</label>
                      <input
                        type="text"
                        value={editFormData.nomineeAadhaar || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, nomineeAadhaar: e.target.value })}
                        maxLength="12"
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Registration & Payment Info Edit */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <CreditCardIcon className="w-4 h-4 text-[#087889]" /> रजिस्ट्रेशन एवं भुगतान (Registration & Payment Info)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">ट्रांजेक्शन ID (Txn ID)</label>
                      <input
                        type="text"
                        value={editFormData.transactionId || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, transactionId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">शुल्क राशि (₹ Amount)</label>
                      <input
                        type="number"
                        value={editFormData.amount || 200}
                        onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-bold mb-1">रेफरल कोड (Referral Code)</label>
                      <input
                        type="text"
                        value={editFormData.referralCode || ''}
                        onChange={(e) => setEditFormData({ ...editFormData, referralCode: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] font-medium font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons in Edit Mode */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingMember(false)}
                    className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
                  >
                    रद्द करें (Cancel)
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingMember}
                    className="px-6 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl text-sm transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSavingMember ? (
                      <>
                        <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                        सहेजा जा रहा है...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="w-4 h-4" />
                        बदलाव सहेजें (Save Changes)
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* View Mode - Grid Layout */
              <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 text-left">
                {/* Personal Information */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <InfoIcon className="w-4 h-4 text-[#087889]" /> व्यक्तिगत जानकारी (Personal Information)
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
                      <p className="font-bold text-[#087889] text-sm mt-0.5 flex items-center gap-1"><PhoneIcon className="w-3.5 h-3.5 text-[#087889]" /> {selectedMemberForDetail.mobile}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">आधार नंबर (Aadhaar Number)</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.aadhaar || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">पैन नंबर (PAN Number)</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.pan || selectedMemberForDetail.panNumber || 'N/A'}</p>
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
                    <div>
                      <p className="text-gray-500 font-medium">पासवर्ड (Password)</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.password || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Address Details */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <MapPinIcon className="w-4 h-4 text-[#087889]" /> पते का विवरण (Address Details)
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
                    <HandshakeIcon className="w-4 h-4 text-[#087889]" /> नॉमिनी विवरण (Nominee Details)
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
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
                    <div>
                      <p className="text-gray-500 font-medium">नॉमिनी आधार नंबर (Nominee Aadhaar)</p>
                      <p className="font-bold text-gray-900 text-sm mt-0.5 font-mono">{selectedMemberForDetail.nomineeAadhaar || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Registration & Payment Info */}
                <div>
                  <h5 className="text-sm font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                    <CreditCardIcon className="w-4 h-4 text-[#087889]" /> रजिस्ट्रेशन एवं भुगतान (Registration & Payment Info)
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
                          <LinkIcon className="w-3.5 h-3.5" /> रसीद नई टैब में खोलें (Open Receipt in New Tab)
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
            )}

            {/* Footer buttons */}
            {!isEditingMember && (
              <div className="mt-6 flex justify-between items-center border-t border-gray-100 pt-4">
                <button
                  onClick={() => {
                    setIsEditingMember(true);
                    setEditFormData({ ...selectedMemberForDetail });
                  }}
                  className="px-5 py-2.5 bg-[#f08519] hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-all shadow flex items-center gap-1.5"
                >
                  <EditIcon className="w-3.5 h-3.5" /> विवरण संपादित करें (Edit Profile)
                </button>
                <button
                  onClick={() => setSelectedMemberForDetail(null)}
                  className="px-6 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  बंद करें (Close)
                </button>
              </div>
            )}
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
                <ReceiptIcon className="w-6 h-6 text-[#087889]" /> सहयोग रसीद विवरण (Donation Receipt Details)
              </h4>
              <button
                onClick={() => setSelectedReceiptForDetail(null)}
                className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2">
              {/* Donor Details */}
              <div>
                <h5 className="text-xs font-bold text-[#087889] border-b border-teal-100 pb-1.5 mb-3 flex items-center gap-1.5">
                  <UserIcon className="w-4 h-4 text-[#087889]" /> सहयोगकर्ता विवरण (Donor Details)
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
                    <p className="font-bold text-gray-900 text-sm mt-0.5 flex items-center gap-1"><PhoneIcon className="w-3.5 h-3.5 text-gray-500" /> {selectedReceiptForDetail.donorMobile}</p>
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
                  <HandshakeIcon className="w-4 h-4 text-[#087889]" /> लाभार्थी विवरण (Beneficiary Details)
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
                  <CreditCardIcon className="w-4 h-4 text-[#087889]" /> ट्रांजेक्शन विवरण (Transaction Details)
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
                    <LinkIcon className="w-3.5 h-3.5" /> रसीद नए टैब में फुल साइज में खोलें (View Full Size)
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

      {/* ================= SUCCESS CONFIRMATION POPUP MODAL ================= */}
      {successModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 text-center transform transition-all animate-scaleUp">
            {/* Pulsing Green Icon */}
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner ring-8 ring-emerald-50">
              <CheckCircleIcon className="w-12 h-12" />
            </div>

            <h3 className="text-2xl font-black text-gray-800 mb-2">
              {successModal.title}
            </h3>

            <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
              {successModal.message}
            </p>

            <button
              onClick={() => setSuccessModal({ isOpen: false, title: '', message: '' })}
              className="w-full py-3.5 px-6 bg-gradient-to-r from-[#087889] to-teal-600 hover:from-[#06616e] hover:to-teal-700 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all transform active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckIcon className="w-5 h-5" /> ठीक है (OK)
            </button>
          </div>
        </div>
      )}

      {/* ================= ACCOUNT HOLDER ADD / EDIT MODAL ================= */}
      {accountHolderModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-[#087889]" />
                {accountHolderModal.isNew
                  ? `नया खाताधारक जोड़ें (${accountHolderModal.type === 'beti' ? 'बेटी विवाह' : 'निधन सहयोग'})`
                  : `खाताधारक विवरण संपादित करें (${accountHolderModal.type === 'beti' ? 'बेटी विवाह' : 'निधन सहयोग'})`}
              </h4>
              <button
                onClick={() => setAccountHolderModal({ isOpen: false, type: 'beti', isNew: false, data: {} })}
                className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccountHolder} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {accountHolderModal.type === 'beti' ? 'आवेदक / पिता का नाम *' : 'आवेदक / नामांकित व्यक्ति *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolderModal.data.applicantName || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, applicantName: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold"
                    placeholder="जैसे: सुरेश चंद्र"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {accountHolderModal.type === 'beti' ? 'बेटी का नाम *' : 'दिवंगत सदस्य का नाम *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={accountHolderModal.type === 'beti' ? (accountHolderModal.data.daughterName || '') : (accountHolderModal.data.deceasedName || '')}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAccountHolderModal({
                        ...accountHolderModal,
                        data: accountHolderModal.type === 'beti'
                          ? { ...accountHolderModal.data, daughterName: val }
                          : { ...accountHolderModal.data, deceasedName: val }
                      });
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold"
                    placeholder={accountHolderModal.type === 'beti' ? 'जैसे: पूजा कुमारी' : 'जैसे: राम प्रसाद'}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">जिला (District) *</label>
                  <input
                    type="text"
                    required
                    value={accountHolderModal.data.district || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, district: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-medium"
                    placeholder="जैसे: संत कबीर नगर"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">ब्लॉक (Block) *</label>
                  <input
                    type="text"
                    required
                    value={accountHolderModal.data.block || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, block: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-medium"
                    placeholder="जैसे: खलीलाबाद"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {accountHolderModal.type === 'beti' ? 'विवाह तिथि (Marriage Date) *' : 'निधन तिथि (Date of Demise) *'}
                  </label>
                  <input
                    type="date"
                    required
                    value={accountHolderModal.data.date || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, date: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">प्रति सदस्य सहयोग राशि (₹) *</label>
                  <input
                    type="number"
                    required
                    value={accountHolderModal.data.recommendedAmount || 50}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, recommendedAmount: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold text-emerald-600"
                    placeholder="50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">मोबाइल नंबर</label>
                  <input
                    type="text"
                    value={accountHolderModal.data.mobile || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, mobile: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-medium"
                    placeholder="10 अंकों का मोबाइल"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">यूनिक आईडी (Optional)</label>
                  <input
                    type="text"
                    value={accountHolderModal.data.uniqueId || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, uniqueId: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-mono"
                    placeholder="SHCT-XXXXX"
                  />
                </div>
              </div>

              {/* Bank Account Information (Optional) */}
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs font-bold text-[#087889] mb-2">बैंक खाता विवरण (Bank Details - Optional)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="खाताधारक का नाम (A/C Name)"
                    value={accountHolderModal.data.accName || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, accName: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                  />
                  <input
                    type="text"
                    placeholder="खाता संख्या (A/C No.)"
                    value={accountHolderModal.data.accNo || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, accNo: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="IFSC कोड"
                    value={accountHolderModal.data.ifsc || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, ifsc: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-mono"
                  />
                  <input
                    type="text"
                    placeholder="बैंक का नाम"
                    value={accountHolderModal.data.bank || ''}
                    onChange={(e) => setAccountHolderModal({
                      ...accountHolderModal,
                      data: { ...accountHolderModal.data, bank: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAccountHolderModal({ isOpen: false, type: 'beti', isNew: false, data: {} })}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingCrud}
                  className="px-6 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingCrud ? 'सहेजा जा रहा है...' : <><SaveIcon className="w-4 h-4" /> सहेजें (Save)</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ALERT ADD / EDIT MODAL ================= */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <AlertCircleIcon className="w-5 h-5 text-[#087889]" />
                {alertModal.isNew
                  ? `नया अलर्ट बनाएं (${alertModal.type === 'beti' ? 'बेटी विवाह' : 'निधन सहयोग'})`
                  : `अलर्ट संपादित करें (${alertModal.type === 'beti' ? 'बेटी विवाह' : 'निधन सहयोग'})`}
              </h4>
              <button
                onClick={() => setAlertModal({ isOpen: false, type: 'beti', isNew: false, data: {} })}
                className="text-gray-400 hover:text-gray-900 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAlert} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">अलर्ट नंबर (Alert No.) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={alertModal.data.alertNumber || 1}
                    onChange={(e) => setAlertModal({
                      ...alertModal,
                      data: { ...alertModal.data, alertNumber: e.target.value, title: `Alert ${e.target.value}` }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">अलर्ट शीर्षक (Title) *</label>
                  <input
                    type="text"
                    required
                    value={alertModal.data.title || ''}
                    onChange={(e) => setAlertModal({
                      ...alertModal,
                      data: { ...alertModal.data, title: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold"
                    placeholder="Alert 1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {alertModal.type === 'beti' ? 'लाभार्थी / सदस्य का नाम *' : 'दिवंगत सदस्य / परिवार का नाम *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={alertModal.data.beneficiaryName || alertModal.data.member || ''}
                    onChange={(e) => setAlertModal({
                      ...alertModal,
                      data: { ...alertModal.data, beneficiaryName: e.target.value, member: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#087889] outline-none font-bold"
                    placeholder="जैसे: सुरेश चंद्र"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {alertModal.type === 'beti' ? 'विवाह तिथि' : 'निधन तिथि'}
                  </label>
                  <input
                    type="date"
                    value={alertModal.data.date || alertModal.data.marriageDate || ''}
                    onChange={(e) => setAlertModal({
                      ...alertModal,
                      data: { ...alertModal.data, date: e.target.value, marriageDate: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">सहयोग राशि (Min Support) *</label>
                  <input
                    type="text"
                    required
                    value={alertModal.data.minSupport || '50 रुपए'}
                    onChange={(e) => setAlertModal({
                      ...alertModal,
                      data: { ...alertModal.data, minSupport: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:bg-white outline-none font-bold text-emerald-600"
                    placeholder="50 रुपए"
                  />
                </div>

                {/* QR Code Upload / Link */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">QR कोड अपलोड करें (Payment QR Code)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        try {
                          const base64 = await compressImage(file, 600, 600, 0.8);
                          setAlertModal({
                            ...alertModal,
                            data: { ...alertModal.data, qrCodeBase64: base64 }
                          });
                        } catch (err) {
                          alert('इमेज प्रोसेस करने में समस्या आई');
                        }
                      }
                    }}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#087889] file:text-white"
                  />
                  {alertModal.data.qrCodeBase64 && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={alertModal.data.qrCodeBase64} alt="QR Preview" className="w-16 h-16 object-contain rounded-lg border border-gray-200 p-1 bg-white" />
                      <span className="text-[11px] text-emerald-600 font-bold">QR कोड लोड हो गया है</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setAlertModal({ isOpen: false, type: 'beti', isNew: false, data: {} })}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isSavingCrud}
                  className="px-6 py-2.5 bg-[#087889] hover:bg-[#06616e] text-white font-extrabold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSavingCrud ? 'सहेजा जा रहा है...' : <><SaveIcon className="w-4 h-4" /> सहेजें (Save Alert)</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-gray-800 mb-1">{deleteConfirmModal.title}</h4>
            <p className="text-xs text-gray-600 font-medium mb-6">{deleteConfirmModal.message}</p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmModal({ isOpen: false, title: '', message: '', onConfirm: null })}
                className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                नहीं, रद्द करें
              </button>
              <button
                onClick={deleteConfirmModal.onConfirm}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-md cursor-pointer"
              >
                हाँ, हटाएं (Delete)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3 mb-4">
              <h4 className="text-base font-black text-gray-800 flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-[#087889]" /> पासवर्ड बदलें (Change Password)
              </h4>
              <button
                onClick={() => setIsChangePasswordModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <CloseIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-xs text-teal-800 flex items-center gap-2">
              <ShieldIcon className="w-4 h-4 text-[#087889] shrink-0" />
              <span>
                लॉगिन एडमिन: <strong className="font-bold">{auth.currentUser?.email || localStorage.getItem('adminEmail')}</strong>
              </span>
            </div>

            {changePasswordStatus.message && (
              <div className={`mb-4 p-3 text-xs font-bold rounded-xl border flex items-center gap-2 ${
                changePasswordStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                {changePasswordStatus.type === 'success' ? (
                  <CheckCircleIcon className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertTriangleIcon className="w-4 h-4 shrink-0" />
                )}
                <span>{changePasswordStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  वर्तमान पासवर्ड (Current Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={changePasswordForm.currentPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })}
                    placeholder="वर्तमान पासवर्ड दर्ज करें"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#087889] focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#087889] cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  नया पासवर्ड (New Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={changePasswordForm.newPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })}
                    placeholder="कम से कम 6 अक्षरों का नया पासवर्ड"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#087889] focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#087889] cursor-pointer"
                  >
                    {showNewPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  नया पासवर्ड पुनः दर्ज करें (Confirm New Password) <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={changePasswordForm.confirmPassword}
                    onChange={(e) => setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })}
                    placeholder="नया पासवर्ड दोबारा दर्ज करें"
                    className="w-full pl-3.5 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#087889] focus:bg-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#087889] cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                >
                  रद्द करें (Cancel)
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="px-5 py-2.5 text-xs font-black text-white bg-[#087889] hover:bg-[#06616e] rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-md"
                >
                  {isChangingPassword ? <RefreshIcon className="w-3.5 h-3.5 animate-spin" /> : <SaveIcon className="w-3.5 h-3.5" />}
                  पासवर्ड अपडेट करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
