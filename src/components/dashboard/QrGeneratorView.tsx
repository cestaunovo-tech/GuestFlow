import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestFlowLogo } from '../GuestFlowLogo';
import { generateQrCodeDataUrl, generateRoomUrl } from '../../utils/qrUtils';
import { getDepartmentLabel, getRoleLabel } from '../../utils/rbac';
import { CreateRoomModal } from './CreateRoomModal';
import {
  QrCode,
  Download,
  Printer,
  RefreshCw,
  Sparkles,
  Layers,
  Building,
  BedDouble,
  CheckCircle2,
  Share2,
  Plus,
  ExternalLink,
  Copy,
  Lock,
  ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QrGeneratorView: React.FC = () => {
  const {
    currentHotel,
    rooms,
    switchRoom,
    setActiveView,
    canManageRoomsAndQr,
    currentRole,
    userDepartment
  } = useGuestFlow();

  const hotelRooms = rooms.filter((r) => r.hotelId === currentHotel.id);
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>(
    hotelRooms[0]?.number || ''
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [customWelcomeMsg, setCustomWelcomeMsg] = useState(
    'Escanea con la cámara de tu móvil para solicitar room service, toallas, limpieza o asistencia de recepción sin esperas.'
  );

  // Security Guard: Restrict to Gerencia, Hotel Admin, Super Admin
  if (!canManageRoomsAndQr) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center max-w-lg mx-auto shadow-sm my-12 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Acceso Restringido a Generador de QR</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Solo el <strong>Gerente General</strong>, el <strong>Administrador de Hotel</strong> y el <strong>Super Administrador</strong> tienen permisos para generar códigos QR y dar de alta habitaciones.
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-[11px] text-slate-500">
          Rol actual: <strong>{getRoleLabel(currentRole)}</strong> • Departamento: <strong>{getDepartmentLabel(userDepartment)}</strong>
        </div>
      </div>
    );
  }

  // Sync selected room if list changes
  useEffect(() => {
    if (hotelRooms.length > 0 && (!selectedRoomNumber || !hotelRooms.some((r) => r.number === selectedRoomNumber))) {
      setSelectedRoomNumber(hotelRooms[0].number);
    }
  }, [hotelRooms, selectedRoomNumber]);

  const activeRoom = hotelRooms.find((r) => r.number === selectedRoomNumber) || hotelRooms[0];

  useEffect(() => {
    let isMounted = true;
    if (activeRoom) {
      generateQrCodeDataUrl(currentHotel.id, activeRoom.number).then((url: string) => {
        if (isMounted) setQrDataUrl(url);
      });
    } else {
      setQrDataUrl('');
    }
    return () => {
      isMounted = false;
    };
  }, [currentHotel.id, activeRoom?.number]);

  const handleRegenerate = async () => {
    if (!activeRoom) return;
    setIsRegenerating(true);
    const url = await generateQrCodeDataUrl(currentHotel.id, activeRoom.number);
    setQrDataUrl(url);
    setIsRegenerating(false);
    try {
      confetti({ particleCount: 25, spread: 50 });
    } catch {
      // ignore
    }
  };

  const handleDownloadPng = () => {
    if (!activeRoom || !qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `GuestFlow_QR_Hab_${activeRoom.number}_${currentHotel.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handleCopyDirectLink = () => {
    if (!activeRoom) return;
    const url = generateRoomUrl(currentHotel.id, activeRoom.number);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleTestGuestApp = () => {
    if (!activeRoom) return;
    switchRoom(activeRoom.number);
    setActiveView('guest');
  };

  const handlePrintTentCard = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-600 text-xs font-extrabold uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>Generador de QR Inteligente por Habitación</span>
          </div>
          <h2 className="text-xl font-black text-slate-900">
            Atriles y Códigos QR para Habitaciones
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada código identifica automáticamente el hotel, edificio, piso y habitación sin necesidad de descargas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Crear Habitación</span>
          </button>

          <button
            onClick={handleDownloadPng}
            disabled={!qrDataUrl || !activeRoom}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Descargar PNG</span>
          </button>

          <button
            onClick={handlePrintTentCard}
            disabled={!activeRoom}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-2 transition shadow-2xs disabled:opacity-50 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Atril</span>
          </button>
        </div>
      </div>

      {!activeRoom ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center mx-auto shadow-2xs">
            <QrCode className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-black text-slate-900">
              No hay habitaciones registradas en {currentHotel.name}
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Para generar un código QR y atril de habitación, primero debes crear al menos una habitación en el hotel.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold inline-flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Primera Habitación y Generar QR</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Config Panel: Room Selector & Settings */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  Configuración de Habitación
                </h3>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nueva</span>
                </button>
              </div>

              {/* Room Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Seleccionar Habitación
                </label>
                <select
                  value={selectedRoomNumber}
                  onChange={(e) => {
                    setSelectedRoomNumber(e.target.value);
                    switchRoom(e.target.value);
                  }}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-bold text-slate-800 focus:outline-hidden focus:border-teal-500"
                >
                  {hotelRooms.map((rm) => (
                    <option key={rm.id} value={rm.number}>
                      Habitación {rm.number} (Piso {rm.floor} • {rm.type} • {rm.guestName || 'Huésped'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Hierarchy preview */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-100 text-xs space-y-1.5 text-teal-950">
                <p className="font-bold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-teal-700" />
                  <span>Jerarquía de Enrutamiento SaaS:</span>
                </p>
                <div className="text-[11px] space-y-0.5 pl-5 text-teal-800">
                  <p>• <strong>Hotel:</strong> {currentHotel.name} (ID: {currentHotel.id})</p>
                  <p>• <strong>Edificio / Torre:</strong> {activeRoom.building}</p>
                  <p>• <strong>Piso:</strong> {activeRoom.floor}</p>
                  <p>• <strong>Habitación:</strong> {activeRoom.number} ({activeRoom.type})</p>
                  <p>• <strong>Huésped actual:</strong> {activeRoom.guestName || 'Huésped'}</p>
                </div>
              </div>

              {/* Custom Welcome Message for Tent Card */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Texto de Bienvenida / Call to Action en el atril
                </label>
                <textarea
                  rows={3}
                  value={customWelcomeMsg}
                  onChange={(e) => setCustomWelcomeMsg(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 text-slate-800 resize-none focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={handleCopyDirectLink}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>{copiedLink ? '¡Copiado!' : 'Copiar Link'}</span>
                  </button>

                  <button
                    onClick={handleTestGuestApp}
                    className="py-2.5 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 font-bold text-teal-900 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-teal-700" />
                    <span>Abrir App Huésped</span>
                  </button>
                </div>

                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="w-full py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerar Código QR</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Preview: Real-time Luxury Tent Card / Table Card Mockup */}
          <div className="lg:col-span-7">
            <div className="bg-slate-100 rounded-3xl p-6 border border-slate-200 flex flex-col items-center justify-center min-h-[540px]">
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">
                Vista Previa del Atril de Habitación (Tent Card para impresión)
              </p>

              {/* The Actual Table Card Display (Printable) */}
              <div
                id="printable-tent-card"
                className="bg-white rounded-2xl shadow-xl border border-slate-300 w-full max-w-sm p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden"
              >
                {/* Premium top accent bar */}
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-slate-900 via-teal-600 to-slate-900" />

                {/* GuestFlow Official Logo */}
                <div className="pt-2">
                  <GuestFlowLogo variant="stacked" size="sm" showTagline={true} />
                </div>

                {/* Hotel Name */}
                <div className="mt-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {currentHotel.name}
                  </h4>
                  <div className="mt-1 inline-block px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-black">
                    Habitación {activeRoom.number}
                  </div>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {activeRoom.building} • Piso {activeRoom.floor}
                  </p>
                </div>

                {/* QR Code Container */}
                <div className="my-5 p-3 rounded-2xl bg-white border-2 border-slate-900 shadow-md">
                  {qrDataUrl ? (
                    <img
                      src={qrDataUrl}
                      alt={`QR Habitación ${activeRoom.number}`}
                      className="w-44 h-44 object-contain rounded-lg"
                    />
                  ) : (
                    <div className="w-44 h-44 flex items-center justify-center bg-slate-50 text-slate-400 text-xs">
                      Generando QR...
                    </div>
                  )}
                </div>

                {/* Scan Instruction & Call to Action */}
                <div className="space-y-1.5">
                  <p className="text-xs font-black text-slate-900">
                    ¡Bienvenido/a a tu estancia!
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed max-w-xs">
                    {customWelcomeMsg}
                  </p>
                </div>

                {/* Wi-Fi Credentials on Card */}
                <div className="mt-4 pt-3 border-t border-slate-100 w-full flex items-center justify-between text-[10px] text-slate-500 font-semibold px-2">
                  <span>Wi-Fi: <strong>{currentHotel.wifiSsid}</strong></span>
                  <span>Clave: <strong>{currentHotel.wifiPass}</strong></span>
                </div>

                {/* Subtle platform footnote */}
                <p className="text-[9px] text-slate-400 mt-3 font-mono">
                  No requiere descargar app • Acceso web instantáneo
                </p>
              </div>

              {/* Quick test guest app button below tent card */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleTestGuestApp}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-800 flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-600" />
                  <span>Simular escaneo de este QR en Hab. {activeRoom.number}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating a room */}
      <CreateRoomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={(newRoom) => {
          setSelectedRoomNumber(newRoom.number);
        }}
      />
    </div>
  );
};
