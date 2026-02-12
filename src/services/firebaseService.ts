import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  updateDoc,
  limit,
  QueryConstraint
} from 'firebase/firestore';
import { db } from '../firebase';
import { ChatSession, Message } from '../types/chat.types';
import { Lead, Escalation } from '../types/lead.types';
import { APP_CONSTANTS } from '../utils/constants';

class FirebaseService {
  // Save conversation to Firestore
  async saveConversation(session: ChatSession): Promise<string> {
    try {
      const conversationData = {
        ...session,
        startTime: Timestamp.fromDate(session.startTime),
        endTime: session.endTime ? Timestamp.fromDate(session.endTime) : null,
        messages: session.messages.map(msg => ({
          ...msg,
          timestamp: Timestamp.fromDate(msg.timestamp)
        }))
      };

      const docRef = await addDoc(
        collection(db, APP_CONSTANTS.COLLECTIONS.CONVERSATIONS),
        conversationData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error saving conversation:', error);
      throw new Error('Failed to save conversation');
    }
  }

  // Save individual message
  async saveMessage(message: Message): Promise<string> {
    try {
      const messageData = {
        ...message,
        timestamp: Timestamp.fromDate(message.timestamp)
      };

      const docRef = await addDoc(
        collection(db, APP_CONSTANTS.COLLECTIONS.MESSAGES),
        messageData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  // Save lead to Firestore
  async saveLead(lead: Lead): Promise<string> {
    try {
      const leadData = {
        ...lead,
        capturedAt: Timestamp.fromDate(lead.capturedAt)
      };

      const docRef = await addDoc(
        collection(db, APP_CONSTANTS.COLLECTIONS.LEADS),
        leadData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error saving lead:', error);
      throw new Error('Failed to save lead');
    }
  }

  // Save escalation request
  async saveEscalation(escalation: Escalation): Promise<string> {
    try {
      const escalationData = {
        ...escalation,
        createdAt: Timestamp.fromDate(escalation.createdAt),
        resolvedAt: escalation.resolvedAt ? Timestamp.fromDate(escalation.resolvedAt) : null,
        conversationTranscript: escalation.conversationTranscript.map((msg: any) => ({
          ...msg,
          timestamp: Timestamp.fromDate(msg.timestamp)
        }))
      };

      const docRef = await addDoc(
        collection(db, APP_CONSTANTS.COLLECTIONS.ESCALATIONS),
        escalationData
      );
      return docRef.id;
    } catch (error) {
      console.error('Error saving escalation:', error);
      throw new Error('Failed to save escalation');
    }
  }

  // Get conversations with filters
  async getConversations(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    limitCount?: number;
  }): Promise<ChatSession[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.startDate) {
        constraints.push(where('startTime', '>=', Timestamp.fromDate(filters.startDate)));
      }

      if (filters?.endDate) {
        constraints.push(where('startTime', '<=', Timestamp.fromDate(filters.endDate)));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('startTime', 'desc'));

      if (filters?.limitCount) {
        constraints.push(limit(filters.limitCount));
      }

      const q = query(collection(db, APP_CONSTANTS.COLLECTIONS.CONVERSATIONS), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          startTime: data.startTime.toDate(),
          endTime: data.endTime ? data.endTime.toDate() : undefined,
          messages: data.messages.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate()
          }))
        } as ChatSession;
      });
    } catch (error) {
      console.error('Error getting conversations:', error);
      throw new Error('Failed to fetch conversations');
    }
  }

  // Get leads with filters
  async getLeads(filters?: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    limitCount?: number;
  }): Promise<Lead[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.startDate) {
        constraints.push(where('capturedAt', '>=', Timestamp.fromDate(filters.startDate)));
      }

      if (filters?.endDate) {
        constraints.push(where('capturedAt', '<=', Timestamp.fromDate(filters.endDate)));
      }

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('capturedAt', 'desc'));

      if (filters?.limitCount) {
        constraints.push(limit(filters.limitCount));
      }

      const q = query(collection(db, APP_CONSTANTS.COLLECTIONS.LEADS), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          capturedAt: data.capturedAt.toDate()
        } as Lead;
      });
    } catch (error) {
      console.error('Error getting leads:', error);
      throw new Error('Failed to fetch leads');
    }
  }

  // Get escalations
  async getEscalations(filters?: {
    status?: string;
    limitCount?: number;
  }): Promise<Escalation[]> {
    try {
      const constraints: QueryConstraint[] = [];

      if (filters?.status) {
        constraints.push(where('status', '==', filters.status));
      }

      constraints.push(orderBy('createdAt', 'desc'));

      if (filters?.limitCount) {
        constraints.push(limit(filters.limitCount));
      }

      const q = query(collection(db, APP_CONSTANTS.COLLECTIONS.ESCALATIONS), ...constraints);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(),
          resolvedAt: data.resolvedAt ? data.resolvedAt.toDate() : undefined,
          conversationTranscript: data.conversationTranscript.map((msg: any) => ({
            ...msg,
            timestamp: msg.timestamp.toDate()
          }))
        } as Escalation;
      });
    } catch (error) {
      console.error('Error getting escalations:', error);
      throw new Error('Failed to fetch escalations');
    }
  }

  // Update lead status
  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    try {
      const leadRef = doc(db, APP_CONSTANTS.COLLECTIONS.LEADS, leadId);
      await updateDoc(leadRef, { status });
    } catch (error) {
      console.error('Error updating lead status:', error);
      throw new Error('Failed to update lead status');
    }
  }

  // Update escalation status
  async updateEscalationStatus(
    escalationId: string,
    status: Escalation['status'],
    resolvedBy?: string
  ): Promise<void> {
    try {
      const escalationRef = doc(db, APP_CONSTANTS.COLLECTIONS.ESCALATIONS, escalationId);
      const updateData: any = { status };

      if (status === 'resolved') {
        updateData.resolvedAt = Timestamp.now();
        if (resolvedBy) {
          updateData.resolvedBy = resolvedBy;
        }
      }

      await updateDoc(escalationRef, updateData);
    } catch (error) {
      console.error('Error updating escalation status:', error);
      throw new Error('Failed to update escalation status');
    }
  }
}

export const firebaseService = new FirebaseService();
