export interface Message {
  id: string;
  sessionId: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  intent?: string;
  confidence?: number;
}

export interface ChatSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  messages: Message[];
  leadCaptured: boolean;
  escalated: boolean;
  status: 'active' | 'completed' | 'escalated';
  metadata?: {
    userAgent?: string;
    referrer?: string;
    sourceWebsite?: string;
  };
}

export interface QuickReply {
  label: string;
  value: string;
  intent?: string;
}
