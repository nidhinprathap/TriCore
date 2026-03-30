import Event from '../models/Event.js';
import { parsePagination } from '../utils/pagination.js';

export const getEvents = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    const events = await Event.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Event.countDocuments(filter);
    res.json({ events, total, page, pages: Math.ceil(total / limit) });
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
    const event = await Event.create(req.validatedBody);
    res.status(201).json(event);
  } catch (err) { next(err); }
};

export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true, runValidators: true });
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
