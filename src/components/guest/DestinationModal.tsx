import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { X, Star, MapPin, Compass, Sparkles, Navigation, Send, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DestinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (code: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, currentHotel, destinationItems, createRequest, currentRoom } = useGuestFlow();
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [bookingSuccessItem, setBookingSuccessItem] = useState<string | null>(null);

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

  const categories = ['Todos', 'Atracciones', 'Restaurante', 'Tours', 'Centros comerciales'];

  const filtered = destinationItems.filter((d) => {
    if (selectedFilter === 'Todos') return true;
    return d.category === selectedFilter;
  });

  const handleRequestConcierge = (itemTitle: string) => {
    const roomNum = currentRoom?.number || 'Sin asignar';
    const req = createRequest({
      category: 'Concierge & Destino',
      subCategory: 'Reserva / Transporte',
      title: `Concierge: Asistencia para ${itemTitle}`,
      description: `El huésped en Hab. ${roomNum} solicita información, traslados o reservaciones para "${itemTitle}".`,
      department: 'RECEPCION',
      priority: 'MEDIA',
    });

    setBookingSuccessItem(itemTitle);
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }

    if (onSuccess) {
      onSuccess(req.code);
    }

    setTimeout(() => {
      setBookingSuccessItem(null);
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
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
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
              📍
            </div>
            <div>
              <h3 className="text-lg font-bold">{t.destinationTitle}</h3>
              <p className="text-xs text-teal-200/80">
                Guía curada por el Concierge de {currentHotel.name}
              </p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1 rounded-full font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedFilter === cat
                    ? 'bg-teal-400 text-slate-950'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Destination List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase">
                    {item.category}
                  </div>
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-amber-600 font-extrabold text-xs flex items-center gap-1 shadow-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-teal-300 text-[10px] font-medium flex items-center gap-1">
                    <Navigation className="w-3 h-3 text-teal-400" />
                    <span>{item.distance}</span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.description}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-teal-50/70 border border-teal-100/80 text-[11px] text-teal-900 leading-normal flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>{t.tips}:</strong> {item.tips}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    {bookingSuccessItem === item.title ? (
                      <span className="text-xs font-bold text-teal-700 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        ¡Solicitud enviada a Concierge!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRequestConcierge(item.title)}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-teal-600 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Pedir reserva / taxi a Concierge</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer Bar */}
        <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between px-6 shrink-0 shadow-sm">
          <p className="text-xs text-slate-500">
            ¿Necesitas transporte privado? Solicítalo en 1 clic.
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
              onClick={() => handleRequestConcierge('Taxi o Traslado General')}
              className="py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Pedir Taxi / Tour</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
