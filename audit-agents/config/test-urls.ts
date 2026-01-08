export const ENVIRONMENTS = {
  local: {
    baseUrl: 'http://localhost:3000',
    name: 'Local Development'
  },
  production: {
    baseUrl: 'https://ten-point-property-management.vercel.app',
    name: 'Vercel Production'
  }
} as const;

export const TEST_PAGES = {
  dashboard: {
    home: '/',
    properties: '/properties',
    guests: '/guests',
    inquiries: '/inquiries',
    maintenance: '/maintenance',
    financials: '/financials',
    settings: '/settings'
  },
  propertyDetail: '/properties/', // Append property ID
  guestDetail: '/guests/', // Append guest ID
  public: {
    listings: '/listings',
    listingDetail: '/listings/' // Append listing ID
  },
  auth: {
    login: '/login'
  }
} as const;

// Common selectors used across tests
export const SELECTORS = {
  // Navigation
  sidebar: '[data-testid="sidebar"], .sidebar, nav[class*="sidebar"]',
  mobileNav: '[data-testid="mobile-nav"], .mobile-nav',
  navLink: 'nav a, [role="navigation"] a',

  // Dashboard
  statsCard: '[data-testid="stat-card"], .stat-card, [class*="stats"]',
  calendar: '[class*="calendar"], .rbc-calendar',

  // Tables
  dataTable: 'table, [role="table"]',
  tableRow: 'tr, [role="row"]',
  tableHeader: 'th, [role="columnheader"]',

  // Forms
  formDialog: '[role="dialog"]',
  formInput: 'input, textarea, select',
  submitButton: 'button[type="submit"], button:has-text("Save"), button:has-text("Add"), button:has-text("Create")',
  cancelButton: 'button:has-text("Cancel")',

  // Actions
  addButton: 'button:has-text("Add"), button:has-text("New"), button:has-text("Create")',
  editButton: 'button:has-text("Edit"), [aria-label*="edit"]',
  deleteButton: 'button:has-text("Delete"), [aria-label*="delete"]',

  // Common UI
  toast: '[data-sonner-toast], [role="alert"]',
  dropdown: '[role="menu"]',
  badge: '.badge, [class*="badge"]',
  skeleton: '.skeleton, [class*="skeleton"]',

  // Loading states
  loading: '[class*="loading"], [class*="spinner"]',
} as const;
