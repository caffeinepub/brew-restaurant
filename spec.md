# Brew Restaurant App

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Public-facing restaurant website for "Brew" restaurant
- Homepage with hero section, tagline, and call-to-action
- Menu page with categorized items (food and drinks/brews)
- About page with restaurant story and atmosphere
- Reservations section with a booking form (name, date, time, party size, contact)
- Contact/location section with address, hours, and contact info
- Admin panel (login-protected) to manage menu items (add, edit, delete) and view reservations
- Menu items: id, name, description, price, category (e.g. Starters, Mains, Brews, Desserts), available flag
- Reservations: id, name, email, phone, date, time, party size, status (pending/confirmed/cancelled), notes

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Backend: Define data models for MenuItem and Reservation. Implement CRUD for menu items (admin), create reservation (public), list/update reservation status (admin).
2. Frontend: 
   - Public pages: Home, Menu, About, Reservations, Contact
   - Admin pages: Login, Dashboard, Menu Management, Reservations Management
   - Navigation with mobile-responsive layout
   - Reservation form with validation
   - Admin table views for menu items and reservations
