import Testimonial from '../models/Testimonial.js';
import { parsePagination } from '../utils/pagination.js';

export const getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = status ? { status } : {};
    const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Testimonial.countDocuments(filter);
    res.json({ testimonials, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const create = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.create(req.validatedBody);
    res.status(201).json(testimonial);
  } catch (err) { next(err); }
};

export const update = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.validatedBody, { new: true, runValidators: true });
    if (!testimonial) return res.status(404).json({ error: { message: 'Not found' } });
    res.json(testimonial);
  } catch (err) { next(err); }
};

export const remove = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) return res.status(404).json({ error: { message: 'Not found' } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
