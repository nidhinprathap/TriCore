# TriCore Events — Full Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete TriCore Events platform — a CMS-driven event management system with a public website, participant registration/payments, and a role-based admin portal.

**Architecture:** Section-based CMS with React 18 + Vite frontend, Express + MongoDB backend. All public content is admin-managed via section editors. Events support individual, team, and group registrations with Razorpay payment integration. JWT auth with role-based access for 6 admin roles.

**Tech Stack:** React 18, Vite, Tailwind CSS, Flowbite, Express, MongoDB/Mongoose, JWT/bcrypt, Zod, Sharp, Multer, Razorpay, Nodemailer, Lucide Icons

---

## Epic Overview

| # | Epic | Stories | Focus |
|---|------|---------|-------|
| 1 | Project Scaffold & Infrastructure | 3 | Monorepo setup, DB connection, dev tooling |
| 2 | Database Models & Seed Data | 2 | All 9 Mongoose models + seed script |
| 3 | Authentication System | 2 | Admin JWT auth + Public user auth (Google OAuth) |
| 4 | Backend API — Content & Settings | 3 | CMS endpoints, site settings, media uploads |
| 5 | Backend API — Events & Registration | 3 | Events CRUD, sport items, registration + payments |
| 6 | Frontend Foundation | 3 | Design system components, layouts, theming |
| 7 | Public Website | 4 | All public pages + section renderers |
| 8 | Event Discovery & Registration Flow | 3 | Event listing, detail, registration + payment |
| 9 | Admin Portal — Core | 4 | Login, dashboard, CMS page editor, settings |
| 10 | Admin Portal — Events & Registrations | 3 | Event manager, sport items, registration management |
| 11 | Admin Portal — Expansion | 3 | Payments, calendar, users/roles, notifications, backup |
| 12 | Testing, Polish & Deployment | 2 | E2E tests, performance, deployment config |

---

# Epic 1: Project Scaffold & Infrastructure

## Story 1.1: Monorepo Setup

### Task 1.1.1: Initialize root project

**Files:**
- Create: `package.json`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: Initialize root package.json**

```bash
cd /Users/npx/Documents/_workspace/tricore
npm init -y
```

- [ ] **Step 2: Update package.json with workspaces and scripts**

```json
{
  "name": "tricore",
  "private": true,
  "workspaces": ["client", "server"],
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "npm run dev --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "build": "npm run build --workspace=client",
    "start": "npm run start --workspace=server"
  },
  "devDependencies": {
    "concurrently": "^9.1.0"
  }
}
```

- [ ] **Step 3: Create .env.example**

```env
# Server
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tricore
JWT_SECRET=your-jwt-secret-here
JWT_EXPIRES_IN=7d

# Client
VITE_API_URL=http://localhost:5000/api

# Razorpay
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_KEY_SECRET=your-key-secret

# Email (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id

# Uploads
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
```

- [ ] **Step 4: Update .gitignore**

Append to existing `.gitignore`:
```
node_modules/
.env
dist/
uploads/
*.log
```

- [ ] **Step 5: Install root dependencies**

```bash
npm install concurrently --save-dev
```

- [ ] **Step 6: Commit**

```bash
git add package.json .env.example .gitignore
git commit -m "feat: initialize monorepo with workspaces"
```

---

### Task 1.1.2: Initialize Express server

**Files:**
- Create: `server/package.json`
- Create: `server/src/server.js`
- Create: `server/src/config/env.js`
- Create: `server/src/config/cors.js`

- [ ] **Step 1: Create server package.json**

```json
{
  "name": "tricore-server",
  "version": "1.0.0",
  "type": "module",
  "main": "src/server.js",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.7",
    "mongoose": "^8.9.0",
    "helmet": "^8.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.7"
  }
}
```

- [ ] **Step 2: Create server/src/config/env.js**

```js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

export default {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/tricore',
  jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};
```

- [ ] **Step 3: Create server/src/config/cors.js**

```js
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
```

- [ ] **Step 4: Create server/src/server.js**

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './config/env.js';
import corsOptions from './config/cors.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
```

- [ ] **Step 5: Install server dependencies**

```bash
cd server && npm install && cd ..
```

- [ ] **Step 6: Test server starts**

```bash
npm run dev:server
# Expected: "Server running on port 5000"
# Visit http://localhost:5000/api/health → {"status":"ok",...}
```

- [ ] **Step 7: Commit**

```bash
git add server/
git commit -m "feat: add Express server with config and health endpoint"
```

---

### Task 1.1.3: Initialize React client

**Files:**
- Create: `client/` (via Vite scaffold)
- Modify: `client/package.json`
- Create: `client/tailwind.config.js`

- [ ] **Step 1: Scaffold Vite React app**

```bash
npm create vite@latest client -- --template react
```

- [ ] **Step 2: Install client dependencies**

```bash
cd client
npm install axios react-router-dom lucide-react flowbite flowbite-react
npm install -D tailwindcss @tailwindcss/vite
cd ..
```

- [ ] **Step 3: Configure Tailwind in client/vite.config.js**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
});
```

- [ ] **Step 4: Add Tailwind to client/src/index.css**

```css
@import "tailwindcss";
```

- [ ] **Step 5: Verify client runs**

```bash
npm run dev:client
# Expected: Vite dev server on http://localhost:5173
```

- [ ] **Step 6: Commit**

```bash
git add client/
git commit -m "feat: add Vite React client with Tailwind CSS"
```

---

## Story 1.2: Database Connection

### Task 1.2.1: MongoDB connection with Mongoose

**Files:**
- Create: `server/src/config/db.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create server/src/config/db.js**

```js
import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

- [ ] **Step 2: Add DB connection to server.js**

Add before `app.listen`:
```js
import connectDB from './config/db.js';

await connectDB();
```

- [ ] **Step 3: Test connection**

```bash
npm run dev:server
# Expected: "MongoDB connected: localhost"
```

- [ ] **Step 4: Commit**

```bash
git add server/src/config/db.js server/src/server.js
git commit -m "feat: add MongoDB connection via Mongoose"
```

---

## Story 1.3: Error Handling & Validation Middleware

### Task 1.3.1: Global error handler and validation middleware

**Files:**
- Create: `server/src/middleware/errorHandler.js`
- Create: `server/src/middleware/validate.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create server/src/middleware/errorHandler.js**

```js
const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  res.status(status).json({
    error: { message, ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) },
  });
};

