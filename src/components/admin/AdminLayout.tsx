import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Inbox,
  Calendar as CalendarIcon,
  Clock,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Inquiries', path: '/admin/inquiries', icon: Inbox },
    { label: 'Calendar Bookings', path: '/admin/calendar', icon: CalendarIcon },
    { label: 'Availability Rules', path: '/admin/availability', icon: Clock },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-gray-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0c1017] border-r border-white/10 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-sky-500/15 border border-sky-500/30 rounded-xl flex items-center justify-center text-sky-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-neutralfacebold text-sm text-white uppercase tracking-tight">
                  Portfolio Admin
                </h1>
                <span className="text-[10px] text-gray-400 block font-mono">v1.0 • Supabase</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Footer Actions */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <div className="px-3 py-2 bg-white/5 rounded-xl text-xs overflow-hidden">
            <span className="text-[10px] text-gray-500 block uppercase font-bold">Logged in as</span>
            <span className="text-gray-300 font-mono truncate block">{user?.email || 'Admin'}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              to="/"
              target="_blank"
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleSignOut}
              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
