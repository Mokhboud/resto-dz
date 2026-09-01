/**
 * Restaurant Ranking Configuration
 * 
 * Centralized configuration for the Bayesian-style ranking algorithm.
 * 
 * Formula:
 * WR = (v / (v + m)) * R + (m / (v + m)) * C
 * 
 * Where:
 * - R = restaurant's average rating from valid published reviews
 * - v = number of valid published reviews for the restaurant
 * - C = global average rating across all valid published reviews
 * - m = configurable minimum review threshold
 */

export const rankingConfig = {
  // Bayesian minimum reviews threshold (m)
  // Higher values require more reviews before a restaurant's own rating is trusted
  BAYESIAN_MIN_REVIEWS: parseInt(process.env.BAYESIAN_MIN_REVIEWS || '10'),

  // Fallback global average (C) — used only if no valid reviews exist in the system
  DEFAULT_GLOBAL_AVERAGE: parseFloat(process.env.DEFAULT_GLOBAL_AVERAGE || '3.5'),

  // Pagination defaults
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,

  // Trust score weights (Phase 7.3 foundation)
  TRUST_SCORE_WEIGHTS: {
    EMAIL_VERIFIED: 10,
    PHONE_VERIFIED: 10,
    ACCOUNT_AGE_DAYS: 5, // weight for account age factor
    PUBLISHED_REVIEWS: 10,
    HELPFUL_VOTES: 15,
  },

  // Trust score maximum
  MAX_TRUST_SCORE: 100,
};

export default rankingConfig;