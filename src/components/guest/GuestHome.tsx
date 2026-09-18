import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestFlowLogo } from '../GuestFlowLogo';
import { TowelsModal } from './TowelsModal';
import { DoorSignModal } from './DoorSignModal';
import { RoomServiceModal } from './RoomServiceModal';
import { ReportProblemModal } from './ReportProblemModal';
import { ContactReceptionModal } from './ContactReceptionModal';
import { HotelDirectoryModal } from './HotelDirectoryModal';
import { DestinationModal } from './DestinationModal';
import { GuestRequestsTracker } from './GuestRequestsTracker';
import {
  Sparkles,
  Search,
  CheckCircle2,
  Coffee,
  Briefcase,
  HelpCircle,
  Package,
  Layers,
  MapPin,
  ArrowRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const GuestHome: React.FC = () => {
  const {
    t,
    currentHotel,
    currentRoom,
    createRequest,
    autoTriageRequest,
    setActiveView
  } = useGuestFlow();

  // Modals state
  const [activeModal, setActiveModal] = useState<
    'towels' | 'doorSign' | 'roomService' | 'reportProblem' | 'reception' | 'directory' | 'destination' | 'amenities' | 'breakfast' | 'luggage' | 'help' | null
  >(null);

  // Success feedback toast
  const [successToast, setSuccessToast] = useState<{ message: string; code?: string } | null>(null);

  // Global Escape key listener for active modal
  useEffect(() => {
    if (!activeModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveModal(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  // Smart natural language search
  const [expressQuery, setExpressQuery] = useState('');
  const [triagePreview, setTriagePreview] = useState<{ department: string; category: string; priority: string } | null>(null);

  const handleQueryChange = (val: string) => {
    setExpressQuery(val);
    if (val.trim().length > 3) {
      setTriagePreview(autoTriageRequest(val));
    } else {
      setTriagePreview(null);
    }
  };

  const handleSmartSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expressQuery.trim()) return;

    const triage = autoTriageRequest(expressQuery);
    const newReq = createRequest({
      category: triage.category,
      title: expressQuery.slice(0, 45),
      description: expressQuery,
      department: triage.department,
      priority: triage.priority,
    });

    try {
      confetti({ particleCount: 30, spread: 60 });
    } catch {
      // ignore
    }

    setExpressQuery('');
    setTriagePreview(null);
    setSuccessToast({
      message: `${t.requestCreatedSuccess} (${newReq.department})`,
      code: newReq.code,
    });
  };

  const handleQuickAmenity = (name: string) => {
    const roomNum = currentRoom?.number || 'Sin asignar';
    const req = createRequest({
      category: 'Amenities',
      subCategory: name,
      title: `Reposición de ${name}`,
      description: `El huésped solicita reposición de ${name} en Habitación ${roomNum}.`,
      department: 'HOUSEKEEPING',
      priority: 'MEDIA',
    });
    setSuccessToast({
      message: `Solicitud de ${name} enviada a Housekeeping`,
      code: req.code,
    });
    setActiveModal(null);
  };

  const handleQuickLuggage = () => {
    const roomNum = currentRoom?.number || 'Sin asignar';
    const req = createRequest({
      category: 'Equipaje',
      title: 'Asistencia con equipaje / Bellboy',
      description: `El huésped de la habitación ${roomNum} solicita asistencia de botones para traslado de maletas.`,
      department: 'RECEPCION',
      priority: 'ALTA',
    });
    setSuccessToast({
      message: `Servicio de Bellboy solicitado con éxito`,
      code: req.code,
    });
    setActiveModal(null);
  };

  const handleQuickBreakfast = () => {
    setActiveModal('roomService');
  };

  const serviceButtons = [
    {
      id: 'cleaning',
      title: t.cleaning,
      icon: '🧹',
      desc: 'Cartel de puerta y solicitud de aseo',
      action: () => setActiveModal('doorSign'),
      color: 'hover:border-teal-500 hover:bg-teal-50/40',
      badge: currentRoom?.doorSign && currentRoom.doorSign !== 'NORMAL' ? currentRoom.doorSign.replace('_', ' ') : undefined,
    },
    {
      id: 'towels',
      title: t.towels,
      icon: '🧺',
      desc: 'Baño, mano, alberca y faciales',
      action: () => setActiveModal('towels'),
      color: 'hover:border-cyan-500 hover:bg-cyan-50/40',
    },
    {
      id: 'roomService',
      title: t.roomService,
      icon: '🍽️',
      desc: 'Menú gourmet, snacks y bebidas',
      action: () => setActiveModal('roomService'),
      color: 'hover:border-amber-500 hover:bg-amber-50/40',
      tag: 'Gourmet 24h',
    },
    {
      id: 'reception',
      title: t.contactReception,
      icon: '🛎️',
      desc: 'Mensaje directo, llamada o asistencia',
      action: () => setActiveModal('reception'),
      color: 'hover:border-emerald-500 hover:bg-emerald-50/40',
      tag: 'Online 24/7',
    },
    {
      id: 'reportProblem',
      title: t.reportProblem,
      icon: '🛠️',
      desc: 'Aire acondicionado, agua, TV, wifi',
      action: () => setActiveModal('reportProblem'),
      color: 'hover:border-rose-500 hover:bg-rose-50/40',
    },
    {
      id: 'amenities',
      title: t.amenities,
      icon: '🧴',
      desc: 'Shampoo, kit dental, jabón, batas',
      action: () => setActiveModal('amenities'),
      color: 'hover:border-purple-500 hover:bg-purple-50/40',
    },
    {
      id: 'breakfast',
      title: t.breakfast,
      icon: '☕',
      desc: 'Desayuno a la cama y horarios buffet',
      action: () => handleQuickBreakfast(),
      color: 'hover:border-orange-500 hover:bg-orange-50/40',
    },
    {
      id: 'luggage',
      title: t.luggage,
      icon: '🧳',
      desc: 'Servicio de botones y consigna',
      action: () => setActiveModal('luggage'),
      color: 'hover:border-blue-500 hover:bg-blue-50/40',
    },
    {
      id: 'hotelServices',
      title: t.hotelServices,
      icon: '🏨',
      desc: 'Piscina, Spa, Gym y Wi-Fi',
      action: () => setActiveModal('directory'),
      color: 'hover:border-indigo-500 hover:bg-indigo-50/40',
    },
    {
      id: 'discoverDestination',
      title: t.discoverDestination,
      icon: '📍',
      desc: 'Playas, restaurantes y tours recomendados',
      action: () => setActiveModal('destination'),
      color: 'hover:border-teal-500 hover:bg-teal-50/40',
    },
    {
      id: 'helpFaq',
      title: t.helpFaq,
      icon: '❓',
      desc: 'Preguntas frecuentes e información útil',
      action: () => setActiveModal('help'),
      color: 'hover:border-slate-500 hover:bg-slate-50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
      {/* Hotel & GuestFlow Branding Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* GuestFlow Official Logo */}
          <GuestFlowLogo variant="stacked" size="lg" showTagline={true} />

          {/* Hotel Name & Room Identification */}
          <div className="mt-5 pt-4 border-t border-slate-100 w-full flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-extrabold text-slate-900">{currentHotel.name}</span>
            </div>

            {/* Room pill: Automatic identification */}
            {currentRoom ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-teal-900 font-bold text-xs shadow-xs">
                <span>{t.building}: {currentRoom.building}</span>
                <span>•</span>
                <span>{t.floor} {currentRoom.floor}</span>
                <span>•</span>
                <span className="bg-teal-600 text-white px-2 py-0.5 rounded-full">
                  Hab. {currentRoom.number}
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                <span>Habitación no vinculada</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* No Room Linked Guidance Alert */}
      {!currentRoom && (
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-sm">
              ℹ️
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">
                Bienvenido a la App Huésped de {currentHotel.name}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Esta aplicación web se vincula automáticamente a cada habitación mediante su <strong>código QR inteligente</strong>. Escanea el atril de tu habitación para hacer pedidos de toallas, room service o solicitar asistencia.
              </p>
              <p className="text-[11px] text-slate-500">
                ¿Eres personal o administrador del hotel? Accede al Dashboard para crear habitaciones y generar sus códigos QR.
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              Ir al Dashboard del Hotel a Crear Habitación
            </button>
          </div>
        </div>
      )}

      {/* Success Notification Alert */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-teal-900 text-white shadow-lg border border-teal-400/30 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
            <div>
              <p className="text-xs font-bold">{successToast.message}</p>
              {successToast.code && (
                <p className="text-[11px] text-teal-200">
                  {t.requestNumber}: <span className="font-mono font-bold text-white">{successToast.code}</span>
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
            className="text-xs text-teal-300 hover:text-white px-2 py-1 rounded"
          >
            Entendido
          </button>
        </div>
      )}

      {/* Smart Express Assistant / Natural Language Triage Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-4 sm:p-5">
        <form onSubmit={handleSmartSubmit} className="space-y-2">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>{t.smartAssistant}</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={expressQuery}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder={t.smartAssistantPlaceholder}
              className="w-full text-xs sm:text-sm rounded-2xl border border-slate-200 py-3 pl-4 pr-24 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!expressQuery.trim()}
              className="absolute right-2 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-30 text-white font-bold text-xs transition shadow-sm"
            >
              Pedir
            </button>
          </div>

          {/* Real-time triage prediction preview */}
          {triagePreview && (
            <div className="p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 text-[11px] text-teal-900 flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  {t.routedTo}: <strong>{triagePreview.department}</strong> ({triagePreview.category})
                </span>
              </span>
              <span className="text-[10px] font-bold uppercase text-teal-700">
                Prioridad: {triagePreview.priority}
              </span>
            </div>
          )}
        </form>
      </div>

      {/* Section Title: ¿En qué podemos ayudarte? */}
      <div className="text-center py-2">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {t.howCanWeHelp}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Selecciona lo que necesitas. GuestFlow identificará tu habitación y derivará tu solicitud al área indicada.
        </p>
      </div>

      {/* Large Grid of Main Service Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
        {serviceButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={btn.action}
            className={`p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition text-left flex flex-col justify-between group relative overflow-hidden cursor-pointer ${btn.color}`}
          >
            <div className="flex items-start justify-between w-full mb-3">
              <span className="text-3xl sm:text-4xl transition-transform group-hover:scale-110">
                {btn.icon}
              </span>
              {btn.tag && (
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {btn.tag}
                </span>
              )}
              {btn.badge && (
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {btn.badge}
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                {btn.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                {btn.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Active Requests Tracker & Survey */}
      <GuestRequestsTracker />

      {/* Modals for each guest capability */}
      <TowelsModal
        isOpen={activeModal === 'towels'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: 'Solicitud de toallas registrada con éxito', code })
        }
      />

      <DoorSignModal
        isOpen={activeModal === 'doorSign'}
        onClose={() => setActiveModal(null)}
        onSuccess={(st) =>
          setSuccessToast({ message: `Cartel de puerta actualizado a: ${st}` })
        }
      />

      <RoomServiceModal
        isOpen={activeModal === 'roomService'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: '¡Pedido de Room Service enviado a cocina!', code })
        }
      />

      <ReportProblemModal
        isOpen={activeModal === 'reportProblem'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: 'Ticket de mantenimiento registrado y asignado', code })
        }
      />

      <ContactReceptionModal
        isOpen={activeModal === 'reception'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: 'Mensaje transmitido a recepción', code })
        }
      />

      <HotelDirectoryModal
        isOpen={activeModal === 'directory'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: 'Solicitud enviada a recepción desde el directorio', code })
        }
      />

      <DestinationModal
        isOpen={activeModal === 'destination'}
        onClose={() => setActiveModal(null)}
        onSuccess={(code) =>
          setSuccessToast({ message: 'Solicitud enviada a Concierge con éxito', code })
        }
      />

      {/* Quick Amenities Modal */}
      {activeModal === 'amenities' && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 cursor-default"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">🧴 Reposición de Amenities</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Selecciona los artículos que necesitas reponer en tu habitación:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { name: 'Kit Dental (Cepillo & Pasta)', icon: '🪥' },
                { name: 'Shampoo & Acondicionador Orgánico', icon: '🧴' },
                { name: 'Jabón Artesanal', icon: '🧼' },
                { name: 'Kit de Afeitar', icon: '🪒' },
                { name: 'Kit de Costura & Pañuelos', icon: '🪡' },
                { name: 'Pantuflas de Felpa', icon: '🩴' },
                { name: 'Bata de Baño Adicional', icon: '👘' },
                { name: 'Gorra de Baño', icon: '🚿' },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleQuickAmenity(item.name)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50 text-left transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-bold text-slate-800 text-[11px]">{item.name}</span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAmenity('Kit Completo de Amenities de Lujo')}
                className="py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Pedir Kit Completo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Luggage / Bellboy Modal */}
      {activeModal === 'luggage' && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 cursor-default"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">🧳 Asistencia de Equipaje</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              ¿Vas a realizar tu check-out o necesitas ayuda para trasladar tus maletas al lobby o vehículo?
            </p>
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900">
              Un botones asistirá a la <strong>Habitación {currentRoom?.number || 'Sin asignar'}</strong> en aproximadamente 5-10 minutos.
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Cancelar</span>
              </button>
              <button
                type="button"
                onClick={handleQuickLuggage}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 transition cursor-pointer"
              >
                Confirmar Bellboy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & FAQ Modal */}
      {activeModal === 'help' && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveModal(null);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-100 cursor-default"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">❓ Ayuda &amp; Preguntas Frecuentes</h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">¿A qué hora es el Check-out?</p>
                <p className="text-slate-500 mt-0.5">El check-out estándar es a las 12:00 PM. Puedes solicitar late check-out desde la opción "Contactar recepción".</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">¿Cómo me conecto al Wi-Fi?</p>
                <p className="text-slate-500 mt-0.5">Red: <strong>{currentHotel.wifiSsid}</strong> | Clave: <strong>{currentHotel.wifiPass}</strong></p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">¿El Room Service tiene costo de envío?</p>
                <p className="text-slate-500 mt-0.5">No hay cargo adicional por servicio a la habitación. Todos los precios se cargan a tu folio de habitación.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                <span>Cerrar</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveModal('reception');
                }}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-700 flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm"
              >
                <span>Hablar con recepción</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
