/**
 * DwelloCrew 2.0 — Single Page Application Entrypoint & Router
 */

import { CONFIG } from './config.js';
import { initializeSeedData } from './db/seedData.js';
import { dbStorage } from './db/storage.js';
import { authService } from './services/authService.js';
import { bookingService } from './services/bookingService.js';
import { notificationService } from './services/notificationService.js';
import { renderNavbar } from './components/navbar.js';
import { Modal } from './components/modal.js';
import { Toast } from './components/toast.js';
import { renderProCard } from './components/proCard.js';

import { renderLandingView } from './views/landingView.js';
import { renderCustomerView } from './views/customerView.js';
import { renderProView } from './views/proView.js';
import { renderAdminView } from './views/adminView.js';
import { openBookingModal } from './views/bookingModal.js';

class App {
  constructor() {
    this.currentTab = 'discovery';
    this.init();
  }

  init() {
    // Initialize seed data if missing
    initializeSeedData();

    // Bind Event Listeners
    this.bindEvents();

    // Render App
    this.render();
  }

  render() {
    const headerEl = document.getElementById('navbar-root');
    const mainEl = document.getElementById('app-root');

    // Render Navigation
    headerEl.innerHTML = renderNavbar();

    const currentUser = authService.getCurrentUser();
    const hash = window.location.hash.replace('#', '') || 'landing';

    // Role Enforcement & View Routing
    if (hash === 'customer' || (currentUser?.role === 'CUSTOMER' && hash !== 'landing')) {
      if (currentUser && currentUser.role !== 'CUSTOMER') {
        Toast.show('Access restricted to Customer accounts.', 'warning');
        window.location.hash = currentUser.role.toLowerCase();
        return;
      }
      mainEl.innerHTML = renderCustomerView(this.currentTab);
    } else if (hash === 'pro' || (currentUser?.role === 'PROFESSIONAL' && hash !== 'landing')) {
      if (currentUser && currentUser.role !== 'PROFESSIONAL') {
        Toast.show('Access restricted to Professional accounts.', 'warning');
        window.location.hash = currentUser.role.toLowerCase();
        return;
      }
      mainEl.innerHTML = renderProView(this.currentTab);
    } else if (hash === 'admin' || (currentUser?.role === 'ADMINISTRATOR' && hash !== 'landing')) {
      if (currentUser && currentUser.role !== 'ADMINISTRATOR') {
        Toast.show('Access restricted: Administrator authentication required.', 'error');
        this.openAuthModal('ADMINISTRATOR', 'login');
        window.location.hash = 'landing';
        return;
      }
      mainEl.innerHTML = renderAdminView(this.currentTab);
    } else {
      mainEl.innerHTML = renderLandingView();
    }

    this.bindViewHandlers();
  }