export default errorHandler;
```

- [ ] **Step 2: Create server/src/middleware/validate.js**

```js
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: {
        message: 'Validation failed',
        details: result.error.issues.map((i) => ({
          field: i.path.join('.'),
          message: i.message,
        })),
      },
    });
  }
  req.validatedBody = result.data;
  next();
};

export default validate;
```

- [ ] **Step 3: Install Zod**

```bash
cd server && npm install zod && cd ..
```

- [ ] **Step 4: Wire error handler into server.js**

Add after all routes:
```js
import errorHandler from './middleware/errorHandler.js';

// After all route definitions
app.use(errorHandler);
```

- [ ] **Step 5: Commit**

```bash
git add server/src/middleware/ server/package.json
git commit -m "feat: add error handler and Zod validation middleware"
```

---

# Epic 2: Database Models & Seed Data

## Story 2.1: Core Mongoose Models

### Task 2.1.1: SiteSettings and PageContent models

**Files:**
- Create: `server/src/models/SiteSettings.js`
- Create: `server/src/models/PageContent.js`

- [ ] **Step 1: Create server/src/models/SiteSettings.js**

```js
import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
  isExternal: { type: Boolean, default: false },
}, { _id: false });

const siteSettingsSchema = new mongoose.Schema({
  branding: {
    siteName: { type: String, default: 'TriCore Events' },
    tagline: { type: String, default: '' },
    logo: {
      url: { type: String, default: '' },
      altText: { type: String, default: 'TriCore Events' },
    },
    favicon: { type: String, default: '' },
  },
  theme: {
    colors: {
      primary: { type: String, default: '#C8A961' },
      accent: { type: String, default: '#D4AF37' },
      background: { type: String, default: '#0A0A0A' },
      surface: { type: String, default: '#141414' },
      surfaceAlt: { type: String, default: '#1A1A1A' },
      text: { type: String, default: '#F5F5F5' },
      textMuted: { type: String, default: '#9CA3AF' },
      border: { type: String, default: '#262626' },
    },
    fonts: {
      heading: { type: String, default: 'Space Grotesk' },
      body: { type: String, default: 'Space Grotesk' },
    },
  },
  navigation: {
    links: [linkSchema],
    ctaButton: {
      label: { type: String, default: 'Contact Us' },
      href: { type: String, default: '/contact' },
      enabled: { type: Boolean, default: true },
    },
  },
  footer: {
    columns: [{
      title: String,
      links: [{ label: String, href: String }],
    }],
    socialLinks: [{
      platform: { type: String, enum: ['instagram', 'linkedin', 'twitter', 'whatsapp'] },
      url: String,
    }],
    bottomText: { type: String, default: '© 2026 TriCore Events. All rights reserved.' },
  },
  contact: {
    email: String,
    phone: String,
    whatsapp: String,
    address: String,
  },
}, { timestamps: true });

export default mongoose.model('SiteSettings', siteSettingsSchema);
```

- [ ] **Step 2: Create server/src/models/PageContent.js**

```js
import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'hero', 'service-pillars', 'trust-partners', 'featured-events',
      'testimonials', 'final-cta', 'content-block', 'team',
      'contact-form', 'faq', 'stats-grid',
    ],
  },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: true });

const pageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  sections: [sectionSchema],
}, { timestamps: true });

export default mongoose.model('PageContent', pageContentSchema);
```

- [ ] **Step 3: Commit**

```bash
git add server/src/models/SiteSettings.js server/src/models/PageContent.js
git commit -m "feat: add SiteSettings and PageContent models"
```

---

### Task 2.1.2: Event, SportItem, and Testimonial models

**Files:**
- Create: `server/src/models/Event.js`
- Create: `server/src/models/SportItem.js`
- Create: `server/src/models/Testimonial.js`

- [ ] **Step 1: Create server/src/models/Event.js**

```js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  tagline: String,
  description: String,
  coverImage: String,
  category: {
    type: String,
    enum: ['sports', 'corporate', 'community'],
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived', 'cancelled'],
    default: 'draft',
  },
  dates: {
    start: { type: Date, required: true },
    end: Date,
    registrationDeadline: Date,
  },
  venue: {
    name: String,
    address: String,
    city: String,
    mapUrl: String,
  },
  registration: {
    enabled: { type: Boolean, default: true },
    maxParticipants: Number,
    currentCount: { type: Number, default: 0 },
    requiresApproval: { type: Boolean, default: false },
  },
  schedule: [{
    time: String,
    activity: String,
    description: String,
  }],
  rules: [String],
  prizes: [{
    position: String,
    prize: String,
    amount: Number,
  }],
  sponsors: [{
    name: String,
    logo: String,
    url: String,
    tier: { type: String, enum: ['title', 'gold', 'silver', 'bronze'] },
  }],
  contacts: [{
    name: String,
    role: String,
    phone: String,
    email: String,
  }],
  featured: { type: Boolean, default: false },
}, { timestamps: true });

eventSchema.index({ status: 1, 'dates.start': -1 });
eventSchema.index({ category: 1 });

export default mongoose.model('Event', eventSchema);
```

- [ ] **Step 2: Create server/src/models/SportItem.js**

```js
import mongoose from 'mongoose';

const sportItemSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  name: { type: String, required: true },
  description: String,
  category: String,
  type: {
    type: String,
    enum: ['individual', 'team', 'group'],
    required: true,
  },
  fee: { type: Number, default: 0 },
  maxParticipants: Number,
  currentCount: { type: Number, default: 0 },
  teamSize: {
    min: Number,
    max: Number,
  },
  ageRestriction: {
    min: Number,
    max: Number,
  },
  gender: {
    type: String,
    enum: ['any', 'male', 'female'],
    default: 'any',
  },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('SportItem', sportItemSchema);
```

- [ ] **Step 3: Create server/src/models/Testimonial.js**

```js
import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  company: String,
  content: { type: String, required: true },
  avatar: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
