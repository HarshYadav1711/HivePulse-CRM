export const APP_NAME = 'HivePulse CRM';

/** Machine-readable roles stored on user records and JWT claims. */
export const USER_ROLES = ['admin', 'sales'] as const;

export const USER_ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  admin: 'Admin',
  sales: 'Sales User',
};

/** Default role assigned on self-service registration. */
export const DEFAULT_USER_ROLE = 'sales' as const;

/** Allowed lead pipeline statuses. */
export const LEAD_STATUSES = ['New', 'Contacted', 'Qualified', 'Lost'] as const;

/** Allowed lead acquisition sources. */
export const LEAD_SOURCES = ['Website', 'Instagram', 'Referral'] as const;

/** Fixed page size for lead list endpoints. */
export const LEADS_PAGE_SIZE = 10;
