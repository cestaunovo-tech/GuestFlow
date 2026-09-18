import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { Department, Room, GuestRequest, DoorSignStatus } from '../../types';
import { getDepartmentLabel, getRoleLabel } from '../../utils/rbac';
import {
  Sparkles,
  BedDouble,
  Clock,
  CheckCircle2,
  Utensils,
  Wrench,
  Bell,
  Check,
  AlertTriangle,
  Play,
  User,
  Filter,
  Lock,
  ShieldCheck
} from 'lucide-react';

interface DepartmentViewsProps {
  initialDept?: Department;
}

export const DepartmentViews: React.FC<DepartmentViewsProps> = ({ initialDept }) => {
  const {
    currentHotel,
    rooms,
    requests,
    updateDoorSign,
    updateRequestStatus,
    staffUsers,
    currentRole,
    canManageRoomsAndQr,
    userDepartment
  } = useGuestFlow();

  // If user is departmental, lock to their department
  const defaultDept: Department = (!canManageRoomsAndQr && userDepartment !== 'ALL')
    ? userDepartment
    : (initialDept || 'HOUSEKEEPING');

  const [activeDept, setActiveDept] = useState<Department>(defaultDept);
  const [selectedFloor, setSelectedFloor] = useState<string>('ALL');

  useEffect(() => {
    if (!canManageRoomsAndQr && userDepartment !== 'ALL') {
      setActiveDept(userDepartment);
    }
  }, [canManageRoomsAndQr, userDepartment]);

  // Filter hotel rooms
  const hotelRooms = rooms.filter((r) => r.hotelId === currentHotel.id);

  // Filter hotel requests for active department
  const deptRequests = requests.filter(
    (r) => r.hotelId === currentHotel.id && r.department === activeDept
  );

  const getDoorSignBadge = (status: DoorSignStatus) => {
    switch (status) {
      case 'NO_MOLESTAR':
        return {
          icon: '🚫',
          text: 'No Molestar',
          color: 'bg-rose-100 text-rose-800 border-rose-300 font-extrabold',
        };
      case 'LIMPIEZA_AHORA':
        return {
          icon: '✨',
          text: 'Limpieza Inmediata',
          color: 'bg-teal-100 text-teal-800 border-teal-300 font-extrabold animate-pulse',
        };
      case 'LIMPIAR':
        return {
          icon: '🧹',
          text: 'Limpiar Hoy',
          color: 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
        };
      case 'PAUSA_LIMPIEZA':
        return {
          icon: '⏸️',
          text: 'Sin Limpieza',
          color: 'bg-amber-100 text-amber-800 border-amber-300',
        };
      case 'NORMAL':
      default:
        return {
          icon: '🚪',
          text: 'Estándar',
          color: 'bg-slate-100 text-slate-600 border-slate-200',
        };
    }
  };

  const floors = Array.from(new Set(hotelRooms.map((r) => r.floor))).sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {/* Department Selector Tabs (or locked station header for departmental staff) */}
      {!canManageRoomsAndQr && userDepartment !== 'ALL' ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center text-2xl">
              {activeDept === 'HOUSEKEEPING' && '🧹'}
              {activeDept === 'ROOM_SERVICE' && '🍽️'}
              {activeDept === 'MANTENIMIENTO' && '🛠️'}
              {activeDept === 'RECEPCION' && '🛎️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Estación Operativa de {getDepartmentLabel(userDepartment)}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-blue-600" />
                  Acceso Departamental
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Rol asignado: <strong>{getRoleLabel(currentRole)}</strong> • Solo visualizas operaciones y solicitudes de tu sector.
              </p>
            </div>
          </div>
          <div className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span>{deptRequests.filter((r) => r.status !== 'COMPLETADA').length} tareas activas</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'HOUSEKEEPING' as const, label: 'Housekeeping', icon: '🧹', desc: 'Aseo, Toallas y Puertas' },
            { id: 'ROOM_SERVICE' as const, label: 'Room Service', icon: '🍽️', desc: 'Comanda Cocina & F&B' },
            { id: 'MANTENIMIENTO' as const, label: 'Mantenimiento', icon: '🛠️', desc: 'Incidencias Técnicas' },
            { id: 'RECEPCION' as const, label: 'Recepción', icon: '🛎️', desc: 'Atención & Front Desk' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
                activeDept === d.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl">{d.icon}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    activeDept === d.id ? 'bg-teal-500 text-slate-950' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {requests.filter((r) => r.hotelId === currentHotel.id && r.department === d.id && r.status !== 'COMPLETADA').length} activas
                </span>
              </div>
              <h4 className="text-sm font-bold mt-2">{d.label}</h4>
              <p className={`text-[11px] mt-0.5 ${activeDept === d.id ? 'text-slate-300' : 'text-slate-400'}`}>
                {d.desc}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* VIEW: HOUSEKEEPING WORKSPACE (Live Room Door Matrix + Towels) */}
      {activeDept === 'HOUSEKEEPING' && (
        <div className="space-y-6">
          {/* Live Door Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🚪 Cartel Digital de Puertas en Tiempo Real</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Estado emitido por los huéspedes desde su móvil. Se actualiza automáticamente.
                </p>
              </div>

              {/* Floor Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-bold">Piso:</span>
                <select
                  value={selectedFloor}
                  onChange={(e) => setSelectedFloor(e.target.value)}
                  className="text-xs rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 bg-slate-50"
                >
                  <option value="ALL">Todos los Pisos</option>
                  {floors.map((fl) => (
                    <option key={fl} value={fl.toString()}>
                      Piso {fl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Room cards grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-5">
              {hotelRooms
                .filter((r) => (selectedFloor === 'ALL' ? true : r.floor.toString() === selectedFloor))
                .map((room) => {
                  const badge = getDoorSignBadge(room.doorSign);
                  return (
                    <div
                      key={room.id}
                      className="p-3.5 rounded-2xl border border-slate-200/90 bg-white hover:shadow-sm transition flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-black text-slate-900">Hab {room.number}</span>
                          <span className="text-[10px] text-slate-400 font-semibold">P.{room.floor}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">{room.guestName}</p>
                      </div>

                      <div className="mt-3">
                        <div className={`p-1.5 rounded-xl border text-center text-[10px] ${badge.color}`}>
                          <span className="mr-1">{badge.icon}</span>
                          <span>{badge.text}</span>
                        </div>

                        {room.doorSignNote && (
                          <p className="text-[9px] text-slate-500 italic mt-1.5 truncate" title={room.doorSignNote}>
                            "{room.doorSignNote}"
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Housekeeping Tasks Stream */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 mb-4">
              🧺 Solicitudes de Toallas y Limpieza ({deptRequests.length})
            </h3>
            <div className="divide-y divide-slate-100">
              {deptRequests.map((req) => (
                <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">Habitación {req.roomNumber}</span>
                      <span className="text-xs text-slate-400">· {req.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                      {req.status}
                    </span>
                    {req.status !== 'COMPLETADA' && (
                      <button
                        onClick={() => updateRequestStatus(req.id, 'COMPLETADA')}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs"
                      >
                        Entregar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ROOM SERVICE (Kitchen Display System KDS) */}
      {activeDept === 'ROOM_SERVICE' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>🍳 Comandero de Cocina y Room Service</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualización de órdenes para expedición y entrega en habitación.
                </p>
              </div>
              <span className="text-xs font-extrabold text-teal-800 bg-teal-50 px-3 py-1.5 rounded-xl border border-teal-200">
                Gourmet Express
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
              {deptRequests.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black text-slate-900">Hab {order.roomNumber}</span>
                          <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {order.code}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{order.guestName}</p>

                      {/* Items list */}
                      <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-3">
                        {order.items && order.items.length > 0 ? (
                          order.items.map((it) => (
                            <div key={it.id} className="text-xs flex items-center justify-between">
                              <span className="font-bold text-slate-800">
                                {it.quantity}x {it.name}
                              </span>
                              <span className="text-slate-500 font-semibold">${it.price * it.quantity} USD</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-600">{order.description}</p>
                        )}
                      </div>

                      {order.totalAmount && (
                        <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-900">
                          <span>Total Comanda:</span>
                          <span className="text-teal-700">${order.totalAmount} USD</span>
                        </div>
                      )}
                    </div>

                    {/* Operational controls */}
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {order.status === 'RECIBIDA' && (
                        <button
                          onClick={() => updateRequestStatus(order.id, 'EN_PROCESO')}
                          className="col-span-2 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
                        >
                          En Preparación
                        </button>
                      )}
                      {order.status === 'EN_PROCESO' && (
                        <button
                          onClick={() => updateRequestStatus(order.id, 'EN_CAMINO')}
                          className="col-span-2 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
                        >
                          En Camino
                        </button>
                      )}
                      {order.status === 'EN_CAMINO' && (
                        <button
                          onClick={() => updateRequestStatus(order.id, 'COMPLETADA')}
                          className="col-span-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                        >
                          Entregado
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: MANTENIMIENTO WORKSPACE */}
      {activeDept === 'MANTENIMIENTO' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-2">
            🛠️ Incidencias Técnicas & Mantenimiento Preventivo
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Tickets derivados por fallas de clima, plomería, electricidad o cerraduras.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptRequests.map((req) => (
              <div key={req.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-slate-900">Habitación {req.roomNumber}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      req.priority === 'URGENTE'
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {req.priority}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-800">{req.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{req.description}</p>
                </div>

                {req.photoUrl && (
                  <img
                    src={req.photoUrl}
                    alt="Evidencia técnica"
                    className="w-full h-32 object-cover rounded-xl border border-slate-200"
                  />
                )}

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="font-semibold text-slate-500">Estado: {req.status}</span>
                  {req.status !== 'COMPLETADA' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'COMPLETADA')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                    >
                      Resolver Incidencia
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: RECEPCION WORKSPACE */}
      {activeDept === 'RECEPCION' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">🛎️ Consola de Front Desk & Concierge</h3>
          <div className="divide-y divide-slate-100">
            {deptRequests.map((req) => (
              <div key={req.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">Hab {req.roomNumber} ({req.guestName})</span>
                    <span className="text-xs text-slate-400">· {req.category}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{req.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">
                    {req.status}
                  </span>
                  {req.status !== 'COMPLETADA' && (
                    <button
                      onClick={() => updateRequestStatus(req.id, 'COMPLETADA')}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 text-white font-bold text-xs"
                    >
                      Atendido
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
