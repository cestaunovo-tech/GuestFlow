import { UserRole, Department } from '../types';

/**
 * Roles with full management privileges:
 * - Gerente (GERENCIA)
 * - Administrador (HOTEL_ADMIN)
 * - Super Administrador (SUPER_ADMIN)
 *
 * Only these roles can create/manage rooms and generate QR codes.
 */
export const PRIVILEGED_ROLES: UserRole[] = ['GERENCIA', 'HOTEL_ADMIN', 'SUPER_ADMIN'];

export const canManageRoomsAndQr = (role: UserRole): boolean => {
  return PRIVILEGED_ROLES.includes(role);
};

export const canResetAllData = (role: UserRole): boolean => {
  return PRIVILEGED_ROLES.includes(role);
};

/**
 * Department associated with each operational role.
 * For management roles (GERENCIA, HOTEL_ADMIN, SUPER_ADMIN), they can access 'ALL'.
 */
export const getRoleDepartment = (role: UserRole): Department | 'ALL' => {
  switch (role) {
    case 'SUPER_ADMIN':
    case 'HOTEL_ADMIN':
    case 'GERENCIA':
      return 'ALL';
    case 'RECEPCION':
      return 'RECEPCION';
    case 'HOUSEKEEPING':
      return 'HOUSEKEEPING';
    case 'ROOM_SERVICE':
      return 'ROOM_SERVICE';
    case 'MANTENIMIENTO':
      return 'MANTENIMIENTO';
    default:
      return 'ALL';
  }
};

export const getDepartmentLabel = (dept: Department | 'ALL'): string => {
  switch (dept) {
    case 'RECEPCION':
      return 'Recepción';
    case 'HOUSEKEEPING':
      return 'Housekeeping';
    case 'ROOM_SERVICE':
      return 'Room Service';
    case 'MANTENIMIENTO':
      return 'Mantenimiento';
    case 'GERENCIA':
      return 'Gerencia';
    case 'ALL':
      return 'Todos los Departamentos';
    default:
      return dept;
  }
};

export const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Administrador';
    case 'HOTEL_ADMIN':
      return 'Administrador de Hotel';
    case 'GERENCIA':
      return 'Gerente General';
    case 'RECEPCION':
      return 'Personal de Recepción';
    case 'HOUSEKEEPING':
      return 'Personal de Housekeeping';
    case 'ROOM_SERVICE':
      return 'Personal de Room Service';
    case 'MANTENIMIENTO':
      return 'Personal de Mantenimiento';
    case 'GUEST':
      return 'Huésped';
    default:
      return role;
  }
};
