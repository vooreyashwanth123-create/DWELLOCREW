/**
 * DwelloCrew 2.0 — Notification & WhatsApp Dispatcher Service
 */

import { CONFIG } from '../config.js';
import { dbStorage } from '../db/storage.js';

class NotificationService {
  constructor() {
    this.notifKey = CONFIG.STORAGE_KEYS.NOTIFICATIONS;
  }

  getUserNotifications(userId) {
    const all = dbStorage.getItem(this.notifKey, []);
    return all.filter(n => n.userId === userId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  notifyUser(userId, { title, message }) {
    const all = dbStorage.getItem(this.notifKey, []);
    const newNotif = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      userId,
      title,
      message,
      read: false,
      timestamp: new Date().toISOString()
    };

    all.unshift(newNotif);
    dbStorage.setItem(this.notifKey, all);

    // Dispatch global event for live UI badge updates
    window.dispatchEvent(new CustomEvent('dwellocrew_notification', { detail: newNotif }));
    return newNotif;
  }

  markAllAsRead(userId) {
    const all = dbStorage.getItem(this.notifKey, []);
    const updated = all.map(n => n.userId === userId ? { ...n, read: true } : n);
    dbStorage.setItem(this.notifKey, updated);
  }

  /**
   * Generates standard WhatsApp web intent link without fake API claims
   */
  getWhatsAppShareUrl(phone, textMessage) {
    const cleanPhone = (phone || CONFIG.WHATSAPP.DEFAULT_PHONE).replace(/[^0-9+]/g, '');
    const encodedText = encodeURIComponent(textMessage);
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
}

export const notificationService = new NotificationService();
