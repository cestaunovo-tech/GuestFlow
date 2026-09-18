import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import {
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  BarChart3,
  PieChart,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';

interface IntelligenceAnalyticsViewProps {
  onOpenReportModal: () => void;
}

export const IntelligenceAnalyticsView: React.FC<IntelligenceAnalyticsViewProps> = ({
  onOpenReportModal,
}) => {
  const { currentHotel, stats, aiInsights, requests } = useGuestFlow();
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  const hotelRequests = requests.filter((r) => r.hotelId === currentHotel.id);

  // Department distribution
  const deptData = [
    { name: 'Housekeeping', count: stats.requestsByDept.HOUSEKEEPING, color: 'bg-teal-500', pct: 40 },
    { name: 'Room Service', count: stats.requestsByDept.ROOM_SERVICE, color: 'bg-amber-500', pct: 28 },
    { name: 'Recepción', count: stats.requestsByDept.RECEPCION, color: 'bg-emerald-500', pct: 18 },
    { name: 'Mantenimiento', count: stats.requestsByDept.MANTENIMIENTO, color: 'bg-rose-500', pct: 14 },
  ];

  // Most requested services
  const topServices = [
    { name: 'Toallas de baño adicionales', count: 28, dept: 'Housekeeping', trend: '+14%' },
    { name: 'Hamburguesa Wagyu Room Service', count: 22, dept: 'Room Service', trend: '+25%' },
    { name: 'Limpieza inmediata de habitación', count: 19, dept: 'Housekeeping', trend: '+8%' },
    { name: 'Regulación de Aire Acondicionado', count: 14, dept: 'Mantenimiento', trend: '-5%' },
    { name: 'Asistencia con equipaje (Bellboy)', count: 12, dept: 'Recepción', trend: '+10%' },
  ];

  // Hourly demand distribution (simulated peak hours)
  const hourlyData = [
    { hour: '07:00', count: 4 },
    { hour: '08:00', count: 12 },
    { hour: '09:00', count: 24 }, // Peak
    { hour: '10:00', count: 28 }, // Peak
    { hour: '11:00', count: 16 },
    { hour: '13:00', count: 10 },
    { hour: '15:00', count: 8 },
    { hour: '18:00', count: 14 },
    { hour: '19:00', count: 22 }, // Peak
    { hour: '20:00', count: 26 }, // Peak
    { hour: '22:00', count: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Header bar with Executive Action */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-teal-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>GuestFlow Intelligence Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">Analítica Operativa &amp; Desempeño</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Métricas consolidadas de tiempos de respuesta, productividad por departamento y satisfacción neta del huésped en {currentHotel.name}.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/10 p-1 rounded-xl border border-white/20 text-xs font-bold">
            {(['today', 'week', 'month'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  timeRange === range ? 'bg-teal-400 text-slate-950' : 'text-slate-300 hover:text-white'
                }`}
              >
                {range === 'today' ? 'Hoy' : range === 'week' ? 'Esta Semana' : 'Este Mes'}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenReportModal}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 transition shadow-lg shadow-teal-500/20 shrink-0"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar Reporte Ejecutivo</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Solicitudes Totales</span>
            <Layers className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.totalRequests}</p>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% vs semana anterior</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Tiempo de Respuesta</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.avgResponseMinutes} min</p>
          <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <span>⚡ Meta hotelera: &lt; 5 min</span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Tiempo Resolución</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.avgResolutionMinutes} min</p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Promedio entre todas las áreas
          </p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase">Índice CSAT Huésped</span>
            <span className="text-amber-500 font-bold">★</span>
          </div>
          <p className="text-3xl font-black text-slate-900">{stats.csatScore} / 5.0</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">
            96% calificaciones 5 estrellas
          </p>
        </div>
      </div>

      {/* Charts & Breakdown: Hourly Demand + Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hourly Peak Demand Histogram */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Horarios de Mayor Demanda (Picos)</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Picos principales detectados en desayuno (09:00 - 10:30) y cena (19:00 - 20:30).
              </p>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
              Distribución 24h
            </span>
          </div>

          <div className="pt-4 flex items-end justify-between gap-2 h-44 border-b border-slate-200 px-2 pb-2">
            {hourlyData.map((d) => {
              const max = 28;
              const heightPct = Math.round((d.count / max) * 100);
              const isPeak = d.count >= 22;

              return (
                <div key={d.hour} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[9px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition">
                    {d.count}
                  </span>
                  <div
                    style={{ height: `${heightPct}%` }}
                    className={`w-full rounded-t-lg transition-all duration-300 ${
                      isPeak
                        ? 'bg-teal-600 hover:bg-teal-500'
                        : 'bg-slate-200 hover:bg-slate-300'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 font-semibold">{d.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department Volume Share */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Distribución por Área
          </h3>

          <div className="space-y-3.5">
            {deptData.map((dept) => (
              <div key={dept.name} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{dept.name}</span>
                  <span>{dept.count} solicitudes ({dept.pct}%)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${dept.pct}%` }}
                    className={`h-full rounded-full ${dept.color}`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 leading-relaxed">
            Housekeeping y Room Service concentran el <strong>68%</strong> de todas las interacciones digitales de los huéspedes.
          </div>
        </div>
      </div>

      {/* Top Services & AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Services Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-2 border-b border-slate-100">
            Servicios Más Solicitados
          </h3>

          <div className="divide-y divide-slate-100">
            {topServices.map((serv, index) => (
              <div key={serv.name} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{serv.name}</p>
                    <span className="text-[10px] text-slate-400">{serv.dept}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900">{serv.count} pedidos</span>
                  <span className="block text-[10px] font-bold text-teal-700">{serv.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Operational Insights Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Recomendaciones Inteligentes (AI Insights)</span>
            </h3>
            <span className="text-[10px] font-bold bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
              Activo
            </span>
          </div>

          <div className="space-y-3">
            {aiInsights.map((insight) => (
              <div
                key={insight.id}
                className="p-3.5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-teal-200/60 text-teal-900">
                    {insight.department}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                      insight.type === 'alert'
                        ? 'bg-rose-100 text-rose-800 font-extrabold'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {insight.metricHighlight}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900">{insight.title}</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">{insight.description}</p>
                <div className="pt-1 text-[10px] font-bold text-teal-800 flex items-center gap-1">
                  <span>💡 Acción recomendada:</span>
                  <span>{insight.actionRecommendation}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
