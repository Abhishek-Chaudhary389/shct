import React, { useState, useEffect } from 'react';
import { getAnnualDonations } from '../services/dataService';

const AnnualDonationList = () => {
  const logoTeal = "#087889";

  const [dynamicDonations, setDynamicDonations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setDynamicDonations(await getAnnualDonations());
    };
    fetchData();
  }, []);

  const donationData = dynamicDonations;

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      
      {/* BANNER SECTION */}
      <div className="relative w-full h-48 md:h-64 bg-gray-900 flex items-center justify-center overflow-hidden shadow-md">
        <img 
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <h1 className="relative z-10 text-3xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-lg text-center px-4">
          Annual Donation List
        </h1>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* FILTER SECTION */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 items-center">
          <div className="w-full md:w-1/3">
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-600 transition-colors">
              <option value="">Select District</option>
              <option value="mirzapur">Mirzapur</option>
              <option value="ballia">Ballia</option>
            </select>
          </div>
          <div className="w-full md:w-1/3">
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#087889] outline-none text-gray-600 transition-colors">
              <option value="">Select Block</option>
              <option value="pahari">PAHARI</option>
              <option value="pandah">PANDAH</option>
            </select>
          </div>
          <button className="w-full md:w-auto px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">
            Filter
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="text-white text-[13px] tracking-wide uppercase" style={{ backgroundColor: logoTeal }}>
                  <th className="p-4 border-r border-teal-600 font-semibold">S NO</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Name</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Unique ID</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Amount</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Donation to trust</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">District</th>
                  <th className="p-4 border-r border-teal-600 font-semibold">Block</th>
                  <th className="p-4 font-semibold">Sahyog Date</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {donationData.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-teal-50/50 transition-colors">
                    <td className="p-4 border-r border-gray-100">{item.sno}</td>
                    <td className="p-4 border-r border-gray-100 font-bold">{item.name}</td>
                    <td className="p-4 border-r border-gray-100 font-mono text-gray-900">{item.uniqueId}</td>
                    <td className="p-4 border-r border-gray-100 font-bold text-green-600">₹{item.amount}</td>
                    <td className="p-4 border-r border-gray-100 font-medium text-gray-800">{item.trustName}</td>
                    <td className="p-4 border-r border-gray-100">{item.district}</td>
                    <td className="p-4 border-r border-gray-100 uppercase">{item.block}</td>
                    <td className="p-4 text-gray-500 font-medium">{item.sahyogDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnnualDonationList;