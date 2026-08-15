/**
 * DwelloCrew 2.0 — Review & Experience Model
 */

export class Review {
  constructor(data = {}) {
    this.id = data.id || `rev_${Date.now()}`;
    this.bookingId = data.bookingId || '';
    this.proId = data.proId || '';
    this.customerId = data.customerId || '';
    this.customerName = data.customerName || '';
    this.rating = Number(data.rating) || 5;
    this.serviceName = data.serviceName || '';
    this.comment = data.comment || '';
    this.tags = data.tags || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}
