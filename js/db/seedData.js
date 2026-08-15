/**
 * DwelloCrew 2.0 — Initial Seed Data Generator
 * Provides initial demo datasets with pre-hashed security tokens.
 */

import { CONFIG } from '../config.js';
import { dbStorage } from './storage.js';

export const INITIAL_CATEGORIES = [
  {
    id: 'cat_repairs',
    name: 'Home Repairs',
    slug: 'repairs',
    icon: 'wrench',
    description: 'Expert plumbing, electrical, carpentry, HVAC & appliance repair services.',
    badge: 'Popular',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    services: [
      { id: 'srv_plumbing', name: 'Master Plumbing & Leak Repair', basePrice: 65, durationMinutes: 60 },
      { id: 'srv_electrical', name: 'Electrical Wiring & Smart Home Fixtures', basePrice: 75, durationMinutes: 60 },
      { id: 'srv_appliance', name: 'Appliance & HVAC Repair', basePrice: 85, durationMinutes: 90 },
      { id: 'srv_carpentry', name: 'Custom Carpentry & Furniture Repair', basePrice: 70, durationMinutes: 90 }
    ]
  },
  {
    id: 'cat_salon',
    name: 'Salon & Spa at Home',
    slug: 'salon-spa',
    icon: 'sparkles',
    description: 'Luxury hair styling, deep tissue massage, skin aesthetics, and grooming at home.',
    badge: 'Trending',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=600&q=80',
    services: [
      { id: 'srv_hair', name: 'Hair Styling & Organic Treatment', basePrice: 55, durationMinutes: 60 },
      { id: 'srv_massage', name: 'Deep Tissue & Swedish Massage', basePrice: 90, durationMinutes: 75 },
      { id: 'srv_facial', name: 'Hydra-Facial & Skin Aesthetic Care', basePrice: 80, durationMinutes: 60 },
      { id: 'srv_nails', name: 'Gel Manicure & Spa Pedicure', basePrice: 50, durationMinutes: 45 }
    ]
  },
  {
    id: 'cat_pet',
    name: 'Pet Care & Training',
    slug: 'pet-care',
    icon: 'dog',
    description: 'Professional dog walking, behavior training, grooming, and mobile vet care.',
    badge: 'Top Rated',
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    services: [
      { id: 'srv_grooming', name: 'Full Pet Grooming & Spa Bath', basePrice: 60, durationMinutes: 60 },
      { id: 'srv_walking', name: 'Dog Walking & Socialization (60m)', basePrice: 35, durationMinutes: 60 },
      { id: 'srv_training', name: 'Canine Behavioral Training Session', basePrice: 95, durationMinutes: 90 },
      { id: 'srv_vet', name: 'Mobile Veterinary Wellness Check', basePrice: 110, durationMinutes: 45 }
    ]
  },
  {
    id: 'cat_tutoring',
    name: 'Home Tutoring',
    slug: 'home-tutoring',
    icon: 'book-open',
    description: '1-on-1 personalized tutoring for Math, Science, Coding, Music, and Languages.',
    badge: 'High Impact',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
    services: [
      { id: 'srv_math_sci', name: 'STEM, Math & Physics Tutoring', basePrice: 50, durationMinutes: 60 },
      { id: 'srv_coding', name: 'Python, Web & Robotics Mentorship', basePrice: 65, durationMinutes: 60 },
      { id: 'srv_music', name: 'Piano & Acoustic Guitar Lessons', basePrice: 55, durationMinutes: 45 },
      { id: 'srv_languages', name: 'Spanish & French Fluency Prep', basePrice: 45, durationMinutes: 60 }
    ]
  }
];

