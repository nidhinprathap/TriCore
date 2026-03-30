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
