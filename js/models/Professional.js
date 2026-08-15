/**
 * DwelloCrew 2.0 — Professional Data Model
 */

import { User } from './User.js';

export class Professional extends User {
  constructor(data = {}) {
    super(data);
    this.role = 'PROFESSIONAL';
    this.verificationStatus = data.verificationStatus || 'PENDING'; // PENDING | VERIFIED | SUSPENDED
    this.experienceYears = Number(data.experienceYears) || 1;
    this.bio = data.bio || '';
    this.categoryIds = data.categoryIds || [];
    this.serviceIds = data.serviceIds || [];
    this.serviceAreas = data.serviceAreas || [];
    this.hourlyRate = Number(data.hourlyRate) || 50;
    this.completedJobs = Number(data.completedJobs) || 0;
    this.successfulJobs = Number(data.successfulJobs) || 0;
    this.ratingAverage = Number(data.ratingAverage) || 5.0;
    this.vacationMode = Boolean(data.vacationMode);
    this.workingDays = data.workingDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    this.timeSlots = data.timeSlots || ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];
    this.portfolio = data.portfolio || [];
  }

  isVerified() {
    return this.verificationStatus === 'VERIFIED';
  }

  getSuccessRatePercent() {
    if (!this.completedJobs || this.completedJobs === 0) return 100;
    return ((this.successfulJobs / this.completedJobs) * 100).toFixed(1);
  }
}
