import { Hotel, Room, GuestRequest, MenuItem, DirectoryItem, DestinationItem, AIInsight, HotelStaffUser } from '../types';

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Riviera Luxury Resort & Spa',
    tagline: 'Exclusividad caribeña frente al mar',
    city: 'Playa del Carmen',
    country: 'México',
    address: 'Av. Costera Km 14.5, Playa del Carmen, Q.Roo',
    phone: '+52 984 877 2000',
    email: 'concierge@grandriviera.com',
    brandColor: '#0c2d3e',
    accentColor: '#00adb5',
    totalRooms: 180,
    totalFloors: 6,
    wifiSsid: 'GrandRiviera_Guest_HighSpeed',
    wifiPass: 'RivieraVIP2026',
    checkInTime: '15:00',
    checkOutTime: '12:00'
  },
  {
    id: 'hotel-2',
    name: 'The Metropolitan Boutique Hotel',
    tagline: 'Elegancia urbana y diseño contemporáneo',
    city: 'Madrid',
    country: 'España',
    address: 'Calle Gran Vía 52, Centro, Madrid',
    phone: '+34 91 582 9100',
    email: 'info@themetropolitanmadrid.com',
    brandColor: '#1e293b',
    accentColor: '#0ea5e9',
    totalRooms: 95,
    totalFloors: 7,
    wifiSsid: 'Metropolitan_FastWiFi',
    wifiPass: 'MetroGranVia2026',
    checkInTime: '14:00',
    checkOutTime: '11:00'
  },
  {
    id: 'hotel-3',
    name: 'Alpine Vista Ski & Wellness',
    tagline: 'Refugio alpino de alta montaña',
    city: 'Zermatt',
    country: 'Suiza',
    address: 'Matterhornstrasse 18, 3920 Zermatt',
    phone: '+41 27 966 8100',
    email: 'welcome@alpinevistazermatt.ch',
    brandColor: '#0f172a',
    accentColor: '#14b8a6',
    totalRooms: 60,
    totalFloors: 4,
    wifiSsid: 'AlpineVista_Fiber',
    wifiPass: 'MatterhornPeak',
    checkInTime: '15:00',
    checkOutTime: '11:00'
  }
];

export const INITIAL_ROOMS: Room[] = [];

export const INITIAL_REQUESTS: GuestRequest[] = [];

