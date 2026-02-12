import { Intent } from '../types/config.types';
import { INTENT_KEYWORDS } from './constants';

export const detectIntentFromKeywords = (message: string): Intent => {
  const messageLower = message.toLowerCase();
  let detectedIntent: Intent = Intent.GENERAL;
  let maxMatches = 0;

  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
    const matches = keywords.filter(keyword => messageLower.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIntent = intent as Intent;
    }
  }

  return detectedIntent;
};

export const calculateIntentConfidence = (message: string, intent: Intent): number => {
  const messageLower = message.toLowerCase();
  const keywords = INTENT_KEYWORDS[intent as keyof typeof INTENT_KEYWORDS] || [];

  const matches = keywords.filter(keyword => messageLower.includes(keyword)).length;

  if (matches === 0) return 0.3;
  return Math.min(0.5 + (matches * 0.15), 0.95);
};
