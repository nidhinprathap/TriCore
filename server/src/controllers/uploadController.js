import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import { processAndSaveImage } from '../services/uploadService.js';
import MediaAsset from '../models/MediaAsset.js';
import config from '../config/env.js';
import { parsePagination } from '../utils/pagination.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.maxFileSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files allowed'), false);
  },
});

export const uploadMiddleware = upload.single('image');

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: { message: 'No file provided' } });
    const imageData = await processAndSaveImage(req.file);
    const asset = await MediaAsset.create({
      ...imageData,
      alt: req.body.alt || '',
      folder: req.body.folder || 'general',
      uploadedBy: req.user._id,
    });
    res.status(201).json(asset);
  } catch (err) { next(err); }
};

export const getAssets = async (req, res, next) => {
  try {
    const { folder } = req.query;
    const { page, limit, skip } = parsePagination(req.query);
    const filter = folder ? { folder } : {};
    const assets = await MediaAsset.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    const total = await MediaAsset.countDocuments(filter);
    res.json({ assets, total, page, pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const deleteAsset = async (req, res, next) => {
  try {
    const asset = await MediaAsset.findByIdAndDelete(req.params.id);
    if (!asset) return res.status(404).json({ error: { message: 'Asset not found' } });
    try { await fs.unlink(path.resolve(config.uploadDir, asset.filename)); } catch {}
    res.json({ message: 'Asset deleted' });
  } catch (err) { next(err); }
};
