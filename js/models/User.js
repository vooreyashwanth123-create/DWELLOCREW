/**
 * DwelloCrew 2.0 — User Data Model
 */

export class User {
  constructor(data = {}) {
    this.id = data.id || `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    this.role = data.role || 'CUSTOMER'; // CUSTOMER | PROFESSIONAL | ADMINISTRATOR
    this.name = data.name || '';
    this.email = (data.email || '').trim().toLowerCase();
    this.passwordHash = data.passwordHash || '';
    this.phone = data.phone || '';
    this.avatar = data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(this.name || 'User')}&background=0D8ABC&color=fff`;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  isCustomer() {
    return this.role === 'CUSTOMER';
  }

  isProfessional() {
    return this.role === 'PROFESSIONAL';
  }

  isAdmin() {
    return this.role === 'ADMINISTRATOR';
  }

  toJSON() {
    const copy = { ...this };
    delete copy.passwordHash;
    return copy;
  }
}