```

- [ ] **Step 4: Commit**

```bash
git add server/src/models/Event.js server/src/models/SportItem.js server/src/models/Testimonial.js
git commit -m "feat: add Event, SportItem, and Testimonial models"
```

---

### Task 2.1.3: User, PublicUser, Registration, and MediaAsset models

**Files:**
- Create: `server/src/models/User.js`
- Create: `server/src/models/PublicUser.js`
- Create: `server/src/models/Registration.js`
- Create: `server/src/models/MediaAsset.js`

- [ ] **Step 1: Create server/src/models/User.js**

```js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ['admin', 'event_manager', 'sports_coordinator', 'registration_manager', 'finance', 'content_editor'],
    default: 'content_editor',
  },
  active: { type: Boolean, default: true },
  lastLogin: Date,
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
```

- [ ] **Step 2: Create server/src/models/PublicUser.js**

```js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const publicUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  phone: String,
  googleId: String,
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

publicUserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

publicUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('PublicUser', publicUserSchema);
```

- [ ] **Step 3: Create server/src/models/Registration.js**

```js
import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sportItem: { type: mongoose.Schema.Types.ObjectId, ref: 'SportItem', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'PublicUser', required: true },
  type: {
    type: String,
    enum: ['individual', 'team', 'group'],
    required: true,
  },
  teamName: String,
  teamMembers: [{
    name: { type: String, required: true },
    email: String,
    phone: String,
    role: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'waitlisted', 'cancelled'],
    default: 'pending',
  },
  payment: {
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date,
  },
  notes: String,
}, { timestamps: true });

registrationSchema.index({ event: 1, user: 1 });
registrationSchema.index({ sportItem: 1 });
registrationSchema.index({ 'payment.status': 1 });

export default mongoose.model('Registration', registrationSchema);
```

- [ ] **Step 4: Create server/src/models/MediaAsset.js**

```js
import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: String,
  size: Number,
  width: Number,
  height: Number,
  alt: { type: String, default: '' },
  folder: { type: String, default: 'general' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('MediaAsset', mediaAssetSchema);
```

- [ ] **Step 5: Install bcrypt**

```bash
cd server && npm install bcrypt && cd ..
```

- [ ] **Step 6: Commit**

```bash
git add server/src/models/ server/package.json
git commit -m "feat: add User, PublicUser, Registration, and MediaAsset models"
```

---

## Story 2.2: Seed Data

### Task 2.2.1: Database seed script

**Files:**
- Create: `server/src/utils/seedDefaults.js`
- Modify: `server/package.json`

- [ ] **Step 1: Create server/src/utils/seedDefaults.js**

```js
import mongoose from 'mongoose';
import config from '../config/env.js';
import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import User from '../models/User.js';

const seedSiteSettings = async () => {
  const exists = await SiteSettings.findOne();
  if (exists) return console.log('SiteSettings already seeded');

  await SiteSettings.create({
    branding: {
      siteName: 'TriCore Events',
      tagline: 'Where Every Event Becomes an Experience',
    },
    navigation: {
      links: [
        { label: 'Home', href: '/', order: 0 },
        { label: 'About', href: '/about', order: 1 },
        { label: 'Events', href: '/events', order: 2 },
        { label: 'Corporate', href: '/corporate', order: 3 },
        { label: 'Contact', href: '/contact', order: 4 },
      ],
    },
    footer: {
      columns: [
        {
          title: 'Company',
          links: [
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
          ],
        },
        {
          title: 'Events',
          links: [
            { label: 'Upcoming', href: '/events' },
            { label: 'Corporate', href: '/corporate' },
          ],
        },
      ],
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/tricore' },
        { platform: 'linkedin', url: 'https://linkedin.com/company/tricore' },
      ],
    },
    contact: {
      email: 'info@tricore.in',
      phone: '+91 98765 43210',
    },
  });
  console.log('SiteSettings seeded');
};

const seedPages = async () => {
  const pages = [
    {
      slug: 'home',
      title: 'Home',
      sections: [
        { type: 'hero', order: 0, enabled: true, data: { headline: 'Where Every Event Becomes an Experience', subheadline: 'Sports tournaments. Corporate events. Community competitions.', ctaLabel: 'Explore Events', ctaHref: '/events' } },
        { type: 'service-pillars', order: 1, enabled: true, data: { title: 'What We Do', pillars: [{ icon: 'trophy', title: 'Sports Tournaments', description: 'Professional-grade sporting events' }, { icon: 'building', title: 'Corporate Events', description: 'Team building and corporate functions' }, { icon: 'users', title: 'Community Competitions', description: 'Local engagement and community events' }] } },
        { type: 'featured-events', order: 2, enabled: true, data: { title: 'Upcoming Events' } },
        { type: 'testimonials', order: 3, enabled: true, data: { title: 'What People Say' } },
        { type: 'final-cta', order: 4, enabled: true, data: { title: 'Ready to Create Something Extraordinary?', ctaLabel: 'Get in Touch', ctaHref: '/contact' } },
      ],
    },
    { slug: 'about', title: 'About Us', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'About TriCore Events', subheadline: 'The team behind unforgettable experiences' } }, { type: 'content-block', order: 1, enabled: true, data: { title: 'Our Story', body: 'TriCore Events was founded with a vision to transform how events are organized and experienced.' } }, { type: 'team', order: 2, enabled: true, data: { title: 'Our Team', members: [] } }] },
    { slug: 'corporate', title: 'Corporate Events', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'Corporate Events', subheadline: 'Elevate your team with world-class events' } }, { type: 'content-block', order: 1, enabled: true, data: { title: 'Why TriCore for Corporate', body: 'We specialize in creating meaningful corporate experiences.' } }] },
    { slug: 'contact', title: 'Contact', sections: [{ type: 'hero', order: 0, enabled: true, data: { headline: 'Contact Us' } }, { type: 'contact-form', order: 1, enabled: true, data: {} }] },
  ];

  for (const page of pages) {
    const exists = await PageContent.findOne({ slug: page.slug });
    if (!exists) await PageContent.create(page);
  }
  console.log('Pages seeded');
};

const seedAdminUser = async () => {
  const exists = await User.findOne({ email: 'admin@tricore.in' });
  if (exists) return console.log('Admin user already exists');

  await User.create({
    name: 'Admin',
    email: 'admin@tricore.in',
    password: 'Admin@123',
    role: 'admin',
  });
  console.log('Admin user seeded (admin@tricore.in / Admin@123)');
};

