import SportItem from '../models/SportItem.js';

export const getItems = async (req, res, next) => {
  try {
    const items = await SportItem.find({ event: req.params.eventId }).sort({ order: 1 });
    res.json(items);
  } catch (err) { next(err); }
};

export const createItem = async (req, res, next) => {
  try {
    const item = await SportItem.create({ ...req.validatedBody, event: req.params.eventId });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await SportItem.findByIdAndUpdate(req.params.itemId, req.validatedBody, { new: true, runValidators: true });
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
