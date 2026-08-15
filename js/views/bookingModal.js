/**
 * DwelloCrew 2.0 — Multi-Step Booking & Payment Modal Workflow
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { authService } from '../services/authService.js';
import { bookingService } from '../services/bookingService.js';
import { PaymentService } from '../services/paymentService.js';
import { Modal } from '../components/modal.js';
import { Toast } from '../components/toast.js';

export function openBookingModal(proId, preselectedServiceId = null) {
  const currentUser = authService.getCurrentUser();
  if (!currentUser || currentUser.role !== 'CUSTOMER') {
    Toast.show('Please log in as a Customer to book services.', 'warning');
    return;
  }

  const allUsers = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
  const pro = allUsers.find(u => u.id === proId);
  if (!pro) return;

  const categories = dbStorage.getItem(CONFIG.STORAGE_KEYS.CATEGORIES, []);
  const proServices = categories
    .flatMap(c => c.services.map(s => ({ ...s, categoryName: c.name })))
    .filter(s => (pro.serviceIds || []).includes(s.id));

  const activeService = proServices.find(s => s.id === preselectedServiceId) || proServices[0] || {
    id: 'srv_default',
    name: 'General Consultation',
    basePrice: pro.hourlyRate || 60,
    categoryName: 'Home Services'
  };

  const defaultDate = new Date(Date.now() + 86400000).toISOString().split('T')[0]; // Tomorrow
  const availableSlots = bookingService.getAvailableSlots(pro.id, defaultDate, pro.timeSlots || ['09:00 AM', '11:00 AM', '02:00 PM']);

  const addresses = currentUser.addresses || [{ street: '123 Main St', city: 'Brooklyn', state: 'NY', zip: '11201' }];

  const content = `
    <div class="booking-workflow-box" id="booking-workflow-form">
      <div class="pro-summary-strip glass-panel p-3 mb-4">
        <img src="${pro.avatar}" class="avatar-sm" />
        <div>
          <strong>${pro.name}</strong> • <span class="text-subtle-sm">${activeService.categoryName}</span>
        </div>
      </div>

      <!-- STEP 1: SERVICE & DATE -->
      <div class="form-group mb-3">
        <label>Select Service</label>
        <select id="book-service-select" class="form-select">
          ${proServices.map(s => `
            <option value="${s.id}" data-price="${s.basePrice}" ${s.id === activeService.id ? 'selected' : ''}>
              ${s.name} — $${s.basePrice}
            </option>
          `).join('')}
        </select>
      </div>

      <div class="form-group mb-3">
        <label>Service Date</label>
        <input type="date" id="book-date-input" class="form-input" value="${defaultDate}" min="${new Date().toISOString().split('T')[0]}" />
      </div>

      <div class="form-group mb-3">
        <label>Available Time Slot (Double-Booking Protected)</label>
        <select id="book-slot-select" class="form-select">
          ${availableSlots.length === 0 ? '<option value="" disabled>No slots available for this date</option>' : ''}
          ${availableSlots.map(slot => `<option value="${slot}">${slot}</option>`).join('')}
        </select>
      </div>

      <div class="form-group mb-3">
        <label>Service Address</label>
        <select id="book-address-select" class="form-select">
          ${addresses.map(a => `
            <option value="${a.street}, ${a.city}, ${a.state} ${a.zip}">${a.label ? a.label + ': ' : ''}${a.street}, ${a.city}</option>
          `).join('')}
        </select>
      </div>

      <div class="form-group mb-3">
        <label>Special Instructions / Notes for Pro</label>
        <textarea id="book-notes-input" class="form-input" rows="2" placeholder="e.g. Ring side doorbell, parking instructions..."></textarea>
      </div>

      <!-- PRICE BREAKDOWN RECEIPT -->
      <div class="price-breakdown-box glass-panel p-3 mb-4" id="price-breakdown-box">
        <!-- Dynamic price breakdown inserted via updatePriceBreakdown() -->
      </div>

      <div class="modal-actions">
        <button type="button" id="confirm-booking-btn" class="btn btn-emerald w-full py-3 text-lg font-bold">
          🔒 Pay & Confirm Booking
        </button>
      </div>
    </div>
  `;

  Modal.open({
    title: `Book Service with ${pro.name}`,
    content,
    size: 'medium'
  });

  // Attach dynamic price calculator
  const updatePriceBreakdown = () => {
    const sel = document.getElementById('book-service-select');
    const selectedOption = sel.options[sel.selectedIndex];
    const basePrice = Number(selectedOption.getAttribute('data-price') || pro.hourlyRate || 60);

    const pricing = bookingService.calculatePricing(basePrice);

    const container = document.getElementById('price-breakdown-box');
    if (container) {
      container.innerHTML = `
        <div class="price-line"><span>Service Subtotal:</span> <strong>$${pricing.subtotal.toFixed(2)}</strong></div>
        <div class="price-line"><span>Platform Fee (${CONFIG.COMMISSION_PERCENT}%):</span> <span>$${pricing.platformFee.toFixed(2)}</span></div>
        <div class="price-line"><span>Service Tax (${CONFIG.TAX_RATE_PERCENT}%):</span> <span>$${pricing.tax.toFixed(2)}</span></div>
        <hr class="my-2 border-slate" />
        <div class="price-line total"><span>Total Amount:</span> <strong class="text-emerald text-lg">$${pricing.totalPrice.toFixed(2)}</strong></div>
      `;
    }
  };

  updatePriceBreakdown();
  document.getElementById('book-service-select').addEventListener('change', updatePriceBreakdown);

  // Handle slot update on date change
  document.getElementById('book-date-input').addEventListener('change', (e) => {
    const slots = bookingService.getAvailableSlots(pro.id, e.target.value, pro.timeSlots || ['09:00 AM', '11:00 AM', '02:00 PM']);
    const slotSel = document.getElementById('book-slot-select');
    slotSel.innerHTML = slots.length === 0 ? '<option value="" disabled>No slots available</option>' : slots.map(s => `<option value="${s}">${s}</option>`).join('');
  });

  // Handle Booking submission
  document.getElementById('confirm-booking-btn').onclick = async () => {
    const selService = document.getElementById('book-service-select');
    const serviceId = selService.value;
    const serviceName = selService.options[selService.selectedIndex].text.split('—')[0].trim();
    const basePrice = Number(selService.options[selService.selectedIndex].getAttribute('data-price'));

    const date = document.getElementById('book-date-input').value;
    const timeSlot = document.getElementById('book-slot-select').value;
    const address = document.getElementById('book-address-select').value;
    const notes = document.getElementById('book-notes-input').value;

    if (!timeSlot) {
      Toast.show('Please select an available time slot.', 'error');
      return;
    }

    const pricing = bookingService.calculatePricing(basePrice);

    // Process safe mock payment
    Toast.show('Processing secure payment deposit...', 'info');
    const payment = await PaymentService.processPayment({
      amount: pricing.totalPrice,
      method: 'Visa Credit Card'
    });

    if (!payment.success) {
      Toast.show('Payment processing failed.', 'error');
      return;
    }

    const result = bookingService.createBooking({
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      proId: pro.id,
      proName: pro.name,
      serviceId,
      serviceName,
      categoryName: proServices.find(s => s.id === serviceId)?.categoryName || 'Home Service',
      date,
      timeSlot,
      address,
      subtotal: pricing.subtotal,
      platformFee: pricing.platformFee,
      tax: pricing.tax,
      totalPrice: pricing.totalPrice,
      paymentStatus: 'PAID',
      paymentMethod: 'Visa ending in 4242',
      notes
    });

    if (result.success) {
      Modal.close();
      Toast.show(`🎉 Booking confirmed! ID #${result.booking.id.substr(0, 8)}`, 'success');
      // Trigger custom re-render event
      window.dispatchEvent(new CustomEvent('dwellocrew_navigate', { detail: { view: 'CUSTOMER', tab: 'bookings' } }));
    } else {
      Toast.show(result.error || 'Failed to complete booking.', 'error');
    }
  };
}