const seed = async () => {
  await mongoose.connect(config.mongoUri);
  console.log('Connected to MongoDB for seeding');

  await seedSiteSettings();
  await seedPages();
  await seedAdminUser();

  await mongoose.disconnect();
  console.log('Seeding complete');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
```

- [ ] **Step 2: Add seed script to server/package.json**

Add to scripts:
```json
"seed": "node src/utils/seedDefaults.js"
```

- [ ] **Step 3: Run seed**

```bash
cd server && npm run seed && cd ..
# Expected: "SiteSettings seeded", "Pages seeded", "Admin user seeded"
```

- [ ] **Step 4: Commit**

```bash
git add server/src/utils/seedDefaults.js server/package.json
git commit -m "feat: add database seed script with defaults"
```

---

# Epic 3: Authentication System

## Story 3.1: Admin Authentication

### Task 3.1.1: JWT auth middleware and admin auth routes

**Files:**
- Create: `server/src/middleware/auth.js`
- Create: `server/src/middleware/roleGuard.js`
- Create: `server/src/controllers/authController.js`
- Create: `server/src/validators/authSchemas.js`
- Create: `server/src/routes/authRoutes.js`

- [ ] **Step 1: Install jsonwebtoken**

```bash
cd server && npm install jsonwebtoken && cd ..
```

- [ ] **Step 2: Create server/src/middleware/auth.js**

```js
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: { message: 'No token provided' } });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user || !user.active) return res.status(401).json({ error: { message: 'Invalid token' } });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: { message: 'Token expired or invalid' } });
  }
};

export default auth;
```

- [ ] **Step 3: Create server/src/middleware/roleGuard.js**

```js
const roleGuard = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: { message: 'Not authenticated' } });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: { message: 'Insufficient permissions' } });
  }
  next();
};

export default roleGuard;
```

- [ ] **Step 4: Create server/src/validators/authSchemas.js**

```js
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'event_manager', 'sports_coordinator', 'registration_manager', 'finance', 'content_editor']).optional(),
});
```

- [ ] **Step 5: Create server/src/controllers/authController.js**

```js
import jwt from 'jsonwebtoken';
import config from '../config/env.js';
import User from '../models/User.js';

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }
    if (!user.active) {
      return res.status(403).json({ error: { message: 'Account is disabled' } });
    }
    user.lastLogin = new Date();
    await user.save();
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } });
};
```

- [ ] **Step 6: Create server/src/routes/authRoutes.js**

```js
import { Router } from 'express';
import { login, getMe } from '../controllers/authController.js';
import { loginSchema } from '../validators/authSchemas.js';
import validate from '../middleware/validate.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/login', validate(loginSchema), login);
router.get('/me', auth, getMe);

export default router;
```

- [ ] **Step 7: Wire auth routes into server.js**

```js
import authRoutes from './routes/authRoutes.js';

app.use('/api/auth', authRoutes);
```

- [ ] **Step 8: Commit**

```bash
git add server/src/middleware/auth.js server/src/middleware/roleGuard.js server/src/controllers/authController.js server/src/validators/authSchemas.js server/src/routes/authRoutes.js server/src/server.js server/package.json
git commit -m "feat: add admin JWT authentication with role guard"
```

---

## Story 3.2: Public User Authentication

### Task 3.2.1: Public user auth with Google OAuth

**Files:**
- Create: `server/src/controllers/publicAuthController.js`
- Create: `server/src/routes/publicAuthRoutes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Install google-auth-library**

```bash
cd server && npm install google-auth-library && cd ..
```

- [ ] **Step 2: Create server/src/controllers/publicAuthController.js**

```js
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import config from '../config/env.js';
import PublicUser from '../models/PublicUser.js';

const googleClient = new OAuth2Client(config.googleClientId);

const generateToken = (user) =>
  jwt.sign({ id: user._id, type: 'public' }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.validatedBody;
    const existing = await PublicUser.findOne({ email });
    if (existing) return res.status(409).json({ error: { message: 'Email already registered' } });
    const user = await PublicUser.create({ name, email, password, phone });
    res.status(201).json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedBody;
    const user = await PublicUser.findOne({ email }).select('+password');
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: { message: 'Invalid email or password' } });
    }
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) { next(err); }
};

export const googleLogin = async (req, res, next) => {
  try {
    const { credential } = req.body;
    const ticket = await googleClient.verifyIdToken({ idToken: credential, audience: config.googleClientId });
    const { email, name, picture, sub } = ticket.getPayload();
    let user = await PublicUser.findOne({ $or: [{ googleId: sub }, { email }] });
    if (!user) {
      user = await PublicUser.create({ name, email, googleId: sub, avatar: picture, verified: true });
    } else if (!user.googleId) {
      user.googleId = sub;
      user.avatar = user.avatar || picture;
      user.verified = true;
      await user.save();
    }
    res.json({ token: generateToken(user), user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
  } catch (err) { next(err); }
};

export const getMe = async (req, res) => {
  const user = await PublicUser.findById(req.user._id);
  res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, avatar: user.avatar } });
};
```

- [ ] **Step 3: Create server/src/routes/publicAuthRoutes.js**

```js
import { Router } from 'express';
import { register, login, googleLogin, getMe } from '../controllers/publicAuthController.js';
import validate from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/google', googleLogin);

export default router;
```

- [ ] **Step 4: Wire routes into server.js**

```js
import publicAuthRoutes from './routes/publicAuthRoutes.js';

app.use('/api/public/auth', publicAuthRoutes);
```

- [ ] **Step 5: Commit**

```bash
git add server/src/controllers/publicAuthController.js server/src/routes/publicAuthRoutes.js server/src/server.js server/package.json
git commit -m "feat: add public user auth with email and Google OAuth"
```

---

# Epic 4: Backend API — Content & Settings

## Story 4.1: Public Content Endpoints

### Task 4.1.1: Public content and settings API

**Files:**
- Create: `server/src/controllers/publicController.js`
- Create: `server/src/routes/publicRoutes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create server/src/controllers/publicController.js**

```js
import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Event from '../models/Event.js';
import Testimonial from '../models/Testimonial.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json(settings);
  } catch (err) { next(err); }
};

export const getPage = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    const sections = page.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order);
    res.json({ ...page.toObject(), sections });
  } catch (err) { next(err); }
};

export const getEvents = async (req, res, next) => {
  try {
    const { category, page = 1, limit = 12 } = req.query;
    const filter = { status: 'published' };
    if (category) filter.category = category;
    const events = await Event.find(filter)
      .sort({ 'dates.start': 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug, status: 'published' });
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json(event);
  } catch (err) { next(err); }
};

