import rateLimit from 'express-rate-limit';

/**
 * Rate limiting configurations for different endpoint types
 */

// Strict rate limit for auth endpoints (login, register)
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
  skipSuccessfulRequests: true, // Only count failed attempts
});

// Moderate rate limit for write operations (reviews, favorites, claims)
export const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});

// General API rate limit (all endpoints)
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // 200 requests per 15 minutes
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});

// Photo upload rate limit
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  message: {
    success: false,
    message: 'Upload limit reached. Please try again later.',
    errorCode: 'RATE_LIMIT_EXCEEDED',
  },
});