import React, { useState, useEffect } from 'react';
import { getGreenParyavaranList } from '../../services/dataService';

const GreenParyavaranList = () => {
  const [dataList, setDataList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setDataList(await getGreenParyavaranList());
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-t-2xl text-center py-10 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-wide relative z-10">
            ग्रीन पर्यावरण सूची
          </h1>
          <p className="text-white/80 mt-2 font-medium relative z-10">
            यहाँ आप सभी आवेदनों की स्थिति देख सकते हैं।
          </p>
        </div>

        {/* LIST TABLE */}
        <div className="bg-white rounded-b-2xl shadow-xl border-t-4 border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-sm font-extrabold uppercase border-b border-gray-200">
                  <th className="py-4 px-6">आवेदक का नाम</th>
                  <th className="py-4 px-6">पौधों की संख्या</th>
                  <th className="py-4 px-6">रोपण तिथि</th>
                  <th className="py-4 px-6">जिला / ब्लॉक</th>
                  <th className="py-4 px-6 text-center">फोटो</th>
                  <th className="py-4 px-6 text-center">स्थिति (Status)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm font-medium">
                {dataList.length > 0 ? (
                  dataList.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <p className="font-bold text-gray-900 text-base">{item.applicantName}</p>
                        <p className="text-xs font-mono text-gray-500 mt-1">ID: {item.uniqueId}</p>
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-800 text-lg">
                        {item.treesPlanted} 🌳
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-700">
                        {item.plantationDate}
                      </td>
                      <td className="py-4 px-6 text-xs">
                        <p className="font-bold text-gray-800">{item.district || 'N/A'}</p>
                        <p className="text-gray-500">{item.block || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-6 text-center text-gray-400">
                        {item.documentImage ? (
                          <button 
                            onClick={() => setSelectedImage(item.documentImage)}
                            className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                          >
                            👁️ फोटो देखें
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs font-medium">उपलब्ध नहीं</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {item.status === 'APPROVED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-green-100 text-green-700 shadow-sm border border-green-200">
                            ✅ स्वीकृत
                          </span>
                        )}
                        {item.status === 'REJECTED' && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-red-100 text-red-700 shadow-sm border border-red-200">
                            ❌ अस्वीकृत
                          </span>
                        )}
                        {(item.status === 'PENDING' || !item.status) && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black bg-amber-100 text-amber-700 shadow-sm border border-amber-200">
                            ⏳ पेंडिंग
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-gray-500">
                      <div className="text-4xl mb-3">📭</div>
                      <p className="text-lg font-semibold">इस सूची में अभी कोई आवेदन नहीं है।</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-5">
              <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">📄</span> दस्तावेज / फोटो
              </h4>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-gray-400 hover:text-gray-900 text-2xl font-bold transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            </div>
            <div className="h-[400px] w-full bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 p-2">
              <img src={selectedImage} alt="Preview" className="h-full w-full object-contain rounded-xl" />
            </div>
            <div className="mt-6 text-right">
              <button 
                onClick={() => setSelectedImage(null)}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-all shadow-md"
              >
                बंद करें (Close)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default GreenParyavaranList;