export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) { next(err); }
};
```

- [ ] **Step 2: Create server/src/routes/publicRoutes.js**

```js
import { Router } from 'express';
import { getSettings, getPage, getEvents, getEvent, getTestimonials } from '../controllers/publicController.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/pages/:slug', getPage);
router.get('/events', getEvents);
router.get('/events/:slug', getEvent);
router.get('/testimonials', getTestimonials);

export default router;
```

- [ ] **Step 3: Wire into server.js**

```js
import publicRoutes from './routes/publicRoutes.js';

app.use('/api/content', publicRoutes);
```

- [ ] **Step 4: Commit**

```bash
git add server/src/controllers/publicController.js server/src/routes/publicRoutes.js server/src/server.js
git commit -m "feat: add public content API endpoints"
```

---

## Story 4.2: Admin CMS Endpoints

### Task 4.2.1: Admin content and settings CRUD

**Files:**
- Create: `server/src/controllers/adminContentController.js`
- Create: `server/src/controllers/siteSettingsController.js`
- Create: `server/src/routes/adminRoutes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Create server/src/controllers/adminContentController.js**

```js
import PageContent from '../models/PageContent.js';

export const getPages = async (req, res, next) => {
  try {
    const pages = await PageContent.find().select('slug title updatedAt');
    res.json(pages);
  } catch (err) { next(err); }
};

export const getPage = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    res.json(page);
  } catch (err) { next(err); }
};

export const updateSection = async (req, res, next) => {
  try {
    const { slug, sectionId } = req.params;
    const page = await PageContent.findOne({ slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    const section = page.sections.id(sectionId);
    if (!section) return res.status(404).json({ error: { message: 'Section not found' } });
    Object.assign(section, req.body);
    await page.save();
    res.json(section);
  } catch (err) { next(err); }
};

export const addSection = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    page.sections.push(req.body);
    await page.save();
    res.status(201).json(page.sections[page.sections.length - 1]);
  } catch (err) { next(err); }
};

export const deleteSection = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    page.sections.pull({ _id: req.params.sectionId });
    await page.save();
    res.json({ message: 'Section deleted' });
  } catch (err) { next(err); }
};

export const reorderSections = async (req, res, next) => {
  try {
    const page = await PageContent.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ error: { message: 'Page not found' } });
    const { order } = req.body; // Array of { id, order }
    for (const item of order) {
      const section = page.sections.id(item.id);
      if (section) section.order = item.order;
    }
    await page.save();
    res.json(page.sections.sort((a, b) => a.order - b.order));
  } catch (err) { next(err); }
};
```

- [ ] **Step 2: Create server/src/controllers/siteSettingsController.js**

```js
import SiteSettings from '../models/SiteSettings.js';

export const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json(settings);
  } catch (err) { next(err); }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = new SiteSettings();
    Object.assign(settings, req.body);
    await settings.save();
    res.json(settings);
  } catch (err) { next(err); }
};
```

- [ ] **Step 3: Create server/src/routes/adminRoutes.js**

```js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import { getPages, getPage, updateSection, addSection, deleteSection, reorderSections } from '../controllers/adminContentController.js';
import { getSettings, updateSettings } from '../controllers/siteSettingsController.js';

const router = Router();

router.use(auth);

// Content
router.get('/pages', getPages);
router.get('/pages/:slug', getPage);
router.post('/pages/:slug/sections', roleGuard('admin', 'content_editor'), addSection);
router.put('/pages/:slug/sections/:sectionId', roleGuard('admin', 'content_editor'), updateSection);
router.delete('/pages/:slug/sections/:sectionId', roleGuard('admin', 'content_editor'), deleteSection);
router.put('/pages/:slug/sections/reorder', roleGuard('admin', 'content_editor'), reorderSections);

// Settings
router.get('/settings', getSettings);
router.put('/settings', roleGuard('admin'), updateSettings);

export default router;
```

- [ ] **Step 4: Wire into server.js**

```js
import adminRoutes from './routes/adminRoutes.js';

app.use('/api/admin', adminRoutes);
```

- [ ] **Step 5: Commit**

```bash
git add server/src/controllers/adminContentController.js server/src/controllers/siteSettingsController.js server/src/routes/adminRoutes.js server/src/server.js
git commit -m "feat: add admin CMS and site settings CRUD endpoints"
```

---

## Story 4.3: Media Upload

### Task 4.3.1: Image upload with Sharp processing

**Files:**
- Create: `server/src/controllers/uploadController.js`
- Create: `server/src/services/uploadService.js`
- Create: `server/src/routes/uploadRoutes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Install multer and sharp**

```bash
cd server && npm install multer sharp && cd ..
```

- [ ] **Step 2: Create server/src/services/uploadService.js**

```js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import config from '../config/env.js';

const ensureDir = async (dir) => {
  await fs.mkdir(dir, { recursive: true });
};

export const processAndSaveImage = async (file) => {
  const uploadDir = path.resolve(config.uploadDir);
  await ensureDir(uploadDir);

  const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
  const filepath = path.join(uploadDir, filename);

  const metadata = await sharp(file.buffer)
    .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 85 })
    .toFile(filepath);

  return {
    filename,
    originalName: file.originalname,
    url: `/uploads/${filename}`,
    mimeType: 'image/jpeg',
    size: metadata.size,
    width: metadata.width,
    height: metadata.height,
  };
};
```

- [ ] **Step 3: Create server/src/controllers/uploadController.js**

```js
import multer from 'multer';
import { processAndSaveImage } from '../services/uploadService.js';
import MediaAsset from '../models/MediaAsset.js';
import config from '../config/env.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
});

export const uploadMiddleware = upload.single('image');

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: { message: 'No file provided' } });
    const imageData = await processAndSaveImage(req.file);
    const asset = await MediaAsset.create({
      ...imageData,
      alt: req.body.alt || '',
      folder: req.body.folder || 'general',
      uploadedBy: req.user._id,
    });
    res.status(201).json(asset);
  } catch (err) { next(err); }
};

