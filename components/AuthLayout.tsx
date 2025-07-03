import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
             <div className="text-xl text-gray-500 dark:text-gray-400">Loading...</div>
          </div>
        );
    }
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default AuthLayout;
