/**
 * DwelloCrew 2.0 — Category & Review Data Models
 */

export class Category {
  constructor(data = {}) {
    this.id = data.id || `cat_${Date.now()}`;
    this.name = data.name || '';
    this.slug = data.slug || this.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    this.icon = data.icon || 'wrench';
    this.description = data.description || '';
    this.badge = data.badge || '';
    this.image = data.image || '';
    this.services = data.services || [];
  }
}

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
