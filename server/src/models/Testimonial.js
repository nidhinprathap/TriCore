import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  company: String,
  content: { type: String, required: true },
  avatar: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  featured: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Testimonial', testimonialSchema);
