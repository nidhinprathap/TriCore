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
