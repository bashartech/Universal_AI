export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  // Supports formats: +92-XXX-XXXXXXX, 03XXXXXXXXX, etc.
  const phoneRegex = /^(\+92|0)?[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
};

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0;
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const validateMessage = (message: string, maxLength: number = 500): boolean => {
  return message.trim().length > 0 && message.trim().length <= maxLength;
};

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateLeadForm = (data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
}): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!validateRequired(data.name)) {
    errors.name = 'Name is required';
  } else if (!validateName(data.name)) {
    errors.name = 'Name must be between 2 and 50 characters';
  }

  if (!validateRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateRequired(data.phone)) {
    errors.phone = 'Phone number is required';
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (data.message && !validateMessage(data.message)) {
    errors.message = 'Message is too long (max 500 characters)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
