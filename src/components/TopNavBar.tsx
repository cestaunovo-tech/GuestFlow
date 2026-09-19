import React, { useState } from 'react';
import { useGuestFlow } from '../context/GuestFlowContext';
import { GuestFlowLogo } from './GuestFlowLogo';
import { Language, UserRole } from '../types';
import { AuthModal } from './auth/AuthModal';
import {
  Bell,
  Smartphone,
  LayoutDashboard,
  Building2,
  ChevronDown,
  Globe,
  UserCheck,
  CheckCircle2,
  Sparkles,
  BedDouble,
  LogOut,
  ShieldCheck
} from 'lucide-react';

const LANGUAGE_LABELS: Record<Language, { label: string; flag: string }> = {
  es: { label: 'Español', flag: '🇪🇸' },
  en: { label: 'English', flag: '🇬🇧' },
  pt: { label: 'Português', flag: '🇵🇹' },
  fr: { label: 'Français', flag: '🇫🇷' },
  de: { label: 'Deutsch', flag: '🇩🇪' },
  it: { label: 'Italiano', flag: '🇮🇹' },
};

const ROLE_LABELS: Record<UserRole, { label: string; badge: string }> = {
  SUPER_ADMIN: { label: 'Super Admin', badge: 'bg-purple-100 text-purple-800' },
  HOTEL_ADMIN: { label: 'Hotel Admin', badge: 'bg-blue-100 text-blue-800' },
  RECEPCION: { label: 'Recepción', badge: 'bg-emerald-100 text-emerald-800' },
  HOUSEKEEPING: { label: 'Housekeeping', badge: 'bg-amber-100 text-amber-800' },
  ROOM_SERVICE: { label: 'Room Service', badge: 'bg-rose-100 text-rose-800' },
  MANTENIMIENTO: { label: 'Mantenimiento', badge: 'bg-cyan-100 text-cyan-800' },
  GERENCIA: { label: 'Gerencia', badge: 'bg-indigo-100 text-indigo-800' },
  GUEST: { label: 'Huésped', badge: 'bg-teal-100 text-teal-800' },
};

