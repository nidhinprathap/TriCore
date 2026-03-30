import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import corsOptions from './config/cors.js';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import publicAuth from './middleware/publicAuth.js';
import authRoutes from './routes/authRoutes.js';
import publicAuthRoutes from './routes/publicAuthRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import calendarRoutes from './routes/calendarRoutes.js';

const app = express();

app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Static uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../../uploads')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/public/auth', publicAuthRoutes);
app.use('/api/content', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/registrations', publicAuth, registrationRoutes);
app.use('/api/admin/calendar', calendarRoutes);

// Contact form endpoint
app.post('/api/contact', express.json(), (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: { message: 'Name, email, and message are required' } });
  }
  // TODO: Send email via nodemailer when SMTP is configured
  console.log('Contact form submission:', { name, email, message });
  res.json({ message: 'Message received. We will get back to you soon.' });
});

// Serve client build in production
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {
  // API 404 catch-all (dev only — in prod, unmatched routes serve the SPA)
  app.use('/api/*', (req, res) => {
    res.status(404).json({ error: { message: `Route ${req.originalUrl} not found` } });
  });
}

// Error handler (must be last)
app.use(errorHandler);

await connectDB();

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

export default app;
