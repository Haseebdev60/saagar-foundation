# Saagar Foundation — Premium Full-Stack Web Application

A production-ready, full-stack website built for **Saagar Foundation** preserving its approved visual identity, editorial typography, and humanitarian character while delivering smooth animations, multi-page routing, real REST APIs, MongoDB persistence, and a secure administrator dashboard.

---

## 1. Technology Architecture

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router (`react-router-dom` v7)
- **Animations**: Framer Motion for page transitions, modals, active navigation indicators, and card interactions
- **Icons**: Lucide React
- **Forms & Validation**: React Hook Form + Zod
- **Styling**: Editorial design system adhering to Saagar Foundation brand guidelines:
  - Midnight Navy: `#080E20` / `#071020`
  - Signature Gold: `#F4D15F` / `#efc75e` / `#bd9636`
  - Warm Ivory: `#FAF8F0` / `#faf7ef`
  - Pure White: `#FFFFFF`
  - Typography: Playfair Display (headings) + DM Sans (body)

### Backend
- **Runtime**: Node.js (v18+) + Express.js (ES Modules)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based session stored in secure HTTP-only cookies + Bearer token support
- **Security**: Helmet, CORS with credential handling, Express Rate Limit (contact & login protection), bcryptjs password hashing
- **File Storage**: Multer disk storage for local uploads in `server/uploads/` with public serving at `/uploads/`, extensible to Cloudinary

---

## 2. Directory Structure

```
saagar-contact-work/
├── client / src/
│   ├── assets/
│   │   ├── memoona-founder.jpg    # Verified approved founder photograph
│   │   └── saagar-logo.jpg       # Approved foundation emblem
│   ├── components/
│   │   ├── Header.jsx            # Announcement bar, active indicator, mobile drawer
│   │   ├── Footer.jsx            # Navigation links, contact info, back-to-top
│   │   ├── EventModal.jsx        # Accessible dialog with backdrop blur & keyboard trap
│   │   ├── DonationCard.jsx      # Manual transfer details with clipboard copy feedback
│   │   ├── ContactFormSection.jsx# React Hook Form + Zod validated form
│   │   ├── ProtectedRoute.jsx    # Client-side guard for /admin routes
│   │   └── ScrollToTop.jsx       # Automatic viewport reset on page navigation
│   ├── context/
│   │   └── AuthContext.jsx       # Admin session provider
│   ├── pages/
│   │   ├── Home.jsx              # Hero, Purpose, Mission highlight, Featured events, Founder snippet
│   │   ├── About.jsx             # Mission & Vision deep dive, humanitarian principles
│   │   ├── Founder.jsx           # Dedicated Memoona profile with framed portrait
│   │   ├── Events.jsx            # All 6 events with animated category filters
│   │   ├── Donate.jsx            # "Donate for a Cause", bank instructions, FAQ
│   │   ├── Contact.jsx           # Phone, email, WhatsApp, interactive validated form
│   │   ├── NotFound.jsx          # Custom 404 page in brand aesthetic
│   │   └── admin/
│   │       ├── AdminLogin.jsx    # Secure login form
│   │       └── AdminDashboard.jsx# Multi-tab overview, events, messages, donation & founder CMS
│   ├── services/
│   │   └── api.js                # Centralized API fetcher
│   ├── App.jsx                   # Multi-page router
│   ├── main.jsx                  # React DOM mount point
│   └── styles.css                # Polished design system
├── server/
│   ├── config/
│   │   └── db.js                 # Mongoose connection & error handling
│   ├── controllers/
│   │   ├── authController.js     # Admin login, logout, me, genuine dashboard statistics
│   │   ├── eventsController.js   # CRUD & publication toggles for events
│   │   ├── contactController.js  # Message submission, admin query, status updates, deletion
│   │   ├── donationController.js # Public donation data retrieval & admin editing
│   │   ├── founderController.js  # Founder profile CMS
│   │   └── uploadController.js   # Image upload handler
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role-based access control
│   │   ├── rateLimiter.js        # IP rate limiting for spam prevention
│   │   └── errorHandler.js       # Central error formatting
│   ├── models/
│   │   ├── User.js               # Administrator accounts
│   │   ├── Event.js              # Event stories schema
│   │   ├── ContactSubmission.js  # Contact messages schema
│   │   ├── DonationSetting.js    # Bank transfer settings
│   │   └── FounderContent.js     # Founder statements & portrait
│   ├── routes/                   # Modular Express routes
│   ├── utils/
│   │   └── seed.js               # Database population script
│   └── index.js                  # Express application root
├── dist/                         # Vite production build
├── .env                          # Local environment variables
├── .env.example                  # Environment configuration template
├── package.json                  # Dependencies and scripts
└── vite.config.js                # Vite configuration with /api proxy
```

---

## 3. Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** v18 or later
- **MongoDB** running locally on port 27017 or a MongoDB Atlas URI

### 2. Install Dependencies
```bash
npm install --legacy-peer-deps
```

