import { LEAD_SOURCES, LEAD_STATUSES, USER_ROLES } from './constants';
import type { LeadSource, LeadStatus, SortOrder, UserRole } from './types';

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function isLeadSource(value: string): value is LeadSource {
  return (LEAD_SOURCES as readonly string[]).includes(value);
}

export function isUserRole(value: string): value is UserRole {
  return (USER_ROLES as readonly string[]).includes(value);
}

export function isSortOrder(value: string): value is SortOrder {
  return value === 'latest' || value === 'oldest';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function normalizeSearchTerm(term: string): string {
  return term.trim();
}
