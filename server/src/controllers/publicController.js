import SiteSettings from '../models/SiteSettings.js';
import PageContent from '../models/PageContent.js';
import Event from '../models/Event.js';
import Testimonial from '../models/Testimonial.js';
import { parsePagination } from '../utils/pagination.js';

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
    const { category } = req.query;
    const { page, limit, skip } = parsePagination({ ...req.query, limit: req.query.limit || 12 });
    const filter = { status: 'published' };
    if (category) filter.category = category;
    const events = await Event.find(filter)
      .sort({ 'dates.start': 1 })
      .skip(skip)
      .limit(limit);
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
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
    const testimonials = await Testimonial.find({ status: 'approved' }).sort({ createdAt: -1 }).limit(50);
    res.json(testimonials);
  } catch (err) { next(err); }
};
