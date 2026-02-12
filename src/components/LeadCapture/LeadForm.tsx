import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useChatStore } from '../../store/chatStore';
import { firebaseService } from '../../services/firebaseService';
import { emailService } from '../../services/emailService';
import { configService } from '../../services/configService';
import { validateLeadForm } from '../../utils/validation';
import { Lead, LeadFormData } from '../../types/lead.types';
import { Input, TextArea } from '../shared/Input';
import { Button } from '../shared/Button';

interface LeadFormProps {
  onClose: () => void;
}

export const LeadForm: React.FC<LeadFormProps> = ({ onClose }) => {
  const { sessionId, setLeadCaptured, addMessage } = useChatStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    serviceInterest: '',
    preferredContactTime: '',
    message: '',
  });

  const handleChange = (field: keyof LeadFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateLeadForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Create lead object
      const lead: Lead = {
        id: uuidv4(),
        sessionId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterest: formData.serviceInterest,
        preferredContactTime: formData.preferredContactTime,
        message: formData.message,
        capturedAt: new Date(),
        status: 'new',
      };

      // Save to Firebase
      await firebaseService.saveLead(lead);

      // Send email notification if enabled
      if (configService.isFeatureEnabled('emailNotifications')) {
        try {
          await emailService.sendLeadNotification(lead);
        } catch (emailError) {
          console.error('Failed to send email notification:', emailError);
          // Don't fail the whole process if email fails
        }
      }

      // Update chat state
      setLeadCaptured(true);

      // Add success message to chat
      const successMessage = {
        id: uuidv4(),
        sessionId,
        content: `Thank you, ${formData.name}! We've received your information and will contact you soon at ${formData.email}.`,
        sender: 'bot' as const,
        timestamp: new Date(),
      };
      addMessage(successMessage);

      // Close form
      onClose();
    } catch (error) {
      console.error('Error submitting lead:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = configService.getServices();

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-900">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Get in Touch</h3>
        <p className="text-sm text-slate-400">
          Please provide your details and we'll get back to you shortly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name *"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Your full name"
          error={errors.name}
          disabled={isSubmitting}
        />

        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="your.email@example.com"
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Phone *"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="+92-XXX-XXXXXXX"
          error={errors.phone}
          disabled={isSubmitting}
        />

        <Input
          label="Company (Optional)"
          type="text"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Your company name"
          disabled={isSubmitting}
        />

        <div className="w-full">
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Service Interest (Optional)
          </label>
          <select
            value={formData.serviceInterest}
            onChange={(e) => handleChange('serviceInterest', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800 border border-purple-500/30 text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            disabled={isSubmitting}
          >
            <option value="">Select a service</option>
            {services.map((service, index) => (
              <option key={index} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Preferred Contact Time (Optional)"
          type="text"
          value={formData.preferredContactTime}
          onChange={(e) => handleChange('preferredContactTime', e.target.value)}
          placeholder="e.g., Morning, Afternoon, Evening"
          disabled={isSubmitting}
        />

        <TextArea
          label="Message (Optional)"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Any additional information..."
          rows={3}
          error={errors.message}
          disabled={isSubmitting}
        />

        {errors.submit && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{errors.submit}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};
