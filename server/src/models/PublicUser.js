import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const publicUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  phone: String,
  googleId: String,
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['male', 'female', 'other'] },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  verified: { type: Boolean, default: false },
}, { timestamps: true });

publicUserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

publicUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('PublicUser', publicUserSchema);
