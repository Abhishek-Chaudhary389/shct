// Central Storage Service for SHCT NGO Admin System using Firebase
import { db } from '../firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc, 
  deleteDoc, 
  setDoc,
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';

// Collection Names
const PENDING_COL = 'pending_registrations';
const APPROVED_COL = 'approved_members';
const DONATIONS_COL = 'annual_donations';
const BETI_COL = 'beti_sahayog';
const NIDHAN_COL = 'nidhan_sahayog';
const GREEN_COL = 'green_paryavaran';
const HOME_ALERTS_COL = 'home_alerts';

// --- DATA SERVICE APIS ---

export const getPendingRegistrations = async () => {
  try {
    const snapshot = await getDocs(collection(db, PENDING_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter only active PENDING registrations
    return data
      .filter(r => r.status === 'PENDING' || !r.status)
      .sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
    return [];
  }
};

export const getAllRegistrationsHistory = async () => {
  try {
    const snapshot = await getDocs(collection(db, PENDING_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching all registrations history:", error);
    return [];
  }
};

export const addPendingRegistration = async (newRegistration) => {
  try {
    const registrationData = {
      ...newRegistration,
      submittedAt: new Date().toISOString(),
      amount: 200,
      status: 'PENDING',
      receiptUrl: newRegistration.receiptUrl || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    };
    const docRef = await addDoc(collection(db, PENDING_COL), registrationData);
    return { id: docRef.id, ...registrationData };
  } catch (error) {
    console.error("Error adding pending registration:", error);
    throw error;
  }
};

export const getApprovedMembers = async () => {
  try {
    const snapshot = await getDocs(collection(db, APPROVED_COL));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.sno - a.sno);
  } catch (error) {
    console.error("Error fetching approved members:", error);
    return [];
  }
};

export const getAnnualDonations = async () => {
  try {
    const snapshot = await getDocs(collection(db, DONATIONS_COL));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.sno - a.sno);
  } catch (error) {
    console.error("Error fetching annual donations:", error);
    return [];
  }
};

export const approveRegistration = async (id, group = 'A') => {
  try {
    const pendingRef = doc(db, PENDING_COL, id);
    const pendingSnap = await getDoc(pendingRef);
    if (!pendingSnap.exists()) {
      throw new Error("Pending registration not found");
    }
    const target = pendingSnap.data();

    // 1. Update status in Pending collection to APPROVED
    await updateDoc(pendingRef, { status: 'APPROVED' });

    // Generate Sequential Unique ID (shct0001, shct0002, ...)
    const approvedSnapshot = await getDocs(collection(db, APPROVED_COL));
    let maxIdNum = 0;
    approvedSnapshot.forEach((docSnap) => {
      const uId = docSnap.data().uniqueId;
      if (uId) {
        // Support old SHCT-0001, SHCT0001 and new shct0001 formats during lookup
        const cleanId = uId.toUpperCase().replace('-', '');
        if (cleanId.startsWith('SHCT')) {
          const num = parseInt(cleanId.replace('SHCT', ''), 10);
          if (!isNaN(num) && num > maxIdNum) {
            maxIdNum = num;
          }
        }
      }
    });
    const nextIdNum = maxIdNum + 1;
    const uniqueMemberId = `shct${String(nextIdNum).padStart(4, '0')}`;
    
    const nextSno = approvedSnapshot.size + 1001;
    
    const newApprovedMember = {
      sno: nextSno,
      originalPendingId: id,
      name: target.name,
      uniqueId: uniqueMemberId,
      group: group,
      aadhaar: target.aadhaar || '',
      fatherName: target.fatherName || target.fatherOrHusbandName || '',
      district: target.district || 'Khalilabad',
      block: target.block || 'Sant Kabir Nagar',
      mobile: target.mobile,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      // Store full data so it can be retrieved for UserDashboard
      ...target 
    };

    const memberRef = await addDoc(collection(db, APPROVED_COL), newApprovedMember);

    // 3. Add to Annual Donation List
    const donationSnapshot = await getDocs(collection(db, DONATIONS_COL));
    const nextDonationSno = donationSnapshot.size + 20001;

    const newDonation = {
      sno: nextDonationSno,
      name: target.name,
      uniqueId: uniqueMemberId,
      amount: "200",
      transactionId: target.transactionId || `TXN${Date.now()}`,
      trustName: "SILENT HELP CHARITABLE TRUST",
      district: target.district || 'Khalilabad',
      block: target.block || 'Sant Kabir Nagar',
      sahyogDate: new Date().toISOString().split('T')[0]
    };

    await addDoc(collection(db, DONATIONS_COL), newDonation);

    return { member: { id: memberRef.id, ...newApprovedMember }, donation: newDonation };
  } catch (error) {
    console.error("Error approving registration:", error);
    throw error;
  }
};

export const rejectRegistration = async (id) => {
  try {
    const pendingRef = doc(db, PENDING_COL, id);
    await updateDoc(pendingRef, { status: 'REJECTED' });
  } catch (error) {
    console.error("Error rejecting registration:", error);
    throw error;
  }
};

// --- SAHAYOG FORM APIS ---

export const getBetiSahayogList = async () => {
  try {
    const snapshot = await getDocs(collection(db, BETI_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching Beti Sahayog list:", error);
    return [];
  }
};
export const getBetiSahyogList = getBetiSahayogList;
export const getBetiSahyoglist = getBetiSahayogList;

export const addBetiSahayog = async (data) => {
  try {
    const newData = { ...data, submittedAt: new Date().toISOString(), status: 'PENDING' };
    const docRef = await addDoc(collection(db, BETI_COL), newData);
    return { id: docRef.id, ...newData };
  } catch (error) {
    console.error("Error adding Beti Sahayog:", error);
    throw error;
  }
};

export const getNidhanSahayogList = async () => {
  try {
    const snapshot = await getDocs(collection(db, NIDHAN_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching Nidhan Sahayog list:", error);
    return [];
  }
};
export const getNidhanSahyogList = getNidhanSahayogList;
export const getNidhanSahyoglist = getNidhanSahayogList;

export const addNidhanSahayog = async (data) => {
  try {
    const newData = { ...data, submittedAt: new Date().toISOString(), status: 'PENDING' };
    const docRef = await addDoc(collection(db, NIDHAN_COL), newData);
    return { id: docRef.id, ...newData };
  } catch (error) {
    console.error("Error adding Nidhan Sahayog:", error);
    throw error;
  }
};

export const getGreenParyavaranList = async () => {
  try {
    const snapshot = await getDocs(collection(db, GREEN_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching Green Paryavaran list:", error);
    return [];
  }
};
export const getGreenParyavaranlist = getGreenParyavaranList;

export const addGreenParyavaran = async (data) => {
  try {
    const newData = { ...data, submittedAt: new Date().toISOString(), status: 'PENDING' };
    const docRef = await addDoc(collection(db, GREEN_COL), newData);
    return { id: docRef.id, ...newData };
  } catch (error) {
    console.error("Error adding Green Paryavaran:", error);
    throw error;
  }
};

export const updateSahayogStatus = async (type, id, newStatus) => {
  try {
    let collectionName = '';
    if (type === 'beti') collectionName = BETI_COL;
    else if (type === 'nidhan') collectionName = NIDHAN_COL;
    else if (type === 'green') collectionName = GREEN_COL;
    else return null;

    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating sahayog status:", error);
    throw error;
  }
};

// ================= HOME ALERTS API =================

export const getHomeAlerts = async () => {
  try {
    const snapshot = await getDocs(collection(db, HOME_ALERTS_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  } catch (error) {
    console.error("Error fetching home alerts:", error);
    return [];
  }
};

export const addHomeAlert = async (alertData) => {
  try {
    const newAlert = {
      ...alertData,
      isActive: false, // Default to hidden
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, HOME_ALERTS_COL), newAlert);
    return { id: docRef.id, ...newAlert };
  } catch (error) {
    console.error("Error adding home alert:", error);
    throw error;
  }
};

export const updateHomeAlertStatus = async (id, isActive) => {
  try {
    const alertRef = doc(db, HOME_ALERTS_COL, id);
    await updateDoc(alertRef, { isActive });
    return true;
  } catch (error) {
    console.error("Error updating home alert status:", error);
    throw error;
  }
};

export const deleteHomeAlert = async (id) => {
  try {
    await deleteDoc(doc(db, HOME_ALERTS_COL, id));
    return true;
  } catch (error) {
    console.error("Error deleting home alert:", error);
    throw error;
  }
};

// ================= SYSTEM SETTINGS API =================
const SETTINGS_COL = 'system_settings';
const HOME_PAGE_DOC_ID = 'home_page';

export const getHomePageSettings = async () => {
  try {
    const docRef = doc(db, SETTINGS_COL, HOME_PAGE_DOC_ID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    // Return default settings if none exist yet
    return {
      headerTitle: "बेटी विवाह सहायता योजना",
      alertTitle: "सहयोग अलर्ट - 1",
      alertPoints: "सहयोग की अंतिम तिथि: 10 जुलाई से 26 जुलाई 2026 तक\nनियम: 1 ट्रांजेक्शन = 1 रसीद अपलोड",
      instructionTitle: "महत्वपूर्ण निर्देश",
      instructionText: "वेबसाइट पर अपना आधार कार्ड नंबर और पासवर्ड डालकर LOGIN करें और अपना GROUP देख लें। आप जिस GROUP में हैं, सिर्फ उसी GROUP में दिखने वाले परिवार के खाते में न्यूनतम राशि (50 रुपए) ऑनलाइन (UPI/Net Banking) भेजें।",
      instructionNote: "नोट: किसी अन्य GROUP में भेजा गया सहयोग मान्य नहीं होगा। सहयोग भेजने के बाद ट्रांजेक्शन स्क्रीनशॉट और ID अपलोड करना अनिवार्य है।"
    };
  } catch (error) {
    console.error("Error fetching home settings:", error);
    return {
      headerTitle: "बेटी विवाह सहायता योजना",
      alertTitle: "सहयोग अलर्ट - 1",
      alertPoints: "सहयोग की अंतिम तिथि: 10 जुलाई से 26 जुलाई 2026 तक\nनियम: 1 ट्रांजेक्शन = 1 रसीद अपलोड",
      instructionTitle: "महत्वपूर्ण निर्देश",
      instructionText: "वेबसाइट पर अपना आधार कार्ड नंबर और पासवर्ड डालकर LOGIN करें और अपना GROUP देख लें। आप जिस GROUP में हैं, सिर्फ उसी GROUP में दिखने वाले परिवार के खाते में न्यूनतम राशि (50 रुपए) ऑनलाइन (UPI/Net Banking) भेजें।",
      instructionNote: "नोट: किसी अन्य GROUP में भेजा गया सहयोग मान्य नहीं होगा। सहयोग भेजने के बाद ट्रांजेक्शन स्क्रीनशॉट और ID अपलोड करना अनिवार्य है।"
    };
  }
};

export const saveHomePageSettings = async (settings) => {
  try {
    const docRef = doc(db, SETTINGS_COL, HOME_PAGE_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
    return true;
  } catch (error) {
    console.error("Error saving home settings:", error);
    throw error;
  }
};

// ================= BETI SAHAYOG RECEIPTS API =================
const BETI_RECEIPTS_COL = 'beti_sahayog_receipts';

export const addBetiSahyogReceipt = async (receiptData) => {
  try {
    const data = {
      ...receiptData,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };
    const docRef = await addDoc(collection(db, BETI_RECEIPTS_COL), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding Beti Sahyog receipt:", error);
    throw error;
  }
};

export const getBetiSahyogReceipts = async () => {
  try {
    const snapshot = await getDocs(collection(db, BETI_RECEIPTS_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching Beti Sahyog receipts:", error);
    return [];
  }
};

export const updateBetiReceiptStatus = async (id, newStatus) => {
  try {
    const docRef = doc(db, BETI_RECEIPTS_COL, id);
    await updateDoc(docRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating Beti Sahyog receipt status:", error);
    throw error;
  }
};


// ================= NIDHAN SAHAYOG RECEIPTS API =================
const NIDHAN_RECEIPTS_COL = 'nidhan_sahayog_receipts';

export const addNidhanSahyogReceipt = async (receiptData) => {
  try {
    const data = {
      ...receiptData,
      submittedAt: new Date().toISOString(),
      status: 'PENDING'
    };
    const docRef = await addDoc(collection(db, NIDHAN_RECEIPTS_COL), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding Nidhan Sahyog receipt:", error);
    throw error;
  }
};

export const getNidhanSahyogReceipts = async () => {
  try {
    const snapshot = await getDocs(collection(db, NIDHAN_RECEIPTS_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching Nidhan Sahyog receipts:", error);
    return [];
  }
};

export const updateNidhanReceiptStatus = async (id, newStatus) => {
  try {
    const docRef = doc(db, NIDHAN_RECEIPTS_COL, id);
    await updateDoc(docRef, { status: newStatus });
    return true;
  } catch (error) {
    console.error("Error updating Nidhan Sahyog receipt status:", error);
    throw error;
  }
};

// ================= ANNUAL RENEWALS API =================
const RENEWALS_COL = 'annual_renewals';

export const addAnnualRenewalReceipt = async (receiptData) => {
  try {
    const data = {
      ...receiptData,
      submittedAt: new Date().toISOString(),
      status: 'PENDING',
      amount: "200"
    };
    const docRef = await addDoc(collection(db, RENEWALS_COL), data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error("Error adding annual renewal receipt:", error);
    throw error;
  }
};

export const getAnnualRenewalReceipts = async () => {
  try {
    const snapshot = await getDocs(collection(db, RENEWALS_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching annual renewals:", error);
    return [];
  }
};

export const updateAnnualRenewalStatus = async (id, newStatus) => {
  try {
    const docRef = doc(db, RENEWALS_COL, id);
    await updateDoc(docRef, { status: newStatus });
    
    // If approved, add a record to the main annual_donations collection
    if (newStatus === 'APPROVED') {
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const target = snap.data();
        const donationSnapshot = await getDocs(collection(db, DONATIONS_COL));
        const nextDonationSno = donationSnapshot.size + 20001;
        const newDonation = {
          sno: nextDonationSno,
          name: target.name || target.donorName,
          uniqueId: target.uniqueId || target.donorUniqueId,
          amount: "200",
          transactionId: target.transactionId,
          trustName: "SILENT HELP CHARITABLE TRUST",
          district: target.district || target.donorDistrict || '',
          block: target.block || target.donorBlock || '',
          sahyogDate: target.date || new Date().toISOString().split('T')[0],
          isRenewal: true // Tag it as a renewal
        };
        await addDoc(collection(db, DONATIONS_COL), newDonation);
      }
    }
    return true;
  } catch (error) {
    console.error("Error updating annual renewal status:", error);
    throw error;
  }
};