### 3. Configure Environment Variables
Create a `.env` file in the project root (a sample is provided in `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/saagar_foundation
JWT_SECRET=saagar_foundation_secret_key_2026_secure_jwt
ADMIN_EMAIL=admin@saagarfoundation.org
ADMIN_PASSWORD=SaagarAdmin2026!
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Seed the Database
Populate the database with the initial administrator account, the 6 approved events, approved donation bank info, and founder content:
```bash
npm run seed
```

### 5. Start the Application
Run both the Express backend and the Vite frontend concurrently:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

Alternatively, run each process in separate terminals:
```bash
# Terminal 1: Backend
npm run server

# Terminal 2: Frontend
npm run client
```

---

## 4. Default Administrator Credentials

- **URL**: [http://localhost:5173/admin/login](http://localhost:5173/admin/login)
- **Email**: `admin@saagarfoundation.org`
- **Password**: `SaagarAdmin2026!` *(Change this in production)*

---

## 5. Approved Information Preserved

### Organization Contact
- **Email**: `Saagarwelfarefoundation@gmail.com`
- **Phone**: `03029616426`
- **WhatsApp**: `https://wa.me/923029616426`
- **Location**: Lahore, Pakistan

### Approved Donation Bank Account
- **Heading**: "Donate for a Cause"
- **Account Holder**: Nabila Ahmad
- **Bank**: Mashreq Bank
- **Account Number**: `089120169858`
- **Method**: Direct manual bank transfer (No fake automated payment popups)

### The 6 Approved Humanitarian Events
1. **Saagar Foundation Food Drive** — *Community* — DHA Phase 8, Lahore
2. **Saagar Foundation Fundraiser** — *Fundraising* — Bean Theory, DHA Phase 6, Lahore
3. **Riyat × Saagar Foundation Football Fundraiser** — *Sports* — Pine Avenue Cross Courts, Lahore
4. **Saagar Foundation × Falah Foundation** — *Outreach* — 19/A, Khuda Baksh Colony, New Airport Road, Cantt, Lahore
5. **Saagar Sports Fest** — *Sports* — FR Cross Courts, Pine Avenue, Lahore
6. **Saagar Foundation × Todd’s Welfare** — *Animal Welfare* — Near Arif Memorial Hospital, Lahore

### Founder Profile
- **Founder**: Memoona
- **Title**: Founder, Saagar Foundation
- **Photograph**: `src/assets/memoona-founder.jpg` (client-approved photo)
- **Statements**: Strictly follows foundation mission and vision. No personal claims invented.

---

## 6. REST API Endpoints Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Server uptime & organization status |
| `GET` | `/api/events` | Public | List all published events (optional `?category=`) |
| `GET` | `/api/events/detail/:idOrSlug` | Public | Get single event by ID or slug |
| `GET` | `/api/events/admin/all` | Admin | List all events (published & drafts) |
| `POST` | `/api/events` | Admin | Create a new event story |
| `PUT` | `/api/events/:id` | Admin | Update an existing event |
| `DELETE` | `/api/events/:id` | Admin | Permanently delete an event |
| `POST` | `/api/contact` | Public (Rate Limited) | Submit a contact inquiry |
| `GET` | `/api/contact/admin/all` | Admin | List all received contact messages |
| `PATCH` | `/api/contact/admin/:id` | Admin | Update message status (`unread`, `read`, `replied`) |
| `DELETE` | `/api/contact/admin/:id` | Admin | Delete a message |
| `GET` | `/api/donation-info` | Public | Get public bank account transfer details |
| `PUT` | `/api/donation-info` | Admin | Edit public bank account transfer details |
| `GET` | `/api/founder-info` | Public | Get founder profile text and portrait URL |
| `PUT` | `/api/founder-info` | Admin | Edit founder profile text and portrait URL |
| `POST` | `/api/upload` | Admin | Upload images for events or founder portrait |
| `POST` | `/api/auth/login` | Public (Rate Limited) | Authenticate administrator and set HTTP-only cookie |
| `POST` | `/api/auth/logout` | Public | Clear session cookie |
| `GET` | `/api/auth/me` | Admin | Verify current user session |
| `GET` | `/api/auth/dashboard-stats` | Admin | Retrieve live counts for events and messages |

---

## 7. Production Build and Deployment

### Build Frontend
```bash
npm run build
```
This produces the optimized production bundle inside `dist/`.

### Run in Production Mode
Set `NODE_ENV=production` in `.env` and start the server:
```bash
npm run start
```
In production mode, the Express backend automatically serves the pre-built React frontend from `dist/` and routes all API calls to `/api`.

### Cloud Deployment (Render / Railway / VPS)
1. Commit the repository to GitHub/GitLab.
2. Connect the repository to your host (e.g. Render Web Service or Railway).
3. Set the Build Command:
   ```bash
   npm install --legacy-peer-deps && npm run build
   ```
4. Set the Start Command:
   ```bash
   npm run start
   ```
5. Configure Environment Variables in the host dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong random string
   - `ADMIN_EMAIL`: Your production admin email
   - `ADMIN_PASSWORD`: A strong production password
   - `NODE_ENV`: `production`