export const getAssets = async (req, res, next) => {
  try {
    const { folder, page = 1, limit = 20 } = req.query;
    const filter = folder ? { folder } : {};
    const assets = await MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await MediaAsset.countDocuments(filter);
    res.json({ assets, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await MediaAsset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: { message: 'Asset not found' } });
    res.json({ message: 'Asset deleted' });
  } catch (err) { next(err); }
};
```

- [ ] **Step 4: Create server/src/routes/uploadRoutes.js**

```js
import { Router } from 'express';
import auth from '../middleware/auth.js';
import { uploadMiddleware, uploadImage, getAssets, deleteAsset } from '../controllers/uploadController.js';

const router = Router();

router.use(auth);
router.post('/', uploadMiddleware, uploadImage);
router.get('/', getAssets);
router.delete('/:id', deleteAsset);

export default router;
```

- [ ] **Step 5: Serve static uploads and wire route in server.js**

```js
import express from 'express';
import uploadRoutes from './routes/uploadRoutes.js';

app.use('/uploads', express.static('uploads'));
app.use('/api/uploads', uploadRoutes);
```

- [ ] **Step 6: Commit**

```bash
git add server/src/controllers/uploadController.js server/src/services/uploadService.js server/src/routes/uploadRoutes.js server/src/server.js server/package.json
git commit -m "feat: add image upload with Sharp processing and media library"
```

---

# Epic 5: Backend API — Events & Registration

## Story 5.1: Events CRUD

### Task 5.1.1: Events controller and routes

**Files:**
- Create: `server/src/controllers/eventsController.js`
- Create: `server/src/controllers/sportItemController.js`
- Modify: `server/src/routes/adminRoutes.js`

- [ ] **Step 1: Create server/src/controllers/eventsController.js**

```js
import Event from '../models/Event.js';

export const getEvents = async (req, res, next) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json(event);
  } catch (err) { next(err); }
};

export const createEvent = async (req, res, next) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) { next(err); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json(event);
  } catch (err) { next(err); }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    res.json({ message: 'Event deleted' });
  } catch (err) { next(err); }
};
```

- [ ] **Step 2: Create server/src/controllers/sportItemController.js**

```js
import SportItem from '../models/SportItem.js';

export const getItems = async (req, res, next) => {
  try {
    const items = await SportItem.find({ event: req.params.eventId }).sort({ order: 1 });
    res.json(items);
  } catch (err) { next(err); }
};

export const createItem = async (req, res, next) => {
  try {
    const item = await SportItem.create({ ...req.body, event: req.params.eventId });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await SportItem.findByIdAndUpdate(req.params.itemId, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ error: { message: 'Sport item not found' } });
    res.json(item);
  } catch (err) { next(err); }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await SportItem.findByIdAndDelete(req.params.itemId);
    if (!item) return res.status(404).json({ error: { message: 'Sport item not found' } });
    res.json({ message: 'Sport item deleted' });
  } catch (err) { next(err); }
};
```

- [ ] **Step 3: Add event and sport item routes to adminRoutes.js**

```js
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventsController.js';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/sportItemController.js';

// Events
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/events', roleGuard('admin', 'event_manager'), createEvent);
router.put('/events/:id', roleGuard('admin', 'event_manager'), updateEvent);
router.delete('/events/:id', roleGuard('admin'), deleteEvent);

// Sport Items
router.get('/events/:eventId/items', getItems);
router.post('/events/:eventId/items', roleGuard('admin', 'event_manager', 'sports_coordinator'), createItem);
router.put('/events/:eventId/items/:itemId', roleGuard('admin', 'event_manager', 'sports_coordinator'), updateItem);
router.delete('/events/:eventId/items/:itemId', roleGuard('admin', 'event_manager'), deleteItem);
```

- [ ] **Step 4: Commit**

```bash
git add server/src/controllers/eventsController.js server/src/controllers/sportItemController.js server/src/routes/adminRoutes.js
git commit -m "feat: add events and sport items CRUD endpoints"
```

---

## Story 5.2: Registration & Payment

### Task 5.2.1: Registration controller and Razorpay payment

**Files:**
- Create: `server/src/controllers/registrationController.js`
- Create: `server/src/controllers/paymentController.js`
- Create: `server/src/services/paymentService.js`
- Create: `server/src/routes/registrationRoutes.js`
- Modify: `server/src/server.js`

- [ ] **Step 1: Install razorpay**

```bash
cd server && npm install razorpay && cd ..
```

- [ ] **Step 2: Create server/src/services/paymentService.js**

```js
import Razorpay from 'razorpay';
import config from '../config/env.js';

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
});

export const createOrder = async (amount, registrationId) => {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency: 'INR',
    receipt: `reg_${registrationId}`,
  });
  return order;
};

export const verifyPayment = (orderId, paymentId, signature) => {
  const crypto = await import('crypto');
  const generated = crypto.createHmac('sha256', config.razorpay.keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return generated === signature;
};
```

- [ ] **Step 3: Create server/src/controllers/registrationController.js**

```js
import Registration from '../models/Registration.js';
import SportItem from '../models/SportItem.js';
import Event from '../models/Event.js';

export const createRegistration = async (req, res, next) => {
  try {
    const { sportItemId, type, teamName, teamMembers, notes } = req.body;
    const sportItem = await SportItem.findById(sportItemId).populate('event');
    if (!sportItem) return res.status(404).json({ error: { message: 'Sport item not found' } });
    if (!sportItem.enabled) return res.status(400).json({ error: { message: 'Registration closed for this item' } });
    if (sportItem.maxParticipants && sportItem.currentCount >= sportItem.maxParticipants) {
      return res.status(400).json({ error: { message: 'This item is full' } });
    }

    const registration = await Registration.create({
      event: sportItem.event._id,
      sportItem: sportItemId,
      user: req.user._id,
      type,
      teamName,
      teamMembers,
      notes,
      payment: { amount: sportItem.fee, status: sportItem.fee === 0 ? 'completed' : 'pending' },
      status: sportItem.fee === 0 ? 'approved' : 'pending',
    });

    sportItem.currentCount += 1;
    await sportItem.save();

    res.status(201).json(registration);
  } catch (err) { next(err); }
};

export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ user: req.user._id })
      .populate('event', 'title slug dates coverImage')
      .populate('sportItem', 'name type fee')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) { next(err); }
};

