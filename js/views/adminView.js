/**
 * DwelloCrew 2.0 — Administrator Console & Control View
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { authService } from '../services/authService.js';
import { bookingService } from '../services/bookingService.js';
import { ChartWidget } from '../components/chartWidget.js';
import { Modal } from '../components/modal.js';
import { Toast } from '../components/toast.js';

export function renderAdminView(activeTab = 'analytics') {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'ADMINISTRATOR') {
    return `<div class="p-8 text-center"><h2 class="text-xl text-rose">Access Denied</h2><p>Administrator privileges required.</p></div>`;
  }

  const allUsers = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
  const categories = dbStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES, []);
  const bookings = bookingService.getAllBookings();
  const reviews = dbStorage.getItem(CONFIG.STORAGE_KEYS.REVIEWS, []);
  const settings = dbStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS, { commissionPercent: CONFIG.COMMISSION_PERCENT });

  const customers = allUsers.filter(u => u.role === 'CUSTOMER');
  const pros = allUsers.filter(u => u.role === 'PROFESSIONAL');
  const pendingPros = pros.filter(p => p.verificationStatus === 'PENDING');

  // Revenue calculation
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');
  const totalGross = completedBookings.reduce((sum, b) => sum + (b.subtotal || 0), 0);
  const platformRevenue = completedBookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

  return `
    <div class="dashboard-wrapper animate-fade-in">
      <!-- ADMIN HEADER -->
      <div class="dashboard-header glass-panel border-accent">
        <div class="admin-header-flex">
          <div>
            <h2>🛡️ Platform Administrator Console</h2>
            <p>Full platform oversight, pro verification, dynamic service configuration & financial analytics.</p>
          </div>
          <div class="admin-chip">
            <span>Commission Rate: <strong>${settings.commissionPercent}%</strong></span>
          </div>
        </div>

        <div class="dashboard-tabs mt-4">
          <button class="dash-tab-btn ${activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">📈 Analytics & Overview</button>
          <button class="dash-tab-btn ${activeTab === 'pros' ? 'active' : ''}" data-tab="pros">
            🛠️ Pros & Verification ${pendingPros.length > 0 ? `<span class="badge-count">${pendingPros.length}</span>` : ''}
          </button>
          <button class="dash-tab-btn ${activeTab === 'services' ? 'active' : ''}" data-tab="services">🏷️ Categories & Services</button>
          <button class="dash-tab-btn ${activeTab === 'bookings' ? 'active' : ''}" data-tab="bookings">📋 Bookings Oversight (${bookings.length})</button>
          <button class="dash-tab-btn ${activeTab === 'settings' ? 'active' : ''}" data-tab="settings">⚙️ Platform Settings</button>
        </div>
      </div>

      <div class="dashboard-body mt-6">
        ${activeTab === 'analytics' ? renderAdminAnalyticsTab(customers, pros, bookings, totalGross, platformRevenue) : ''}
        ${activeTab === 'pros' ? renderAdminProsTab(pros) : ''}
        ${activeTab === 'services' ? renderAdminServicesTab(categories) : ''}
        ${activeTab === 'bookings' ? renderAdminBookingsTab(bookings) : ''}
        ${activeTab === 'settings' ? renderAdminSettingsTab(settings) : ''}
      </div>
    </div>
  `;
}

function renderAdminAnalyticsTab(customers, pros, bookings, gross, revenue) {
  return `
    <div class="admin-analytics-grid">
      <div class="metrics-row grid-4col">
        <div class="stat-card glass-panel">
          <span class="stat-title">Total Customers</span>
          <span class="stat-value text-sky">${customers.length}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-title">Active Pros</span>
          <span class="stat-value text-emerald">${pros.filter(p => p.verificationStatus === 'VERIFIED').length} / ${pros.length}</span>
        </div>
        <div class="stat-card glass-panel">
          <span class="stat-title">Gross Booking Volume</span>
          <span class="stat-value text-amber">$${gross.toFixed(2)}</span>
        </div>
        <div class="stat-card glass-panel highlight">
          <span class="stat-title">Platform Revenue Net</span>
          <span class="stat-value text-emerald">$${revenue.toFixed(2)}</span>
        </div>
      </div>

      <!-- ANALYTICAL CHARTS -->
      <div class="charts-grid grid-2col mt-6">
        ${ChartWidget.renderRevenueLineChart([1200, 2800, 4100, 6500, 8900, 11400])}
        ${ChartWidget.renderCategoryBarChart()}
      </div>
    </div>
  `;
}

function renderAdminProsTab(pros) {
  return `
    <div class="glass-panel p-6">
      <div class="section-header-flex">
        <h3>Professional Verification & Moderation Directory</h3>
        <span class="text-subtle-sm">Verify license, adjust status, or suspend accounts</span>
      </div>

      <div class="table-responsive mt-4">
        <table class="data-table">
          <thead>
            <tr>
              <th>Professional</th>
              <th>Category / Services</th>
              <th>Experience</th>
              <th>Jobs & Success</th>
              <th>Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${pros.map(p => `
              <tr>
                <td>
                  <div class="user-table-cell">
                    <img src="${p.avatar}" alt="${p.name}" class="avatar-sm" />
                    <div>
                      <strong>${p.name}</strong><br/>
                      <small>${p.email}</small>
                    </div>
                  </div>
                </td>
                <td><span class="tag-chip">${(p.categoryIds || []).join(', ')}</span></td>
                <td>${p.experienceYears || 1} Yrs</td>
                <td>${p.completedJobs || 0} jobs (${p.ratingAverage || 5.0}★)</td>
                <td>
                  <span class="status-pill status-${p.verificationStatus.toLowerCase()}">${p.verificationStatus}</span>
                </td>
                <td>
                  <div class="btn-group-sm">
                    ${p.verificationStatus !== 'VERIFIED' ? `
                      <button class="btn btn-emerald btn-sm admin-verify-pro-btn" data-id="${p.id}">Approve / Verify</button>
                    ` : ''}
                    ${p.verificationStatus !== 'SUSPENDED' ? `
                      <button class="btn btn-danger-outline btn-sm admin-suspend-pro-btn" data-id="${p.id}">Suspend</button>
                    ` : `
                      <button class="btn btn-outline btn-sm admin-verify-pro-btn" data-id="${p.id}">Reactivate</button>
                    `}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminServicesTab(categories) {
  return `
    <div class="glass-panel p-6">
      <div class="section-header-flex">
        <h3>Dynamic Service Categories Manager</h3>
        <button id="admin-add-category-btn" class="btn btn-primary btn-sm">+ Add New Category</button>
      </div>

      <div class="categories-list-grid mt-4">
        ${categories.map(c => `
          <div class="category-admin-card glass-panel p-4">
            <div class="cat-admin-header">
              <h4>${c.name}</h4>
              <span class="category-badge">${c.badge || 'Active'}</span>
            </div>
            <p class="text-subtle-sm mt-1">${c.description}</p>

            <h5 class="mt-3 text-xs uppercase text-subtle">Sub-services (${c.services?.length || 0})</h5>
            <ul class="subservices-list mt-1">
              ${(c.services || []).map(s => `
                <li><span>${s.name}</span> <strong>$${s.basePrice}</strong></li>
              `).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAdminBookingsTab(bookings) {
  return `
    <div class="glass-panel p-6">
      <h3>Global Platform Bookings Log</h3>

      <div class="table-responsive mt-4">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID & Service</th>
              <th>Customer</th>
              <th>Professional</th>
              <th>Date / Time</th>
              <th>Total ($)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${bookings.map(b => `
              <tr>
                <td><strong>#${b.id.substr(0, 8)}</strong><br/><small>${b.serviceName}</small></td>
                <td>${b.customerName}</td>
                <td>${b.proName}</td>
                <td>${b.date}<br/><small>${b.timeSlot}</small></td>
                <td>$${b.totalPrice.toFixed(2)}</td>
                <td><span class="status-pill status-${b.status.toLowerCase()}">${b.status.replace(/_/g, ' ')}</span></td>
                <td>
                  ${b.status !== 'COMPLETED' && b.status !== 'CANCELLED' ? `
                    <button class="btn btn-danger-outline btn-sm admin-force-cancel-btn" data-id="${b.id}">Force Cancel</button>
                  ` : '—'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderAdminSettingsTab(settings) {
  return `
    <div class="glass-panel p-6">
      <h3>Platform Financial & System Settings</h3>

      <form id="admin-settings-form" class="mt-4 max-w-md">
        <div class="form-group">
          <label>Platform Commission Percentage (%)</label>
          <input type="number" step="0.1" id="commission-input" class="form-input" value="${settings.commissionPercent || 12.5}" required />
          <small class="text-subtle-sm">Calculates platform cut from total booking subtotal.</small>
        </div>

        <div class="form-group mt-3">
          <label>Service Tax Percentage (%)</label>
          <input type="number" step="0.1" id="tax-input" class="form-input" value="${settings.taxPercent || 5.0}" required />
        </div>

        <button type="submit" class="btn btn-primary mt-4">Save Platform Settings</button>
      </form>
    </div>
  `;
}
