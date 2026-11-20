/**
 * Form Validation Utilities for Smart Lead Management System
 */

// Email regex matching standard RFC 5322 format
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Phone character regex permitting international country codes (+), brackets, hyphens, dots, and spaces
export const PHONE_CHARS_REGEX = /^[+]?[0-9\s\-().]{7,25}$/;

/**
 * Validates a single lead form field
 * @param {string} name - Field name
 * @param {string} value - Field value
 * @returns {string|null} - Error message or null if valid
 */
export function validateField(name, value) {
  const trimmed = (value || '').trim();

  switch (name) {
    case 'fullName':
      if (!trimmed) {
        return 'Full name is required';
      }
      if (trimmed.length < 2) {
        return 'Full name must be at least 2 characters';
      }
      if (trimmed.length > 80) {
        return 'Full name cannot exceed 80 characters';
      }
      return null;

    case 'email':
      if (!trimmed) {
        return 'Email address is required';
      }
      if (!EMAIL_REGEX.test(trimmed)) {
        return 'Please enter a valid email address (e.g., name@company.com)';
      }
      return null;

    case 'phone':
      if (!trimmed) {
        return 'Phone number is required';
      }
      if (!PHONE_CHARS_REGEX.test(trimmed)) {
        return 'Please enter a valid phone number format (e.g., +1 555-019-2834)';
      }
      // Count digits
      const digitsOnly = trimmed.replace(/\D/g, '');
      if (digitsOnly.length < 7) {
        return 'Phone number must contain at least 7 digits';
      }
      if (digitsOnly.length > 16) {
        return 'Phone number cannot exceed 16 digits';
      }
      return null;

    case 'company':
      // Optional field, but validate max length if provided
      if (trimmed && trimmed.length > 100) {
        return 'Company name cannot exceed 100 characters';
      }
      return null;

    case 'message':
      if (!trimmed) {
        return 'Requirements / Message is required';
      }
      if (trimmed.length < 10) {
        return `Please provide a bit more detail (at least 10 characters, current: ${trimmed.length})`;
      }
      if (trimmed.length > 2000) {
        return 'Message cannot exceed 2,000 characters';
      }
      return null;

    default:
      return null;
  }
}

/**
 * Validates all fields in the lead form
 * @param {Object} formData
 * @returns {Object} - Map of field name to error message
 */
export function validateLeadForm(formData) {
  const errors = {};

  const fields = ['fullName', 'email', 'phone', 'company', 'message'];
  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
