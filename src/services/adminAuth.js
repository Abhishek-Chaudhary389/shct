import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Whitelisted Authorized Super Admin Emails & UIDs (with fallback from environment)
const ENV_ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'shctweb26@gmail.com';
const ENV_ADMIN_UID = import.meta.env.VITE_ADMIN_UID || 'vGL5Io3SlUS5DgtmPUuvdsFnvPz1';

export const AUTHORIZED_ADMIN_EMAILS = [
  ENV_ADMIN_EMAIL,
  'silenthelpct@gmail.com'
].filter(Boolean);

export const AUTHORIZED_ADMIN_UIDS = [
  ENV_ADMIN_UID
].filter(Boolean);

/**
 * Checks if a given Firebase User has admin role privileges
 * @param {import('firebase/auth').User | null} user 
 * @returns {Promise<{ isAuthorized: boolean, role: string }>}
 */
export const verifyAdminRole = async (user) => {
  if (!user) {
    return { isAuthorized: false, role: 'NONE' };
  }

  const userEmail = (user.email || '').toLowerCase().trim();
  const userUid = user.uid || '';

  // 1. Direct Whitelist Check (Instant & Reliable)
  const isEmailMatch = AUTHORIZED_ADMIN_EMAILS.some(e => e.toLowerCase() === userEmail);
  const isUidMatch = AUTHORIZED_ADMIN_UIDS.includes(userUid);

  if (isEmailMatch || isUidMatch) {
    // Sync / register admin in Firestore collection
    try {
      await setDoc(doc(db, 'admins', userUid), {
        uid: userUid,
        email: userEmail,
        role: 'SUPER_ADMIN',
        status: 'ACTIVE',
        lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn("Could not sync admin document to firestore:", e);
    }
    return { isAuthorized: true, role: 'SUPER_ADMIN' };
  }

  // 2. Check Firestore 'admins' collection if dynamically added
  try {
    const adminDocRef = doc(db, 'admins', userUid);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      if (data.status === 'ACTIVE' && (data.role === 'SUPER_ADMIN' || data.role === 'ADMIN')) {
        return { isAuthorized: true, role: data.role };
      }
    }
  } catch (error) {
    console.error("Error checking Firestore admin role:", error);
  }

  return { isAuthorized: false, role: 'UNAUTHORIZED' };
};
