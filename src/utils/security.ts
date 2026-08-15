/**
 * Client-Side Security Utility
 * Provides browser console suppression and security helper utilities.
 */

// Disable browser console logs in production mode or when explicit suppression is enabled
export const suppressBrowserConsole = (): void => {
  if (import.meta.env.PROD || process.env.NODE_ENV === 'production') {
    const noop = () => {};

    // Override standard console logging methods safely
    window.console.log = noop;
    window.console.info = noop;
    window.console.debug = noop;
    window.console.warn = noop;
    window.console.trace = noop;
    // Retain console.error for unhandled errors
  }
};

/**
 * Sanitize text strings to prevent HTML script injection (XSS protection)
 */
export const sanitizeInput = (str: string): string => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Initialize client-side security protections
 */
export const initClientSecurity = (): void => {
  suppressBrowserConsole();

  // Prevent dangerous default drop behaviors
  window.addEventListener('dragover', (e) => e.preventDefault(), false);
  window.addEventListener('drop', (e) => e.preventDefault(), false);
};
