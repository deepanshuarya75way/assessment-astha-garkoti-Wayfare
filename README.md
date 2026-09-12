# Wayfare

> A full-stack stay discovery and booking platform for finding unique properties, making reservations, and managing trips.

## Overview

**Wayfare** is a full-stack property booking web application that allows users to discover stays, view property details, create accounts, make bookings, and manage their trips.

The platform also provides host functionality, allowing users to become hosts, add properties, and view reservations made on their properties.

The application includes secure authentication, property search and filtering, booking management, image uploads, and Razorpay payment integration.

---

## Features

### Guest Features

* Browse available stays
* Search properties by location or title
* Filter stays by categories such as:

  * Beachfront
  * Mountain View
  * Heritage
  * Lake View
  * Backwaters
* View detailed property information
* Select check-in and check-out dates
* Select number of guests
* Create an account and log in
* Add and manage favorite properties
* Book properties through secure Razorpay checkout
* View booking confirmation details
* View previous and upcoming trips
* Cancel eligible upcoming bookings

### Host Features

* Apply to become a host
* Add a new property
* Upload property images
* View reservations made on hosted properties

### Backend Features

* REST API built with Node.js and Express.js
* MongoDB database using Mongoose
* JWT-based authentication
* Role-based authorization
* Secure password hashing using bcrypt
* Property listing APIs
* Booking APIs
* Payment order creation and verification
* Razorpay payment signature verification
* Cloudinary image uploads
* Protected routes for authenticated users and hosts

---

## Tech Stack

### Frontend

* React
* React Router
* Vite
* Tailwind CSS
* JavaScript
* Context API

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcryptjs
* Multer
* Cloudinary
* Razorpay

---

## Project Structure

```text
Wayfare/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   │
│   └── package.json
│
└── README.md
```

---

## API Overview

The backend provides the following main API modules:

| Module         | Endpoint        | Description                           |
| -------------- | --------------- | ------------------------------------- |
| Authentication | `/api/auth`     | Signup, login and user authentication |
| Listings       | `/api/listings` | Browse and manage property listings   |
| Bookings       | `/api/bookings` | Create, view and cancel bookings      |
| Payments       | `/api/payments` | Create and verify Razorpay payments   |

---

## Authentication & Authorization

Wayfare uses **JWT authentication** for user sessions.

Users can have different roles:

* `guest`
* `host_pending`
* `host`
* `admin`

Protected routes require a valid JWT token, while host-specific operations require appropriate authorization.

Passwords are securely hashed using **bcrypt** and password hashes are not returned in normal user responses.

---

## Booking & Payment Flow

The booking process works as follows:

1. User selects a property.
2. User chooses check-in and check-out dates.
3. The application calculates the booking amount.
4. The backend recalculates the amount to prevent client-side price manipulation.
5. A Razorpay payment order is created.
6. The user completes payment through Razorpay.
7. The payment signature is verified by the backend.
8. The booking is stored in MongoDB.
9. A unique booking confirmation code is generated.
10. The booking becomes available in the user's trips.

---

## Image Uploads

Property images are uploaded through the backend using **Multer** and stored using **Cloudinary**.

Uploaded property images are therefore not stored directly in the application server.

---

## Environment Variables

The backend requires environment variables for database access, authentication, Cloudinary and Razorpay.

Create a `.env` file inside the backend directory.

Example:

```env
PORT=5000
CLIENT_URL=http://localhost:5173

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

**Never commit the actual `.env` file or secret keys to GitHub.**

---

## Running the Project Locally

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd Wayfare
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on the Vite development server, usually:

```text
http://localhost:5173
```

---

## Environment Configuration for Frontend

The frontend uses the `VITE_API_URL` environment variable to determine the backend API URL.

Example:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Security

The project includes several security-related measures:

* JWT-based authentication
* Password hashing with bcrypt
* Protected API routes
* Role-based authorization
* Server-side booking price calculation
* Razorpay payment signature verification
* File type validation for uploaded images
* File size limits for image uploads
* Environment variables for sensitive credentials

---

## Future Improvements

Some possible future improvements include:

* Property availability management
* Host application approval workflow
* Booking refund processing
* Email notifications
* Advanced property filtering
* Reviews and ratings from verified guests
* Production deployment
* Automated testing
* Improved admin dashboard

---

## Author

Astha Garkoti

Built as a full-stack web development project.
