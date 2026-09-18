export type Language = 'es' | 'en' | 'pt' | 'fr' | 'de' | 'it';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'HOTEL_ADMIN' 
  | 'RECEPCION' 
  | 'HOUSEKEEPING' 
  | 'ROOM_SERVICE' 
  | 'MANTENIMIENTO' 
  | 'GERENCIA' 
  | 'GUEST';

export type Department = 
  | 'RECEPCION' 
  | 'HOUSEKEEPING' 
  | 'ROOM_SERVICE' 
  | 'MANTENIMIENTO' 
  | 'GERENCIA';

export type RequestStatus = 
  | 'RECIBIDA' 
  | 'ASIGNADA' 
  | 'EN_PROCESO' 
  | 'EN_CAMINO' 
  | 'COMPLETADA' 
  | 'CANCELADA';

export type RequestPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'URGENTE';

export type DoorSignStatus = 
  | 'NORMAL' 
  | 'LIMPIAR' 
  | 'NO_MOLESTAR' 
  | 'PAUSA_LIMPIEZA' 
  | 'LIMPIEZA_AHORA';

export interface Hotel {
  id: string;
  name: string;
  tagline: string;
  city: string;
  country: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  brandColor: string;
  accentColor: string;
  totalRooms: number;
  totalFloors: number;
  wifiSsid: string;
  wifiPass: string;
  checkInTime: string;
  checkOutTime: string;
}

export interface Room {
  id: string;
  hotelId: string;
  number: string;
  floor: number;
  building: string;
  type: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  doorSign: DoorSignStatus;
  doorSignNote?: string;
  doorSignTime?: string;
  activeRequestsCount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface GuestRequest {
  id: string;
  code: string; // e.g. "GF-10452"
  hotelId: string;
  roomNumber: string;
  floor: number;
  building: string;
  guestName: string;
  department: Department;
  category: string;
  subCategory?: string;
  title: string;
  description: string;
  items?: OrderItem[];
  totalAmount?: number;
  photoUrl?: string;
  status: RequestStatus;
  priority: RequestPriority;
  createdAt: string; // ISO
  acceptedAt?: string;
  startedAt?: string;
  completedAt?: string;
  assignedTo?: string;
  rating?: number; // 1-5
  feedback?: string;
  autoRouted: boolean;
  routeReason?: string;
}

export interface MenuItem {
  id: string;
  hotelId: string;
  name: string;
  category: 'Desayuno' | 'Entradas' | 'Platos principales' | 'Postres' | 'Bebidas';
  description: string;
  price: number;
  image: string;
  allergens: string[];
  available: boolean;
  preparationTimeMinutes: number;
}

export interface DirectoryItem {
  id: string;
  hotelId: string;
  title: string;
  category: 'Restaurante' | 'Bar' | 'Piscina' | 'Gimnasio' | 'Spa' | 'Desayuno' | 'Estacionamiento' | 'Wi-Fi' | 'Reglamento' | 'Emergencias';
  location: string;
  hours: string;
  description: string;
  phoneExtension: string;
  iconName: string;
}

export interface DestinationItem {
  id: string;
  hotelId: string;
  title: string;
  category: 'Restaurante' | 'Atracciones' | 'Museos' | 'Tours' | 'Playas' | 'Centros comerciales' | 'Actividades' | 'Transporte';
  distance: string;
  rating: number;
  description: string;
  imageUrl: string;
  tips: string;
}

export interface AIInsight {
  id: string;
  type: 'trend' | 'alert' | 'optimization' | 'positive';
  department: Department | 'ALL';
  title: string;
  description: string;
  metricHighlight: string;
  actionRecommendation: string;
  timestamp: string;
}

export interface HotelStaffUser {
  id: string;
  hotelId: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  avatar: string;
  online: boolean;
}
