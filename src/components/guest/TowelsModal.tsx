import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { X, Check, Sparkles, Plus, Minus } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TowelsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const TowelsModal: React.FC<TowelsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, createRequest, currentRoom } = useGuestFlow();

  const [towelTypes, setTowelTypes] = useState({
    bath: 2,
    hand: 1,
    face: 0,
    pool: 0,
    other: 0,
  });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateCount = (key: keyof typeof towelTypes, delta: number) => {
    setTowelTypes((prev) => ({
      ...prev,
      [key]: Math.max(0, prev[key] + delta),
    }));
  };

  const totalTowels = Object.values(towelTypes).reduce((a, b) => a + b, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    // If guest clicked submit with 0 selected, default gracefully to 2 bath towels
    const finalBath = totalTowels === 0 ? 2 : towelTypes.bath;
    const effectiveTotal = totalTowels === 0 ? 2 : totalTowels;

    const itemsSummary = [
      finalBath > 0 ? `${finalBath}x ${t.bathTowels}` : '',
      towelTypes.hand > 0 ? `${towelTypes.hand}x ${t.handTowels}` : '',
      towelTypes.face > 0 ? `${towelTypes.face}x ${t.faceTowels}` : '',
      towelTypes.pool > 0 ? `${towelTypes.pool}x ${t.poolTowels}` : '',
      towelTypes.other > 0 ? `${towelTypes.other}x ${t.other}` : '',
    ]
      .filter(Boolean)
      .join(', ');

    const newReq = createRequest({
      category: 'Toallas',
      subCategory: 'Toallas de baño & piscina',
      title: `Solicitud de ${effectiveTotal} Toallas (${itemsSummary})`,
      description: `Pedido de toallas: ${itemsSummary}. ${comments ? `Comentarios del huésped: ${comments}` : ''}`,
      department: 'HOUSEKEEPING',
      priority: 'MEDIA',
    });

    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch {
      // ignore
    }

    setIsSubmitting(false);
    onSuccess(newReq.code);
    onClose();
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
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-teal-950 text-white shrink-0">
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
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-2xl shrink-0">
              🧺
            </div>
            <div>
              <h3 className="text-xl font-bold font-sans">{t.towelsTitle}</h3>
              <p className="text-xs text-teal-200/80">
                {t.towelsSubtitle} • Hab. {currentRoom?.number || 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body with Scrolling */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 flex-wrap pb-1">
            <span className="text-[11px] font-bold text-slate-500 mr-1">Rápido:</span>
            <button
              type="button"
              onClick={() => setTowelTypes({ bath: 2, hand: 1, face: 0, pool: 0, other: 0 })}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 font-bold hover:bg-teal-100 transition cursor-pointer"
            >
              2 Baño + 1 Mano
            </button>
            <button
              type="button"
              onClick={() => setTowelTypes({ bath: 0, hand: 0, face: 0, pool: 2, other: 0 })}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-800 font-bold hover:bg-cyan-100 transition cursor-pointer"
            >
              2 de Alberca
            </button>
            <button
              type="button"
              onClick={() => setTowelTypes({ bath: 4, hand: 2, face: 2, pool: 0, other: 0 })}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold hover:bg-slate-200 transition cursor-pointer"
            >
              Set Completo
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { key: 'bath' as const, label: t.bathTowels, desc: 'Felpa egipcia 700g de alta absorción' },
              { key: 'hand' as const, label: t.handTowels, desc: 'Para tocador' },
              { key: 'face' as const, label: t.faceTowels, desc: 'Algodón suave para rostro' },
              { key: 'pool' as const, label: t.poolTowels, desc: 'Toalla grande para alberca o playa' },
              { key: 'other' as const, label: t.other, desc: 'Tapete de baño o toalla adicional' },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition"
              >
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.label}</p>
                  <p className="text-[11px] text-slate-400">{item.desc}</p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => updateCount(item.key, -1)}
                    disabled={towelTypes[item.key] === 0}
                    className="w-8 h-8 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition flex items-center justify-center cursor-pointer"
                    aria-label={`Quitar ${item.label}`}
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-extrabold text-slate-900">
                    {towelTypes[item.key]}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(item.key, 1)}
                    className="w-8 h-8 rounded-xl border border-teal-300 bg-teal-50 text-teal-800 font-bold hover:bg-teal-100 transition flex items-center justify-center cursor-pointer"
                    aria-label={`Agregar ${item.label}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Additional comments */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.additionalComments}
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Ej: Entregar antes de las 18:00 o dejar sobre la cama..."
              rows={2}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Department Auto-Derivation Notice */}
          <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-100 flex items-center gap-2 text-[11px] text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>{t.autoRoutedNotice}:</strong> {t.routedTo} <strong>Housekeeping</strong>
            </span>
          </div>

          {/* Action Buttons: Close + Submit Service Request */}
          <div className="flex items-center gap-3 pt-2 border-t border-slate-100 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer flex items-center justify-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Cerrar</span>
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>
                {totalTowels > 0
                  ? `Pedir Toallas (${totalTowels})`
                  : 'Pedir 2 Toallas de Baño'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
