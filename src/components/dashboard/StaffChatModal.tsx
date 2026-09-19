import React, { useState, useEffect, useRef } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { GuestRequest } from '../../types';
import {
  X,
  Send,
  MessageSquare,
  Sparkles,
  CheckCheck,
  User,
  Clock,
  CheckCircle2,
  PhoneCall,
  Bell
} from 'lucide-react';

interface StaffChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: GuestRequest | null;
}

export const StaffChatModal: React.FC<StaffChatModalProps> = ({
  isOpen,
  onClose,
  request,
}) => {
  const {
    requests,
    sendChatMessage,
    markChatAsRead,
    updateRequestStatus,
    currentUser,
    currentHotel,
  } = useGuestFlow();

  const [message, setMessage] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync with live request from context
  const currentReq = request
    ? requests.find((r) => r.id === request.id) || request
    : null;

  const messagesList = currentReq?.messages || [];
  const hasUnread = !!currentReq?.hasUnreadGuestMessages;

  // When modal is open and has unread messages, mark messages as read by staff
  useEffect(() => {
    if (isOpen && currentReq?.id && hasUnread) {
      markChatAsRead(currentReq.id, 'staff');
    }
  }, [isOpen, currentReq?.id, hasUnread, markChatAsRead]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messagesList.length]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !currentReq) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const textToSend = message.trim();
    setMessage('');

    sendChatMessage({
      text: textToSend,
      sender: 'staff',
      senderName: currentUser?.name || 'Conserjería Front Desk',
      roomNumber: currentReq.roomNumber,
      requestId: currentReq.id,
    });
  };

  const handleQuickReply = (text: string) => {
    sendChatMessage({
      text,
      sender: 'staff',
      senderName: currentUser?.name || 'Conserjería Front Desk',
      roomNumber: currentReq.roomNumber,
      requestId: currentReq.id,
    });
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
        className="bg-white rounded-3xl max-w-xl w-full h-[680px] max-h-[92vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer border border-white/15"
            aria-label="Cerrar ventana de chat"
          >
            <X className="w-4 h-4" />
            <span>Cerrar</span>
          </button>

          <div className="flex items-center gap-3 pr-24">
            <div className="w-11 h-11 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Chat con Habitación {currentReq.roomNumber}</h3>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  {currentReq.code}
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-0.5">
                {currentReq.guestName} • Piso {currentReq.floor} • Edificio {currentReq.building}
              </p>
            </div>
          </div>

          {/* Quick status banner */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-300 text-[11px]">Estado:</span>
              <span className="font-bold px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px]">
                {currentReq.status}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentReq.status !== 'COMPLETADA' && (
                <button
                  type="button"
                  onClick={() => updateRequestStatus(currentReq.id, 'COMPLETADA')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] flex items-center gap-1 transition cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Marcar Atendido</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50">
          {/* Initial guest ticket preview */}
          <div className="bg-white rounded-2xl p-3 border border-slate-200 text-xs shadow-2xs space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>Ticket Original: {currentReq.category}</span>
              <span>{new Date(currentReq.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <h4 className="font-bold text-slate-800">{currentReq.title}</h4>
            <p className="text-slate-600">{currentReq.description}</p>
          </div>

          {/* Chat Messages */}
          {messagesList.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-teal-600" />
              <p>No hay mensajes en el hilo aún. Escribe el primer mensaje abajo.</p>
            </div>
          ) : (
            messagesList.map((m) => {
              const isStaff = m.sender === 'staff';
              const isAi = m.sender === 'ai_concierge';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                      isStaff
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : isAi
                        ? 'bg-cyan-50 border border-cyan-200 text-cyan-950 rounded-bl-none'
                        : 'bg-teal-600 text-white rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center gap-1 text-[10px] font-extrabold mb-1">
                      {isStaff ? (
                        <span className="text-teal-300 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span>{m.senderName} (Staff)</span>
                        </span>
                      ) : isAi ? (
                        <span className="text-cyan-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{m.senderName}</span>
                        </span>
                      ) : (
                        <span className="text-white flex items-center gap-1">
                          <span>👤</span>
                          <span>{m.senderName} (Huésped)</span>
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap">{m.text}</p>

                    <div
                      className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                        isStaff ? 'text-slate-400' : isAi ? 'text-cyan-600' : 'text-teal-200'
                      }`}
                    >
                      <span>{m.timestamp}</span>
                      {isStaff && <CheckCheck className="w-3 h-3 text-teal-400" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Canned Staff Responses */}
        <div className="px-3 pt-2 bg-white flex items-center gap-1.5 overflow-x-auto pb-1.5 shrink-0 scrollbar-none border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Respuestas rápidas:</span>
          {[
            '¡Con mucho gusto le atendemos!',
            'Un miembro del equipo va en camino a su habitación.',
            'Hemos programado su solicitud de taxi en el lobby.',
            'Toallas adicionales enviadas con Housekeeping.',
            'Late check-out aprobado con gusto hasta las 13:00.',
          ].map((canned, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickReply(canned)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-200/60"
            >
              {canned}
            </button>
          ))}
        </div>

        {/* Staff Input Form */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Responder a ${currentReq.guestName} (Hab. ${currentReq.roomNumber})...`}
              className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
              aria-label="Enviar respuesta a huésped"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">
              Respondiendo como: <strong>{currentUser?.name || 'Conserjería'}</strong> ({currentHotel.name})
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cerrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
