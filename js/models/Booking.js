/**
 * DwelloCrew 2.0 — Booking Data Model & State Machine
 */

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  ON_THE_WAY: 'ON_THE_WAY',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED'
};

export class Booking {
  constructor(data = {}) {
    this.id = data.id || `bk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.customerId = data.customerId || '';
    this.customerName = data.customerName || '';
    this.customerEmail = data.customerEmail || '';
    this.proId = data.proId || '';
    this.proName = data.proName || '';
    this.serviceId = data.serviceId || '';
    this.serviceName = data.serviceName || '';
    this.categoryName = data.categoryName || '';
    this.date = data.date || '';
    this.timeSlot = data.timeSlot || '';
    this.address = data.address || '';
    this.subtotal = Number(data.subtotal) || 0;
    this.platformFee = Number(data.platformFee) || 0;
    this.tax = Number(data.tax) || 0;
    this.totalPrice = Number(data.totalPrice) || (this.subtotal + this.platformFee + this.tax);
    this.paymentStatus = data.paymentStatus || 'UNPAID'; // UNPAID | PAID | REFUNDED
    this.paymentMethod = data.paymentMethod || 'Credit Card';
    this.status = data.status || BOOKING_STATUS.PENDING;
    this.notes = data.notes || '';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.completedAt = data.completedAt || null;
  }

  static canTransition(currentStatus, nextStatus) {
    const validTransitions = {
      [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.REJECTED, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.CONFIRMED]: [BOOKING_STATUS.ON_THE_WAY, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.ON_THE_WAY]: [BOOKING_STATUS.IN_PROGRESS, BOOKING_STATUS.CANCELLED],
      [BOOKING_STATUS.IN_PROGRESS]: [BOOKING_STATUS.COMPLETED],
      [BOOKING_STATUS.COMPLETED]: [],
      [BOOKING_STATUS.CANCELLED]: [],
      [BOOKING_STATUS.REJECTED]: []
    };

    return validTransitions[currentStatus]?.includes(nextStatus) || false;
  }
}
