export interface BusinessConfig {
  business_name: string;
  industry: string;
  services: string[];
  pricing: string;
  business_hours: string;
  contact_email: string;
  contact_phone: string;
  quick_replies: string[];
  welcome_message?: string;
  theme?: {
    primaryColor?: string;
    position?: 'bottom-right' | 'bottom-left';
  };
  features?: {
    leadCapture?: boolean;
    humanEscalation?: boolean;
    emailNotifications?: boolean;
  };
}

export interface WidgetConfig {
  widgetId: string;
  businessConfig: BusinessConfig;
  position?: 'bottom-right' | 'bottom-left';
  theme?: {
    primaryColor?: string;
  };
}

export const Intent = {
  PRICING: 'pricing',
  SERVICES: 'services',
  BOOKING: 'booking',
  CONTACT: 'contact',
  HOURS: 'hours',
  FAQ: 'faq',
  GENERAL: 'general',
  UNKNOWN: 'unknown'
} as const;

export type Intent = typeof Intent[keyof typeof Intent];
