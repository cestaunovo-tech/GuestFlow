import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { X, Copy, Check, Clock, MapPin, Phone, Wifi, Bell, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface HotelDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}

export const HotelDirectoryModal: React.FC<HotelDirectoryModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, currentHotel, directoryItems, createRequest, currentRoom } = useGuestFlow();
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [requestedItem, setRequestedItem] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['Todos', 'Restaurante', 'Bar', 'Piscina', 'Spa', 'Gimnasio', 'Wi-Fi', 'Emergencias'];

  const filtered = directoryItems.filter((item) => {
    if (selectedCategory === 'Todos') return true;
    return item.category === selectedCategory;
  });

  const handleCopyWifi = () => {
    navigator.clipboard.writeText(currentHotel.wifiPass);
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleRequestService = (item: typeof directoryItems[0]) => {
    const roomNum = currentRoom?.number || 'Sin asignar';
    const dept = item.category === 'Spa' ? 'SPA' : item.category === 'Restaurante' || item.category === 'Bar' ? 'ALIMENTOS' : 'RECEPCION';
    const req = createRequest({
      category: `Directorio: ${item.title}`,
      subCategory: item.category,
      title: `Consulta de servicio: ${item.title}`,
      description: `El huésped de Hab. ${roomNum} solicita asistencia o reserva para ${item.title} (${item.phoneExtension}).`,
      department: dept as any,
      priority: 'MEDIA',
    });

    setRequestedItem(item.title);
    try {
      confetti({ particleCount: 25, spread: 45 });
    } catch {
      // ignore
    }

    if (onSuccess) {
      onSuccess(req.code);
    }

    setTimeout(() => {
      setRequestedItem(null);
    }, 4000);
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer border border-white/15 shadow-xs"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>
          <div className="flex items-center gap-3 pr-24">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
              🏨
            </div>
            <div>
              <h3 className="text-lg font-bold">{t.directoryTitle}</h3>
              <p className="text-xs text-teal-200/80">
                {currentHotel.name} • Horarios, instalaciones y servicios
              </p>
            </div>
          </div>

          {/* Wi-Fi Quick Card Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Red Wi-Fi: {currentHotel.wifiSsid}</p>
                <p className="text-teal-200/80 text-[11px]">Clave: {currentHotel.wifiPass}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleCopyWifi}
              className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 text-xs shadow-xs cursor-pointer"
            >
              {copiedWifi ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWifi ? t.passwordCopied : t.copyPassword}</span>
            </button>
          </div>

          {/* Categories bar */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60 space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">{item.title}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-slate-100 font-mono text-xs font-bold text-slate-700">
                  {item.phoneExtension}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    {item.hours}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.location}
                  </span>
                </div>

                {requestedItem === item.title ? (
                  <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    ¡Solicitud de servicio enviada!
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRequestService(item)}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Bell className="w-3.5 h-3.5 text-teal-600" />
                    <span>Pedir servicio / reserva</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Footer Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <p className="text-xs text-slate-500">
            ¿Necesitas contactar a recepción? Estamos disponibles 24/7.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const req = createRequest({
                  category: 'Recepción',
                  subCategory: 'Llamada telefónica',
                  title: 'Huésped solicita llamada de recepción',
                  description: 'El huésped solicita comunicarse con la extensión principal de recepción.',
                  department: 'RECEPCION',
                  priority: 'MEDIA',
                });
                if (onSuccess) onSuccess(req.code);
                onClose();
              }}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar a Recepción (Ext. 0)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
