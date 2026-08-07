import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPendingRegistrations, getApprovedMembers } from '../../services/dataService';
import html2canvas from 'html2canvas';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

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
    const fetchUser = async () => {
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
      }
    }
  };
    
  fetchUser();
}, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '⊞' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'idcard', label: 'ID Card', icon: '🪪' },
    { id: 'upload_death', label: 'Upload Death Receipt', icon: '☁️' },
    { id: 'view_sahyog', label: 'View All Sahyog List', icon: '📚' },
    { id: 'upload_beti', label: 'Upload Beti Vivah Sahyog Receipt', icon: '☁️' },
    { id: 'view_beti', label: 'View All Beti Vivah Sahyog List', icon: '📚' },
    { id: 'upload_varshik', label: 'Upload Varshik Dan', icon: '☁️' },
    { id: 'view_varshik', label: 'View All Varshik Dan Suchi', icon: '📑' },
    { id: 'referral', label: 'Referral Points', icon: '👥' },
    { id: 'password', label: 'Update Password', icon: '👁️' },
  ];

  // ================= VIEWS =================

  const DashboardView = () => (
    <div className="p-6">
      <div className="bg-[#7c69c9] rounded-lg p-8 flex items-center justify-between text-white shadow-sm relative overflow-hidden">
        <h2 className="text-xl font-bold tracking-wide relative z-10">WELCOME TO FAST RELIEF CHARITABLE TRUST</h2>
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center relative z-10">
          <span className="text-3xl text-white">📦</span>
        </div>
        <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/10 to-transparent transform -skew-x-12 translate-x-8"></div>
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
      case 'view_sahyog': return <ViewSahyogList />;
      case 'view_varshik': return <ViewVarshikDanList />;
      case 'upload_death': return <PlaceholderView title="Upload Death Receipt" />;
      case 'upload_beti': return <PlaceholderView title="Upload Beti Vivah Sahyog Receipt" />;
      case 'view_beti': return <PlaceholderView title="View All Beti Vivah Sahyog List" />;
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
