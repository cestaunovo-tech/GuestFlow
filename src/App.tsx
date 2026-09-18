import React from 'react';
import { GuestFlowProvider, useGuestFlow } from './context/GuestFlowContext';
import { TopNavBar } from './components/TopNavBar';
import { GuestHome } from './components/guest/GuestHome';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { GuestFlowLogo } from './components/GuestFlowLogo';

const MainContent: React.FC = () => {
  const { activeView } = useGuestFlow();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
      {/* Top Header Navigation */}
      <TopNavBar />

      {/* Main App Workspace */}
      <main className="flex-1 pb-16">
        {activeView === 'guest' ? <GuestHome /> : <DashboardLayout />}
      </main>

      {/* Global SaaS Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 px-4 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <GuestFlowLogo variant="horizontal" size="sm" showTagline={true} />

          <p className="text-[11px] text-slate-400 font-medium max-w-xl italic">
            "El huésped pide. GuestFlow deriva. El área ejecuta. El huésped recibe información. El hotel mide."
          </p>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            <span>© {new Date().getFullYear()} GuestFlow SaaS Inc.</span>
            <span>•</span>
            <span>Hospitality Intelligence Cloud</span>
            <span>•</span>
            <span>GDPR &amp; PCI-DSS Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GuestFlowProvider>
      <MainContent />
    </GuestFlowProvider>
  );
}