export const INITIAL_MENU: MenuItem[] = [
  {
    id: 'm-1',
    hotelId: 'hotel-1',
    name: 'Desayuno Riviera Americano',
    category: 'Desayuno',
    description: 'Huevos al gusto, tocino ahumado artesanal, hotcakes esponjosos con miel de maple pura, fruta fresca de temporada, jugo de naranja recién exprimido y café o té.',
    price: 26,
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80',
    allergens: ['Huevos', 'Gluten', 'Lácteos'],
    available: true,
    preparationTimeMinutes: 20
  },
  {
    id: 'm-2',
    hotelId: 'hotel-1',
    name: 'Club Sandwich Riviera Triple',
    category: 'Platos principales',
    description: 'Pechuga de pavo horneada, queso gouda madurado, tocino crujiente, lechuga romana, tomate heirloom y mayonesa de dijon en pan brioche artesanal, servido con papas rústicas con sal de mar.',
    price: 24,
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=80',
    allergens: ['Gluten', 'Lácteos', 'Huevos'],
    available: true,
    preparationTimeMinutes: 18
  },
  {
    id: 'm-3',
    hotelId: 'hotel-1',
    name: 'Ensalada Mediterránea con Burrata',
    category: 'Entradas',
    description: 'Burrata fresca de Puglia (200g), tomates cherry confitados, prosciutto di Parma crujiente, pesto de albahaca fresca y reducción de balsámico de Módena.',
    price: 22,
    image: 'https://images.unsplash.com/photo-1592417817098-8f3d69102353?auto=format&fit=crop&w=600&q=80',
    allergens: ['Lácteos', 'Frutos secos'],
    available: true,
    preparationTimeMinutes: 15
  },
  {
    id: 'm-4',
    hotelId: 'hotel-1',
    name: 'Hamburguesa Black Angus & Trufa',
    category: 'Platos principales',
    description: 'Carne 100% Black Angus (220g), queso gruyère fundido, cebolla caramelizada al vino tinto, mayonesa de trufa negra en pan brioche tostado con mantequilla francesa.',
    price: 28,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    allergens: ['Gluten', 'Lácteos', 'Huevos'],
    available: true,
    preparationTimeMinutes: 22
  },
  {
    id: 'm-5',
    hotelId: 'hotel-1',
    name: 'Tostada de Salmón Ahumado & Aguacate',
    category: 'Desayuno',
    description: 'Pan de masa madre de centeno, puré de aguacate hass con limón eureka, salmón ahumado premium, alcaparras y huevo pochado orgánico.',
    price: 21,
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80',
    allergens: ['Pescado', 'Gluten', 'Huevos'],
    available: true,
    preparationTimeMinutes: 15
  },
  {
    id: 'm-6',
    hotelId: 'hotel-1',
    name: 'Ceviche de Robalo & Mango Caribeño',
    category: 'Entradas',
    description: 'Pesca del día marinada al momento en leche de tigre de maracuyá, cubos de mango fresco, cilantro, cebolla morada en pluma y chips de plátano macho.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=600&q=80',
    allergens: ['Pescado'],
    available: true,
    preparationTimeMinutes: 14
  },
  {
    id: 'm-7',
    hotelId: 'hotel-1',
    name: 'Coulant de Chocolate Belga & Helado de Vainilla',
    category: 'Postres',
    description: 'Volcán de chocolate 70% cacao tibio con centro fluido de gianduja, acompañado de helado artesanal de vainilla de Papantla y frutos rojos.',
    price: 16,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80',
    allergens: ['Lácteos', 'Huevos', 'Gluten'],
    available: true,
    preparationTimeMinutes: 15
  },
  {
    id: 'm-8',
    hotelId: 'hotel-1',
    name: 'Limonada de Menta & Jengibre Fresca',
    category: 'Bebidas',
    description: 'Limón persa prensado en frío, hojas de menta orgánica de nuestro huerto, toque de jengibre y miel de agave silvestre.',
    price: 8,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80',
    allergens: [],
    available: true,
    preparationTimeMinutes: 5
  },
  {
    id: 'm-9',
    hotelId: 'hotel-1',
    name: 'Smoothie Acai & Frutos del Bosque',
    category: 'Bebidas',
    description: 'Pulpa de acai orgánico amazónico, fresas, arándanos, leche de almendras y semillas de chía.',
    price: 11,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80',
    allergens: ['Frutos secos'],
    available: true,
    preparationTimeMinutes: 8
  }
];