  bindEvents() {
    window.addEventListener('hashchange', () => this.render());

    window.addEventListener('dwellocrew_notification', (e) => {
      const notif = e.detail;
      Toast.show(`🔔 ${notif.title}: ${notif.message}`, 'info');
      const bell = document.getElementById('notif-bell-btn');
      if (bell) this.render();
    });

    window.addEventListener('dwellocrew_navigate', (e) => {
      const { view, tab } = e.detail;
      if (tab) this.currentTab = tab;
      window.location.hash = view.toLowerCase();
      this.render();
    });

    // Global Click Delegation
    document.addEventListener('click', (e) => {
      // Navbar buttons
      if (e.target.id === 'nav-login-cust-btn') this.openAuthModal('CUSTOMER', 'login');
      if (e.target.id === 'nav-login-pro-btn') this.openAuthModal('PROFESSIONAL', 'login');
      if (e.target.id === 'nav-login-admin-btn') this.openAuthModal('ADMINISTRATOR', 'login');

      if (e.target.id === 'nav-logout-btn') {
        authService.logout();
        Toast.show('Logged out successfully.', 'info');
        window.location.hash = 'landing';
        this.render();
      }

      if (e.target.id === 'cta-cust-signup') this.openAuthModal('CUSTOMER', 'register');
      if (e.target.id === 'cta-pro-signup') this.openAuthModal('PROFESSIONAL', 'register');
      if (e.target.id === 'ft-cust-login') this.openAuthModal('CUSTOMER', 'login');
      if (e.target.id === 'ft-pro-login') this.openAuthModal('PROFESSIONAL', 'login');
      if (e.target.id === 'ft-admin-login') this.openAuthModal('ADMINISTRATOR', 'login');

      // Book Pro button
      const bookBtn = e.target.closest('.book-pro-btn');
      if (bookBtn) {
        const proId = bookBtn.getAttribute('data-id');
        openBookingModal(proId);
      }

      // View Pro Detail button
      const viewProBtn = e.target.closest('.view-pro-btn');
      if (viewProBtn) {
        const proId = viewProBtn.getAttribute('data-id');
        this.openProDetailModal(proId);
      }

      // Dashboard tab switching
      const tabBtn = e.target.closest('.dash-tab-btn');
      if (tabBtn) {
        this.currentTab = tabBtn.getAttribute('data-tab');
        this.render();
      }

      // Category Click on Landing
      const catCard = e.target.closest('.category-card');
      if (catCard) {
        window.location.hash = 'customer';
        this.currentTab = 'discovery';
        this.render();
      }

      // Hero search
      if (e.target.id === 'hero-search-btn') {
        window.location.hash = 'customer';
        this.currentTab = 'discovery';
        this.render();
      }

      // Notification Dropdown Toggle
      if (e.target.closest('#notif-bell-btn')) {
        const drop = document.getElementById('notif-dropdown');
        if (drop) drop.classList.toggle('hidden');
      }

      if (e.target.id === 'mark-read-btn') {
        const curr = authService.getCurrentUser();
        if (curr) {
          notificationService.markAllAsRead(curr.id);
          this.render();
        }
      }
    });

    // Quick Role View Selector
    document.addEventListener('change', (e) => {
      if (e.target.id === 'quick-role-select') {
        const targetRole = e.target.value;
        const currentUser = authService.getCurrentUser();

        if (currentUser && currentUser.role === targetRole) {
          window.location.hash = targetRole.toLowerCase();
          this.render();
        } else {
          // Prompt user to log in or register under that role
          this.openAuthModal(targetRole, 'login');
        }
      }
    });
  }

