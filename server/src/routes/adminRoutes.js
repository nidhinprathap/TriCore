import { Router } from 'express';
import { z } from 'zod';
import auth from '../middleware/auth.js';
import roleGuard from '../middleware/roleGuard.js';
import validate from '../middleware/validate.js';
import { getPages, getPage, updateSection, addSection, deleteSection, reorderSections } from '../controllers/adminContentController.js';
import { getSettings, updateSettings } from '../controllers/siteSettingsController.js';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventsController.js';
import { getItems, createItem, updateItem, deleteItem } from '../controllers/sportItemController.js';
import { getAll, create, update, remove } from '../controllers/testimonialsController.js';
import { createEventSchema, updateEventSchema, statusUpdateSchema } from '../validators/eventSchemas.js';
import { updateSettingsSchema } from '../validators/settingsSchemas.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validators/testimonialSchemas.js';
import { createSportItemSchema, updateSportItemSchema } from '../validators/sportItemSchemas.js';
import Registration from '../models/Registration.js';
import User from '../models/User.js';
import { parsePagination } from '../utils/pagination.js';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'event_manager', 'sports_coordinator', 'registration_manager', 'finance', 'content_editor']),
});

const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  role: z.enum(['admin', 'event_manager', 'sports_coordinator', 'registration_manager', 'finance', 'content_editor']).optional(),
});

const toggleActiveSchema = z.object({
  active: z.boolean(),
});

const reorderSchema = z.object({
  order: z.array(z.object({ id: z.string(), order: z.number() })),
});

const sectionSchema = z.object({
  type: z.enum(['hero', 'service-pillars', 'trust-partners', 'featured-events', 'testimonials', 'final-cta', 'content-block', 'team', 'contact-form', 'faq', 'stats-grid']),
  data: z.any().optional(),
  enabled: z.boolean().optional(),
  order: z.number().optional(),
});

const sectionUpdateSchema = z.object({
  data: z.any().optional(),
  enabled: z.boolean().optional(),
  order: z.number().optional(),
}).partial();

const router = Router();

router.use(auth);

// Content
router.get('/pages', getPages);
router.get('/pages/:slug', getPage);
router.post('/pages/:slug/sections', roleGuard('admin', 'content_editor'), validate(sectionSchema), addSection);
router.put('/pages/:slug/sections/:sectionId', roleGuard('admin', 'content_editor'), validate(sectionUpdateSchema), updateSection);
router.delete('/pages/:slug/sections/:sectionId', roleGuard('admin', 'content_editor'), deleteSection);
router.put('/pages/:slug/reorder', roleGuard('admin', 'content_editor'), validate(reorderSchema), reorderSections);

// Settings
router.get('/settings', getSettings);
router.put('/settings', roleGuard('admin'), validate(updateSettingsSchema), updateSettings);

// Events
router.get('/events', getEvents);
router.get('/events/:id', getEvent);
router.post('/events', roleGuard('admin', 'event_manager'), validate(createEventSchema), createEvent);
router.put('/events/:id', roleGuard('admin', 'event_manager'), validate(updateEventSchema), updateEvent);
router.delete('/events/:id', roleGuard('admin'), deleteEvent);

// Sport Items
router.get('/events/:eventId/items', getItems);
router.post('/events/:eventId/items', roleGuard('admin', 'event_manager', 'sports_coordinator'), validate(createSportItemSchema), createItem);
router.put('/events/:eventId/items/:itemId', roleGuard('admin', 'event_manager', 'sports_coordinator'), validate(updateSportItemSchema), updateItem);
router.delete('/events/:eventId/items/:itemId', roleGuard('admin', 'event_manager'), deleteItem);

// Testimonials
router.get('/testimonials', getAll);
router.post('/testimonials', roleGuard('admin', 'content_editor'), validate(createTestimonialSchema), create);
router.put('/testimonials/:id', roleGuard('admin', 'content_editor'), validate(updateTestimonialSchema), update);
router.delete('/testimonials/:id', roleGuard('admin'), remove);

// Admin registrations
router.get('/registrations', roleGuard('admin', 'registration_manager'), async (req, res, next) => {
  try {
    const { event, status } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (event) filter.event = event;
    if (status) filter.status = status;
    const registrations = await Registration.find(filter)
      .populate('event', 'title')
      .populate('sportItem', 'name')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await Registration.countDocuments(filter);
    res.json({ registrations, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
});

router.patch('/registrations/:id/status', roleGuard('admin', 'registration_manager'), validate(statusUpdateSchema), async (req, res, next) => {
  try {
    const registration = await Registration.findByIdAndUpdate(req.params.id, { status: req.validatedBody.status }, { new: true, runValidators: true });
    if (!registration) return res.status(404).json({ error: { message: 'Not found' } });
    res.json(registration);
  } catch (err) { next(err); }
});

// CSV export for registrations
router.get('/registrations/export', roleGuard('admin', 'registration_manager'), async (req, res, next) => {
  try {
    const { event, status } = req.query;
    const filter = {};
    if (event) filter.event = event;
    if (status) filter.status = status;
    const registrations = await Registration.find(filter)
      .populate('event', 'title')
      .populate('sportItem', 'name type fee')
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });

    const header = 'Name,Email,Phone,Event,Activity,Type,Team Name,Status,Payment Status,Amount,Registered At\n';
    const rows = registrations.map((r) => [
      r.user?.name || '',
      r.user?.email || '',
      r.user?.phone || '',
      r.event?.title || '',
      r.sportItem?.name || '',
      r.type || '',
      r.teamName || '',
      r.status || '',
      r.payment?.status || '',
      r.payment?.amount || 0,
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','));

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=registrations.csv');
    res.send(header + rows.join('\n'));
  } catch (err) { next(err); }
});

// Users & Roles (admin only)
router.get('/users', roleGuard('admin'), async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { next(err); }
});

router.post('/users', roleGuard('admin'), validate(createUserSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validatedBody;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: { message: 'Email already exists' } });
    const user = await User.create({ name, email, password, role });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, active: user.active });
  } catch (err) { next(err); }
});

router.put('/users/:id', roleGuard('admin'), validate(updateUserSchema), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json(user);
  } catch (err) { next(err); }
});

router.patch('/users/:id/active', roleGuard('admin'), validate(toggleActiveSchema), async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { active: req.validatedBody.active }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    res.json(user);
  } catch (err) { next(err); }
});

export default router;
