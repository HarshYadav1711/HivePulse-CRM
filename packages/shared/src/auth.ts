import { USER_ROLES } from './constants';
import type { UserRole } from './types';

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}
