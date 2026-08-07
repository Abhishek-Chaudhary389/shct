import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  if (!isLoggedIn) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location, 
          message: 'Sahayog Form का उपयोग करने के लिए कृपया पहले लॉगिन करें।' 
        }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
