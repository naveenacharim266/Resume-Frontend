import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      setAuthenticated(true);
      
    }
    setIsChecking(false); // we’ve checked, allow render
  }, []);

  if (isChecking) {
    return <div className="text-center py-5">Checking authentication...</div>;
  }

  return authenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
