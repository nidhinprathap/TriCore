import Registration from '../models/Registration.js';
import SportItem from '../models/SportItem.js';
import Event from '../models/Event.js';
import { sendRegistrationConfirmation } from '../services/emailService.js';

export const createRegistration = async (req, res, next) => {
  try {
    const { sportItemId, type, teamName, teamMembers, notes } = req.validatedBody;
    const sportItem = await SportItem.findById(sportItemId);
    if (!sportItem) return res.status(404).json({ error: { message: 'Sport item not found' } });
    if (!sportItem.enabled) return res.status(400).json({ error: { message: 'Registration closed for this item' } });

    // Atomic increment with capacity check
    const updated = await SportItem.findOneAndUpdate(
      {
        _id: sportItemId,
        ...(sportItem.maxParticipants ? { currentCount: { $lt: sportItem.maxParticipants } } : {}),
      },
      { $inc: { currentCount: 1 } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ error: { message: 'This item is full' } });
    }

    const registration = await Registration.create({
      event: updated.event,
      sportItem: sportItemId,
      user: req.user._id,
      type,
      teamName,
      teamMembers,
      notes,
      payment: { amount: updated.fee, status: updated.fee === 0 ? 'completed' : 'pending' },
      status: updated.fee === 0 ? 'approved' : 'pending',
    });

    res.status(201).json(registration);

    // Send confirmation email (non-blocking)
    Event.findById(registration.event).then((event) => {
      if (event) sendRegistrationConfirmation(registration, event, updated, req.user).catch(() => {});
    }).catch(() => {});
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
    if (!registration.user._id.equals(req.user._id)) {
      return res.status(403).json({ error: { message: 'Not authorized' } });
    }
    res.json(registration);
  } catch (err) { next(err); }
};
