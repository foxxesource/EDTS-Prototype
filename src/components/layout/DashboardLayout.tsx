import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, FileCheck, Beaker, LogOut } from 'lucide-react';
import { Button } from '../ui/Button';

interface DashboardLayoutProps {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  children: React.ReactNode;
  onLogout: () => void;
}

export const DashboardLayout = ({ activeMenu, setActiveMenu, children, onLogout }: DashboardLayoutProps) => {
  const menuItems = [
    { id: 'UAT', label: 'UAT Testing', icon: Beaker },
    { id: 'AGREEMENT', label: 'Agreement', icon: FileCheck },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold italic">I</div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">INDIANA</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <LayoutDashboard className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 uppercase">Partner Portal</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Welcome back! Manage your UAT and activate your agreement.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 text-xs h-10"
          >
            <LogOut className="w-3 h-3" /> Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};
