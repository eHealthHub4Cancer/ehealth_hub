// src/components/PrivateRoute.js (Enhanced with proper role redirects)
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import './PrivateRoute.css';

// User roles - this is your security layer!
const USER_ROLES = {
  'ehealth@ul.ie': 'admin',     // Your existing admin account
  'user@ehealth.ie': 'user'     // New shared user account
};

const getUserRole = (email) => {
  return USER_ROLES[email] || 'user';
};

const PrivateRoute = ({ children, requiredRole = null }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        setUserEmail(user.email);
        setUserRole(getUserRole(user.email));
      } else {
        setAuthenticated(false);
        setUserEmail(null);
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Show access denied message briefly before redirecting
  useEffect(() => {
    if (showAccessDenied) {
      const timer = setTimeout(() => {
        setShowAccessDenied(false);
      }, 3000); // Show for 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showAccessDenied]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // First check: Are they logged in?
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Second check: Do they have the required role?
  if (requiredRole && userRole !== requiredRole) {
    // Show access denied message
    if (!showAccessDenied) {
      setShowAccessDenied(true);
      // alert(`Access Denied: You don't have permission to access this area.\n\nRedirecting you to your dashboard...`);
    }

    // Redirect based on user role
    if (userRole === 'admin') {
      return <Navigate to="/blog-admin" replace />;
    } else {
      return <Navigate to="/blog-dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;