export const INITIAL_DIRECTORY: DirectoryItem[] = [
  {
    id: 'dir-1',
    hotelId: 'hotel-1',
    title: 'Restaurante Oceana Fine Dining',
    category: 'Restaurante',
    location: 'Planta Baja — Terraza Frente al Mar',
    hours: 'Cena: 19:00 - 23:00 (Requiere reserva previa)',
    description: 'Alta gastronomía costera con maridaje de vinos internacionales guiado por nuestro Sommelier en jefe.',
    phoneExtension: 'Ext. 201',
    iconName: 'UtensilsCrossed'
  },
  {
    id: 'dir-2',
    hotelId: 'hotel-1',
    title: 'Sunset Sky Bar & Lounge',
    category: 'Bar',
    location: 'Rooftop — Piso 6',
    hours: '16:00 - 01:00 (Música en vivo a partir de las 20:30)',
    description: 'Coctelería de autor premium, mixología botánica y las mejores vistas panorámicas al atardecer.',
    phoneExtension: 'Ext. 204',
    iconName: 'Wine'
  },
  {
    id: 'dir-3',
    hotelId: 'hotel-1',
    title: 'Infinity Pool & Cabanas VIP',
    category: 'Piscina',
    location: 'Área Central del Jardín',
    hours: '08:00 - 20:00 (Servicio de toallas gratuito)',
    description: 'Piscina infinita climatizada de 50 metros con camas balinesas, jacuzzi exterior y servicio de bebidas en camastro.',
    phoneExtension: 'Ext. 108',
    iconName: 'Waves'
  },
  {
    id: 'dir-4',
    hotelId: 'hotel-1',
    title: 'Serena Thalasso Spa',
    category: 'Spa',
    location: 'Edificio Bienestar — Piso 1',
    hours: '09:00 - 21:00',
    description: 'Circuito hidrotermal, sauna finlandesa, baño de vapor aromático y masajes balineses individuales o en pareja.',
    phoneExtension: 'Ext. 301',
    iconName: 'Sparkles'
  },
  {
    id: 'dir-5',
    hotelId: 'hotel-1',
    title: 'TechnoGym Wellness Center',
    category: 'Gimnasio',
    location: 'Edificio Bienestar — Piso 2',
    hours: 'Abierto las 24 horas con tarjeta de habitación',
    description: 'Equipamiento cardiovascular y de fuerza de última generación, sala de yoga y pesas libres.',
    phoneExtension: 'Ext. 302',
    iconName: 'Dumbbell'
  },
  {
    id: 'dir-6',
    hotelId: 'hotel-1',
    title: 'Red Wi-Fi de Alta Velocidad',
    category: 'Wi-Fi',
    location: 'Cobertura en todo el hotel y playa',
    hours: 'Servicio 24/7 sin límite de dispositivos',
    description: 'Red: GrandRiviera_Guest_HighSpeed | Clave: RivieraVIP2026 (Fibra óptica simétrica 500 Mbps).',
    phoneExtension: 'Ext. 0',
    iconName: 'Wifi'
  },
  {
    id: 'dir-7',
    hotelId: 'hotel-1',
    title: 'Servicio de Estacionamiento & Valet',
    category: 'Estacionamiento',
    location: 'Entrada Principal del Hotel',
    hours: 'Valet Parking 24 horas',
    description: 'Estacionamiento subterráneo seguro con cargadores para vehículos eléctricos Tesla y universales.',
    phoneExtension: 'Ext. 110',
    iconName: 'Car'
  },
  {
    id: 'dir-8',
    hotelId: 'hotel-1',
    title: 'Emergencias Médicas & Asistencia',
    category: 'Emergencias',
    location: 'Módulo Médico en Lobby y atención a habitación',
    hours: 'Atención 24/7',
    description: 'Médico de guardia bilingüe disponible para consultas inmediatas en habitación.',
    phoneExtension: 'Ext. 911 / Ext. 0',
    iconName: 'ShieldAlert'
  }
];

export const INITIAL_DESTINATIONS: DestinationItem[] = [
  {
    id: 'dest-1',
    hotelId: 'hotel-1',
    title: 'Cenote Cristalino & Jardín del Edén',
    category: 'Atracciones',
    distance: '8.5 km (12 min en taxi)',
    rating: 4.9,
    description: 'Piscina natural de agua cristalina rodeada de exuberante vegetación tropical, ideal para snorkel y nado relajante.',
    imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?auto=format&fit=crop&w=600&q=80',
    tips: 'Ir temprano antes de las 10:30 AM para disfrutar de aguas calmas sin grupos grandes. Recepción puede coordinar transporte privado.'
  },
  {
    id: 'dest-2',
    hotelId: 'hotel-1',
    title: 'La Cueva del Chango (Cocina Mexicana)',
    category: 'Restaurante',
    distance: '3.2 km (5 min en taxi o 15 min caminando)',
    rating: 4.8,
    description: 'Famoso restaurante inmerso en un jardín selvático natural. Extraordinarios chilaquiles, moles artesanales y jugos frescos.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    tips: 'Ideal para desayuno o comida relajada. No aceptan reservas, pero la rotación de mesas es ágil.'
  },
  {
    id: 'dest-3',
    hotelId: 'hotel-1',
    title: 'Paseo en Catamarán a Isla Mujeres',
    category: 'Tours',
    distance: 'Salida desde marina a 15 min',
    rating: 5.0,
    description: 'Navegación en catamarán de lujo por las tonalidades turquesa del Caribe, barra libre premium y snorkel en arrecife protegido.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    tips: 'Reserva exclusiva con 15% de descuento presentando tu número de habitación GuestFlow.'
  },
  {
    id: 'dest-4',
    hotelId: 'hotel-1',
    title: 'Quinta Avenida & Galerías de Arte',
    category: 'Centros comerciales',
    distance: '2.5 km',
    rating: 4.7,
    description: 'El corazón peatonal cosmopolita con boutiques exclusivas, joyerías, cafés gourmet y artistas plásticos en vivo.',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=600&q=80',
    tips: 'La zona entre calle 26 y 38 concentra los cafés más encantadores y galerías de diseñadores independientes.'
  }
];

