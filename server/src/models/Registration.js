import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sportItem: { type: mongoose.Schema.Types.ObjectId, ref: 'SportItem', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'PublicUser', required: true },
  type: {
    type: String,
    enum: ['individual', 'team', 'group'],
    required: true,
  },
  teamName: String,
  teamMembers: [{
    name: { type: String, required: true },
    email: String,
    phone: String,
    role: String,
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'waitlisted', 'cancelled'],
    default: 'pending',
  },
  payment: {
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    paidAt: Date,
  },
  notes: String,
}, { timestamps: true });

registrationSchema.index({ event: 1, user: 1 });
registrationSchema.index({ sportItem: 1 });
registrationSchema.index({ 'payment.status': 1 });

export default mongoose.model('Registration', registrationSchema);
