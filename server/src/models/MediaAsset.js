import mongoose from 'mongoose';

const mediaAssetSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  url: { type: String, required: true },
  mimeType: String,
  size: Number,
  width: Number,
  height: Number,
  alt: { type: String, default: '' },
  folder: { type: String, default: 'general' },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('MediaAsset', mediaAssetSchema);
