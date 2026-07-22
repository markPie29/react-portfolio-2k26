import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          <span className="text-xs uppercase tracking-widest text-gray-400">Authenticating...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
