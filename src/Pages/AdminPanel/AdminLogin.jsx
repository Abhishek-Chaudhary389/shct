import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../../assets/shct.png';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminId.trim() === 'admin' && password.trim() === 'admin123') {
      localStorage.setItem('isAdminLoggedIn', 'true');
      navigate('/admin-dashboard');
    } else {
      setError('गलत एडमिन ID या पासवर्ड! कृपया सही विवरण दर्ज करें।');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mx-auto h-24 w-24 bg-white rounded-full p-2 shadow-xl border border-gray-200 flex items-center justify-center mb-4">
          <img src={logoImg} alt="SHCT Logo" className="h-full w-full object-contain scale-110" />
        </div>
        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
          SHCT Admin Portal
        </h2>
        <p className="mt-2 text-sm text-gray-600 font-semibold">
          Silent Help Charitable Trust - एडमिन पैनल में प्रवेश करें
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-2xl rounded-2xl border border-gray-200 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-[#087889] opacity-15 rounded-full blur-xl"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-[#f08519] opacity-15 rounded-full blur-xl"></div>

          {error && (
            <div className="mb-6 p-3.5 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-semibold rounded-r-lg">
              ⚠️ {error}
            </div>
          )}

          <form className="space-y-6 relative z-10" onSubmit={handleAdminLogin}>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Admin User ID <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  🛡️
                </div>
                <input 
                  type="text" 
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] focus:border-[#087889] font-medium transition-colors" 
                  placeholder="admin" 
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Admin Password <span className="text-red-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  🔑
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#087889] focus:border-[#087889] font-medium transition-colors" 
                  placeholder="admin123" 
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-800 font-medium">
              💡 <strong>Default Demo Credentials:</strong><br/>
              Username: <code className="font-bold">admin</code> | Password: <code className="font-bold">admin123</code>
            </div>

            <div>
              <button 
                type="submit" 
                className="w-full py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-[#087889] hover:bg-[#06616e] focus:outline-none transition-all transform hover:-translate-y-0.5"
              >
                ADMIN LOGIN (प्रवेश करें)
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