export const INITIAL_STAFF_USERS: HotelStaffUser[] = [
  {
    id: 'user-super',
    hotelId: 'hotel-1',
    name: 'Elena Vance',
    email: 'superadmin@guestflow.io',
    role: 'SUPER_ADMIN',
    department: 'GERENCIA',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-hotel-admin',
    hotelId: 'hotel-1',
    name: 'Gabriel Morales',
    email: 'admin@grandriviera.com',
    role: 'HOTEL_ADMIN',
    department: 'GERENCIA',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-reception',
    hotelId: 'hotel-1',
    name: 'Mariana Silva',
    email: 'recepcion@grandriviera.com',
    role: 'RECEPCION',
    department: 'RECEPCION',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-housekeeping',
    hotelId: 'hotel-1',
    name: 'Rosa Morales',
    email: 'housekeeping@grandriviera.com',
    role: 'HOUSEKEEPING',
    department: 'HOUSEKEEPING',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-fnb',
    hotelId: 'hotel-1',
    name: 'Chef Mateo Navarro',
    email: 'roomservice@grandriviera.com',
    role: 'ROOM_SERVICE',
    department: 'ROOM_SERVICE',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-maintenance',
    hotelId: 'hotel-1',
    name: 'Ing. Carlos Vega',
    email: 'mantenimiento@grandriviera.com',
    role: 'MANTENIMIENTO',
    department: 'MANTENIMIENTO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    online: true
  },
  {
    id: 'user-management',
    hotelId: 'hotel-1',
    name: 'Patricia Alarcón',
    email: 'gerencia@grandriviera.com',
    role: 'GERENCIA',
    department: 'GERENCIA',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    online: true
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    type: 'trend',
    department: 'HOUSEKEEPING',
    title: 'Aumento del 38% en solicitudes de toallas de piscina en fines de semana',
    description: 'El análisis de los últimos 14 días detecta que entre las 11:00 y las 14:00 de sábados y domingos se concentra el 65% de peticiones de toallas de piscina.',
    metricHighlight: '+38% fin de semana',
    actionRecommendation: 'Pre-armar kits de toallas adicionales en carros de piso 3 y 4 a las 10:30 AM para reducir el tiempo de respuesta a menos de 7 minutos.',
    timestamp: 'Hoy, 08:00'
  },
  {
    id: 'ins-2',
    type: 'alert',
    department: 'MANTENIMIENTO',
    title: 'Aire acondicionado concentra el 42% de incidencias técnicas en Torre Jardín',
    description: 'Se han reportado 9 incidencias de condensación o control remoto en las habitaciones del piso 3 durante la ola de calor.',
    metricHighlight: '42% de tickets técnicos',
    actionRecommendation: 'Programar mantenimiento preventivo de filtros y termostatos en habitaciones 301 a 312 este jueves durante el check-out.',
    timestamp: 'Ayer, 18:30'
  },
  {
    id: 'ins-3',
    type: 'optimization',
    department: 'ROOM_SERVICE',
    title: 'Pico de demanda en Room Service entre 20:00 y 22:00',
    description: 'El 58% de las órdenes de cena gourmet se concentran en una ventana de 90 minutos. Tiempo de preparación sube de 16 a 28 minutos.',
    metricHighlight: 'Pico 20:00 - 22:00',
    actionRecommendation: 'Reforzar la línea de emplatado caliente con un cocinero de apoyo de 19:45 a 22:15 para mantener la promesa de entrega en 20 min.',
    timestamp: 'Hoy, 07:15'
  },
  {
    id: 'ins-4',
    type: 'positive',
    department: 'RECEPCION',
    title: 'Satisfacción récord (4.94 / 5.0) en resolución de mensajes directos',
    description: 'La adopción de GuestFlow redujo las llamadas telefónicas al conmutador un 72%, mejorando el tiempo de respuesta de 6.4 min a 1.8 min.',
    metricHighlight: '4.94 ★ CSAT (98% positivo)',
    actionRecommendation: 'Mantener las respuestas pre-configuradas para late check-out y transferencias al aeropuerto.',
    timestamp: 'Hoy, 09:00'
  }
];
