import { Router } from 'express';
import { getSettings, getPage, getEvents, getEvent, getTestimonials } from '../controllers/publicController.js';
import SportItem from '../models/SportItem.js';
import Event from '../models/Event.js';

const router = Router();

router.get('/settings', getSettings);
router.get('/pages/:slug', getPage);
router.get('/events', getEvents);
router.get('/events/:slug', getEvent);
router.get('/events/:slug/items', async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) return res.status(404).json({ error: { message: 'Event not found' } });
    const items = await SportItem.find({ event: event._id, enabled: true }).sort({ order: 1 });
    res.json(items);
  } catch (err) { next(err); }
});
router.get('/testimonials', getTestimonials);

export default router;
