import React, { useState, useEffect, useMemo } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { RealtimeOperationsView } from './RealtimeOperationsView';
import { DepartmentViews } from './DepartmentViews';
import { IntelligenceAnalyticsView } from './IntelligenceAnalyticsView';
import { QrGeneratorView } from './QrGeneratorView';
import { AdminConfigView } from './AdminConfigView';
import { ExecutiveReportModal } from './ExecutiveReportModal';
import { getDepartmentLabel, getRoleLabel } from '../../utils/rbac';
import {
  Activity,
  Building,
  BarChart3,
  QrCode,
  Settings,
  FileText,
  Clock,
  Sparkles,
  ShieldCheck,
  Smartphone,
  Lock
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const {
    currentHotel,
    stats,
    requests,
    setActiveView,
    currentRole,
    canManageRoomsAndQr,
    userDepartment
  } = useGuestFlow();

  const [activeTab, setActiveTab] = useState<
    'realtime' | 'departments' | 'analytics' | 'qr' | 'admin'
  >('realtime');
  const [showReportModal, setShowReportModal] = useState(false);

  // If user role is departmental and attempts to access QR, Admin, or Analytics, reset to realtime
  useEffect(() => {
    if (!canManageRoomsAndQr && (activeTab === 'qr' || activeTab === 'admin' || activeTab === 'analytics')) {
      setActiveTab('realtime');
    }
  }, [canManageRoomsAndQr, activeTab]);

  // Calculate pending count for the specific department if restricted
  const departmentalPendingCount = useMemo(() => {
    if (userDepartment === 'ALL') return stats.pendingCount;
    return requests.filter(
      (r) => r.hotelId === currentHotel.id && r.department === userDepartment && r.status === 'RECIBIDA'
    ).length;
  }, [requests, currentHotel.id, userDepartment, stats.pendingCount]);

  // Determine available tabs based on RBAC
  const tabs = useMemo(() => {
    if (canManageRoomsAndQr) {
      return [
        { id: 'realtime' as const, label: 'Operaciones en Vivo', icon: Activity, badge: stats.pendingCount },
        { id: 'departments' as const, label: 'Departamentos', icon: Building },
        { id: 'analytics' as const, label: 'Inteligencia & KPIs', icon: BarChart3 },
        { id: 'qr' as const, label: 'Generador de QR', icon: QrCode },
        { id: 'admin' as const, label: 'Configuración & Habitaciones', icon: Settings },
      ];
    }

    const deptName = getDepartmentLabel(userDepartment);
    return [
      {
        id: 'realtime' as const,
        label: `Operaciones: ${deptName}`,
        icon: Activity,
        badge: departmentalPendingCount
      },
      {
        id: 'departments' as const,
        label: `Tablero: ${deptName}`,
        icon: Building
      },
    ];
  }, [canManageRoomsAndQr, userDepartment, stats.pendingCount, departmentalPendingCount]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner with Quick Actions */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md ${
            canManageRoomsAndQr
              ? 'bg-teal-600 text-white shadow-teal-600/20'
              : 'bg-slate-800 text-white shadow-slate-800/20'
          }`}>
            GF
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-slate-900">{currentHotel.name}</h1>
              {canManageRoomsAndQr ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-teal-600" />
                  Gerencia / Admin ({getRoleLabel(currentRole)})
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-600" />
                  Estación: {getDepartmentLabel(userDepartment)}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {canManageRoomsAndQr ? (
                <>Panel de Control Central • {currentHotel.city}, {currentHotel.country} • {currentHotel.totalRooms} Habitaciones</>
              ) : (
                <>Acceso departamental exclusivo para <strong>{getDepartmentLabel(userDepartment)}</strong> • Operaciones y solicitudes asignadas</>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveView('guest')}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            title="Ver cómo lo ve el huésped en su móvil"
          >
            <Smartphone className="w-3.5 h-3.5 text-teal-600" />
            <span>Ver Modo Huésped</span>
          </button>

          {canManageRoomsAndQr && (
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Reporte Ejecutivo</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive ? 'bg-teal-400 text-slate-950' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'realtime' && <RealtimeOperationsView />}
        {activeTab === 'departments' && (
          <DepartmentViews initialDept={userDepartment !== 'ALL' ? userDepartment : undefined} />
        )}
        {activeTab === 'analytics' && canManageRoomsAndQr && (
          <IntelligenceAnalyticsView onOpenReportModal={() => setShowReportModal(true)} />
        )}
        {activeTab === 'qr' && canManageRoomsAndQr && <QrGeneratorView />}
        {activeTab === 'admin' && canManageRoomsAndQr && <AdminConfigView />}
      </div>

      {/* Executive Report Modal */}
      {canManageRoomsAndQr && (
        <ExecutiveReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};

