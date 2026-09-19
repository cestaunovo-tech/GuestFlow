import React, { useState, useEffect, useRef } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { X, Send, PhoneCall, UserCheck, MessageSquare, Sparkles, Check, CheckCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const ContactReceptionModal: React.FC<ContactReceptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    t,
    currentRoom,
    currentHotel,
    sendChatMessage,
    markChatAsRead,
    getRoomChatRequest,
    createRequest,
  } = useGuestFlow();

  const guestName = currentRoom?.guestName || 'Huésped';
  const roomNumber = currentRoom?.number || 'Sin asignar';

  const [message, setMessage] = useState('');
  const [assistanceType, setAssistanceType] = useState<'message' | 'call' | 'in_person'>('message');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Retrieve active persistent chat thread for this room
  const activeChatReq = getRoomChatRequest(roomNumber);
  const messagesList = activeChatReq?.messages || [];
  const hasUnread = !!activeChatReq?.hasUnreadStaffMessages;

  // When modal is open and has unread messages, mark messages as read by guest
  useEffect(() => {
    if (isOpen && activeChatReq?.id && hasUnread) {
      markChatAsRead(activeChatReq.id, 'guest');
    }
  }, [isOpen, activeChatReq?.id, hasUnread, markChatAsRead]);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messagesList.length]);

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userText = message.trim();
    setMessage('');

    const updatedReq = sendChatMessage({
      text: userText,
      sender: 'guest',
      senderName: guestName,
      roomNumber,
      requestId: activeChatReq?.id,
    });

    onSuccess(updatedReq.code);
  };

  const handleRequestCall = () => {
    const req = createRequest({
      category: 'Conserjería & Recepción',
      subCategory: 'Solicitud de llamada',
      title: `Llamada telefónica a Hab. ${roomNumber}`,
      description: `El huésped solicita que conserjería / recepción le llame al teléfono de la habitación.`,
      department: 'RECEPCION',
      priority: 'ALTA',
    });

    sendChatMessage({
      text: `📞 Solicitud de llamada telefónica registrada (#${req.code}). Por favor comunicarse a la habitación ${roomNumber}.`,
      sender: 'guest',
      senderName: guestName,
      roomNumber,
      requestId: req.id,
    });

    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
    onSuccess(req.code);
    setAssistanceType('message');
  };

  const handleRequestInPerson = () => {
    const req = createRequest({
      category: 'Conserjería & Recepción',
      subCategory: 'Asistencia presencial',
      title: `Asistencia presencial en Hab. ${roomNumber}`,
      description: `El huésped solicita presencia física de un concierge o botones en su habitación.`,
      department: 'RECEPCION',
      priority: 'ALTA',
    });

    sendChatMessage({
      text: `👤 Solicitud de asistencia presencial (#${req.code}). Se requiere un conserje o botones en la habitación ${roomNumber}.`,
      sender: 'guest',
      senderName: guestName,
      roomNumber,
      requestId: req.id,
    });

    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
    onSuccess(req.code);
    setAssistanceType('message');
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
        className="bg-white rounded-3xl max-w-lg w-full h-[660px] max-h-[92vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white shrink-0">
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
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-xl shrink-0">
              🛎️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold">Conserjería & Recepción 24/7</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-[10px] font-bold border border-teal-400/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  En línea
                </span>
              </div>
              <p className="text-xs text-teal-200/80 mt-0.5">
                Hab. {roomNumber} • {guestName} • {currentHotel.name}
              </p>
            </div>
          </div>

          {/* Action Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAssistanceType('message')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                assistanceType === 'message'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat en Vivo</span>
            </button>
            <button
              type="button"
              onClick={handleRequestCall}
              className="py-1.5 px-2 rounded-lg text-xs font-bold bg-white/10 text-slate-200 hover:bg-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-400" />
              <span>Pedir llamada</span>
            </button>
            <button
              type="button"
              onClick={handleRequestInPerson}
              className="py-1.5 px-2 rounded-lg text-xs font-bold bg-white/10 text-slate-200 hover:bg-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Asistencia</span>
            </button>
          </div>
        </div>

        {/* Chat Conversation Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/80">
          {/* Default initial warm greeting from the hotel */}
          <div className="flex flex-col items-start">
            <div className="max-w-[85%] rounded-2xl rounded-bl-none px-4 py-3 text-xs bg-white text-slate-800 border border-slate-200/80 shadow-2xs leading-relaxed">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-teal-700 mb-1">
                <span>🛎️</span>
                <span>Front Desk & Conserjería {currentHotel.name}</span>
              </div>
              <p>
                ¡Hola <strong>{guestName}</strong>! Te damos la bienvenida a {currentHotel.name}. Nuestro equipo de conserjes y front desk está disponible las 24 horas para asistirte con reservas, traslados, recomendaciones o cualquier requerimiento para tu habitación.
              </p>
              <span className="text-[9px] block text-slate-400 mt-1.5 text-right">
                Canal Oficial 24/7
              </span>
            </div>
          </div>

          {/* Persistent messages */}
          {messagesList.map((m) => {
            const isGuest = m.sender === 'guest';
            const isAi = m.sender === 'ai_concierge';

            return (
              <div
                key={m.id}
                className={`flex flex-col ${isGuest ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                    isGuest
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : isAi
                      ? 'bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 text-teal-950 rounded-bl-none'
                      : 'bg-white text-slate-800 border border-slate-200/90 rounded-bl-none'
                  }`}
                >
                  {!isGuest && (
                    <div className="flex items-center gap-1 text-[10px] font-extrabold mb-1">
                      {isAi ? (
                        <span className="text-teal-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>{m.senderName}</span>
                        </span>
                      ) : (
                        <span className="text-slate-900 flex items-center gap-1">
                          <span>🛎️</span>
                          <span>{m.senderName}</span>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{m.text}</p>

                  <div
                    className={`flex items-center justify-end gap-1 text-[9px] mt-1 ${
                      isGuest ? 'text-teal-200' : 'text-slate-400'
                    }`}
                  >
                    <span>{m.timestamp}</span>
                    {isGuest && <CheckCheck className="w-3 h-3 text-teal-200" />}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={chatBottomRef} />
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 pt-2 bg-white flex items-center gap-1.5 overflow-x-auto pb-1.5 shrink-0 scrollbar-none border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Consultas rápidas:</span>
          {[
            '¿Cuál es la clave de WiFi?',
            '¿A qué hora es el check-out?',
            'Necesito un taxi al aeropuerto',
            'Toallas adicionales para habitación',
            '¿A qué hora abre el desayuno?',
            'Horario del Spa y Piscina',
          ].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMessage(chip)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 font-medium whitespace-nowrap transition cursor-pointer shrink-0 border border-slate-200/60"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input & Bottom Controls */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe tu mensaje o consulta a los conserjes..."
              className="flex-1 text-xs sm:text-sm rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800 bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
              aria-label="Enviar mensaje a conserjes"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Conserjes y Front Desk en línea • Respuesta inmediata</span>
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

