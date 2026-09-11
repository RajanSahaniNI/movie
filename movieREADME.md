# 🎬 Movie Booking System

A full-stack **Movie Booking Website** built using the **MERN stack**
--- MongoDB, Express.js, React.js, and Node.js.

The application allows users to browse movies, select theatres and
shows, choose seats, and complete a **Pay at Counter** booking. It also
implements a **15-minute transaction window**, temporary seat locking,
automatic seat release after timeout, concurrent booking protection,
random booking codes, and PDF receipt generation.

------------------------------------------------------------------------

## 📌 Project Overview

The Movie Booking System is designed to simulate a real-world cinema
ticket booking platform.

### Main Booking Flow

``` text
Home
  ↓
Movies
  ↓
Movie Details
  ↓
Select Theatre
  ↓
Select Date & Show
  ↓
Select Seats
  ↓
15-Minute Transaction Window
  ↓
Pay at Counter
  ↓
Booking Confirmation
  ↓
Random Booking Code / PDF Receipt
```

------------------------------------------------------------------------

# 🚀 Features

## 👤 User Features

-   User registration and login
-   JWT-based authentication
-   Browse available movies
-   Search and filter movies
-   View movie details
-   Select theatre
-   Select date and show time
-   Interactive seat selection
-   Display available, selected, temporarily held, and booked seats
-   15-minute transaction countdown
-   Temporary seat locking
-   Automatic seat release after transaction timeout
-   Prevent double booking
-   Concurrent seat booking protection
-   Pay at Counter option
-   Generate random booking code
-   Generate PDF booking receipt
-   View booking confirmation
-   View booking history
-   Cancel/expire incomplete transactions

------------------------------------------------------------------------

# 🔐 Authentication

Authentication is implemented using:

-   JSON Web Token (JWT)
-   bcrypt password hashing
-   Protected API routes
-   User and Admin roles

### User Roles

``` text
USER
 ├── Browse movies
 ├── Select shows
 ├── Select seats
 ├── Book tickets
 └── View bookings

ADMIN
 ├── Manage movies
 ├── Manage theatres
 ├── Manage shows
 ├── Manage users
 ├── Manage bookings
 └── View dashboard
```

------------------------------------------------------------------------

# 🎟️ Seat Booking System

The seat system has four important states:

``` text
🟩 AVAILABLE
🟨 HELD
🟥 BOOKED
🟦 SELECTED
```

### Available

The seat can be selected by a user.

### Held

The seat is temporarily locked for a transaction.

``` text
status: HELD
lockedBy: userId
lockedUntil: date
```

### Booked

The transaction has been completed and the seat is permanently booked
for that show.

### Selected

The seat is currently selected in the React interface before the booking
request is finalized.

------------------------------------------------------------------------

# ⏱️ 15-Minute Transaction Window

When a user proceeds with selected seats, a **15-minute transaction
window** starts.

Example:

``` text
15:00
 ↓
14:59
 ↓
14:58
 ↓
...
 ↓
00:01
 ↓
00:00
```

The countdown is displayed on the screen.

The backend also stores the expiry time so that the transaction cannot
be extended or bypassed simply by modifying the browser.

Example:

``` javascript
lockedUntil: new Date(Date.now() + 15 * 60 * 1000)
```

------------------------------------------------------------------------

# ❌ Transaction Timeout

If the transaction is not completed within 15 minutes:

``` text
HELD
  ↓
TIMEOUT
  ↓
CANCELLED / EXPIRED
  ↓
SEAT RELEASED
  ↓
AVAILABLE
```

The user is returned to the seat selection page with a message such as:

> Transaction cancelled. Your selected seat has been released. Please
> try again.

The seat becomes available for another user immediately after the hold
expires.

------------------------------------------------------------------------

# ⚠️ Concurrent Booking Cases

The system handles the following cases.

## Case 1: One User Books a Seat

``` text
User A
  ↓
Select A5
  ↓
Temporary Hold
  ↓
Pay at Counter
  ↓
Transaction Complete
  ↓
A5 = BOOKED
```

The user receives a random booking code.

Example:

``` text
Booking Code: MVB-739251
```

The seat remains permanently booked for that show.

------------------------------------------------------------------------

## Case 2: Two Users Select the Same Seat

Example:

``` text
User A → A5
User B → A5
```

When one transaction successfully completes:

``` text
A5 → BOOKED
```

The other user's booking request is rejected.

The user receives:

> This seat is already booked. Please select another seat.

The user is returned to the seat selection screen.

------------------------------------------------------------------------

## Case 3: Concurrent Payment Requests

If multiple users attempt to finalize the same seat around the same
time, the backend performs the final seat validation atomically.

The application must never create two successful bookings for the same
seat and show.

If the seat has already been claimed, the affected request is rejected
with:

> This seat is already booked. Please select another seat.

------------------------------------------------------------------------

# 💳 Payment --- Pay at Counter

The application uses a single:

