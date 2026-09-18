import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { RequestPriority } from '../../types';
import { X, Check, Camera, Upload, AlertTriangle, Sparkles, Image as ImageIcon } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const ReportProblemModal: React.FC<ReportProblemModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, createRequest, currentRoom } = useGuestFlow();

  const [selectedCategory, setSelectedCategory] = useState<string>('Aire acondicionado');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('ALTA');
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const categories = [
    { id: 'Aire acondicionado', label: t.airConditioning, icon: '❄️' },
    { id: 'Baño', label: t.bathroom, icon: '🚿' },
    { id: 'Agua', label: t.water, icon: '🚰' },
    { id: 'Electricidad', label: t.electricity, icon: '💡' },
    { id: 'Wi-Fi', label: t.wifi, icon: '📶' },
    { id: 'TV', label: t.tv, icon: '📺' },
    { id: 'Puerta', label: t.door, icon: '🔑' },
    { id: 'Cama', label: t.bed, icon: '🛏️' },
    { id: 'Ruido', label: t.noise, icon: '🔊' },
    { id: 'Limpieza', label: t.cleaning, icon: '🧹' },
    { id: 'Otro', label: t.other, icon: '❓' },
  ];

  const sampleIncidentPhotos = [
    { label: 'Goteo de clima', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
    { label: 'Fuga de agua', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80' },
    { label: 'Cerradura / Puerta', url: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=400&q=80' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const isHousekeeping = selectedCategory === 'Limpieza' || selectedCategory === 'Cama';
    const targetDept = isHousekeeping ? 'HOUSEKEEPING' : 'MANTENIMIENTO';

    const finalDescription = description.trim() || `Revisión técnica urgente de ${selectedCategory} en habitación.`;
    const roomNumber = currentRoom?.number || 'Sin asignar';
    const newReq = createRequest({
      category: selectedCategory,
      subCategory: 'Incidencia de habitación',
      title: `${selectedCategory}: ${finalDescription.slice(0, 45)}${finalDescription.length > 45 ? '...' : ''}`,
      description: `Incidencia reportada en Hab. ${roomNumber} (${selectedCategory}): ${finalDescription}`,
      department: targetDept,
      priority,
      photoUrl: photoUrl || undefined,
    });

    try {
      confetti({ particleCount: 30, spread: 50 });
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
        className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 bg-gradient-to-r from-slate-900 to-rose-950 text-white shrink-0">
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
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-2xl shrink-0">
              🛠️
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.reportProblemTitle}</h3>
              <p className="text-xs text-rose-200/80">
                Ticket de Mantenimiento Express • Hab. {currentRoom?.number || 'Sin asignar'}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t.isThereAProblem}
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    selectedCategory === cat.id
                      ? 'bg-rose-50 border-rose-500 text-rose-900 font-bold ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="text-[11px] truncate w-full">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Descripción detallada del inconveniente *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.describeIssuePlaceholder}
              className="w-full text-xs rounded-xl border border-slate-200 p-3 focus:outline-hidden focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none text-slate-800"
            />
          </div>

          {/* Urgency Priority */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Nivel de urgencia</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'MEDIA' as const, label: 'Normal / Moderada', color: 'bg-slate-100 text-slate-700' },
                { id: 'ALTA' as const, label: 'Alta (Atender hoy)', color: 'bg-amber-100 text-amber-800 font-bold' },
                { id: 'URGENTE' as const, label: 'Urgente (Inmediato)', color: 'bg-rose-600 text-white font-extrabold' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-2 px-2 text-xs rounded-xl border transition ${
                    priority === p.id
                      ? `${p.color} border-current shadow-xs ring-2 ring-rose-500/20`
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Photo / Video evidence upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {t.attachPhotoOrVideo}
            </label>

            {photoUrl ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-40 bg-slate-100">
                <img src={photoUrl} alt="Evidencia de problema" className="w-full h-36 object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="border-2 border-dashed border-slate-200 hover:border-rose-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-rose-50/40 transition">
                  <Camera className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-xs font-bold text-slate-700">Subir foto o video desde cámara</span>
                  <span className="text-[10px] text-slate-400">JPG, PNG o MP4 hasta 25MB</span>
                  <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Quick samples for instant 1-click test */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[10px] font-semibold text-slate-400">O usar muestra de prueba:</span>
                  {sampleIncidentPhotos.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhotoUrl(sample.url)}
                      className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium"
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Automatic triage notice */}
          <div className="p-3 bg-teal-50/80 rounded-xl border border-teal-100 flex items-center gap-2 text-[11px] text-teal-800">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              <strong>{t.autoRoutedNotice}:</strong> Derivado automáticamente a{' '}
              <strong>{selectedCategory === 'Limpieza' ? 'Housekeeping' : 'Mantenimiento'}</strong>
            </span>
          </div>

          {/* Buttons: Close + Submit */}
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
              className="flex-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white shadow-md shadow-rose-600/20 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.submitReport || 'Enviar Reporte & Pedir Servicio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
