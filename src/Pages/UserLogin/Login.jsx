import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/shct.png'; // अपना लोगो इम्पोर्ट करें (पाथ चेक कर लें)

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const fromPath = location.state?.from?.pathname || '/user-dashboard';
  const alertMessage = location.state?.message;

  const [aadhaar, setAadhaar] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userAadhaar', aadhaar);
    navigate(fromPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Header / Logo Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-24 w-24 bg-white rounded-full p-2 shadow-lg border border-gray-100 flex items-center justify-center mb-4">
          <img src={logoImg} alt="SHCT Logo" className="h-full w-full object-contain" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Welcome Back!
        </h2>
        <p className="mt-2 text-sm text-gray-600 font-medium">
          कृपया अपने अकाउंट में लॉगिन करें (Member Login)
        </p>
      </div>

      {/* Login Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-gray-100 relative overflow-hidden">
          
          {/* Alert message when redirected */}
          {alertMessage && (
            <div className="mb-6 p-3.5 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm">
              <span className="text-lg">🔒</span>
              <span>{alertMessage}</span>
            </div>
          )}

          {/* Background Decorative Shapes */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#087889] opacity-10 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-[#f08519] opacity-10 rounded-full blur-xl"></div>

          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            
            {/* Aadhar Number Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                आधार कार्ड नंबर (User ID) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">💳</span>
                </div>
                <input 
                  type="text" 
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" 
                  placeholder="अपना 12 अंकों का आधार नंबर डालें" 
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                पासवर्ड (Password) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 sm:text-sm">🔒</span>
                </div>
                <input 
                  type="password" 
                  className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] focus:border-[#087889] transition-colors" 
                  placeholder="अपना पासवर्ड दर्ज करें" 
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  className="h-4 w-4 text-[#087889] focus:ring-[#087889] border-gray-300 rounded cursor-pointer" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-medium cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-[#f08519] hover:text-orange-600 transition-colors">
                  पासवर्ड भूल गए?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-lg font-bold text-white bg-[#087889] hover:bg-[#06616e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#087889] transition-all transform hover:-translate-y-0.5"
              >
                LOGIN (लॉगिन करें)
              </button>
            </div>
          </form>

          {/* Registration Link for New Users */}
          <div className="mt-8 relative z-10">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 font-medium">SHCT के नए सदस्य हैं?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link 
                to="/register" 
                className="w-full flex justify-center py-3 px-4 border-2 border-[#f08519] rounded-xl shadow-sm text-base font-bold text-[#f08519] bg-white hover:bg-orange-50 focus:outline-none transition-colors"
              >
                नया पंजीकरण करें (Register Now)
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;