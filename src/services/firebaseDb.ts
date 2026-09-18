import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Hotel, Room, GuestRequest, HotelStaffUser, MenuItem, DoorSignStatus } from '../types';
import {
  INITIAL_HOTELS,
  INITIAL_ROOMS,
  INITIAL_REQUESTS,
  INITIAL_MENU,
  INITIAL_STAFF_USERS
} from '../data/initialData';

const HOTELS_COL = 'hotels';
const ROOMS_COL = 'rooms';
const REQUESTS_COL = 'requests';
const USERS_COL = 'users';
const MENU_COL = 'menu_items';

/**
 * Seed initial data to Firestore if the collections are empty
 */
export async function seedInitialDataIfEmpty(): Promise<void> {
  try {
    const hotelsSnap = await getDocs(collection(db, HOTELS_COL));
    if (hotelsSnap.empty) {
      console.log('🌱 Seeding Firestore with initial multi-tenant hotel data...');
      
      // Seed Hotels
      for (const h of INITIAL_HOTELS) {
        await setDoc(doc(db, HOTELS_COL, h.id), {
          ...h,
          createdAt: new Date().toISOString()
        });
      }

      // Seed Rooms
      for (const r of INITIAL_ROOMS) {
        await setDoc(doc(db, ROOMS_COL, r.id), {
          ...r,
          updatedAt: new Date().toISOString()
        });
      }

      // Seed Menu Items
      for (const m of INITIAL_MENU) {
        await setDoc(doc(db, MENU_COL, m.id), m);
      }

      // Seed Requests
      for (const req of INITIAL_REQUESTS) {
        await setDoc(doc(db, REQUESTS_COL, req.id), {
          ...req,
          updatedAt: new Date().toISOString()
        });
      }

      // Seed Staff Users
      for (const u of INITIAL_STAFF_USERS) {
        await setDoc(doc(db, USERS_COL, u.id), {
          ...u,
          createdAt: new Date().toISOString()
        });
      }
      console.log('✅ Firestore initial seed completed successfully.');
    }
  } catch (err) {
    console.warn('Notice: Firestore seeding skipped or using local state:', err);
  }
}

/**
 * Subscribe to Requests for a specific hotel (Multi-tenant)
 */
export function subscribeToHotelRequests(
  hotelId: string,
  onUpdate: (requests: GuestRequest[]) => void
) {
  try {
    const q = query(collection(db, REQUESTS_COL), where('hotelId', '==', hotelId));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: GuestRequest[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as GuestRequest);
        });
        if (list.length > 0) {
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore requests listener notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not establish Firestore requests subscription:', err);
    return () => {};
  }
}

/**
 * Subscribe to Rooms for a specific hotel (Multi-tenant door sign state)
 */
export function subscribeToHotelRooms(
  hotelId: string,
  onUpdate: (rooms: Room[]) => void
) {
  try {
    const q = query(collection(db, ROOMS_COL), where('hotelId', '==', hotelId));
    return onSnapshot(
      q,
      (snapshot) => {
        const list: Room[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Room);
        });
        onUpdate(list);
      },
      (error) => {
        console.warn('Firestore rooms listener notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Could not establish Firestore rooms subscription:', err);
    return () => {};
  }
}

/**
 * Save or update a Room in Firestore
 */
export async function saveRoomToFirestore(room: Room): Promise<void> {
  try {
    const ref = doc(db, ROOMS_COL, room.id);
    await setDoc(ref, {
      ...room,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveRoom fallback:', err);
  }
}

/**
 * Delete a Room from Firestore
 */
export async function deleteRoomFromFirestore(roomId: string): Promise<void> {
  try {
    const ref = doc(db, ROOMS_COL, roomId);
    await deleteDoc(ref);
  } catch (err) {
    console.warn('Firestore deleteRoom fallback:', err);
  }
}

/**
 * Purge legacy example rooms from Firestore
 */
export async function purgeExampleRoomsFromFirestore(): Promise<void> {
  const exampleIds = ['room-405', 'room-401', 'room-402', 'room-308', 'room-210', 'room-104'];
  for (const id of exampleIds) {
    try {
      const ref = doc(db, ROOMS_COL, id);
      await deleteDoc(ref);
    } catch {
      // ignore
    }
  }
}

/**
 * Create or update a Guest Request in Firestore
 */
export async function saveRequestToFirestore(req: GuestRequest): Promise<void> {
  try {
    const ref = doc(db, REQUESTS_COL, req.id);
    await setDoc(ref, {
      ...req,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveRequest fallback to local state:', err);
  }
}

/**
 * Update Room Door Sign in Firestore
 */
export async function updateRoomDoorSignInFirestore(
  roomId: string,
  doorSign: DoorSignStatus,
  doorSignNote?: string,
  preferredTime?: string
): Promise<void> {
  try {
    const ref = doc(db, ROOMS_COL, roomId);
    await updateDoc(ref, {
      doorSign,
      doorSignNote: doorSignNote || '',
      preferredCleaningTime: preferredTime || '',
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore updateRoomDoorSign fallback:', err);
  }
}

/**
 * Save User profile and role in Firestore (RBAC)
 */
export async function saveUserProfileToFirestore(user: HotelStaffUser): Promise<void> {
  try {
    const ref = doc(db, USERS_COL, user.id);
    await setDoc(ref, {
      ...user,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    console.warn('Firestore saveUserProfile fallback:', err);
  }
}
