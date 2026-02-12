import emailjs from '@emailjs/browser';
import { Lead, Escalation } from '../types/lead.types';
import { configService } from './configService';

class EmailService {
  private serviceId: string;
  private templateId: string;
  private publicKey: string;

  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    this.templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Initialize EmailJS
    emailjs.init(this.publicKey);
  }

  // Send lead notification to admin
  async sendLeadNotification(lead: Lead): Promise<void> {
    try {
      const templateParams = {
        to_email: configService.getContactEmail(),
        business_name: configService.getBusinessName(),
        lead_name: lead.name,
        lead_email: lead.email,
        lead_phone: lead.phone,
        lead_company: lead.company || 'N/A',
        service_interest: lead.serviceInterest || 'N/A',
        preferred_time: lead.preferredContactTime || 'N/A',
        message: lead.message || 'No message provided',
        captured_at: new Date(lead.capturedAt).toLocaleString(),
        subject: `New Lead: ${lead.name} - ${configService.getBusinessName()}`,
      };

      await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Lead notification sent successfully');
    } catch (error) {
      console.error('Error sending lead notification:', error);
      throw new Error('Failed to send lead notification');
    }
  }

  // Send escalation alert to admin
  async sendEscalationAlert(escalation: Escalation): Promise<void> {
    try {
      const conversationText = escalation.conversationTranscript
        .map(msg => `${msg.sender.toUpperCase()}: ${msg.content}`)
        .join('\n');

      const templateParams = {
        to_email: configService.getContactEmail(),
        business_name: configService.getBusinessName(),
        session_id: escalation.sessionId,
        reason: escalation.reason,
        conversation: conversationText,
        user_name: escalation.userContact?.name || 'Unknown',
        user_email: escalation.userContact?.email || 'Not provided',
        user_phone: escalation.userContact?.phone || 'Not provided',
        created_at: new Date(escalation.createdAt).toLocaleString(),
        subject: `Human Escalation Required - ${configService.getBusinessName()}`,
      };

      await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Escalation alert sent successfully');
    } catch (error) {
      console.error('Error sending escalation alert:', error);
      throw new Error('Failed to send escalation alert');
    }
  }

  // Send follow-up email for incomplete leads
  async sendFollowUpEmail(lead: Partial<Lead>): Promise<void> {
    try {
      if (!lead.email) {
        console.warn('Cannot send follow-up: email not provided');
        return;
      }

      const templateParams = {
        to_email: lead.email,
        business_name: configService.getBusinessName(),
        lead_name: lead.name || 'Valued Customer',
        contact_phone: configService.getContactPhone(),
        contact_email: configService.getContactEmail(),
        subject: `Follow-up from ${configService.getBusinessName()}`,
      };

      await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('Follow-up email sent successfully');
    } catch (error) {
      console.error('Error sending follow-up email:', error);
      throw new Error('Failed to send follow-up email');
    }
  }

  // Test email configuration
  async testEmailConfig(): Promise<boolean> {
    try {
      const templateParams = {
        to_email: configService.getContactEmail(),
        business_name: configService.getBusinessName(),
        subject: 'Test Email - Configuration Check',
        message: 'This is a test email to verify EmailJS configuration.',
      };

      await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      return true;
    } catch (error) {
      console.error('Email configuration test failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
