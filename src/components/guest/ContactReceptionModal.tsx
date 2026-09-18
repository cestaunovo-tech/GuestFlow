import React, { useState, useEffect } from 'react';
import { useGuestFlow } from '../../context/GuestFlowContext';
import { X, Send, PhoneCall, UserCheck, MessageSquare, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ContactReceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export const ContactReceptionModal: React.FC<ContactReceptionModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { t, createRequest, currentRoom, currentHotel } = useGuestFlow();

  const guestName = currentRoom?.guestName || 'Huésped';
  const roomNumber = currentRoom?.number || 'Sin asignar';

  const [message, setMessage] = useState('');
  const [assistanceType, setAssistanceType] = useState<'message' | 'call' | 'in_person'>('message');
  const [messagesHistory, setMessagesHistory] = useState<Array<{ sender: 'guest' | 'hotel'; text: string; time: string }>>([
    {
      sender: 'hotel',
      text: `¡Hola ${guestName}! Bienvenido/a a ${currentHotel.name}. Recepción está disponible las 24 horas para asistirte. ¿En qué podemos ayudarte?`,
      time: '10:00 AM',
    },
  ]);

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

    const userText = message;
    setMessage('');

    setMessagesHistory((prev) => [
      ...prev,
      { sender: 'guest', text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    ]);

    // Create real request
    const newReq = createRequest({
      category: 'Contactar recepción',
      subCategory: 'Mensaje directo',
      title: `Consulta huésped: ${userText.slice(0, 40)}`,
      description: userText,
      department: 'RECEPCION',
      priority: 'MEDIA',
    });

    // Auto-respond for realistic interactive hospitality feel
    setTimeout(() => {
      setMessagesHistory((prev) => [
        ...prev,
        {
          sender: 'hotel',
          text: `Gracias por contactarnos. Nuestro equipo de recepción en lobby ha recibido tu mensaje (#${newReq.code}) y te atenderá de inmediato.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);

    onSuccess(newReq.code);
  };

  const handleRequestCall = () => {
    const req = createRequest({
      category: 'Contactar recepción',
      subCategory: 'Solicitud de llamada',
      title: `Llamada telefónica a Hab. ${roomNumber}`,
      description: `El huésped solicita que recepción le llame al teléfono de la habitación.`,
      department: 'RECEPCION',
      priority: 'ALTA',
    });
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
    onSuccess(req.code);
    onClose();
  };

  const handleRequestInPerson = () => {
    const req = createRequest({
      category: 'Contactar recepción',
      subCategory: 'Asistencia presencial',
      title: `Asistencia en puerta Hab. ${roomNumber}`,
      description: `El huésped solicita presencia de un concierge o botones en su habitación.`,
      department: 'RECEPCION',
      priority: 'ALTA',
    });
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // ignore
    }
    onSuccess(req.code);
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
        className="bg-white rounded-3xl max-w-lg w-full h-[650px] max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden cursor-default"
      >
        {/* Header */}
        <div className="relative px-6 py-4 bg-gradient-to-r from-slate-900 to-emerald-950 text-white shrink-0">
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
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shrink-0">
              🛎️
            </div>
            <div>
              <h3 className="text-base font-bold">{t.receptionTitle}</h3>
              <p className="text-xs text-emerald-200/80">
                Front Desk 24/7 • Hab. {roomNumber} ({guestName})
              </p>
            </div>
          </div>

          {/* Quick Action Tabs */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setAssistanceType('message')}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                assistanceType === 'message' ? 'bg-white text-slate-900 shadow-xs' : 'bg-white/10 text-slate-200 hover:bg-white/20'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
            <button
              type="button"
              onClick={handleRequestCall}
              className="py-1.5 px-2 rounded-lg text-xs font-bold bg-white/10 text-slate-200 hover:bg-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
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

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
          {messagesHistory.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'guest' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                  m.sender === 'guest'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                }`}
              >
                <p>{m.text}</p>
                <span
                  className={`text-[9px] block mt-1 ${
                    m.sender === 'guest' ? 'text-teal-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Question Chips */}
        <div className="px-3 pt-2 bg-white flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 shrink-0">Pedir directo:</span>
          {['¿A qué hora es el check-out?', '¿Clave de WiFi?', 'Necesito un taxi', 'Toallas extra para habitación'].map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMessage(chip)}
              className="text-[10px] px-2.5 py-1 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 font-medium whitespace-nowrap transition cursor-pointer shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Chat Input & Bottom Close Button */}
        <div className="p-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t.typeMessagePlaceholder || 'Escribe tu mensaje a recepción...'}
              className="flex-1 text-xs rounded-xl border border-slate-200 px-3.5 py-2.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500 text-slate-800"
            />
            <button
              type="submit"
              disabled={!message.trim()}
              className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white transition shadow-sm cursor-pointer"
              aria-label="Enviar mensaje"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-slate-400">Atención 24h • Recepción del Hotel</span>
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 px-2 py-1 rounded hover:bg-slate-100 transition cursor-pointer flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cerrar chat</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
