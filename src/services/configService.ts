import { BusinessConfig } from '../types/config.types';
import businessConfigData from '../config/businessConfig.json';

class ConfigService {
  private config: BusinessConfig;

  constructor() {
    this.config = businessConfigData as BusinessConfig;
  }

  getConfig(): BusinessConfig {
    return this.config;
  }

  getBusinessName(): string {
    return this.config.business_name;
  }

  getIndustry(): string {
    return this.config.industry;
  }

  getServices(): string[] {
    return this.config.services;
  }

  getPricing(): string {
    return this.config.pricing;
  }

  getBusinessHours(): string {
    return this.config.business_hours;
  }

  getContactEmail(): string {
    return this.config.contact_email;
  }

  getContactPhone(): string {
    return this.config.contact_phone;
  }

  getQuickReplies(): string[] {
    return this.config.quick_replies;
  }

  getWelcomeMessage(): string {
    return this.config.welcome_message || "Hi! I'm your AI Assistant. How can I help you today?";
  }

  getTheme() {
    return this.config.theme || {
      primaryColor: '#3B82F6',
      position: 'bottom-right' as const,
    };
  }

  isFeatureEnabled(feature: 'leadCapture' | 'humanEscalation' | 'emailNotifications'): boolean {
    return this.config.features?.[feature] ?? true;
  }

  // Build context for AI prompts
  getBusinessContext(): string {
    return `
Business Name: ${this.config.business_name}
Industry: ${this.config.industry}
Services: ${this.config.services.join(', ')}
Pricing: ${this.config.pricing}
Business Hours: ${this.config.business_hours}
Contact Email: ${this.config.contact_email}
Contact Phone: ${this.config.contact_phone}
    `.trim();
  }
}

export const configService = new ConfigService();
