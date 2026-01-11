import React, { useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, Menu, X, LogOut, Zap } from 'lucide-react';
import { cn } from '../utils/cn';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BarChart3, label: 'Xisobotlar', path: '/reports' },
    { icon: Settings, label: 'Sozlamalar', path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={toggle}
        />
      )}
      
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 border-r border-slate-800/50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          !isOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 shadow-lg shadow-blue-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Xpro</span>
            </div>
            <button onClick={toggle} className="lg:hidden text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
            <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && toggle()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 shadow-sm border border-blue-600/10" 
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                  )
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* User Profile */}
          <div className="border-t border-slate-800/50 p-4">
            <div className="flex items-center gap-3 rounded-xl bg-slate-900/50 p-3 border border-slate-800/50">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-medium border border-slate-700">
                F
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-white">frlking2007</p>
                <p className="truncate text-xs text-slate-500">Admin</p>
              </div>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                title="Chiqish"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/reports': return 'Xisobotlar';
      case '/settings': return 'Sozlamalar';
      default: return 'Xpro';
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-20 items-center justify-between border-b border-slate-800/50 bg-slate-950/50 backdrop-blur-xl px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-semibold text-white">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search and Notifications removed */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 lg:p-8">
          <div className="mx-auto max-w-7xl animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
