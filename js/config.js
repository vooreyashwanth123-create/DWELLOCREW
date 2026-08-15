/**
 * DwelloCrew 2.0 — Global Configuration & Security Constants
 */

export const CONFIG = {
  APP_NAME: 'DwelloCrew',
  TAGLINE: 'Find. Book. Relax.',
  VERSION: '2.0.0',

  // Admin security setup (Configurable via environment in production)
  ADMIN: {
    DEFAULT_EMAIL: 'admin@dwellocrew.com',
    // Pre-calculated SHA-256 hash for 'Admin@Dwello2026'
    DEFAULT_PASSWORD_HASH: '595e1766a2f0b376d7543b7c9f7321d8c93a285f3db10c4fa16fcca138bc5965',
    ROLE: 'ADMINISTRATOR'
  },

  // Platform Business Defaults
  COMMISSION_PERCENT: 12.5,
  TAX_RATE_PERCENT: 5.0,
  CURRENCY_SYMBOL: '$',

  // Storage Keys
  STORAGE_KEYS: {
    USERS: 'dwellocrew_users',
    CATEGORIES: 'dwellocrew_categories',
    SERVICES: 'dwellocrew_services',
    BOOKINGS: 'dwellocrew_bookings',
    REVIEWS: 'dwellocrew_reviews',
    NOTIFICATIONS: 'dwellocrew_notifications',
    SESSION: 'dwellocrew_current_session',
    SETTINGS: 'dwellocrew_platform_settings',
    RESET_TOKENS: 'dwellocrew_reset_tokens'
  },

  // Reputation Scoring Weights
  REPUTATION_WEIGHTS: {
    RATING_WEIGHT: 0.4,
    COMPLETED_JOBS_WEIGHT: 0.3,
    SUCCESS_RATE_WEIGHT: 0.2,
    EXPERIENCE_WEIGHT: 0.1
  },

  // WhatsApp Integration Settings
  WHATSAPP: {
    ENABLED: true,
    DEFAULT_PHONE: '+18005550199'
  }
};
