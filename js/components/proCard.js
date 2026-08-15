/**
 * DwelloCrew 2.0 — Multi-Metric Experience Professional Card Component
 */

import { ReputationService } from '../services/reputationService.js';
import { renderRatingStars } from './ratingStars.js';

export function renderProCard(pro, onBookClick, onViewDetailClick) {
  const reputation = ReputationService.calculateReputationScore(pro);
  const isVerified = pro.verificationStatus === 'VERIFIED';

  return `
    <div class="pro-card glass-panel" data-pro-id="${pro.id}">
      <div class="pro-card-header">
        <div class="pro-avatar-wrapper">
          <img src="${pro.avatar}" alt="${pro.name}" class="pro-avatar" />
          ${isVerified ? '<span class="verified-icon-badge" title="Identity & License Verified">✓</span>' : ''}
        </div>
        <div class="pro-title-meta">
          <div class="pro-badge-row">
            <span class="reputation-badge-chip">${reputation.badge}</span>
            ${isVerified ? '<span class="verified-pill">Verified Pro</span>' : '<span class="pending-pill">Verification Pending</span>'}
          </div>
          <h3 class="pro-name">${pro.name}</h3>
          <p class="pro-bio-short">${pro.bio ? pro.bio.substr(0, 85) + '...' : 'Experienced DwelloCrew specialist.'}</p>
        </div>
      </div>

      <!-- Experience & Performance Matrix -->
      <div class="pro-metrics-grid">
        <div class="metric-box">
          <span class="metric-value">${pro.experienceYears || 1} Yrs</span>
          <span class="metric-label">Experience</span>
        </div>
        <div class="metric-box">
          <span class="metric-value">${pro.completedJobs || 0}</span>
          <span class="metric-label">Jobs Done</span>
        </div>
        <div class="metric-box">
          <span class="metric-value">${reputation.metrics.successRate}</span>
          <span class="metric-label">Success</span>
        </div>
        <div class="metric-box highlight">
          <span class="metric-value">${reputation.score}/100</span>
          <span class="metric-label">Dwello Score</span>
        </div>
      </div>

      <!-- Rating & Service Areas -->
      <div class="pro-card-body">
        <div class="pro-rating-row">
          ${renderRatingStars(pro.ratingAverage, true, pro.completedJobs)}
          <span class="service-area-tag">📍 ${(pro.serviceAreas || ['Local']).slice(0, 2).join(', ')}</span>
        </div>

        <div class="pro-pricing-row">
          <div class="price-display">
            <span class="price-amount">$${pro.hourlyRate || 50}</span>
            <span class="price-unit">/ hr base</span>
          </div>
          <div class="pro-actions">
            <button class="btn btn-outline btn-sm view-pro-btn" data-id="${pro.id}">View Profile</button>
            <button class="btn btn-primary btn-sm book-pro-btn" data-id="${pro.id}">Book Service</button>
          </div>
        </div>
      </div>
    </div>
  `;
}
