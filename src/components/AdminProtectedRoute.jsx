import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { verifyAdminRole } from '../services/adminAuth';

const AdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthorizedAdmin, setIsAuthorizedAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const { isAuthorized, role } = await verifyAdminRole(user);
        if (isAuthorized) {
          localStorage.setItem('isAdminLoggedIn', 'true');
          localStorage.setItem('adminEmail', user.email || '');
          localStorage.setItem('adminRole', role);
          setIsAuthorizedAdmin(true);
        } else {
          await signOut(auth);
          localStorage.removeItem('isAdminLoggedIn');
          localStorage.removeItem('adminEmail');
          localStorage.removeItem('adminRole');
          setIsAuthorizedAdmin(false);
        }
      } else {
        localStorage.removeItem('isAdminLoggedIn');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminRole');
        setIsAuthorizedAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3 text-white">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-500 border-t-transparent"></div>
          <p className="text-xs font-bold tracking-wider text-teal-300">ADMIN AUTHENTICATING...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorizedAdmin) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
