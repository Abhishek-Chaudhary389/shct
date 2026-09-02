import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase';
import { verifyAdminRole } from '../../services/adminAuth';
import logoImg from '../../assets/shct.png';
import { 
  ShieldIcon, 
  KeyIcon, 
  MailIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  EyeIcon, 
  EyeOffIcon,
  RefreshIcon,
  CloseIcon,
  LockIcon
} from '../../components/common/Icons';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const navigate = useNavigate();

  // If already logged in and verified as admin, navigate to dashboard
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { isAuthorized } = await verifyAdminRole(user);
        if (isAuthorized) {
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('adminEmail', user.email || '');
          navigate('/admin-dashboard', { replace: true });
        } else {
          localStorage.removeItem('isAdminLoggedIn');
          localStorage.removeItem('adminEmail');
        }
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const getFriendlyErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'गलत ईमेल या पासवर्ड! कृपया सही विवरण दर्ज करें।';
      case 'auth/invalid-email':
        return 'कृपया एक मान्य ईमेल पता दर्ज करें।';
      case 'auth/too-many-requests':
        return 'सुरक्षा कारणों से खाता अस्थायी रूप से ब्लॉक है। कृपया कुछ समय बाद प्रयास करें।';
      case 'auth/network-request-failed':
        return 'इंटरनेट कनेक्शन में समस्या है। कृपया नेटवर्क चेक करें।';
      case 'auth/user-disabled':
        return 'यह खाता निष्क्रिय कर दिया गया है।';
      default:
        return 'लॉगिन करने में समस्या आई। कृपया पुनः प्रयास करें।';
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // Check if this user has the Admin Role
      const { isAuthorized, role } = await verifyAdminRole(user);

      if (!isAuthorized) {
        await signOut(auth);
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminEmail');
        setError('अनाधिकृत प्रवेश (Access Denied)! यह खाता एडमिन पोर्टल के लिए अधिकृत नहीं है।');
        setLoading(false);
        return;
      }

      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminEmail', user.email || email.trim());
      localStorage.setItem('adminRole', role);
      localStorage.setItem('adminUid', user.uid);
      setSuccessMessage('एडमिन प्रमाणीकरण सफल! एडमिन डैशबोर्ड खोला जा रहा है...');
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 500);
    } catch (err) {
      console.error("Firebase Admin Login Error:", err);
      setError(getFriendlyErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      
      {/* Background Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="mx-auto h-24 w-24 bg-white rounded-3xl p-2 shadow-2xl ring-4 ring-teal-500/20 flex items-center justify-center mb-4 transition-transform hover:scale-105">
          <img src={logoImg} alt="SHCT Logo" className="h-full w-full object-contain" />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase">
          SHCT Admin Portal
        </h2>
        <p className="mt-2 text-sm text-teal-300 font-semibold flex items-center justify-center gap-1.5">
          <LockIcon className="w-4 h-4 text-[#f08519]" /> Authorized Admin Authentication
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-white/95 backdrop-blur-md py-10 px-6 sm:px-8 shadow-2xl rounded-3xl border border-gray-100 relative overflow-hidden">
          
          {/* Top Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#087889] via-teal-500 to-[#f08519]"></div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs sm:text-sm font-bold rounded-r-xl flex items-center gap-2.5 animate-fadeIn shadow-sm">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 text-xs sm:text-sm font-bold rounded-r-xl flex items-center gap-2.5 animate-fadeIn shadow-sm">
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAdminLogin}>
            
            {/* Email Input */}
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Email (ईमेल) <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <MailIcon className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#087889] focus:bg-white text-gray-900 font-semibold text-sm transition-all outline-none" 
                  placeholder="admin@example.com" 
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Password (पासवर्ड) <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <KeyIcon className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#087889] focus:bg-white text-gray-900 font-semibold text-sm transition-all outline-none" 
                  placeholder="••••••••" 
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-[#087889] transition-colors cursor-pointer"
                  title={showPassword ? "पासवर्ड छुपाएं" : "पासवर्ड देखें"}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-xl shadow-lg hover:shadow-xl text-sm font-black text-white bg-gradient-to-r from-[#087889] to-teal-700 hover:from-[#06616e] hover:to-teal-800 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <RefreshIcon className="w-4 h-4 animate-spin" />
                    सत्यापित किया जा रहा है...
                  </>
                ) : (
                  <>
                    <ShieldIcon className="w-4 h-4" />
                    ADMIN LOGIN (प्रवेश करें)
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Note */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2 text-center text-gray-500 text-[11px] font-bold">
            <LockIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>256-Bit SSL Encrypted Firebase Authentication</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default AdminLogin;
