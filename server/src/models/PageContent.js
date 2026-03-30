import mongoose from 'mongoose';

const sectionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: [
      'hero', 'service-pillars', 'trust-partners', 'featured-events',
      'testimonials', 'final-cta', 'content-block', 'team',
      'contact-form', 'faq', 'stats-grid',
    ],
  },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: true });

const pageContentSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  sections: [sectionSchema],
}, { timestamps: true });

export default mongoose.model('PageContent', pageContentSchema);
