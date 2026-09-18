import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { generateQrCodeDataUrl, generateRoomUrl } from '../../utils/qrUtils';
import { GuestFlowLogo } from '../GuestFlowLogo';
import { Room } from '../../types';
import {
  X,
  BedDouble,
  QrCode,
  Download,
  Copy,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (room: Room) => void;
}

const ROOM_TYPES = [
  'Estándar King',
  'Estándar Doble Queen',
  'Suite Deluxe',
  'Junior Suite',
  'Master Suite con Balcón',
  'Suite Vista al Mar',
  'Presidencial'
];

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  isOpen,
  onClose,
  onCreated
}) => {
  const { currentHotel, createRoom, switchRoom, setActiveView } = useGuestFlow();

  const [number, setNumber] = useState('');
  const [type, setType] = useState('Suite Deluxe');
  const [floor, setFloor] = useState<number>(1);
  const [building, setBuilding] = useState('Torre Principal');
  const [guestName, setGuestName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Result state after creation
  const [createdRoom, setCreatedRoom] = useState<Room | null>(null);
  const [generatedQrUrl, setGeneratedQrUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmed = number.trim();
    if (!trimmed) {
      setErrorMessage('Por favor ingresa el número o identificador de la habitación.');
      return;
    }

    setIsLoading(true);
    try {
      const newRoom = await createRoom({
        number: trimmed,
        type,
        floor: Number(floor) || 1,
        building: building.trim() || 'Principal',
        guestName: guestName.trim() || 'Huésped'
      });

      // Generate QR immediately
      const qrData = await generateQrCodeDataUrl(currentHotel.id, newRoom.number);
      setGeneratedQrUrl(qrData);
      setCreatedRoom(newRoom);

      try {
        confetti({ particleCount: 40, spread: 60 });
      } catch {
        // ignore
      }

      if (onCreated) {
        onCreated(newRoom);
      }
    } catch (err) {
      console.error('Error creating room:', err);
      setErrorMessage('Ocurrió un error al registrar la habitación. Inténtalo nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyUrl = () => {
    if (!createdRoom) return;
    const url = generateRoomUrl(currentHotel.id, createdRoom.number);
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadPng = () => {
    if (!createdRoom || !generatedQrUrl) return;
    const link = document.createElement('a');
    link.href = generatedQrUrl;
    link.download = `GuestFlow_QR_Hab_${createdRoom.number}_${currentHotel.name.replace(/\s+/g, '_')}.png`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleOpenGuestApp = () => {
    if (!createdRoom) return;
    switchRoom(createdRoom.number);
    setActiveView('guest');
    onClose();
  };

  const handleResetForm = () => {
    setCreatedRoom(null);
    setGeneratedQrUrl('');
    setNumber('');
    setGuestName('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {!createdRoom ? (
          /* Form to create room */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                <BedDouble className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Crear Nueva Habitación</h3>
                <p className="text-xs text-slate-500">
                  Registra la habitación en {currentHotel.name} para generar su código QR automático.
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Número de Habitación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 101, 204, Suite 5"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 font-bold text-slate-900 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tipo de Habitación
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Piso / Nivel
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={floor}
                  onChange={(e) => setFloor(Number(e.target.value))}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Edificio / Torre / Zona
                </label>
                <input
                  type="text"
                  placeholder="Ej: Torre Principal, Villas"
                  value={building}
                  onChange={(e) => setBuilding(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Huésped Asignado (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Familia Gómez / Huésped"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-2.5 font-medium text-slate-800 focus:outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <QrCode className="w-4 h-4" />
                <span>{isLoading ? 'Guardando...' : 'Crear Habitación y Generar QR'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Success Screen with Generated QR Code */
          <div className="space-y-6 text-center animate-in fade-in">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-black text-slate-900">
                ¡Habitación {createdRoom.number} Creada con Éxito!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Se ha generado el código QR inteligente para vincular a los huéspedes con la App GuestFlow.
              </p>
            </div>

            {/* QR Card Presentation */}
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 max-w-sm mx-auto shadow-inner flex flex-col items-center">
              <div className="mb-3">
                <GuestFlowLogo variant="horizontal" size="sm" showTagline={false} />
              </div>

              {generatedQrUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/80">
                  <img
                    src={generatedQrUrl}
                    alt={`QR Habitación ${createdRoom.number}`}
                    className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                  />
                </div>
              ) : (
                <div className="w-48 h-48 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 text-xs">
                  Generando QR...
                </div>
              )}

              <div className="mt-4 text-center">
                <p className="text-base font-black text-slate-900">Habitación {createdRoom.number}</p>
                <p className="text-xs text-teal-700 font-semibold">{createdRoom.type}</p>
                <p className="text-[11px] text-slate-500">
                  {createdRoom.building} • Piso {createdRoom.floor}
                </p>
              </div>

              <div className="mt-3 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-[10px] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Dirige automáticamente a la App Huésped</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={handleDownloadPng}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-teal-600" />
                <span>Descargar PNG</span>
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Copy className="w-4 h-4 text-slate-600" />
                <span>{copiedLink ? '¡Copiado!' : 'Copiar Enlace'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-slate-700 flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Imprimir Atril</span>
              </button>
            </div>

            {/* Launch App Huésped */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
              >
                + Crear Otra Habitación
              </button>

              <button
                type="button"
                onClick={handleOpenGuestApp}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Probar App Huésped en Hab. {createdRoom.number}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
