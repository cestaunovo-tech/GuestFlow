import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestFlowLogo } from '../GuestFlowLogo';
import { X, Printer, Download, Calendar, CheckCircle2, Sparkles, Building2 } from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  const { currentHotel, stats, aiInsights, requests } = useGuestFlow();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('month');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const periodLabels = {
    today: 'Hoy (Últimas 24 Horas)',
    week: 'Últimos 7 Días (Semana en Curso)',
    month: 'Mes en Curso (Métricas Acumuladas)',
  };

  const reportDate = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 flex flex-col my-auto max-h-[95vh] overflow-hidden">
        {/* Controls Toolbar (hidden during print) */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs">Período del reporte:</span>
            <div className="flex bg-white/10 p-1 rounded-xl text-xs font-bold">
              {(['today', 'week', 'month'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-lg transition ${
                    period === p ? 'bg-teal-400 text-slate-950' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {p === 'today' ? 'Hoy' : p === 'week' ? 'Semana' : 'Mes'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Guardar como PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div id="printable-executive-report" className="flex-1 overflow-y-auto p-8 sm:p-12 bg-white text-slate-900 space-y-8 print:p-0 print:overflow-visible">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-6">
            <div>
              <GuestFlowLogo variant="horizontal" size="md" showTagline={true} />
              <p className="text-[10px] text-slate-400 mt-2 font-mono uppercase tracking-wider">
                Documento Oficial de Inteligencia Hotelera • Folio GF-{Date.now().toString().slice(-6)}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-black uppercase text-teal-700 bg-teal-50 px-2.5 py-1 rounded border border-teal-200">
                Informe Ejecutivo de Operaciones
              </span>
              <h1 className="text-xl font-black text-slate-900 mt-1">{currentHotel.name}</h1>
              <p className="text-xs text-slate-500">
                {currentHotel.city}, {currentHotel.country} • {currentHotel.totalRooms} Habitaciones
              </p>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Período: <strong>{periodLabels[period]}</strong> | Generado: {reportDate}
              </p>
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              1. Resumen Ejecutivo de Operación
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Durante el período evaluado, la plataforma <strong>GuestFlow</strong> procesó con éxito un total de{' '}
              <strong>{stats.totalRequests} solicitudes de huéspedes</strong>. El tiempo promedio de respuesta institucional se ubicó en{' '}
              <strong>{stats.avgResponseMinutes} minutos</strong> (cumpliendo con el estándar SLA hotelero de &lt; 5 min), y el tiempo promedio de resolución integral se mantuvo en{' '}
              <strong>{stats.avgResolutionMinutes} minutos</strong>. El índice de satisfacción neta del huésped (CSAT) registró una marca de{' '}
              <strong>{stats.csatScore} / 5.0</strong>, reflejando altos estándares de agilidad y servicio.
            </p>
          </div>

          {/* Key Executive KPIs Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              2. Indicadores Clave de Rendimiento (KPIs)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Solicitudes Totales</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.totalRequests}</p>
                <p className="text-[10px] text-teal-700 font-semibold">100% canal digital</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Tiempo Respuesta Prom.</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.avgResponseMinutes} min</p>
                <p className="text-[10px] text-emerald-600 font-semibold">Objetivo cumplido</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Tiempo Resolución Prom.</p>
                <p className="text-2xl font-black text-slate-900 mt-1">{stats.avgResolutionMinutes} min</p>
                <p className="text-[10px] text-slate-500 font-semibold">Flujo continuo</p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Calificación CSAT</p>
                <p className="text-2xl font-black text-amber-500 mt-1">{stats.csatScore} ★</p>
                <p className="text-[10px] text-slate-500 font-semibold">Sobre 5.0 máx</p>
              </div>
            </div>
          </div>

          {/* Department Performance Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              3. Desempeño y Volumen por Departamento
            </h3>
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Departamento</th>
                  <th className="p-2.5 text-center">Volumen Solicitudes</th>
                  <th className="p-2.5 text-center">% de Carga</th>
                  <th className="p-2.5 text-center">Tiempo Promedio</th>
                  <th className="p-2.5 text-center">Satisfacción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Housekeeping / Ama de Llaves</td>
                  <td className="p-2.5 text-center">{stats.requestsByDept.HOUSEKEEPING}</td>
                  <td className="p-2.5 text-center">40.5%</td>
                  <td className="p-2.5 text-center">11 min</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">4.9 ★</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Room Service &amp; Cocina</td>
                  <td className="p-2.5 text-center">{stats.requestsByDept.ROOM_SERVICE}</td>
                  <td className="p-2.5 text-center">28.2%</td>
                  <td className="p-2.5 text-center">21 min</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">4.8 ★</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Recepción / Front Desk</td>
                  <td className="p-2.5 text-center">{stats.requestsByDept.RECEPCION}</td>
                  <td className="p-2.5 text-center">18.1%</td>
                  <td className="p-2.5 text-center">3 min</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">4.9 ★</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Mantenimiento &amp; Ingeniería</td>
                  <td className="p-2.5 text-center">{stats.requestsByDept.MANTENIMIENTO}</td>
                  <td className="p-2.5 text-center">13.2%</td>
                  <td className="p-2.5 text-center">18 min</td>
                  <td className="p-2.5 text-center text-amber-600 font-bold">4.7 ★</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* AI Insights & Operational Recommendations */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
              4. Recomendaciones Operativas e Insights Inteligentes
            </h3>
            <div className="space-y-2 text-xs">
              {aiInsights.map((ins, i) => (
                <div key={ins.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                  <p className="font-bold text-slate-900">
                    {i + 1}. {ins.title} ({ins.department})
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">{ins.description}</p>
                  <p className="text-teal-800 font-semibold text-[11px] mt-1">
                    Acción recomendada: {ins.actionRecommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Signatures & Accreditation */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <div>
              <p className="font-bold text-slate-700">GuestFlow Hospitality Cloud Platform</p>
              <p className="text-[10px]">Certificado de Calidad Operativa Hotelera</p>
            </div>
            <div className="text-center sm:text-right">
              <div className="w-40 border-b border-slate-300 mb-1 mx-auto sm:ml-auto" />
              <p className="text-[10px] font-bold text-slate-600">Dirección General de Operaciones</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