export const INITIAL_USERS = [
  // Administrator
  {
    id: 'usr_admin',
    role: 'ADMINISTRATOR',
    name: 'DwelloCrew System Admin',
    email: CONFIG.ADMIN.DEFAULT_EMAIL,
    passwordHash: CONFIG.ADMIN.DEFAULT_PASSWORD_HASH,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    createdAt: '2025-01-01T00:00:00.000Z'
  },
  // Sample Customers
  {
    id: 'usr_cust_1',
    role: 'CUSTOMER',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    passwordHash: '52a0a2df3bb64bbd90ae7e8d5e06ae7bf07fa3b749d6a365f573d8eb2c18ab28', // 'Customer123!'
    phone: '+1 (555) 234-5678',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    addresses: [
      { id: 'addr_1', label: 'Home', street: '742 Evergreen Terrace', city: 'Brooklyn', state: 'NY', zip: '11201', isDefault: true },
      { id: 'addr_2', label: 'Office', street: '350 5th Avenue, Suite 210', city: 'New York', state: 'NY', zip: '10118', isDefault: false }
    ],
    paymentMethods: [
      { id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: '12', expYear: '2028', isDefault: true }
    ],
    createdAt: '2025-02-10T14:30:00.000Z'
  },
  {
    id: 'usr_cust_2',
    role: 'CUSTOMER',
    name: 'David Miller',
    email: 'david.m@example.com',
    passwordHash: '52a0a2df3bb64bbd90ae7e8d5e06ae7bf07fa3b749d6a365f573d8eb2c18ab28', // 'Customer123!'
    phone: '+1 (555) 876-5432',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    addresses: [
      { id: 'addr_3', label: 'Home', street: '1208 Ocean Ave', city: 'San Francisco', state: 'CA', zip: '94112', isDefault: true }
    ],
    paymentMethods: [
      { id: 'pm_3', brand: 'Apple Pay', last4: '3310', expMonth: '11', expYear: '2029', isDefault: true }
    ],
    createdAt: '2025-03-01T09:15:00.000Z'
  },
  // Sample Professionals
  {
    id: 'usr_pro_1',
    role: 'PROFESSIONAL',
    name: 'Marcus Vance',
    email: 'marcus.vance@dwellopro.com',
    passwordHash: '4845fa8a2e5828ec8027a05727a83d3ff6982845c4709d71c4c92a95c8e3cf34', // 'ProPass123!'
    phone: '+1 (555) 901-2345',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    verificationStatus: 'VERIFIED',
    experienceYears: 11,
    bio: 'Licensed Master Electrician specializing in residential rewiring, EV charger installations, panel upgrades, and smart home automation.',
    categoryIds: ['cat_repairs'],
    serviceIds: ['srv_electrical', 'srv_appliance'],
    serviceAreas: ['11201', '10118', 'Brooklyn', 'Manhattan'],
    hourlyRate: 85,
    completedJobs: 342,
    successfulJobs: 340,
    ratingAverage: 4.95,
    vacationMode: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['08:00 AM', '10:00 AM', '01:00 PM', '03:30 PM', '05:30 PM'],
    portfolio: [
      { title: 'Tesla Wall Connector EV Charger Install', image: 'https://images.unsplash.com/photo-1558441719-6705546fe3fe?auto=format&fit=crop&w=400&q=80' }
    ],
    createdAt: '2024-11-15T10:00:00.000Z'
  },
  {
    id: 'usr_pro_2',
    role: 'PROFESSIONAL',
    name: 'Elena Torres',
    email: 'elena.torres@dwellopro.com',
    passwordHash: '4845fa8a2e5828ec8027a05727a83d3ff6982845c4709d71c4c92a95c8e3cf34', // 'ProPass123!'
    phone: '+1 (555) 432-1098',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    verificationStatus: 'VERIFIED',
    experienceYears: 9,
    bio: 'Master Plumber certified for emergency leak repair, tankless water heater installation, and bathroom pipe remodeling.',
    categoryIds: ['cat_repairs'],
    serviceIds: ['srv_plumbing'],
    serviceAreas: ['11201', 'Brooklyn'],
    hourlyRate: 75,
    completedJobs: 275,
    successfulJobs: 272,
    ratingAverage: 4.88,
    vacationMode: false,
    workingDays: ['Monday', 'Wednesday', 'Thursday', 'Friday'],
    timeSlots: ['09:00 AM', '11:30 AM', '02:00 PM'],
    portfolio: [],
    createdAt: '2024-12-01T08:30:00.000Z'
  }
];