``` text
PAY AT COUNTER
```

button.

The booking system supports the required counter-payment behavior.

## Act 1 --- Random Booking Code

After successful booking, the system generates a unique random code.

Example:

``` text
MVB-739251
```

The user sees:

> The seat is booked. You can show/provide the below code at the counter
> to pay and get the ticket.

The booking code is stored in MongoDB.

------------------------------------------------------------------------

## Act 2 --- PDF Receipt

The system can generate a PDF receipt containing:

-   Movie name
-   Theatre name
-   Screen
-   Date
-   Show time
-   Selected seats
-   Total amount
-   Booking code
-   Counter-payment message

The receipt contains:

> Show this receipt at the counter to pay and get the ticket.

------------------------------------------------------------------------

# 🛠️ Technology Stack

  Technology    Purpose
  ------------- --------------------
  React.js      Frontend UI
  Node.js       Backend runtime
  Express.js    REST API
  MongoDB       Database
  Mongoose      MongoDB ODM
  JWT           Authentication
  bcrypt        Password hashing
  Axios         API communication
  CSS           Styling
  PDF Library   Receipt generation
  Postman       API testing
  Git/GitHub    Version control

------------------------------------------------------------------------

# 📁 Project Structure

``` text
movie-booking/
│
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── MovieCard.jsx
│       │   ├── Seat.jsx
│       │   └── Footer.jsx
│       │
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Movies.jsx
│       │   ├── MovieDetails.jsx
│       │   ├── Theatre.jsx
│       │   ├── SeatSelection.jsx
│       │   ├── Payment.jsx
│       │   ├── BookingSuccess.jsx
│       │   └── MyBookings.jsx
│       │
│       ├── services/
│       │   └── api.js
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── App.jsx
│       └── main.jsx
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── theatreController.js
│   │   ├── showController.js
│   │   └── bookingController.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── Theatre.js
│   │   ├── Show.js
│   │   └── Booking.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── theatreRoutes.js
│   │   ├── showRoutes.js
│   │   └── bookingRoutes.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── utils/
│   │   ├── generateBookingCode.js
│   │   └── generateReceipt.js
│   │
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

------------------------------------------------------------------------

# 🗄️ Database Structure

MongoDB database:

``` text
movie_booking
│
├── users
├── movies
├── theatres
├── shows
└── bookings
```

------------------------------------------------------------------------

## Users Collection

Example:

``` javascript
{
  name: "Rahul",
  email: "rahul@gmail.com",
  password: "hashed_password",
  role: "user"
}
```

------------------------------------------------------------------------

## Movies Collection

Example:

``` javascript
{
  title: "Avengers: Endgame",
  description: "Superhero movie",
  genre: ["Action", "Adventure"],
  language: "English",
  duration: 181,
  releaseDate: "2019-04-26",
  poster: "image-url"
}
```

------------------------------------------------------------------------

## Theatres Collection

Example:

``` javascript
{
  name: "PVR Cinemas",
  location: "Chandigarh",
  screens: [
    {
      name: "Screen 1",
      totalSeats: 100
    }
  ]
}
```

------------------------------------------------------------------------

## Shows Collection

A show connects a movie, theatre, screen, date, time, and price.

``` javascript
{
  movieId: "...",
  theatreId: "...",
  screen: "Screen 1",
  date: "2026-09-10",
  startTime: "18:30",
  price: 250
}
```

Seat availability is show-specific.

For example:

``` text
Avengers - 6:00 PM
A5 = BOOKED

Avengers - 9:00 PM
A5 = AVAILABLE
```

------------------------------------------------------------------------

## Bookings Collection

Example:

``` javascript
{
  userId: "...",
  showId: "...",
  seats: ["A5", "A6"],
  totalAmount: 500,
  bookingCode: "MVB-739251",
  paymentMethod: "PAY_AT_COUNTER",
  paymentStatus: "PENDING",
  bookingStatus: "CONFIRMED"
}
```

------------------------------------------------------------------------

# 🔌 REST API

## Authentication

``` text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/profile
```

## Movies

``` text
GET    /api/movies
GET    /api/movies/:id
POST   /api/movies
PUT    /api/movies/:id
DELETE /api/movies/:id
```

## Theatres

``` text
GET    /api/theatres
GET    /api/theatres/:id
POST   /api/theatres
PUT    /api/theatres/:id
DELETE /api/theatres/:id
```

## Shows

``` text
GET    /api/shows
GET    /api/shows/:id
POST   /api/shows
PUT    /api/shows/:id
DELETE /api/shows/:id
```

## Bookings

``` text
POST   /api/bookings/hold
GET    /api/bookings/:id/status
POST   /api/bookings/pay-counter
POST   /api/bookings/cancel
GET    /api/bookings/my
GET    /api/bookings/:id
GET    /api/bookings/:id/receipt
```

------------------------------------------------------------------------

# ⚙️ Installation

## Prerequisites

Install:

-   Node.js
-   MongoDB Community Server or MongoDB Atlas
-   MongoDB Compass
-   VS Code
-   Git
-   Postman

------------------------------------------------------------------------

# 📦 Backend Setup

Open the terminal:

``` bash
cd backend
npm install
```

Install required packages:

``` bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken
```

Install development dependency:

``` bash
npm install --save-dev nodemon
```

------------------------------------------------------------------------

# 📦 Frontend Setup

Open another terminal:

``` bash
cd frontend
npm install
```

Install Axios:

``` bash
npm install axios
```

If using React Router:

``` bash
npm install react-router-dom
```

------------------------------------------------------------------------

# 🔑 Environment Variables

Create:

``` text
backend/.env
```

Example:

``` env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/movie_booking

