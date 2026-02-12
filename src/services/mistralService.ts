import { Intent } from '../types/config.types';
import { Message } from '../types/chat.types';
import { configService } from './configService';
import { APP_CONSTANTS, INTENT_KEYWORDS } from '../utils/constants';

interface MistralResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface IntentDetectionResult {
  intent: Intent;
  confidence: number;
}

class MistralService {
  private apiKey: string;
  private apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private model = APP_CONSTANTS.MISTRAL_MODEL;

  constructor() {
    this.apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
  }

  // Detect intent from user message
  async detectIntent(userMessage: string): Promise<IntentDetectionResult> {
    const messageLower = userMessage.toLowerCase();
    let detectedIntent: Intent = Intent.GENERAL;
    let maxMatches = 0;

    // Simple keyword-based intent detection
    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      const matches = keywords.filter(keyword => messageLower.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedIntent = intent as Intent;
      }
    }

    // Calculate confidence based on keyword matches
    const confidence = maxMatches > 0 ? Math.min(0.5 + (maxMatches * 0.15), 0.95) : 0.3;

    return {
      intent: detectedIntent,
      confidence
    };
  }

  // Generate AI response
  async generateResponse(
    userMessage: string,
    conversationHistory: Message[],
    detectedIntent?: Intent
  ): Promise<{ response: string; confidence: number }> {
    try {
      const businessContext = configService.getBusinessContext();
      const intent = detectedIntent || (await this.detectIntent(userMessage)).intent;

      // Build conversation context
      const conversationContext = conversationHistory
        .slice(-5) // Last 5 messages for context
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Build system prompt
      const systemPrompt = `You are a helpful AI assistant for ${configService.getBusinessName()}, a business in the ${configService.getIndustry()} industry.

${businessContext}

Your role:
- Answer customer questions professionally and helpfully
- Provide accurate information about services, pricing, and business hours
- Be conversational and friendly
- If you don't know something, admit it and offer to connect them with a human representative
- Keep responses concise (2-3 sentences max)
- Never make up information not provided in the business context

Current conversation intent: ${intent}`;

      const userPrompt = conversationContext
        ? `Previous conversation:\n${conversationContext}\n\nUser's current message: ${userMessage}`
        : `User's message: ${userMessage}`;

      // Call Mistral API
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      });

      if (!response.ok) {
        throw new Error(`Mistral API error: ${response.status}`);
      }

      const data: MistralResponse = await response.json();
      const aiResponse = data.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';

      // Calculate confidence based on response quality
      const confidence = this.calculateConfidence(aiResponse, intent);

      return {
        response: aiResponse,
        confidence
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: "I'm having trouble processing your request right now. Would you like to speak with a human representative?",
        confidence: 0.2
      };
    }
  }

  // Generate response for specific intents
  async generateIntentBasedResponse(intent: Intent): Promise<string> {
    const config = configService.getConfig();

    switch (intent) {
      case Intent.PRICING:
        return `Our pricing: ${config.pricing}. Would you like more detailed information about specific services?`;

      case Intent.SERVICES:
        return `We offer the following services: ${config.services.join(', ')}. Which service interests you?`;

      case Intent.HOURS:
        return `Our business hours are: ${config.business_hours}. How can I assist you?`;

      case Intent.CONTACT:
        return `You can reach us at:\n📧 Email: ${config.contact_email}\n📞 Phone: ${config.contact_phone}\n\nWould you like to leave your contact information for a callback?`;

      case Intent.BOOKING:
        return `I'd be happy to help you schedule an appointment! Could you please provide your name, email, and preferred time?`;

      default:
        return `I'm here to help! You can ask me about our services, pricing, business hours, or schedule an appointment. What would you like to know?`;
    }
  }

  // Calculate confidence score
  calculateConfidence(response: string, intent: Intent): number {
    let confidence = APP_CONSTANTS.MIN_CONFIDENCE_THRESHOLD;

    // Check response length (too short or too long might indicate issues)
    if (response.length > 20 && response.length < 300) {
      confidence += 0.1;
    }

    // Check if response contains business-specific information
    const businessName = configService.getBusinessName();
    if (response.toLowerCase().includes(businessName.toLowerCase())) {
      confidence += 0.1;
    }

    // Check for uncertainty phrases
    const uncertaintyPhrases = ['i don\'t know', 'i\'m not sure', 'i cannot', 'i can\'t'];
    const hasUncertainty = uncertaintyPhrases.some(phrase =>
      response.toLowerCase().includes(phrase)
    );
    if (hasUncertainty) {
      confidence -= 0.2;
    }

    // Intent-specific confidence adjustments
    if (intent === Intent.PRICING || intent === Intent.SERVICES || intent === Intent.HOURS) {
      confidence += 0.15; // Higher confidence for factual queries
    }

    return Math.max(0.1, Math.min(confidence, 0.95));
  }

  // Determine if escalation is needed
  shouldEscalate(confidence: number, intent?: Intent): boolean {
    if (confidence < APP_CONSTANTS.MIN_CONFIDENCE_THRESHOLD) {
      return true;
    }

    // Always allow escalation for complex intents
    if (intent === Intent.UNKNOWN) {
      return true;
    }

    return false;
  }

  // Generate fallback response
  getFallbackResponse(): string {
    return `I'm not fully sure about that, but I can connect you with a human representative who can help. Would you like me to do that?`;
  }

  // Test Mistral API connection
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'user', content: 'Hello' }
          ],
          max_tokens: 10
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Mistral API connection test failed:', error);
      return false;
    }
  }
}

export const mistralService = new MistralService();
