/**
 * DwelloCrew 2.0 — Modular Experience-Based Reputation Scoring Engine
 */

import { CONFIG } from '../config.js';

export class ReputationService {
  /**
   * Calculates a composite experience & trust score (0 - 100)
   * based on rating, job volume, success rate, and active experience years.
   */
  static calculateReputationScore(pro) {
    if (!pro) return { score: 0, level: 'Unrated', badge: '' };

    const weights = CONFIG.REPUTATION_WEIGHTS;

    // 1. Star Rating Component (0 - 100)
    const ratingNorm = ((pro.ratingAverage || 5.0) / 5.0) * 100;

    // 2. Completed Volume Component (Logarithmic scale capping at 500 jobs)
    const jobsCount = pro.completedJobs || 0;
    const volumeNorm = Math.min(100, (Math.log10(jobsCount + 1) / Math.log10(500)) * 100);

    // 3. Success Rate Component (0 - 100)
    const successRatio = pro.completedJobs > 0 ? (pro.successfulJobs / pro.completedJobs) * 100 : 100;

    // 4. Experience Years Component (Normalized up to 15 years)
    const expNorm = Math.min(100, ((pro.experienceYears || 1) / 15) * 100);

    // Weighted Score
    const compositeScore = Math.round(
      (ratingNorm * weights.RATING_WEIGHT) +
      (volumeNorm * weights.COMPLETED_JOBS_WEIGHT) +
      (successRatio * weights.SUCCESS_RATE_WEIGHT) +
      (expNorm * weights.EXPERIENCE_WEIGHT)
    );

    // Tier Classification
    let level = 'Emerging Professional';
    let badge = '🛡️ Verified Pro';
    if (compositeScore >= 92 && jobsCount >= 100) {
      level = 'Master Veteran Pro';
      badge = '👑 Dwello Platinum Pro';
    } else if (compositeScore >= 80 && jobsCount >= 50) {
      level = 'Top Rated Expert';
      badge = '⭐ Gold Service Pro';
    } else if (compositeScore >= 65) {
      level = 'Trusted Specialist';
      badge = '✅ Silver Verified';
    }

    return {
      score: compositeScore,
      level,
      badge,
      metrics: {
        starRating: pro.ratingAverage || 5.0,
        completedJobs: jobsCount,
        successRate: successRatio.toFixed(1) + '%',
        experienceYears: pro.experienceYears || 1
      }
    };
  }
}