export const INITIAL_BOOKINGS = [
  {
    id: 'bk_1001',
    customerId: 'usr_cust_1',
    customerName: 'Sarah Jenkins',
    customerEmail: 'sarah.jenkins@example.com',
    proId: 'usr_pro_1',
    proName: 'Marcus Vance',
    serviceId: 'srv_electrical',
    serviceName: 'Electrical Wiring & Smart Home Fixtures',
    categoryName: 'Home Repairs',
    date: '2026-08-14',
    timeSlot: '10:00 AM',
    address: '742 Evergreen Terrace, Brooklyn, NY 11201',
    subtotal: 75.00,
    platformFee: 9.38,
    tax: 3.75,
    totalPrice: 88.13,
    paymentStatus: 'PAID',
    paymentMethod: 'Visa ending in 4242',
    status: 'CONFIRMED',
    notes: 'Check garage EV outlet',
    createdAt: '2026-08-10T10:30:00.000Z'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev_1',
    bookingId: 'bk_1002',
    proId: 'usr_pro_2',
    customerId: 'usr_cust_2',
    customerName: 'David Miller',
    rating: 5,
    serviceName: 'Master Plumbing & Leak Repair',
    comment: 'Elena arrived right on time, diagnosed the valve issue quickly, and fixed it perfectly.',
    tags: ['On Time', 'Clean Work', 'Expert Tools'],
    createdAt: '2026-08-10T16:00:00.000Z'
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_1',
    userId: 'usr_cust_1',
    title: 'Booking Confirmed!',
    message: 'Marcus Vance accepted your Electrical Wiring appointment for Aug 14 at 10:00 AM.',
    read: false,
    timestamp: '2026-08-10T10:35:00.000Z'
  }
];

export function initializeSeedData(forceReset = false) {
  if (forceReset) {
    dbStorage.clearAll();
  }

  const existingUsers = dbStorage.getItem(CONFIG.STORAGE_KEYS.USERS);
  if (!existingUsers || forceReset) {
    dbStorage.setItem(CONFIG.STORAGE_KEYS.USERS, INITIAL_USERS);
    dbStorage.setItem(CONFIG.STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    dbStorage.setItem(CONFIG.STORAGE_KEYS.BOOKINGS, INITIAL_BOOKINGS);
    dbStorage.setItem(CONFIG.STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    dbStorage.setItem(CONFIG.STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    dbStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, {
      commissionPercent: CONFIG.COMMISSION_PERCENT,
      taxPercent: CONFIG.TAX_RATE_PERCENT,
      whatsAppEnabled: true
    });
    console.log('🌱 Seed data initialized with pre-hashed security tokens.');
  } else {
    // Ensure existing stored admin user exists and has updated passwordHash
    let hasAdmin = existingUsers.some(u => u.role === 'ADMINISTRATOR' || (u.email || '').toLowerCase() === CONFIG.ADMIN.DEFAULT_EMAIL.toLowerCase());
    let updatedUsers = existingUsers.map(u => {
      if (u.role === 'ADMINISTRATOR' || (u.email || '').toLowerCase() === CONFIG.ADMIN.DEFAULT_EMAIL.toLowerCase()) {
        return { ...u, role: 'ADMINISTRATOR', email: CONFIG.ADMIN.DEFAULT_EMAIL, passwordHash: CONFIG.ADMIN.DEFAULT_PASSWORD_HASH };
      }
      return u;
    });
    if (!hasAdmin) {
      updatedUsers.unshift(INITIAL_USERS[0]);
    }
    dbStorage.setItem(CONFIG.STORAGE_KEYS.USERS, updatedUsers);
  }
}
