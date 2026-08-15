/**
 * DwelloCrew 2.0 — Responsive Top Navigation & Role Bar
 */

import { authService } from '../services/authService.js';
import { notificationService } from '../services/notificationService.js';

export function renderNavbar() {
  const currentUser = authService.getCurrentUser();
  const unreadNotifs = currentUser ? notificationService.getUserNotifications(currentUser.id).filter(n => !n.read) : [];

  let userSectionHtml = '';
  if (currentUser) {
    userSectionHtml = `
      <div class="nav-user-menu">
        <!-- Notification Bell -->
        <div class="notification-wrapper" id="notif-bell-btn">
          <button class="icon-btn" aria-label="Notifications">
            🔔
            ${unreadNotifs.length > 0 ? `<span class="notif-badge">${unreadNotifs.length}</span>` : ''}
          </button>
          <div class="notif-dropdown hidden" id="notif-dropdown">
            <div class="notif-header">
              <span>Notifications</span>
              <button id="mark-read-btn" class="btn-text-sm">Mark read</button>
            </div>
            <div class="notif-list">
              ${unreadNotifs.length === 0 ? '<p class="empty-notif p-3 text-subtle">No new notifications</p>' : ''}
              ${unreadNotifs.map(n => `
                <div class="notif-item">
                  <strong>${n.title}</strong>
                  <p>${n.message}</p>
                  <small>${new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- User Profile Pill -->
        <div class="user-pill-dropdown" id="user-pill-btn">
          <img src="${currentUser.avatar}" alt="${currentUser.name}" class="nav-user-avatar" />
          <span class="nav-user-name">${currentUser.name}</span>
          <span class="role-badge role-${currentUser.role.toLowerCase()}">${currentUser.role}</span>
        </div>
        <button id="nav-logout-btn" class="btn btn-outline btn-sm">Logout</button>
      </div>
    `;
  } else {
    userSectionHtml = `
      <div class="nav-auth-buttons">
        <button id="nav-login-cust-btn" class="btn btn-ghost btn-sm">Customer Portal</button>
        <button id="nav-login-pro-btn" class="btn btn-outline btn-sm">Pro Portal</button>
        <button id="nav-login-admin-btn" class="btn btn-primary btn-sm">Admin Console</button>
      </div>
    `;
  }

  return `
    <header class="main-header glass-panel sticky-header">
      <div class="nav-container">
        <!-- Brand Logo -->
        <a href="#landing" class="brand-logo" id="nav-brand-logo">
          <div class="logo-icon-box">D</div>
          <div class="brand-text">
            <span class="brand-name">Dwello<span class="brand-accent">Crew</span></span>
            <span class="brand-tagline">Find. Book. Relax.</span>
          </div>
        </a>

        <!-- Middle Quick Navigation -->
        <nav class="nav-links">
          <a href="#services" class="nav-link" id="link-explore">Services</a>
          <a href="#how-it-works" class="nav-link">How It Works</a>
          <a href="#trust" class="nav-link">Trust & Safety</a>
          <a href="#dashboard" class="nav-link highlight-link" id="link-my-dashboard">Dashboard</a>
        </nav>

        <!-- Right User & Role Controls -->
        <div class="nav-controls">
          <!-- Role View Selector -->
          <div class="quick-role-switcher" title="Role View Switcher">
            <select id="quick-role-select" class="form-select-sm">
              <option value="" disabled ${!currentUser ? 'selected' : ''}>Switch Role View...</option>
              <option value="CUSTOMER" ${currentUser?.role === 'CUSTOMER' ? 'selected' : ''}>👤 Customer Dashboard</option>
              <option value="PROFESSIONAL" ${currentUser?.role === 'PROFESSIONAL' ? 'selected' : ''}>🛠️ Professional Dashboard</option>
              <option value="ADMINISTRATOR" ${currentUser?.role === 'ADMINISTRATOR' ? 'selected' : ''}>🛡️ Administrator Console</option>
            </select>
          </div>

          ${userSectionHtml}
        </div>
      </div>
    </header>
  `;
}
