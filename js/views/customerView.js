/**
 * DwelloCrew 2.0 — Customer Application & Dashboard View
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { authService } from '../services/authService.js';
import { bookingService } from '../services/bookingService.js';
import { notificationService } from '../services/notificationService.js';
import { renderProCard } from '../components/proCard.js';
import { renderRatingStars } from '../components/ratingStars.js';
import { Modal } from '../components/modal.js';
import { Toast } from '../components/toast.js';

export function renderCustomerView(activeTab = 'discovery') {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'CUSTOMER') {
    return `<div class="p-8 text-center"><h2 class="text-xl">Access Denied</h2><p>Please log in as a Customer.</p></div>`;
  }

  const categories = dbStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES, []);
  const allUsers = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
  const verifiedPros = allUsers.filter(u => u.role === 'PROFESSIONAL' && u.verificationStatus === 'VERIFIED');
  const myBookings = bookingService.getBookingsForUser(currentUser.id, 'CUSTOMER');

  return `
    <div class="dashboard-wrapper animate-fade-in">
      <div class="dashboard-header glass-panel">
        <div class="user-greeting">
          <h2>Welcome back, ${currentUser.name}! 👋</h2>
          <p>Find top-rated professionals for your home or manage active bookings.</p>
        </div>
        <div class="dashboard-tabs">
          <button class="dash-tab-btn ${activeTab === 'discovery' ? 'active' : ''}" data-tab="discovery">🔍 Service Discovery</button>
          <button class="dash-tab-btn ${activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">
            📅 My Bookings (${myBookings.length})
          </button>
          <button class="dash-tab-btn ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile">👤 Account Profile</button>
        </div>
      </div>

      <div class="dashboard-body mt-6">
        ${activeTab === 'discovery' ? renderDiscoveryTab(categories, verifiedPros) : ''}
        ${activeTab === 'bookings' ? renderBookingsTab(myBookings) : ''}
        ${activeTab === 'profile' ? renderProfileTab(currentUser) : ''}
      </div>
    </div>
  `;
}

function renderDiscoveryTab(categories, pros) {
  return `
    <div class="discovery-layout">
      <!-- SIDEBAR FILTERS -->
      <aside class="filter-sidebar glass-panel">
        <div class="filter-header">
          <h3>Filter Professionals</h3>
          <button id="reset-filters-btn" class="btn-text-sm">Reset All</button>
        </div>

        <div class="filter-group">
          <label for="filter-category">Service Category</label>
          <select id="filter-category" class="form-select">
            <option value="ALL">All Categories</option>
            ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-search">Keyword Search</label>
          <input type="text" id="filter-search" class="form-input" placeholder="e.g. Electrician, Plumbing, Tutor..." />
        </div>

        <div class="filter-group">
          <label for="filter-location">Location / Zip Code</label>
          <input type="text" id="filter-location" class="form-input" placeholder="e.g. Brooklyn or 11201" />
        </div>

        <div class="filter-group">
          <label for="filter-min-exp">Min. Experience (Years)</label>
          <select id="filter-min-exp" class="form-select">
            <option value="0">Any Experience</option>
            <option value="5">5+ Years</option>
            <option value="8">8+ Years</option>
            <option value="10">10+ Years</option>
          </select>
        </div>

        <div class="filter-group">
          <label for="filter-sort">Sort By</label>
          <select id="filter-sort" class="form-select">
            <option value="REPUTATION">Dwello Score (Highest First)</option>
            <option value="COMPLETED">Completed Jobs (Highest First)</option>
            <option value="RATING">Rating (Highest First)</option>
            <option value="PRICE_LOW">Price: Low to High</option>
          </select>
        </div>
      </aside>

      <!-- MAIN PRO LISTINGS -->
      <main class="pros-main-content">
        <div class="pros-header-bar">
          <h3>Available Verified Professionals (${pros.length})</h3>
          <span class="pro-guarantee-tag">🛡️ DwelloCrew Verified Guarantee</span>
        </div>

        <div class="pros-grid" id="pros-card-grid">
          ${pros.map(pro => renderProCard(pro)).join('')}
        </div>
      </main>
    </div>
  `;
}

function renderBookingsTab(bookings) {
  if (bookings.length === 0) {
    return `
      <div class="empty-state-box glass-panel text-center p-8">
        <div class="empty-icon">📅</div>
        <h3>No Bookings Yet</h3>
        <p>You haven't booked any home services yet. Explore verified professionals and book your first service!</p>
        <button id="empty-explore-btn" class="btn btn-primary mt-4">Explore Professionals</button>
      </div>
    `;
  }

  return `
    <div class="bookings-list-container">
      <h3>Your Active & Previous Service Appointments</h3>
      <div class="bookings-grid mt-4">
        ${bookings.map(b => {
          const isCompleted = b.status === 'COMPLETED';
          const isCancelled = b.status === 'CANCELLED' || b.status === 'REJECTED';

          // Status pipeline indicator
          const statusSteps = ['CONFIRMED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'];
          const currentStepIdx = statusSteps.indexOf(b.status);

          return `
            <div class="booking-card glass-panel" data-booking-id="${b.id}">
              <div class="booking-card-header">
                <div>
                  <span class="booking-id-badge">#${b.id.substr(0, 8)}</span>
                  <h4 class="booking-service-title">${b.serviceName}</h4>
                  <p class="booking-pro-name">Professional: <strong>${b.proName}</strong></p>
                </div>
                <div class="booking-status-pill status-${b.status.toLowerCase()}">
                  ${b.status.replace(/_/g, ' ')}
                </div>
              </div>

              <!-- Status Progress Tracker -->
              ${!isCancelled ? `
                <div class="status-tracker-bar">
                  ${statusSteps.map((step, idx) => `
                    <div class="tracker-step ${idx <= currentStepIdx ? 'active' : ''}">
                      <div class="step-dot"></div>
                      <span class="step-label">${step.replace(/_/g, ' ')}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <div class="booking-details-grid">
                <div>📅 <strong>Date & Time:</strong> ${b.date} at ${b.timeSlot}</div>
                <div>📍 <strong>Address:</strong> ${b.address}</div>
                <div>💳 <strong>Total Paid:</strong> $${b.totalPrice.toFixed(2)} (${b.paymentStatus})</div>
              </div>

              <div class="booking-card-actions">
                ${b.status === 'CONFIRMED' || b.status === 'ON_THE_WAY' ? `
                  <a href="${notificationService.getWhatsAppShareUrl('+18005550199', `Hi ${b.proName}, following up on my DwelloCrew booking #${b.id.substr(0, 8)}`)}" target="_blank" class="btn btn-outline btn-sm">
                    💬 WhatsApp Pro
                  </a>
                  <button class="btn btn-danger-outline btn-sm cancel-booking-btn" data-id="${b.id}">Cancel Booking</button>
                ` : ''}

                ${isCompleted ? `
                  <button class="btn btn-primary btn-sm leave-feedback-btn" data-id="${b.id}" data-pro="${b.proId}">
                    ⭐ Leave Review & Feedback
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderProfileTab(user) {
  return `
    <div class="profile-layout grid-2col">
      <!-- Edit Profile -->
      <div class="glass-panel p-6">
        <h3>Customer Account Details</h3>
        <form id="customer-profile-form" class="mt-4">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" id="cust-name" class="form-input" value="${user.name}" required />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-input" value="${user.email}" disabled />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" id="cust-phone" class="form-input" value="${user.phone || ''}" placeholder="+1 (555) 000-0000" />
          </div>
          <button type="submit" class="btn btn-primary mt-4">Save Changes</button>
        </form>
      </div>

      <!-- Saved Addresses & Payment Methods -->
      <div class="glass-panel p-6">
        <h3>Saved Service Addresses</h3>
        <div class="addresses-list mt-3">
          ${(user.addresses || []).map(a => `
            <div class="address-chip">
              <strong>📍 ${a.label} ${a.isDefault ? '(Default)' : ''}</strong>
              <p>${a.street}, ${a.city}, ${a.state} ${a.zip}</p>
            </div>
          `).join('')}
        </div>
        <button id="add-address-btn" class="btn btn-outline btn-sm mt-3">+ Add New Address</button>
      </div>
    </div>
  `;
}
