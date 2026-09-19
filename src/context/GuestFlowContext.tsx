import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Hotel,
  Room,
  GuestRequest,
  RequestChatMessage,
  MenuItem,
  DirectoryItem,
  DestinationItem,
  AIInsight,
  HotelStaffUser,
  Language,
  UserRole,
  Department,
  RequestStatus,
  RequestPriority,
  DoorSignStatus,
  OrderItem
} from '../types';
import {
  INITIAL_HOTELS,
  INITIAL_ROOMS,
  INITIAL_REQUESTS,
  INITIAL_MENU,
  INITIAL_DIRECTORY,
  INITIAL_DESTINATIONS,
  INITIAL_STAFF_USERS,
  INITIAL_AI_INSIGHTS
} from '../data/initialData';
import { translations, Translations } from '../i18n/translations';
import { canManageRoomsAndQr, getRoleDepartment } from '../utils/rbac';
import {
  seedInitialDataIfEmpty,
  subscribeToHotelRequests,
  subscribeToHotelRooms,
  saveRequestToFirestore,
  updateRoomDoorSignInFirestore,
  saveRoomToFirestore,
  deleteRoomFromFirestore,
  purgeExampleRoomsFromFirestore
} from '../services/firebaseDb';
import { auth, onAuthStateChanged } from '../lib/firebase';

interface NotificationToast {
  id: string;
  title: string;
  message: string;
  department?: Department;
  roomNumber?: string;
  timestamp: string;
  read: boolean;
}

interface GuestFlowContextType {
  // Multitenant & Hotel
  hotels: Hotel[];
  currentHotel: Hotel;
  switchHotel: (hotelId: string) => void;
  updateHotelConfig: (updated: Partial<Hotel>) => void;
  isFirebaseConnected: boolean;

  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;

  // Roles & View Mode
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: HotelStaffUser | null;
  setCurrentUser: (user: HotelStaffUser | null) => void;
  staffUsers: HotelStaffUser[];
  canManageRoomsAndQr: boolean;
  userDepartment: Department | 'ALL';
  activeView: 'guest' | 'dashboard';
  setActiveView: (view: 'guest' | 'dashboard') => void;

  // Room (Guest mode & Management)
  currentRoom: Room | null;
  rooms: Room[];
  switchRoom: (roomNumber: string) => void;
  updateDoorSign: (status: DoorSignStatus, note?: string, preferredTime?: string) => void;
  createRoom: (roomData: {
    number: string;
    type: string;
    floor: number;
    building?: string;
    guestName?: string;
  }) => Promise<Room>;
  deleteRoom: (roomId: string) => Promise<void>;
  clearExampleRooms: () => Promise<void>;

  // Requests / Tickets
  requests: GuestRequest[];
  createRequest: (data: {
    category: string;
    subCategory?: string;
    title: string;
    description: string;
    department?: Department;
    priority?: RequestPriority;
    items?: OrderItem[];
    totalAmount?: number;
    photoUrl?: string;
  }) => GuestRequest;
  updateRequestStatus: (requestId: string, newStatus: RequestStatus, assignedTo?: string) => void;
  rateRequest: (requestId: string, rating: number, feedback?: string) => void;
  deleteRequest: (requestId: string) => void;

  // Concierge & Front Desk Real-Time Chat
  sendChatMessage: (params: {
    text: string;
    sender: 'guest' | 'staff';
    senderName?: string;
    roomNumber?: string;
    requestId?: string;
  }) => GuestRequest;
  markChatAsRead: (requestId: string, forWhom: 'guest' | 'staff') => void;
  getRoomChatRequest: (roomNumber?: string) => GuestRequest | undefined;

  // Room Service Menu & Cart
  menuItems: MenuItem[];
  cart: OrderItem[];
  addToCart: (item: MenuItem, notes?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  submitRoomServiceOrder: (specialNotes?: string) => GuestRequest;

  // Directory & Destination
  directoryItems: DirectoryItem[];
  destinationItems: DestinationItem[];
  updateDirectoryItem: (id: string, updated: Partial<DirectoryItem>) => void;
  updateDestinationItem: (id: string, updated: Partial<DestinationItem>) => void;

  // AI & Analytics
  aiInsights: AIInsight[];
  refreshAIInsights: () => void;
  isGeneratingAI: boolean;

  // Notifications
  notifications: NotificationToast[];
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Smart Auto-Triage Helper
  autoTriageRequest: (text: string) => { department: Department; category: string; priority: RequestPriority };

  // Calculated Operational KPIs
  stats: {
    totalRequests: number;
    pendingCount: number;
    inProgressCount: number;
    completedCount: number;
    urgentCount: number;
    avgResponseMinutes: number;
    avgResolutionMinutes: number;
    csatScore: number;
    requestsByDept: Record<Department, number>;
  };
}

const GuestFlowContext = createContext<GuestFlowContextType | undefined>(undefined);

export const GuestFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const LS_PREFIX = 'guestflow_';