  bindViewHandlers() {
    // Discovery Filters Handler
    const catSel = document.getElementById('filter-category');
    const searchInp = document.getElementById('filter-search');
    const locInp = document.getElementById('filter-location');
    const expSel = document.getElementById('filter-min-exp');
    const sortSel = document.getElementById('filter-sort');
    const resetBtn = document.getElementById('reset-filters-btn');

    const applyFilters = () => {
      const allUsers = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
      let pros = allUsers.filter(u => u.role === 'PROFESSIONAL' && u.verificationStatus === 'VERIFIED');

      if (catSel && catSel.value !== 'ALL') {
        pros = pros.filter(p => (p.categoryIds || []).includes(catSel.value));
      }

      if (searchInp && searchInp.value.trim()) {
        const q = searchInp.value.toLowerCase().trim();
        pros = pros.filter(p => p.name.toLowerCase().includes(q) || p.bio.toLowerCase().includes(q));
      }

      if (locInp && locInp.value.trim()) {
        const loc = locInp.value.toLowerCase().trim();
        pros = pros.filter(p => (p.serviceAreas || []).some(sa => sa.toLowerCase().includes(loc)));
      }

      if (expSel && Number(expSel.value) > 0) {
        pros = pros.filter(p => (p.experienceYears || 0) >= Number(expSel.value));
      }

      if (sortSel) {
        if (sortSel.value === 'COMPLETED') pros.sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0));
        else if (sortSel.value === 'RATING') pros.sort((a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0));
        else if (sortSel.value === 'PRICE_LOW') pros.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0));
      }

      const grid = document.getElementById('pros-card-grid');
      if (grid) {
        grid.innerHTML = pros.length === 0 ? '<p class="p-6 text-subtle">No matching verified professionals found.</p>' : pros.map(p => renderProCard(p)).join('');
      }
    };

    [catSel, searchInp, locInp, expSel, sortSel].forEach(el => {
      if (el) el.addEventListener('input', applyFilters);
    });

    if (resetBtn) {
      resetBtn.onclick = () => {
        if (catSel) catSel.value = 'ALL';
        if (searchInp) searchInp.value = '';
        if (locInp) locInp.value = '';
        if (expSel) expSel.value = '0';
        if (sortSel) sortSel.value = 'REPUTATION';
        applyFilters();
      };
    }

    // Pro Actions in Pro View
    document.querySelectorAll('.pro-accept-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        bookingService.updateBookingStatus(id, 'CONFIRMED');
        Toast.show('Booking request accepted.', 'success');
        this.render();
      };
    });

    document.querySelectorAll('.pro-status-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        const next = btn.getAttribute('data-next');
        bookingService.updateBookingStatus(id, next);
        Toast.show(`Updated status to ${next.replace(/_/g, ' ')}.`, 'success');
        this.render();
      };
    });

    // Admin Verification Actions
    document.querySelectorAll('.admin-verify-pro-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        authService.updateProfile(id, { verificationStatus: 'VERIFIED' });
        Toast.show('Professional account verified!', 'success');
        this.render();
      };
    });

    document.querySelectorAll('.admin-suspend-pro-btn').forEach(btn => {
      btn.onclick = () => {
        const id = btn.getAttribute('data-id');
        authService.updateProfile(id, { verificationStatus: 'SUSPENDED' });
        Toast.show('Professional account suspended.', 'warning');
        this.render();
      };
    });
  }

  /**
   * Unified Authentication Modal (Customer, Professional, Administrator)
   * Supports: Login, Register, Forgot Password
   */
  openAuthModal(role, type = 'login') {
    const isLogin = type === 'login';
    const isRegister = type === 'register';

    let title = `${isLogin ? 'Sign In' : 'Create Account'} (${role.charAt(0) + role.slice(1).toLowerCase()})`;
    if (type === 'forgot') title = `Reset Password (${role.charAt(0) + role.slice(1).toLowerCase()})`;

    let formContent = '';

    if (type === 'forgot') {
      formContent = `
        <form id="auth-modal-form">
          <p class="text-subtle-sm mb-3">Enter your registered email address to receive a secure password reset token.</p>
          <div class="form-group mb-3">
            <label>Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="you@example.com" required />
          </div>

          <div id="reset-token-step" class="hidden">
            <div class="form-group mb-3">
              <label>Reset Code / Token</label>
              <input type="text" id="auth-reset-token" class="form-input" placeholder="Enter 6-digit code" />
            </div>
            <div class="form-group mb-3">
              <label>New Password</label>
              <input type="password" id="auth-new-password" class="form-input" placeholder="Min 6 characters" />
            </div>
          </div>

          <button type="submit" id="auth-submit-btn" class="btn btn-primary w-full py-3 mt-2 font-bold">
            Send Reset Code
          </button>

          <p class="text-center text-subtle-sm mt-3">
            Remembered your password? <a href="#" id="switch-to-login">Back to Sign In</a>
          </p>
        </form>
      `;
    } else {
      formContent = `
        <form id="auth-modal-form">
          ${isRegister ? `
            <div class="form-group mb-3">
              <label>Full Name</label>
              <input type="text" id="auth-name" class="form-input" placeholder="e.g. Alex Morgan" required />
            </div>
          ` : ''}

          <div class="form-group mb-3">
            <label>Email Address</label>
            <input type="email" id="auth-email" class="form-input" placeholder="you@example.com" required />
          </div>

          <div class="form-group mb-3">
            <div class="flex justify-between items-center">
              <label>Password</label>
              ${isLogin ? `<a href="#" id="auth-forgot-link" class="text-xs text-cyan">Forgot Password?</a>` : ''}
            </div>
            <input type="password" id="auth-password" class="form-input" placeholder="${isRegister ? 'Min 6 characters' : 'Enter password'}" required />
          </div>

          ${isRegister && role === 'PROFESSIONAL' ? `
            <div class="form-group mb-3">
              <label>Years of Experience</label>
              <input type="number" id="auth-exp" class="form-input" value="3" min="1" required />
            </div>
            <div class="form-group mb-3">
              <label>Service Hourly Base Rate ($)</label>
              <input type="number" id="auth-rate" class="form-input" value="65" min="20" required />
            </div>
            <div class="form-group mb-3">
              <label>Short Professional Bio</label>
              <textarea id="auth-bio" class="form-input" rows="2" placeholder="Describe your background and expertise..."></textarea>
            </div>
          ` : ''}

          <button type="submit" id="auth-submit-btn" class="btn btn-primary w-full py-3 mt-2 font-bold">
            ${isLogin ? `Log In as ${role}` : `Create ${role} Account`}
          </button>

          ${isLogin ? `
            <div class="mt-4 p-3 glass-panel text-xs text-subtle flex justify-between items-center rounded border border-glass">
              <div>
                <strong class="text-white">Demo Credentials:</strong><br/>
                Email: <code class="text-cyan">${role === 'ADMINISTRATOR' ? 'admin@dwellocrew.com' : (role === 'PROFESSIONAL' ? 'marcus.vance@dwellopro.com' : 'sarah.jenkins@example.com')}</code><br/>
                Password: <code class="text-cyan">${role === 'ADMINISTRATOR' ? 'Admin@Dwello2026' : (role === 'PROFESSIONAL' ? 'ProPass123!' : 'Customer123!')}</code>
              </div>
              <button type="button" id="fill-demo-credentials-btn" class="btn btn-secondary btn-sm text-xs py-1.5 px-3">
                Auto-fill
              </button>
            </div>
          ` : ''}

          ${role !== 'ADMINISTRATOR' ? `
            <p class="text-center text-subtle-sm mt-3">
              ${isLogin ? `Don't have an account? <a href="#" id="switch-auth-type">Sign Up</a>` : `Already registered? <a href="#" id="switch-auth-type">Log In</a>`}
            </p>
          ` : ''}
        </form>
      `;
    }

    Modal.open({
      title,
      content: formContent,
      size: 'medium'
    });

    // Attach Switcher & Helper Event Listeners
    document.getElementById('fill-demo-credentials-btn')?.addEventListener('click', () => {
      const emailInput = document.getElementById('auth-email');
      const passInput = document.getElementById('auth-password');
      if (emailInput && passInput) {
        if (role === 'ADMINISTRATOR') {
          emailInput.value = 'admin@dwellocrew.com';
          passInput.value = 'Admin@Dwello2026';
        } else if (role === 'PROFESSIONAL') {
          emailInput.value = 'marcus.vance@dwellopro.com';
          passInput.value = 'ProPass123!';
        } else {
          emailInput.value = 'sarah.jenkins@example.com';
          passInput.value = 'Customer123!';
        }
      }
    });

    document.getElementById('switch-auth-type')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAuthModal(role, isLogin ? 'register' : 'login');
    });

    document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAuthModal(role, 'login');
    });

    document.getElementById('auth-forgot-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.openAuthModal(role, 'forgot');
    });

    // Form Submission Handling
    let resetStage = 1;

    document.getElementById('auth-modal-form').onsubmit = async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('auth-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Processing...';

      const email = document.getElementById('auth-email').value;

      if (type === 'forgot') {
        if (resetStage === 1) {
          const res = await authService.requestPasswordReset(email);
          Toast.show(res.message, res.success ? 'info' : 'error');
          if (res.success) {
            resetStage = 2;
            document.getElementById('reset-token-step').classList.remove('hidden');
            submitBtn.innerText = 'Confirm New Password';
            submitBtn.disabled = false;

            if (res.resetToken) {
              const tokenInput = document.getElementById('auth-reset-token');
              if (tokenInput) tokenInput.value = res.resetToken;
            }
          } else {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Reset Code';
          }
        } else {
          const token = document.getElementById('auth-reset-token').value;
          const newPass = document.getElementById('auth-new-password').value;

          const res = await authService.resetPassword(email, token, newPass);
          if (res.success) {
            Modal.close();
            Toast.show(res.message, 'success');
            this.openAuthModal(role, 'login');
          } else {
            Toast.show(res.error, 'error');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Confirm New Password';
          }
        }
        return;
      }

      const password = document.getElementById('auth-password').value;

      if (isLogin) {
        const res = await authService.login(email, password, role);
        if (res.success) {
          Modal.close();
          Toast.show(`Welcome back, ${res.user.name}!`, 'success');
          window.location.hash = role.toLowerCase();
          this.currentTab = role === 'CUSTOMER' ? 'discovery' : (role === 'PROFESSIONAL' ? 'dashboard' : 'analytics');
          this.render();
        } else {
          Toast.show(res.error, 'error');
          submitBtn.disabled = false;
          submitBtn.innerText = `Log In as ${role}`;
        }
      } else {
        const name = document.getElementById('auth-name').value;
        const exp = document.getElementById('auth-exp')?.value;
        const rate = document.getElementById('auth-rate')?.value;
        const bio = document.getElementById('auth-bio')?.value;

        const res = await authService.register({
          role,
          name,
          email,
          password,
          experienceYears: exp,
          hourlyRate: rate,
          bio
        });

        if (res.success) {
          Modal.close();
          Toast.show(`Account registered successfully! Welcome to DwelloCrew, ${name}.`, 'success');
          window.location.hash = role.toLowerCase();
          this.currentTab = role === 'CUSTOMER' ? 'discovery' : 'dashboard';
          this.render();
        } else {
          Toast.show(res.error, 'error');
          submitBtn.disabled = false;
          submitBtn.innerText = `Create ${role} Account`;
        }
      }
    };
  }

  openProDetailModal(proId) {
    const users = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
    const pro = users.find(u => u.id === proId);
    if (!pro) return;

    const reviews = dbStorage.getItem(CONFIG.STORAGE_KEYS.REVIEWS, []).filter(r => r.proId === pro.id);

    const content = `
      <div class="pro-detail-modal">
        <div class="pro-detail-header glass-panel p-4 mb-4">
          <div class="flex gap-4">
            <img src="${pro.avatar}" class="pro-avatar" style="width:80px;height:80px;" />
            <div>
              <h3>${pro.name} ${pro.verificationStatus === 'VERIFIED' ? '✅' : ''}</h3>
              <p class="text-subtle-sm">${pro.bio}</p>
              <div class="flex gap-2 mt-2">
                <span class="verified-pill">${pro.experienceYears || 1} Yrs Exp</span>
                <span class="reputation-badge-chip">${pro.completedJobs || 0} Jobs Completed</span>
              </div>
            </div>
          </div>
        </div>

        <h4>Work Portfolio</h4>
        <div class="portfolio-grid grid-3col my-3">
          ${(pro.portfolio || []).length === 0 ? '<p class="text-subtle-sm">No portfolio items uploaded yet.</p>' : ''}
          ${(pro.portfolio || []).map(p => `
            <div class="portfolio-item glass-panel">
              <img src="${p.image}" alt="${p.title}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;" />
              <small class="p-2 block">${p.title}</small>
            </div>
          `).join('')}
        </div>

        <h4 class="mt-4">Customer Reviews (${reviews.length})</h4>
        <div class="reviews-list my-2">
          ${reviews.length === 0 ? '<p class="text-subtle-sm">No reviews yet for this professional.</p>' : ''}
          ${reviews.map(r => `
            <div class="review-item glass-panel p-3 mb-2">
              <strong>${r.customerName}</strong> • ${r.rating}★
              <p class="text-subtle-sm">"${r.comment}"</p>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-primary w-full mt-4 book-pro-btn" data-id="${pro.id}">Book Service Now</button>
      </div>
    `;

    Modal.open({
      title: `${pro.name} — Professional Profile`,
      content,
      size: 'large'
    });
  }
}

// Instantiate App on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.dwellocrewApp = new App();
});
