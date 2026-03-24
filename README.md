# DeskSpace

A full-stack workspace broker platform with admin dashboard. Admins upload workspace listings, users discover and enquire via WhatsApp, and leads are tracked in real-time.

**Live Demo:** Client → `http://localhost:3000` | Admin → `http://localhost:3001`

## 🏗️ Architecture

```
deskspace/
├── client/        (User website - React Vite)
├── admin/         (Admin dashboard - React Vite)
├── server/        (Express API)
└── README.md
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js 18+**
- **MongoDB** (local or [MongoDB Atlas](https://atlas.mongodb.com))
- **Cloudinary** account ([Sign up free](https://cloudinary.com))

### 2. Environment Setup

**Server** (`server/.env`):
```bash
MONGO_URI=mongodb://localhost:27017/deskspace
PORT=5000
JWT_SECRET=your_super_secret_key_change_this_in_production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
WHATSAPP_NUMBER=919999999999
```

**Client** (`client/.env`):
```bash
VITE_API_URL=http://localhost:5000/api
```

**Admin** (`admin/.env`):
```bash
# Optional - inherits from vite.config.ts proxy
```

### 3. Install & Run

```bash
# 1. Server
cd server
npm install
npm run dev
# Runs on http://localhost:5000

# 2. Seed sample data (in another terminal)
node seed.js
# Creates 6 sample workspaces + default admin (admin@deskspace.in / admin123)

# 3. Client (in another terminal)
cd ../client
npm install
npm run dev
# Runs on http://localhost:3000

# 4. Admin (in another terminal)
cd ../admin
npm install
npm run dev
# Runs on http://localhost:3001

# Login: admin@deskspace.in / admin123
```

---

## 📚 Features

### **User Website** (Client)

- 🏠 **Hero + Featured Workspaces** — Animated home with search
- 🔍 **Smart Filtering** — Filter by area, seats, budget
- 🎯 **Workspace Details** — Image carousel, amenities, pricing
- 💬 **WhatsApp Lead Capture** — Submit enquiry → Auto-send to WhatsApp
- ⚡ **Performance** — <1s load, lazy-loaded components

### **Admin Dashboard** (Admin)

- 📊 **Dashboard** — Total leads, new leads today, conversion rate
- 🏢 **Workspace Management** — Add/edit/delete, upload images, featur­ed toggle
- 📞 **Lead Management** — Track status, add notes, view conversions
- 🔐 **JWT Auth** — Secure login, token-based sessions

### **Backend API** (Server)

- REST API with auth middleware
- MongoDB data persistence
- Cloudinary image optimization
- Duplicate lead prevention
- Comprehensive error handling

---

## 🔌 API Reference

### **Authentication**

| Method | Endpoint | Body | Response |
|---|---|---|---|
| POST | `/api/admin/login` | `{email, password}` | `{token, admin}` |
| GET | `/api/admin/me` | — | `{admin object}` |

### **Workspaces** (Public)

| Method | Endpoint | Query Params |
|---|---|---|
| GET | `/api/workspaces` | `?area=&minSeats=&maxBudget=&city=&featured=true` |
| GET | `/api/workspaces/:id` | — |

### **Workspaces** (Admin Only)

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/workspaces` | Create (multipart with images) |
| PUT | `/api/workspaces/:id` | Update |
| DELETE | `/api/workspaces/:id` | Delete |

### **Leads**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | ❌ | Create lead (public) |
| GET | `/api/leads` | ✅ | List all leads |
| GET | `/api/leads/stats` | ✅ | Get stats |
| PATCH | `/api/leads/:id` | ✅ | Update status/notes |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion |
| **Admin** | React 18, Vite, TypeScript, Tailwind CSS |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **Auth** | JWT (jsonwebtoken), bcryptjs |
| **Storage** | Cloudinary (images) |

---

## 📁 Project Structure