  // State: Hotels
  const [hotels, setHotels] = useState<Hotel[]>(() => {
    const saved = localStorage.getItem(`${LS_PREFIX}hotels`);
    return saved ? JSON.parse(saved) : INITIAL_HOTELS;
  });
  const [currentHotelId, setCurrentHotelId] = useState<string>('hotel-1');

  const currentHotel = useMemo(() => {
    return hotels.find((h) => h.id === currentHotelId) || hotels[0];
  }, [hotels, currentHotelId]);

  // State: Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(`${LS_PREFIX}lang`);
    return (saved as Language) || 'es';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(`${LS_PREFIX}lang`, lang);
  };

  const t = useMemo(() => translations[language] || translations.es, [language]);

  // State: Roles & View
  const [currentRole, setCurrentRoleState] = useState<UserRole>('GUEST');
  const [activeView, setActiveView] = useState<'guest' | 'dashboard'>('guest');
  const [staffUsers] = useState<HotelStaffUser[]>(INITIAL_STAFF_USERS);
  const [currentUser, setCurrentUser] = useState<HotelStaffUser | null>(INITIAL_STAFF_USERS[0]);

  const canManageRoomsAndQrVal = useMemo(() => canManageRoomsAndQr(currentRole), [currentRole]);
  const userDepartment = useMemo(() => getRoleDepartment(currentRole), [currentRole]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    const matchingStaff = staffUsers.find((u) => u.role === role);
    if (matchingStaff) {
      setCurrentUser(matchingStaff);
    }
  };

  // State: Rooms
  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${LS_PREFIX}rooms`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Room[];
        // Filter out any legacy dummy rooms
        return parsed.filter(
          (r) => !['405', '401', '402', '308', '210', '104'].includes(r.number)
        );
      } catch {
        return INITIAL_ROOMS;
      }
    }
    return INITIAL_ROOMS;
  });
  const [currentRoomNumber, setCurrentRoomNumber] = useState<string>('');

  const currentRoom = useMemo(() => {
    const hotelRooms = rooms.filter((r) => r.hotelId === currentHotel.id);
    return (
      hotelRooms.find((r) => r.number === currentRoomNumber) ||
      hotelRooms[0] ||
      null
    );
  }, [rooms, currentHotel.id, currentRoomNumber]);

  // Deep linking and URL params handling: separation of Guest vs Dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlHotel = params.get('hotel');
      const urlRoom = params.get('room');
      const urlView = params.get('view');

      if (urlHotel) {
        setCurrentHotelId(urlHotel);
      }
      if (urlRoom) {
        setCurrentRoomNumber(urlRoom);
        setActiveView('guest');
        setCurrentRole('GUEST');
      } else if (urlView === 'guest') {
        setActiveView('guest');
        setCurrentRole('GUEST');
      } else if (urlView === 'dashboard') {
        setActiveView('dashboard');
        setCurrentRole('RECEPCION');
      }
    }
  }, []);

  // Purge legacy example rooms from local storage and firestore
  useEffect(() => {
    const dummyRoomNumbers = ['405', '401', '402', '308', '210', '104'];
    const saved = localStorage.getItem(`${LS_PREFIX}rooms`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Room[];
        const cleaned = parsed.filter((r) => !dummyRoomNumbers.includes(r.number));
        if (cleaned.length !== parsed.length) {
          setRooms(cleaned);
          localStorage.setItem(`${LS_PREFIX}rooms`, JSON.stringify(cleaned));
        }
      } catch {
        localStorage.removeItem(`${LS_PREFIX}rooms`);
      }
    }
    const savedReqs = localStorage.getItem(`${LS_PREFIX}requests`);
    if (savedReqs) {
      try {
        const parsedReqs = JSON.parse(savedReqs) as GuestRequest[];
        const cleanedReqs = parsedReqs.filter((req) => !dummyRoomNumbers.includes(req.roomNumber));
        if (cleanedReqs.length !== parsedReqs.length) {
          setRequests(cleanedReqs);
          localStorage.setItem(`${LS_PREFIX}requests`, JSON.stringify(cleanedReqs));
        }
      } catch {
        localStorage.removeItem(`${LS_PREFIX}requests`);
      }
    }
    purgeExampleRoomsFromFirestore();
  }, []);

  // State: Requests
  const [requests, setRequests] = useState<GuestRequest[]>(() => {
    const saved = localStorage.getItem(`${LS_PREFIX}requests`);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  // State: Menu, Directory, Destinations, Insights
  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [directoryItems, setDirectoryItems] = useState<DirectoryItem[]>(INITIAL_DIRECTORY);
  const [destinationItems, setDestinationItems] = useState<DestinationItem[]>(INITIAL_DESTINATIONS);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // State: Cart
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Initial Firestore seed & listeners
  useEffect(() => {
    seedInitialDataIfEmpty();
  }, []);

  // Real-time Firestore sync for current hotel (Multi-tenant)
  useEffect(() => {
    const unsubRequests = subscribeToHotelRequests(currentHotel.id, (freshRequests) => {
      setRequests(freshRequests);
      setIsFirebaseConnected(true);
    });

    const unsubRooms = subscribeToHotelRooms(currentHotel.id, (freshRooms) => {
      setRooms(freshRooms);
      setIsFirebaseConnected(true);
    });

    return () => {
      unsubRequests();
      unsubRooms();
    };
  }, [currentHotel.id]);

  // Firebase Auth listener
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setIsFirebaseConnected(true);
        // If current user is not set or changed, set basic info
        setCurrentUser((prev) => {
          if (prev && prev.id === fbUser.uid) return prev;
          return {
            id: fbUser.uid,
            hotelId: currentHotel.id,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Personal de Hotel',
            email: fbUser.email || '',
            role: currentRole || 'RECEPCION',
            department: 'RECEPCION',
            avatar: fbUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            online: true,
          };
        });
      }
    });
    return () => unsubAuth();
  }, [currentHotel.id, currentRole]);

  // State: Notifications
  const [notifications, setNotifications] = useState<NotificationToast[]>([
    {
      id: 'notif-1',
      title: 'Nueva Solicitud: Toallas',
      message: 'Habitación 405 solicita 2 toallas de baño.',
      department: 'HOUSEKEEPING',
      roomNumber: '405',
      timestamp: 'Hace 18 min',
      read: false,
    },
    {
      id: 'notif-2',
      title: 'Cartel de Puerta Actualizado',
      message: 'Habitación 402 activó "Limpieza ahora".',
      department: 'HOUSEKEEPING',
      roomNumber: '402',
      timestamp: 'Hace 35 min',
      read: false,
    },
  ]);

  // Save changes to LocalStorage
  useEffect(() => {
    localStorage.setItem(`${LS_PREFIX}requests`, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(`${LS_PREFIX}rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${LS_PREFIX}hotels`, JSON.stringify(hotels));
  }, [hotels]);

  // Auto-Triage logic: Maps guest query or keywords to exact department & priority
  const autoTriageRequest = (text: string): { department: Department; category: string; priority: RequestPriority } => {
    const lower = text.toLowerCase();

    // Mantenimiento (Technical / facilities)
    if (
      lower.includes('aire') ||
      lower.includes('ac') ||
      lower.includes('clima') ||
      lower.includes('gotea') ||
      lower.includes('luz') ||
      lower.includes('electricidad') ||
      lower.includes('tv') ||
      lower.includes('tele') ||
      lower.includes('wi-fi') ||
      lower.includes('wifi') ||
      lower.includes('internet') ||
      lower.includes('agua') ||
      lower.includes('caliente') ||
      lower.includes('fuga') ||
      lower.includes('puerta') ||
      lower.includes('cerradura') ||
      lower.includes('llave') ||
      lower.includes('ruido') ||
      lower.includes('baño') ||
      lower.includes('ducha')
    ) {
      const isUrgent = lower.includes('fuga') || lower.includes('inund') || lower.includes('humo') || lower.includes('sin agua');
      return {
        department: 'MANTENIMIENTO',
        category: lower.includes('aire') ? 'Aire acondicionado' : lower.includes('wifi') ? 'Wi-Fi' : 'Incidencia Técnica',
        priority: isUrgent ? 'URGENTE' : 'ALTA',
      };
    }

    // Room Service (Food & Beverage)
    if (
      lower.includes('hamburguesa') ||
      lower.includes('sandwich') ||
      lower.includes('comer') ||
      lower.includes('comida') ||
      lower.includes('cena') ||
      lower.includes('almuerzo') ||
      lower.includes('desayuno') ||
      lower.includes('vino') ||
      lower.includes('bebida') ||
      lower.includes('cerveza') ||
      lower.includes('hielo') ||
      lower.includes('postre') ||
      lower.includes('café') ||
      lower.includes('cafe')
    ) {
      return {
        department: 'ROOM_SERVICE',
        category: 'Room Service',
        priority: 'MEDIA',
      };
    }

    // Housekeeping (Cleaning, amenities, towels)
    if (
      lower.includes('toalla') ||
      lower.includes('limpi') ||
      lower.includes('aseo') ||
      lower.includes('sabana') ||
      lower.includes('almohada') ||
      lower.includes('manta') ||
      lower.includes('shampoo') ||
      lower.includes('jabon') ||
      lower.includes('jabón') ||
      lower.includes('amenities') ||
      lower.includes('papel') ||
      lower.includes('cepillo')
    ) {
      return {
        department: 'HOUSEKEEPING',
        category: lower.includes('toalla') ? 'Toallas' : lower.includes('limpi') ? 'Limpieza' : 'Amenities',
        priority: 'MEDIA',
      };
    }

    // Default to Recepción
    return {
      department: 'RECEPCION',
      category: 'Atención al Huésped',
      priority: 'MEDIA',
    };
  };

  // Create Request with real-time routing
  const createRequest = (data: {
    category: string;
    subCategory?: string;
    title: string;
    description: string;
    department?: Department;
    priority?: RequestPriority;
    items?: OrderItem[];
    totalAmount?: number;
    photoUrl?: string;
  }): GuestRequest => {
    // Determine department
    let targetDept = data.department;
    let targetPriority = data.priority || 'MEDIA';
    let routeReason = '';

    if (!targetDept) {
      const triage = autoTriageRequest(`${data.category} ${data.title} ${data.description}`);
      targetDept = triage.department;
      targetPriority = data.priority || triage.priority;
      routeReason = `Clasificación inteligente automática -> Derivado a ${targetDept}`;
    } else {
      routeReason = `Seleccionado directamente por huésped -> Derivado a ${targetDept}`;
    }

    const nextCode = `GF-${Math.floor(10400 + requests.length + 10)}`;
    const newReq: GuestRequest = {
      id: `req-${Date.now()}`,
      code: nextCode,
      hotelId: currentHotel.id,
      roomNumber: currentRoom ? currentRoom.number : 'Sin Asignar',
      floor: currentRoom ? currentRoom.floor : 1,
      building: currentRoom ? currentRoom.building : 'Principal',
      guestName: currentRoom ? currentRoom.guestName : 'Huésped',
      department: targetDept,
      category: data.category,
      subCategory: data.subCategory,
      title: data.title,
      description: data.description,
      items: data.items,
      totalAmount: data.totalAmount,
      photoUrl: data.photoUrl,
      status: 'RECIBIDA',
      priority: targetPriority,
      createdAt: new Date().toISOString(),
      autoRouted: true,
      routeReason,
    };

    setRequests((prev) => [newReq, ...prev]);

    // Persist to Cloud Firestore (Real-time multi-tenant database)
    saveRequestToFirestore(newReq);

    // Push notification for hotel staff
    const notif: NotificationToast = {
      id: `notif-${Date.now()}`,
      title: `Nueva Solicitud: ${newReq.category}`,
      message: `Hab. ${newReq.roomNumber} (${newReq.department}): "${newReq.title}"`,
      department: newReq.department,
      roomNumber: newReq.roomNumber,
      timestamp: 'Ahora mismo',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newReq;
  };

  // Update status (staff workflow)
  const updateRequestStatus = (requestId: string, newStatus: RequestStatus, assignedToName?: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        const now = new Date().toISOString();
        const updated: GuestRequest = {
          ...req,
          status: newStatus,
        };

        if (newStatus === 'ASIGNADA' || (newStatus === 'EN_PROCESO' && !req.acceptedAt)) {
          updated.acceptedAt = req.acceptedAt || now;
          if (assignedToName) updated.assignedTo = assignedToName;
        }
        if (newStatus === 'EN_PROCESO' || newStatus === 'EN_CAMINO') {
          updated.startedAt = req.startedAt || now;
        }
        if (newStatus === 'COMPLETADA') {
          updated.completedAt = now;
        }

        // Sync change with Cloud Firestore
        saveRequestToFirestore(updated);

        return updated;
      })
    );
  };

  // Rate service
  const rateRequest = (requestId: string, rating: number, feedback?: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === requestId) {
          const updated = { ...r, rating, feedback };
          saveRequestToFirestore(updated);
          return updated;
        }
        return r;
      })
    );
  };

  const deleteRequest = (requestId: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== requestId));
  };

  // Get active concierge/reception chat request for a room
  const getRoomChatRequest = useCallback((roomNumber?: string): GuestRequest | undefined => {
    const rNum = roomNumber || currentRoom?.number;
    if (!rNum) return undefined;
    return requests.find(
      (r) =>
        r.hotelId === currentHotel.id &&
        r.roomNumber === rNum &&
        r.department === 'RECEPCION' &&
        (r.category === 'Conserjería & Recepción' || r.category === 'Contactar recepción' || !!r.messages) &&
        r.status !== 'CANCELADA'
    );
  }, [requests, currentHotel.id, currentRoom?.number]);

  // Real-Time Concierge & Front Desk 2-Way Chat
  const sendChatMessage = (params: {
    text: string;
    sender: 'guest' | 'staff';
    senderName?: string;
    roomNumber?: string;
    requestId?: string;
  }): GuestRequest => {
    const rNumber = params.roomNumber || (currentRoom ? currentRoom.number : 'Sin Asignar');
    const guestObj = rooms.find((r) => r.hotelId === currentHotel.id && r.number === rNumber);
    const guestName = guestObj?.guestName || (currentRoom?.guestName || 'Huésped');
    const floor = guestObj?.floor || currentRoom?.floor || 1;
    const building = guestObj?.building || currentRoom?.building || 'Principal';

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMsg: RequestChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      sender: params.sender,
      senderName:
        params.senderName ||
        (params.sender === 'guest'
          ? guestName
          : currentUser?.name || 'Conserje Front Desk'),
      text: params.text,
      timestamp: timeStr,
    };

    // Find existing active concierge / reception request for this room or specific requestId
    let existingReq = params.requestId
      ? requests.find((r) => r.id === params.requestId)
      : requests.find(
          (r) =>
            r.hotelId === currentHotel.id &&
            r.roomNumber === rNumber &&
            r.department === 'RECEPCION' &&
            r.status !== 'CANCELADA'
        );

    let updatedReq: GuestRequest;

    if (existingReq) {
      const updatedMessages = [...(existingReq.messages || []), newMsg];
      updatedReq = {
        ...existingReq,
        description: params.text,
        messages: updatedMessages,
        hasUnreadStaffMessages: params.sender === 'staff' ? true : false,
        hasUnreadGuestMessages: params.sender === 'guest' ? true : false,
        status: existingReq.status === 'COMPLETADA' ? 'EN_PROCESO' : existingReq.status,
      };

      setRequests((prev) => prev.map((r) => (r.id === updatedReq.id ? updatedReq : r)));
      saveRequestToFirestore(updatedReq);
    } else {
      const nextCode = `GF-${Math.floor(10400 + requests.length + 10)}`;
      updatedReq = {
        id: `req-${Date.now()}`,
        code: nextCode,
        hotelId: currentHotel.id,
        roomNumber: rNumber,
        floor,
        building,
        guestName,
        department: 'RECEPCION',
        category: 'Conserjería & Recepción',
        subCategory: 'Chat en Vivo',
        title: `Chat con Hab. ${rNumber} (${guestName})`,
        description: params.text,
        status: 'RECIBIDA',
        priority: 'MEDIA',
        createdAt: now.toISOString(),
        autoRouted: true,
        routeReason: 'Canal de mensajería directa con Conserjes y Recepción',
        messages: [newMsg],
        hasUnreadStaffMessages: params.sender === 'staff',
        hasUnreadGuestMessages: params.sender === 'guest',
      };

      setRequests((prev) => [updatedReq, ...prev]);
      saveRequestToFirestore(updatedReq);
    }

    // If sent by guest, notify staff & optionally trigger smart concierge assistant
    if (params.sender === 'guest') {
      const notif: NotificationToast = {
        id: `notif-${Date.now()}`,
        title: `Nuevo mensaje de Hab. ${rNumber}`,
        message: `${guestName}: "${params.text.slice(0, 60)}"`,
        department: 'RECEPCION',
        roomNumber: rNumber,
        timestamp: 'Ahora mismo',
        read: false,
      };
      setNotifications((prev) => [notif, ...prev]);

      // Smart Assistant response when helpful with actual hotel details
      const lower = params.text.toLowerCase();
      let autoReplyText = '';
      if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('clave') || lower.includes('contraseña')) {
        autoReplyText = `📶 La red Wi-Fi es "${currentHotel.wifiSsid}" y la contraseña es "${currentHotel.wifiPass}". Nuestro equipo de recepción está atento si requieres soporte técnico.`;
      } else if (lower.includes('check-out') || lower.includes('checkout') || lower.includes('salida') || lower.includes('hora de salida')) {
        autoReplyText = `🕒 La hora oficial de check-out es a las ${currentHotel.checkOutTime || '12:00 PM'}. Si requieres Late Check-Out, el equipo de conserjería te responderá a la brevedad con la disponibilidad.`;
      } else if (lower.includes('taxi') || lower.includes('transporte') || lower.includes('traslado') || lower.includes('aeropuerto')) {
        autoReplyText = `🚖 Con gusto coordinamos tu taxi o servicio de traslado privado desde la recepción. Por favor indícanos destino y hora deseada.`;
      } else if (lower.includes('toalla') || lower.includes('toallas')) {
        autoReplyText = `🧺 Solicitud de toallas adicionales tomada. Hemos notificado al departamento de Housekeeping para enviarlas de inmediato.`;
      } else if (lower.includes('desayuno') || lower.includes('buffet')) {
        autoReplyText = `☕ El desayuno buffet se sirve en el Restaurante Principal de 07:00 a 11:00 AM. También puedes ordenar Room Service directamente desde la app.`;
      }

      if (autoReplyText) {
        setTimeout(() => {
          const aiMsg: RequestChatMessage = {
            id: `msg-${Date.now()}-ai`,
            sender: 'ai_concierge',
            senderName: 'Asistente Concierge 24/7',
            text: autoReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          setRequests((prev) =>
            prev.map((r) => {
              if (r.id === updatedReq.id) {
                const withAi = {
                  ...r,
                  messages: [...(r.messages || []), aiMsg],
                  hasUnreadStaffMessages: true,
                };
                saveRequestToFirestore(withAi);
                return withAi;
              }
              return r;
            })
          );
        }, 900);
      }
    }

    return updatedReq;
  };

  // Mark chat as read
  const markChatAsRead = useCallback((requestId: string, forWhom: 'guest' | 'staff') => {
    setRequests((prev) => {
      const target = prev.find((r) => r.id === requestId);
      if (!target) return prev;
      const isUnread = forWhom === 'guest' ? !!target.hasUnreadStaffMessages : !!target.hasUnreadGuestMessages;
      if (!isUnread) {
        return prev;
      }
      return prev.map((r) => {
        if (r.id === requestId) {
          const updated = {
            ...r,
            ...(forWhom === 'guest'
              ? { hasUnreadStaffMessages: false }
              : { hasUnreadGuestMessages: false }),
          };
          saveRequestToFirestore(updated);
          return updated;
        }
        return r;
      });
    });
  }, []);

  // Update digital door sign
  const updateDoorSign = (status: DoorSignStatus, note?: string, preferredTime?: string) => {
    if (!currentRoom) return;
    const targetRoom = rooms.find(
      (r) => r.hotelId === currentHotel.id && r.number === currentRoom.number
    );
    if (targetRoom) {
      updateRoomDoorSignInFirestore(targetRoom.id, status, note, preferredTime);
    }

    setRooms((prev) =>
      prev.map((r) => {
        if (r.hotelId === currentHotel.id && r.number === currentRoom.number) {
          return {
            ...r,
            doorSign: status,
            doorSignNote: note || '',
            doorSignTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return r;
      })
    );

    // If user clicked "Solicitar limpieza ahora", auto-generate a Housekeeping ticket
    if (status === 'LIMPIEZA_AHORA') {
      createRequest({
        category: 'Limpieza',
        subCategory: 'Limpieza ahora',
        title: 'Limpieza Express de Habitación',
        description: `El huésped activó el cartel "Limpieza ahora". Horario preferido: ${preferredTime || 'Inmediato'}. Nota: ${note || 'Ninguna'}`,
        department: 'HOUSEKEEPING',
        priority: 'ALTA',
      });
    }
  };

  // Room Management (Dashboard & QR Flow) - Privileged roles only (Gerente, Admin, Super Admin)
  const createRoom = async (roomData: {
    number: string;
    type: string;
    floor: number;
    building?: string;
    guestName?: string;
  }): Promise<Room> => {
    if (!canManageRoomsAndQr(currentRole)) {
      throw new Error('Permiso denegado: Solo el Gerente, Administrador y Super Administrador pueden crear habitaciones y generar códigos QR.');
    }

    const trimmedNumber = roomData.number.trim();
    const newRoom: Room = {
      id: `room-${currentHotel.id}-${trimmedNumber}-${Date.now()}`,
      hotelId: currentHotel.id,
      number: trimmedNumber,
      floor: Number(roomData.floor) || 1,
      building: roomData.building?.trim() || 'Principal',
      type: roomData.type.trim() || 'Estándar',
      guestName: roomData.guestName?.trim() || 'Huésped',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0],
      doorSign: 'NORMAL',
      doorSignNote: '',
      activeRequestsCount: 0,
    };

    setRooms((prev) => {
      const filtered = prev.filter((r) => !(r.hotelId === currentHotel.id && r.number === trimmedNumber));
      const updated = [newRoom, ...filtered];
      localStorage.setItem(`${LS_PREFIX}rooms`, JSON.stringify(updated));
      return updated;
    });

    setCurrentRoomNumber(newRoom.number);

    // Save to Firestore
    await saveRoomToFirestore(newRoom);

    // Add toast
    const newToast: NotificationToast = {
      id: `notif-${Date.now()}`,
      title: `Habitación ${newRoom.number} Creada`,
      message: `Habitación ${newRoom.number} (${newRoom.type}) registrada con éxito y QR generado.`,
      department: 'RECEPCION',
      roomNumber: newRoom.number,
      timestamp: 'Ahora',
      read: false,
    };
    setNotifications((prev) => [newToast, ...prev]);

    return newRoom;
  };

  const deleteRoom = async (roomId: string): Promise<void> => {
    if (!canManageRoomsAndQr(currentRole)) {
      throw new Error('Permiso denegado: Solo el Gerente, Administrador y Super Administrador pueden eliminar habitaciones.');
    }
    setRooms((prev) => {
      const updated = prev.filter((r) => r.id !== roomId);
      localStorage.setItem(`${LS_PREFIX}rooms`, JSON.stringify(updated));
      return updated;
    });
    await deleteRoomFromFirestore(roomId);
  };

  const clearExampleRooms = async (): Promise<void> => {
    if (!canManageRoomsAndQr(currentRole)) {
      throw new Error('Permiso denegado: Solo el Gerente, Administrador y Super Administrador pueden gestionar el inventario de habitaciones.');
    }
    const dummyRoomNumbers = ['405', '401', '402', '308', '210', '104'];
    setRooms((prev) => {
      const updated = prev.filter((r) => !dummyRoomNumbers.includes(r.number));
      localStorage.setItem(`${LS_PREFIX}rooms`, JSON.stringify(updated));
      return updated;
    });
    await purgeExampleRoomsFromFirestore();
  };

  // Switch Hotel
  const switchHotel = (hotelId: string) => {
    setCurrentHotelId(hotelId);
  };

  const updateHotelConfig = (updated: Partial<Hotel>) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === currentHotel.id ? { ...h, ...updated } : h))
    );
  };

  // Switch Room (QR simulation or manual)
  const switchRoom = (roomNum: string) => {
    setCurrentRoomNumber(roomNum);
  };

  // Cart operations
  const addToCart = (item: MenuItem, notes?: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1, notes: notes || i.notes } : i
        );
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, quantity: 1, notes }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === itemId) {
            const newQ = i.quantity + delta;
            return newQ > 0 ? { ...i, quantity: newQ } : null;
          }
          return i;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const clearCart = () => setCart([]);

  const submitRoomServiceOrder = (specialNotes?: string): GuestRequest => {
    if (cart.length === 0) throw new Error('Cart is empty');

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const summary = cart.map((i) => `${i.quantity}x ${i.name}`).join(', ');

    const newReq = createRequest({
      category: 'Room Service',
      title: `Pedido Room Service (${cart.length} productos)`,
      description: `${summary}. ${specialNotes ? `Notas: ${specialNotes}` : ''}`,
      department: 'ROOM_SERVICE',
      priority: 'MEDIA',
      items: [...cart],
      totalAmount: total,
    });

    clearCart();
    return newReq;
  };

  // Directory / Destination updates
  const updateDirectoryItem = (id: string, updated: Partial<DirectoryItem>) => {
    setDirectoryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const updateDestinationItem = (id: string, updated: Partial<DestinationItem>) => {
    setDestinationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  // Refresh AI Insights
  const refreshAIInsights = () => {
    setIsGeneratingAI(true);
    setTimeout(() => {
      // Generate updated operational intelligence based on current metrics
      const newInsight: AIInsight = {
        id: `ins-${Date.now()}`,
        type: 'optimization',
        department: 'HOUSEKEEPING',
        title: 'Optimización de turnos en base a rotación de habitaciones',
        description: 'La correlación entre solicitudes de toallas y salidas de playa sugiere adelantar 30 minutos el turno vespertino de camaristas.',
        metricHighlight: 'Ahorro estimado de 8.4 min/resolución',
        actionRecommendation: 'Reorganizar carros de piso 4 con toallas extra a las 11:30 AM.',
        timestamp: 'Generado recién',
      };
      setAiInsights((prev) => [newInsight, ...prev]);
      setIsGeneratingAI(false);
    }, 900);
  };

  // Notification helpers
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Operational KPI calculations
  const stats = useMemo(() => {
    const hotelRequests = requests.filter((r) => r.hotelId === currentHotel.id);
    const totalRequests = hotelRequests.length;
    const pendingCount = hotelRequests.filter((r) => r.status === 'RECIBIDA').length;
    const inProgressCount = hotelRequests.filter((r) =>
      ['ASIGNADA', 'EN_PROCESO', 'EN_CAMINO'].includes(r.status)
    ).length;
    const completedCount = hotelRequests.filter((r) => r.status === 'COMPLETADA').length;
    const urgentCount = hotelRequests.filter(
      (r) => r.priority === 'URGENTE' && r.status !== 'COMPLETADA'
    ).length;

    // Calculate average response time in minutes
    let totalResponseMins = 0;
    let responseCount = 0;
    let totalResolutionMins = 0;
    let resolutionCount = 0;

    hotelRequests.forEach((r) => {
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

    const avgResponseMinutes = responseCount > 0 ? Math.round(totalResponseMins / responseCount) : 4.2;
    const avgResolutionMinutes = resolutionCount > 0 ? Math.round(totalResolutionMins / resolutionCount) : 16.5;

    // CSAT
    const rated = hotelRequests.filter((r) => typeof r.rating === 'number');
    const csatScore =
      rated.length > 0
        ? Number((rated.reduce((acc, r) => acc + (r.rating || 0), 0) / rated.length).toFixed(1))
        : 4.9;

    // By Dept
    const requestsByDept: Record<Department, number> = {
      RECEPCION: 0,
      HOUSEKEEPING: 0,
      ROOM_SERVICE: 0,
      MANTENIMIENTO: 0,
      GERENCIA: 0,
    };
    hotelRequests.forEach((r) => {
      if (requestsByDept[r.department] !== undefined) {
        requestsByDept[r.department]++;
      }
    });

    return {
      totalRequests,
      pendingCount,
      inProgressCount,
      completedCount,
      urgentCount,
      avgResponseMinutes,
      avgResolutionMinutes,
      csatScore,
      requestsByDept,
    };
  }, [requests, currentHotel.id]);

  return (
    <GuestFlowContext.Provider
      value={{
        hotels,
        currentHotel,
        switchHotel,
        updateHotelConfig,
        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole,
        currentUser,
        setCurrentUser,
        staffUsers,
        canManageRoomsAndQr: canManageRoomsAndQrVal,
        userDepartment,
        activeView,
        setActiveView,
        currentRoom,
        rooms,
        switchRoom,
        updateDoorSign,
        createRoom,
        deleteRoom,
        clearExampleRooms,
        requests,
        createRequest,
        updateRequestStatus,
        rateRequest,
        deleteRequest,
        sendChatMessage,
        markChatAsRead,
        getRoomChatRequest,
        menuItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        submitRoomServiceOrder,
        directoryItems,
        destinationItems,
        updateDirectoryItem,
        updateDestinationItem,
        aiInsights,
        refreshAIInsights,
        isGeneratingAI,
        notifications,
        markNotificationRead,
        clearAllNotifications,
        autoTriageRequest,
        stats,
        isFirebaseConnected,
      }}
    >
      {children}
    </GuestFlowContext.Provider>
  );
};

export const useGuestFlow = (): GuestFlowContextType => {
  const context = useContext(GuestFlowContext);
  if (!context) {
    throw new Error('useGuestFlow must be used within a GuestFlowProvider');
  }
  return context;
};
