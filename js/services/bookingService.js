/**
 * DwelloCrew 2.0 — Booking Management & Double-Booking Prevention Engine
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';
import { Booking, BOOKING_STATUS } from '../models/Booking.js';
import { notificationService } from './notificationService.js';

class BookingService {
  constructor() {
    this.bookingsKey = CONFIG.STORAGE_KEYS.BOOKINGS;
  }

  getAllBookings() {
    return dbStorage.getItem(this.bookingsKey, []).map(b => new Booking(b));
  }

  getBookingsForUser(userId, role) {
    const all = this.getAllBookings();
    if (role === 'CUSTOMER') {
      return all.filter(b => b.customerId === userId);
    } else if (role === 'PROFESSIONAL') {
      return all.filter(b => b.proId === userId);
    } else if (role === 'ADMINISTRATOR') {
      return all;
    }
    return [];
  }

  getAvailableSlots(proId, dateStr, defaultSlots = []) {
    const allBookings = this.getAllBookings();
    const bookedTimes = allBookings
      .filter(b => b.proId === proId && b.date === dateStr && b.status !== BOOKING_STATUS.CANCELLED && b.status !== BOOKING_STATUS.REJECTED)
      .map(b => b.timeSlot);

    return defaultSlots.filter(slot => !bookedTimes.includes(slot));
  }

  calculatePricing(basePrice) {
    const settings = dbStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS, {
      commissionPercent: CONFIG.COMMISSION_PERCENT,
      taxPercent: CONFIG.TAX_RATE_PERCENT
    });

    const subtotal = Number(basePrice);
    const platformFee = Number(((subtotal * settings.commissionPercent) / 100).toFixed(2));
    const tax = Number((((subtotal + platformFee) * settings.taxPercent) / 100).toFixed(2));
    const totalPrice = Number((subtotal + platformFee + tax).toFixed(2));

    return { subtotal, platformFee, tax, totalPrice };
  }

  createBooking(bookingParams) {
    const { proId, date, timeSlot } = bookingParams;

    // Double-booking check
    const available = this.getAvailableSlots(proId, date, [timeSlot]);
    if (!available.includes(timeSlot)) {
      return { success: false, error: `Selected slot (${timeSlot}) on ${date} is no longer available.` };
    }

    const newBooking = new Booking({
      ...bookingParams,
      status: BOOKING_STATUS.CONFIRMED // Default auto-accepted or pending
    });

    const bookings = dbStorage.getItem(this.bookingsKey, []);
    bookings.unshift(newBooking);
    dbStorage.setItem(this.bookingsKey, bookings);

    // Notify Customer & Professional
    notificationService.notifyUser(newBooking.customerId, {
      title: 'Booking Confirmed!',
      message: `Your booking #${newBooking.id.substr(0, 8)} for ${newBooking.serviceName} with ${newBooking.proName} is confirmed for ${newBooking.date} at ${newBooking.timeSlot}.`
    });

    notificationService.notifyUser(newBooking.proId, {
      title: 'New Service Booking',
      message: `You have a new booking from ${newBooking.customerName} for ${newBooking.serviceName} on ${newBooking.date} at ${newBooking.timeSlot}.`
    });

    return { success: true, booking: newBooking };
  }

  updateBookingStatus(bookingId, newStatus, currentUserId) {
    const bookings = dbStorage.getItem(this.bookingsKey, []);
    const index = bookings.findIndex(b => b.id === bookingId);
    if (index === -1) return { success: false, error: 'Booking not found.' };

    const b = bookings[index];

    if (!Booking.canTransition(b.status, newStatus)) {
      return { success: false, error: `Invalid status transition from ${b.status} to ${newStatus}.` };
    }

    b.status = newStatus;
    if (newStatus === BOOKING_STATUS.COMPLETED) {
      b.completedAt = new Date().toISOString();
      this._incrementProCompletedJobs(b.proId);
    }

    bookings[index] = b;
    dbStorage.setItem(this.bookingsKey, bookings);

    // Notify Customer on status update
    notificationService.notifyUser(b.customerId, {
      title: `Booking Status: ${newStatus.replace(/_/g, ' ')}`,
      message: `Update on booking #${b.id.substr(0, 8)} for ${b.serviceName}: Pro is now ${newStatus.replace(/_/g, ' ').toLowerCase()}.`
    });

    return { success: true, booking: new Booking(b) };
  }

  _incrementProCompletedJobs(proId) {
    const users = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS, []);
    const index = users.findIndex(u => u.id === proId);
    if (index !== -1) {
      users[index].completedJobs = (users[index].completedJobs || 0) + 1;
      users[index].successfulJobs = (users[index].successfulJobs || 0) + 1;
      dbStorage.setItem(CONFIG.STORAGE_KEYS.USERS, users);
    }
  }
}

export const bookingService = new BookingService();
