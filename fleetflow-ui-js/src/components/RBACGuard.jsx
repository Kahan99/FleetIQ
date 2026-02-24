'use client';

import { useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { canAccess } from '@/lib/rbac';
import { ShieldX, Loader2 } from 'lucide-react';





export default function RBACGuard({ children }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); const pathname = location.pathname;;

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>);

  }

  if (!user) return null;

  // Check route access
  const hasAccess = canAccess(user.role, pathname);

  if (!hasAccess) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6">
                        <ShieldX className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-500 mb-2">
                        Your role <span className="font-semibold text-gray-700">({user.role.replace(/_/g, ' ')})</span> does not have permission to view this page.
                    </p>
                    <p className="text-sm text-gray-400 mb-6">Contact your Fleet Manager to request access.</p>
                    <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors">
            
                        Back to Dashboard
                    </button>
                </div>
            </div>);

  }

  return <>{children}</>;
}