JWT_SECRET=your_secret_key
```

Do not upload `.env` to GitHub.

Add this to `.gitignore`:

``` text
node_modules/
.env
```

------------------------------------------------------------------------

# ▶️ Running the Project

## Start Backend

``` bash
cd backend
npm run dev
```

Backend:

``` text
http://localhost:5000
```

## Start Frontend

Open another terminal:

``` bash
cd frontend
npm run dev
```

React application will normally run on:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🧪 API Testing

Use Postman to test:

``` text
Register
   ↓
Login
   ↓
Get Movies
   ↓
Get Shows
   ↓
Hold Seats
   ↓
Pay at Counter
   ↓
Get Booking
   ↓
Generate Receipt
```

------------------------------------------------------------------------

# 🔒 Important Booking Logic

Seat availability must be validated by the **backend**, not only by
React.

The backend should verify:

``` text
Is seat AVAILABLE?
       |
       +---- NO → Seat already booked/held
       |
       +---- YES
              ↓
         Create temporary hold
              ↓
         Start 15-minute window
              ↓
       Transaction completed?
          /          \
        YES           NO
         |             |
      BOOKED        EXPIRED
                       |
                  Release seat
                       |
                   AVAILABLE
```

The final booking operation must use an atomic database operation or
MongoDB transaction strategy so concurrent requests cannot create
duplicate successful bookings.

------------------------------------------------------------------------

# 🖥️ User Interface

Recommended pages:

``` text
Home
Movies
Movie Details
Theatre Selection
Show Selection
Seat Selection
Payment
Booking Confirmation
My Bookings
Login
Register
Profile
```

Admin pages:

``` text
Admin Dashboard
Manage Movies
Manage Theatres
Manage Screens
Manage Shows
Manage Bookings
Manage Users
```

------------------------------------------------------------------------

# 📄 Booking Receipt

A successful receipt should contain:

``` text
========================================
          MOVIE BOOKING RECEIPT
========================================

Movie: Avengers: Endgame
Theatre: PVR Cinemas
Screen: Screen 1

Date: 10 September 2026
Time: 6:30 PM

Seats: A5, A6

Amount: ₹500

Booking Code: MVB-739251

----------------------------------------
Show this receipt at the counter
to pay and get the ticket.
----------------------------------------
```

------------------------------------------------------------------------

# 🎯 Project Objectives

The main objectives are:

1.  Build a complete MERN-stack application.
2.  Implement secure user authentication.
3.  Manage movies, theatres, screens, and shows.
4.  Provide interactive seat selection.
5.  Implement a 15-minute transaction window.
6.  Temporarily lock seats during a transaction.
7.  Automatically release seats after timeout.
8.  Prevent duplicate/concurrent seat bookings.
9.  Provide Pay at Counter functionality.
10. Generate a unique booking code.
11. Generate a PDF receipt.
12. Provide an admin management system.

------------------------------------------------------------------------

# 🔮 Future Enhancements

Possible future improvements:

-   Online payment using Razorpay/Stripe
-   Email booking confirmation
-   SMS notifications
-   QR code on tickets
-   Movie reviews and ratings
-   Wishlist
-   Multiple cities
-   Offers and coupons
-   Food and beverage booking
-   Seat categories such as Premium/Gold/Silver
-   Revenue analytics
-   Cloudinary image storage
-   Docker deployment
-   Automated testing

------------------------------------------------------------------------

# 👨‍💻 Development Approach

The project should be developed in the following order:

``` text
1. Project Setup
       ↓
2. MongoDB Connection
       ↓
3. Database Models
       ↓
4. Authentication
       ↓
5. Movie CRUD
       ↓
6. Theatre & Screen Management
       ↓
7. Show Management
       ↓
8. React Frontend
       ↓
9. Seat Selection
       ↓
10. 15-Minute Seat Hold
       ↓
11. Concurrent Booking Protection
       ↓
12. Pay at Counter
       ↓
13. Booking Code
       ↓
14. PDF Receipt
       ↓
15. Admin Dashboard
       ↓
16. Testing
       ↓
17. Deployment
```

------------------------------------------------------------------------

# 📜 License

This project is developed for educational and academic purposes.