export const TopNavBar: React.FC = () => {
  const {
    hotels,
    currentHotel,
    switchHotel,
    language,
    setLanguage,
    currentRole,
    setCurrentRole,
    activeView,
    setActiveView,
    currentRoom,
    rooms,
    switchRoom,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    stats,
    currentUser,
    isFirebaseConnected,
  } = useGuestFlow();

  const [showHotelMenu, setShowHotelMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showRoomMenu, setShowRoomMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('guest')}
              className="text-left focus:outline-hidden group cursor-pointer"
              title="Ir a inicio de GuestFlow"
            >
              <GuestFlowLogo variant="horizontal" size="sm" showTagline={false} />
            </button>

            {/* In Dashboard: Hotel Multi-tenant Switcher */}
            {activeView === 'dashboard' && (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setShowHotelMenu(!showHotelMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition cursor-pointer"
                >
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                  <span className="max-w-[170px] truncate">{currentHotel.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showHotelMenu && (
                  <div className="absolute left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Hoteles SaaS Conectados
                    </div>
                    {hotels.map((h) => (
                      <button
                        key={h.id}
                        onClick={() => {
                          switchHotel(h.id);
                          setShowHotelMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50/50 cursor-pointer ${
                          h.id === currentHotel.id ? 'font-bold text-teal-700 bg-teal-50' : 'text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="truncate">{h.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">
                            {h.city}, {h.country} • {h.totalRooms} habs
                          </p>
                        </div>
                        {h.id === currentHotel.id && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* In Guest View: Clean Hotel Badge */}
            {activeView === 'guest' && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/80">
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span className="max-w-[200px] truncate">{currentHotel.name}</span>
              </span>
            )}
          </div>

          {/* Center: Guest Mode Room Badge OR Dashboard Status */}
          <div className="flex items-center gap-2">
            {activeView === 'guest' ? (
              <div className="flex items-center gap-2">
                {currentRoom ? (
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-teal-50 border border-teal-200 rounded-full text-xs font-bold text-teal-900 shadow-2xs">
                    <BedDouble className="w-3.5 h-3.5 text-teal-600" />
                    <span>Habitación {currentRoom.number}</span>
                    <span className="hidden md:inline text-teal-700 font-medium">• {currentRoom.type}</span>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-xs font-semibold text-amber-800">
                    Sin Habitación Asignada
                  </span>
                )}
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-600" />
                <span>Panel de Control Central del Hotel</span>
              </div>
            )}
          </div>

          {/* Right Utilities */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* If in Guest Mode: Provide discrete Hotel Staff access button */}
            {activeView === 'guest' ? (
              <>
                {/* Language Selector for Guest */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
                    title="Idioma"
                  >
                    <span>{LANGUAGE_LABELS[language].flag}</span>
                    <span className="hidden sm:inline uppercase">{language}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showLangMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                      <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Idiomas
                      </div>
                      {(Object.keys(LANGUAGE_LABELS) as Language[]).map((langKey) => (
                        <button
                          key={langKey}
                          onClick={() => {
                            setLanguage(langKey);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50 cursor-pointer ${
                            language === langKey ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{LANGUAGE_LABELS[langKey].flag}</span>
                            <span>{LANGUAGE_LABELS[langKey].label}</span>
                          </span>
                          {language === langKey && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Discrete Access to Staff Dashboard */}
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    if (currentRole === 'GUEST') setCurrentRole('RECEPCION');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-900 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  title="Acceso restringido para el personal del hotel"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden sm:inline">Portal Hotel / Staff</span>
                  <span className="sm:hidden">Staff</span>
                </button>
              </>
            ) : (
              /* If in Dashboard: Full staff controls */
              <>
                {/* Button to test Guest View */}
                <button
                  onClick={() => {
                    setActiveView('guest');
                    setCurrentRole('GUEST');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-teal-900 text-xs font-bold transition cursor-pointer"
                  title="Ver App del Huésped"
                >
                  <Smartphone className="w-3.5 h-3.5 text-teal-700" />
                  <span className="hidden sm:inline">Ver App Huésped</span>
                </button>

                {/* Staff Role Switcher */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                    title="Cambiar rol del personal"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-600" />
                    <span className="hidden sm:inline">Rol:</span>
                    <span className="font-bold">{ROLE_LABELS[currentRole]?.label || currentRole}</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                      <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Control de Acceso (RBAC)
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      </div>

                      {/* Section 1: Privileged Roles */}
                      <div className="px-3 pt-2 pb-1">
                        <p className="text-[9px] font-black uppercase text-teal-700 tracking-wider flex items-center gap-1">
                          <span>👑</span>
                          <span>Gerencia &amp; Admins (Reset + QR + Rooms)</span>
                        </p>
                      </div>
                      {(['GERENCIA', 'HOTEL_ADMIN', 'SUPER_ADMIN'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setCurrentRole(role);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            currentRole === role ? 'font-bold text-teal-800 bg-teal-50/80' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold">{ROLE_LABELS[role]?.label}</span>
                            <p className="text-[9px] text-slate-400">Acceso total, reset de datos, QR y rooms</p>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${ROLE_LABELS[role]?.badge}`}
                          >
                            Total
                          </span>
                        </button>
                      ))}

                      {/* Section 2: Departmental Restricted Roles */}
                      <div className="px-3 pt-3 pb-1 border-t border-slate-100 mt-1">
                        <p className="text-[9px] font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                          <span>🏢</span>
                          <span>Departamentos (Solo su área)</span>
                        </p>
                      </div>
                      {(['RECEPCION', 'HOUSEKEEPING', 'ROOM_SERVICE', 'MANTENIMIENTO'] as UserRole[]).map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            setCurrentRole(role);
                            setShowRoleMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                            currentRole === role ? 'font-bold text-teal-800 bg-teal-50/80' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-semibold">{ROLE_LABELS[role]?.label}</span>
                            <p className="text-[9px] text-slate-400">Solo solicitudes de su depto</p>
                          </div>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${ROLE_LABELS[role]?.badge}`}
                          >
                            Depto
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Language Selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowLangMenu(!showLangMenu)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
                    title="Cambiar idioma de la plataforma"
                  >
                    <span>{LANGUAGE_LABELS[language].flag}</span>
                    <span className="hidden sm:inline uppercase">{language}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {showLangMenu && (
                    <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                      <div className="px-3 py-1 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Idiomas
                      </div>
                      {(Object.keys(LANGUAGE_LABELS) as Language[]).map((langKey) => (
                        <button
                          key={langKey}
                          onClick={() => {
                            setLanguage(langKey);
                            setShowLangMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-teal-50 cursor-pointer ${
                            language === langKey ? 'font-bold text-teal-700 bg-teal-50/50' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{LANGUAGE_LABELS[langKey].flag}</span>
                            <span>{LANGUAGE_LABELS[langKey].label}</span>
                          </span>
                          {language === langKey && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifMenu(!showNotifMenu)}
                    className="relative p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
                    title="Notificaciones en tiempo real"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifMenu && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-teal-600" />
                          <h4 className="text-xs font-bold text-slate-900">Notificaciones Operativas</h4>
                        </div>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
                          >
                            Limpiar todas
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400">
                            No hay notificaciones pendientes.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => markNotificationRead(n.id)}
                              className={`p-3.5 text-xs hover:bg-slate-50 cursor-pointer transition ${
                                !n.read ? 'bg-teal-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-slate-900">{n.title}</p>
                                <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
                              </div>
                              <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                              {n.department && (
                                <span className="inline-block mt-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                                  {n.department}
                                </span>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Firebase Multi-Tenant & RBAC Auth Button */}
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50/80 hover:bg-teal-100/80 text-xs font-bold text-teal-900 transition shrink-0 cursor-pointer"
                  title="Autenticación Firebase & Control de Roles (RBAC)"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span className="hidden md:inline">
                    {currentUser ? currentUser.name.split(' ')[0] : 'Personal / Auth'}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFirebaseConnected ? 'bg-emerald-500' : 'bg-amber-400'
                    } animate-pulse`}
                    title={isFirebaseConnected ? 'Firestore conectado en tiempo real' : 'Conectando Firestore'}
                  />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Firebase Authentication & RBAC Modal */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  );
};
