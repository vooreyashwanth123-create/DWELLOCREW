/**
 * DwelloCrew 2.0 — Professional Application & Dashboard View
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { authService } from '../services/authService.js';
import { bookingService } from '../services/bookingService.js';
import { ReputationService } from '../services/reputationService.js';
import { renderRatingStars } from '../components/ratingStars.js';
import { Modal } from '../components/modal.js';
import { Toast } from '../components/toast.js';

export function renderProView(activeTab = 'dashboard') {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'PROFESSIONAL') {
    return `<div class="p-8 text-center"><h2 class="text-xl">Access Denied</h2><p>Please log in as a Professional.</p></div>`;
  }

  const reputation = ReputationService.calculateReputationScore(currentUser);
  const myBookings = bookingService.getBookingsForUser(currentUser.id, 'PROFESSIONAL');
  const reviews = dbStorage.getItem(CONFIG.STORAGE_KEYS.REVIEWS, []).filter(r => r.proId === currentUser.id);

  // Financial metrics
  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED');
  const grossEarnings = completedBookings.reduce((sum, b) => sum + (b.subtotal || 0), 0);
  const netEarnings = grossEarnings * (1 - (CONFIG.COMMISSION_PERCENT / 100));

  const pendingBookings = myBookings.filter(b => b.status === 'PENDING');
  const activeBookings = myBookings.filter(b => b.status === 'CONFIRMED' || b.status === 'ON_THE_WAY' || b.status === 'IN_PROGRESS');

  return `
    <div class="dashboard-wrapper animate-fade-in">
      <!-- PRO HEADER & REPUTATION SUMMARY -->
      <div class="dashboard-header glass-panel">
        <div class="pro-header-flex">
          <div class="pro-identity-row">
            <img src="${currentUser.avatar}" alt="${currentUser.name}" class="pro-header-avatar" />
            <div>
              <h2>${currentUser.name} ${currentUser.verificationStatus === 'VERIFIED' ? '✅' : '⏳'}</h2>
              <div class="reputation-badges-line mt-1">
                <span class="reputation-badge-chip">${reputation.badge}</span>
                <span class="reputation-level-chip">${reputation.level}</span>
                <span class="score-pill">Dwello Score: <strong>${reputation.score}/100</strong></span>
              </div>
            </div>
          </div>

          <div class="vacation-toggle-box">
            <label for="vacation-mode-toggle" class="toggle-label">
              <span>Vacation Mode:</span>
              <input type="checkbox" id="vacation-mode-toggle" ${currentUser.vacationMode ? 'checked' : ''} />
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>

        <!-- DASHBOARD NAVIGATION TABS -->
        <div class="dashboard-tabs mt-4">
          <button class="dash-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">📊 Dashboard</button>
          <button class="dash-tab-btn ${activeTab === 'schedule' ? 'active' : ''}" data-tab="schedule">📅 Working Schedule</button>
          <button class="dash-tab-btn ${activeTab === 'earnings' ? 'active' : ''}" data-tab="earnings">💰 Earnings ($${netEarnings.toFixed(2)})</button>
          <button class="dash-tab-btn ${activeTab === 'reviews' ? 'active' : ''}" data-tab="reviews">⭐ Feedback (${reviews.length})</button>
        </div>
      </div>

      <div class="dashboard-body mt-6">
        ${activeTab === 'dashboard' ? renderProDashboardTab(activeBookings, pendingBookings, completedBookings, currentUser) : ''}
        ${activeTab === 'schedule' ? renderProScheduleTab(currentUser) : ''}
        ${activeTab === 'earnings' ? renderProEarningsTab(completedBookings, grossEarnings, netEarnings) : ''}
        ${activeTab === 'reviews' ? renderProReviewsTab(reviews) : ''}
      </div>
    </div>
  `;
}

function renderProDashboardTab(active, pending, completed, user) {
  return `
    <div class="pro-dashboard-grid">
      <!-- STAT CARDS -->
      <div class="metrics-row grid-4col">
        <div class="stat-card glass-panel">
          <span class="stat-title">Pending Requests</span>
          <span class="stat-value text-amber">${pending.length}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-title">Active Services</span>
          <span class="stat-value text-sky">${active.length}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-title">Total Completed</span>
          <span class="stat-value text-emerald">${completed.length + (user.completedJobs || 0)}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-title">Success Rate</span>
          <span class="stat-value text-emerald">${user.getSuccessRatePercent ? user.getSuccessRatePercent() : '99.4'}%</span>
        </div>
      </div>

      <!-- ACTIVE & PENDING BOOKINGS LIST -->
      <div class="pro-bookings-section glass-panel mt-6 p-6">
        <h3>Active & Incoming Bookings</h3>
        ${[...pending, ...active].length === 0 ? `
          <p class="text-subtle p-4 text-center">No pending or active bookings. Ensure your status is active and schedule slots are available.</p>
        ` : `
          <div class="bookings-grid mt-4">
            ${[...pending, ...active].map(b => `
              <div class="booking-card glass-panel border-accent">
                <div class="booking-card-header">
                  <div>
                    <span class="booking-id-badge">#${b.id.substr(0, 8)}</span>
                    <h4>${b.serviceName}</h4>
                    <p>Customer: <strong>${b.customerName}</strong> (${b.customerEmail})</p>
                  </div>
                  <span class="booking-status-pill status-${b.status.toLowerCase()}">${b.status.replace(/_/g, ' ')}</span>
                </div>

                <div class="booking-details-grid my-3">
                  <div>📅 <strong>Date/Time:</strong> ${b.date} at ${b.timeSlot}</div>
                  <div>📍 <strong>Address:</strong> ${b.address}</div>
                  <div>💵 <strong>Pro Payout:</strong> $${(b.subtotal * (1 - (CONFIG.COMMISSION_PERCENT / 100))).toFixed(2)}</div>
                </div>

                <div class="pro-booking-actions">
                  ${b.status === 'PENDING' ? `
                    <button class="btn btn-emerald btn-sm pro-accept-btn" data-id="${b.id}">Accept Request</button>
                    <button class="btn btn-danger-outline btn-sm pro-reject-btn" data-id="${b.id}">Reject</button>
                  ` : ''}

                  ${b.status === 'CONFIRMED' ? `
                    <button class="btn btn-sky btn-sm pro-status-btn" data-id="${b.id}" data-next="ON_THE_WAY">Mark "On The Way"</button>
                  ` : ''}

                  ${b.status === 'ON_THE_WAY' ? `
                    <button class="btn btn-sky btn-sm pro-status-btn" data-id="${b.id}" data-next="IN_PROGRESS">Start Service</button>
                  ` : ''}

                  ${b.status === 'IN_PROGRESS' ? `
                    <button class="btn btn-emerald btn-sm pro-status-btn" data-id="${b.id}" data-next="COMPLETED">Complete Service</button>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

function renderProScheduleTab(user) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const userDays = user.workingDays || [];

  return `
    <div class="glass-panel p-6">
      <h3>Manage Working Days & Available Time Slots</h3>
      <p class="text-subtle">Prevent double-bookings by selecting only hours you are active.</p>

      <form id="schedule-form" class="mt-4">
        <h4>Working Days</h4>
        <div class="days-checkbox-grid my-3">
          ${days.map(d => `
            <label class="checkbox-pill">
              <input type="checkbox" name="workingDays" value="${d}" ${userDays.includes(d) ? 'checked' : ''} />
              <span>${d}</span>
            </label>
          `).join('')}
        </div>

        <h4 class="mt-4">Default Time Slots</h4>
        <p class="text-subtle-sm">Enter comma-separated time slots (e.g. 09:00 AM, 11:30 AM, 02:00 PM)</p>
        <input type="text" id="time-slots-input" class="form-input mt-2" value="${(user.timeSlots || []).join(', ')}" />

        <button type="submit" class="btn btn-primary mt-4">Save Working Hours</button>
      </form>
    </div>
  `;
}

function renderProEarningsTab(completed, gross, net) {
  return `
    <div class="earnings-layout grid-2col">
      <div class="glass-panel p-6">
        <h3>Payout Summary</h3>
        <div class="payout-box my-4">
          <div class="payout-item">
            <span>Gross Completed Value:</span>
            <strong>$${gross.toFixed(2)}</strong>
          </div>
          <div class="payout-item">
            <span>Platform Commission (${CONFIG.COMMISSION_PERCENT}%):</span>
            <span class="text-subtle">-$${(gross * (CONFIG.COMMISSION_PERCENT / 100)).toFixed(2)}</span>
          </div>
          <hr class="my-2 border-slate" />
          <div class="payout-item highlight">
            <span>Net Earnings Payable:</span>
            <strong class="text-emerald">$${net.toFixed(2)}</strong>
          </div>
        </div>
      </div>

      <div class="glass-panel p-6">
        <h3>Completed Payout History</h3>
        <div class="completed-history-list mt-3">
          ${completed.length === 0 ? '<p class="text-subtle">No completed payouts yet.</p>' : ''}
          ${completed.map(b => `
            <div class="history-item-row">
              <div>
                <strong>${b.serviceName}</strong>
                <small>${b.date} • ${b.customerName}</small>
              </div>
              <strong class="text-emerald">+$${(b.subtotal * (1 - (CONFIG.COMMISSION_PERCENT / 100))).toFixed(2)}</strong>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderProReviewsTab(reviews) {
  return `
    <div class="glass-panel p-6">
      <h3>Customer Experience Reviews</h3>
      <div class="reviews-list-grid mt-4">
        ${reviews.length === 0 ? '<p class="text-subtle">No customer reviews written yet.</p>' : ''}
        ${reviews.map(r => `
          <div class="review-card glass-panel">
            <div class="review-header">
              <strong>${r.customerName}</strong>
              ${renderRatingStars(r.rating, true)}
            </div>
            <span class="review-service-tag">${r.serviceName}</span>
            <p class="review-comment mt-2">"${r.comment}"</p>
            <div class="review-tags mt-2">
              ${(r.tags || []).map(t => `<span class="tag-chip">${t}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
