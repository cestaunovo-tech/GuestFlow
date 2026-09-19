import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { getRoleLabel } from '../../utils/rbac';
import {
  AlertTriangle,
  Trash2,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Loader2,
  Lock,
  Database
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResetDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'history_only' | 'full_reset';
}

export const ResetDataModal: React.FC<ResetDataModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'history_only',
}) => {
  const {
    currentHotel,
    currentRole,
    currentUser,
    canResetAllData,
    clearAllRequestsHistory,
    resetAllHotelData,
    requests,
    rooms,
  } = useGuestFlow();

  const [mode, setMode] = useState<'history_only' | 'full_reset'>(defaultMode);
  const [confirmed, setConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalHotelRequests = requests.filter((r) => r.hotelId === currentHotel.id).length;
  const totalHotelRooms = rooms.filter((r) => r.hotelId === currentHotel.id).length;

  const handleExecuteReset = async () => {
    if (!confirmed) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (mode === 'history_only') {
        const deletedCount = await clearAllRequestsHistory();
        setSuccessResult(`Se han eliminado con éxito ${deletedCount || totalHotelRequests} solicitudes y chats de ${currentHotel.name}.`);
      } else {
        const res = await resetAllHotelData();
        setSuccessResult(`Reset total completado: ${res.deletedRequests || totalHotelRequests} solicitudes borradas y ${totalHotelRooms} habitaciones restauradas a su estado inicial.`);
      }

      try {
        confetti({ particleCount: 50, spread: 70 });
      } catch {
        // ignore
      }

      setTimeout(() => {
        setIsProcessing(false);
        setConfirmed(false);
        setSuccessResult(null);
        onClose();
      }, 2500);
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Ocurrió un error inesperado al resetear los datos.';
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="absolute right-5 top-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">Purga de Datos &amp; Reset del Sistema</h3>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  Zona Crítica
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Restablecimiento seguro del historial y estados operativos para {currentHotel.name}.
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* RBAC Verification Banner */}
          {!canResetAllData ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
              <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>Acceso Restringido por Política RBAC</span>
              </div>
              <p className="text-xs text-amber-700 leading-relaxed">
                Esta acción requiere credenciales de <strong>Gerente General</strong>, <strong>Administrador de Hotel</strong> o <strong>Super Administrador</strong>.
                Tu rol actual es <strong>{getRoleLabel(currentRole)}</strong>.
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Entendido y Volver
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Authorized Badge */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="text-slate-700">
                    Autorizado como: <strong>{getRoleLabel(currentRole)}</strong> ({currentUser?.name || 'Personal Directivo'})
                  </span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                  Privilegios Verificados
                </span>
              </div>

              {/* Success Result Alert */}
              {successResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-emerald-800">Operación ejecutada con éxito</p>
                    <p className="text-emerald-700">{successResult}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Sincronizado en tiempo real con Cloud Firestore.</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-3 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-rose-800">No se pudo completar el reseteo</p>
                    <p className="text-rose-700 mt-0.5">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Operation Mode Selection */}
              {!successResult && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Selecciona el tipo de operación:
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Option 1: History Only */}
                    <div
                      onClick={() => !isProcessing && setMode('history_only')}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        mode === 'history_only'
                          ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                            <Trash2 className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {totalHotelRequests} solicitudes
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Borrar Historial</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Elimina todos los tickets de servicio, pedidos y chats de la base de datos.
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-slate-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-teal-600" />
                        <span>Mantiene habitaciones y configuración</span>
                      </div>
                    </div>

                    {/* Option 2: Full Hotel Reset */}
                    <div
                      onClick={() => !isProcessing && setMode('full_reset')}
                      className={`p-4 rounded-2xl border-2 transition cursor-pointer flex flex-col justify-between ${
                        mode === 'full_reset'
                          ? 'border-rose-600 bg-rose-50/50 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                            <RotateCcw className="w-5 h-5" />
                          </div>
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            Fábrica
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900">Reset Total de Hotel</h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          Borra historial y restablece carteles de puerta de las {totalHotelRooms} habitaciones a "Limpio".
                        </p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 mt-3 text-[10px] text-amber-700 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Reinicia estados a línea base</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* What will be deleted summary */}
              {!successResult && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Database className="w-4 h-4 text-slate-500" />
                    <span>Impacto en la Base de Datos ({currentHotel.name}):</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-600 space-y-1 text-[11px] pl-1">
                    <li>Eliminación permanente de <strong>{totalHotelRequests} solicitudes</strong> en Firestore y caché local.</li>
                    <li>Vaciado de conversaciones de chat entre huéspedes y recepción.</li>
                    {mode === 'full_reset' && (
                      <li>Restablecimiento de carteles de puerta (No Molestar / Limpieza) en <strong>{totalHotelRooms} habitaciones</strong>.</li>
                    )}
                    <li>Puesta a cero de métricas de tiempo de respuesta y CSAT de la sesión.</li>
                  </ul>
                </div>
              )}

              {/* Confirmation Checkbox */}
              {!successResult && (
                <div className="pt-2">
                  <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-rose-200 bg-rose-50/60 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                      disabled={isProcessing}
                      className="mt-0.5 h-4 w-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
                    />
                    <div className="text-xs text-rose-950 font-medium leading-snug">
                      <span className="font-bold">Confirmo como directivo del hotel</span> que comprendo que esta acción es definitiva e irreversible, y actualizará de inmediato la nube de Firestore para todos los terminales.
                    </div>
                  </label>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition cursor-pointer"
          >
            {successResult ? 'Cerrar' : 'Cancelar'}
          </button>

          {canResetAllData && !successResult && (
            <button
              type="button"
              onClick={handleExecuteReset}
              disabled={!confirmed || isProcessing}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer ${
                confirmed && !isProcessing
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando reseteo en la nube...</span>
                </>
              ) : (
                <>
                  {mode === 'history_only' ? (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Ejecutar Borrado de Historial</span>
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      <span>Ejecutar Reset Total</span>
                    </>
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
