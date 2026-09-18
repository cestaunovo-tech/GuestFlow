import React, { useState } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestRequest, RequestStatus } from '../../types';
import { CheckCircle2, Clock, Star, MessageSquare, AlertCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuestRequestsTrackerProps {
  onOpenChatWithStaff?: (code: string) => void;
}

export const GuestRequestsTracker: React.FC<GuestRequestsTrackerProps> = () => {
  const { t, requests, currentHotel, currentRoom, rateRequest } = useGuestFlow();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [ratingInput, setRatingInput] = useState<{ [reqId: string]: number }>({});
  const [feedbackInput, setFeedbackInput] = useState<{ [reqId: string]: string }>({});
  const [submittedRatings, setSubmittedRatings] = useState<{ [reqId: string]: boolean }>({});

  if (!currentRoom) return null;

  // Filter requests for the current room
  const roomRequests = requests.filter(
    (r) => r.hotelId === currentHotel.id && r.roomNumber === currentRoom.number
  );

  if (roomRequests.length === 0) return null;

  const handleRate = (reqId: string) => {
    const score = ratingInput[reqId] || 5;
    const text = feedbackInput[reqId] || '';
    rateRequest(reqId, score, text);
    setSubmittedRatings((prev) => ({ ...prev, [reqId]: true }));
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {
      // ignore
    }
  };

  const getStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case 'RECIBIDA':
        return {
          label: '🟡 Recibida por el sistema',
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          step: 1,
        };
      case 'ASIGNADA':
        return {
          label: '🔵 Personal Asignado',
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          step: 2,
        };
      case 'EN_PROCESO':
        return {
          label: '⚙️ En Preparación / Proceso',
          bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
          step: 3,
        };
      case 'EN_CAMINO':
        return {
          label: '🚶 En camino a la habitación',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          step: 3,
        };
      case 'COMPLETADA':
        return {
          label: '🟢 Completada con éxito',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          step: 4,
        };
      case 'CANCELADA':
        return {
          label: '⚪ Cancelada',
          bg: 'bg-slate-100 text-slate-700 border-slate-200',
          step: 0,
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden mt-6">
      {/* Tracker Header */}
      <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-400 animate-pulse" />
          <h3 className="text-sm font-bold">{t.myRequests}</h3>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
            {roomRequests.length}
          </span>
        </div>
        <p className="text-[11px] text-teal-300">Hab. {currentRoom.number}</p>
      </div>

      {/* Requests List */}
      <div className="divide-y divide-slate-100">
        {roomRequests.map((req) => {
          const badge = getStatusBadge(req.status);
          const isExpanded = expandedId === req.id;
          const isCompleted = req.status === 'COMPLETADA';
          const hasBeenRated = !!req.rating || submittedRatings[req.id];

          return (
            <div key={req.id} className="p-4 sm:p-5 transition hover:bg-slate-50/50">
              <div
                className="flex items-start justify-between gap-3 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : req.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200/60">
                      {req.code}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{req.description}</p>
                </div>

                <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Progress Steps Indicator */}
              <div className="mt-3.5 pt-3 border-t border-slate-100">
                <div className="grid grid-cols-4 gap-1 text-center">
                  {[
                    { label: 'Recibida', step: 1 },
                    { label: 'Asignada', step: 2 },
                    { label: 'En camino', step: 3 },
                    { label: 'Lista', step: 4 },
                  ].map((s) => {
                    const active = badge.step >= s.step;
                    return (
                      <div key={s.step} className="flex flex-col items-center">
                        <div
                          className={`w-full h-1.5 rounded-full transition ${
                            active ? 'bg-teal-500' : 'bg-slate-200'
                          }`}
                        />
                        <span
                          className={`text-[9px] mt-1 font-semibold ${
                            active ? 'text-teal-700 font-bold' : 'text-slate-400'
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-3 animate-in fade-in">
                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 text-slate-600">
                    <div className="flex justify-between">
                      <span className="font-semibold">{t.area}:</span>
                      <span className="font-bold text-slate-800">{req.department}</span>
                    </div>
                    {req.assignedTo && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Atendido por:</span>
                        <span className="font-bold text-teal-800">{req.assignedTo}</span>
                      </div>
                    )}
                    {req.totalAmount && (
                      <div className="flex justify-between">
                        <span className="font-semibold">Monto a cargar a habitación:</span>
                        <span className="font-bold text-slate-900">${req.totalAmount} USD</span>
                      </div>
                    )}
                    {req.routeReason && (
                      <div className="text-[10px] text-teal-700 italic pt-1">
                        ✨ {req.routeReason}
                      </div>
                    )}
                  </div>

                  {/* CSAT Survey when completed */}
                  {isCompleted && (
                    <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200/80 space-y-2.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span>{t.howWasYourExperience}</span>
                      </div>

                      {hasBeenRated ? (
                        <div className="text-xs text-teal-800 font-semibold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-teal-600" />
                          <span>{t.thankYouFeedback} ({req.rating || ratingInput[req.id]} ⭐)</span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-[11px] text-slate-600">{t.rateOurService}</p>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const currentScore = ratingInput[req.id] || 5;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() =>
                                    setRatingInput((prev) => ({ ...prev, [req.id]: star }))
                                  }
                                  className="p-1 hover:scale-110 transition"
                                >
                                  <Star
                                    className={`w-6 h-6 ${
                                      star <= currentScore
                                        ? 'fill-amber-400 text-amber-500'
                                        : 'text-slate-300'
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>

                          <input
                            type="text"
                            value={feedbackInput[req.id] || ''}
                            onChange={(e) =>
                              setFeedbackInput((prev) => ({ ...prev, [req.id]: e.target.value }))
                            }
                            placeholder={t.leaveFeedbackPlaceholder}
                            className="w-full text-xs rounded-xl border border-teal-200 bg-white p-2 text-slate-800"
                          />

                          <button
                            type="button"
                            onClick={() => handleRate(req.id)}
                            className="w-full py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition"
                          >
                            {t.submitFeedback}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
