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

// --- DATA SERVICE APIS ---

export const getPendingRegistrations = async () => {
  try {
    const snapshot = await getDocs(collection(db, PENDING_COL));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return data.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));
  } catch (error) {
    console.error("Error fetching pending registrations:", error);
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

    // 1. Remove from Pending
    await deleteDoc(pendingRef);

    // Generate Sequential Unique ID (SHCT-0001, SHCT-0002, ...)
    const approvedSnapshot = await getDocs(collection(db, APPROVED_COL));
    let maxIdNum = 0;
    approvedSnapshot.forEach((docSnap) => {
      const uId = docSnap.data().uniqueId;
      if (uId && uId.startsWith('SHCT-')) {
        const num = parseInt(uId.replace('SHCT-', ''), 10);
        if (!isNaN(num) && num > maxIdNum) {
          maxIdNum = num;
        }
      }
    });
    const nextIdNum = maxIdNum + 1;
    const uniqueMemberId = `SHCT-${String(nextIdNum).padStart(4, '0')}`;
    
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
    await deleteDoc(doc(db, PENDING_COL, id));
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