export const getRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('event')
      .populate('sportItem')
      .populate('user', 'name email phone');
    if (!registration) return res.status(404).json({ error: { message: 'Registration not found' } });
    res.json(registration);
  } catch (err) { next(err); }
};
```

- [ ] **Step 4: Create server/src/controllers/paymentController.js**

```js
import { createOrder, verifyPayment } from '../services/paymentService.js';
import Registration from '../models/Registration.js';

export const initiatePayment = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.registrationId);
    if (!registration) return res.status(404).json({ error: { message: 'Registration not found' } });
    if (registration.payment.status === 'completed') {
      return res.status(400).json({ error: { message: 'Already paid' } });
    }
    const order = await createOrder(registration.payment.amount, registration._id);
    registration.payment.razorpayOrderId = order.id;
    await registration.save();
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency });
  } catch (err) { next(err); }
};

export const confirmPayment = async (req, res, next) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    const isValid = verifyPayment(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) return res.status(400).json({ error: { message: 'Payment verification failed' } });
    const registration = await Registration.findOne({ 'payment.razorpayOrderId': razorpayOrderId });
    if (!registration) return res.status(404).json({ error: { message: 'Registration not found' } });
    registration.payment.status = 'completed';
    registration.payment.razorpayPaymentId = razorpayPaymentId;
    registration.payment.paidAt = new Date();
    registration.status = 'approved';
    await registration.save();
    res.json({ message: 'Payment confirmed', registration });
  } catch (err) { next(err); }
};
```

- [ ] **Step 5: Create server/src/routes/registrationRoutes.js**

```js
import { Router } from 'express';
import { createRegistration, getMyRegistrations, getRegistration } from '../controllers/registrationController.js';
import { initiatePayment, confirmPayment } from '../controllers/paymentController.js';

const router = Router();

router.post('/', createRegistration);
router.get('/my', getMyRegistrations);
router.get('/:id', getRegistration);
router.post('/:registrationId/pay', initiatePayment);
router.post('/payment/confirm', confirmPayment);

export default router;
```

- [ ] **Step 6: Wire into server.js (with public user auth)**

```js
import registrationRoutes from './routes/registrationRoutes.js';

// Public user auth middleware needed here
app.use('/api/registrations', publicUserAuth, registrationRoutes);
```

- [ ] **Step 7: Commit**

```bash
git add server/src/controllers/registrationController.js server/src/controllers/paymentController.js server/src/services/paymentService.js server/src/routes/registrationRoutes.js server/src/server.js server/package.json
git commit -m "feat: add registration and Razorpay payment endpoints"
```

---

## Story 5.3: Admin Registration Management

### Task 5.3.1: Admin registration and testimonials controllers

**Files:**
- Create: `server/src/controllers/testimonialsController.js`
- Modify: `server/src/routes/adminRoutes.js`

- [ ] **Step 1: Create server/src/controllers/testimonialsController.js**

```js
import Testimonial from '../models/Testimonial.js';

export const getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json(testimonial);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ error: { message: 'Not found' } });
    res.json(testimonial);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    await Testimonial.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
```

- [ ] **Step 2: Add admin registration routes to adminRoutes.js**

```js
import Registration from '../models/Registration.js';
import { getAll, create, update, remove } from '../controllers/testimonialsController.js';