```
server/
├── config/
│   ├── db.js          (MongoDB connection)
│   └── cloudinary.js  (Image upload config)
├── models/
│   ├── Admin.js       (Admin schema + auth)
│   ├── Workspace.js   (Workspace schema)
│   └── Lead.js        (Lead schema)
├── controllers/
│   ├── adminController.js
│   ├── workspaceController.js
│   └── leadController.js
├── routes/
│   ├── adminRoutes.js
│   ├── workspaceRoutes.js
│   └── leadRoutes.js
├── middleware/
│   └── auth.js        (JWT verification)
└── server.js

client/
├── src/
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Workspaces.tsx
│   │   └── WorkspaceDetails.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── WorkspaceCard.tsx
│   │   ├── ContactModal.tsx
│   │   └── ...
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   ├── workspace.ts
│   │   └── lead.ts
│   └── hooks/
│       └── useFetch.ts

admin/
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Workspaces.tsx
│   │   ├── WorkspaceForm.tsx
│   │   └── Leads.tsx
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── types.ts
```

---

## 🔐 Security

- ✅ JWT token-based auth (7-day expiry)
- ✅ Bcryptjs password hashing
- ✅ Admin routes protected with auth middleware
- ✅ CORS enabled for cross-origin requests
- ✅ FormData multipart for file uploads

### Default Admin Credentials (Change in Production!)

```
Email:    admin@deskspace.in
Password: admin123
```

Run `node seed.js` to reset admin credentials.

---

## 📦 Production Deployment

### **Prepare Build Artifacts**

```bash
# Client
cd client && npm run build      # Output: dist/
cd ../admin && npm run build    # Output: dist/

# Server - runs as-is (no build needed, just Node.js)
```

### **Recommended Hosting**

| Component | Hosting |
|---|---|
| **Client** | Vercel, Netlify, AWS S3 + CloudFront |
| **Admin** | Vercel, Netlify, AWS S3 + CloudFront |
| **Server** | Railway, Render, AWS EC2, Heroku |
| **Database** | MongoDB Atlas |
| **Images** | Cloudinary (included) |

### **Environment Variables (Production)**

Update before deploying:

```bash
JWT_SECRET=long_random_string_at_least_32_chars
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/deskspace
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

---

## 🧪 Testing Locally

### **Test Admin Panel**

1. Navigate to `http://localhost:3001/login`
2. Login with `admin@deskspace.in` / `admin123`
3. Add a workspace → Upload images → Toggle featured
4. View leads in real-time

### **Test User Lead Flow**

1. Navigate to `http://localhost:3000`
2. Browse workspaces, click one
3. Submit enquiry form → Lead stored in DB
4. Redirected to WhatsApp with pre-filled message

---

## 🐛 Troubleshooting

### MongoDB Connection Error

```
ECONNREFUSED 127.0.0.1:27017
```

**Fix:** Start MongoDB locally or use MongoDB Atlas connection string.

### Cloudinary Upload Fails

**Fix:** Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

### CORS Errors

**Fix:** Server CORS is configured. Ensure client/admin use correct proxy URLs.

### Admin Login Returns 401

**Fix:** Run `node seed.js` to create default admin.

---

## 📝 Scripts

```bash
# Server
npm run dev      # Start with nodemon
npm run start    # Run production

# Client/Admin
npm run dev      # Vite dev server
npm run build    # Production build
npm run preview  # Preview production build

# Seed Data
node seed.js     # Create sample workspaces + admin
```

---

## 🎨 Customization

### **Change WhatsApp Number**

Update `WHATSAPP_NUMBER` in `server/.env` and share numbers in `admin/src/pages/WorkspaceDetails.tsx`.

### **Add More Amenities**

Edit `admin/src/pages/WorkspaceForm.tsx` → `AMENITY_OPTIONS` array.

### **Update Colors/Branding**

Modify Tailwind config in `client/tailwind.config.js` and `admin/tailwind.config.js` → `primary` color.

---

## 📄 License

MIT — Feel free to use & customize!

---

## 🚀 Next Steps

- [ ] Add email notifications for new leads
- [ ] Implement payments for premium listings
- [ ] Add workspace owner sign-up flow
- [ ] Build mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard