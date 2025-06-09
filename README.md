[![Netlify Status](https://api.netlify.com/api/v1/badges/88100f30-ff86-4457-95d3-0ce31fb2eca3/deploy-status)](https://app.netlify.com/projects/ecflight-booking-app/deploys)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)
# Flight Explorer Web App

A modern flight booking application. This project demonstrates advanced React.js development with secure authentication, multi-city flight search, booking/payment simulation, admin dashboard, and an interactive flight path map.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Demo](#demo)
- [Screenshots](#screenshots)
- [License](#license)

## Features
- **Secure Authentication**:
  - Login/signup with User and Admin roles.
  - Password encryption using bcrypt for LocalStorage.
  - Role-based navigation and 5-minute inactivity logout.
- **Advanced Flight Search**:
  - Supports one-way, round-trip, and multi-city (up to 3 destinations).
  - Filters: Price range, airlines, stops (non-stop, 1-stop, 2+ stops), time slots (morning, afternoon, evening, night).
  - Mobile-friendly filter modal.
- **Booking and Payment**:
  - Passenger details collection and total price display.
  - Simulated payment gateway with success/failure outcomes.
  - Booking confirmation with unique ID, QR code, and downloadable PDF ticket.
- **Admin Dashboard**:
  - Add, edit, delete flights (e.g., Pune to Mumbai, 50 seats, 12 booked).
  - View, search, and filter all bookings.
- **Bonus Features**:
  - Interactive flight path map using openlayers.
  - Responsive design for mobile, tablet, and desktop.
  - Robust error handling for invalid inputs and API failures.
- **Data Persistence**: LocalStorage for flights and bookings.

## Tech Stack
- **Frontend**: React.js, Redux Toolkit, React Router, Tailwind CSS
- **APIs**: Mock API (AviationStack-compatible)
- **Storage**: LocalStorage
- **Libraries**:
  - ArcGIS for interactive maps
  - jsPDF and qrcode.react for PDF tickets
  - react-icons for UI
- **Tools**: Vite, Netlify for deployment

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rushichandavale/flight-booking.git
   cd flight-explorer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open `http://localhost:3000` in your browser.

## Usage
1. **Signup/Login**:
   - Create an account with User or Admin role.
   - Admin: Access dashboard to manage flights/bookings.
   - User: Search and book flights.
2. **Search Flights**:
   - Select one-way, round-trip, or multi-city.
   - Apply filters (price, airlines, stops, time).
3. **Book Flights**:
   - Enter passenger details, confirm payment (simulated).
   - Download PDF ticket from confirmation page.
4. **Admin Dashboard**:
   - Add flights (e.g., Pune–Mumbai).
   - View/filter bookings.

## Deployment
- **Live Demo**: https://ecflight-booking-app.netlify.app/
- Deployed on Netlify with continuous integration from GitHub.

## Demo
  - Authentication (User/Admin)
  - Flight search (one-way, round-trip, multi-city)
  - Booking, payment, and PDF ticket
  - Admin dashboard
  - Interactive map
  - Mobile responsiveness

## License
MIT License. See [LICENSE](LICENSE) for details.
