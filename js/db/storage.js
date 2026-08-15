/**
 * DwelloCrew 2.0 — Storage Repository Isolation Engine
 * Provides an abstract storage API over LocalStorage with memory fallback.
 */

import { CONFIG } from '../config.js';

class StorageAdapter {
  constructor() {
    this.memoryStore = new Map();
    this.isLocalStorageAvailable = this._checkLocalStorage();
  }

  _checkLocalStorage() {
    try {
      const testKey = '__dwellocrew_test__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory store.');
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (this.isLocalStorageAvailable) {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return this.memoryStore.has(key) ? JSON.parse(this.memoryStore.get(key)) : defaultValue;
    } catch (err) {
      console.error(`Error reading key "${key}" from storage:`, err);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable) {
        window.localStorage.setItem(key, serialized);
      } else {
        this.memoryStore.set(key, serialized);
      }
      return true;
    } catch (err) {
      console.error(`Error writing key "${key}" to storage:`, err);
      return false;
    }
  }

  removeItem(key) {
    try {
      if (this.isLocalStorageAvailable) {
        window.localStorage.removeItem(key);
      } else {
        this.memoryStore.delete(key);
      }
      return true;
    } catch (err) {
      console.error(`Error removing key "${key}":`, err);
      return false;
    }
  }

  clearAll() {
    try {
      if (this.isLocalStorageAvailable) {
        Object.values(CONFIG.STORAGE_KEYS).forEach(key => window.localStorage.removeItem(key));
      }
      this.memoryStore.clear();
      return true;
    } catch (err) {
      console.error('Error clearing storage:', err);
      return false;
    }
  }
}

export const dbStorage = new StorageAdapter();
