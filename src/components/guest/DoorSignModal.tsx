import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { DoorSignStatus } from '../../types';
import { X, Check, Clock, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DoorSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (status: DoorSignStatus) => void;
}

export const DoorSignModal: React.FC<DoorSignModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, currentRoom, updateDoorSign } = useGuestFlow();

  const [selectedStatus, setSelectedStatus] = useState<DoorSignStatus>(currentRoom?.doorSign || 'NORMAL');
  const [preferredTime, setPreferredTime] = useState<'morning' | 'afternoon' | 'now'>('now');
  const [note, setNote] = useState(currentRoom?.doorSignNote || '');

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

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();

    const timeLabel =
      preferredTime === 'morning'
        ? t.morning
        : preferredTime === 'afternoon'
        ? t.afternoon
        : 'Inmediato';

    updateDoorSign(selectedStatus, note, timeLabel);

    if (selectedStatus === 'LIMPIEZA_AHORA' || selectedStatus === 'LIMPIAR') {
      try {
        confetti({ particleCount: 30, spread: 50 });
      } catch {
        // ignore
      }
    }

    onSuccess(selectedStatus);
    onClose();
  };

  const options: Array<{
    status: DoorSignStatus;
    icon: string;
    label: string;
    desc: string;
    accent: string;
    bgSelected: string;
  }> = [
    {
      status: 'LIMPIEZA_AHORA',
      icon: '✨',
      label: t.requestCleaningNow,
      desc: 'Nuestra camarista asignada acudirá en menos de 15 minutos.',
      accent: 'border-teal-500 text-teal-800',
      bgSelected: 'bg-teal-50/90 border-teal-500 ring-2 ring-teal-500/20',
    },
    {
      status: 'LIMPIAR',
      icon: '🧹',
      label: t.cleanRoom,
      desc: 'Por favor realizar la limpieza regular en el horario habitual.',
      accent: 'border-blue-500 text-blue-800',
      bgSelected: 'bg-blue-50/90 border-blue-500 ring-2 ring-blue-500/20',
    },
    {
      status: 'NO_MOLESTAR',
      icon: '🚫',
      label: t.doNotDisturb,
      desc: 'Privacidad total. El personal no tocará la puerta ni llamará.',
      accent: 'border-rose-500 text-rose-800',
      bgSelected: 'bg-rose-50/90 border-rose-500 ring-2 ring-rose-500/20',
    },
    {
      status: 'PAUSA_LIMPIEZA',
      icon: '⏸️',
      label: t.noCleaningNeeded,
      desc: 'No requiero servicio de limpieza el día de hoy.',
      accent: 'border-amber-500 text-amber-800',
      bgSelected: 'bg-amber-50/90 border-amber-500 ring-2 ring-amber-500/20',
    },
  ];

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
              🚪
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.roomStatusTitle}</h3>
              <p className="text-xs text-teal-200/80">
                Cartel Digital en Tiempo Real • Hab. {currentRoom?.number || 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <form onSubmit={handleApply} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="space-y-2.5">
            {options.map((opt) => {
              const isSelected = selectedStatus === opt.status;
              return (
                <div
                  key={opt.status}
                  onClick={() => setSelectedStatus(opt.status)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-start gap-3.5 ${
                    isSelected
                      ? opt.bgSelected
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <span className="text-2xl mt-0.5">{opt.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preferred time selector if cleaning is chosen */}
          {(selectedStatus === 'LIMPIAR' || selectedStatus === 'LIMPIEZA_AHORA') && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                <span>{t.preferredTime}</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'now' as const, label: 'Ahora' },
                  { key: 'morning' as const, label: '09:00 - 13:00' },
                  { key: 'afternoon' as const, label: '14:00 - 18:00' },
                ].map((timeOpt) => (
                  <button
                    key={timeOpt.key}
                    type="button"
                    onClick={() => setPreferredTime(timeOpt.key)}
                    className={`py-2 px-2 text-xs rounded-xl font-bold border transition cursor-pointer ${
                      preferredTime === timeOpt.key
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {timeOpt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Special note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nota para la camarista (opcional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Salimos a desayunar a las 10:00 / Dejar toallas de playa..."
              className="w-full text-xs rounded-xl border border-slate-200 px-3 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Smart indicator */}
          <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-100 flex items-center gap-2 text-[11px] text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              La gobernanta y el equipo de Housekeeping ven este estado en vivo en su tablet de piso.
            </span>
          </div>

          {/* Action buttons */}
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
              className="flex-2 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Guardar estado en puerta</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