// Admin registrations
router.get('/registrations', roleGuard('admin', 'registration_manager'), async (req, res, next) => {
  try {
    const { event, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (event) filter.event = event;
    if (status) filter.status = status;
    const registrations = await Registration.find(filter)
      .populate('event', 'title')
      .populate('sportItem', 'name')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Registration.countDocuments(filter);
    res.json({ registrations, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.patch('/registrations/:id/status', roleGuard('admin', 'registration_manager'), async (req, res, next) => {
  try {
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!registration) return res.status(404).json({ error: { message: 'Not found' } });
    res.json(registration);
  } catch (err) { next(err); }
});

// Testimonials
router.get('/testimonials', getAll);
router.post('/testimonials', roleGuard('admin', 'content_editor'), create);
router.put('/testimonials/:id', roleGuard('admin', 'content_editor'), update);
router.delete('/testimonials/:id', roleGuard('admin'), remove);
```

- [ ] **Step 3: Commit**

```bash
git add server/src/controllers/testimonialsController.js server/src/routes/adminRoutes.js
git commit -m "feat: add admin registration management and testimonials CRUD"
```

---

# Epic 6: Frontend Foundation

> **Epics 6-11** cover the React frontend. Due to the size of the full plan, these epics are described at Story/Task level with key file paths. Each task follows the same step pattern: create file, implement, verify, commit.

## Story 6.1: Design System UI Components

### Task 6.1.1: Core UI primitives
**Files:** Create `client/src/components/ui/Button.jsx`, `Card.jsx`, `Badge.jsx`, `Input.jsx`, `Textarea.jsx`, `Modal.jsx`, `Skeleton.jsx`

### Task 6.1.2: ImageUpload and SectionWrapper
**Files:** Create `client/src/components/ui/ImageUpload.jsx`, `SectionWrapper.jsx`

## Story 6.2: Layout Components

### Task 6.2.1: PublicLayout with Navbar and Footer
**Files:** Create `client/src/components/layout/PublicLayout.jsx`, `Navbar.jsx`, `Footer.jsx`, `MobileMenu.jsx`

### Task 6.2.2: AdminLayout with Sidebar
**Files:** Create `client/src/components/layout/AdminLayout.jsx`

## Story 6.3: Context Providers and API Layer

### Task 6.3.1: Axios client and API wrappers
**Files:** Create `client/src/api/axiosClient.js`, `contentApi.js`, `eventsApi.js`, `authApi.js`, `adminContentApi.js`, `uploadApi.js`, `registrationApi.js`, `paymentApi.js`

### Task 6.3.2: Auth, SiteSettings, and Theme contexts
**Files:** Create `client/src/context/AuthContext.jsx`, `SiteSettingsContext.jsx`, `ThemeProvider.jsx`

### Task 6.3.3: Custom hooks
**Files:** Create `client/src/hooks/usePageContent.js`, `useSiteSettings.js`, `useEvents.js`, `useAuth.js`, `useRegistration.js`, `usePayment.js`

---

# Epic 7: Public Website

## Story 7.1: Section Renderers

### Task 7.1.1: SectionRenderer and core sections
**Files:** Create `client/src/components/sections/SectionRenderer.jsx`, `HeroSection.jsx`, `ServicePillarsSection.jsx`, `TrustPartnersSection.jsx`, `FeaturedEventsSection.jsx`, `TestimonialsSection.jsx`, `FinalCtaSection.jsx`

### Task 7.1.2: Content sections
**Files:** Create `ContentBlockSection.jsx`, `TeamSection.jsx`, `ContactFormSection.jsx`, `FaqSection.jsx`, `StatsGridSection.jsx`

## Story 7.2: Public Pages

### Task 7.2.1: HomePage and AboutPage
**Files:** Create `client/src/pages/public/HomePage.jsx`, `AboutPage.jsx`

### Task 7.2.2: EventsPage and CorporateEventsPage
**Files:** Create `EventsPage.jsx`, `CorporateEventsPage.jsx`

### Task 7.2.3: ContactPage and NotFoundPage
**Files:** Create `ContactPage.jsx`, `NotFoundPage.jsx`

## Story 7.3: Routing

### Task 7.3.1: App router setup
**Files:** Create `client/src/App.jsx` with React Router, `client/src/utils/fallbackContent.js`, `client/src/constants/sectionDefaults.js`

---

# Epic 8: Event Discovery & Registration Flow

## Story 8.1: Event Detail Page

### Task 8.1.1: EventDetailPage with tabs (schedule, rules, prizes, sponsors)
**Files:** Create `client/src/pages/public/EventDetailPage.jsx`, `client/src/components/sections/SportItemCard.jsx`

## Story 8.2: Registration Flow

### Task 8.2.1: Registration form and auth gate
**Files:** Create `client/src/pages/public/RegisterPage.jsx`, `client/src/pages/public/AuthPage.jsx`, `client/src/components/sections/RegistrationForm.jsx`

### Task 8.2.2: Payment checkout with Razorpay
**Files:** Create `client/src/components/sections/PaymentCheckout.jsx`

## Story 8.3: User Dashboard

### Task 8.3.1: Participant dashboard with registration tracking
**Files:** Create `client/src/pages/public/DashboardPage.jsx`

---

# Epic 9: Admin Portal — Core

## Story 9.1: Admin Auth

### Task 9.1.1: Admin login page
**Files:** Create `client/src/pages/admin/AdminLoginPage.jsx`

## Story 9.2: Admin Dashboard

### Task 9.2.1: Stats cards, charts, recent activity
**Files:** Create `client/src/pages/admin/AdminDashboard.jsx`

## Story 9.3: CMS Page Editor

### Task 9.3.1: Page section manager with drag-and-drop
**Files:** Create `client/src/pages/admin/PageEditorPage.jsx`, `client/src/components/admin/PageSectionManager.jsx`, `client/src/components/admin/SectionEditor.jsx`

### Task 9.3.2: Section type editors (Hero, Pillars, Trust, etc.)
**Files:** Create `client/src/components/admin/editors/HeroEditor.jsx`, `ServicePillarsEditor.jsx`, `TrustPartnersEditor.jsx`, `FeaturedEventsEditor.jsx`, `TestimonialsEditor.jsx`, `FinalCtaEditor.jsx`, `ContentBlockEditor.jsx`, `TeamEditor.jsx`, `ContactFormEditor.jsx`, `FaqEditor.jsx`, `StatsGridEditor.jsx`

## Story 9.4: Site Settings

### Task 9.4.1: Branding, theme, navigation, footer editors
**Files:** Create `client/src/pages/admin/SiteSettingsPage.jsx`, `client/src/components/admin/SiteSettingsForm.jsx`, `NavEditor.jsx`, `FooterEditor.jsx`, `ThemeEditor.jsx`

---

# Epic 10: Admin Portal — Events & Registrations

## Story 10.1: Event Manager

### Task 10.1.1: Events list with filters and CRUD
**Files:** Create `client/src/pages/admin/EventsManagerPage.jsx`

### Task 10.1.2: Event editor with 6 tabs
**Files:** Create `client/src/pages/admin/EventEditorPage.jsx`

## Story 10.2: Sport Items Manager

### Task 10.2.1: Sport items CRUD within events
**Files:** Create `client/src/pages/admin/SportItemsManagerPage.jsx`

## Story 10.3: Registration Manager

### Task 10.3.1: Registration list, filters, approve/reject, export CSV
**Files:** Create `client/src/pages/admin/RegistrationsManagerPage.jsx`, `RegistrationDetailPage.jsx`

---

# Epic 11: Admin Portal — Expansion

## Story 11.1: Testimonials & Media

### Task 11.1.1: Testimonials manager
**Files:** Create `client/src/pages/admin/TestimonialsManagerPage.jsx`

### Task 11.1.2: Media library with upload
**Files:** Create `client/src/pages/admin/MediaLibraryPage.jsx`

## Story 11.2: CEO Dashboard & Calendar

### Task 11.2.1: Business owner analytics dashboard
**Files:** Create enhanced `AdminDashboard.jsx` with revenue charts, registration trends

### Task 11.2.2: Calendar view
**Files:** Create `client/src/pages/admin/CalendarPage.jsx`

## Story 11.3: Users, Notifications, Backup

### Task 11.3.1: Users & Roles management
**Files:** Create `client/src/pages/admin/UsersPage.jsx`

### Task 11.3.2: Notification settings (Email/SMS/WhatsApp config)
**Files:** Create `client/src/pages/admin/NotificationSettingsPage.jsx`

### Task 11.3.3: Payment tracking
**Files:** Create `client/src/pages/admin/PaymentsPage.jsx`

---

# Epic 12: Testing, Polish & Deployment

## Story 12.1: Testing

### Task 12.1.1: API endpoint tests
**Files:** Create `server/tests/` with test files for each route

### Task 12.1.2: Frontend component tests
**Files:** Create `client/src/__tests__/` with component test files

## Story 12.2: Deployment

### Task 12.2.1: Production build and deployment config
**Files:** Create `Dockerfile`, `docker-compose.yml`, `nginx.conf`, environment configs

### Task 12.2.2: Performance optimization
- Image lazy loading
- Route-level code splitting
- API response caching
- MongoDB index verification

---

## Summary

| Metric | Count |
|--------|-------|
| **Epics** | 12 |
| **Stories** | 34 |
| **Tasks** | 48 |
| **Estimated files** | 120+ |
| **Backend endpoints** | 35+ |
| **Frontend pages** | 20+ |
| **UI components** | 40+ |
