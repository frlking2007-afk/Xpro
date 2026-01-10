import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Settings, Menu, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = ({ isOpen, toggle }: { isOpen: boolean; toggle: () => void }) => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Mijozlar', path: '/customers' },
    { icon: BarChart3, label: 'Xisobotlar', path: '/reports' },
    { icon: Settings, label: 'Sozlamalar', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 lg:justify-center">
        <h1 className="text-2xl font-bold text-blue-500">Xpro</h1>
        <button onClick={toggle} className="lg:hidden">
          <X className="h-6 w-6" />
        </button>
      </div>
      <nav className="mt-8 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white",
                isActive && "bg-blue-600 text-white hover:bg-blue-700"
              )
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggle={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm lg:hidden">
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <span className="font-semibold text-gray-800">Xpro CRM</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
