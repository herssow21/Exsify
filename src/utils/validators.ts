/**
 * Validation utilities for forms and data
 */

/**
 * Validates an email address
 * @param email - The email to validate
 * @returns boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password length
 * @param password - The password to validate
 * @returns boolean indicating if password meets minimum length
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Checks if a value is not empty
 * @param value - The value to check
 * @returns boolean indicating if value is not empty
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Gets validation error message for a field
 * @param field - Field name
 * @param value - Field value
 * @param rules - Array of validation rules
 * @returns Error message or null if valid
 */
export function getValidationError(field: string, value: string, rules: string[]): string | null {
  for (const rule of rules) {
    switch (rule) {
      case 'required':
        if (!isRequired(value)) {
          return `${field} is required`;
        }
        break;
      case 'email':
        if (!isValidEmail(value)) {
          return `Please enter a valid email address`;
        }
        break;
      case 'password':
        if (!isValidPassword(value)) {
          return `Password must be at least 6 characters`;
        }
        break;
    }
  }
  return null;
}

/**
 * Generates a unique ID
 * @returns Unique string ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Encodes a password using base64 (for demo purposes only)
 * @param password - Plain text password
 * @returns Base64 encoded password
 */
export function encodePassword(password: string): string {
  if (typeof btoa !== 'undefined') {
    return btoa(password);
  }
  return Buffer.from(password).toString('base64');
}

/**
 * Decodes a base64 encoded password
 * @param encodedPassword - Base64 encoded password
 * @returns Decoded password or empty string if invalid
 */
export function decodePassword(encodedPassword: string): string {
  try {
    if (typeof atob !== 'undefined') {
      return atob(encodedPassword);
    }
    return Buffer.from(encodedPassword, 'base64').toString('utf-8');
  } catch {
    return '';
  }
}

/**
 * Formats a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Truncates text to a specified length
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
