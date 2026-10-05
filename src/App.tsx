import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AccessGate } from './features/auth/AccessGate';
import { ApprovalHub } from './features/approval/ApprovalHub';
import { AdminPortal } from './features/admin/AdminPortal';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { UATOnboardingGuard } from './features/uat/UATOnboardingGuard';

type AppScreen = 'GATE' | 'DASHBOARD' | 'ADMIN';
type UserMenu = 'UAT' | 'AGREEMENT';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('GATE');
  const [activeMenu, setActiveMenu] = useState<UserMenu>('UAT');
  const [userEmail, setUserEmail] = useState('');
  const [companyName] = useState('');

  const handleGateComplete = (email: string) => {
    setUserEmail(email);
    if (email === 'admin@indiana.com') {
      setCurrentScreen('ADMIN');
    } else {
      setCurrentScreen('DASHBOARD');
    }
  };

  const handleLive = () => {
    console.log('User is now live!');
  };

  const handleLogout = () => {
    setCurrentScreen('GATE');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AnimatePresence mode="wait">
        {currentScreen === 'GATE' && (
          <div className="py-12 px-4">
            <nav className="max-w-4xl mx-auto mb-12 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold italic">I</div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">INDIANA</span>
              </div>
            </nav>
            <AccessGate key="gate" onLogin={handleGateComplete} />
          </div>
        )}
        {currentScreen === 'ADMIN' && (
          <div className="py-12 px-4">
            <AdminPortal key="admin" onLogout={handleLogout} />
          </div>
        )}
        {currentScreen === 'DASHBOARD' && (
          <DashboardLayout
            key="dashboard"
            activeMenu={activeMenu}
            setActiveMenu={(menu) => setActiveMenu(menu as UserMenu)}
            onLogout={handleLogout}
          >
            {activeMenu === 'UAT' ? (
              <UATOnboardingGuard email={userEmail} companyName={companyName} />
            ) : (
              <ApprovalHub companyName={companyName} onLive={handleLive} />
            )}
          </DashboardLayout>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;