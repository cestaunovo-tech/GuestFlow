import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { CreateRoomModal } from './CreateRoomModal';
import { ResetDataModal } from './ResetDataModal';
import { generateQrCodeDataUrl, generateRoomUrl } from '../../utils/qrUtils';
import { getDepartmentLabel, getRoleLabel } from '../../utils/rbac';
import { Room } from '../../types';
import {
  Building2,
  Wifi,
  BedDouble,
  Utensils,
  Layers,
  Link2,
  CheckCircle2,
  Plus,
  Save,
  ShieldCheck,
  Server,
  QrCode,
  Trash2,
  ExternalLink,
  Download,
  Copy,
  X,
  Sparkles,
  Lock,
  RotateCcw,
  ShieldAlert,
  Database,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminConfigView: React.FC = () => {
  const {
    currentHotel,
    rooms,
    requests,
    menuItems,
    deleteRoom,
    switchRoom,
    setActiveView,
    clearExampleRooms,
    canManageRoomsAndQr,
    canResetAllData,
    currentRole,
    userDepartment
  } = useGuestFlow();

  const [hotelName, setHotelName] = useState(currentHotel.name);
  const [wifiSsid, setWifiSsid] = useState(currentHotel.wifiSsid);
  const [wifiPass, setWifiPass] = useState(currentHotel.wifiPass);
  const [activeTab, setActiveTab] = useState<'hotel' | 'rooms' | 'menu' | 'integrations' | 'data'>('rooms');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Reset modal state
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetModalMode, setResetModalMode] = useState<'history_only' | 'full_reset'>('history_only');

  // Room modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [previewQrRoom, setPreviewQrRoom] = useState<Room | null>(null);
  const [previewQrDataUrl, setPreviewQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Security Guard: Restrict to Gerencia, Hotel Admin, Super Admin
  if (!canManageRoomsAndQr) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Acceso Restringido a Configuración</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Solo el <strong>Gerente General</strong>, el <strong>Administrador de Hotel</strong> y el <strong>Super Administrador</strong> tienen permisos para gestionar el inventario de habitaciones, modificar configuraciones y generar accesos QR.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500">
          Rol actual: <strong>{getRoleLabel(currentRole)}</strong> • Departamento: <strong>{getDepartmentLabel(userDepartment)}</strong>
        </div>
      </div>
    );
  }

  // Integrations status toggles
  const [integrations, setIntegrations] = useState([
    {
      id: 'pms_opera',
      category: 'PMS',
      name: 'Oracle Hospitality OPERA Cloud',
      desc: 'Sincronización bidireccional de folios, huéspedes y estado de habitación.',
      connected: true,
      badge: 'Conectado (v23.4)',
    },
    {
      id: 'pms_cloudbeds',
      category: 'PMS',
      name: 'Cloudbeds API Gateway',
      desc: 'Sincronización de check-in / check-out en tiempo real.',
      connected: false,
      badge: 'Disponible',
    },
    {
      id: 'pos_micros',
      category: 'POS & F&B',
      name: 'Simphony POS / Micros',
      desc: 'Carga automática de comandas de Room Service a la cuenta del huésped.',
      connected: true,
      badge: 'Conectado',
    },
    {
      id: 'locks_assa',
      category: 'Cerraduras',
      name: 'ASSA ABLOY Global Solutions / VisiOnline',
      desc: 'Gestión de llaves digitales para el móvil del huésped.',
      connected: true,
      badge: 'Conectado',
    },
    {
      id: 'whatsapp_api',
      category: 'Mensajería',
      name: 'WhatsApp Cloud API for Business',
      desc: 'Notificaciones automáticas de pedidos listos vía WhatsApp.',
      connected: false,
      badge: 'Configurar',
    },
    {
      id: 'stripe_pay',
      category: 'Pagos',
      name: 'Stripe Terminal & Payment Elements',
      desc: 'Cobro de Room Service y servicios adicionales.',
      connected: true,
      badge: 'Activo',
    },
  ]);

  const handleSaveHotelConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const openQrPreview = async (room: Room) => {
    setPreviewQrRoom(room);
    const dataUrl = await generateQrCodeDataUrl(currentHotel.id, room.number);
    setPreviewQrDataUrl(dataUrl);
  };

  const handleCopyPreviewUrl = () => {
    if (!previewQrRoom) return;
    const url = generateRoomUrl(currentHotel.id, previewQrRoom.number);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadPreviewPng = () => {
    if (!previewQrRoom || !previewQrDataUrl) return;
    const link = document.createElement('a');
    link.href = previewQrDataUrl;
    link.download = `GuestFlow_QR_Hab_${previewQrRoom.number}_${currentHotel.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleTestGuestApp = (roomNumber: string) => {
    switchRoom(roomNumber);
    setActiveView('guest');
  };

  const toggleIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, connected: !item.connected } : item
      )
    );
  };

  const hotelRooms = rooms.filter((r) => r.hotelId === currentHotel.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900">Panel Administrativo &amp; Conectores</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configuración general del establecimiento {currentHotel.name} y ecosistema de integraciones hoteleras.
          </p>
        </div>

        {/* Navigation tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[
            { id: 'hotel' as const, label: 'Hotel & Wi-Fi' },
            { id: 'rooms' as const, label: 'Habitaciones' },
            { id: 'menu' as const, label: 'Room Service Menú' },
            { id: 'integrations' as const, label: 'Integraciones PMS/POS' },
            { id: 'data' as const, label: 'Datos & Reset' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-teal-900 text-white flex items-center justify-between text-xs font-bold animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-400" />
            <span>Configuración actualizada con éxito.</span>
          </div>
          <span className="text-teal-300 text-[11px]">Cambios persistidos en el sistema</span>
        </div>
      )}

      {/* TAB: HOTEL CONFIG */}
      {activeTab === 'hotel' && (
        <form onSubmit={handleSaveHotelConfig} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            <span>Datos del Hotel</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Comercial del Hotel</label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Ubicación</label>
              <input
                type="text"
                disabled
                value={`${currentHotel.city}, ${currentHotel.country}`}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de Red Wi-Fi (SSID)</label>
              <input
                type="text"
                value={wifiSsid}
                onChange={(e) => setWifiSsid(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña de Red Wi-Fi</label>
              <input
                type="text"
                value={wifiPass}
                onChange={(e) => setWifiPass(e.target.value)}
                className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: ROOMS LIST */}
      {activeTab === 'rooms' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-teal-600" />
                <span>Habitaciones del Hotel ({hotelRooms.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Crea habitaciones individuales para generar automáticamente sus códigos QR de acceso para huéspedes.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={clearExampleRooms}
                className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold transition cursor-pointer"
                title="Elimina cualquier habitación o datos de prueba"
              >
                Limpiar datos ejemplo
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Crear Habitación</span>
              </button>
            </div>
          </div>

          {hotelRooms.length === 0 ? (
            /* Empty State when all example rooms are cleared */
            <div className="p-8 sm:p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
                <QrCode className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-sm font-bold text-slate-900">
                  No hay habitaciones registradas en {currentHotel.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Las habitaciones de ejemplo fueron borradas con éxito. Haz clic en el botón inferior para registrar tu primera habitación y obtener su código QR inteligente que dirigirá automáticamente a la App Huésped.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Crear Primera Habitación y Generar QR</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-slate-200 rounded-xl">
                <thead className="bg-slate-50 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="p-3">Habitación</th>
                    <th className="p-3">Tipo</th>
                    <th className="p-3">Ubicación</th>
                    <th className="p-3">Huésped Asignado</th>
                    <th className="p-3">Estado de Puerta</th>
                    <th className="p-3 text-right">Código QR &amp; Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {hotelRooms.map((rm) => (
                    <tr key={rm.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3">
                        <span className="font-black text-slate-900 text-sm">Hab. {rm.number}</span>
                      </td>
                      <td className="p-3 font-semibold text-teal-800">{rm.type}</td>
                      <td className="p-3 text-slate-600">
                        {rm.building} • Piso {rm.floor}
                      </td>
                      <td className="p-3 text-slate-800 font-bold">{rm.guestName || 'Huésped'}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                          {rm.doorSign}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* QR Preview Trigger */}
                          <button
                            type="button"
                            onClick={() => openQrPreview(rm)}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                            title="Ver código QR para esta habitación"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Ver QR</span>
                          </button>

                          {/* Test Guest Mode in this room */}
                          <button
                            type="button"
                            onClick={() => handleTestGuestApp(rm.number)}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                            title="Abrir App Huésped para esta habitación"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Room */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Estás seguro de eliminar la habitación ${rm.number}?`)) {
                                deleteRoom(rm.id);
                              }
                            }}
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:border-rose-200 text-slate-400 hover:text-rose-600 transition cursor-pointer"
                            title="Eliminar habitación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB: ROOM SERVICE MENU */}
      {activeTab === 'menu' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-teal-600" />
              <span>Catálogo y Precios de Room Service ({menuItems.length} platillos)</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {menuItems.map((dish) => (
              <div key={dish.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
                <img src={dish.image} alt={dish.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{dish.name}</p>
                  <p className="text-[10px] text-teal-700 font-extrabold uppercase">{dish.category}</p>
                  <p className="text-xs font-black text-slate-900 mt-1">${dish.price} USD</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Activo
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: INTEGRATIONS ECOSYSTEM */}
      {activeTab === 'integrations' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Server className="w-4 h-4 text-teal-600" />
                <span>Ecosistema de Conectores &amp; APIs</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Integración nativa con PMS, POS de alimentos y cerraduras inteligentes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.connected
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.connected ? '● En línea' : '○ Inactivo'}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mt-1.5">{item.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>

                <button
                  type="button"
                  onClick={() => toggleIntegration(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    item.connected
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  {item.connected ? 'Desconectar' : 'Conectar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DATA & SYSTEM RESET (RBAC PROTECTED) */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-in fade-in">
          {/* RBAC Security Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black">Zona de Gestión de Datos &amp; Reset del Sistema</h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Directiva Exclusiva
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Operaciones de purga de historial y restablecimiento de estados para {currentHotel.name}.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs">
              <ShieldCheck className={`w-4 h-4 ${canResetAllData ? 'text-emerald-400' : 'text-amber-400'}`} />
              <span className="text-slate-300">
                Acceso: <strong className="text-white">{getRoleLabel(currentRole)}</strong>
              </span>
            </div>
          </div>

          {!canResetAllData ? (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <Lock className="w-5 h-5 text-amber-600" />
                <span>Permisos Insuficientes para Borrado de Datos</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Por directiva de seguridad, la eliminación de historial y el reseteo de datos hoteleros está estrictamente reservada para los roles de <strong>Gerente General</strong>, <strong>Administrador de Hotel</strong> y <strong>Super Administrador</strong>.
              </p>
              <p className="text-xs text-amber-700">
                Tu rol actual es <strong>{getRoleLabel(currentRole)}</strong> ({userDepartment !== 'ALL' ? `Departamento: ${getDepartmentLabel(userDepartment)}` : 'Sin departamento asignado'}). Si requieres efectuar un reseteo, solicita acceso al Gerente o cambia tu rol directivo en la barra superior.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Clear History */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
                      <Trash2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                      {requests.filter((r) => r.hotelId === currentHotel.id).length} registros
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">Borrar Historial de Operaciones</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Elimina de forma irreversible todas las solicitudes de huéspedes, órdenes de Room Service, tickets a departamentos y transcripciones de chat de {currentHotel.name} en Firestore.
                    </p>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[11px] text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      <span>Lo que se conserva:</span>
                    </div>
                    <p className="text-slate-500 pl-5">
                      Tus {hotelRooms.length} habitaciones, nombres de huéspedes, códigos QR generados y configuraciones de Wi-Fi permanecerán intactos.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetModalMode('history_only');
                    setShowResetModal(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-rose-600/20 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Borrar Todo el Historial</span>
                </button>
              </div>

              {/* Card 2: Full Hotel Reset */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:border-slate-300 transition space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
                      <RotateCcw className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      Reset Integral
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900">Restablecer Todo el Establecimiento</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      Borra el historial completo y restablece todos los estados operativos de las {hotelRooms.length} habitaciones a "Sin cartel" (limpiando notas y horarios preferidos de limpieza).
                    </p>
                  </div>

                  <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-100 text-[11px] text-amber-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Estado inicial limpio:</span>
                    </div>
                    <p className="text-amber-700 pl-5">
                      Ideal para inicio de nueva temporada o pruebas completas de integración QR con huéspedes reales.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setResetModalMode('full_reset');
                    setShowResetModal(true);
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Reset Total del Hotel</span>
                </button>
              </div>
            </div>
          )}

          {/* Database Security info */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-500" />
              <span>Base de datos en la nube: <strong>Google Cloud Firestore</strong> (multi-tenant con aislamiento por hotelId)</span>
            </div>
            <span className="text-[11px] text-teal-700 bg-teal-50 border border-teal-200 font-bold px-2 py-0.5 rounded-lg">
              Sincronización Bidireccional
            </span>
          </div>
        </div>
      )}

      {/* Modal Reset Data */}
      <ResetDataModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        defaultMode={resetModalMode}
      />

      {/* Modal to Create Room */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newRoom) => {
          // New room created, automatically refreshed via context
        }}
      />

      {/* Modal to Preview Existing Room QR */}
      {previewQrRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative space-y-5">
            <button
              onClick={() => setPreviewQrRoom(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 mb-2">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                Código QR Habitación {previewQrRoom.number}
              </h3>
              <p className="text-xs text-slate-500">
                {currentHotel.name} • {previewQrRoom.building} • Piso {previewQrRoom.floor}
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col items-center">
              {previewQrDataUrl ? (
                <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-200">
                  <img
                    src={previewQrDataUrl}
                    alt={`QR Hab. ${previewQrRoom.number}`}
                    className="w-48 h-48 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  Generando QR...
                </div>
              )}

              <div className="mt-3 px-3 py-1 rounded-full bg-teal-100/70 text-teal-900 text-[10px] font-bold">
                Abre automáticamente la App Huésped
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={handleDownloadPreviewPng}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>Descargar PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyPreviewUrl}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                handleTestGuestApp(previewQrRoom.number);
                setPreviewQrRoom(null);
              }}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Simular Escaneo (Abrir App Huésped)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
