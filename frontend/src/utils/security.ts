// Security utilities for the frontend application

/**
 * Sanitize user input to prevent XSS attacks
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Rwanda format)
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+250|0)[7][0-9]{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Generate secure random string for CSRF tokens
 */
export const generateSecureToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const cryptoObj = window.crypto || (window as any).msCrypto;
  
  if (cryptoObj && cryptoObj.getRandomValues) {
    const randomArray = new Uint8Array(length);
    cryptoObj.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
  } else {
    // Fallback for older browsers
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
  }
  
  return result;
};

/**
 * Secure token storage with encryption
 */
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      // In production, implement proper encryption
      const encrypted = btoa(value); // Basic encoding, replace with proper encryption
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Failed to store secure item:', error);
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      
      // In production, implement proper decryption
      return atob(encrypted); // Basic decoding, replace with proper decryption
    } catch (error) {
      console.error('Failed to retrieve secure item:', error);
      return null;
    }
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};

/**
 * Content Security Policy helpers
 */
export const cspHelpers = {
  generateNonce: (): string => {
    return generateSecureToken(16);
  },
  
  isScriptAllowed: (src: string): boolean => {
    const allowedDomains = [
      'localhost',
      'vercel.app',
      'your-domain.com'
    ];
    
    try {
      const url = new URL(src);
      return allowedDomains.some(domain => url.hostname.includes(domain));
    } catch {
      return false;
    }
  }
};

/**
 * Rate limiting for API calls
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  private maxRequests: number;
  private windowMs: number;
  
  constructor(
    maxRequests: number = 100,
    windowMs: number = 60000 // 1 minute
  ) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs);
    
    if (validRequests.length >= this.maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
  
  reset(key: string): void {
    this.requests.delete(key);
  }
}

/**
 * Input validation schemas
 */
export const validationRules = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: false
  },
  
  validatePassword: (password: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    const rules = validationRules.password;
    
    if (password.length < rules.minLength) {
      errors.push(`Password must be at least ${rules.minLength} characters long`);
    }
    
    if (rules.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (rules.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (rules.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (rules.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

/**
 * Environment-based security configuration
 */
export const securityConfig = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Enable additional security measures in production
  enableCSRF: import.meta.env.PROD,
  enableRateLimiting: import.meta.env.PROD,
  enableSecureHeaders: import.meta.env.PROD,
  
  // API security
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  
  // Session security
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutes before expiry
};