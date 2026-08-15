import { Request, Response, NextFunction } from 'express';

/**
 * Middleware setting security HTTP response headers
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction): void => {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');

  // Anti-clickjacking protection
  res.setHeader('X-Frame-Options', 'DENY');

  // XSS protection for legacy browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Enforce HTTP Strict Transport Security (HSTS)
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Control referrer information sent in headers
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Permissions Policy
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Remove Express server identifier
  res.removeHeader('X-Powered-By');

  next();
};

/**
 * Recursive helper to sanitize objects against MongoDB injection ($ and . keys)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const sanitizeData = (data: any): any => {
  if (data instanceof Object) {
    for (const key in data) {
      if (/^\$|\./.test(key)) {
        delete data[key];
      } else {
        data[key] = sanitizeData(data[key]);
      }
    }
  }
  return data;
};

/**
 * Middleware protecting against NoSQL Operator Injection
 */
export const noSqlSanitizer = (req: Request, res: Response, next: NextFunction): void => {
  if (req.body) req.body = sanitizeData(req.body);
  if (req.query) req.query = sanitizeData(req.query);
  if (req.params) req.params = sanitizeData(req.params);
  next();
};

/**
 * Basic in-memory rate limiter per IP address
 */
interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired rate limit entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 10 * 60 * 1000);

export const rateLimiter = (options: { windowMs?: number; max?: number; message?: string } = {}) => {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes default
  const maxHits = options.max || 100; // max 100 requests per window
  const message = options.message || 'Too many requests from this IP, please try again later.';

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();

    let record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimitStore.set(ip, record);
      return next();
    }

    record.count++;
    if (record.count > maxHits) {
      res.status(429).json({
        status: 'fail',
        message: message,
      });
      return;
    }

    next();
  };
};
