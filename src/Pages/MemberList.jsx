 import React, { useState, useEffect } from 'react';
import { getApprovedMembers } from '../services/dataService';

const MemberList = () => {
  const logoTeal = "#087889";
  const logoOrange = "#f08519";

  const [dynamicApproved, setDynamicApproved] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setDynamicApproved(await getApprovedMembers());
    };
    fetchData();
  }, []);

  const allMembers = dynamicApproved.map((item, idx) => ({
      sno: item.sno || String(idx + 109051),
      uniqueId: item.uniqueId || '3118904099',
      name: item.name,
      guardian: item.fatherName || 'N/A',
      occupation: item.occupation || 'Member',
      workAddress: item.address || item.district || 'N/A',
      district: item.district || 'Khalilabad',
      block: item.block || 'Sant Kabir Nagar',
      status: 'Activate',
      permanentAddress: item.address || 'N/A',
      submitDate: item.joinedDate || new Date().toISOString().split('T')[0]
    }));

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* ================= HERO / BANNER SECTION ================= */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
        {/* Background Image with Overlay */}
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Happy Children" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h1 className="relative z-10 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-wider drop-shadow-lg">
          Member List
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* ================= FILTER SECTION ================= */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
          
          {/* District Dropdown */}
          <div className="w-full md:w-1/3">
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-600 transition-colors">
              <option value="">Select District</option>
              <option value="etah">Etah</option>
              <option value="shahjahanpur">Shahjahanpur</option>
              <option value="amroha">Amroha</option>
            </select>
          </div>

          {/* Block Dropdown */}
          <div className="w-full md:w-1/3">
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-600 transition-colors">
              <option value="">Select Block</option>
              <option value="jaithra">JAITHRA</option>
              <option value="bhawalkhera">BHAWALKHERA</option>
              <option value="amroha">AMROHA</option>
            </select>
          </div>

          {/* Filter Button */}
          <button className="w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">
            Filter
          </button>
        </div>

        {/* ================= TABLE CONTROLS (Show Entries & Search) ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          
          {/* Show Entries */}
          <div className="flex items-center text-sm font-medium text-gray-600">
            <span>Show</span>
            <select className="mx-2 px-2 py-1 border border-gray-300 rounded-md focus:ring-[#087889] outline-none bg-white" defaultValue="25">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span>entries</span>
          </div>

          {/* Search Box */}
          <div className="flex items-center text-sm font-medium text-gray-600 w-full sm:w-auto">
            <span className="mr-2">Search:</span>
            <input 
              type="text" 
              className="w-full sm:w-64 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#087889] outline-none transition-colors"
            />
          </div>

        </div>

        {/* ================= DATA TABLE ================= */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1200px]">
              
              {/* Table Head (Group हटा दिया गया है) */}
              <thead>
                <tr className="text-white text-[13px] tracking-wide uppercase" style={{ backgroundColor: logoTeal }}>
                  <th className="p-4 border-r border-teal-600 font-semibold">S NO</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Unique ID</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">नाम</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">पिता/पति का नाम</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">व्यवसाय</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">कार्यरत कार्यालय नाम व पता</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">स्थाई निवासी जिला</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">ब्लॉक</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Status</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">स्थाई पता</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {allMembers.map((member, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-teal-50/50 transition-colors">
                    <td className="p-4 border-r border-gray-100">{member.sno}</td>
                    <td className="p-4 border-r border-gray-100 font-mono font-medium text-gray-900">{member.uniqueId}</td>
                    <td className="p-4 border-r border-gray-100 font-bold">{member.name}</td>
                    <td className="p-4 border-r border-gray-100">{member.guardian}</td>
                    <td className="p-4 border-r border-gray-100">{member.occupation}</td>
                    <td className="p-4 border-r border-gray-100 whitespace-normal min-w-[200px]">{member.workAddress}</td>
                    <td className="p-4 border-r border-gray-100">{member.district}</td>
                    <td className="p-4 border-r border-gray-100 uppercase">{member.block}</td>
                    <td className="p-4 border-r border-gray-100 font-bold text-green-600">{member.status}</td>
                    <td className="p-4 border-r border-gray-100 whitespace-normal min-w-[250px]">{member.permanentAddress}</td>
                    <td className="p-4 whitespace-normal w-[100px] text-gray-500">{member.submitDate}</td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
          
          {/* Pagination Info */}
          <div className="p-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
            <span>Showing 1 to 3 of 3 entries</span>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-[#087889] text-white rounded-md font-medium">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MemberList;