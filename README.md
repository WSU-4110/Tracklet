# Tracklet

Tracklet is a full-stack web application that helps users organize purchased items, store receipts, and track return windows and warranties in one place.

## Overview

People often lose receipts, forget return deadlines, or miss warranty expiration dates. Tracklet solves that problem by giving users a central place to manage purchase-related information.

With Tracklet, users can:

- create an account and sign in
- add purchased items
- edit and delete items
- upload and store receipts
- view inventory in a dashboard
- track return deadlines
- track warranty expiration dates

---

## Features

### Authentication
- User registration and login with Supabase Auth
- Secure session handling
- Logout support

### Inventory Management
- Add purchased items
- View item inventory
- Edit item details
- Delete item records

### Dashboard
- Signed-in dashboard overview
- Items page for item management
- Sidebar navigation with active route state

### Receipt Handling
- Upload receipts to Supabase Storage
- Store receipt URLs with items
- View, replace, and remove receipts
- Receipt image parsing and auto-fill support

### Return and Warranty Tracking
- Return window input in days
- Warranty duration input in months
- Automatic calculation of:
  - return deadlines
  - warranty expiration dates
- Visual badges for upcoming deadlines

### Notifications
- Support for return and warranty reminder functionality

---

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Supabase
  - Auth
  - PostgreSQL Database
  - Storage
- **Deployment:** Vercel
- **AI Parsing:** OpenAI API

---
