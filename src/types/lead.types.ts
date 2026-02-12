export interface Lead {
  id: string;
  sessionId: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterest?: string;
  preferredContactTime?: string;
  message?: string;
  capturedAt: Date;
  status: 'new' | 'contacted' | 'converted' | 'lost';
  source?: string;
}

export interface LeadFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  serviceInterest?: string;
  preferredContactTime?: string;
  message?: string;
}

export interface Escalation {
  id: string;
  sessionId: string;
  conversationTranscript: Message[];
  userContact?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  reason: string;
  createdAt: Date;
  status: 'pending' | 'resolved';
  resolvedAt?: Date;
  resolvedBy?: string;
}
