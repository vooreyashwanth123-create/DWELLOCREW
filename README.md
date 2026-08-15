# DwelloCrew 2.0 — Premium Home Services Platform

> **Find. Book. Relax.**
> A modern, trustworthy, production-ready home-services platform connecting customers, service professionals, and administrators.

---

## 🌟 Key Features

### 👤 Dynamic Customer Authentication & Dashboard
- **Open Registration & Login**: Any customer can sign up with their valid email and password. Email duplicates are strictly prevented.
- **SHA-256 Hashed Credentials**: All passwords are stored securely using standard SHA-256 cryptographic hashing without plain-text exposure.
- **Forgot Password Architecture**: Includes interactive password reset token verification.
- **Account Isolation**: Customer profile details, saved addresses, payment methods, and booking history are isolated per user.

### 🛠️ Professional Authentication & Management
- **Open Professional Registration**: Skilled professionals can register, define service offerings, set hourly rates, and specify working schedules.
- **Profile Completion**: Upload work portfolio items, set vacation mode, and manage incoming service bookings.
- **Account Data Isolation**: Complete data separation between independent service professionals.

### 🛡️ Administrator Console Security
- **Role-Based Access Control (RBAC)**: Strict role separation protecting Administrator features from customer or professional access.
- **Configurable Credentials**: Administrator authentication is managed via secure configuration (`ADMIN_EMAIL` and hashed password validation).
- **Platform Analytics**: Visual SVG metrics for revenue, booking volume, and professional verification status.

---

## 🚀 Getting Started

DwelloCrew 2.0 runs natively in any standard modern web browser without build steps or external dependencies.

### Launching the Application
Open `index.html` in Chrome, Firefox, Edge, or Safari:
```
file:///C:/Users/Yashwanth/.gemini/antigravity/scratch/dwellocrew/index.html
```

---

## 🔐 How to Register & Authenticate

### Customer Registration & Login
1. Click **Customer Portal** in the top navigation bar.
2. Click **Sign Up** to create a new customer account using your own email and password (minimum 6 characters).
3. Upon registration, you will be redirected to your personal **Customer Dashboard**.

### Professional Registration & Login
1. Click **Pro Portal** in the top navigation bar.
2. Click **Sign Up** to register as a service professional, specifying your experience years and hourly base rate.
3. Access your **Professional Dashboard** to manage working hours, view incoming booking requests, and set vacation mode.

---

## 📂 Project Structure

```
dwellocrew/
├── index.html                  # Single Entrypoint SPA & Landing Page
├── css/
│   ├── main.css                # Design system tokens, Glassmorphism, CSS reset
│   ├── components.css          # Cards, buttons, inputs, modals, badges, toasts
│   ├── layout.css              # Responsive grid, sidebar, header, footer
│   └── views.css               # Page-specific views (Landing, Dashboards, Discovery)
└── js/
    ├── config.js               # App config & environment placeholders
    ├── db/
    │   ├── storage.js          # Repository isolation storage engine
    │   └── seedData.js         # Initial demo dataset with pre-hashed tokens
    ├── models/                 # Data model classes (User, Professional, Booking, Category, Review)
    ├── services/               # Auth, Booking, Reputation, Notification & Payment logic
    ├── components/             # Reusable UI components & SVG charts
    ├── views/                  # View renders for Landing, Customer, Pro, & Admin
    └── app.js                  # Main client router & event coordinator
```

---

## 📄 License
MIT License. Developed for DwelloCrew 2.0 platform.
