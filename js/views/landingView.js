/**
 * DwelloCrew 2.0 — Public Landing Page View
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { renderRatingStars } from '../components/ratingStars.js';

export function renderLandingView() {
  const categories = dbStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES, []);
  const users = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
  const pros = users.filter(u => u.role === 'PROFESSIONAL' && u.verificationStatus === 'VERIFIED');

  return `
    <div class="landing-page-wrapper animate-fade-in">
      <!-- HERO SECTION -->
      <section class="hero-section">
        <div class="hero-backdrop-glow"></div>
        <div class="hero-container">
          <div class="hero-content">
            <span class="hero-tagline-chip">✨ The Trusted Home Services Ecosystem</span>
            <h1 class="hero-headline">Find verified home pros.<br/><span class="text-gradient">Book instantly. Relax.</span></h1>
            <p class="hero-subhead">
              DwelloCrew connects homeowners and tenants with top-tier, background-verified specialists. From master plumbers to STEM tutors — experience total peace of mind.
            </p>

            <!-- HERO SEARCH BAR -->
            <div class="hero-search-box glass-panel">
              <div class="search-field">
                <span class="field-icon">🔍</span>
                <input type="text" id="hero-keyword-input" placeholder="What service do you need? (e.g. Electrician, Plumbing)" />
              </div>
              <div class="search-divider"></div>
              <div class="search-field">
                <span class="field-icon">📍</span>
                <input type="text" id="hero-location-input" placeholder="Zip code or City (e.g. 11201)" />
              </div>
              <button id="hero-search-btn" class="btn btn-primary btn-lg">Search Pros</button>
            </div>

            <!-- TRUST STATS COUNTER -->
            <div class="hero-stats-row">
              <div class="stat-pill">
                <span class="stat-num">500+</span>
                <span class="stat-txt">Verified Services Completed</span>
              </div>
              <div class="stat-pill">
                <span class="stat-num">99.4%</span>
                <span class="stat-txt">Success Record</span>
              </div>
              <div class="stat-pill">
                <span class="stat-num">4.9 ★</span>
                <span class="stat-txt">Avg Customer Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SERVICE CATEGORIES SECTION -->
      <section class="section-container" id="services">
        <div class="section-header center-align">
          <span class="section-eyebrow">EXPLORE SERVICES</span>
          <h2 class="section-title">Everything your home needs</h2>
          <p class="section-subtitle">Browse curated categories staffed by background-checked, licensed professionals.</p>
        </div>

        <div class="categories-grid">
          ${categories.map(cat => `
            <div class="category-card glass-panel hover-lift" data-category-slug="${cat.slug}">
              <div class="category-img-wrapper">
                <img src="${cat.image}" alt="${cat.name}" class="category-img" />
                <span class="category-badge">${cat.badge || 'Popular'}</span>
              </div>
              <div class="category-content">
                <h3 class="category-name">${cat.name}</h3>
                <p class="category-desc">${cat.description}</p>
                <div class="category-footer">
                  <span class="service-count">${cat.services?.length || 4} Specialized Services</span>
                  <span class="explore-arrow">→</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- HOW DWELLOCREW WORKS -->
      <section class="section-container bg-subtle" id="how-it-works">
        <div class="section-header center-align">
          <span class="section-eyebrow">3 EASY STEPS</span>
          <h2 class="section-title">How DwelloCrew Works</h2>
          <p class="section-subtitle">Designed for simplicity, speed, and absolute transparency.</p>
        </div>

        <div class="steps-timeline">
          <div class="step-card glass-panel">
            <div class="step-num">01</div>
            <h3>Find & Evaluate</h3>
            <p>Browse detailed experience profiles. Check verified credentials, portfolio photos, completed job counts, and genuine reviews.</p>
          </div>
          <div class="step-card glass-panel">
            <div class="step-num">02</div>
            <h3>Book & Pay Securely</h3>
            <p>Select your exact preferred date and time slot. Enjoy transparent pricing with guaranteed escrow payment protection.</p>
          </div>
          <div class="step-card glass-panel">
            <div class="step-num">03</div>
            <h3>Relax & Track</h3>
            <p>Receive real-time progress updates ("Pro on the way", "Service in progress"). Relax knowing your home is in expert hands.</p>
          </div>
        </div>
      </section>

      <!-- TRUST & SAFETY DIFFERENTIATOR -->
      <section class="section-container" id="trust">
        <div class="grid-2col align-center">
          <div class="trust-text-block">
            <span class="section-eyebrow">OUR COMMITMENT</span>
            <h2 class="section-title">Trust isn't just a star rating. It's proven history.</h2>
            <p>Unlike basic directory clones, DwelloCrew rates professionals using a composite reputation engine balancing verified license checks, total completed jobs, success ratios, and qualitative customer stories.</p>
            <ul class="trust-checklist">
              <li>✓ <strong>Multi-Tier Licensing Check:</strong> Identity, insurance & certifications verified.</li>
              <li>✓ <strong>Experience Metrics:</strong> Real history showing completed volume & success rate.</li>
              <li>✓ <strong>Escrow Payment Protection:</strong> Funds held safely until service is completed to your satisfaction.</li>
              <li>✓ <strong>Double-Booking Shield:</strong> Real-time slot locking guarantees your pro arrives on time.</li>
            </ul>
          </div>
          <div class="trust-graphic-box glass-panel glowing-border">
            <div class="reputation-demo-card">
              <div class="demo-badge">👑 Dwello Platinum Pro</div>
              <h3>Marcus Vance</h3>
              <div class="demo-stats">
                <div><strong>11 Yrs</strong> Exp</div>
                <div><strong>342</strong> Jobs</div>
                <div><strong>99.4%</strong> Success</div>
              </div>
              <p class="demo-quote">"Completed 342 verified services with zero open disputes."</p>
            </div>
          </div>
        </div>
      </section>

      <!-- BENEFITS CARDS (FOR CUSTOMERS & PROS) -->
      <section class="section-container bg-subtle">
        <div class="grid-2col">
          <div class="benefit-card glass-panel">
            <h3>For Homeowners & Tenants</h3>
            <ul class="benefit-list">
              <li>Instant booking with guaranteed pro availability</li>
              <li>Upfront pricing with zero hidden surprise fees</li>
              <li>Track pro live status from acceptance to completion</li>
              <li>Direct WhatsApp & in-app communication</li>
            </ul>
            <button id="cta-cust-signup" class="btn btn-primary mt-4">Join as a Customer</button>
          </div>
          <div class="benefit-card glass-panel border-accent">
            <h3>For Skilled Professionals</h3>
            <ul class="benefit-list">
              <li>Build your permanent reputation based on job craftsmanship</li>
              <li>Set your own custom rates, working hours & vacation mode</li>
              <li>Direct payout receipts with low platform commission</li>
              <li>Access high-quality local homeowners ready to book</li>
            </ul>
            <button id="cta-pro-signup" class="btn btn-outline mt-4">Apply as a Professional</button>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer class="main-footer">
        <div class="footer-container">
          <div class="footer-col brand-col">
            <div class="brand-logo">
              <div class="logo-icon-box">D</div>
              <span class="brand-name">Dwello<span class="brand-accent">Crew</span></span>
            </div>
            <p>Find. Book. Relax. The trustworthy home services platform built for modern living.</p>
            <p class="copyright">&copy; 2026 DwelloCrew Inc. All rights reserved.</p>
          </div>
          <div class="footer-col">
            <h4>Platform Roles</h4>
            <ul>
              <li><a href="#customer-login" id="ft-cust-login">Customer Portal</a></li>
              <li><a href="#pro-login" id="ft-pro-login">Professional Portal</a></li>
              <li><a href="#admin-login" id="ft-admin-login">Administrator Console</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Categories</h4>
            <ul>
              <li><a href="#services">Home Repairs</a></li>
              <li><a href="#services">Salon & Spa at Home</a></li>
              <li><a href="#services">Pet Care & Training</a></li>
              <li><a href="#services">Home Tutoring</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  `;
}
