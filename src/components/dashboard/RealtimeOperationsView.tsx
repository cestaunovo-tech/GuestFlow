import React, { useState, useMemo } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestRequest, Department, RequestStatus, RequestPriority } from '../../types';
import { getDepartmentLabel, getRoleLabel } from '../../utils/rbac';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Check,
  Filter,
  User,
  Image as ImageIcon,
  Sparkles,
  Search,
  Building,
  RefreshCw,
  Lock,
  ShieldCheck,
  Layers,
  MessageSquare
} from 'lucide-react';
import { StaffChatModal } from './StaffChatModal';

export const RealtimeOperationsView: React.FC = () => {
  const {
    requests,
    currentHotel,
    updateRequestStatus,
    stats,
    currentRole,
    staffUsers,
    canManageRoomsAndQr,
    userDepartment
  } = useGuestFlow();

  const [filterDept, setFilterDept] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedChatRequest, setSelectedChatRequest] = useState<GuestRequest | null>(null);

  // Filter requests for current hotel based on RBAC:
  // Non-privileged users (Recepción, Housekeeping, Room Service, Mantenimiento) can ONLY view requests of their department!
  const scopedRequests = useMemo(() => {
    const hotelRequests = requests.filter((r) => r.hotelId === currentHotel.id);
    if (!canManageRoomsAndQr && userDepartment !== 'ALL') {
      return hotelRequests.filter((r) => r.department === userDepartment);
    }
    return hotelRequests;
  }, [requests, currentHotel.id, canManageRoomsAndQr, userDepartment]);

  // Compute departmental or global metrics
  const scopedStats = useMemo(() => {
    const total = scopedRequests.length;
    const pending = scopedRequests.filter((r) => r.status === 'RECIBIDA').length;
    const inProgress = scopedRequests.filter((r) =>
      ['ASIGNADA', 'EN_PROCESO', 'EN_CAMINO'].includes(r.status)
    ).length;
    const completed = scopedRequests.filter((r) => r.status === 'COMPLETADA').length;
    const urgent = scopedRequests.filter(
      (r) => r.priority === 'URGENTE' && r.status !== 'COMPLETADA'
    ).length;

    let totalResponseMins = 0;
    let responseCount = 0;
    let totalResolutionMins = 0;
    let resolutionCount = 0;

    scopedRequests.forEach((r) => {
      const created = new Date(r.createdAt).getTime();
      if (r.acceptedAt) {
        const accepted = new Date(r.acceptedAt).getTime();
        totalResponseMins += Math.max(1, Math.round((accepted - created) / (1000 * 60)));
        responseCount++;
      }
      if (r.completedAt) {
        const completed = new Date(r.completedAt).getTime();
        totalResolutionMins += Math.max(3, Math.round((completed - created) / (1000 * 60)));
        resolutionCount++;
      }
    });

    const avgResponse = responseCount > 0 ? Math.round(totalResponseMins / responseCount) : 4.2;
    const avgResolution = resolutionCount > 0 ? Math.round(totalResolutionMins / resolutionCount) : 16.5;

    const rated = scopedRequests.filter((r) => typeof r.rating === 'number');
    const csat =
      rated.length > 0
        ? Number((rated.reduce((acc, r) => acc + (r.rating || 0), 0) / rated.length).toFixed(1))
        : 4.9;

    return {
      pending,
      inProgress,
      completed,
      urgent,
      avgResponse,
      avgResolution,
      csat,
    };
  }, [scopedRequests]);

  const filteredRequests = scopedRequests.filter((r) => {
    if (canManageRoomsAndQr && filterDept !== 'ALL' && r.department !== filterDept) return false;
    if (filterStatus !== 'ALL' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.code.toLowerCase().includes(q) ||
        r.roomNumber.includes(q) ||
        r.guestName.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getPriorityBadge = (p: RequestPriority) => {
    switch (p) {
      case 'URGENTE':
        return 'bg-rose-100 text-rose-800 border-rose-200 font-extrabold animate-pulse';
      case 'ALTA':
        return 'bg-amber-100 text-amber-800 border-amber-200 font-bold';
      case 'MEDIA':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'BAJA':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusStyle = (s: RequestStatus) => {
    switch (s) {
      case 'RECIBIDA':
        return 'bg-amber-50 text-amber-900 border-amber-300';
      case 'ASIGNADA':
        return 'bg-blue-50 text-blue-900 border-blue-300';
      case 'EN_PROCESO':
        return 'bg-cyan-50 text-cyan-900 border-cyan-300';
      case 'EN_CAMINO':
        return 'bg-indigo-50 text-indigo-900 border-indigo-300';
      case 'COMPLETADA':
        return 'bg-emerald-50 text-emerald-900 border-emerald-300';
      case 'CANCELADA':
        return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  const calculateElapsedMinutes = (dateStr: string) => {
    const ms = Date.now() - new Date(dateStr).getTime();
    return Math.max(1, Math.round(ms / (1000 * 60)));
  };

  return (
    <div className="space-y-6">
      {/* RBAC Department Restriction Notice */}
      {!canManageRoomsAndQr && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-3.5 px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            <span className="text-xs text-blue-950">
              <strong>Filtro Operativo Activo:</strong> Tu perfil ({getRoleLabel(currentRole)}) tiene visibilidad restringida exclusivamente a solicitudes y operaciones de <strong>{getDepartmentLabel(userDepartment)}</strong>.
            </span>
          </div>
          <span className="self-start sm:self-auto text-[10px] font-black uppercase tracking-wider text-blue-700 bg-white/80 border border-blue-200 px-2 py-0.5 rounded-lg shadow-2xs">
            RBAC Departamental
          </span>
        </div>
      )}

      {/* Real-time KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pendientes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-600">{scopedStats.pending}</span>
            <span className="text-[10px] text-slate-400 font-semibold">recibidas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Proceso</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-cyan-600">{scopedStats.inProgress}</span>
            <span className="text-[10px] text-slate-400 font-semibold">activas</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completadas</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-600">{scopedStats.completed}</span>
            <span className="text-[10px] text-slate-400 font-semibold">hoy</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Urgentes</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-rose-600">{scopedStats.urgent}</span>
            <span className="text-[10px] text-rose-500 font-bold">atención</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Response</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800">{scopedStats.avgResponse}</span>
            <span className="text-[10px] text-slate-400 font-semibold">minutos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Avg Resolution</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-slate-800">{scopedStats.avgResolution}</span>
            <span className="text-[10px] text-slate-400 font-semibold">minutos</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Satisfacción</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-black text-amber-500">{scopedStats.csat}</span>
            <span className="text-xs text-amber-400">★</span>
            <span className="text-[10px] text-slate-400 font-semibold">/ 5.0</span>
          </div>
        </div>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por hab., código #GF, huésped, servicio..."
              className="w-full text-xs rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-slate-800 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs">
          {canManageRoomsAndQr ? (
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-slate-700 cursor-pointer"
            >
              <option value="ALL">Todos los Departamentos</option>
              <option value="RECEPCION">Recepción ({stats.requestsByDept.RECEPCION})</option>
              <option value="HOUSEKEEPING">Housekeeping ({stats.requestsByDept.HOUSEKEEPING})</option>
              <option value="ROOM_SERVICE">Room Service ({stats.requestsByDept.ROOM_SERVICE})</option>
              <option value="MANTENIMIENTO">Mantenimiento ({stats.requestsByDept.MANTENIMIENTO})</option>
            </select>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl font-bold text-xs shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-blue-600" />
              <span>Solo {getDepartmentLabel(userDepartment)}</span>
            </div>
          )}

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs rounded-xl border border-slate-200 px-3 py-2 bg-slate-50 font-bold text-slate-700 cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="RECIBIDA">Recibida</option>
            <option value="ASIGNADA">Asignada</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="EN_CAMINO">En Camino</option>
            <option value="COMPLETADA">Completada</option>
          </select>

          {((canManageRoomsAndQr && filterDept !== 'ALL') || filterStatus !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                if (canManageRoomsAndQr) setFilterDept('ALL');
                setFilterStatus('ALL');
                setSearchQuery('');
              }}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Restablecer
            </button>
          )}
        </div>
      </div>

      {/* Requests Table / Card Stream */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-ping" />
            <h3 className="text-sm font-bold">Bandeja de Operaciones en Tiempo Real</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
              {filteredRequests.length} solicitudes
            </span>
          </div>
          <span className="text-[11px] text-teal-300 hidden sm:inline">
            Actualización en vivo sincronizada con habitaciones
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredRequests.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <CheckCircle2 className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Sin solicitudes que coincidan con los filtros</p>
              <p className="text-xs text-slate-400 mt-1">Todas las tareas operativas están al día.</p>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const elapsed = calculateElapsedMinutes(req.createdAt);
              const isUrgent = req.priority === 'URGENTE';

              return (
                <div
                  key={req.id}
                  className={`p-4 sm:p-5 transition hover:bg-slate-50/60 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                    isUrgent ? 'bg-rose-50/30' : ''
                  }`}
                >
                  {/* Left Column: Room & Code */}
                  <div className="flex items-start gap-3 min-w-[200px]">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-teal-800 uppercase">Hab</span>
                      <span className="text-base font-black text-slate-900 leading-tight">
                        {req.roomNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[11px] font-bold text-teal-800">{req.code}</span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.2 rounded-full border ${getPriorityBadge(
                            req.priority
                          )}`}
                        >
                          {req.priority}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 mt-0.5">{req.guestName}</p>
                      <p className="text-[10px] text-slate-400">
                        {req.building} • Piso {req.floor}
                      </p>
                    </div>
                  </div>

                  {/* Center Column: Description & Metadata */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase">
                        {req.department}
                      </span>
                      <span className="text-xs font-bold text-slate-700">· {req.category}</span>
                      {req.photoUrl && (
                        <button
                          onClick={() => setSelectedPhoto(req.photoUrl || null)}
                          className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold flex items-center gap-1 hover:bg-rose-100"
                        >
                          <ImageIcon className="w-3 h-3" />
                          <span>Ver Foto</span>
                        </button>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{req.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{req.description}</p>

                    {/* Items if room service */}
                    {req.items && req.items.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {req.items.map((i) => (
                          <span
                            key={i.id}
                            className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-medium"
                          >
                            {i.quantity}x {i.name} (${i.price * i.quantity} USD)
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Elapsed time & routing note */}
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
                      <span className="flex items-center gap-1 font-semibold text-slate-600">
                        <Clock className="w-3 h-3 text-teal-600" />
                        Hace {elapsed} min ({new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                      </span>
                      {req.assignedTo && (
                        <span className="flex items-center gap-1 text-teal-700 font-bold">
                          <User className="w-3 h-3" />
                          {req.assignedTo}
                        </span>
                      )}
                      {req.rating && (
                        <span className="text-amber-600 font-bold">
                          CSAT: {req.rating} ⭐ ({req.feedback || 'Sin comentario'})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Status & Operational Action Controls */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
                    <span
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${getStatusStyle(
                        req.status
                      )}`}
                    >
                      {req.status}
                    </span>

                    {/* Operational Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      {/* Chat with Guest Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedChatRequest(req)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer ${
                          req.hasUnreadGuestMessages
                            ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                            : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                        }`}
                        title="Abrir chat en vivo con el huésped"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat {req.messages?.length ? `(${req.messages.length})` : ''}</span>
                      </button>

                      {req.status === 'RECIBIDA' && (
                        <button
                          onClick={() =>
                            updateRequestStatus(
                              req.id,
                              'ASIGNADA',
                              staffUsers.find((u) => u.department === req.department)?.name || 'Personal en turno'
                            )
                          }
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                          title="Aceptar y asignar"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>Asignar</span>
                        </button>
                      )}

                      {(req.status === 'RECIBIDA' || req.status === 'ASIGNADA') && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'EN_PROCESO')}
                          className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                          title="Iniciar ejecución"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Iniciar</span>
                        </button>
                      )}

                      {req.status === 'EN_PROCESO' && req.department === 'ROOM_SERVICE' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'EN_CAMINO')}
                          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                          title="Marcar orden en camino a la habitación"
                        >
                          <span>En camino</span>
                        </button>
                      )}

                      {req.status !== 'COMPLETADA' && req.status !== 'CANCELADA' && (
                        <button
                          onClick={() => updateRequestStatus(req.id, 'COMPLETADA')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-1"
                          title="Marcar como completada (dispara encuesta de satisfacción al huésped)"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Completar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Photo Modal Preview if maintenance ticket attached a photo */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 text-white hover:bg-slate-900"
            >
              ✕
            </button>
            <h4 className="text-sm font-bold text-slate-800 mb-2">Evidencia Fotográfica de Incidencia</h4>
            <img src={selectedPhoto} alt="Evidencia" className="w-full rounded-2xl max-h-[70vh] object-cover" />
          </div>
        </div>
      )}

      {/* Staff 2-way Chat Modal */}
      {selectedChatRequest && (
        <StaffChatModal
          isOpen={!!selectedChatRequest}
          onClose={() => setSelectedChatRequest(null)}
          request={selectedChatRequest}
        />
      )}
    </div>
  );
};
