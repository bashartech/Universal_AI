export const APP_CONSTANTS = {
  // Confidence thresholds
  MIN_CONFIDENCE_THRESHOLD: 0.6,
  HIGH_CONFIDENCE_THRESHOLD: 0.8,

  // Session settings
  SESSION_TIMEOUT_MS: 30 * 60 * 1000, // 30 minutes

  // UI settings
  TYPING_DELAY_MS: 1000,
  MESSAGE_MAX_LENGTH: 500,

  // Widget settings
  WIDGET_WIDTH: 380,
  WIDGET_HEIGHT: 600,
  WIDGET_MOBILE_BREAKPOINT: 768,

  // Admin settings
  DEMO_ADMIN_USERNAME: 'admin',
  DEMO_ADMIN_PASSWORD: 'demo123',

  // API settings
  MISTRAL_MODEL: 'mistral-small-latest',
  MAX_RETRIES: 3,

  // Storage keys
  STORAGE_KEYS: {
    SESSION_ID: 'chatbot_session_id',
    ADMIN_AUTH: 'chatbot_admin_auth',
    CHAT_HISTORY: 'chatbot_history',
  },

  // Firebase collections
  COLLECTIONS: {
    CONVERSATIONS: 'conversations',
    LEADS: 'leads',
    ESCALATIONS: 'escalations',
    MESSAGES: 'messages',
  },
} as const;

export const INTENT_KEYWORDS = {
  pricing: ['price', 'cost', 'pricing', 'how much', 'fee', 'charge', 'rate', 'pkr', 'rupees'],
  services: ['service', 'offer', 'provide', 'do you have', 'available', 'what do you'],
  booking: ['book', 'appointment', 'schedule', 'meeting', 'visit', 'reserve'],
  contact: ['contact', 'reach', 'call', 'email', 'phone', 'address', 'location'],
  hours: ['hours', 'open', 'close', 'timing', 'when', 'available time'],
  faq: ['how', 'what', 'why', 'where', 'who', 'can you'],
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Unable to process your request. Please try again.',
  VALIDATION_ERROR: 'Please provide valid information.',
  SESSION_EXPIRED: 'Your session has expired. Please refresh the page.',
} as const;
